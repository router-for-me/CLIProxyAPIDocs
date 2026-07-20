---
outline: 'deep'
---

# Management API

Base path: `http://localhost:8317/v0/management`

This API manages the CLI Proxy API’s runtime configuration and authentication files. All changes are persisted to the YAML config file and hot‑reloaded by the service.

Note: The following options cannot be modified via API and must be set in the config file (restart if needed):
- `remote-management.allow-remote`
- `remote-management.secret-key` (if plaintext is detected at startup, it is automatically bcrypt‑hashed and written back to the config)

## Authentication

- All requests (including localhost) must provide a valid management key.
- Remote access requires enabling remote management in the config: `remote-management.allow-remote: true`.
- Provide the management key (in plaintext) via either:
    - `Authorization: Bearer <plaintext-key>`
    - `X-Management-Key: <plaintext-key>`

Additional notes:
- Setting the `MANAGEMENT_PASSWORD` environment variable registers an additional plaintext management secret and forces remote management to stay enabled even when `remote-management.allow-remote` is false. The value is never persisted and must be sent via the same `Authorization`/`X-Management-Key` headers.
- When the proxy starts with `cliproxy run --password <pwd>` or via the SDK’s `WithLocalManagementPassword`, localhost clients (`127.0.0.1`/`::1`) may present that local-only password through the same headers; it only lives in memory and is not written to disk.
- The Management API routes are not registered (and return 404) only when `remote-management.secret-key` is empty, `MANAGEMENT_PASSWORD` is unset, and no local management password was configured at startup.
- For a given client IP (including localhost), 5 consecutive authentication failures trigger a temporary ban (~30 minutes) before further attempts are allowed.

If a plaintext key is detected in the config at startup, it will be bcrypt‑hashed and written back to the config file automatically.

## Request/Response Conventions

- Content-Type: `application/json` (unless otherwise noted).
- Boolean/int/string updates: request body is `{ "value": <type> }`.
- Array PUT: either a raw array (e.g. `["a","b"]`) or `{ "items": [ ... ] }`.
- Array PATCH: supports `{ "old": "k1", "new": "k2" }` or `{ "index": 0, "value": "k2" }`.
- Object-array PATCH: supports matching by index or by key field (specified per endpoint).

## Endpoints

### Usage Telemetry Queue
- Legacy aggregated usage endpoints (`/usage`, `/usage/export`, `/usage/import`) are no longer available. Use `GET /usage-queue` for per-request queue records.
- For per-request usage records as JSON, use the [Redis Usage Queue](./redis-usage-queue) (RESP) exposed on the same port as HTTP.
- Use `/usage-statistics-enabled` to enable/disable usage publishing.

- GET `/usage-queue?count=10` — Pop up to `count` usage records from the queue
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        'http://localhost:8317/v0/management/usage-queue?count=10'
      ```
    - Response:
      ```json
      [
        {
          "timestamp": "2026-05-05T12:00:00Z",
          "latency_ms": 1234,
          "source": "user@example.com",
          "auth_index": "0",
          "tokens": {
            "input_tokens": 10,
            "output_tokens": 20,
            "reasoning_tokens": 0,
            "cached_tokens": 0,
            "total_tokens": 30
          },
          "failed": false,
          "provider": "openai",
          "model": "gpt-5.4",
          "alias": "gpt-5.4",
          "endpoint": "POST /v1/chat/completions",
          "auth_type": "api_key",
          "api_key": "sk-...",
          "request_id": "req_..."
        }
      ]
      ```
    - Notes:
        - `count` is optional and defaults to `1`; it must be a positive integer.
        - The response is always an array, including when `count=1`; an empty queue returns `[]`.
        - Records returned by this endpoint are removed from the queue.
        - The Redis-compatible usage queue reads from the same queue; `LPOP` and `RPOP` also remove returned records.

### Config
- GET `/config` — Get the full config
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/config
      ```
    - Response:
      ```json
      {"debug":true,"proxy-url":"","api-keys":["1...5","JS...W"],"quota-exceeded":{"switch-project":true,"switch-preview-model":true},"gemini-api-key":[{"api-key":"AI...01","base-url":"https://generativelanguage.googleapis.com","headers":{"X-Custom-Header":"custom-value"},"proxy-url":"","excluded-models":["gemini-1.5-pro","gemini-1.5-flash"]},{"api-key":"AI...02","proxy-url":"socks5://proxy.example.com:1080","excluded-models":["gemini-pro-vision"]}],"request-log":true,"request-retry":3,"claude-api-key":[{"api-key":"cr...56","base-url":"https://example.com/api","proxy-url":"socks5://proxy.example.com:1080","models":[{"name":"claude-3-5-sonnet-20241022","alias":"claude-sonnet-latest"}],"excluded-models":["claude-3-opus"]},{"api-key":"cr...e3","base-url":"http://example.com:3000/api","proxy-url":""},{"api-key":"sk-...q2","base-url":"https://example.com","proxy-url":""}],"codex-api-key":[{"api-key":"sk...01","base-url":"https://example/v1","proxy-url":"","excluded-models":["gpt-4o-mini"]}],"openai-compatibility":[{"name":"openrouter","base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk...01","proxy-url":""}],"models":[{"name":"moonshotai/kimi-k2:free","alias":"kimi-k2"}]}]}
      ```
    - Notes:
        - The response reflects the currently loaded runtime configuration.
        - When no configuration is loaded yet the handler returns `{}`.

### Latest Version
- GET `/latest-version` — Fetch the latest release version string (no asset download)
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/latest-version
      ```
    - Response:
      ```json
      { "latest-version": "v1.2.3" }
      ```
    - Notes:
        - Data is retrieved from `https://api.github.com/repos/router-for-me/CLIProxyAPI/releases/latest` with `User-Agent: CLIProxyAPI`.
        - When `proxy-url` is set, the request honors that proxy; the endpoint only returns the version value and does not download release assets.

### Debug
- GET `/debug` — Get the current debug state
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/debug
      ```
    - Response:
      ```json
      { "debug": false }
      ```
- PUT/PATCH `/debug` — Set debug (boolean)
    - Request:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":true}' \
        http://localhost:8317/v0/management/debug
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```

