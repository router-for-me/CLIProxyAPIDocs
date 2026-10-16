// Extract FeatureRecord entries from a CLIProxyAPI source tree.
// The scan set is fixed: public config leaves, startup routes, server flags,
// plugin interfaces, auth provider directories, and three fixed mode records.

import fs from "node:fs";
import path from "node:path";

const FEATURE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*){2}$/;

const SCALAR_TYPES = new Set([
    "string",
    "bool",
    "int",
    "int8",
    "int16",
    "int32",
    "int64",
    "uint",
    "uint8",
    "uint16",
    "uint32",
    "uint64",
    "uintptr",
    "float32",
    "float64",
    "complex64",
    "complex128",
    "byte",
    "rune",
    "error",
    "any",
    "time.Duration",
    "time.Time",
    "json.RawMessage",
]);

const NUMERIC_TYPES = new Set([
    "int",
    "int8",
    "int16",
    "int32",
    "int64",
    "uint",
    "uint8",
    "uint16",
    "uint32",
    "uint64",
    "uintptr",
    "byte",
    "rune",
    "float32",
    "float64",
    "complex64",
    "complex128",
]);

const ROUTE_FILES = [
    "internal/api/server_routes.go",
    "internal/api/server_keepalive.go",
    "internal/api/server_management_v8.go",
];

const HTTP_CONSTANTS = {
    "http.MethodGet": "GET",
    "http.MethodPost": "POST",
    "http.MethodPut": "PUT",
    "http.MethodPatch": "PATCH",
    "http.MethodDelete": "DELETE",
    "http.MethodHead": "HEAD",
    "http.MethodOptions": "OPTIONS",
    "http.MethodConnect": "CONNECT",
    "http.MethodTrace": "TRACE",
};

const FLAG_VAR_METHODS = new Set([
    "BoolVar",
    "IntVar",
    "Int64Var",
    "UintVar",
    "Uint64Var",
    "StringVar",
    "Float64Var",
    "DurationVar",
]);

const FLAG_VALUE_METHODS = new Set([
    "Bool",
    "Int",
    "Int64",
    "Uint",
    "Uint64",
    "String",
    "Float64",
    "Duration",
]);

const GIN_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "Any", "Handle"];

function blankRecord(partial) {
    return {
        id: partial.id,
        kind: partial.kind,
        title: partial.title,
        source: partial.source,
        behavior: partial.behavior,
        defaults: partial.defaults,
        canonical_page: "",
        legacy_urls: [],
        status: "missing",
        pinned_commit: partial.pinned_commit ?? "",
        translation_ready: false,
    };
}

function readText(file) {
    return fs.readFileSync(file, "utf8");
}

function exists(file) {
    return fs.existsSync(file);
}

function relativePosix(root, file) {
    return path.relative(root, file).split(path.sep).join("/");
}

function listGoFiles(directory) {
    if (!exists(directory)) {
        return [];
    }
    return fs.readdirSync(directory)
        .filter((name) => name.endsWith(".go") && !name.endsWith("_test.go"))
        .sort()
        .map((name) => path.join(directory, name));
}

function readPIN(root) {
    const file = path.join(root, "inventory", "PIN");
    if (!exists(file)) {
        return "";
    }
    const line = readText(file)
        .split(/\r?\n/)
        .map((item) => item.trim())
        .find((item) => item !== "");
    return line ?? "";
}

function modulePathOf(root) {
    const file = path.join(root, "go.mod");
    if (!exists(file)) {
        return "";
    }
    const match = /^module\s+(\S+)/m.exec(readText(file));
    return match ? match[1] : "";
}

function normalizeSegment(value) {
    let text = String(value ?? "").trim().toLowerCase();
    if (text.startsWith(":") || text.startsWith("*")) {
        text = text.slice(1);
    }
    text = text.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return text;
}

function featureIDFromSegments(segments) {
    const parts = [];
    for (const segment of segments) {
        const normalized = normalizeSegment(segment);
        if (normalized !== "") {
            parts.push(normalized);
        }
    }
    while (parts.length < 2) {
        parts.push("value");
    }
    if (parts.length === 2) {
        return `${parts[0]}.${parts[1]}.value`;
    }
    return `${parts[0]}.${parts[1]}.${parts.slice(2).join("-")}`;
}

