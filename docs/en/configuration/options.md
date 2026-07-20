# Configuration Options

Defaults and available fields are aligned with `config.example.yaml`.

## Core

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `host` | string | `""` | Bind address; `""` listens on all IPv4/IPv6 interfaces. Use `127.0.0.1` or `localhost` for local-only access. |
| `port` | integer | `8317` | Server port. |
| `tls.enable` | boolean | `false` | Enable HTTPS. |
| `tls.cert` / `tls.key` | string | `""` | TLS certificate and private-key paths. |
| `auth-dir` | string | `"~/.cli-proxy-api"` | Credential directory; `~` is supported. |
| `api-keys` | string[] | `[]` | API keys accepted by this proxy. |
| `debug` | boolean | `false` | Enable debug logging. |
| `request-log` | boolean | `false` | Enable detailed request and response logging. |
| `pprof.enable` | boolean | `false` | Enable the pprof HTTP debug server. |
| `pprof.addr` | string | `"127.0.0.1:8316"` | pprof bind address; keep it local. |
| `commercial-mode` | boolean | `false` | Disable high-overhead request logging and middleware to reduce memory use. |
| `logging-to-file` | boolean | `false` | Write rotating application logs instead of stdout. |
| `logs-max-total-size-mb` | integer | `0` | Total log-directory size limit in MB; `0` disables the limit. |
| `error-logs-max-files` | integer | `10` | Maximum retained error-log files when request logging is disabled; `0` disables cleanup. |
| `usage-statistics-enabled` | boolean | `false` | Enable in-memory usage aggregation. |
| `redis-usage-queue-retention-seconds` | integer | `60` | Retain usage-queue items in memory for this many seconds; maximum `3600`. |
| `proxy-url` | string | `""` | Global outbound proxy (`socks5`, `http`, or `https`). Per-credential `proxy-url` accepts `direct` or `none` to bypass it and environment proxies. |
| `force-model-prefix` | boolean | `false` | When `true`, unprefixed model requests use only credentials without a prefix (except when the prefix equals the model name). |
| `passthrough-headers` | boolean | `false` | Forward filtered upstream response headers to clients. |
| `request-retry` | integer | `3` | Retry count for 403/408/500/502/503/504 responses. |
| `max-retry-credentials` | integer | `0` | Maximum credentials tried for one failed request; `0` keeps the legacy “try all” behavior. |
| `max-retry-interval` | integer | `30` | Maximum seconds to wait for a cooled-down credential before retrying. |
| `disable-cooling` | boolean | `false` | Globally disable credential/model cooldown scheduling. |
| `save-cooldown-status` | boolean | `false` | Persist credential cooldown state in `.cds` files next to auth files. |
| `transient-error-cooldown-seconds` | integer | `0` | Cooldown for transient 408/500/502/503/504 errors; `0` uses the legacy 60 seconds and `-1` disables it. |
| `disable-claude-cloak-mode` | boolean | `false` | Disable Claude request cloaking globally; individual credentials can override it. |
| `disable-image-generation` | boolean \| `"chat"` \| `"passthrough"` | `false` | `true` disables image generation everywhere and makes `/v1/images/*` return 404; `"chat"` disables injection only outside image endpoints; `"passthrough"` leaves non-image client payloads unchanged and behaves as `"chat"` for image endpoints. |
| `gpt-image-2-base-model` | string | `"gpt-5.4-mini"` | Base model for the legacy hosted image-generation path. Must start with `gpt-`. |
| `video-result-auth-cache-ttl` | string | `"3h"` | How long video IDs remain bound to the credential that created them. |
| `auth-auto-refresh-workers` | integer | `16` | OAuth/file-auth refresh worker count; values greater than `0` override the default. |
| `ws-auth` | boolean | `true` | Require authentication for `/v1/ws`. |
| `nonstream-keepalive-interval` | integer | `0` | Emit blank lines every N seconds for non-streaming responses; `0` disables it. |
| `streaming.keepalive-seconds` | integer | `0` | SSE keep-alive interval; values ≤ `0` disable it. |
| `streaming.bootstrap-retries` | integer | `0` | Safe streaming retries before the first byte is sent. |
| `antigravity-signature-cache-enabled` | boolean | `true` | Prefer and validate cached thinking-block signatures; set `false` only to use bypass mode. |
| `antigravity-signature-bypass-strict` | boolean | `false` | In bypass mode, validate the full Claude protobuf signature structure instead of only basic format. |

## Management API

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `remote-management.allow-remote` | boolean | `false` | Permit non-localhost management access. |
| `remote-management.secret-key` | string | `""` | Management key; plaintext is hashed on startup. Empty disables all `/v0/management` routes (404). |
| `remote-management.disable-control-panel` | boolean | `false` | Disable bundled management-panel assets and routes. |
| `remote-management.disable-auto-update-panel` | boolean | `false` | Disable periodic background updates of the management panel. It is still fetched on first access when missing. |
| `remote-management.panel-github-repository` | string | `"https://github.com/router-for-me/Cli-Proxy-API-Management-Center"` | Repository or releases API URL for the management panel bundle. |

