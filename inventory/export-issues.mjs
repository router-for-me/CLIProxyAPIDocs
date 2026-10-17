// Export CLIProxyAPI issues and comments into the gitignored raw ledger.
// Pull requests returned by the issues API are discarded.

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const REPO = "repos/router-for-me/CLIProxyAPI";
const LIST_ENDPOINT = `${REPO}/issues?state=all&per_page=100`;
const CONCURRENCY = 4;
const MIN_ISSUES = 3000;
const MIN_PULL_REQUESTS = 1000;

const inventoryDir = import.meta.dirname;
const rawDir = path.join(inventoryDir, "raw");
const listCachePath = path.join(rawDir, "issue-list.jsonl");
const partialPath = path.join(rawDir, "issues.jsonl.partial");
const finalPath = path.join(rawDir, "issues.jsonl");
const scanPath = path.join(inventoryDir, "ISSUE_SCAN");

let gate = Promise.resolve();

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function hold(ms) {
    const until = Date.now() + ms;
    gate = gate.then(async () => {
        const remaining = until - Date.now();
        if (remaining > 0) {
            await sleep(remaining);
        }
    });
    return gate;
}

async function waitTurn() {
    await gate;
}

function runGh(args, timeoutMs) {
    return new Promise((resolve, reject) => {
        const child = spawn("gh", args, {
            env: { ...process.env, GH_PAGER: "cat", NO_COLOR: "1" },
        });
        const stdout = [];
        const stderr = [];
        let settled = false;
        const timer = setTimeout(() => {
            child.kill("SIGKILL");
        }, timeoutMs);
        child.stdout.on("data", (chunk) => {
            stdout.push(chunk);
        });
        child.stderr.on("data", (chunk) => {
            stderr.push(chunk);
        });
        child.on("error", (error) => {
            if (settled) {
                return;
            }
            settled = true;
            clearTimeout(timer);
            reject(error);
        });
        child.on("close", (code, signal) => {
            if (settled) {
                return;
            }
            settled = true;
            clearTimeout(timer);
            const errorText = Buffer.concat(stderr).toString("utf8");
            resolve({
                code: code ?? 1,
                signal,
                stdout: Buffer.concat(stdout).toString("utf8"),
                stderr: signal ? `${errorText}\ntimed out (${signal})` : errorText,
            });
        });
    });
}

function isRateLimited(stderr) {
    return /rate limit/i.test(stderr)
        || /secondary rate/i.test(stderr)
        || /abuse detection/i.test(stderr)
        || /\bHTTP 429\b/.test(stderr);
}

function isRetryable(result) {
    if (result.signal) {
        return true;
    }
    if (isRateLimited(result.stderr)) {
        return true;
    }
    return /\bHTTP 5\d\d\b/.test(result.stderr) || /network|ECONNRESET|ETIMEDOUT|ENOTFOUND/i.test(result.stderr);
}

async function readCoreLimit() {
    const result = await runGh(["api", "rate_limit"], 30000);
    if (result.code !== 0) {
        return null;
    }
    try {
        return JSON.parse(result.stdout).resources?.core ?? null;
    } catch {
        return null;
    }
}

async function delayForRateLimit(stderr, attempt) {
    const retryAfter = stderr.match(/retry[- ]after:?\s*(\d+)/i);
    if (retryAfter) {
        return Number(retryAfter[1]) * 1000 + 1000;
    }
    const core = await readCoreLimit();
    if (core && core.remaining <= 2) {
        return Math.max(5000, core.reset * 1000 - Date.now() + 1500);
    }
    return Math.min(120000, 15000 * attempt);
}

async function ghApi(args, timeoutMs) {
    let attempt = 0;
    while (true) {
        await waitTurn();
        const result = await runGh(["api", ...args], timeoutMs);
        if (result.code === 0) {
            return result.stdout;
        }
        attempt += 1;
        if (!isRetryable(result) || attempt > 6) {
            const detail = result.stderr.trim() || result.stdout.trim() || `exit ${result.code}`;
            throw new Error(`gh api ${args.join(" ")} failed: ${detail}`);
        }
        const waitMs = await delayForRateLimit(result.stderr, attempt);
        console.error(`GitHub request limited, waiting ${Math.ceil(waitMs / 1000)}s`);
        await hold(waitMs);
    }
}

