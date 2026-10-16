// Inventory gate for the CLIProxyAPI manual.
// schema checks existing JSONL shape, unique ids, and pinned_commit.
// full adds page ownership, translation, sidebars, secrets, and the v0 curl rule.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FEATURE_FIELDS = [
    "id",
    "kind",
    "title",
    "source",
    "behavior",
    "defaults",
    "canonical_page",
    "legacy_urls",
    "status",
    "pinned_commit",
    "translation_ready",
];

const ISSUE_FIELDS = [
    "number",
    "state",
    "class",
    "feature_ids",
    "experience_id",
    "reason",
    "updated_at",
];

const FEATURE_KINDS = new Set(["config", "route", "cli", "management", "plugin", "mode"]);
const FEATURE_STATUSES = new Set(["missing", "stale", "covered", "deprecated"]);
const ISSUE_STATES = new Set(["open", "closed"]);
const ISSUE_CLASSES = new Set([
    "usage",
    "usage-stale",
    "unverified",
    "defect",
    "request",
    "invalid",
]);

const FEATURE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EXPERIENCE_ID = /^exp\.[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const SK_SECRET = /sk-(?!YOUR_API_KEY\b)[A-Za-z0-9]{20,}/;
const BEARER_SECRET = /Bearer\s+(?!YOUR_API_KEY\b)[A-Za-z0-9._~+/=_-]{20,}/;
function violation(message) {
    throw new Error(message);
}

function relativePosix(root, file) {
    return path.relative(root, file).split(path.sep).join("/");
}

function readText(file) {
    return fs.readFileSync(file, "utf8");
}

function readJSONL(root, repoPath) {
    const file = path.join(root, repoPath);
    if (!fs.existsSync(file)) {
        return null;
    }
    const records = [];
    const lines = readText(file).split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index].trim();
        if (line === "") {
            continue;
        }
        let value;
        try {
            value = JSON.parse(line);
        } catch (error) {
            if (error instanceof SyntaxError) {
                violation(`${repoPath}:${index + 1} is not valid JSON`);
            }
            throw error;
        }
        if (value === null || typeof value !== "object" || Array.isArray(value)) {
            violation(`${repoPath}:${index + 1} must be a JSON object`);
        }
        records.push({ value, line: index + 1 });
    }
    return records;
}

function assertExactFields(record, allowed, label) {
    for (const key of Object.keys(record)) {
        if (!allowed.includes(key)) {
            violation(`${label} has unknown field ${key}`);
        }
    }
    for (const key of allowed) {
        if (!Object.hasOwn(record, key)) {
            violation(`${label} is missing field ${key}`);
        }
    }
}

function assertString(value, label, field, { allowEmpty = false } = {}) {
    if (typeof value !== "string" || (!allowEmpty && value.trim() === "")) {
        violation(`${label} has invalid ${field}`);
    }
}

function isRealDate(value) {
    const match = DATE.exec(value);
    if (!match) {
        return false;
    }
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year
        && date.getUTCMonth() === month - 1
        && date.getUTCDate() === day;
}

function readPIN(root) {
    const file = path.join(root, "inventory", "PIN");
    if (!fs.existsSync(file)) {
        return null;
    }
    const line = readText(file)
        .split(/\r?\n/)
        .map((item) => item.trim())
        .find((item) => item !== "");
    return line ?? "";
}