### Config YAML
- GET `/config.yaml` — Download the persisted YAML file as-is
    - Response headers:
        - `Content-Type: application/yaml; charset=utf-8`
        - `Cache-Control: no-store`
    - Response body: raw YAML stream preserving comments/formatting.
- PUT `/config.yaml` — Replace the config with a YAML document
    - Request:
      ```bash
      curl -X PUT -H 'Content-Type: application/yaml' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        --data-binary @config.yaml \
        http://localhost:8317/v0/management/config.yaml
      ```
    - Response:
      ```json
      { "ok": true, "changed": ["config"] }
      ```
    - Notes:
        - Malformed YAML returns `400` with `{ "error": "invalid_yaml", "message": "..." }`; YAML that parses but fails configuration validation returns `422` with `{ "error": "invalid_config", "message": "..." }`.
        - Write failures return `500` with `{ "error": "write_failed", "message": "..." }`.

### Logging to File
- GET `/logging-to-file` — Check whether file logging is enabled
    - Response:
      ```json
      { "logging-to-file": true }
      ```
- PUT/PATCH `/logging-to-file` — Enable or disable file logging
    - Request:
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":false}' \
        http://localhost:8317/v0/management/logging-to-file
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```

### Log Files
- GET `/logs` — Stream recent log lines
    - Query params:
        - `after` (optional): Unix timestamp; only lines newer than this are returned.
    - Response:
      ```json
      {
        "lines": ["2024-05-20 12:00:00 info request accepted"],
        "line-count": 125,
        "latest-timestamp": 1716206400
      }
      ```
    - Notes:
        - Requires file logging to be enabled; otherwise returns `{ "error": "logging to file disabled" }` with `400`.
        - When no log file exists yet the response contains empty `lines` and `line-count: 0`.
        - `latest-timestamp` is the largest parsed timestamp from this batch; if no timestamp is found it echoes the provided `after` (or `0`), so clients can pass it back unchanged for incremental polling.
        - `line-count` reflects the total number of lines scanned (including those filtered out by `after`) and can be used to detect whether new log data arrived.
- DELETE `/logs` — Remove rotated log files and truncate the active log
    - Response:
      ```json
      { "success": true, "message": "Logs cleared successfully", "removed": 3 }
      ```

### Request Error Logs
- GET `/request-error-logs` — List error request log files when request logging is disabled
    - Response:
      ```json
      {
        "files": [
          {
            "name": "error-2024-05-20.log",
            "size": 12345,
            "modified": 1716206400
          }
        ]
      }
      ```
    - Notes:
        - When `request-log` is enabled, this endpoint always returns an empty list.
        - Files are discovered under the same log directory and must start with `error-` and end with `.log`.
        - `modified` is the last modification time as a Unix timestamp.
- GET `/request-error-logs/:name` — Download a specific error request log
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -OJ 'http://localhost:8317/v0/management/request-error-logs/error-2024-05-20.log'
      ```
    - Notes:
        - `name` must be a safe filename (no `/` or `\`) and match an existing `error-*.log` entry; otherwise the server returns a validation or not-found error.
        - The handler performs a safety check to ensure the resolved path stays inside the log directory before streaming the file.

### Usage Statistics Toggle
- GET `/usage-statistics-enabled` — Check whether telemetry collection is active
    - Response:
      ```json
      { "usage-statistics-enabled": true }
      ```
- PUT/PATCH `/usage-statistics-enabled` — Enable or disable collection
    - Request:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":true}' \
        http://localhost:8317/v0/management/usage-statistics-enabled
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```

### Proxy Server URL
- GET `/proxy-url` — Get the proxy URL string
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/proxy-url
      ```
    - Response:
      ```json
      { "proxy-url": "socks5://user:pass@127.0.0.1:1080/" }
      ```
- PUT/PATCH `/proxy-url` — Set the proxy URL string
    - Request (PUT):
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":"socks5://user:pass@127.0.0.1:1080/"}' \
        http://localhost:8317/v0/management/proxy-url
      ```
    - Request (PATCH):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":"http://127.0.0.1:8080"}' \
        http://localhost:8317/v0/management/proxy-url
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
- DELETE `/proxy-url` — Clear the proxy URL
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE http://localhost:8317/v0/management/proxy-url
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```

### Quota Exceeded Behavior
- GET `/quota-exceeded/switch-project`
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/quota-exceeded/switch-project
      ```
    - Response:
      ```json
      { "switch-project": true }
      ```
- PUT/PATCH `/quota-exceeded/switch-project` — Boolean
    - Request:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":false}' \
        http://localhost:8317/v0/management/quota-exceeded/switch-project
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
- GET `/quota-exceeded/switch-preview-model`
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/quota-exceeded/switch-preview-model
      ```
    - Response:
      ```json
      { "switch-preview-model": true }
      ```
- PUT/PATCH `/quota-exceeded/switch-preview-model` — Boolean
    - Request:
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":true}' \
        http://localhost:8317/v0/management/quota-exceeded/switch-preview-model
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
- POST `/reset-quota` — Clear quota/cooldown routing state for one credential
    - Request:
      ```bash
      curl -X POST -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"auth_index":"<AUTH_INDEX>"}' \
        http://localhost:8317/v0/management/reset-quota
      ```
    - Response:
      ```json
      {
        "status": "ok",
        "auth_index": "<AUTH_INDEX>",
        "models": ["gpt-5"]
      }
      ```
    - Notes:
        - `auth_index` is the stable runtime identifier returned by `GET /auth-files`.
        - This endpoint does not accept auth file names or auth IDs.
        - It clears the runtime quota/cooldown state and resumes the credential in routing immediately.

### API Keys (proxy service auth)
These endpoints update the inline `config-api-key` provider inside the `auth.providers` section of the configuration. Legacy top-level `api-keys` remain in sync automatically.
- GET `/api-keys` — Return the full list
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/api-keys
      ```
    - Response:
      ```json
      { "api-keys": ["k1","k2","k3"] }
      ```
