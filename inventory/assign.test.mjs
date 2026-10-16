import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { assignPages } from "./assign.mjs";

const PROVIDER_PAGE = /^docs\/cn\/configuration\/provider\/(antigravity|claude-code|codex|xai|ai-studio|openai-compatibility|claude-code-compatibility|gemini-compatibility|codex-compatibility)\.md$/;

function record(id, extra = {}) {
    return {
        id,
        kind: "config",
        title: id,
        source: "fixture",
        behavior: "",
        defaults: "",
        canonical_page: "",
        legacy_urls: [],
        status: "missing",
        pinned_commit: "",
        translation_ready: false,
        ...extra,
        id,
    };
}

function pagesById(records, overrides = {}) {
    const assigned = assignPages(records, overrides);
    assert.equal(assigned.length, records.length);
    assert.notEqual(assigned, records);
    const pages = new Map();
    for (let index = 0; index < records.length; index += 1) {
        assert.notEqual(assigned[index], records[index]);
        assert.equal(assigned[index].id, records[index].id);
        pages.set(assigned[index].id, assigned[index].canonical_page);
    }
    assert.equal(pages.size, records.length);
    return pages;
}

test("sample ids use the shared-contract pages", () => {
    const pages = pagesById([
        record("management.v0.deprecated"),
        record("plugin.auth-provider.parse-auth"),
        record("route.healthz.get"),
    ]);
    assert.equal(pages.get("management.v0.deprecated"), "docs/cn/management/api.md");
    assert.equal(pages.get("plugin.auth-provider.parse-auth"), "docs/cn/plugin/auth-provider.md");
    assert.equal(pages.get("route.healthz.get"), "docs/cn/operations/health.md");
});

test("overrides replace the shared-contract table", () => {
    const records = [
        record("management.v0.deprecated"),
        record("plugin.auth-provider.parse-auth"),
        record("route.healthz.get"),
        record("zz.unknown.value"),
    ];
    const overrides = {
        "route.healthz.get": "docs/cn/operations/custom-health.md",
        "zz.unknown.value": "docs/cn/custom/unknown.md",
    };
    const pages = pagesById(records, overrides);
    assert.equal(pages.get("management.v0.deprecated"), "docs/cn/management/api.md");
    assert.equal(pages.get("plugin.auth-provider.parse-auth"), "docs/cn/plugin/auth-provider.md");
    assert.equal(pages.get("route.healthz.get"), "docs/cn/operations/custom-health.md");
    assert.equal(pages.get("zz.unknown.value"), "docs/cn/custom/unknown.md");
    assert.deepEqual(overrides, {
        "route.healthz.get": "docs/cn/operations/custom-health.md",
        "zz.unknown.value": "docs/cn/custom/unknown.md",
    });
});

test("twenty-six ids that share a prefix split by the leaf word", () => {
    const records = [];
    for (let index = 1; index <= 13; index += 1) {
        records.push(record(`plugin.auth-provider.alpha-${index}`, { status: index === 1 ? "stale" : "missing" }));
        records.push(record(`plugin.auth-provider.beta-${index}`));
    }
    assert.equal(records.length, 26);
    const inputIds = records.map((item) => item.id);
    const assigned = assignPages(records, {});
    const ids = assigned.map((item) => item.id);
    assert.deepEqual(ids, inputIds);
    assert.equal(new Set(ids).size, 26);
    const pages = [...new Set(assigned.map((item) => item.canonical_page))].sort();
    assert.deepEqual(pages, [
        "docs/cn/plugin/auth-provider-alpha.md",
        "docs/cn/plugin/auth-provider-beta.md",
    ]);
    assert.equal(assigned[0].status, "stale");
    assert.equal(records[0].status, "stale");
    assert.equal(records[0].canonical_page, "");
});

test("twenty-five ids that share a prefix stay on the original page", () => {
    const records = [];
    for (let index = 1; index <= 25; index += 1) {
        records.push(record(`plugin.scheduler.alpha-${index}`));
    }
    const pages = [...pagesById(records).values()];
    assert.deepEqual([...new Set(pages)], ["docs/cn/plugin/scheduler.md"]);
});

test("an overflow page moves every id off the original file", () => {
    const records = [];
    for (let index = 1; index <= 26; index += 1) {
        records.push(record(`access.pool.item-${index}`));
    }
    const pages = [...pagesById(records).values()];
    assert.deepEqual([...new Set(pages)], ["docs/cn/api/access-item.md"]);
});