function kebabIdentifier(name) {
    return name
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function interfaceSegment(name) {
    return kebabIdentifier(name).replaceAll("web-socket", "websocket");
}

function collapseWhitespace(value) {
    return String(value ?? "").replace(/\s+/g, " ").trim();
}

function explicitDefault(comment) {
    const flat = collapseWhitespace(comment);
    if (flat === "" || !/default/i.test(flat)) {
        return "";
    }
    const sentences = flat.split(/(?<=[.])\s+/);
    const found = sentences.find((sentence) => /default/i.test(sentence));
    return (found ?? flat).trim();
}

function maskComments(source) {
    let out = "";
    let index = 0;
    while (index < source.length) {
        const ch = source[index];
        const next = source[index + 1];
        if (ch === "/" && next === "/") {
            while (index < source.length && source[index] !== "\n") {
                out += " ";
                index += 1;
            }
            continue;
        }
        if (ch === "/" && next === "*") {
            out += "  ";
            index += 2;
            while (index < source.length && !(source[index] === "*" && source[index + 1] === "/")) {
                out += source[index] === "\n" ? "\n" : " ";
                index += 1;
            }
            if (index < source.length) {
                out += "  ";
                index += 2;
            }
            continue;
        }
        if (ch === "`") {
            const start = index;
            index += 1;
            while (index < source.length && source[index] !== "`") {
                index += 1;
            }
            if (index < source.length) {
                index += 1;
            }
            out += source.slice(start, index);
            continue;
        }
        if (ch === "\"" || ch === "'") {
            const quote = ch;
            out += source[index];
            index += 1;
            while (index < source.length) {
                out += source[index];
                if (source[index] === "\\") {
                    index += 1;
                    if (index < source.length) {
                        out += source[index];
                        index += 1;
                    }
                    continue;
                }
                if (source[index] === quote) {
                    index += 1;
                    break;
                }
                index += 1;
            }
            continue;
        }
        out += ch;
        index += 1;
    }
    return out;
}

function decodeGoString(literal) {
    const body = literal.slice(1, -1);
    if (literal.startsWith("`")) {
        return body;
    }
    return body.replace(/\\([\\"'nrt]|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2})/g, (_, token) => {
        if (token === "n") {
            return "\n";
        }
        if (token === "r") {
            return "\r";
        }
        if (token === "t") {
            return "\t";
        }
        if (token === "\\" || token === "\"" || token === "'") {
            return token;
        }
        if (token.startsWith("u") || token.startsWith("x")) {
            return String.fromCharCode(Number.parseInt(token.slice(1), 16));
        }
        return token;
    });
}

function splitTopLevel(text, separator) {
    const parts = [];
    let current = "";
    let depth = 0;
    let index = 0;
    while (index < text.length) {
        const ch = text[index];
        if (ch === "\"" || ch === "`" || ch === "'") {
            const quote = ch;
            current += text[index];
            index += 1;
            while (index < text.length) {
                current += text[index];
                if (text[index] === "\\") {
                    index += 1;
                    if (index < text.length) {
                        current += text[index];
                        index += 1;
                    }
                    continue;
                }
                if (text[index] === quote) {
                    index += 1;
                    break;
                }
                index += 1;
            }
            continue;
        }
        if (ch === "(" || ch === "[" || ch === "{") {
            depth += 1;
            current += ch;
            index += 1;
            continue;
        }
        if (ch === ")" || ch === "]" || ch === "}") {
            depth -= 1;
            current += ch;
            index += 1;
            continue;
        }
        if (ch === separator && depth === 0) {
            parts.push(current.trim());
            current = "";
            index += 1;
            continue;
        }
        current += ch;
        index += 1;
    }
    if (current.trim() !== "") {
        parts.push(current.trim());
    }
    return parts;
}

function readBalanced(source, openIndex, openChar, closeChar) {
    let depth = 0;
    let index = openIndex;
    while (index < source.length) {
        const ch = source[index];
        if (ch === "\"" || ch === "`" || ch === "'") {
            const quote = ch;
            index += 1;
            while (index < source.length) {
                if (source[index] === "\\") {
                    index += 2;
                    continue;
                }
                if (source[index] === quote) {
                    index += 1;
                    break;
                }
                index += 1;
            }
            continue;
        }
        if (ch === openChar) {
            depth += 1;
        } else if (ch === closeChar) {
            depth -= 1;
            if (depth === 0) {
                return { body: source.slice(openIndex + 1, index), end: index + 1 };
            }
        }
        index += 1;
    }
    return null;
}

function parseImports(source) {
    const imports = new Map();
    const masked = maskComments(source);
    const add = (local, importPath) => {
        const name = local || importPath.split("/").pop();
        if (name) {
            imports.set(name, importPath);
        }
    };
    const block = /import\s*\(([\s\S]*?)\)/g;
    let match = block.exec(masked);
    while (match) {
        const spec = /(?:([A-Za-z_][A-Za-z0-9_]*)\s+)?\"([^"]+)\"/g;
        let item = spec.exec(match[1]);
        while (item) {
            add(item[1], item[2]);
            item = spec.exec(match[1]);
        }
        match = block.exec(masked);
    }
    const single = /import\s+(?:([A-Za-z_][A-Za-z0-9_]*)\s+)?\"([^"]+)\"/g;
    match = single.exec(masked);
    while (match) {
        add(match[1], match[2]);
        match = single.exec(masked);
    }
    return imports;
}

function parseYamlTag(tagText) {
    const match = /(?:^|\s)yaml:"([^"]*)"/.exec(tagText);
    if (!match) {
        return { present: false, name: "", inline: false, ignore: false };
    }
    const [name, ...options] = match[1].split(",");
    return {
        present: true,
        name,
        inline: options.includes("inline"),
        ignore: name === "-",
    };
}

