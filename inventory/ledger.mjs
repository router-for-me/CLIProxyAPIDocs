// Validate and append one issue ledger row.
// Rows use only the specification fields and must not carry secrets.

import fs from "node:fs";
import path from "node:path";

const ISSUE_FIELDS = [
    "number",
    "state",
    "class",
    "feature_ids",
    "experience_id",
    "reason",
    "updated_at",
];

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
const SK_SECRET = /sk-(?!YOUR_API_KEY\b)[A-Za-z0-9]/;
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const BEARER_SECRET = /Bearer\s+(?!YOUR_API_KEY\b)[A-Za-z0-9._~+/=_-]{8,}/;
const GITHUB_TOKEN = /\b(?:gh[pousr]_|github_pat_)[A-Za-z0-9_]{10,}/;

function fail(message) {
    throw new Error(message);
}

function assertExactFields(record) {
    if (record === null || typeof record !== "object" || Array.isArray(record)) {
        fail("missing field number");
    }
    for (const key of Object.keys(record)) {
        if (!ISSUE_FIELDS.includes(key)) {
            fail(`unknown field ${key}`);
        }
    }
    for (const key of ISSUE_FIELDS) {
        if (!Object.hasOwn(record, key)) {
            fail(`missing field ${key}`);
        }
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

function assertNoSecrets(reason) {
    if (SK_SECRET.test(reason) || BEARER_SECRET.test(reason) || GITHUB_TOKEN.test(reason)) {
        fail("reason contains a secret");
    }
    if (EMAIL.test(reason)) {
        fail("reason contains an email");
    }
}

function validateRow(row) {
    assertExactFields(row);
    if (typeof row.number !== "number" || !Number.isInteger(row.number) || row.number <= 0) {
        fail("invalid number");
    }
    if (typeof row.state !== "string" || !ISSUE_STATES.has(row.state)) {
        fail("invalid state");
    }
    if (typeof row.class !== "string" || !ISSUE_CLASSES.has(row.class)) {
        fail("invalid class");
    }
    if (!Array.isArray(row.feature_ids)) {
        fail("invalid feature_ids");
    }
    for (const id of row.feature_ids) {
        if (typeof id !== "string" || !FEATURE_ID.test(id)) {
            fail(`invalid feature id ${String(id)}`);
        }
    }
    if (typeof row.experience_id !== "string") {
        fail("invalid experience_id");
    }
    if (row.experience_id !== "" && !EXPERIENCE_ID.test(row.experience_id)) {
        fail(`invalid experience_id ${row.experience_id}`);
    }
    if (typeof row.reason !== "string" || row.reason.trim() === "") {
        fail("invalid reason");
    }
    assertNoSecrets(row.reason);
    if (typeof row.updated_at !== "string" || !isRealDate(row.updated_at)) {
        fail("invalid updated_at");
    }
}

function orderedRow(row) {
    return {
        number: row.number,
        state: row.state,
        class: row.class,
        feature_ids: row.feature_ids,
        experience_id: row.experience_id,
        reason: row.reason,
        updated_at: row.updated_at,
    };
}

function readRows(ledgerPath) {
    if (!fs.existsSync(ledgerPath)) {
        return [];
    }
    const lines = fs.readFileSync(ledgerPath, "utf8").split(/\r?\n/);
    const rows = [];
    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index].trim();
        if (line === "") {
            continue;
        }
        try {
            rows.push(JSON.parse(line));
        } catch (error) {
            if (error instanceof SyntaxError) {
                fail(`${ledgerPath}:${index + 1} is not valid JSON`);
            }
            throw error;
        }
    }
    return rows;
}

function endsWithNewline(ledgerPath) {
    if (!fs.existsSync(ledgerPath)) {
        return true;
    }
    const size = fs.statSync(ledgerPath).size;
    if (size === 0) {
        return true;
    }
    const fd = fs.openSync(ledgerPath, "r");
    try {
        const buffer = Buffer.alloc(1);
        fs.readSync(fd, buffer, 0, 1, size - 1);
        return buffer[0] === 0x0a;
    } finally {
        fs.closeSync(fd);
    }
}

export function appendIssue(ledgerPath, row) {
    validateRow(row);
    const existing = readRows(ledgerPath);
    if (existing.some((item) => item.number === row.number)) {
        fail(`duplicate number ${row.number}`);
    }
    fs.mkdirSync(path.dirname(ledgerPath), { recursive: true });
    const prefix = endsWithNewline(ledgerPath) ? "" : "\n";
    fs.appendFileSync(ledgerPath, `${prefix}${JSON.stringify(orderedRow(row))}\n`);
}