function loadFeatures(root) {
    const records = readJSONL(root, "inventory/features.jsonl");
    if (records === null) {
        return null;
    }
    const pin = readPIN(root);
    const seen = new Set();
    const features = [];
    for (const { value, line } of records) {
        const label = `inventory/features.jsonl: ${typeof value.id === "string" ? value.id : `line ${line}`}`;
        assertExactFields(value, FEATURE_FIELDS, label);
        assertString(value.id, label, "id");
        if (!FEATURE_ID.test(value.id)) {
            violation(`${label} must be area.subject.leaf`);
        }
        if (seen.has(value.id)) {
            violation(`${label} is duplicated`);
        }
        seen.add(value.id);
        if (typeof value.kind !== "string" || !FEATURE_KINDS.has(value.kind)) {
            violation(`${label} has invalid kind`);
        }
        assertString(value.title, label, "title");
        assertString(value.source, label, "source");
        assertString(value.behavior, label, "behavior");
        assertString(value.defaults, label, "defaults", { allowEmpty: true });
        assertString(value.canonical_page, label, "canonical_page", { allowEmpty: true });
        if (!Array.isArray(value.legacy_urls) || value.legacy_urls.some((item) => typeof item !== "string")) {
            violation(`${label} has invalid legacy_urls`);
        }
        if (typeof value.status !== "string" || !FEATURE_STATUSES.has(value.status)) {
            violation(`${label} has invalid status`);
        }
        assertString(value.pinned_commit, label, "pinned_commit");
        if (pin === null) {
            violation(`${label} pinned_commit does not match inventory/PIN`);
        }
        if (value.pinned_commit !== pin) {
            violation(`${label} pinned_commit does not match inventory/PIN`);
        }
        if (typeof value.translation_ready !== "boolean") {
            violation(`${label} translation_ready must be a boolean`);
        }
        if (value.translation_ready && value.status !== "covered" && value.status !== "deprecated") {
            violation(`${label} translation_ready requires status covered or deprecated`);
        }
        features.push(value);
    }
    return features;
}

function loadIssues(root) {
    const records = readJSONL(root, "inventory/issues.jsonl");
    if (records === null) {
        return null;
    }
    const seen = new Set();
    const issues = [];
    for (const { value, line } of records) {
        const numberLabel = typeof value.number === "number" ? String(value.number) : `line ${line}`;
        const label = `inventory/issues.jsonl: ${numberLabel}`;
        assertExactFields(value, ISSUE_FIELDS, label);
        if (typeof value.number !== "number" || !Number.isInteger(value.number)) {
            violation(`${label} has invalid number`);
        }
        if (seen.has(value.number)) {
            violation(`${label} is duplicated`);
        }
        seen.add(value.number);
        if (typeof value.state !== "string" || !ISSUE_STATES.has(value.state)) {
            violation(`${label} has invalid state`);
        }
        if (typeof value.class !== "string" || !ISSUE_CLASSES.has(value.class)) {
            violation(`${label} has invalid class`);
        }
        if (!Array.isArray(value.feature_ids)) {
            violation(`${label} has invalid feature_ids`);
        }
        for (const id of value.feature_ids) {
            if (typeof id !== "string" || !FEATURE_ID.test(id)) {
                violation(`${label} has invalid feature id ${String(id)}`);
            }
        }
        assertString(value.experience_id, label, "experience_id", { allowEmpty: true });
        if (value.experience_id !== "" && !EXPERIENCE_ID.test(value.experience_id)) {
            violation(`${label} has invalid experience_id ${value.experience_id}`);
        }
        assertString(value.reason, label, "reason");
        if (typeof value.updated_at !== "string" || !isRealDate(value.updated_at)) {
            violation(`${label} has invalid updated_at`);
        }
        issues.push(value);
    }
    return issues;
}

function parseScalar(raw) {
    let value = raw.trim();
    if (
        (value.startsWith("\"") && value.endsWith("\""))
        || (value.startsWith("'") && value.endsWith("'"))
    ) {
        return value.slice(1, -1);
    }
    const comment = value.indexOf(" #");
    if (comment !== -1) {
        value = value.slice(0, comment).trim();
    }
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "null" || value === "~" || value === "") return "";
    if (/^-?\d+$/.test(value)) return Number(value);
    return value;
}

function parseFlowList(raw) {
    const inner = raw.slice(1, -1).trim();
    if (inner === "") return [];
    return inner.split(",").map((item) => parseScalar(item));
}

function isQuoted(value) {
    return (value.startsWith("\"") && value.endsWith("\""))
        || (value.startsWith("'") && value.endsWith("'"));
}