function splitFieldName(rest) {
    const flat = collapseWhitespace(rest);
    const match = /^([A-Za-z_][A-Za-z0-9_]*)\s+([\s\S]+)$/.exec(flat);
    if (!match) {
        return { name: "", type: flat, embedded: true };
    }
    const keyword = match[1];
    if (["struct", "interface", "map", "chan", "func"].includes(keyword) || match[2].startsWith(".")) {
        return { name: "", type: flat, embedded: true };
    }
    return { name: keyword, type: match[2].trim(), embedded: false };
}

function parseFieldText(text, comment) {
    const flat = collapseWhitespace(text);
    if (flat === "" || flat.startsWith("//")) {
        return null;
    }
    const tagMatch = /`([^`]*)`\s*$/.exec(flat);
    const tagText = tagMatch ? tagMatch[1] : "";
    const rest = tagMatch ? flat.slice(0, tagMatch.index).trim() : flat;
    if (rest === "") {
        return null;
    }
    const named = splitFieldName(rest);
    const tag = parseYamlTag(tagText);
    return {
        name: named.name,
        type: named.type,
        embedded: named.embedded,
        tag,
        comment: collapseWhitespace(comment),
    };
}

function parseStructBody(body) {
    const fields = [];
    const lines = body.split(/\n/);
    let pending = [];
    let buffer = "";
    let comment = "";
    let depth = 0;
    let inString = "";
    let inRaw = false;
    let inLineComment = false;
    let inBlockComment = false;

    const flush = () => {
        const field = parseFieldText(buffer, comment);
        if (field) {
            fields.push(field);
        }
        buffer = "";
        comment = "";
    };

    for (const line of lines) {
        if (depth === 0 && buffer === "") {
            const trimmed = line.trim();
            if (trimmed === "") {
                pending = [];
                continue;
            }
            if (trimmed.startsWith("//")) {
                pending.push(trimmed.replace(/^\/\/\s?/, ""));
                continue;
            }
            if (trimmed.startsWith("/*") && trimmed.endsWith("*/")) {
                pending = [];
                continue;
            }
        }
        if (buffer === "" && depth === 0) {
            comment = pending.join(" ");
            pending = [];
        }
        buffer += `${line}\n`;
        for (let index = 0; index < line.length; index += 1) {
            const ch = line[index];
            const next = line[index + 1];
            if (inLineComment) {
                break;
            }
            if (inBlockComment) {
                if (ch === "*" && next === "/") {
                    inBlockComment = false;
                    index += 1;
                }
                continue;
            }
            if (inRaw) {
                if (ch === "`") {
                    inRaw = false;
                }
                continue;
            }
            if (inString) {
                if (ch === "\\") {
                    index += 1;
                    continue;
                }
                if (ch === inString) {
                    inString = "";
                }
                continue;
            }
            if (ch === "/" && next === "/") {
                inLineComment = true;
                break;
            }
            if (ch === "/" && next === "*") {
                inBlockComment = true;
                index += 1;
                continue;
            }
            if (ch === "`") {
                inRaw = true;
                continue;
            }
            if (ch === "\"" || ch === "'") {
                inString = ch;
                continue;
            }
            if (ch === "{" || ch === "(" || ch === "[") {
                depth += 1;
            } else if (ch === "}" || ch === ")" || ch === "]") {
                depth -= 1;
            }
        }
        inLineComment = false;
        if (depth <= 0 && buffer.trim() !== "") {
            flush();
            depth = 0;
        }
    }
    if (buffer.trim() !== "") {
        flush();
    }
    return fields;
}

function parseGoFile(file, root) {
    const source = readText(file);
    const masked = maskComments(source);
    const structs = new Map();
    const aliases = new Map();
    const typeRe = /type\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:=\s*)?/g;
    let match = typeRe.exec(masked);
    while (match) {
        const name = match[1];
        let index = typeRe.lastIndex;
        while (index < masked.length && /\s/.test(masked[index])) {
            index += 1;
        }
        if (masked.startsWith("struct", index)) {
            const brace = masked.indexOf("{", index);
            if (brace >= 0) {
                const balanced = readBalanced(masked, brace, "{", "}");
                if (balanced) {
                    structs.set(name, {
                        name,
                        file: relativePosix(root, file),
                        fields: parseStructBody(source.slice(brace + 1, balanced.end - 1)),
                    });
                    typeRe.lastIndex = balanced.end;
                }
            }
        } else if (masked.startsWith("interface", index)) {
            const brace = masked.indexOf("{", index);
            if (brace >= 0) {
                const balanced = readBalanced(masked, brace, "{", "}");
                if (balanced) {
                    typeRe.lastIndex = balanced.end;
                }
            }
        } else {
            const rest = /^([A-Za-z0-9_.*[\]]+)/.exec(masked.slice(index));
            if (rest) {
                aliases.set(name, rest[1].replace(/\s+/g, ""));
            }
        }
        match = typeRe.exec(masked);
    }
    return {
        dir: path.dirname(file),
        file: relativePosix(root, file),
        imports: parseImports(source),
        structs,
        aliases,
    };
}