- PUT `/api-keys` — Replace the full list
    - Request:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '["k1","k2","k3"]' \
        http://localhost:8317/v0/management/api-keys
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
- PATCH `/api-keys` — Modify one item (`old/new` or `index/value`)
    - Request (by old/new):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"old":"k2","new":"k2b"}' \
        http://localhost:8317/v0/management/api-keys
      ```
    - Request (by index/value):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"index":0,"value":"k1b"}' \
        http://localhost:8317/v0/management/api-keys
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
- DELETE `/api-keys` — Delete one (`?value=` or `?index=`)
    - Request (by value):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/api-keys?value=k1'
      ```
    - Request (by index):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/api-keys?index=0'
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```

- GET `/api-key-usage` — Recent request buckets grouped by provider and API key
    - Response:
      ```json
      {
        "openai": {
          "https://openrouter.ai/api/v1|k1": {
            "success": 12,
            "failed": 1,
            "recent_requests": [
              { "time": "12:00-12:10", "success": 3, "failed": 0 },
              { "time": "12:10-12:20", "success": 1, "failed": 1 }
            ]
          }
        }
      }
      ```
    - Notes:
        - Top-level keys are provider names.
        - Second-level keys are `base_url|api_key` (base URL may be empty, e.g. `|k1`).
        - `recent_requests` is a fixed-length list of 20 buckets (10 minutes per bucket, local time label `HH:MM-HH:MM`).

### Gemini API Key
- GET `/gemini-api-key`
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/gemini-api-key
      ```
    - Response:
      ```json
      {
        "gemini-api-key": [
          {"api-key":"AIzaSy...01","auth-index":"a1b2c3d4e5f67890","base-url":"https://generativelanguage.googleapis.com","headers":{"X-Custom-Header":"custom-value"},"proxy-url":"","excluded-models":["gemini-1.5-pro","gemini-1.5-flash"]},
          {"api-key":"AIzaSy...02","auth-index":"b1c2d3e4f5a67890","proxy-url":"socks5://proxy.example.com:1080","excluded-models":["gemini-pro-vision"]}
        ]
      }
      ```
- PUT `/gemini-api-key`
    - Request (array form):
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '[{"api-key":"AIzaSy-1","headers":{"X-Custom-Header":"vendor-value"},"excluded-models":["gemini-1.5-flash"]},{"api-key":"AIzaSy-2","base-url":"https://custom.example.com","excluded-models":["gemini-pro-vision"]}]' \
        http://localhost:8317/v0/management/gemini-api-key
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
- PATCH `/gemini-api-key`
    - Request (update by index):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"index":0,"value":{"api-key":"AIzaSy-1","base-url":"https://custom.example.com","headers":{"X-Custom-Header":"custom-value"},"proxy-url":"","excluded-models":["gemini-1.5-pro","gemini-pro-vision"]}}' \
        http://localhost:8317/v0/management/gemini-api-key
      ```
    - Request (update by api-key match):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"match":"AIzaSy-1","value":{"api-key":"AIzaSy-1","headers":{"X-Custom-Header":"custom-value"},"proxy-url":"socks5://proxy.example.com:1080","excluded-models":["gemini-1.5-pro-latest"]}}' \
        http://localhost:8317/v0/management/gemini-api-key
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
- DELETE `/gemini-api-key`
    - Request (by api-key):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE \
        'http://localhost:8317/v0/management/gemini-api-key?api-key=AIzaSy-1'
      ```
    - Request (by index):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE \
        'http://localhost:8317/v0/management/gemini-api-key?index=0'
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
    - Notes:
        - `excluded-models` is optional; the server lowercases, trims, deduplicates, and drops blank entries before saving.

### Codex API KEY (object array)
- GET `/codex-api-key` — List all
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/codex-api-key
      ```
    - Response:
      ```json
      { "codex-api-key": [ { "api-key": "sk-a", "base-url": "https://codex.example.com/v1", "proxy-url": "socks5://proxy.example.com:1080", "headers": { "X-Team": "cli" }, "excluded-models": ["gpt-4o-mini"] } ] }
      ```
- PUT `/codex-api-key` — Replace the list
    - Request:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '[{"api-key":"sk-a","base-url":"https://codex.example.com/v1","proxy-url":"socks5://proxy.example.com:1080","headers":{"X-Team":"cli"},"excluded-models":["gpt-4o-mini","gpt-4.1-mini"]},{"api-key":"sk-b","base-url":"https://custom.example.com","proxy-url":"","headers":{"X-Env":"prod"},"excluded-models":["gpt-3.5-turbo"]}]' \
        http://localhost:8317/v0/management/codex-api-key
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
- PATCH `/codex-api-key` — Modify one (by `index` or `match`)
    - Request (by index):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"index":1,"value":{"api-key":"sk-b2","base-url":"https://c.example.com","proxy-url":"","headers":{"X-Env":"stage"},"excluded-models":["gpt-3.5-turbo-instruct"]}}' \
        http://localhost:8317/v0/management/codex-api-key
      ```
    - Request (by match):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"match":"sk-a","value":{"api-key":"sk-a","base-url":"https://codex.example.com/v1","proxy-url":"socks5://proxy.example.com:1080","headers":{"X-Team":"cli"},"excluded-models":["gpt-4o-mini","gpt-4.1"]}}' \
        http://localhost:8317/v0/management/codex-api-key
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
- DELETE `/codex-api-key` — Delete one (`?api-key=` or `?index=`)
    - Request (by api-key):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/codex-api-key?api-key=sk-b2'
      ```
    - Request (by index):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/codex-api-key?index=0'
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
    - Notes:
        - `base-url` is required; submitting an empty `base-url` in PUT/PATCH removes the entry.
        - `headers` lets you attach custom HTTP headers per key. Empty keys/values are stripped automatically.
        - `excluded-models` accepts model identifiers to block for this provider; the server lowercases, trims, deduplicates, and drops blank entries.

### Request Retry Count
- GET `/request-retry` — Get integer
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/request-retry
      ```
    - Response:
      ```json
      { "request-retry": 3 }
      ```
- PUT/PATCH `/request-retry` — Set integer
    - Request:
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":5}' \
        http://localhost:8317/v0/management/request-retry
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```

### Max Retry Interval
- GET `/max-retry-interval` — Get the maximum retry interval in seconds
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/max-retry-interval
      ```
    - Response:
      ```json
      { "max-retry-interval": 30 }
      ```