function parseFrontMatter(text) {
    const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);
    if ((lines[0] ?? "").trim() !== "---") {
        return {};
    }
    let end = -1;
    for (let index = 1; index < lines.length; index += 1) {
        if (lines[index].trim() === "---") {
            end = index;
            break;
        }
    }
    if (end === -1) return {};
    const data = {};
    let activeKey = null;
    for (const line of lines.slice(1, end)) {
        if (!line.trim() || /^\s*#/.test(line)) continue;
        const indent = line.match(/^ */)?.[0].length ?? 0;
        const trimmed = line.trim();
        if (indent === 0) {
            const match = trimmed.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
            activeKey = null;
            if (!match) continue;
            const key = match[1];
            const rest = match[2];
            if (rest === "" || rest === "|" || rest === ">" || rest.startsWith("|") || rest.startsWith(">")) {
                data[key] = null;
                activeKey = key;
            } else if (rest === "[]") {
                data[key] = [];
            } else if (rest.startsWith("[") && rest.endsWith("]")) {
                data[key] = parseFlowList(rest);
            } else {
                data[key] = parseScalar(rest);
            }
            continue;
        }
        if (!activeKey) continue;
        if (trimmed.startsWith("- ")) {
            if (!Array.isArray(data[activeKey])) data[activeKey] = [];
            const item = trimmed.slice(2).trim();
            if (item.includes(":") && !isQuoted(item)) {
                data[activeKey].push({ nested: true });
            } else {
                data[activeKey].push(parseScalar(item));
            }
            continue;
        }
        if (!Array.isArray(data[activeKey])) {
            data[activeKey] = { nested: true };
            activeKey = null;
        }
    }
    return data;
}

function stringList(value) {
    if (Array.isArray(value)) {
        return value
            .filter((item) => typeof item === "string" || typeof item === "number")
            .map((item) => String(item).trim())
            .filter((item) => item !== "");
    }
    if (typeof value === "string" && value.trim() !== "") return [value.trim()];
    return [];
}

function sameStrings(left, right) {
    return left.length === right.length && left.every((item, index) => item === right[index]);
}

function isTrue(value) {
    return value === true || value === "true";
}

function walkMarkdown(dir) {
    if (!fs.existsSync(dir)) return [];
    const files = [];
    const stack = [dir];
    while (stack.length > 0) {
        const current = stack.pop();
        const entries = fs.readdirSync(current, { withFileTypes: true })
            .sort((left, right) => left.name.localeCompare(right.name));
        for (const entry of entries) {
            if (entry.name === "node_modules" || entry.name === ".vitepress" || entry.name === ".git") {
                continue;
            }
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) {
                stack.push(full);
            } else if (entry.isFile() && entry.name.endsWith(".md")) {
                files.push(full);
            }
        }
    }
    files.sort((left, right) => left.localeCompare(right));
    return files;
}

function loadPages(root) {
    const pages = [];
    for (const file of walkMarkdown(path.join(root, "docs"))) {
        const repoPath = relativePosix(root, file);
        const match = repoPath.match(/^docs\/(cn|en|ru)\/(.+)$/);
        if (!match) continue;
        pages.push({
            repoPath,
            locale: match[1],
            localePath: match[2],
            front: parseFrontMatter(readText(file)),
        });
    }
    return pages;
}

function isExperiencePath(localePath) {
    return localePath.startsWith("experience/");
}

function isHandsOnPath(localePath) {
    return localePath.startsWith("hands-on/");
}

function isFeaturePage(page) {
    return page.locale === "cn"
        && !isTrue(page.front.stub)
        && !isExperiencePath(page.localePath)
        && !isHandsOnPath(page.localePath);
}

function sourceIssueNumbers(value, repoPath) {
    if (value == null) return [];
    const raw = Array.isArray(value) ? value : [value];
    const numbers = [];
    for (const item of raw) {
        if (item && typeof item === "object") continue;
        if (typeof item === "number" && Number.isInteger(item)) {
            numbers.push(item);
            continue;
        }
        if (typeof item === "string" && /^\d+$/.test(item.trim())) {
            numbers.push(Number(item.trim()));
            continue;
        }
        violation(`${repoPath} has an invalid source issue`);
    }
    return numbers;
}

function normalizeCanonical(value) {
    return value.replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/+$/, "");
}