function loadPackage(root, directory, cache) {
    const resolved = path.resolve(directory);
    if (cache.has(resolved)) {
        return cache.get(resolved);
    }
    const pkg = {
        dir: resolved,
        imports: new Map(),
        structs: new Map(),
        aliases: new Map(),
    };
    cache.set(resolved, pkg);
    for (const file of listGoFiles(resolved)) {
        const parsed = parseGoFile(file, root);
        for (const [key, value] of parsed.imports) {
            pkg.imports.set(key, value);
        }
        for (const [key, value] of parsed.structs) {
            pkg.structs.set(key, value);
        }
        for (const [key, value] of parsed.aliases) {
            if (!pkg.aliases.has(key)) {
                pkg.aliases.set(key, value);
            }
        }
    }
    return pkg;
}

function packageForImport(root, modulePath, importPath, cache) {
    if (!modulePath || !importPath.startsWith(`${modulePath}/`)) {
        return null;
    }
    const directory = path.join(root, importPath.slice(modulePath.length + 1));
    if (!exists(directory)) {
        return null;
    }
    return loadPackage(root, directory, cache);
}

function qualify(pkg, typeName, root, modulePath, cache) {
    const cleaned = typeName.replace(/^\*/, "").trim();
    if (cleaned.includes(".")) {
        const dot = cleaned.indexOf(".");
        const local = cleaned.slice(0, dot);
        const name = cleaned.slice(dot + 1);
        const importPath = pkg.imports.get(local);
        if (!importPath) {
            return null;
        }
        const target = packageForImport(root, modulePath, importPath, cache);
        if (!target) {
            return null;
        }
        return { pkg: target, name };
    }
    return { pkg, name: cleaned };
}

function resolveNamed(pkg, typeName, root, modulePath, cache, seen) {
    if (SCALAR_TYPES.has(typeName)) {
        return { kind: "scalar", typeName };
    }
    const located = qualify(pkg, typeName, root, modulePath, cache);
    if (!located) {
        return { kind: "opaque", typeName };
    }
    const key = `${located.pkg.dir}#${located.name}`;
    if (seen.has(key)) {
        return { kind: "opaque", typeName };
    }
    seen.add(key);
    if (located.pkg.structs.has(located.name)) {
        return { kind: "struct", struct: located.pkg.structs.get(located.name), pkg: located.pkg };
    }
    if (located.pkg.aliases.has(located.name)) {
        const target = located.pkg.aliases.get(located.name).replace(/^\*/, "");
        if (SCALAR_TYPES.has(target) || NUMERIC_TYPES.has(target)) {
            return { kind: "scalar", typeName: target };
        }
        return resolveNamed(located.pkg, target, root, modulePath, cache, seen);
    }
    return { kind: "opaque", typeName };
}

function unwrapType(expr) {
    let text = expr.trim();
    let pointer = false;
    while (text.startsWith("*")) {
        pointer = true;
        text = text.slice(1).trim();
    }
    if (text.startsWith("[]")) {
        return { container: "slice", pointer, inner: unwrapType(text.slice(2).trim()) };
    }
    if (text.startsWith("map[")) {
        let depth = 0;
        let end = -1;
        for (let index = 4; index < text.length; index += 1) {
            const ch = text[index];
            if (ch === "[") {
                depth += 1;
            } else if (ch === "]") {
                if (depth === 0) {
                    end = index;
                    break;
                }
                depth -= 1;
            }
        }
        if (end >= 0) {
            return { container: "map", pointer, inner: unwrapType(text.slice(end + 1).trim()) };
        }
    }
    return { container: "named", pointer, name: text.replace(/\s+/g, "") };
}

function terminalNamed(unwrapped) {
    let current = unwrapped;
    while (current && (current.container === "slice" || current.container === "map")) {
        current = current.inner;
    }
    if (!current || current.container !== "named") {
        return null;
    }
    return current.name.replace(/^\*/, "");
}

function isContainerOfStruct(unwrapped) {
    return unwrapped.container === "slice" || unwrapped.container === "map";
}

function zeroValue(typeName) {
    const text = typeName.replace(/^\*/, "");
    if (typeName.startsWith("*") || text.startsWith("[]") || text.startsWith("map[")) {
        return "nil";
    }
    if (text === "bool") {
        return "false";
    }
    if (text === "string") {
        return "empty string";
    }
    if (text === "time.Duration") {
        return "0s";
    }
    if (NUMERIC_TYPES.has(text)) {
        return "0";
    }
    return "";
}

function fieldKey(field) {
    if (field.tag.ignore) {
        return { skip: true };
    }
    const inline = field.tag.inline || (field.embedded && field.tag.present && field.tag.name === "");
    if (inline) {
        return { inline: true };
    }
    if (field.tag.present && field.tag.name !== "") {
        return { name: field.tag.name };
    }
    if (!field.embedded && field.name !== "") {
        return { name: field.name.toLowerCase() };
    }
    if (field.embedded) {
        const base = field.type.split(".").pop().replace(/^\*/, "");
        return { name: base.toLowerCase() };
    }
    return { skip: true };
}

function exportedField(field) {
    if (field.embedded) {
        const base = field.type.split(".").pop().replace(/^[*\s]+/, "");
        return base !== "" && base[0] === base[0].toUpperCase();
    }
    return field.name !== "" && field.name[0] === field.name[0].toUpperCase();
}