- PUT/PATCH `/max-retry-interval` — Set the maximum retry interval in seconds
    - Request:
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":60}' \
        http://localhost:8317/v0/management/max-retry-interval
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```

### Request Log
- GET `/request-log` — Get boolean
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/request-log
      ```
    - Response:
      ```json
      { "request-log": false }
      ```
- PUT/PATCH `/request-log` — Set boolean
    - Request:
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":true}' \
        http://localhost:8317/v0/management/request-log
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```

### WebSocket Authentication (`ws-auth`)
- GET `/ws-auth` — Check whether the WebSocket gateway enforces authentication
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/ws-auth
      ```
    - Response:
      ```json
      { "ws-auth": true }
      ```
- PUT/PATCH `/ws-auth` — Enable or disable authentication for `/ws/*` endpoints
    - Request:
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":false}' \
        http://localhost:8317/v0/management/ws-auth
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
    - Notes:
        - When toggled from `false` → `true`, the server terminates any existing WebSocket sessions so that reconnections must supply valid API credentials.
        - Disabling authentication leaves current sessions untouched but future connections will skip the auth middleware until re-enabled.

### Claude API KEY (object array)
- GET `/claude-api-key` — List all
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/claude-api-key
      ```
    - Response:
      ```json
      { "claude-api-key": [ { "api-key": "sk-a", "base-url": "https://example.com/api", "proxy-url": "socks5://proxy.example.com:1080", "headers": { "X-Workspace": "team-a" }, "excluded-models": ["claude-3-opus"] } ] }
      ```
- PUT `/claude-api-key` — Replace the list
    - Request:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '[{"api-key":"sk-a","proxy-url":"socks5://proxy.example.com:1080","headers":{"X-Workspace":"team-a"},"excluded-models":["claude-3-opus"]},{"api-key":"sk-b","base-url":"https://c.example.com","proxy-url":"","headers":{"X-Env":"prod"},"excluded-models":["claude-3-sonnet","claude-3-5-haiku"]}]' \
        http://localhost:8317/v0/management/claude-api-key
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
- PATCH `/claude-api-key` — Modify one (by `index` or `match`)
    - Request (by index):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
          -d '{"index":1,"value":{"api-key":"sk-b2","base-url":"https://c.example.com","proxy-url":"","headers":{"X-Env":"stage"},"excluded-models":["claude-3.7-sonnet"]}}' \
          http://localhost:8317/v0/management/claude-api-key
        ```
    - Request (by match):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
          -d '{"match":"sk-a","value":{"api-key":"sk-a","base-url":"","proxy-url":"socks5://proxy.example.com:1080","headers":{"X-Workspace":"team-a"},"excluded-models":["claude-3-opus","claude-3.5-sonnet"]}}' \
          http://localhost:8317/v0/management/claude-api-key
        ```
    - Response:
      ```json
      { "status": "ok" }
      ```
- DELETE `/claude-api-key` — Delete one (`?api-key=` or `?index=`)
    - Request (by api-key):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/claude-api-key?api-key=sk-b2'
      ```
    - Request (by index):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/claude-api-key?index=0'
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
    - Notes:
        - `headers` is optional; empty/blank pairs are removed automatically. To drop a header, simply omit it in your update payload.
        - `excluded-models` lets you block specific Claude models for a key; the server lowercases, trims, deduplicates, and removes blank entries.

### OpenAI Compatibility Providers (object array)
- GET `/openai-compatibility` — List all
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/openai-compatibility
      ```
    - Response:
      ```json
      {
        "openai-compatibility": [
          {
            "name": "openrouter",
            "disabled": false,
            "base-url": "https://openrouter.ai/api/v1",
            "api-key-entries": [
              { "api-key": "sk", "proxy-url": "", "auth-index": "a1b2c3d4e5f67890" }
            ],
            "models": [],
            "headers": { "X-Provider": "openrouter" }
          }
        ]
      }
      ```
- PUT `/openai-compatibility` — Replace the list
    - Request:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '[{"name":"openrouter","base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk","proxy-url":""}],"models":[{"name":"m","alias":"a"}],"headers":{"X-Provider":"openrouter"}}]' \
        http://localhost:8317/v0/management/openai-compatibility
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
- PATCH `/openai-compatibility` — Modify one (by `index` or `name`)
    - Request (by name):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"name":"openrouter","value":{"name":"openrouter","disabled":false,"base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk","proxy-url":""}],"models":[],"headers":{"X-Provider":"openrouter"}}}' \
        http://localhost:8317/v0/management/openai-compatibility
      ```
    - Request (by index):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"index":0,"value":{"name":"openrouter","disabled":false,"base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk","proxy-url":""}],"models":[],"headers":{"X-Provider":"openrouter"}}}' \
        http://localhost:8317/v0/management/openai-compatibility
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```

    - Notes:
        - Legacy `api-keys` input remains accepted; keys are migrated into `api-key-entries` automatically so the legacy field will eventually remain empty in responses.
        - `disabled: true` skips this provider for routing and auth selection, without removing it from the config.
        - `headers` lets you define provider-wide HTTP headers; blank keys/values are dropped.
        - Providers without a `base-url` are removed. Sending a PATCH with `base-url` set to an empty string deletes that provider.
- DELETE `/openai-compatibility` — Delete (`?name=` or `?index=`)
    - Request (by name):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/openai-compatibility?name=openrouter'
      ```
    - Request (by index):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/openai-compatibility?index=0'
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```

### OAuth Excluded Models
Configure per-provider model blocks for OAuth-based providers. Keys are provider identifiers, values are string arrays of model names to exclude.

- GET `/oauth-excluded-models` — Get the current map
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/oauth-excluded-models
      ```
    - Response:
      ```json
      {
        "oauth-excluded-models": {
          "openai": ["gpt-4.1-mini"],
          "claude": ["claude-3-5-haiku-20241022"]
        }
      }
      ```
- PUT `/oauth-excluded-models` — Replace the full map
    - Request:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"openai":["gpt-4.1-mini"],"claude":["claude-3-5-haiku-20241022"]}' \
        http://localhost:8317/v0/management/oauth-excluded-models
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
    - Notes:
        - The body can also be wrapped as `{ "items": { ... } }`; in both cases empty/blank model names are trimmed out.