function scanJSONValue(text, start) {
    const opening = text[start];
    if (opening !== "{" && opening !== "[") {
        throw new Error(`unexpected JSON at offset ${start}`);
    }
    const stack = [opening];
    let inString = false;
    let escaped = false;
    for (let index = start + 1; index < text.length; index += 1) {
        const char = text[index];
        if (inString) {
            if (escaped) {
                escaped = false;
            } else if (char === "\\") {
                escaped = true;
            } else if (char === "\"") {
                inString = false;
            }
            continue;
        }
        if (char === "\"") {
            inString = true;
            continue;
        }
        if (char === "{" || char === "[") {
            stack.push(char);
            continue;
        }
        if (char === "}" || char === "]") {
            const expected = stack[stack.length - 1] === "{" ? "}" : "]";
            if (char !== expected) {
                throw new Error(`mismatched JSON at offset ${index}`);
            }
            stack.pop();
            if (stack.length === 0) {
                return index + 1;
            }
        }
    }
    throw new Error("unterminated JSON value");
}

function parseJSONSequence(text) {
    const values = [];
    let index = 0;
    while (index < text.length) {
        while (index < text.length && /\s/.test(text[index])) {
            index += 1;
        }
        if (index >= text.length) {
            break;
        }
        const end = scanJSONValue(text, index);
        try {
            values.push(JSON.parse(text.slice(index, end)));
        } catch (error) {
            const snippet = text.slice(index, Math.min(end, index + 120));
            throw new Error(`invalid JSON page near ${snippet}: ${error.message}`);
        }
        index = end;
    }
    return values;
}

function normalizeIssue(issue) {
    if (!Number.isInteger(issue.number) || issue.number <= 0) {
        throw new Error("GitHub issue is missing a number");
    }
    const labels = [];
    if (Array.isArray(issue.labels)) {
        for (const label of issue.labels) {
            if (typeof label === "string") {
                labels.push(label);
            } else if (label && typeof label.name === "string") {
                labels.push(label.name);
            }
        }
    }
    let state = "";
    if (issue.state === "open" || issue.state === "closed") {
        state = issue.state;
    } else if (typeof issue.state === "string") {
        state = issue.state;
    }
    return {
        number: issue.number,
        state,
        title: typeof issue.title === "string" ? issue.title : "",
        body: typeof issue.body === "string" ? issue.body : "",
        user: issue.user && typeof issue.user.login === "string" ? issue.user.login : "",
        labels,
        created_at: typeof issue.created_at === "string" ? issue.created_at : "",
        updated_at: typeof issue.updated_at === "string" ? issue.updated_at : "",
        closed_at: typeof issue.closed_at === "string" ? issue.closed_at : "",
        html_url: typeof issue.html_url === "string" ? issue.html_url : "",
        comments_count: Number.isInteger(issue.comments) ? issue.comments : 0,
    };
}

function normalizeComment(comment) {
    return {
        id: comment.id ?? null,
        user: comment.user && typeof comment.user.login === "string" ? comment.user.login : "",
        body: typeof comment.body === "string" ? comment.body : "",
        created_at: typeof comment.created_at === "string" ? comment.created_at : "",
        updated_at: typeof comment.updated_at === "string" ? comment.updated_at : "",
    };
}

function readJSONL(file) {
    if (!fs.existsSync(file)) {
        return [];
    }
    const rows = [];
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index].trim();
        if (line === "") {
            continue;
        }
        try {
            rows.push(JSON.parse(line));
        } catch (error) {
            throw new Error(`${file}:${index + 1} is not valid JSON`);
        }
    }
    return rows;
}

function localISODate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

async function mapPool(items, limit, worker) {
    let next = 0;
    async function run() {
        while (true) {
            const index = next;
            next += 1;
            if (index >= items.length) {
                return;
            }
            await worker(items[index], index);
        }
    }
    const runners = [];
    for (let index = 0; index < Math.min(limit, items.length); index += 1) {
        runners.push(run());
    }
    await Promise.all(runners);
}

async function loadIssues() {
    if (fs.existsSync(listCachePath) && !fs.existsSync(scanPath)) {
        const cached = readJSONL(listCachePath);
        console.error(`resuming from cached issue list (${cached.length})`);
        return cached;
    }
    for (const file of [listCachePath, partialPath, finalPath]) {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    }
    console.error(`fetching ${LIST_ENDPOINT}`);
    const text = await ghApi(["--paginate", LIST_ENDPOINT], 600000);
    const pages = parseJSONSequence(text);
    const items = [];
    for (const page of pages) {
        if (!Array.isArray(page)) {
            throw new Error("issues page was not a JSON array");
        }
        items.push(...page);
    }
    let skipped = 0;
    const issues = [];
    const seen = new Set();
    for (const item of items) {
        if (Object.hasOwn(item, "pull_request")) {
            skipped += 1;
            continue;
        }
        const issue = normalizeIssue(item);
        if (seen.has(issue.number)) {
            throw new Error(`duplicate issue number ${issue.number}`);
        }
        seen.add(issue.number);
        issues.push(issue);
    }
    issues.sort((left, right) => left.number - right.number);
    console.error(`pages=${pages.length} items=${items.length} issues=${issues.length} pull_requests=${skipped}`);
    if (issues.length < MIN_ISSUES) {
        throw new Error(`refusing an unexpectedly small issue export: ${issues.length}`);
    }
    if (skipped < MIN_PULL_REQUESTS) {
        throw new Error(`refusing to continue because only ${skipped} pull requests were discarded`);
    }
    fs.writeFileSync(listCachePath, `${issues.map((issue) => JSON.stringify(issue)).join("\n")}\n`);
    return issues;
}

