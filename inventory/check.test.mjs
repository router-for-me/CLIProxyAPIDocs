import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readFile, rm, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { checkInventory } from "./check.mjs";

const PIN = "0123456789abcdef0123456789abcdef01234567";
const FEATURE_ID = "server.port.value";
const V0_ID = "management.v0.deprecated";
const validFixture = path.join(import.meta.dirname, "fixtures", "valid");
const vitepressFixture = path.join(import.meta.dirname, "fixtures", "vitepress.config.mts");

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

const ISSUE_KEYS = [
    "number",
    "state",
    "class",
    "feature_ids",
    "experience_id",
    "reason",
    "updated_at",
];

const SK_SECRET = "sk-abcdefghij1234567890";
const BEARER_SECRET = "Bearer abcdefghij1234567890";

async function stage(t, mutate) {
    const dir = await mkdtemp(path.join(tmpdir(), "inventory-check-"));
    t.after(async () => {
        await rm(dir, { recursive: true, force: true });
    });
    await cp(validFixture, dir, { recursive: true });
    // .vitepress/ is gitignored, so the sidebar fixture is stored outside that directory.
    const vitepressDir = path.join(dir, "docs/.vitepress");
    await mkdir(vitepressDir, { recursive: true });
    await cp(vitepressFixture, path.join(vitepressDir, "config.mts"));
    if (mutate) {
        await mutate(dir);
    }
    return dir;
}

async function readJSONL(dir, relativePath) {
    const text = await readFile(path.join(dir, relativePath), "utf8");
    return text.split("\n").filter((line) => line.trim() !== "").map((line) => JSON.parse(line));
}

async function writeJSONL(dir, relativePath, records) {
    const body = `${records.map((record) => JSON.stringify(record)).join("\n")}\n`;
    await writeFile(path.join(dir, relativePath), body);
}

async function assertViolation(dir, mode, pattern) {
    await assert.rejects(
        () => checkInventory(dir, mode),
        (error) => {
            assert.ok(error instanceof Error, "checkInventory should throw an Error");
            assert.match(error.message, pattern);
            return true;
        },
    );
}

function markdownPage({ title, featureIds, pending, body }) {
    const idBlock = featureIds.length === 0
        ? "feature_ids: []"
        : `feature_ids:\n${featureIds.map((id) => `  - ${id}`).join("\n")}`;
    const pendingLine = pending === undefined ? "" : `\ntranslation_pending: ${pending}`;
    return `---
title: ${title}
${idBlock}
pinned_commit: ${PIN}
stub: false${pendingLine}
---

${body}
`;
}

async function writeFeatureLocales(dir, relativePath, featureIds, body) {
    const pages = [
        ["docs/cn", "中文页", false],
        ["docs/en", "English page", false],
        ["docs/ru", "Русская страница", false],
    ];
    for (const [locale, title, pending] of pages) {
        const file = path.join(dir, locale, relativePath);
        await mkdir(path.dirname(file), { recursive: true });
        await writeFile(file, markdownPage({ title, featureIds, pending, body }));
    }
}

test("schema mode accepts specification fields and rejects extra notes", async (t) => {
    const validDir = await stage(t);
    const features = await readJSONL(validDir, "inventory/features.jsonl");
    const issues = await readJSONL(validDir, "inventory/issues.jsonl");
    assert.deepEqual(Object.keys(features[0]), FEATURE_KEYS);
    assert.deepEqual(Object.keys(issues[0]), ISSUE_KEYS);
    await checkInventory(validDir, "schema");

    const featureNotes = await stage(t, async (dir) => {
        const records = await readJSONL(dir, "inventory/features.jsonl");
        records[0].notes = "not a specification field";
        await writeJSONL(dir, "inventory/features.jsonl", records);
    });
    await assertViolation(featureNotes, "schema", /notes|server\.port\.value|features\.jsonl/);

    const issueNotes = await stage(t, async (dir) => {
        const records = await readJSONL(dir, "inventory/issues.jsonl");
        records[0].notes = "not a specification field";
        await writeJSONL(dir, "inventory/issues.jsonl", records);
    });
    await assertViolation(issueNotes, "schema", /notes|issues\.jsonl|\b1\b/);
});

test("schema mode rejects two feature records that share an id", async (t) => {
    const dir = await stage(t, async (root) => {
        const records = await readJSONL(root, "inventory/features.jsonl");
        records.push({ ...records[0], title: "Duplicate server port" });
        await writeJSONL(root, "inventory/features.jsonl", records);
    });
    await assertViolation(dir, "schema", new RegExp(FEATURE_ID.replaceAll(".", "\\.")));
});

test("schema mode rejects a pinned_commit that does not match PIN", async (t) => {
    const dir = await stage(t, async (root) => {
        const records = await readJSONL(root, "inventory/features.jsonl");
        records[0].pinned_commit = "ffffffffffffffffffffffffffffffffffffffff";
        await writeJSONL(root, "inventory/features.jsonl", records);
    });
    await assertViolation(dir, "schema", /server\.port\.value|inventory\/PIN|\bPIN\b/);
});

test("schema mode passes when issues.jsonl does not exist", async (t) => {
    const dir = await stage(t, async (root) => {
        await unlink(path.join(root, "inventory/issues.jsonl"));
    });
    await checkInventory(dir, "schema");
});

test("full mode accepts the valid fixture, including YOUR_API_KEY placeholders", async (t) => {
    const dir = await stage(t);
    const page = await readFile(path.join(dir, "docs/cn/operations/server.md"), "utf8");
    assert.match(page, /YOUR_API_KEY/);
    assert.match(page, /Bearer YOUR_API_KEY/);
    assert.doesNotMatch(page, new RegExp(SK_SECRET));
    assert.doesNotMatch(page, new RegExp(BEARER_SECRET));
    await checkInventory(dir, "full");
});