## Plugins

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `plugins.enabled` | boolean | `false` | Enable trusted in-process dynamic plugins. |
| `plugins.dir` | string | `"plugins"` | Plugin discovery directory. |
| `plugins.store-sources` | string[] | `[]` | Additional plugin-store registry URLs; the official registry is always included. |
| `plugins.store-auth[].match` | string | `""` | URL prefix matched by a plugin-store authentication rule; HTTP requires `allow-insecure: true`. |
| `plugins.store-auth[].apply-to` | string[] | `[]` | Request kinds to authenticate: `registry`, `metadata`, and/or `artifact`. |
| `plugins.store-auth[].type` | string | `""` | Authentication type: `none`, `bearer`, `basic`, `header`, or `github-token`. |
| `plugins.store-auth[].token-env` | string | `""` | Environment variable containing a bearer, GitHub, or other token. |
| `plugins.store-auth[].username-env` / `password-env` | string | `""` | Environment variables for basic authentication. |
| `plugins.store-auth[].header-name` / `header-value-env` | string | `""` | Header name and environment variable containing its value for `header` authentication. |
| `plugins.store-auth[].allow-insecure` | boolean | `false` | Allow insecure authentication configuration where supported. |
| `plugins.configs.<plugin-id>.enabled` | boolean | `false` | Enable one plugin instance; this does not change `plugins.enabled`. |
| `plugins.configs.<plugin-id>.priority` | integer | `0` | Plugin startup and routing priority. |

## Quota, Routing, and Codex

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `quota-exceeded.switch-project` | boolean | `true` | Switch projects automatically on quota exhaustion. |
| `quota-exceeded.switch-preview-model` | boolean | `true` | Switch automatically to a preview model on exhaustion. |
| `quota-exceeded.antigravity-credits` | boolean | `true` | Last-resort Claude fallback: use an auth with Google One AI credits after free-tier auths are exhausted (429/503). |
| `routing.strategy` | string | `"round-robin"` | Credential-selection strategy: `round-robin` or `fill-first`. |
| `routing.session-affinity` | boolean | `false` | Bind sessions to credentials. IDs come from `metadata.user_id`, `X-Session-ID`, `Session_id`, `X-Client-Request-Id`, `conversation_id`, or a message hash; failover remains enabled. |
| `routing.session-affinity-ttl` | string | `"1h"` | Session-to-credential binding TTL. |
| `codex.identity-confuse` | boolean | `false` | With `fill-first` or session affinity, remap Codex cache and installation identifiers for the selected auth. |

## Provider Credentials

All provider lists default to `[]`. `priority` defaults to `0`; a higher value is preferred. `models.*.display-name` is the optional catalog label, and `models.*.force-mapping` rewrites upstream response model fields to the client alias.

### Gemini and Native Interactions

`gemini-api-key[]` and `interactions-api-key[]` use the same fields. The latter is used only for direct `/v1beta/interactions` execution.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `<provider>.*.api-key` | string | `""` | API key. |
| `<provider>.*.priority` | integer | `0` | Credential selection priority. |
| `<provider>.*.prefix` | string | `""` | Optional prefix; call as `prefix/model`. |
| `<provider>.*.disable-cooling` | boolean | `false` | Disable cooldown scheduling for this credential. |
| `<provider>.*.base-url` | string | `"https://generativelanguage.googleapis.com"` | Custom endpoint. |
| `<provider>.*.headers` | object | `{}` | Extra request headers. |
| `<provider>.*.proxy-url` | string | `""` | Per-key proxy override. |
| `<provider>.*.models.*.name` / `alias` | string | `""` | Upstream model name and client alias. |
| `<provider>.*.models.*.display-name` | string | `""` | Human-readable model-catalog label. |
| `<provider>.*.models.*.force-mapping` | boolean | `false` | Return the alias in upstream response model fields. |
| `<provider>.*.excluded-models` | string[] | `[]` | Excluded models; wildcards are supported. |

### Codex and xAI

`codex-api-key[]` and `xai-api-key[]` use the following fields; xAI uses the native xAI executor.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `<provider>.*.api-key`, `priority`, `prefix`, `disable-cooling`, `headers`, `proxy-url`, `excluded-models` | mixed | — | Same meaning as the Gemini credential fields above. |
| `<provider>.*.base-url` | string | — | Required custom endpoint; entries without a non-empty value are discarded. |
| `<provider>.*.websockets` | boolean | `false` | Use the upstream Responses API WebSocket transport. |
| `<provider>.*.models.*.name` / `alias` / `display-name` / `force-mapping` | mixed | — | Same model-mapping fields as above. |