let writeQueue = Promise.resolve();

function appendPartial(line) {
    writeQueue = writeQueue.then(() => fs.promises.appendFile(partialPath, line, "utf8"));
    return writeQueue;
}

async function fetchComments(number) {
    const endpoint = `${REPO}/issues/${number}/comments?per_page=100`;
    const text = await ghApi(["--paginate", endpoint], 120000);
    const pages = parseJSONSequence(text);
    const comments = [];
    for (const page of pages) {
        if (!Array.isArray(page)) {
            throw new Error(`comments for #${number} were not a JSON array`);
        }
        for (const comment of page) {
            comments.push(normalizeComment(comment));
        }
    }
    return comments;
}

function writeScan(issues) {
    let maxNumber = 0;
    for (const issue of issues) {
        if (issue.number > maxNumber) {
            maxNumber = issue.number;
        }
    }
    const body = [
        `scan_date: ${localISODate()}`,
        `issue_count: ${issues.length}`,
        `max_number: ${maxNumber}`,
        "",
    ].join("\n");
    const temporary = `${scanPath}.tmp`;
    fs.writeFileSync(temporary, body);
    fs.renameSync(temporary, scanPath);
    return { issueCount: issues.length, maxNumber };
}

function finalize(issues) {
    const rows = readJSONL(partialPath);
    const expected = new Set(issues.map((issue) => issue.number));
    const seen = new Set();
    for (const row of rows) {
        if (!expected.has(row.number) || seen.has(row.number)) {
            throw new Error(`unexpected raw row ${row.number}`);
        }
        seen.add(row.number);
        if (!Array.isArray(row.comments)) {
            throw new Error(`issue #${row.number} is missing comments`);
        }
    }
    if (seen.size !== expected.size) {
        throw new Error(`raw export has ${seen.size} issues, expected ${expected.size}`);
    }
    rows.sort((left, right) => left.number - right.number);
    const temporary = `${finalPath}.tmp`;
    fs.writeFileSync(temporary, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`);
    fs.renameSync(temporary, finalPath);
    const scan = writeScan(issues);
    fs.unlinkSync(partialPath);
    fs.unlinkSync(listCachePath);
    return scan;
}

async function main() {
    fs.mkdirSync(rawDir, { recursive: true });
    const core = await readCoreLimit();
    if (core) {
        console.error(`core remaining ${core.remaining} reset ${core.reset}`);
        if (core.remaining < 100) {
            const waitMs = Math.max(5000, core.reset * 1000 - Date.now() + 1500);
            console.error(`waiting ${Math.ceil(waitMs / 1000)}s for core rate limit reset`);
            await hold(waitMs);
        }
    }
    const issues = await loadIssues();
    const done = new Set(readJSONL(partialPath).map((row) => row.number));
    const pending = issues.filter((issue) => !done.has(issue.number));
    console.error(`comments pending ${pending.length} of ${issues.length}`);
    let finished = done.size;
    const failures = [];
    await mapPool(pending, CONCURRENCY, async (issue) => {
        if (failures.length > 0) {
            return;
        }
        try {
            const comments = await fetchComments(issue.number);
            await appendPartial(`${JSON.stringify({ ...issue, comments })}\n`);
            finished += 1;
            if (finished % 50 === 0 || finished === issues.length) {
                console.error(`comments ${finished}/${issues.length}`);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error(`issue #${issue.number} failed: ${message}`);
            failures.push(error);
        }
    });
    if (failures.length > 0) {
        throw failures[0];
    }
    const scan = finalize(issues);
    console.log(`EXPORT_OK issue_count=${scan.issueCount} max_number=${scan.maxNumber}`);
}

main().catch((error) => {
    console.error(error instanceof Error ? error.stack : error);
    process.exitCode = 1;
});
