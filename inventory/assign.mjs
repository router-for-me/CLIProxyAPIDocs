// Assign each feature id to one Chinese manual page.
// Overrides win, then the first shared-contract row, then a leaf-prefix split
// when a page would own more than 25 ids. Unmatched ids throw; there is no
// fallback page.

const SPLIT_LIMIT = 25;

const PLUGIN_PREFIXES = [
    ["plugin.model-registrar.", "docs/cn/plugin/model-registrar.md"],
    ["plugin.model-provider.", "docs/cn/plugin/model-provider.md"],
    ["plugin.auth-provider.", "docs/cn/plugin/auth-provider.md"],
    ["plugin.frontend-auth-provider.", "docs/cn/plugin/frontend-auth-provider.md"],
    ["plugin.scheduler.", "docs/cn/plugin/scheduler.md"],
    ["plugin.model-router.", "docs/cn/plugin/model-router.md"],
    ["plugin.provider-executor.", "docs/cn/plugin/executor.md"],
    ["plugin.request-translator.", "docs/cn/plugin/request-translator.md"],
    ["plugin.request-normalizer.", "docs/cn/plugin/request-normalizer.md"],
    ["plugin.request-interceptor.", "docs/cn/plugin/request-interceptor.md"],
    ["plugin.request-lifecycle-plugin.", "docs/cn/plugin/request-lifecycle.md"],
    ["plugin.response-translator.", "docs/cn/plugin/response-translator.md"],
    ["plugin.response-normalizer.", "docs/cn/plugin/response-normalizer.md"],
    ["plugin.response-interceptor.", "docs/cn/plugin/response-interceptor.md"],
    ["plugin.stream-chunk-interceptor.", "docs/cn/plugin/response-stream-interceptor.md"],
    ["plugin.websocket-response-observer.", "docs/cn/plugin/websocket-observer.md"],
    ["plugin.thinking-applier.", "docs/cn/plugin/thinking-applier.md"],
    ["plugin.usage-plugin.", "docs/cn/plugin/usage-plugin.md"],
    ["plugin.command-line-plugin.", "docs/cn/plugin/command-line-plugin.md"],
    ["plugin.management-api.", "docs/cn/plugin/management-api.md"],
    ["plugin.management-handler.", "docs/cn/plugin/management-api.md"],
    ["plugin.quota-provider.", "docs/cn/plugin/quota-provider.md"],
    ["plugin.host-http-client.", "docs/cn/plugin/host-callbacks.md"],
];

const ACCOUNT_FLAGS = new Set([
    "cli.server.codex-login",
    "cli.server.codex-device-login",
    "cli.server.claude-login",
    "cli.server.antigravity-login",
    "cli.server.kimi-login",
    "cli.server.kimi-ai-login",
    "cli.server.xai-login",
    "cli.server.devin-login",
    "cli.server.meta-login",
    "cli.server.vertex-import",
]);

const CHAT_ROUTES = new Set([
    "route.v1.post-chat-completions",
    "route.v1.post-completions",
    "route.v1.get-models",
]);

// gemini.md exists on disk but is not an assignment target.
const PROVIDER_STEMS = [
    "antigravity",
    "claude-code",
    "codex",
    "xai",
    "ai-studio",
    "openai-compatibility",
    "claude-code-compatibility",
    "gemini-compatibility",
    "codex-compatibility",
].sort((left, right) => right.length - left.length || left.localeCompare(right));

const HTTP_METHODS = ["connect", "options", "delete", "handle", "patch", "trace", "head", "post", "get", "put", "any"]
    .sort((left, right) => right.length - left.length);

function parts(id) {
    const segments = String(id).split(".");
    return {
        area: segments[0] ?? "",
        subject: segments[1] ?? "",
        leaf: segments.slice(2).join("."),
    };
}