function checkPages(root, features, issues) {
    const featureById = new Map(features.map((feature) => [feature.id, feature]));
    const issueByNumber = new Map(issues.map((issue) => [issue.number, issue]));
    for (const issue of issues) {
        for (const id of issue.feature_ids) {
            if (!featureById.has(id)) {
                violation(`inventory/issues.jsonl: ${issue.number} references unknown feature id ${id}`);
            }
        }
    }

    const pages = loadPages(root);
    const pageByPath = new Map(pages.map((page) => [page.repoPath, page]));
    const owners = new Map(features.map((feature) => [feature.id, []]));

    for (const page of pages) {
        const ids = stringList(page.front.feature_ids);
        for (const id of ids) {
            if (!featureById.has(id)) {
                violation(`${page.repoPath} references unknown feature id ${id}`);
            }
        }
        if ((isExperiencePath(page.localePath) || isHandsOnPath(page.localePath)) && ids.length > 0) {
            violation(`${page.repoPath} must not use feature_ids for ${ids[0]}`);
        }
        if (isFeaturePage(page)) {
            for (const id of ids) {
                const found = owners.get(id);
                if (!found.includes(page)) found.push(page);
            }
        }

        if (Object.hasOwn(page.front, "related_feature_ids")) {
            const related = stringList(page.front.related_feature_ids);
            if (!isExperiencePath(page.localePath)) {
                violation(`${page.repoPath} related_feature_ids is only allowed under experience/`);
            }
            for (const id of related) {
                const feature = featureById.get(id);
                if (!feature) {
                    violation(`${page.repoPath} related_feature_ids references unknown feature id ${id}`);
                }
                if (feature.status !== "covered") {
                    violation(`${page.repoPath} related_feature_ids ${id} must be covered`);
                }
            }
        }

        if (isExperiencePath(page.localePath)) {
            const experienceId = typeof page.front.experience_id === "string" ? page.front.experience_id : "";
            for (const number of sourceIssueNumbers(page.front.source_issues, page.repoPath)) {
                const issue = issueByNumber.get(number);
                if (!issue) {
                    violation(`${page.repoPath} source issue ${number} is not in inventory/issues.jsonl`);
                }
                if (experienceId !== "" && issue.experience_id !== experienceId) {
                    violation(`${page.repoPath} source issue ${number} does not point at ${experienceId}`);
                }
            }
        }
    }

    for (const feature of features) {
        if (feature.status === "missing" || feature.status === "stale") continue;
        const found = owners.get(feature.id) ?? [];
        if (found.length !== 1) {
            violation(`${feature.id} must appear on exactly one Chinese feature page`);
        }
        const owner = found[0];
        if (feature.canonical_page.trim() === "") {
            violation(`${feature.id} canonical_page must point at its Chinese feature page`);
        }
        const canonical = normalizeCanonical(feature.canonical_page);
        if (canonical !== owner.repoPath) {
            violation(`${feature.id} canonical_page does not match ${owner.repoPath}`);
        }
        if (feature.translation_ready !== true) continue;
        const ownerIds = stringList(owner.front.feature_ids);
        for (const locale of ["en", "ru"]) {
            const repoPath = `docs/${locale}/${owner.localePath}`;
            const translated = pageByPath.get(repoPath);
            if (!translated) {
                violation(`${feature.id} is missing translated page ${repoPath}`);
            }
            if (!sameStrings(ownerIds, stringList(translated.front.feature_ids))) {
                violation(`${feature.id} feature_ids differ on ${repoPath}`);
            }
            if (isTrue(translated.front.translation_pending)) {
                violation(`${feature.id} ${repoPath} must not set translation_pending: true`);
            }
        }
    }
}

