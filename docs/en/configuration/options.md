# Configuration Options

Defaults stay aligned with `config.example.yaml`.

## Core

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `host` | string | `""` | Bind address; `""` listens on all IPv4/IPv6; use `127.0.0.1` to restrict to localhost. |
| `port` | integer | `8317` | Server port. |
| `tls.enable` | boolean | `false` | Enable HTTPS. |
| `tls.cert` | string | `""` | TLS certificate path. |
| `tls.key` | string | `""` | TLS private key path. |
| `auth-dir` | string | `"~/.cli-proxy-api"` | Credential storage directory; `~` supported. |
| `api-keys` | string[] | `[]` | Built-in API keys. |
| `debug` | boolean | `false` | Verbose logging. |
| `commercial-mode` | boolean | `false` | Disable high-overhead middleware to lower memory. |
| `logging-to-file` | boolean | `false` | Write rotating log files instead of stdout. |
| `logs-max-total-size-mb` | integer | `0` | Log directory size cap; 0 disables limiting. |
| `usage-statistics-enabled` | boolean | `false` | Enable in-memory usage aggregation. |
| `proxy-url` | string | `""` | Global proxy (socks5/http/https). |
| `force-model-prefix` | boolean | `false` | Unprefixed model requests use only unprefixed credentials. |
| `request-retry` | integer | `3` | Retries on 403/408/500/502/503/504. |
| `max-retry-interval` | integer | `30` | Max wait (seconds) for cooled-down credential before retry. |
| `routing.strategy` | string | `"round-robin"` | Credential selection when multiple match: `round-robin` or `fill-first`. |
| `ws-auth` | boolean | `false` | Require auth for `/v1/ws`. |
| `streaming.keepalive-seconds` | integer | `0` | SSE keep-alive interval; ≤0 disables. |
| `streaming.bootstrap-retries` | integer | `0` | Safe retries before first byte. |

## Management API

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `remote-management.allow-remote` | boolean | `false` | Permit non-localhost management access. |
| `remote-management.secret-key` | string | `""` | Management key; plaintext is hashed on startup; empty disables all `/v0/management` (404). |
| `remote-management.disable-control-panel` | boolean | `false` | Disable bundled management UI assets/routes. |
| `remote-management.panel-github-repository` | string | `"https://github.com/router-for-me/Cli-Proxy-API-Management-Center"` | Repo or releases API for the management UI bundle. |

## Quota & Routing

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `quota-exceeded.switch-project` | boolean | `true` | Auto-switch project on quota exhaustion. |
| `quota-exceeded.switch-preview-model` | boolean | `true` | Auto-switch to preview model on exhaustion. |

## Provider Credentials (arrays; default `[]`)

### Gemini

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `gemini-api-key.*.api-key` | string | `""` | API key. |
| `gemini-api-key.*.prefix` | string | `""` | Optional prefix; call as `prefix/model`. |
| `gemini-api-key.*.base-url` | string | `"https://generativelanguage.googleapis.com"` | Custom endpoint. |
| `gemini-api-key.*.headers` | object | `{}` | Extra headers for that endpoint. |
| `gemini-api-key.*.proxy-url` | string | `""` | Per-key proxy override. |
| `gemini-api-key.*.models.*.name` | string | `""` | Upstream model name. |
| `gemini-api-key.*.models.*.alias` | string | `""` | Client alias. |
| `gemini-api-key.*.excluded-models` | string[] | `[]` | Models to exclude (wildcards supported). |

### Codex

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `codex-api-key.*.api-key` | string | `""` | API key. |
| `codex-api-key.*.prefix` | string | `""` | Optional prefix. |
| `codex-api-key.*.base-url` | string | `""` | Custom Codex endpoint. |
| `codex-api-key.*.headers` | object | `{}` | Extra headers. |
| `codex-api-key.*.proxy-url` | string | `""` | Per-key proxy override. |
| `codex-api-key.*.models.*.name` | string | `""` | Upstream model name. |
| `codex-api-key.*.models.*.alias` | string | `""` | Client alias. |
| `codex-api-key.*.excluded-models` | string[] | `[]` | Models to exclude (wildcards). |