function compact(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function interfaceKebab(subject) {
    return subject
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function containsAny(id, words) {
    return words.some((word) => id.includes(word));
}

function matchProviderToken(token) {
    const folded = compact(token);
    if (folded === "") {
        return "";
    }
    for (const stem of PROVIDER_STEMS) {
        if (compact(stem) === folded) {
            return stem;
        }
    }
    return "";
}

function matchProviderPrefix(leaf) {
    for (const stem of PROVIDER_STEMS) {
        if (leaf === stem || leaf.startsWith(`${stem}-`)) {
            return stem;
        }
    }
    const foldedFirst = compact(leaf.split("-")[0] ?? "");
    for (const stem of PROVIDER_STEMS) {
        if (compact(stem) === foldedFirst) {
            return stem;
        }
    }
    return "";
}

function providerPage(id) {
    const { area, subject, leaf } = parts(id);
    const stem = area === "upstream"
        ? matchProviderToken(subject)
        : subject === "providers"
            ? matchProviderPrefix(leaf)
            : matchProviderToken(subject);
    if (stem) {
        return `docs/cn/configuration/provider/${stem}.md`;
    }
    return area === "upstream"
        ? "docs/cn/accounts/upstream.md"
        : "docs/cn/accounts/oauth.md";
}

function accountProvider(id) {
    if (id === "cli.server.vertex-import") {
        return "vertex";
    }
    if (id.startsWith("auth.")) {
        return parts(id).subject;
    }
    // Login flags keep subject "server", so the provider is taken from the leaf.
    const leaf = parts(id).leaf;
    if (leaf.endsWith("-device-login")) {
        return leaf.slice(0, -"-device-login".length);
    }
    if (leaf.endsWith("-login")) {
        return leaf.slice(0, -"-login".length);
    }
    if (leaf.endsWith("-import")) {
        return leaf.slice(0, -"-import".length);
    }
    return parts(id).subject;
}

function pluginPage(id) {
    for (const [prefix, page] of PLUGIN_PREFIXES) {
        if (id.startsWith(prefix)) {
            return page;
        }
    }
    const subject = interfaceKebab(parts(id).subject);
    if (subject === "") {
        return "";
    }
    return `docs/cn/plugin/${subject}.md`;
}

function pathAfterMethod(leaf) {
    for (const method of HTTP_METHODS) {
        if (leaf === method) {
            return "";
        }
        if (leaf.startsWith(`${method}-`)) {
            return leaf.slice(method.length + 1);
        }
    }
    return leaf;
}

function managementV8Page(id) {
    const leaf = parts(id).leaf;
    const pathPart = pathAfterMethod(leaf);
    // `management.v8.get-config` stores the HTTP method in the leaf.
    if (leaf.startsWith("config") || pathPart.startsWith("config")) {
        return "docs/cn/management/apiv8.md";
    }
    const first = pathPart.split("-").find((segment) => segment !== "") || "root";
    return `docs/cn/management/v8-${first}.md`;
}

function matchPage(id) {
    if (id === "management.v0.deprecated") {
        return "docs/cn/management/api.md";
    }
    if (id.startsWith("plugin.")) {
        return pluginPage(id);
    }
    if (id.startsWith("auth.") || ACCOUNT_FLAGS.has(id)) {
        const provider = accountProvider(id);
        return provider === "" ? "" : `docs/cn/accounts/${provider}.md`;
    }
    if (id.startsWith("models.")) {
        return "docs/cn/introduction/models.md";
    }
    if (id.startsWith("server.")) {
        const { subject, leaf } = parts(id);
        // `server.tls.enable` keeps tls in the subject. Leaves may also start with tls.
        if (subject.startsWith("tls") || leaf.startsWith("tls")) {
            return "docs/cn/operations/tls.md";
        }
        if (subject.includes("discovery") || leaf.includes("discovery")) {
            return "docs/cn/operations/discovery.md";
        }
        return "docs/cn/operations/server.md";
    }
    if (id.startsWith("access.")) {
        return "docs/cn/api/access.md";
    }
    if (id.startsWith("routing.")) {
        return id.includes("cool")
            ? "docs/cn/routing/cooldown.md"
            : "docs/cn/routing/strategy.md";
    }
    if (id.startsWith("requests.")) {
        return "docs/cn/routing/requests.md";
    }
    if (id.startsWith("client.")) {
        return "docs/cn/routing/client.md";
    }
    if (id.startsWith("upstream.") || id.startsWith("oauth.")) {
        return providerPage(id);
    }
    if (id.startsWith("multimedia.") || (id.startsWith("route.") && containsAny(id, ["images", "audio", "videos", "tts"]))) {
        return "docs/cn/api/media.md";
    }
    if (CHAT_ROUTES.has(id)) {
        return "docs/cn/api/openai-chat.md";
    }
    if (id.startsWith("route.") && (id.includes("responses") || id.startsWith("route.backend-api."))) {
        return "docs/cn/api/responses.md";
    }
    if (id.startsWith("route.") && id.includes("messages")) {
        return "docs/cn/api/claude-messages.md";
    }
    if (id.startsWith("route.v1beta.")) {
        return "docs/cn/api/gemini.md";
    }
    if (id.startsWith("route.") && (id.includes("realtime") || id.includes("-live"))) {
        return "docs/cn/api/realtime.md";
    }
    if (id.startsWith("route.healthz.") || id.startsWith("route.keep-alive.") || id.startsWith("route.root.")) {
        return "docs/cn/operations/health.md";
    }
    if (id.startsWith("route.") && id.includes("callback")) {
        return "docs/cn/accounts/oauth-callback.md";
    }
    if (id.startsWith("route.")) {
        return "docs/cn/api/openai-other.md";
    }
    if (id.includes("thinking")) {
        return "docs/cn/configuration/thinking.md";
    }
    if (id.includes("hot-reload")) {
        return "docs/cn/configuration/hot-reloading.md";
    }
    if (id.includes("auth-dir") || id.includes("authdir")) {
        return "docs/cn/configuration/auth-dir.md";
    }
    if (id.includes("postgres") || id.includes("pgsql")) {
        return "docs/cn/configuration/storage/pgsql.md";
    }
    if (id.includes("object-store") || id.startsWith("s3.")) {
        return "docs/cn/configuration/storage/s3.md";
    }
    if (id.includes(".git.") || parts(id).subject === "git") {
        return "docs/cn/configuration/storage/git.md";
    }
    if (id.startsWith("management.v8.")) {
        return managementV8Page(id);
    }
    if (id.startsWith("observability.")) {
        return "docs/cn/operations/observability.md";
    }
    if (id.startsWith("plugins.")) {
        return "docs/cn/operations/plugins.md";
    }
    if (id.startsWith("management.")) {
        return "docs/cn/operations/management-settings.md";
    }
    if (
        id.startsWith("mode.tui.")
        || id === "cli.server.tui"
        || id === "cli.server.standalone"
        || id === "cli.server.management-base-url"
    ) {
        return "docs/cn/operations/tui.md";
    }
    if (
        id.startsWith("mode.home.")
        || id === "cli.server.home-jwt"
        || id === "cli.server.home-disable-cluster-discovery"
    ) {
        return "docs/cn/operations/home.md";
    }
    if (id.startsWith("mode.docker.")) {
        return "docs/cn/docker/docker.md";
    }
    if (id.startsWith("cli.server.")) {
        return "docs/cn/introduction/install.md";
    }
    return "";
}

function resolvePage(record, overrides) {
    const id = record.id;
    if (Object.prototype.hasOwnProperty.call(overrides, id)) {
        const override = overrides[id];
        if (typeof override === "string" && override !== "") {
            return override;
        }
    }
    const page = matchPage(String(id));
    if (!page) {
        throw new Error(`unmatched feature id: ${id}`);
    }
    return page;
}

function leafWord(id) {
    const leaf = parts(id).leaf;
    const dash = leaf.indexOf("-");
    const word = dash === -1 ? leaf : leaf.slice(0, dash);
    if (!/^[a-z0-9]+$/.test(word)) {
        throw new Error(`cannot split feature id: ${id}`);
    }
    return word;
}

function splitPage(page, word) {
    const slash = page.lastIndexOf("/");
    const directory = slash === -1 ? "" : page.slice(0, slash);
    const file = slash === -1 ? page : page.slice(slash + 1);
    const stem = file.endsWith(".md") ? file.slice(0, -3) : file;
    const next = `${stem}-${word}.md`;
    return directory === "" ? next : `${directory}/${next}`;
}

function splitOverflow(records, pages) {
    const groups = new Map();
    for (let index = 0; index < pages.length; index += 1) {
        const page = pages[index];
        if (!groups.has(page)) {
            groups.set(page, []);
        }
        groups.get(page).push(index);
    }
    const finalPages = pages.slice();
    for (const [page, indexes] of groups) {
        if (indexes.length <= SPLIT_LIMIT) {
            continue;
        }
        for (const index of indexes) {
            finalPages[index] = splitPage(page, leafWord(records[index].id));
        }
    }
    return finalPages;
}

function cloneRecord(record, canonicalPage) {
    const copy = { ...record, canonical_page: canonicalPage };
    if (Array.isArray(record.legacy_urls)) {
        copy.legacy_urls = record.legacy_urls.slice();
    }
    return copy;
}

export function assignPages(records, overrides = {}) {
    if (!Array.isArray(records)) {
        throw new Error("records must be an array");
    }
    const overrideMap = overrides ?? {};
    const pages = records.map((record) => resolvePage(record, overrideMap));
    const finalPages = splitOverflow(records, pages);
    return records.map((record, index) => cloneRecord(record, finalPages[index]));
}