test("full mode rejects one covered id listed in two feature_ids", async (t) => {
    const dir = await stage(t, async (root) => {
        await writeFeatureLocales(
            root,
            "operations/other.md",
            [FEATURE_ID],
            "Second page claiming the same feature.",
        );
    });
    await assertViolation(dir, "full", /server\.port\.value/);
});

test("experience feature_ids do not count as ownership", async (t) => {
    const dir = await stage(t, async (root) => {
        await writeFeatureLocales(
            root,
            "operations/server.md",
            [],
            "使用 YOUR_API_KEY 或 Bearer YOUR_API_KEY 调用接口。",
        );
        const page = `---
title: 端口经验
feature_ids:
  - server.port.value
pinned_commit: ${PIN}
stub: false
translation_pending: false
---

本页误把功能 ID 写成归属。
`;
        for (const locale of ["docs/cn", "docs/en", "docs/ru"]) {
            const experience = path.join(root, locale, "experience/exp.server.port.md");
            await mkdir(path.dirname(experience), { recursive: true });
            await writeFile(experience, page);
        }
    });
    await assertViolation(dir, "full", /server\.port\.value|docs\/cn\/experience\//);
});

test("full mode accepts an experience page that uses related_feature_ids", async (t) => {
    const dir = await stage(t, async (root) => {
        const issues = await readJSONL(root, "inventory/issues.jsonl");
        issues[0].experience_id = "exp.server.port";
        await writeJSONL(root, "inventory/issues.jsonl", issues);
        const page = `---
title: 端口经验
experience_id: exp.server.port
related_feature_ids:
  - server.port.value
source_issues:
  - 1
pinned_commit: ${PIN}
stub: false
translation_pending: false
---

本页只关联功能，不作为归属页。
`;
        for (const locale of ["docs/cn", "docs/en", "docs/ru"]) {
            const experience = path.join(root, locale, "experience/exp.server.port.md");
            await mkdir(path.dirname(experience), { recursive: true });
            await writeFile(experience, page);
        }
    });
    await checkInventory(dir, "full");
});

test("full mode rejects translation_ready when the English page is translation_pending", async (t) => {
    const pending = await stage(t, async (root) => {
        const records = await readJSONL(root, "inventory/features.jsonl");
        records[0].translation_ready = true;
        records[0].status = "covered";
        await writeJSONL(root, "inventory/features.jsonl", records);
        const file = path.join(root, "docs/en/operations/server.md");
        const text = await readFile(file, "utf8");
        await writeFile(file, text.replace("translation_pending: false", "translation_pending: true"));
    });
    await assertViolation(
        pending,
        "full",
        /server\.port\.value|docs\/en\/operations\/server\.md/,
    );

    const ready = await stage(t, async (root) => {
        const records = await readJSONL(root, "inventory/features.jsonl");
        records[0].translation_ready = true;
        records[0].status = "covered";
        await writeJSONL(root, "inventory/features.jsonl", records);
    });
    await checkInventory(ready, "full");
});

test("full mode rejects secret-shaped markdown and accepts placeholders", async (t) => {
    const skDir = await stage(t, async (root) => {
        const file = path.join(root, "docs/cn/operations/server.md");
        const text = await readFile(file, "utf8");
        await writeFile(file, `${text}\n${SK_SECRET}\n`);
    });
    await assertViolation(skDir, "full", /docs\/cn\/operations\/server\.md/);

    const bearerDir = await stage(t, async (root) => {
        const file = path.join(root, "docs/cn/operations/server.md");
        const text = await readFile(file, "utf8");
        await writeFile(file, `${text}\n${BEARER_SECRET}\n`);
    });
    await assertViolation(bearerDir, "full", /docs\/cn\/operations\/server\.md/);

    const placeholders = await stage(t);
    await checkInventory(placeholders, "full");
});

test("curl in docs/cn/management/api.md fails only when management.v0.deprecated is deprecated", async (t) => {
    async function addV0(root, status) {
        const records = await readJSONL(root, "inventory/features.jsonl");
        records.push({
            id: V0_ID,
            kind: "management",
            title: "Management API v0",
            source: "internal/api/server_management.go",
            behavior: "The v0 management API is no longer maintained.",
            defaults: "",
            canonical_page: "docs/cn/management/api.md",
            legacy_urls: [],
            status,
            pinned_commit: PIN,
            translation_ready: false,
        });
        await writeJSONL(root, "inventory/features.jsonl", records);
        await writeFeatureLocales(root, "management/api.md", [V0_ID], "Deprecated management API.");
        const cnPage = path.join(root, "docs/cn/management/api.md");
        const page = await readFile(cnPage, "utf8");
        await writeFile(cnPage, `${page}\ncurl https://example.invalid/v0/management\n`);
    }

    const deprecated = await stage(t, async (root) => {
        await addV0(root, "deprecated");
    });
    await assertViolation(deprecated, "full", /docs\/cn\/management\/api\.md|management\.v0\.deprecated/);

    const stale = await stage(t, async (root) => {
        await addV0(root, "stale");
    });
    await checkInventory(stale, "full");
});

test("full mode rejects sidebar link sets that differ across locales", async (t) => {
    const dir = await stage(t, async (root) => {
        const file = path.join(root, "docs/.vitepress/config.mts");
        const text = await readFile(file, "utf8");
        const next = text.replace("link: '/ru/operations/server'", "link: '/ru/operations/other'");
        assert.notEqual(next, text);
        await writeFile(file, next);
    });
    await assertViolation(dir, "full", /docs\/\.vitepress\/config\.mts|docs\/cn\/config\.ts/);
});