- PATCH `/oauth-excluded-models` — Upsert or delete a single provider entry
    - Request (upsert):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"provider":"claude","models":["claude-3-5-haiku-20241022"]}' \
        http://localhost:8317/v0/management/oauth-excluded-models
      ```
    - Request (delete provider by sending empty models):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"provider":"claude","models":[]}' \
        http://localhost:8317/v0/management/oauth-excluded-models
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
    - Notes:
        - `provider` is normalized to lowercase. Sending an empty `models` list removes that provider; if the provider does not exist, a `404` is returned.
- DELETE `/oauth-excluded-models` — Delete all models for a provider
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -X DELETE 'http://localhost:8317/v0/management/oauth-excluded-models?provider=claude'
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```

### Auth File Management

Manage JSON token files under `auth-dir`: list, download, upload, delete.

- GET `/auth-files` — List
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/auth-files
      ```
    - Response (when the runtime auth manager is available):
      ```json
      {
        "files": [
          {
            "id": "claude-user@example.com",
            "auth_index": "a1b2c3d4e5f67890",
            "name": "claude-user@example.com.json",
            "provider": "claude",
            "label": "Claude Prod",
            "status": "ready",
            "status_message": "ok",
            "disabled": false,
            "unavailable": false,
            "runtime_only": false,
            "source": "file",
            "path": "/abs/path/auths/claude-user@example.com.json",
            "size": 2345,
            "modtime": "2025-08-30T12:34:56Z",
            "success": 12,
            "failed": 1,
            "recent_requests": [
              { "time": "12:00-12:10", "success": 3, "failed": 0 },
              { "time": "12:10-12:20", "success": 1, "failed": 1 }
            ],
            "email": "user@example.com",
            "account_type": "anthropic",
            "account": "workspace-1",
            "created_at": "2025-08-30T12:00:00Z",
            "updated_at": "2025-08-31T01:23:45Z",
            "last_refresh": "2025-08-31T01:23:45Z"
          }
        ]
      }
      ```
    - Notes:
        - Entries are sorted case-insensitively by `name`. `status`, `status_message`, `disabled`, and `unavailable` mirror the runtime auth manager so you can see whether a credential is healthy.
        - `runtime_only: true` indicates the credential only exists in memory (for example Git/Postgres/ObjectStore backends); `source` switches to `memory`. When a `.json` file exists on disk, `source=file` and the response includes `path`/`size`/`modtime`.
        - `auth_index` is a stable runtime identifier for a credential (useful with `/api-call` and request correlation).
        - `success`/`failed` are cumulative counters (in memory).
        - `recent_requests` is a fixed-length list of 20 buckets (10 minutes per bucket, local time label `HH:MM-HH:MM`).
        - `email`, `account_type`, `account`, and `last_refresh` are pulled from the JSON metadata (keys such as `last_refresh`, `lastRefreshedAt`, `last_refreshed_at`, etc.).
        - If the runtime auth manager is unavailable the handler falls back to scanning `auth-dir`, returning only `name`, `size`, `modtime`, `type`, and `email`.
        - `runtime_only` entries cannot be downloaded or deleted via the file endpoints—they must be revoked from the upstream provider or a different API.

- GET `/auth-files/download?name=<file.json>` — Download a single file
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -OJ 'http://localhost:8317/v0/management/auth-files/download?name=acc1.json'
      ```
    - Notes:
        - `name` must be a `.json` filename. Only `source=file` entries have a backing file to export; `runtime_only` credentials cannot be downloaded.

- POST `/auth-files` — Upload
    - Request (multipart):
      ```bash
      curl -X POST -F 'file=@/path/to/acc1.json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/auth-files
      ```
    - Request (raw JSON):
      ```bash
      curl -X POST -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d @/path/to/acc1.json \
        'http://localhost:8317/v0/management/auth-files?name=acc1.json'
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
    - Notes:
        - The core auth manager must be active; otherwise the API returns `503` with `{ "error": "core auth manager unavailable" }`.
        - Both multipart and raw JSON uploads must use filenames ending in `.json`; upon success the credential is registered with the runtime auth manager immediately.

- DELETE `/auth-files?name=<file.json>` — Delete a single file
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/auth-files?name=acc1.json'
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
    - Notes:
        - Only on-disk `.json` files are removed; after a successful deletion the runtime manager is instructed to disable the corresponding credential. `runtime_only` entries are unaffected.

- DELETE `/auth-files?all=true` — Delete all `.json` files under `auth-dir`
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/auth-files?all=true'
      ```
    - Response:
      ```json
      { "status": "ok", "deleted": 3 }
      ```
    - Notes:
        - Only files on disk are counted and removed; each successful deletion also triggers a disable call into the runtime auth manager. Purely in-memory entries stay untouched.

### Vertex Credential Import
Mirrors the CLI `vertex-import` helper and stores Google service account JSON as `vertex-<project>.json` files inside `auth-dir`.

- POST `/vertex/import` — Upload a Vertex service account key
    - Request (multipart):
      ```bash
      curl -X POST \
        -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -F 'file=@/path/to/my-project-sa.json' \
        -F 'location=us-central1' \
        http://localhost:8317/v0/management/vertex/import
      ```
    - Response:
      ```json
      {
        "status": "ok",
        "auth-file": "/abs/path/auths/vertex-my-project.json",
        "project_id": "my-project",
        "email": "svc@my-project.iam.gserviceaccount.com",
        "location": "us-central1"
      }
      ```
    - Notes:
        - Uploads must be sent as `multipart/form-data` using the `file` field. The payload is validated and `private_key` is normalized; malformed JSON or missing `project_id` yields `400`.
        - The optional `location` form (or query) field overrides the default `us-central1` region recorded in the credential metadata.
        - The handler persists the credential via the same token store as other auth uploads; failures return `500` with `{ "error": "save_failed", ... }`.

### Login/OAuth URLs

These endpoints initiate provider login flows and return a URL to open in a browser. Tokens are saved under `auths/` once the flow completes.

For Anthropic, Codex, and Antigravity you can append `?is_webui=true` to reuse the embedded callback forwarder when launching from the management UI.