function loadV8Tables(root) {
    const file = path.join(root, "internal", "config", "config_v8.go");
    if (!exists(file)) {
        return { prefixes: [], families: [] };
    }
    const masked = maskComments(readText(file));
    return {
        prefixes: readConfigPairs(masked, "prefixes := []configPath{"),
        families: readConfigPairs(masked, "var v8KeyFamilies = []configPath{"),
    };
}

function readConfigPairs(source, marker) {
    const start = source.indexOf(marker);
    if (start < 0) {
        return [];
    }
    const brace = source.indexOf("{", start);
    const balanced = readBalanced(source, brace, "{", "}");
    if (!balanced) {
        return [];
    }
    const pairs = [];
    const re = /\{\s*"([^"]*)"\s*,\s*"([^"]*)"\s*\}/g;
    let match = re.exec(balanced.body);
    while (match) {
        pairs.push({ old: match[1], current: match[2] });
        match = re.exec(balanced.body);
    }
    return pairs;
}

function remapPath(yamlPath, prefixes) {
    let best = null;
    for (const prefix of prefixes) {
        if (yamlPath === prefix.old || yamlPath.startsWith(`${prefix.old}.`)) {
            if (!best || prefix.old.length > best.old.length) {
                best = prefix;
            }
        }
    }
    if (!best) {
        return yamlPath;
    }
    if (yamlPath === best.old) {
        return best.current;
    }
    return best.current + yamlPath.slice(best.old.length);
}

function remapFamily(yamlPath, families) {
    let best = null;
    for (const family of families) {
        if (yamlPath === family.old || yamlPath.startsWith(`${family.old}.`)) {
            if (!best || family.old.length > best.old.length) {
                best = family;
            }
        }
    }
    if (!best) {
        return yamlPath;
    }
    const current = `api-keys.${best.current}`;
    if (yamlPath === best.old) {
        return current;
    }
    return current + yamlPath.slice(best.old.length);
}

function canonicalizePath(yamlPath, tables) {
    const prefixed = remapPath(yamlPath, tables.prefixes);
    if (prefixed !== yamlPath) {
        return prefixed;
    }
    return remapFamily(yamlPath, tables.families);
}

function extractConfig(root, modulePath, cache, tables, pinned) {
    const directory = path.join(root, "internal", "config");
    if (!exists(directory)) {
        return [];
    }
    const pkg = loadPackage(root, directory, cache);
    const config = pkg.structs.get("Config");
    if (!config) {
        return [];
    }
    const records = [];
    const seen = new Map();

    const emit = (yamlPath, legacyPath, field, resolvedType) => {
        const canonical = canonicalizePath(yamlPath, tables);
        const id = featureIDFromSegments(canonical.split("."));
        if (!FEATURE_ID.test(id)) {
            return;
        }
        const commentDefault = explicitDefault(field.comment);
        const defaults = commentDefault || zeroValue(resolvedType);
        const behavior = field.comment || `YAML ${canonical}`;
        const legacyNote = legacyPath !== canonical ? ` legacy ${legacyPath}` : "";
        const source = `${field.file} ${field.owner}.${field.symbol} ${canonical}${legacyNote}`;
        const record = blankRecord({
            id,
            kind: "config",
            title: canonical,
            source,
            behavior,
            defaults,
            pinned_commit: pinned,
        });
        if (seen.has(id)) {
            const previous = seen.get(id);
            if (!previous.source.includes(source)) {
                previous.source = `${previous.source} | ${source}`;
            }
            return;
        }
        seen.set(id, record);
        records.push(record);
    };

    const walkStruct = (structRef, structPkg, segments, stack) => {
        const stackKey = `${structPkg.dir}#${structRef.name}`;
        if (stack.has(stackKey)) {
            return false;
        }
        stack.add(stackKey);
        let emitted = false;
        for (const field of structRef.fields) {
            if (!exportedField(field)) {
                continue;
            }
            const key = fieldKey(field);
            if (key.skip) {
                continue;
            }
            const nextSegments = key.inline ? segments.slice() : segments.concat(key.name);
            const unwrapped = unwrapType(field.type);
            const named = terminalNamed(unwrapped);
            const structLike = named
                ? resolveNamed(structPkg, named, root, modulePath, cache, new Set())
                : { kind: "opaque", typeName: field.type };
            const descend = structLike.kind === "struct" && (
                key.inline
                || unwrapped.container === "named"
                || isContainerOfStruct(unwrapped)
            );
            if (descend) {
                const before = records.length;
                const childEmitted = walkStruct(structLike.struct, structLike.pkg, nextSegments, stack);
                if (childEmitted || records.length > before) {
                    emitted = true;
                    continue;
                }
            }
            if (key.inline) {
                continue;
            }
            const legacyPath = nextSegments.join(".");
            const zeroType = structLike.kind === "scalar"
                && unwrapped.container === "named"
                && !unwrapped.pointer
                ? structLike.typeName
                : field.type;
            emit(legacyPath, legacyPath, {
                file: structRef.file,
                owner: structRef.name,
                symbol: field.embedded ? field.type : field.name,
                comment: field.comment,
            }, zeroType);
            emitted = true;
        }
        stack.delete(stackKey);
        return emitted;
    };

    walkStruct(config, pkg, [], new Set());
    return records;
}