function findKeyIndex(source, key, from = 0) {
    let quote = null;
    for (let index = from; index < source.length; index += 1) {
        const ch = source[index];
        if (quote) {
            if (ch === "\\") {
                index += 1;
                continue;
            }
            if (ch === quote) quote = null;
            continue;
        }
        if (ch === "/" && source[index + 1] === "/") {
            const newline = source.indexOf("\n", index);
            index = newline === -1 ? source.length : newline;
            continue;
        }
        if (ch === "/" && source[index + 1] === "*") {
            const end = source.indexOf("*/", index + 2);
            index = end === -1 ? source.length : end + 1;
            continue;
        }
        if (ch === "'" || ch === "\"" || ch === "`") {
            quote = ch;
            continue;
        }
        if (!source.startsWith(key, index)) continue;
        const previous = index === 0 ? "" : source[index - 1];
        if (previous && /[A-Za-z0-9_$]/.test(previous)) continue;
        if (/^\s*:/.test(source.slice(index + key.length))) return index;
    }
    return -1;
}

function sliceBalanced(source, openIndex, openChar, closeChar, label) {
    let depth = 0;
    let quote = null;
    for (let index = openIndex; index < source.length; index += 1) {
        const ch = source[index];
        if (quote) {
            if (ch === "\\") {
                index += 1;
                continue;
            }
            if (ch === quote) quote = null;
            continue;
        }
        if (ch === "/" && source[index + 1] === "/") {
            const newline = source.indexOf("\n", index);
            index = newline === -1 ? source.length : newline;
            continue;
        }
        if (ch === "/" && source[index + 1] === "*") {
            const end = source.indexOf("*/", index + 2);
            index = end === -1 ? source.length : end + 1;
            continue;
        }
        if (ch === "'" || ch === "\"" || ch === "`") {
            quote = ch;
            continue;
        }
        if (ch === openChar) depth += 1;
        if (ch === closeChar) {
            depth -= 1;
            if (depth === 0) return source.slice(openIndex, index + 1);
        }
    }
    violation(`${label} has unbalanced ${openChar}${closeChar}`);
}

function findOpener(source, keyIndex, opener) {
    const colon = source.indexOf(":", keyIndex);
    for (let index = colon + 1; index < source.length; index += 1) {
        const ch = source[index];
        if (ch === "/" && source[index + 1] === "/") {
            const newline = source.indexOf("\n", index);
            index = newline === -1 ? source.length : newline;
            continue;
        }
        if (/\s/.test(ch)) continue;
        if (ch === opener) return index;
        return -1;
    }
    return -1;
}

function stripComments(source) {
    let quote = null;
    let out = "";
    for (let index = 0; index < source.length; index += 1) {
        const ch = source[index];
        if (quote) {
            out += ch;
            if (ch === "\\") {
                out += source[index + 1] ?? "";
                index += 1;
                continue;
            }
            if (ch === quote) quote = null;
            continue;
        }
        if (ch === "/" && source[index + 1] === "/") {
            const newline = source.indexOf("\n", index);
            if (newline === -1) break;
            index = newline;
            out += "\n";
            continue;
        }
        if (ch === "/" && source[index + 1] === "*") {
            const end = source.indexOf("*/", index + 2);
            index = end === -1 ? source.length : end + 1;
            continue;
        }
        if (ch === "'" || ch === "\"" || ch === "`") quote = ch;
        out += ch;
    }
    return out;
}