### Claude

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `claude-api-key.*.api-key` | string | `""` | API key. |
| `claude-api-key.*.prefix` | string | `""` | Optional prefix. |
| `claude-api-key.*.base-url` | string | `""` | Custom Claude endpoint. |
| `claude-api-key.*.headers` | object | `{}` | Extra headers. |
| `claude-api-key.*.proxy-url` | string | `""` | Per-key proxy override. |
| `claude-api-key.*.models.*.name` | string | `""` | Upstream model name. |
| `claude-api-key.*.models.*.alias` | string | `""` | Client alias. |
| `claude-api-key.*.excluded-models` | string[] | `[]` | Models to exclude (wildcards). |

### OpenAI Compatibility

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `openai-compatibility.*.name` | string | `""` | Provider name (used in UA, etc.). |
| `openai-compatibility.*.prefix` | string | `""` | Optional prefix. |
| `openai-compatibility.*.base-url` | string | `""` | Provider base URL. |
| `openai-compatibility.*.headers` | object | `{}` | Extra headers. |
| `openai-compatibility.*.api-key-entries.*.api-key` | string | `""` | API key. |
| `openai-compatibility.*.api-key-entries.*.proxy-url` | string | `""` | Per-key proxy override. |
| `openai-compatibility.*.models.*.name` | string | `""` | Upstream model name. |
| `openai-compatibility.*.models.*.alias` | string | `""` | Client alias. |

### Vertex

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `vertex-api-key.*.api-key` | string | `""` | `x-goog-api-key` value. |
| `vertex-api-key.*.prefix` | string | `""` | Optional prefix. |
| `vertex-api-key.*.base-url` | string | `""` | Vertex-compatible endpoint. |
| `vertex-api-key.*.proxy-url` | string | `""` | Per-key proxy override. |
| `vertex-api-key.*.headers` | object | `{}` | Extra headers. |
| `vertex-api-key.*.models.*.name` | string | `""` | Upstream model name. |
| `vertex-api-key.*.models.*.alias` | string | `""` | Client alias. |

## Amp Integration (`ampcode`)

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `ampcode.upstream-url` | string | `""` | Upstream URL for Amp CLI OAuth/management. |
| `ampcode.upstream-api-key` | string | `""` | Override API key for Amp upstream. |
| `ampcode.upstream-api-keys[].upstream-api-key` | string | `""` | Upstream key for mapped clients. |
| `ampcode.upstream-api-keys[].api-keys` | string[] | `[]` | Client keys routed to that upstream key. |
| `ampcode.restrict-management-to-localhost` | boolean | `false` | Restrict Amp management routes to localhost. |
| `ampcode.force-model-mappings` | boolean | `false` | Force model mappings before checking local API keys. |
| `ampcode.model-mappings[].from` | string | `""` | Amp-requested model. |
| `ampcode.model-mappings[].to` | string | `""` | Local available model to route to. |

## OAuth Model Controls

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `oauth-model-mappings` | object | `{}` | Rename models per channel (gemini-cli, vertex, aistudio, antigravity, claude, codex, qwen, iflow). |
| `oauth-excluded-models` | object | `{}` | Exclude models per channel; wildcards supported. |

## Payload Rules

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `payload.default[].models[].name` | string | `""` | Matching model name (wildcards ok). |
| `payload.default[].models[].protocol` | string | `""` | Restrict to protocol: `openai`/`gemini`/`claude`/`codex`. |
| `payload.default[].params` | object | `{}` | JSON path → value applied when missing. |
| `payload.override[].models[].name` | string | `""` | Matching model name (wildcards). |
| `payload.override[].models[].protocol` | string | `""` | Restrict to protocol. |
| `payload.override[].params` | object | `{}` | JSON path → value always overwritten. |
