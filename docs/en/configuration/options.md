# Configuration Options

Defaults and available fields follow the v8 layout in `config.example.yaml`.

Set `config-version` to `8` for a v8 file. Existing legacy files and `/v0/management` requests still work. When both a v8 field and its legacy spelling are present, the v8 value wins, including `false`, `0`, and empty collections, and the legacy field is removed on load or save. Legacy-only fields stay where they are until a successful configuration write through `/v8/management`. Setting `config-version: 8`, or reading the config, does not migrate a file by itself. A v8 management write rejects legacy field names and unknown root sections.

The root `api-keys` mapping is reserved for upstream provider groups. Client keys that used to live in the root `api-keys` list are now `access.api-keys`. Those two meanings cannot share one YAML key.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `config-version` | integer | — | Must be `8` when present. |

## Server

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `server.host` | string | `""` | Bind address. Empty listens on all IPv4 and IPv6 interfaces. Use `127.0.0.1` or `localhost` for local-only access. |
| `server.port` | integer | `8317` | Server port. `0` or a negative value also falls back to `8317`. |
| `server.trusted-proxies` | string[] | `[]` | IPs or CIDRs allowed to supply forwarded client-IP headers. Empty trusts none. Restart after changing it. |
| `server.tls.enable` | boolean | `false` | Enable HTTPS. |
| `server.tls.cert` / `server.tls.key` | string | `""` | TLS certificate and private-key paths. |
| `server.commercial-mode` | boolean | `false` | Disable high-overhead request logging and middleware to reduce memory use. |
| `server.discovery.enabled` | boolean | `false` | Advertise `_ai-gateway._tcp` with mDNS / DNS-SD. Docker must use host networking; link-local multicast does not cross the default bridge. |
| `server.discovery.service-name` | string | `""` | Optional name prefix. Advertised as `CPA-<ShortID>` or `<name>-<ShortID>`. |
| `server.discovery.service-type` | string | `"_ai-gateway._tcp"` | DNS-SD service type. |
| `server.discovery.subtypes` | string[] | chat, responses, messages, generate-content, interactions | API protocol subtypes. Each value includes the leading underscore, such as `_responses`. |
| `server.discovery.interfaces.include` / `exclude` | string[] | `[]` | Interface allow-list and extra exclusion patterns. An empty include list auto-detects physical interfaces. |
| `server.discovery.auth-required` | boolean | `true` | Advertise that clients must authenticate. |
| `server.discovery.advertise-management` | boolean | `false` | Advertise management availability. |

## Management

An empty `secret-key` disables `/v0/management` and `/v8/management` (404). Localhost access still requires the key.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `management.allow-remote` | boolean | `false` | Permit non-localhost management access. |
| `management.secret-key` | string | `""` | Management key. Plaintext is hashed on startup. |
| `management.disable-control-panel` | boolean | `false` | Disable bundled management-panel assets and routes. |
| `management.disable-auto-update-panel` | boolean | `false` | Disable periodic background panel updates. A missing panel is still fetched on first access. |
| `management.base-url` | string | `http://127.0.0.1:<port>` | Remote management base URL for `cliproxyapi --tui`. `--management-base-url` overrides it. |
| `management.panel-github-repository` | string | `"https://github.com/router-for-me/Cli-Proxy-API-Management-Center"` | Repository or releases API URL for the management panel bundle. |

## Access

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `access.api-keys` | string[] | `[]` | Client keys accepted by this proxy. These are not upstream provider keys. |

## Routing

`routing.strategy` accepts `round-robin` (default), `weighted-round-robin`, or `fill-first`. `weightedroundrobin`, `wrr`, `fillfirst`, and `ff` are aliases.

Weighted round-robin uses each credential's integer `weight`. Omitted means `1`, the maximum is `1,000,000`, and a non-positive weight excludes that credential while this strategy is active. For OAuth or file credentials, put a numeric `weight` at the top of the auth JSON.