function sidebarLinks(source, label) {
    const keyIndex = findKeyIndex(source, "sidebar");
    if (keyIndex < 0) violation(`${label} has no sidebar`);
    const openIndex = findOpener(source, keyIndex, "[");
    if (openIndex < 0) violation(`${label} has no sidebar`);
    const block = stripComments(sliceBalanced(source, openIndex, "[", "]", label));
    const links = [];
    const pattern = /\blink\s*:\s*(['"`])([\s\S]*?)\1/g;
    for (const match of block.matchAll(pattern)) {
        links.push(match[2]);
    }
    return links;
}

function normalizeSidebarLink(link) {
    const trimmed = link.trim();
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;
    let value = trimmed.split("#")[0].split("?")[0].replace(/\\/g, "/");
    value = value.replace(/^\/?(?:cn|en|ru)(?=\/|$)/, "");
    if (value.length > 1 && value.endsWith("/")) value = value.slice(0, -1);
    if (value === "" || value === "/") return "/";
    if (!value.startsWith("/")) value = `/${value}`;
    return value;
}

function linkSet(links) {
    return new Set(links.map(normalizeSidebarLink));
}

function formatSetDiff(label, leftName, leftSet, rightName, rightSet) {
    const onlyLeft = [...leftSet].filter((item) => !rightSet.has(item)).sort();
    const onlyRight = [...rightSet].filter((item) => !leftSet.has(item)).sort();
    const sample = [
        onlyLeft.length > 0 ? `${leftName} only ${onlyLeft[0]}` : "",
        onlyRight.length > 0 ? `${rightName} only ${onlyRight[0]}` : "",
    ].filter(Boolean).join("; ");
    violation(`${label} sidebar link sets differ (${sample})`);
}

function checkSidebars(root) {
    const vitepressPath = "docs/.vitepress/config.mts";
    const chinesePath = "docs/cn/config.ts";
    const vitepressFile = path.join(root, vitepressPath);
    const chineseFile = path.join(root, chinesePath);
    if (!fs.existsSync(vitepressFile)) violation(`${vitepressPath} is missing`);
    if (!fs.existsSync(chineseFile)) violation(`${chinesePath} is missing`);
    const vitepress = readText(vitepressFile);
    const localesAt = findKeyIndex(vitepress, "locales");
    const englishSource = localesAt < 0 ? vitepress : vitepress.slice(0, localesAt);
    const localeSource = localesAt < 0 ? "" : vitepress.slice(localesAt);
    const russianAt = findKeyIndex(localeSource, "ru");
    if (russianAt < 0) violation(`${vitepressPath} has no Russian sidebar`);
    const russianOpen = findOpener(localeSource, russianAt, "{");
    if (russianOpen < 0) violation(`${vitepressPath} has no Russian sidebar`);
    const russianSource = sliceBalanced(localeSource, russianOpen, "{", "}", vitepressPath);
    const english = linkSet(sidebarLinks(englishSource, vitepressPath));
    const russian = linkSet(sidebarLinks(russianSource, vitepressPath));
    const chinese = linkSet(sidebarLinks(readText(chineseFile), chinesePath));
    if (english.size !== russian.size || [...english].some((item) => !russian.has(item))) {
        formatSetDiff(vitepressPath, "en", english, "ru", russian);
    }
    if (english.size !== chinese.size || [...english].some((item) => !chinese.has(item))) {
        formatSetDiff(`${vitepressPath} vs ${chinesePath}`, "en", english, "cn", chinese);
    }
}

function checkSecrets(root) {
    for (const file of walkMarkdown(path.join(root, "docs"))) {
        const repoPath = relativePosix(root, file);
        const text = readText(file);
        if (SK_SECRET.test(text) || BEARER_SECRET.test(text)) {
            violation(`${repoPath} contains a secret-shaped token`);
        }
    }
}

function checkDeprecatedCurl(root, features) {
    const feature = features.find((item) => item.id === "management.v0.deprecated");
    if (!feature || feature.status !== "deprecated") return;
    const repoPath = "docs/cn/management/api.md";
    const file = path.join(root, repoPath);
    if (!fs.existsSync(file)) return;
    if (readText(file).includes("curl")) {
        violation(`${repoPath} contains curl while management.v0.deprecated is deprecated`);
    }
}

export async function checkInventory(dir, mode) {
    if (mode !== "schema" && mode !== "full") {
        violation(`unknown inventory check mode ${mode}`);
    }
    const root = path.resolve(dir);
    const features = loadFeatures(root);
    const issues = loadIssues(root);
    if (mode === "schema") return;
    const featureRecords = features ?? [];
    const issueRecords = issues ?? [];
    checkPages(root, featureRecords, issueRecords);
    checkSidebars(root);
    checkSecrets(root);
    checkDeprecatedCurl(root, featureRecords);
}

function runningAsCli() {
    const entry = process.argv[1];
    if (!entry) return false;
    return path.resolve(entry) === fileURLToPath(import.meta.url);
}

if (runningAsCli()) {
    const mode = process.argv.includes("--schema") ? "schema" : "full";
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
    checkInventory(root, mode).then(
        () => {},
        (error) => {
            console.error(error instanceof Error ? error.message : String(error));
            process.exitCode = 1;
        },
    );
}