function expandMethodLoops(source) {
    const re = /for\s+_,\s+([A-Za-z_][A-Za-z0-9_]*)\s*:=\s*range\s+\[\]string\{/g;
    let out = "";
    let last = 0;
    let match = re.exec(source);
    while (match) {
        const list = readBalanced(source, re.lastIndex - 1, "{", "}");
        if (!list) {
            break;
        }
        let cursor = list.end;
        while (cursor < source.length && /\s/.test(source[cursor])) {
            cursor += 1;
        }
        if (source[cursor] !== "{") {
            match = re.exec(source);
            continue;
        }
        const body = readBalanced(source, cursor, "{", "}");
        if (!body) {
            break;
        }
        const methods = splitTopLevel(list.body, ",")
            .map((item) => HTTP_CONSTANTS[item.trim()] || "")
            .filter((item) => item !== "");
        let expanded = body.body;
        if (methods.length > 0) {
            const pieces = [];
            for (const method of methods) {
                pieces.push(body.body.replace(
                    new RegExp(`\\.Handle\\(\\s*${match[1]}\\s*,`),
                    `.Handle("${method}",`,
                ));
            }
            expanded = pieces.join("\n");
        }
        out += source.slice(last, match.index) + expanded;
        last = body.end;
        re.lastIndex = body.end;
        match = re.exec(source);
    }
    out += source.slice(last);
    return out;
}

function resolveStringAtom(atom, env) {
    const text = atom.trim();
    if ((text.startsWith("\"") && text.endsWith("\"")) || (text.startsWith("`") && text.endsWith("`"))) {
        return decodeGoString(text);
    }
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(text) && env.has(text)) {
        return env.get(text);
    }
    return null;
}

function resolveStringExpr(expr, env) {
    const parts = splitTopLevel(expr, "+");
    if (parts.length === 0) {
        return null;
    }
    let value = "";
    for (const part of parts) {
        const atom = resolveStringAtom(part, env);
        if (atom === null) {
            return null;
        }
        value += atom;
    }
    return value;
}

function collectStringEnv(source) {
    const env = new Map();
    const re = /\b([A-Za-z_][A-Za-z0-9_]*)\s*(?::=|=)\s*("(?:\\.|[^"\\])*"|`[^`]*`)/g;
    let match = re.exec(source);
    while (match) {
        env.set(match[1], decodeGoString(match[2]));
        match = re.exec(source);
    }
    return env;
}

function joinRoute(prefix, routePath) {
    let suffix = routePath;
    if (!suffix.startsWith("/")) {
        suffix = `/${suffix}`;
    }
    if (!prefix) {
        return suffix;
    }
    const base = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
    return `${base}${suffix}`;
}

function routeIdentity(method, fullPath) {
    const raw = fullPath.split("/").filter((part) => part !== "");
    const managementAt = raw.indexOf("management");
    let parts = raw.map((part) => normalizeSegment(part)).filter((part) => part !== "");
    let area = "route";
    let kind = "route";
    if (managementAt >= 0) {
        area = "management";
        kind = "management";
        parts = parts.filter((_, index) => index !== managementAt);
    }
    if (parts.length === 0) {
        parts = ["root"];
    }
    const methodPart = normalizeSegment(method);
    const subject = parts[0];
    const leaf = parts.length === 1
        ? methodPart
        : [methodPart, ...parts.slice(1)].join("-");
    return { id: `${area}.${subject}.${leaf}`, kind };
}

function extractRoutesFromFile(root, repoPath, pinned) {
    const file = path.join(root, repoPath);
    if (!exists(file)) {
        return [];
    }
    const masked = expandMethodLoops(maskComments(readText(file)));
    const env = collectStringEnv(masked);
    const groups = new Map();
    const records = [];
    const seen = new Set();
    const callRe = new RegExp(
        String.raw`(?:([A-Za-z_][A-Za-z0-9_]*)\s*:?=\s*([\w.]+)\.Group\(|([\w.]+)\.(${GIN_METHODS.join("|")})\()`,
        "g",
    );
    let match = callRe.exec(masked);
    while (match) {
        const open = callRe.lastIndex - 1;
        const balanced = readBalanced(masked, open, "(", ")");
        if (!balanced) {
            break;
        }
        callRe.lastIndex = balanced.end;
        const args = splitTopLevel(balanced.body, ",");
        if (match[1]) {
            const prefixExpr = args[0] ?? "";
            const resolved = resolveStringExpr(prefixExpr, env);
            if (resolved !== null) {
                const parentName = match[2].split(".").pop();
                const parent = match[2] === "s.engine" || parentName === "engine"
                    ? ""
                    : groups.get(parentName);
                if (parent !== undefined || match[2].endsWith(".engine") || match[2] === "engine") {
                    groups.set(match[1], joinRoute(parent ?? "", resolved));
                    env.set(match[1], joinRoute(parent ?? "", resolved));
                }
            }
        } else if (match[3] && match[4]) {
            const receiver = match[3];
            const parentName = receiver.split(".").pop();
            let prefix = null;
            if (receiver === "s.engine" || receiver === "engine" || receiver.endsWith(".engine")) {
                prefix = "";
            } else if (groups.has(parentName)) {
                prefix = groups.get(parentName);
            }
            if (prefix !== null) {
                const methods = [];
                let pathExpr = "";
                if (match[4] === "Handle") {
                    const methodValue = resolveStringAtom(args[0] ?? "", env) ?? HTTP_CONSTANTS[(args[0] ?? "").trim()];
                    pathExpr = args[1] ?? "";
                    if (methodValue) {
                        methods.push(methodValue);
                    }
                } else if (match[4] === "Any") {
                    methods.push("GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS");
                    pathExpr = args[0] ?? "";
                } else {
                    methods.push(match[4]);
                    pathExpr = args[0] ?? "";
                }
                const routePath = resolveStringExpr(pathExpr, env);
                if (routePath !== null) {
                    const fullPath = joinRoute(prefix, routePath);
                    if (!fullPath.includes("/v0/management")) {
                        for (const method of methods) {
                            const identity = routeIdentity(method, fullPath);
                            if (!FEATURE_ID.test(identity.id) || seen.has(identity.id)) {
                                continue;
                            }
                            seen.add(identity.id);
                            const label = `${method} ${fullPath}`;
                            records.push(blankRecord({
                                id: identity.id,
                                kind: identity.kind,
                                title: label,
                                source: `${repoPath} ${label}`,
                                behavior: label,
                                defaults: "",
                                pinned_commit: pinned,
                            }));
                        }
                    }
                }
            }
        }
        match = callRe.exec(masked);
    }
    return records;
}