An established session binding outranks credential priority. Priority still decides cold bindings, requests without a session, and rebinding after failover.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `routing.strategy` | string | `"round-robin"` | Credential selection strategy. |
| `routing.session-affinity` | boolean | `false` | Bind sessions to credentials. Explicit Claude Code, Codex, OpenCode, and pi session headers come first, then `prompt_cache_key`, Responses conversation IDs, legacy body IDs, execution or derived session identity, and the first-message hash. Failover stays enabled. |
| `routing.session-affinity-ttl` | string | `"1h"` | Session-to-credential binding TTL. Values below one second are raised to one second. |
| `routing.session-affinity-subagents` | boolean | `true` | Child sessions with a parent reference reuse the parent's credential across Claude, Codex, Antigravity, and Gemini. `false` spreads them with the fallback selector. Ignored when session affinity is off. |
| `routing.force-model-prefix` | boolean | `false` | Unprefixed model requests use only credentials without a prefix, except when the prefix equals the model name. |
| `routing.retry.request-retry` | integer | `3` | Additional credential rounds after round 0. Round `r` only admits credentials whose effective value is at least `r`. Applies to HTTP 403, 408, 429, 500, 502, 503, and 504. |
| `routing.retry.max-retry-credentials` | integer | `0` | Distinct credentials to try in each round after round filtering. `0` tries all eligible credentials. Skipped credentials still age with the global round. |
| `routing.retry.max-retry-interval` | integer | `30` | Maximum seconds to wait for cooldown between rounds. `0` or below never waits. It does not disable same-round failover or immediate rounds. |
| `routing.cooldown.disable-cooling` | boolean | `false` | Disable credential and model cooldown globally. A present credential or provider value overrides it. |
| `routing.cooldown.save-cooldown-status` | boolean | `false` | Persist cooldown state in `.cds` files next to auth files. |
| `routing.cooldown.transient-error-cooldown-seconds` | integer | `0` | Cooldown for transient 408, 500, 502, 503, 504, and 520–526 errors. `0` uses the legacy 60 seconds. `-1` disables it. |

Per-credential `request-retry`: an explicit non-negative value wins, `0` admits only round 0, and an omitted or negative value inherits `routing.retry.request-retry`.

## Requests

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `requests.proxy-url` | string | `""` | Global outbound proxy (`socks5`, `http`, or `https`). |
| `requests.passthrough-headers` | boolean | `false` | Forward filtered upstream response headers to clients. |
| `requests.nonstream-keepalive-interval` | integer | `0` | Emit blank lines every N seconds for non-streaming responses. `0` disables it. |
| `requests.streaming.keepalive-seconds` | integer | `0` | SSE keep-alive interval. Values `<= 0` disable it. |
| `requests.streaming.bootstrap-retries` | integer | `0` | Safe streaming retries before the first byte is sent. |

Per-entry `proxy-url` accepts `direct` or `none` to bypass both this proxy and environment proxies. Header values that start with `$` copy that client request header and are omitted when the client did not send it.

