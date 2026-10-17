import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { extractFeatures } from "./extract.mjs";

const fixtureRoot = path.join(import.meta.dirname, "fixtures", "source");

const FEATURE_KEYS = [
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

const KINDS = new Set(["config", "route", "cli", "management", "plugin", "mode"]);

function loadRecords() {
    const records = extractFeatures(fixtureRoot);
    assert.ok(Array.isArray(records), "extractFeatures(root) must return FeatureRecord[]");
    for (const record of records) {
        assert.deepEqual(Object.keys(record).sort(), [...FEATURE_KEYS].sort());
        assert.equal(typeof record.id, "string");
        assert.match(record.id, /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*){2}$/);
        assert.ok(KINDS.has(record.kind), record.id);
        assert.equal(typeof record.title, "string");
        assert.equal(typeof record.source, "string");
        assert.equal(typeof record.behavior, "string");
        assert.equal(typeof record.defaults, "string");
        assert.equal(record.canonical_page, "");
        assert.deepEqual(record.legacy_urls, []);
        assert.equal(record.status, "missing");
        assert.equal(typeof record.pinned_commit, "string");
        assert.equal(record.translation_ready, false);
    }
    return records.map((record) => record.id);
}

test("server.port yields only server.port.value and skips yaml dash fields", () => {
    const ids = loadRecords();
    const serverPortIds = ids.filter((id) => id === "server.port" || id.startsWith("server.port."));
    assert.deepEqual(serverPortIds, ["server.port.value"]);
    const hiddenIds = ids.filter((id) => id.split(".").some((part) => part === "-" || part.includes("runtime")));
    assert.deepEqual(hiddenIds, []);
});

test("routes registered in _test.go files are not features", () => {
    const ids = loadRecords();
    const testRouteIds = ids.filter((id) => id.includes("extracted-from-test"));
    assert.deepEqual(testRouteIds, []);
});

test("v0 management routes collapse to management.v0.deprecated", () => {
    const ids = loadRecords();
    const v0Ids = ids.filter((id) => id.split(".").includes("v0") || id.includes("v0-") || id.includes("-v0"));
    assert.deepEqual(v0Ids, ["management.v0.deprecated"]);
});

test("public and v8 routes keep method-qualified ids", () => {
    const ids = loadRecords();
    assert.equal(ids.filter((id) => id === "route.v1.post-chat-completions").length, 1);
    assert.equal(ids.filter((id) => id === "management.v8.get-config").length, 1);
});

test("cli flags, plugin methods, and auth providers produce boundary ids", () => {
    const ids = loadRecords();
    assert.equal(ids.filter((id) => id === "cli.server.codex-login").length, 1);
    assert.equal(ids.filter((id) => id === "plugin.auth-provider.parse-auth").length, 1);
    assert.equal(ids.filter((id) => id === "auth.codex.login").length, 1);
});