function extractRoutes(root, pinned) {
    const records = [];
    for (const repoPath of ROUTE_FILES) {
        records.push(...extractRoutesFromFile(root, repoPath, pinned));
    }
    return records;
}

function extractV0(root, pinned) {
    const file = path.join(root, "internal", "api", "server_management.go");
    if (!exists(file) || !readText(file).includes("/v0/management")) {
        return [];
    }
    return [blankRecord({
        id: "management.v0.deprecated",
        kind: "management",
        title: "Management API v0",
        source: "internal/api/server_management.go /v0/management",
        behavior: "The /v0/management API is deprecated and is not documented route by route.",
        defaults: "",
        pinned_commit: pinned,
    })];
}

function formatDefault(value, env) {
    if (value === "true" || value === "false") {
        return value;
    }
    if (/^-?\d+$/.test(value)) {
        return value;
    }
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("`") && value.endsWith("`"))) {
        const decoded = decodeGoString(value);
        return decoded === "" ? "empty string" : decoded;
    }
    if (env.has(value)) {
        return formatDefault(env.get(value), env);
    }
    return value;
}

function extractFlags(root, pinned) {
    const directory = path.join(root, "cmd", "server");
    const files = listGoFiles(directory);
    const env = new Map();
    const found = [];
    for (const file of files) {
        const masked = maskComments(readText(file));
        const local = collectStringEnv(masked);
        for (const [key, value] of local) {
            env.set(key, `"${value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}"`);
        }
        const callRe = /\b([A-Za-z_][A-Za-z0-9_]*)\.(BoolVar|IntVar|Int64Var|UintVar|Uint64Var|StringVar|Float64Var|DurationVar|Bool|Int|Int64|Uint|Uint64|String|Float64|Duration|Func)\(/g;
        let match = callRe.exec(masked);
        while (match) {
            const open = callRe.lastIndex - 1;
            const balanced = readBalanced(masked, open, "(", ")");
            if (!balanced) {
                break;
            }
            callRe.lastIndex = balanced.end;
            const method = match[2];
            const args = splitTopLevel(balanced.body, ",");
            let name = "";
            let fallback = "";
            let usage = "";
            if (FLAG_VAR_METHODS.has(method) && args.length >= 4) {
                name = args[1];
                fallback = args[2];
                usage = args[3];
            } else if (FLAG_VALUE_METHODS.has(method) && args.length >= 3) {
                name = args[0];
                fallback = args[1];
                usage = args[2];
            } else if (method === "Func" && args.length >= 2) {
                name = args[0];
                usage = args[1];
            } else {
                match = callRe.exec(masked);
                continue;
            }
            const flagName = resolveStringAtom(name, env);
            if (!flagName) {
                match = callRe.exec(masked);
                continue;
            }
            const usageText = resolveStringAtom(usage, env) ?? "";
            const setName = match[1] === "flag"
                ? "flag"
                : match[1].replace(/Flags$/, "") || match[1];
            found.push({
                set: setName,
                name: flagName,
                defaults: fallback === "" ? "" : formatDefault(fallback.trim(), env),
                behavior: usageText,
                source: `${relativePosix(root, file)} --${flagName}`,
            });
            match = callRe.exec(masked);
        }
    }
    const records = [];
    const used = new Set();
    const ordered = [
        ...found.filter((flag) => flag.set === "flag"),
        ...found.filter((flag) => flag.set !== "flag"),
    ];
    for (const flag of ordered) {
        let leaf = normalizeSegment(flag.name);
        let id = `cli.server.${leaf}`;
        if (used.has(id)) {
            leaf = normalizeSegment(`${flag.set}-${flag.name}`);
            id = `cli.server.${leaf}`;
        }
        if (!FEATURE_ID.test(id) || used.has(id)) {
            continue;
        }
        used.add(id);
        records.push(blankRecord({
            id,
            kind: "cli",
            title: `--${flag.name}`,
            source: flag.source,
            behavior: flag.behavior || flag.name,
            defaults: flag.defaults,
            pinned_commit: pinned,
        }));
    }
    return records;
}

function parseInterfaceMethods(body) {
    const masked = maskComments(body);
    const methods = [];
    const re = /\b([A-Z][A-Za-z0-9_]*)\s*\(/g;
    let match = re.exec(masked);
    while (match) {
        methods.push(match[1]);
        match = re.exec(masked);
    }
    return methods;
}

function extractPlugins(root, pinned) {
    const records = [];
    const seen = new Set();
    const directories = [
        path.join(root, "sdk", "pluginapi"),
        path.join(root, "sdk", "pluginabi"),
    ];
    for (const directory of directories) {
        for (const file of listGoFiles(directory)) {
            const source = readText(file);
            const masked = maskComments(source);
            const re = /type\s+([A-Z][A-Za-z0-9_]*)\s+interface\s*\{/g;
            let match = re.exec(masked);
            while (match) {
                const brace = masked.indexOf("{", match.index);
                const balanced = readBalanced(masked, brace, "{", "}");
                if (!balanced) {
                    break;
                }
                re.lastIndex = balanced.end;
                const interfaceName = match[1];
                const originalBrace = source.indexOf("{", match.index);
                const original = readBalanced(source, originalBrace, "{", "}");
                const methods = parseInterfaceMethods(original ? original.body : balanced.body);
                for (const method of methods) {
                    const id = `plugin.${interfaceSegment(interfaceName)}.${kebabIdentifier(method)}`;
                    if (!FEATURE_ID.test(id) || seen.has(id)) {
                        continue;
                    }
                    seen.add(id);
                    records.push(blankRecord({
                        id,
                        kind: "plugin",
                        title: `${interfaceName}.${method}`,
                        source: `${relativePosix(root, file)} ${interfaceName}.${method}`,
                        behavior: method,
                        defaults: "",
                        pinned_commit: pinned,
                    }));
                }
                match = re.exec(masked);
            }
        }
    }
    return records;
}

function packageComment(directory) {
    for (const file of listGoFiles(directory)) {
        const match = readText(file).match(/(^|\n)(\/\/ Package [^\n]*(?:\n\/\/[^\n]*)*)/);
        if (match) {
            return collapseWhitespace(match[2].replace(/^\/\/ ?/gm, ""));
        }
    }
    return "";
}

function extractAuth(root, pinned) {
    // FeatureRecord has no auth kind. Login entries are user-invoked, so they use cli.
    const directory = path.join(root, "internal", "auth");
    if (!exists(directory)) {
        return [];
    }
    const records = [];
    const names = fs.readdirSync(directory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && entry.name !== "empty" && !entry.name.startsWith("."))
        .map((entry) => entry.name)
        .sort();
    for (const name of names) {
        const leaf = "login";
        const subject = normalizeSegment(name);
        const id = `auth.${subject}.${leaf}`;
        if (!FEATURE_ID.test(id)) {
            continue;
        }
        const providerDir = path.join(directory, name);
        const comment = packageComment(providerDir);
        const titleName = name.charAt(0).toUpperCase() + name.slice(1);
        records.push(blankRecord({
            id,
            kind: "cli",
            title: `${titleName} login`,
            source: `internal/auth/${name}`,
            behavior: comment || `${name} login`,
            defaults: "",
            pinned_commit: pinned,
        }));
    }
    return records;
}

function extractModes(pinned) {
    return [
        blankRecord({
            id: "mode.tui.start",
            kind: "mode",
            title: "TUI",
            source: "--tui",
            behavior: "Start with the terminal management UI.",
            defaults: "",
            pinned_commit: pinned,
        }),
        blankRecord({
            id: "mode.docker.compose",
            kind: "mode",
            title: "Docker Compose",
            source: "docker-compose.yml",
            behavior: "Run the server from the repository docker-compose.yml file.",
            defaults: "",
            pinned_commit: pinned,
        }),
        blankRecord({
            id: "mode.home.jwt",
            kind: "mode",
            title: "CLIProxyAPI Home",
            source: "--home-jwt",
            behavior: "Connect to CLIProxyAPI Home with a control-plane JWT.",
            defaults: "",
            pinned_commit: pinned,
        }),
    ];
}

export function extractFeatures(root) {
    const resolved = path.resolve(root);
    const pinned = readPIN(resolved);
    const modulePath = modulePathOf(resolved);
    const cache = new Map();
    const tables = loadV8Tables(resolved);
    const records = [
        ...extractConfig(resolved, modulePath, cache, tables, pinned),
        ...extractRoutes(resolved, pinned),
        ...extractV0(resolved, pinned),
        ...extractFlags(resolved, pinned),
        ...extractPlugins(resolved, pinned),
        ...extractAuth(resolved, pinned),
        ...extractModes(pinned),
    ];
    records.sort((left, right) => left.id.localeCompare(right.id));
    return records;
}