### Claude

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `claude-api-key.*.api-key`, `priority`, `prefix`, `disable-cooling`, `base-url`, `headers`, `proxy-url`, `excluded-models` | mixed | — | Same meaning as the Gemini credential fields above. |
| `claude-api-key.*.models.*.name` / `alias` / `display-name` / `force-mapping` | mixed | — | Upstream mapping and response-model rewrite controls. |
| `claude-api-key.*.rebuild-mid-system-message` | boolean | `false` | Move messages with role `system` into Claude's top-level system field. |
| `claude-api-key.*.cloak.mode` | string | `"auto"` | Cloaking mode: `auto` (non-Claude Code clients), `always`, or `never`. |
| `claude-api-key.*.cloak.strict-mode` | boolean | `false` | Strip user system messages and retain only the Claude Code prompt. |
| `claude-api-key.*.cloak.sensitive-words` | string[] | `[]` | Words to obfuscate with zero-width characters. |
| `claude-api-key.*.cloak.cache-user-id` | boolean | `false` | Reuse a cached `user_id` for this API key. |
| `claude-api-key.*.experimental-cch-signing` | boolean | `false` | Sign the final cloaked `/v1/messages` body with the current Claude Code CCH algorithm. |

### OpenAI Compatibility

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `openai-compatibility.*.name`, `priority`, `prefix`, `base-url`, `headers` | mixed | — | Provider identifier, selection priority, optional prefix, endpoint, and headers. |
| `openai-compatibility.*.disabled` / `disable-cooling` | boolean | `false` | Disable this provider, or disable cooldown scheduling for it. |
| `openai-compatibility.*.api-key-entries.*.api-key` / `proxy-url` | string | `""` | Provider API key and optional per-key proxy. |
| `openai-compatibility.*.models.*.name` / `alias` / `display-name` / `force-mapping` | mixed | — | Upstream mapping and response-model rewrite controls. |
| `openai-compatibility.*.models.*.image` | boolean | `false` | Allow the model on `/v1/images/generations` and `/v1/images/edits`. |
| `openai-compatibility.*.models.*.input-modalities` / `output-modalities` | string[] | `[]` | Declared input/output capabilities, such as `text` and `image`. |
| `openai-compatibility.*.models.*.thinking.levels` | string[] | `["low", "medium", "high"]` | Supported reasoning-effort levels. |

### Vertex-Compatible API Keys

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `vertex-api-key.*.api-key`, `priority`, `prefix`, `base-url`, `headers`, `proxy-url`, `excluded-models` | mixed | — | Vertex-compatible credential and routing settings. |
| `vertex-api-key.*.models.*.name` / `alias` / `display-name` / `force-mapping` | mixed | — | Upstream mapping and response-model rewrite controls. |

## OAuth Model Controls and Header Defaults

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `oauth-model-alias` | object | `{}` | Model aliases by OAuth channel: `vertex`, `aistudio`, `antigravity`, `claude`, `codex`, `kimi`, `xai`, or an OAuth plugin provider key. |
| `oauth-model-alias.*.*.name` / `alias` | string | `""` | Upstream and client-visible model IDs. |
| `oauth-model-alias.*.*.fork` | boolean | `false` | Keep the upstream model and expose the alias as an additional model. |
| `oauth-model-alias.*.*.display-name` | string | `""` | Catalog label for the alias. |
| `oauth-model-alias.*.*.force-mapping` | boolean | `false` | Return the client-visible alias in upstream response model fields. |
| `oauth-excluded-models` | object | `{}` | Excluded OAuth models by channel; wildcards are supported. |
| `claude-header-defaults.user-agent`, `package-version`, `runtime-version`, `timeout` | string | `""` | Fallback Claude OAuth request headers when clients omit them. |
| `claude-header-defaults.os` / `arch` | string | `""` | Runtime-derived by default; used as the pinned platform baseline when device-profile stabilization is enabled. |
| `claude-header-defaults.stabilize-device-profile` | boolean | `false` | Pin OS/architecture to the configured baseline for each auth. |
| `codex-header-defaults.user-agent` / `beta-features` | string | `""` | Fallback Codex OAuth headers; `beta-features` applies only to WebSocket requests. |

## Payload Rules

`payload.default`, `default-raw`, `override`, `override-raw`, and `filter` are arrays of rules. `default*` writes only missing values, `override*` always writes values, and `filter` removes paths. `*-raw` values must be valid JSON.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `payload.<rule>[].models[].name` | string | `""` | Matching model name; wildcards are supported. |
| `payload.<rule>[].models[].protocol` | string | `""` | Target protocol: `openai`, `responses`, `gemini`, `claude`, `codex`, or `antigravity`. |
| `payload.<rule>[].models[].from-protocol` | string | `""` | Restrict the source protocol: `openai`, `responses`, `gemini`, or `claude`. |
| `payload.<rule>[].models[].headers` | object | `{}` | Required request-header patterns; values support `*` wildcards. |
| `payload.<rule>[].models[].match` / `not-match` | object[] | `[]` | JSON-path conditions that must equal, or must not equal, the configured values. |
| `payload.<rule>[].models[].exist` / `not-exist` | string[] | `[]` | JSON paths that must exist and be non-null, or be missing/null. |
| `payload.default[].params` / `payload.override[].params` | object | `{}` | JSON path → value. |
| `payload.default-raw[].params` / `payload.override-raw[].params` | object | `{}` | JSON path → raw JSON value. |
| `payload.filter[].params` | string[] | `[]` | JSON paths to remove. |