- GET `/anthropic-auth-url` — Start Anthropic (Claude) login
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/anthropic-auth-url
      ```
    - Response:
      ```json
      { "status": "ok", "url": "https://...", "state": "anth-1716206400" }
      ```
    - Notes:
        - Add `?is_webui=true` when triggering from the built-in UI to reuse the local callback service.

- GET `/codex-auth-url` — Start Codex login
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/codex-auth-url
      ```
    - Response:
      ```json
      { "status": "ok", "url": "https://...", "state": "codex-1716206400" }
      ```

- GET `/antigravity-auth-url` — Start Antigravity login
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/antigravity-auth-url
      ```
    - Response:
      ```json
      { "status": "ok", "url": "https://...", "state": "ant-1716206400" }
      ```
    - Notes:
        - Add `?is_webui=true` when triggering from the built-in UI so the server starts a temporary local callback forwarder on port `51121` and reuses the main HTTP port for the final redirect.

- GET `/get-auth-status?state=<state>` — Poll OAuth flow status
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        'http://localhost:8317/v0/management/get-auth-status?state=<STATE_FROM_AUTH_URL>'
      ```
    - Response examples:
      ```json
      { "status": "wait" }
      ```
      ```json
      { "status": "ok" }
      ```
      ```json
      { "status": "error", "error": "Authentication failed" }
      ```
    - Notes:
        - The `state` query parameter must match the value returned by the login endpoint. Once a flow reaches `status: "ok"` or `status: "error"`, the server deletes the state; subsequent polls receive `{ "status": "ok" }` to signal completion.
        - `status: "wait"` indicates the flow is still waiting for a callback or token exchange—continue polling as needed.

### Plugins

- GET `/plugins` — Lists discovered, configured, and registered plugins. The response includes global `plugins_enabled`, resolved `plugins_dir`, and per-plugin state such as `id`, `path`, `configured`, `registered`, `enabled`, `effective_enabled`, OAuth support, metadata, config fields, and menus.
- GET `/plugins/:id/config` — Returns the saved `plugins.configs.<id>` object. It returns `{}` for a discovered or registered plugin that has no saved configuration.
- PUT `/plugins/:id/config` — Replaces the complete plugin configuration object.
- PATCH `/plugins/:id/config` — Shallow-merges a configuration object. Sending a field with `null` removes that top-level field.
- PATCH `/plugins/:id/enabled` — Updates only the plugin's enabled flag. Request: `{ "enabled": true }`.
- DELETE `/plugins/:id` — Removes the local plugin file and its saved configuration. A loaded plugin that cannot be unloaded returns `409` with `restart_required: true`.
- GET `/plugin-store` — Lists plugins from the configured store sources, including source errors, installation state, installed source, and update availability.
- POST `/plugin-store/:id/install` — Downloads or updates a plugin from a store source, enables it in the configuration, and returns the installed path and version. Select a source with `?source=<source-id>` when duplicate IDs exist; optionally set `version` in the query string or body (`{ "version": "1.2.3" }`).

Plugin IDs must be valid host plugin IDs. Store installation can download executable plugin artifacts; configure and trust store sources before using it.

### Additional Runtime Settings and Logs

All PUT/PATCH endpoints in this section use `{ "value": ... }` and return `{ "status": "ok" }`.

- GET/PUT/PATCH `/logs-max-total-size-mb` — Maximum total log size in MiB. Negative values are stored as `0`.
- GET/PUT/PATCH `/error-logs-max-files` — Number of retained request-error log files. A negative update falls back to `10`.
- GET/PUT/PATCH `/force-model-prefix` — Boolean switch for forcing configured model prefixes.
- GET/PUT/PATCH `/routing/strategy` — Credential selection strategy. Valid values are `round-robin` (also `roundrobin`/`rr`) and `fill-first` (also `fillfirst`/`ff`); GET returns `{ "strategy": "..." }`.
- GET `/logs` also accepts `limit` and an opaque `cursor`. With `limit` and no `after`, it returns the newest lines. Pass the returned `next-cursor` as `cursor` for incremental reads; a reset returns `cursor-reset: true`.
- GET `/request-log-by-id/:id` — Downloads the request log whose filename ends in `-<id>.log`. The request ID must not contain path separators.

### Additional Provider API Key Collections

`/interactions-api-key`, `/xai-api-key`, and `/vertex-api-key` are object-array collections with GET, PUT, PATCH, and DELETE methods. GET returns an object keyed by the endpoint name and adds runtime `auth-index` values where applicable. PUT accepts a raw array or `{ "items": [ ... ] }`; PATCH uses `{ "index": 0, "value": { ... } }` or `{ "match": "<api-key>", "value": { ... } }`; DELETE accepts `?index=` or `?api-key=` (add `&base-url=` when a key occurs more than once).

- `/interactions-api-key` configures Google Interactions API keys. Entries use the Gemini-key shape: `api-key`, `priority`, `prefix`, `base-url`, `proxy-url`, `models`, `headers`, `excluded-models`, and `disable-cooling`.
- `/xai-api-key` configures native xAI API keys. Entries use the Codex-key shape plus `priority`, `websockets`, and `disable-cooling`; `base-url` is required for retained entries, and an empty `base-url` in PATCH removes the entry.
- `/vertex-api-key` configures Vertex-compatible API keys. Each PUT entry requires `api-key`; optional fields are `priority`, `prefix`, `base-url`, `proxy-url`, `headers`, `models`, and `excluded-models`. Model entries use `name`, `alias`, optional `display-name`, and `force-mapping`. An empty `api-key` or `base-url` in PATCH removes the entry.

### OAuth Model Aliases

- GET `/oauth-model-alias` — Returns `{ "oauth-model-alias": { "<channel>": [ ... ] } }`.
- PUT `/oauth-model-alias` — Replaces the full channel-to-alias map; the body may be wrapped in `{ "items": { ... } }`.
- PATCH `/oauth-model-alias` — Replaces one channel entry. Request: `{ "channel": "codex", "aliases": [{ "name": "upstream", "alias": "client-name", "fork": false, "display-name": "Client Name", "force-mapping": true }] }`. `provider` is accepted as an alias for `channel`; an empty alias list removes an existing channel.
- DELETE `/oauth-model-alias?channel=codex` — Removes one channel. `provider` is also accepted as the query parameter name.

### Auth File Extensions

