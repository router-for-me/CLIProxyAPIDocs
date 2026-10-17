// Failing tests for the issue ledger append gate.
// appendIssue must reject incomplete rows, duplicate numbers, unknown classes, and secrets.

import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

const validRow = {
    number: 1,
    state: "closed",
    class: "usage",
    feature_ids: ["server.port.value"],
    experience_id: "",
    reason: "Change the listen port in configuration.",
    updated_at: "2026-10-17",
};

async function loadAppendIssue() {
    try {
        const ledger = await import("./ledger.mjs");
        return ledger.appendIssue;
    } catch (error) {
        if (error && error.code === "ERR_MODULE_NOT_FOUND") {
            return undefined;
        }
        throw error;
    }
}

async function requireAppendIssue() {
    const appendIssue = await loadAppendIssue();
    assert.equal(typeof appendIssue, "function", "appendIssue is undefined");
    return appendIssue;
}

async function tempLedger(t) {
    const dir = await mkdtemp(path.join(tmpdir(), "issue-ledger-"));
    t.after(async () => {
        await rm(dir, { recursive: true, force: true });
    });
    return path.join(dir, "issues.jsonl");
}

async function readRows(ledgerPath) {
    const text = await readFile(ledgerPath, "utf8");
    return text.split(/\r?\n/).filter((line) => line.trim() !== "").map((line) => JSON.parse(line));
}

test("appendIssue rejects a row that is missing a field", async (t) => {
    const appendIssue = await requireAppendIssue();
    const ledgerPath = await tempLedger(t);
    const row = { ...validRow };
    delete row.reason;
    assert.throws(
        () => appendIssue(ledgerPath, row),
        (error) => {
            assert.ok(error instanceof Error);
            assert.match(error.message, /missing field reason/);
            return true;
        },
    );
    await assert.rejects(readRows(ledgerPath));
});

test("appendIssue rejects a duplicate number", async (t) => {
    const appendIssue = await requireAppendIssue();
    const ledgerPath = await tempLedger(t);
    appendIssue(ledgerPath, validRow);
    assert.throws(
        () => appendIssue(ledgerPath, { ...validRow, reason: "Same issue classified again." }),
        (error) => {
            assert.ok(error instanceof Error);
            assert.match(error.message, /duplicate number 1/);
            return true;
        },
    );
    assert.deepEqual(await readRows(ledgerPath), [validRow]);
});

test("appendIssue rejects a class outside the allowed set", async (t) => {
    const appendIssue = await requireAppendIssue();
    const ledgerPath = await tempLedger(t);
    assert.throws(
        () => appendIssue(ledgerPath, { ...validRow, class: "bug" }),
        (error) => {
            assert.ok(error instanceof Error);
            assert.match(error.message, /invalid class/);
            return true;
        },
    );
    await assert.rejects(readRows(ledgerPath));
});

test("appendIssue rejects a reason that contains sk-abcdefgh", async (t) => {
    const appendIssue = await requireAppendIssue();
    const ledgerPath = await tempLedger(t);
    assert.throws(
        () => appendIssue(ledgerPath, {
            ...validRow,
            reason: "The report included sk-abcdefgh in the log.",
        }),
        (error) => {
            assert.ok(error instanceof Error);
            assert.match(error.message, /sk-abcdefgh|secret/);
            return true;
        },
    );
    await assert.rejects(readRows(ledgerPath));
});

test("appendIssue rejects a reason that contains user@example.com", async (t) => {
    const appendIssue = await requireAppendIssue();
    const ledgerPath = await tempLedger(t);
    assert.throws(
        () => appendIssue(ledgerPath, {
            ...validRow,
            reason: "Contact user@example.com for the reproduction.",
        }),
        (error) => {
            assert.ok(error instanceof Error);
            assert.match(error.message, /user@example.com|email|secret/);
            return true;
        },
    );
    await assert.rejects(readRows(ledgerPath));
});

test("appendIssue appends a valid row", async (t) => {
    const appendIssue = await requireAppendIssue();
    const ledgerPath = await tempLedger(t);
    appendIssue(ledgerPath, validRow);
    const second = {
        ...validRow,
        number: 2,
        state: "open",
        class: "defect",
        feature_ids: [],
        reason: "The listen port is rejected when it is out of range.",
    };
    appendIssue(ledgerPath, second);
    assert.deepEqual(await readRows(ledgerPath), [validRow, second]);
});