test("an unmatched id throws an Error that names the id", () => {
    assert.throws(
        () => assignPages([
            record("route.healthz.get"),
            record("zz.unknown.value"),
        ], {}),
        (error) => {
            assert.ok(error instanceof Error);
            assert.equal(error.name, "Error");
            assert.match(error.message, /zz\.unknown\.value/);
            return true;
        },
    );
});

test("assignPages does not mutate its arguments", () => {
    const urls = Object.freeze(["docs/old"]);
    const records = [Object.freeze(record("route.healthz.get", {
        status: "stale",
        canonical_page: "docs/cn/old.md",
        legacy_urls: urls,
        translation_ready: true,
    }))];
    const overrides = Object.freeze({});
    const assigned = assignPages(records, overrides);
    assigned[0].legacy_urls.push("docs/new");
    assigned[0].status = "covered";
    assert.equal(records[0].canonical_page, "docs/cn/old.md");
    assert.equal(records[0].status, "stale");
    assert.equal(records[0].translation_ready, true);
    assert.deepEqual(records[0].legacy_urls, ["docs/old"]);
    assert.equal(assigned[0].canonical_page, "docs/cn/operations/health.md");
    assert.deepEqual(overrides, {});
});

test("shared-contract rows match in order", () => {
    const expected = new Map([
        ["plugin.model-registrar.register-models", "docs/cn/plugin/model-registrar.md"],
        ["plugin.model-provider.static-models", "docs/cn/plugin/model-provider.md"],
        ["plugin.auth-provider.parse-auth", "docs/cn/plugin/auth-provider.md"],
        ["plugin.frontend-auth-provider.authenticate", "docs/cn/plugin/frontend-auth-provider.md"],
        ["plugin.scheduler.pick", "docs/cn/plugin/scheduler.md"],
        ["plugin.model-router.route-model", "docs/cn/plugin/model-router.md"],
        ["plugin.provider-executor.execute", "docs/cn/plugin/executor.md"],
        ["plugin.request-translator.translate-request", "docs/cn/plugin/request-translator.md"],
        ["plugin.request-normalizer.normalize-request", "docs/cn/plugin/request-normalizer.md"],
        ["plugin.request-interceptor.intercept-request-before-auth", "docs/cn/plugin/request-interceptor.md"],
        ["plugin.request-lifecycle-plugin.handle-request-complete", "docs/cn/plugin/request-lifecycle.md"],
        ["plugin.response-translator.translate-response", "docs/cn/plugin/response-translator.md"],
        ["plugin.response-normalizer.normalize-response", "docs/cn/plugin/response-normalizer.md"],
        ["plugin.response-interceptor.intercept-response", "docs/cn/plugin/response-interceptor.md"],
        ["plugin.stream-chunk-interceptor.intercept-stream-chunk", "docs/cn/plugin/response-stream-interceptor.md"],
        ["plugin.websocket-response-observer.observe-web-socket-response-event", "docs/cn/plugin/websocket-observer.md"],
        ["plugin.thinking-applier.apply-thinking", "docs/cn/plugin/thinking-applier.md"],
        ["plugin.usage-plugin.handle-usage", "docs/cn/plugin/usage-plugin.md"],
        ["plugin.command-line-plugin.execute-command-line", "docs/cn/plugin/command-line-plugin.md"],
        ["plugin.management-api.register-management", "docs/cn/plugin/management-api.md"],
        ["plugin.management-handler.handle-management", "docs/cn/plugin/management-api.md"],
        ["plugin.quota-provider.fetch-quota", "docs/cn/plugin/quota-provider.md"],
        ["plugin.host-http-client.do", "docs/cn/plugin/host-callbacks.md"],
        ["plugin.not-listed.run", "docs/cn/plugin/not-listed.md"],
        ["auth.codex.login", "docs/cn/accounts/codex.md"],
        ["cli.server.codex-login", "docs/cn/accounts/codex.md"],
        ["cli.server.codex-device-login", "docs/cn/accounts/codex.md"],
        ["cli.server.claude-login", "docs/cn/accounts/claude.md"],
        ["cli.server.kimi-login", "docs/cn/accounts/kimi.md"],
        ["cli.server.kimi-ai-login", "docs/cn/accounts/kimi-ai.md"],
        ["cli.server.xai-login", "docs/cn/accounts/xai.md"],
        ["cli.server.vertex-import", "docs/cn/accounts/vertex.md"],
        ["cli.server.vertex-import-prefix", "docs/cn/introduction/install.md"],
        ["models.catalog.value", "docs/cn/introduction/models.md"],
        ["server.tls.enable", "docs/cn/operations/tls.md"],
        ["server.tls.cert", "docs/cn/operations/tls.md"],
        ["server.discovery.enabled", "docs/cn/operations/discovery.md"],
        ["server.port.value", "docs/cn/operations/server.md"],
        ["access.providers.value", "docs/cn/api/access.md"],
        ["routing.cooldown.disable-cooling", "docs/cn/routing/cooldown.md"],
        ["routing.retry.request-retry", "docs/cn/routing/strategy.md"],
        ["routing.strategy.value", "docs/cn/routing/strategy.md"],
        ["requests.proxy-url.value", "docs/cn/routing/requests.md"],
        ["client.codex.optimize-multi-agent-v2", "docs/cn/routing/client.md"],
        ["upstream.codex.disable-codex-cloaking", "docs/cn/configuration/provider/codex.md"],
        ["upstream.xai.inject-x-search", "docs/cn/configuration/provider/xai.md"],
        ["upstream.claude.disable-claude-cloak-mode", "docs/cn/accounts/upstream.md"],
        ["upstream.gemini.key", "docs/cn/accounts/upstream.md"],
        ["upstream.claude-code.foo", "docs/cn/configuration/provider/claude-code.md"],
        ["oauth.providers.aistudio-ws-auth", "docs/cn/configuration/provider/ai-studio.md"],
        ["oauth.providers.antigravity-signature-cache-enabled", "docs/cn/configuration/provider/antigravity.md"],
        ["oauth.providers.codex-header-defaults-user-agent", "docs/cn/configuration/provider/codex.md"],
        ["oauth.providers.codex-compatibility-base-url", "docs/cn/configuration/provider/codex-compatibility.md"],
        ["oauth.providers.openai-compatibility-base-url", "docs/cn/configuration/provider/openai-compatibility.md"],
        ["oauth.providers.claude-code-compatibility-base-url", "docs/cn/configuration/provider/claude-code-compatibility.md"],
        ["oauth.providers.gemini-compatibility-base-url", "docs/cn/configuration/provider/gemini-compatibility.md"],
        ["oauth.providers.devin-sensitive-words", "docs/cn/accounts/oauth.md"],
        ["oauth.model-alias.name", "docs/cn/accounts/oauth.md"],
        ["oauth.auth-dir.value", "docs/cn/accounts/oauth.md"],
        ["multimedia.disable-image-generation.value", "docs/cn/api/media.md"],
        ["route.v1.post-images-generations", "docs/cn/api/media.md"],
        ["route.v1.post-audio-speech", "docs/cn/api/media.md"],
        ["route.v1.post-videos", "docs/cn/api/media.md"],
        ["route.v1.post-tts", "docs/cn/api/media.md"],
        ["route.openai.post-v1-videos", "docs/cn/api/media.md"],
        ["route.v1.post-chat-completions", "docs/cn/api/openai-chat.md"],
        ["route.v1.post-completions", "docs/cn/api/openai-chat.md"],
        ["route.v1.get-models", "docs/cn/api/openai-chat.md"],
        ["route.v1.get-models-model", "docs/cn/api/openai-other.md"],
        ["route.v1.get-responses", "docs/cn/api/responses.md"],
        ["route.v1.post-responses", "docs/cn/api/responses.md"],
        ["route.backend-api.post-codex-responses", "docs/cn/api/responses.md"],
        ["route.backend-api.post-codex-alpha-search", "docs/cn/api/responses.md"],
        ["route.v1.post-messages", "docs/cn/api/claude-messages.md"],
        ["route.v1.post-messages-count-tokens", "docs/cn/api/claude-messages.md"],
        ["route.v1beta.get-models", "docs/cn/api/gemini.md"],
        ["route.v1beta.post-models-action", "docs/cn/api/gemini.md"],
        ["route.v1.get-realtime", "docs/cn/api/realtime.md"],
        ["route.v1.post-live", "docs/cn/api/realtime.md"],
        ["route.v1.get-live-call-id", "docs/cn/api/realtime.md"],
        ["route.v1.post-realtime-transcription-sessions", "docs/cn/api/realtime.md"],
        ["route.healthz.get", "docs/cn/operations/health.md"],
        ["route.healthz.head", "docs/cn/operations/health.md"],
        ["route.keep-alive.get", "docs/cn/operations/health.md"],
        ["route.root.get", "docs/cn/operations/health.md"],
        ["route.codex.get-callback", "docs/cn/accounts/oauth-callback.md"],
        ["route.callback.get", "docs/cn/accounts/oauth-callback.md"],
        ["route.v1.post-alpha-search", "docs/cn/api/openai-other.md"],
        ["route.management-html.get", "docs/cn/api/openai-other.md"],
        ["payload.rules.thinking", "docs/cn/configuration/thinking.md"],
        ["cli.server.thinking-budget", "docs/cn/configuration/thinking.md"],
        ["watcher.hot-reloading.enabled", "docs/cn/configuration/hot-reloading.md"],
        ["watcher.hot-reload.enabled", "docs/cn/configuration/hot-reloading.md"],
        ["storage.auth-dir.value", "docs/cn/configuration/auth-dir.md"],
        ["storage.authdir.value", "docs/cn/configuration/auth-dir.md"],
        ["storage.postgres.value", "docs/cn/configuration/storage/pgsql.md"],
        ["db.pgsql.value", "docs/cn/configuration/storage/pgsql.md"],
        ["storage.object-store.bucket", "docs/cn/configuration/storage/s3.md"],
        ["s3.bucket.value", "docs/cn/configuration/storage/s3.md"],
        ["storage.git.value", "docs/cn/configuration/storage/git.md"],
        ["backup.git.remote", "docs/cn/configuration/storage/git.md"],
        ["management.v8.get-config", "docs/cn/management/apiv8.md"],
        ["management.v8.put-config-yaml", "docs/cn/management/apiv8.md"],
        ["management.v8.delete-config-path", "docs/cn/management/apiv8.md"],
        ["management.v8.get-server-latest-version", "docs/cn/management/v8-server.md"],
        ["management.v8.post-requests-api-call", "docs/cn/management/v8-requests.md"],
        ["management.v8.post-routing-cooldown-reset", "docs/cn/management/v8-routing.md"],
        ["management.v8.get-observability-logs", "docs/cn/management/v8-observability.md"],
        ["management.v8.get-credentials", "docs/cn/management/v8-credentials.md"],
        ["management.v8.get-oauth-callback", "docs/cn/management/v8-oauth.md"],
        ["management.v8.get-plugins", "docs/cn/management/v8-plugins.md"],
        ["observability.logs.debug", "docs/cn/operations/observability.md"],
        ["plugins.enabled.value", "docs/cn/operations/plugins.md"],
        ["management.allow-remote.value", "docs/cn/operations/management-settings.md"],
        ["mode.tui.start", "docs/cn/operations/tui.md"],
        ["cli.server.tui", "docs/cn/operations/tui.md"],
        ["cli.server.standalone", "docs/cn/operations/tui.md"],
        ["cli.server.management-base-url", "docs/cn/operations/tui.md"],
        ["mode.home.jwt", "docs/cn/operations/home.md"],
        ["cli.server.home-jwt", "docs/cn/operations/home.md"],
        ["cli.server.home-disable-cluster-discovery", "docs/cn/operations/home.md"],
        ["mode.docker.compose", "docs/cn/docker/docker.md"],
        ["cli.server.config", "docs/cn/introduction/install.md"],
        ["cli.server.discover", "docs/cn/introduction/install.md"],
    ]);
    const pages = pagesById([...expected.keys()].map((id) => record(id)));
    for (const [id, page] of expected) {
        assert.equal(pages.get(id), page, id);
    }
    for (const page of pages.values()) {
        if (page.startsWith("docs/cn/configuration/provider/")) {
            assert.match(page, PROVIDER_PAGE, page);
        }
        assert.notEqual(page, "docs/cn/configuration/provider/gemini.md");
    }
});

test("page-overrides.json starts as an empty object", () => {
    const file = path.join(import.meta.dirname, "page-overrides.json");
    assert.deepEqual(JSON.parse(readFileSync(file, "utf8")), {});
});