- GET `/auth-files/models?name=<name-or-auth-id>` — Returns the model definitions supported by one credential as `{ "models": [...] }`.
- GET `/model-definitions/:channel` — Returns static catalog metadata as `{ "channel": "...", "models": [...] }`; an unknown channel returns `400`. Omitting the required `:channel` path segment does not match this route and returns `404`.
- PATCH `/auth-files/status` — Enables or disables an auth record. Request: `{ "name": "<file-name-or-id>", "disabled": true }`. Configured API-key records are disabled through their `excluded-models` configuration; plugin virtual children cannot be changed independently.
- PATCH `/auth-files/fields` — Updates metadata fields for a file name or auth ID. The body contains `name` plus one or more fields; dot paths update nested metadata, for example `{ "name": "acc.json", "project_id": "my-project", "headers.X-Team": "prod" }`. A `headers` object is merged with existing custom headers, and an empty header value removes that header.

### Authenticated Upstream Calls

- POST `/api-call` — Makes an outbound HTTP request, optionally using a credential from `auth_index` (also accepted as `authIndex` or `AuthIndex`). Request fields are `method`, absolute `url`, optional string-map `header`, and optional raw-string `data`.
- Use `$TOKEN$` in a header value to substitute the selected credential's access token or API key. Credential-specific proxy settings take precedence over the global `proxy-url`; otherwise the request connects directly. The response is `{ "status_code": 200, "header": { ... }, "body": "..." }` and preserves the upstream status in `status_code`.

This endpoint can issue arbitrary outbound requests using configured credentials. Restrict management-key access accordingly.

### Additional OAuth Flows and Callback

- GET `/kimi-auth-url` and GET `/xai-auth-url` start device-code flows. Both return `status`, `url`, `state`, and `flow: "device"`; they may also return `user_code` and `expires_in`.
- DELETE `/oauth-session?state=<state>` cancels a pending OAuth session and returns `{ "status": "ok", "cancelled": true|false }`. A cancelled device or callback flow does not persist credentials.
- GET/POST `/oauth-callback` accepts OAuth callback data outside the authenticated route group. GET uses `provider`, `state`, `code`, and `error`/`error_description` query parameters. POST accepts `{ "provider", "redirect_url", "code", "state", "error" }`; `redirect_url` may supply callback query values. The callback is accepted only for a valid, pending state whose provider matches the session.
- `GET /get-auth-status?state=...` returns `wait` while a session is pending, `ok` after completion, and `error` for failures, cancellation, expiration, or an unknown state. Completed states are retained briefly so clients can observe `ok`.

### Examples for Newly Added Endpoints

All examples below except the unauthenticated `/oauth-callback` examples require `Authorization: Bearer <MANAGEMENT_KEY>`.

#### Plugins

- List local plugins:
  ```bash
  curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
    http://localhost:8317/v0/management/plugins
  ```
  ```json
  {
    "plugins_enabled": true,
    "plugins_dir": "/abs/path/plugins",
    "plugins": [{
      "id": "example-plugin", "path": "/abs/path/plugins/example-plugin.so",
      "configured": true, "registered": true, "enabled": true,
      "effective_enabled": true, "supports_oauth": false,
      "oauth_provider": "", "logo": "", "config_fields": [], "menus": [],
      "metadata": { "name": "Example", "version": "1.0.0", "author": "Example", "github_repository": "", "logo": "", "config_fields": [] }
    }]
  }
  ```
- Read, replace, patch, enable, and delete a plugin configuration:
  ```bash
  curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
    http://localhost:8317/v0/management/plugins/example-plugin/config
  # {"enabled":true,"priority":10,"endpoint":"https://plugin.example.com"}

  curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' \
    -d '{"enabled":true,"priority":10,"endpoint":"https://plugin.example.com"}' \
    http://localhost:8317/v0/management/plugins/example-plugin/config
  # {"status":"ok"}

  curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' \
    -d '{"priority":20,"endpoint":null}' \
    http://localhost:8317/v0/management/plugins/example-plugin/config
  # {"status":"ok"}

  curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' \
    -d '{"enabled":false}' http://localhost:8317/v0/management/plugins/example-plugin/enabled
  # {"status":"ok"}
  ```
  ```bash
  curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
    http://localhost:8317/v0/management/plugins/example-plugin
  ```
  ```json
  { "status": "deleted", "id": "example-plugin", "path": "/abs/path/plugins/example-plugin.so", "file_deleted": true, "configured_removed": true, "restart_required": false }
  ```
- List and install from a plugin store:
  ```bash
  curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/plugin-store
  ```
  ```json
  { "plugins_enabled": true, "plugins_dir": "/abs/path/plugins", "sources": [{"id":"official","name":"Official","url":"https://example.com/registry.json"}], "plugins": [{"store_id":"official/example-plugin","source_id":"official","source_name":"Official","source_url":"https://example.com/registry.json","id":"example-plugin","name":"Example","description":"Example plugin","author":"Example","version":"1.2.3","repository":"example/example-plugin","install_type":"github-release","auth_required":false,"auth_configured":true,"installed":false,"installed_version":"","path":"","configured":false,"registered":false,"enabled":false,"effective_enabled":false,"update_available":false}] }
  ```
  ```bash
  curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' \
    -d '{"version":"1.2.3"}' 'http://localhost:8317/v0/management/plugin-store/example-plugin/install?source=official'
  ```
  ```json
  { "status": "installed", "source_id": "official", "source_name": "Official", "source_url": "https://example.com/registry.json", "id": "example-plugin", "version": "1.2.3", "install_type": "github-release", "path": "/abs/path/plugins/example-plugin.so", "plugins_enabled": true, "restart_required": false }
  ```