Payload rules live at `requests.payload`. See [Payload rules](#payload-rules).

## Multimedia

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `multimedia.disable-image-generation` | boolean \| `"chat"` \| `"passthrough"` | `false` | `true` disables image generation and makes `/v1/images/*` return 404. `"chat"` disables injection only outside image endpoints. `"passthrough"` leaves non-image client payloads unchanged and behaves as `"chat"` on image endpoints. |
| `multimedia.gpt-image-2-base-model` | string | `"gpt-5.4-mini"` | Base model for the legacy hosted image-generation path. It must start with `gpt-`. An invalid value uses the default. |
| `multimedia.video-result-auth-cache-ttl` | string | `"3h"` | How long video IDs from `/openai/v1/videos` and xAI video creation stay bound to the creating credential. |

## Observability

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `observability.logs.debug` | boolean | `false` | Enable debug logging. |
| `observability.logs.request-log` | boolean | `false` | Log proxy requests and responses. Management requests are excluded. |
| `observability.logs.logging-to-file` | boolean | `false` | Write rotating application logs instead of stdout. |
| `observability.logs.logs-max-total-size-mb` | integer | `0` | Total log-directory size limit in MB. `0` disables the limit. |
| `observability.logs.error-logs-max-files` | integer | `10` | Error-log files retained when request logging is disabled. `0` disables cleanup. |
| `observability.usage.usage-statistics-enabled` | boolean | `false` | Enable in-memory usage aggregation. |
| `observability.usage.redis-usage-queue-retention-seconds` | integer | `60` | Seconds to retain usage-queue items in memory for the Management API. Maximum `3600`. The local Redis RESP usage output is disabled. |
| `observability.pprof.enable` | boolean | `false` | Enable the pprof HTTP debug server. |
| `observability.pprof.addr` | string | `"127.0.0.1:8316"` | pprof bind address. Keep it local. |

## Plugins

Trusted in-process plugins are disabled by default. `plugins.configs.<plugin-id>.enabled` does not change `plugins.enabled`. `plugins.auth-revision` is Home-owned metadata, not an ordinary setting.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `plugins.enabled` | boolean | `false` | Enable dynamic plugins. |
| `plugins.dir` | string | `"plugins"` | Plugin discovery directory. |
| `plugins.store-sources` | string[] | `[]` | Extra plugin-store registry URLs. The official registry is always included. |
| `plugins.store-auth[].match` | string | `""` | URL prefix for one auth rule. HTTP requires `allow-insecure: true`. |
| `plugins.store-auth[].apply-to` | string[] | `[]` | Request kinds: `registry`, `metadata`, and/or `artifact`. |
| `plugins.store-auth[].type` | string | `""` | `none`, `bearer`, `basic`, `header`, or `github-token`. |
| `plugins.store-auth[].token-env` | string | `""` | Environment variable holding a bearer, GitHub, or other token. |
| `plugins.store-auth[].username-env` / `password-env` | string | `""` | Environment variables for basic authentication. |
| `plugins.store-auth[].header-name` / `header-value-env` | string | `""` | Header name and the environment variable holding its value. |
| `plugins.store-auth[].allow-insecure` | boolean | `false` | Allow insecure auth configuration where supported. |
| `plugins.configs.<plugin-id>.enabled` | boolean | `false` | Enable one plugin instance. |
| `plugins.configs.<plugin-id>.priority` | integer | `0` | Plugin startup and routing priority. |

Other keys under a plugin instance are preserved for that plugin.

## OAuth and file credentials

Settings under `oauth.providers` apply to OAuth and file-backed credentials. They do not apply to `api-keys` groups. Token material stays in the credential store.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `oauth.auth-dir` | string | `"~/.cli-proxy-api"` | Credential directory. `~` is supported. |
| `oauth.auth-auto-refresh-workers` | integer | `16` | OAuth and file-auth refresh worker count. A value `<= 0` keeps the default. |
| `oauth.model-alias` | object | `{}` | Model aliases by channel: `vertex`, `aistudio`, `antigravity`, `claude`, `codex`, `kimi`, `xai`, `meta`, or an OAuth plugin provider key. Not applied to `api-keys` groups. |
| `oauth.model-alias.*.*.name` / `alias` | string | `""` | Upstream model ID and client-visible ID. The same name may be repeated with different aliases. |
| `oauth.model-alias.*.*.fork` | boolean | `false` | Keep the upstream model and also expose the alias. |
| `oauth.model-alias.*.*.display-name` | string | `""` | Catalog label for the alias. |
| `oauth.model-alias.*.*.force-mapping` | boolean | `false` | Return the client-visible alias in upstream response model fields. |
| `oauth.excluded-models` | object | `{}` | Excluded models by the same channels. Wildcards are supported. |
| `oauth.request-scoped-errors` | object | `{}` | Custom upstream error rules by channel. |
| `oauth.request-scoped-errors.*.[].status` | integer | — | HTTP status to match. |
| `oauth.request-scoped-errors.*.[].match` | string[] | `[]` | Body substrings. Matching is case-sensitive. |
| `oauth.request-scoped-errors.*.[].match-regexr` | string[] | `[]` | Regular expressions matched against the body. |
| `oauth.request-scoped-errors.*.[].action` | string | — | `stop`, `stop-and-cooldown`, `continue`, or `continue-and-cooldown`. |

A request-scoped rule is ignored unless it has a status and at least one `match` or `match-regexr` pattern.

A per-auth `model_aliases` array in the auth JSON applies only to that credential and overrides a global alias with the same client-visible name. Legacy `model-aliases` is normalized on load.

### AI Studio

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `oauth.providers.aistudio.ws-auth` | boolean | `true` | Require authentication for `/v1/ws`. |

### Codex

These fields do not apply to `api-keys.codex`. API-key cloaking uses `keys[].disable-codex-cloaking`.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `oauth.providers.codex.response-steering` | boolean | `false` | Experimental full-duplex Responses WebSocket steering. One socket stays on one account and model, and accepted input is not replayed. |
| `oauth.providers.codex.disable-codex-cloaking` | boolean | `false` | Do not force the official Codex User-Agent and Originator headers on HTTP, SSE, or WebSocket requests. |
| `oauth.providers.codex.stream-bootstrap-buffering` | boolean | `false` | Hold handshake, heartbeat, and empty `*.added` frames until the first generated event, so in-stream overload or rate-limit failures can fail over before response headers are committed. Bounded by 48 frames and 1 MiB, not by time. |
| `oauth.providers.codex.stream-bootstrap-timeout` | string | `"0"` | Optional time ceiling, such as `"20s"`. `0`, `0s`, `none`, `unlimited`, `disabled`, `off`, and `never` mean no ceiling. This does not abort the upstream connection. |
| `oauth.providers.codex.optimize-multi-agent-v2` | boolean | `false` | Optimize Codex Desktop, `codex-tui`, and `codex_cli_rs` multi-agent v2 requests. Does not apply to API-key credentials. |
| `oauth.providers.codex.orphan-delegation-compatibility` | boolean | `false` | Convert orphan `function_call_output` items from `codex_app/create_thread` and `codex_app/send_message_to_thread` into user messages when `X-Openai-Subagent` is `collab_spawn`. |
| `oauth.providers.codex.model-level-cooling` | boolean | `false` | Scope Codex `usage_limit_reached` cooldowns to the requested model. |
| `oauth.providers.codex.header-defaults.user-agent` | string | `""` | Fallback User-Agent for HTTP and WebSocket OAuth requests when the client omits it. |
| `oauth.providers.codex.header-defaults.beta-features` | string | `""` | Fallback beta features for WebSocket OAuth requests only. |
| `oauth.providers.codex.live-media-relay.enabled` | boolean | `false` | Relay Codex Live WebRTC audio and DataChannel traffic in this process. Requires inbound UDP. |
| `oauth.providers.codex.live-media-relay.max-sessions` | integer | `32` | Maximum concurrent media sessions. `0` uses 32. |
| `oauth.providers.codex.live-media-relay.disable-private-remote-ips` | boolean | `false` | Reject downstream SDP candidates that target private, loopback, link-local, or unspecified IPs. |
| `oauth.providers.codex.live-media-relay.public-ip` | string | `""` | Public address advertised behind 1:1 NAT. |
| `oauth.providers.codex.live-media-relay.udp-port-min` / `udp-port-max` | integer | `0` | Optional UDP range. Set both, with at least two ports per session. |
| `oauth.providers.codex.live-media-relay.ice-servers[].urls` | string[] | `[]` | STUN or TURN URLs. |
| `oauth.providers.codex.live-media-relay.ice-servers[].username` / `credential` | string | `""` | TURN credentials. They are never returned by the JSON config API. |

With an `http`, `https`, `socks5`, or `socks5h` proxy, the OpenAI-facing media leg is forced through authenticated ICE-TCP and does not fall back to UDP or a direct connection. The Codex Desktop-facing leg stays direct. The legacy name `allow-private-remote-ips` is the inverse of `disable-private-remote-ips` and is rewritten only by a v8 migration or save.

### Claude

`disable-claude-cloak-mode` affects OAuth credentials only. API keys use `api-keys.claude[].keys[].cloak`.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `oauth.providers.claude.model-level-cooling` | boolean | `false` | Scope quota cooldowns to the requested model instead of the whole credential. |
| `oauth.providers.claude.disable-claude-cloak-mode` | boolean | `false` | Pass the original system prompt through. A credential `cloak_mode` can override it. `false` keeps per-client `auto` behavior. |
| `oauth.providers.claude.claude-code.disable-cloaking-model-list` | boolean | `false` | Return original model IDs in Anthropic model-list responses instead of cloaked IDs. |
| `oauth.providers.claude.header-defaults.user-agent` | string | `""` | Measured Claude Code CLI baseline used when the client is unconfirmed or outside the configured major/minor line. |
| `oauth.providers.claude.header-defaults.package-version` / `runtime-version` | string | `""` | Package and runtime versions in that baseline. |
| `oauth.providers.claude.header-defaults.os` / `arch` | string | `""` | Runtime-derived unless device-profile stabilization pins them. |
| `oauth.providers.claude.header-defaults.timeout` | string | `""` | Fallback timeout header. |
| `oauth.providers.claude.header-defaults.timezone` | string | `""` | Fallback IANA timezone for cloaked `currentDate`. A credential JSON `timezone` wins. |
| `oauth.providers.claude.header-defaults.stabilize-device-profile` | boolean | `false` | Pin OS and architecture to this baseline for each auth. |

### Antigravity, xAI, and Devin

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `oauth.providers.antigravity.antigravity-credits` | boolean | `true` | Last-resort Claude fallback: after free-tier auths are exhausted (429/503), retry with an auth that has Google One AI credits. |
| `oauth.providers.antigravity.signature-cache-enabled` | boolean | `true` | Prefer and validate cached thinking-block signatures. `false` uses bypass mode. |
| `oauth.providers.antigravity.signature-bypass-strict` | boolean | `false` | In bypass mode, validate the full Claude protobuf signature instead of only the basic format. |
| `oauth.providers.antigravity.sensitive-words` | string[] | `[]` | Words to obfuscate with zero-width characters in system instructions. |
| `oauth.providers.antigravity.connection-pool.enabled` | boolean | `false` | Enable the upstream HTTP connection pool. |
| `oauth.providers.antigravity.connection-pool.idle-conn-timeout` | string | `"30s"` | Idle keep-alive timeout, capped at 210 seconds. |
| `oauth.providers.antigravity.connection-pool.max-idle-conns-per-host` | integer | `2` | Maximum idle connections per host per credential. |
| `oauth.providers.xai.inject-x-search` | boolean | `false` | Inject the native `x_search` tool when the request does not declare it, including `tool_choice.allowed_tools` when applicable. |
| `oauth.providers.devin.sensitive-words` | string[] | `[]` | Words to obfuscate with zero-width characters in Devin system instructions and prompts. |

## Upstream API keys

`api-keys.<provider>` is a list of groups. Each group has a `name`, one `base-url`, shared settings, and a `keys` list. Add another group for another endpoint. `base-url` belongs to the group, not to a key.

Shared group fields are `priority`, `prefix`, `proxy-url`, `headers`, `models`, `excluded-models`, `disable-cooling`, `request-retry`, and `request-scoped-errors`. A missing or `null` key field inherits the group value, then the runtime fallback. Explicit `false`, `0`, empty strings, and empty collections override inheritance where the field supports it. Map and list overrides replace the inherited value as a whole. `weight` belongs to each key. An empty key `proxy-url` falls back to `requests.proxy-url`.

`priority` defaults to `0`; a higher value is preferred. Omitted `weight` defaults to `1`.

### Shared fields

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `api-keys.<provider>[].name` | string | — | Group name. |
| `api-keys.<provider>[].base-url` | string | provider-specific | Endpoint shared by every key in the group. |
| `api-keys.<provider>[].priority` | integer | `0` | Selection priority. |
| `api-keys.<provider>[].prefix` | string | `""` | Optional model prefix. Clients call `prefix/model`. |
| `api-keys.<provider>[].disable-cooling` | boolean | inherit | Override `routing.cooldown.disable-cooling` when present. |
| `api-keys.<provider>[].request-retry` | integer | inherit | Per-group retry override. See routing retry above. |
| `api-keys.<provider>[].request-scoped-errors[]` | object[] | `[]` | Same `status`, `match`, `match-regexr`, and `action` fields as `oauth.request-scoped-errors`. A rule needs a status and at least one pattern. Vertex does not support this field. |
| `api-keys.<provider>[].headers` | object | `{}` | Extra request headers. |
| `api-keys.<provider>[].proxy-url` | string | `""` | Group proxy override. |
| `api-keys.<provider>[].excluded-models` | string[] | `[]` | Excluded models. `*`, prefix, suffix, and substring wildcards are supported. |
| `api-keys.<provider>[].keys[].api-key` | string | `""` | Upstream API key. |
| `api-keys.<provider>[].keys[].weight` | integer | `1` | Weighted-round-robin share. Maximum `1,000,000`. Non-positive excludes the key while that strategy is active. |
| `api-keys.<provider>[].models[].name` / `alias` | string | `""` | Upstream model name and client alias. |
| `api-keys.<provider>[].models[].display-name` | string | `""` | Catalog label. |
| `api-keys.<provider>[].models[].max-context-length` | integer | `0` | Override the context window advertised to Codex clients. Not used by Vertex. |
| `api-keys.<provider>[].models[].force-mapping` | boolean | `false` | Rewrite upstream response model fields to the alias. |
| `api-keys.<provider>[].models[].is-compat` | boolean | `false` | Preserve thinking blocks with empty signatures for compatible upstreams. Codex uses it for portable multi-agent `agent_message` conversion when `optimize-multi-agent-v2` is also on. Not used by Vertex. |
| `api-keys.<provider>[].models[].thinking.levels` | string[] | provider-specific | Discrete reasoning levels. |
| `api-keys.<provider>[].models[].thinking.min` / `max` | integer | — | Budget range when the model is budget-based instead of level-based. |
| `api-keys.<provider>[].models[].thinking.zero-allowed` / `dynamic-allowed` | boolean | `false` | Allow budget `0` or dynamic budget `-1`. |

The same key fields may override the shared group fields. A key must not repeat `base-url`.

### Gemini and Interactions

`api-keys.gemini` and `api-keys.interactions` use the shared fields. Interactions keys are used only for direct `/v1beta/interactions` execution. Gemini keys still serve `generateContent` when a client enters through the interactions API.

The default base URL is `https://generativelanguage.googleapis.com`. An entry with both the API key and base URL empty is removed, and duplicate Gemini entries are removed.

### Vertex

`api-keys.vertex` uses the shared fields except `request-scoped-errors`, `max-context-length`, and `is-compat`. `base-url` is optional and falls back to Google Vertex when omitted. The API key is sent as `x-goog-api-key`. Entries without an API key are removed. A model mapping needs both `name` and `alias`.

### Codex

`api-keys.codex` uses the shared fields. A group without `base-url` is discarded. OAuth Codex provider options do not apply here.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `api-keys.codex[].keys[].websockets` | boolean | `false` | Use the upstream Responses API WebSocket transport. |
| `api-keys.codex[].keys[].alpha-search` | boolean | `false` | Allow this key to serve `/v1/alpha/search` at `base-url` + `/alpha/search`. |
| `api-keys.codex[].keys[].disable-codex-cloaking` | boolean | `false` | `true` disables cloaking for this key. Omission does not inherit `oauth.providers.codex.disable-codex-cloaking`. |
| `api-keys.codex[].models[].support-configuration-update` | boolean | `false` | Enable `configuration_update` for this API-key model. |

### Claude

`api-keys.claude` uses the shared fields. `base-url` may be empty for the official Claude API. OAuth cloaking and header defaults do not apply to these keys.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `api-keys.claude[].keys[].rebuild-mid-system-message` | boolean | `false` | Move messages with role `system` into Claude's top-level system field. |
| `api-keys.claude[].keys[].cloak.mode` | string | `"auto"` | `auto` cloaks unconfirmed clients, `always` cloaks every unconfirmed client, and `never` disables cloaking. Confirmed native Claude Code stays passthrough. |
| `api-keys.claude[].keys[].cloak.strict-mode` | boolean | `false` | `true` strips caller prompts and keeps only Claude Code billing and identity blocks. |
| `api-keys.claude[].keys[].cloak.sensitive-words` | string[] | `[]` | Words to obfuscate with zero-width characters. |
| `api-keys.claude[].keys[].cloak.cache-user-id` | boolean | `false` | Reuse a cached `user_id` for this API key. |
| `api-keys.claude[].keys[].fingerprint-profile` | string | `""` | Empty keeps the caller fingerprint. `claude-code-cli` opts into the Claude Code CLI Messages shape. `oauth-cli` is a legacy alias. |
| `api-keys.claude[].keys[].experimental-cch-signing` | boolean | `false` | Deprecated compatibility field. CCH is generated automatically for real Claude OAuth, and for `claude-code-cli` profiles only on `api.anthropic.com`. |

Delegated OAuth files use `fingerprint_profile` in the auth JSON. Legacy `fingerprint-profile` is normalized on load. `count_tokens` keeps the native model, messages, and tools shape. CCH signing follows the native gate: `api.anthropic.com` and Vertex only.

### xAI

`api-keys.xai` uses the native xAI executor and the shared fields. A group without `base-url` is discarded. The usual endpoint is `https://api.x.ai/v1`.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `api-keys.xai[].keys[].websockets` | boolean | `false` | Use the xAI upstream WebSocket transport for downstream WebSocket requests. |

`alpha-search` is forced off for xAI keys.

### Meta

`api-keys.meta` uses the native Meta executor. An empty `base-url` becomes `https://api.meta.ai/v1`. Entries with an empty API key, or a key starting with `dca:`, are removed; DCA tokens belong in the OAuth store.

### OpenAI compatibility

`api-keys.openai-compatibility` keeps provider settings on the group. Its `keys` entries are only API-key records and replace the legacy `api-key-entries` field. A group without `base-url` is discarded.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `api-keys.openai-compatibility[].name` | string | `""` | Provider identifier, including its use in the user agent. |
| `api-keys.openai-compatibility[].disabled` | boolean | `false` | Disable this provider without removing it. |
| `api-keys.openai-compatibility[].support-prompt-cache-key` | boolean | `false` | Derive `prompt_cache_key` for requests from all input protocols. |
| `api-keys.openai-compatibility[].keys[].api-key` / `proxy-url` / `weight` | mixed | — | Key, optional proxy, and weighted-round-robin weight. |
| `api-keys.openai-compatibility[].models[].image` | boolean | `false` | Allow the model on `/v1/images/generations` and `/v1/images/edits`. This does not declare chat or responses image input. |
| `api-keys.openai-compatibility[].models[].input-modalities` / `output-modalities` | string[] | `[]` | Declared input or output capabilities, such as `text` and `image`. |
| `api-keys.openai-compatibility[].models[].use-max-completion-tokens` | boolean | `false` | Send `max_completion_tokens` instead of `max_tokens`. |
| `api-keys.openai-compatibility[].models[].thinking.levels` | string[] | `["low", "medium", "high"]` | Used when `thinking` is omitted. Undeclared higher levels such as `max` or `xhigh` are clamped to `high`. |

Repeating the same alias builds an internal upstream pool. The client sees one alias. Requests round-robin across those upstream names and continue with the next name if the chosen upstream fails before producing output.

## Payload rules

`requests.payload.default`, `default-raw`, `override`, `override-raw`, and `filter` are arrays of rules. `default*` writes only missing values, `override*` always writes, and `filter` removes paths. `*-raw` values must be valid JSON and are inserted as raw JSON.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `requests.payload.<rule>[].models[].name` | string | `""` | Model name or wildcard. |
| `requests.payload.<rule>[].models[].protocol` | string | `""` | Target protocol: `openai`, `gemini`, `claude`, `codex`, or `antigravity`. |
| `requests.payload.<rule>[].models[].from-protocol` | string | `""` | Source protocol: `openai`, `responses`, `gemini`, or `claude`. `openai-response`, `openai-responses`, and `response` normalize to `responses`. |
| `requests.payload.<rule>[].models[].headers` | object | `{}` | Required request-header patterns. Values support `*`. |
| `requests.payload.<rule>[].models[].match` / `not-match` | object[] | `[]` | JSON-path conditions that must equal, or must not equal, the configured values. |
| `requests.payload.<rule>[].models[].exist` / `not-exist` | string[] | `[]` | JSON paths that must exist and be non-null, or be missing or null. |
| `requests.payload.default[].params` / `override[].params` | object | `{}` | JSON path to value. |
| `requests.payload.default-raw[].params` / `override-raw[].params` | object | `{}` | JSON path to raw JSON. |
| `requests.payload.filter[].params` | string[] | `[]` | JSON paths to remove. |

## Legacy layout

Old files keep working until a successful v8 write. To use an old field again in a mixed file, remove the corresponding v8 field first.

| Legacy | v8 |
| --- | --- |
| `host`, `port`, `trusted-proxies`, `tls`, `commercial-mode`, `discovery` | `server.*` |
| `remote-management` | `management` |
| `api-keys` string list | `access.api-keys` |
| `credential-concurrency`, `credential-in-flight` | `credentials.concurrency`, `credentials.in-flight` |
| `force-model-prefix` | `routing.force-model-prefix` |
| `request-retry`, `max-retry-credentials`, `max-retry-interval` | `routing.retry.*` |
| `disable-cooling`, `save-cooldown-status`, `transient-error-cooldown-seconds` | `routing.cooldown.*` |
| `proxy-url`, `passthrough-headers`, `nonstream-keepalive-interval`, `streaming`, `payload` | `requests.*` |
| `auth-dir`, `auth-auto-refresh-workers` | `oauth.auth-dir`, `oauth.auth-auto-refresh-workers` |
| `oauth-model-alias`, `oauth-excluded-models`, `oauth-request-scoped-errors` | `oauth.model-alias`, `oauth.excluded-models`, `oauth.request-scoped-errors` |
| `ws-auth` | `oauth.providers.aistudio.ws-auth` |
| `codex`, `codex-header-defaults` | `oauth.providers.codex`, including `header-defaults` |
| `claude`, `claude-code`, `disable-claude-cloak-mode`, `claude-header-defaults` | `oauth.providers.claude` |
| `antigravity`, `antigravity-signature-cache-enabled`, `antigravity-signature-bypass-strict` | `oauth.providers.antigravity` |
| `quota-exceeded.antigravity-credits` | `oauth.providers.antigravity.antigravity-credits` |
| `xai`, `devin` | `oauth.providers.xai`, `oauth.providers.devin` |
| `disable-image-generation`, `gpt-image-2-base-model`, `video-result-auth-cache-ttl` | `multimedia.*` |
| `debug`, `logging-to-file`, `logs-max-total-size-mb`, `error-logs-max-files`, `request-log` | `observability.logs.*` |
| `usage-statistics-enabled`, `redis-usage-queue-retention-seconds` | `observability.usage.*` |
| `pprof` | `observability.pprof` |
| `gemini-api-key`, `interactions-api-key`, `vertex-api-key`, `codex-api-key`, `claude-api-key`, `xai-api-key`, `meta-api-key` | `api-keys.<provider>` groups with a `keys` list |
| `openai-compatibility` and `api-key-entries` | `api-keys.openai-compatibility` and `keys` |

`credentials.concurrency` and `credentials.in-flight` are Home-managed contracts. In Home mode the synthesized Home config wins, and local values are ignored.

`quota-exceeded.switch-project` and `quota-exceeded.switch-preview-model` have no v8 counterpart. They remain readable and editable in legacy files and through `/v0/management`, but they are omitted from the v8 template.