#### Runtime Settings and Logs

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/logs-max-total-size-mb
# {"logs-max-total-size-mb":512}
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"value":20}' http://localhost:8317/v0/management/error-logs-max-files
# {"status":"ok"}
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"value":true}' http://localhost:8317/v0/management/force-model-prefix
# {"status":"ok"}
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"value":"fill-first"}' http://localhost:8317/v0/management/routing/strategy
# {"status":"ok"}
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/logs?limit=2'
```
```json
{ "lines": ["2026-05-05 12:00:00 info request accepted"], "line-count": 1, "latest-timestamp": 1777982400, "next-cursor": "<OPAQUE_CURSOR>" }
```
```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/logs?cursor=<OPAQUE_CURSOR>&limit=100'
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -OJ http://localhost:8317/v0/management/request-log-by-id/req_123
```

#### Provider API Key Collections

The following examples show every collection method. Replace the endpoint and key shape for the desired provider.

```bash
# Interactions: GET, PUT, PATCH, DELETE
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/interactions-api-key
# {"interactions-api-key":[{"api-key":"AIza...","auth-index":"a1b2","base-url":"https://generativelanguage.googleapis.com","excluded-models":[]}]}
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '[{"api-key":"AIza...","priority":10,"prefix":"team/","base-url":"https://generativelanguage.googleapis.com","proxy-url":"","models":[],"headers":{"X-Team":"prod"},"excluded-models":["gemini-2.0-flash"],"disable-cooling":true}]' http://localhost:8317/v0/management/interactions-api-key
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"index":0,"value":{"proxy-url":"socks5://127.0.0.1:1080"}}' http://localhost:8317/v0/management/interactions-api-key
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/interactions-api-key?api-key=AIza...&base-url=https%3A%2F%2Fgenerativelanguage.googleapis.com'
# Each mutation returns: {"status":"ok"}

# xAI: GET, PUT, PATCH, DELETE
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/xai-api-key
# {"xai-api-key":[{"api-key":"xai...","auth-index":"c3d4","base-url":"https://api.x.ai/v1","websockets":true}]}
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '[{"api-key":"xai...","priority":10,"prefix":"xai/","base-url":"https://api.x.ai/v1","websockets":true,"proxy-url":"","models":[{"name":"grok-3","alias":"grok"}],"headers":{},"excluded-models":[],"disable-cooling":false}]' http://localhost:8317/v0/management/xai-api-key
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"match":"xai...","value":{"websockets":false}}' http://localhost:8317/v0/management/xai-api-key
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/xai-api-key?index=0'
# Each mutation returns: {"status":"ok"}

# Vertex-compatible: GET, PUT, PATCH, DELETE
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/vertex-api-key
# {"vertex-api-key":[{"api-key":"vertex...","auth-index":"e5f6","base-url":"https://vertex.example.com"}]}
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '[{"api-key":"vertex...","priority":10,"prefix":"vertex/","base-url":"https://vertex.example.com","proxy-url":"","headers":{},"models":[{"name":"gemini-2.5-pro","alias":"vertex-gemini","display-name":"Vertex Gemini","force-mapping":true}],"excluded-models":[]}]' http://localhost:8317/v0/management/vertex-api-key
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"match":"vertex...","value":{"headers":{"X-Team":"prod"}}}' http://localhost:8317/v0/management/vertex-api-key
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/vertex-api-key?index=0'
# Each mutation returns: {"status":"ok"}
```

#### OAuth Aliases, Auth Files, and Upstream Calls

```bash
# OAuth model aliases: GET, PUT, PATCH, DELETE
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/oauth-model-alias
# {"oauth-model-alias":{"codex":[{"name":"gpt-5","alias":"gpt-5-fast","fork":true,"display-name":"GPT-5 Fast","force-mapping":true}]}}
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"codex":[{"name":"gpt-5","alias":"gpt-5-fast","fork":true,"display-name":"GPT-5 Fast","force-mapping":true}]}' http://localhost:8317/v0/management/oauth-model-alias
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"channel":"codex","aliases":[{"name":"gpt-5","alias":"gpt-5-fast"}]}' http://localhost:8317/v0/management/oauth-model-alias
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/oauth-model-alias?channel=codex'
# Each mutation returns: {"status":"ok"}

# Credential models, static definitions, status, and metadata
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/auth-files/models?name=codex-user.json'
# {"models":[{"id":"gpt-5","display_name":"GPT-5","type":"model","owned_by":"openai"}]}
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/model-definitions/codex
# {"channel":"codex","models":[...]}
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"name":"codex-user.json","disabled":true}' http://localhost:8317/v0/management/auth-files/status
# {"status":"ok","disabled":true}
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"name":"codex-user.json","project_id":"my-project","headers.X-Team":"prod"}' http://localhost:8317/v0/management/auth-files/fields
# {"status":"ok"}

# Authenticated upstream request
curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"auth_index":"a1b2","method":"GET","url":"https://api.example.com/v1/ping","header":{"Authorization":"Bearer $TOKEN$"}}' http://localhost:8317/v0/management/api-call
# {"status_code":200,"header":{"Content-Type":["application/json"]},"body":"{\"ok\":true}"}
```

#### Device OAuth and Callback

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/kimi-auth-url
# {"status":"ok","url":"https://...","state":"kmi-...","flow":"device","user_code":"ABCD-EFGH","expires_in":900}
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/xai-auth-url
# {"status":"ok","url":"https://...","state":"xai-...","flow":"device","user_code":"ABCD-EFGH","expires_in":1800}
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/get-auth-status?state=xai-...'
# {"status":"wait"}
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/oauth-session?state=xai-...'
# {"status":"ok","cancelled":true}

# Callback routes do not use the management-key middleware; state validation protects them.
curl 'http://localhost:8317/v0/management/oauth-callback?provider=codex&state=codex-...&code=AUTHORIZATION_CODE'
# {"status":"ok"}
curl -X POST -H 'Content-Type: application/json' -d '{"provider":"codex","state":"codex-...","code":"AUTHORIZATION_CODE"}' http://localhost:8317/v0/management/oauth-callback
# {"status":"ok"}
```

## Error Responses

Generic error format:
- 400 Bad Request: `{ "error": "invalid body" }`
- 401 Unauthorized: `{ "error": "missing management key" }` or `{ "error": "invalid management key" }`
- 403 Forbidden: `{ "error": "remote management disabled" }`
- 404 Not Found: `{ "error": "item not found" }` or `{ "error": "file not found" }`
- 422 Unprocessable Entity: `{ "error": "invalid_config", "message": "..." }`
- 500 Internal Server Error: `{ "error": "failed to save config: ..." }`
- 503 Service Unavailable: `{ "error": "core auth manager unavailable" }`

## Notes

- Changes are written back to the YAML config file and hot‑reloaded by the file watcher and clients.
- `remote-management.allow-remote` and `remote-management.secret-key` cannot be changed via the API; configure them in the config file.
