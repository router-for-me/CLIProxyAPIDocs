---
outline: 'deep'
---

# Management API

Base path: `http://localhost:8317/v0/management`

This API manages the CLI Proxy API’s runtime configuration and authentication files. All changes are persisted to the YAML config file and hot‑reloaded by the service.

Note: The following options cannot be modified via API and must be set in the config file (restart if needed):
- `allow-remote-management`
- `remote-management-key` (if plaintext is detected at startup, it is automatically bcrypt‑hashed and written back to the config)

## Authentication

- All requests (including localhost) must provide a valid management key.
- Remote access requires enabling remote management in the config: `allow-remote-management: true`.
- Provide the management key (in plaintext) via either:
    - `Authorization: Bearer <plaintext-key>`
    - `X-Management-Key: <plaintext-key>`

Additional notes:
- Setting the `MANAGEMENT_PASSWORD` environment variable registers an additional plaintext management secret and forces remote management to stay enabled even when `allow-remote-management` is false. The value is never persisted and must be sent via the same `Authorization`/`X-Management-Key` headers.
- When the proxy starts with `cliproxy run --password <pwd>` or via the SDK’s `WithLocalManagementPassword`, localhost clients (`127.0.0.1`/`::1`) may present that local-only password through the same headers; it only lives in memory and is not written to disk.
- The Management API returns 404 only when both `remote-management.secret-key` is empty and `MANAGEMENT_PASSWORD` is unset.
- For remote IPs, 5 consecutive authentication failures trigger a temporary ban (~30 minutes) before further attempts are allowed.

If a plaintext key is detected in the config at startup, it will be bcrypt‑hashed and written back to the config file automatically.

## Request/Response Conventions

- Content-Type: `application/json` (unless otherwise noted).
- Boolean/int/string updates: request body is `{ "value": <type> }`.
- Array PUT: either a raw array (e.g. `["a","b"]`) or `{ "items": [ ... ] }`.
- Array PATCH: supports `{ "old": "k1", "new": "k2" }` or `{ "index": 0, "value": "k2" }`.
- Object-array PATCH: supports matching by index or by key field (specified per endpoint).

## Endpoints

### Usage Statistics
- GET `/usage` — Retrieve aggregated in-memory request metrics
    - Response:
      ```json
      {
        "usage": {
          "total_requests": 24,
          "success_count": 22,
          "failure_count": 2,
          "total_tokens": 13890,
          "requests_by_day": {
            "2024-05-20": 12
          },
          "requests_by_hour": {
            "09": 4,
            "18": 8
          },
          "tokens_by_day": {
            "2024-05-20": 9876
          },
          "tokens_by_hour": {
            "09": 1234,
            "18": 865
          },
          "apis": {
            "POST /v1/chat/completions": {
              "total_requests": 12,
              "total_tokens": 9021,
              "models": {
                "gpt-4o-mini": {
                  "total_requests": 8,
                  "total_tokens": 7123,
                  "details": [
                    {
                      "timestamp": "2024-05-20T09:15:04.123456Z",
                      "tokens": {
                        "input_tokens": 523,
                        "output_tokens": 308,
                        "reasoning_tokens": 0,
                        "cached_tokens": 0,
                        "total_tokens": 831
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        "failed_requests": 2
      }
      ```
    - Notes:
        - Statistics are recalculated for every request that reports token usage; data resets when the server restarts.
        - Hourly counters fold all days into the same hour bucket (`00`–`23`).
        - The top-level `failed_requests` repeats `usage.failure_count` for convenience when polling.

### Config
- GET `/config` — Get the full config
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/config
      ```
    - Response:
      ```json
      {"debug":true,"proxy-url":"","api-keys":["1...5","JS...W"],"ampcode":{"upstream-url":"https://ampcode.com","restrict-management-to-localhost":true},"quota-exceeded":{"switch-project":true,"switch-preview-model":true},"gemini-api-key":[{"api-key":"AI...01","base-url":"https://generativelanguage.googleapis.com","headers":{"X-Custom-Header":"custom-value"},"proxy-url":"","excluded-models":["gemini-1.5-pro","gemini-1.5-flash"]},{"api-key":"AI...02","proxy-url":"socks5://proxy.example.com:1080","excluded-models":["gemini-pro-vision"]}],"request-log":true,"request-retry":3,"claude-api-key":[{"api-key":"cr...56","base-url":"https://example.com/api","proxy-url":"socks5://proxy.example.com:1080","models":[{"name":"claude-3-5-sonnet-20241022","alias":"claude-sonnet-latest"}],"excluded-models":["claude-3-opus"]},{"api-key":"cr...e3","base-url":"http://example.com:3000/api","proxy-url":""},{"api-key":"sk-...q2","base-url":"https://example.com","proxy-url":""}],"codex-api-key":[{"api-key":"sk...01","base-url":"https://example/v1","proxy-url":"","excluded-models":["gpt-4o-mini"]}],"openai-compatibility":[{"name":"openrouter","base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk...01","proxy-url":""}],"models":[{"name":"moonshotai/kimi-k2:free","alias":"kimi-k2"}]},{"name":"iflow","base-url":"https://apis.iflow.cn/v1","api-key-entries":[{"api-key":"sk...7e","proxy-url":"socks5://proxy.example.com:1080"}],"models":[{"name":"deepseek-v3.1","alias":"deepseek-v3.1"},{"name":"glm-4.5","alias":"glm-4.5"},{"name":"kimi-k2","alias":"kimi-k2"}]}]}
      ```
    - Notes:
        - The response no longer includes `generative-language-api-key`; use `GET /generative-language-api-key` if you need a pure-string view.
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
        - The server validates the YAML by loading it before persisting; invalid configs return `422` with `{ "error": "invalid_config", "message": "..." }`.
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
          {"api-key":"AIzaSy...01","base-url":"https://generativelanguage.googleapis.com","headers":{"X-Custom-Header":"custom-value"},"proxy-url":"","excluded-models":["gemini-1.5-pro","gemini-1.5-flash"]},
          {"api-key":"AIzaSy...02","proxy-url":"socks5://proxy.example.com:1080","excluded-models":["gemini-pro-vision"]}
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

### Generative Language API Key (Legacy Alias)
- GET `/generative-language-api-key`
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/generative-language-api-key
      ```
    - Response:
      ```json
      { "generative-language-api-key": ["AIzaSy...01","AIzaSy...02"] }
      ```
- PUT `/generative-language-api-key`
    - Request:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '["AIzaSy-1","AIzaSy-2"]' \
        http://localhost:8317/v0/management/generative-language-api-key
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
- PATCH `/generative-language-api-key`
    - Request:
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"old":"AIzaSy-1","new":"AIzaSy-1b"}' \
        http://localhost:8317/v0/management/generative-language-api-key
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
- DELETE `/generative-language-api-key`
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/generative-language-api-key?value=AIzaSy-2'
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```
- Notes:
    - This endpoint mirrors the key-only view of `gemini-api-key`; writes are persisted in the new format and the legacy field is not kept in the config file.

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
      { "openai-compatibility": [ { "name": "openrouter", "base-url": "https://openrouter.ai/api/v1", "api-key-entries": [ { "api-key": "sk", "proxy-url": "" } ], "models": [], "headers": { "X-Provider": "openrouter" } } ] }
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
        -d '{"name":"openrouter","value":{"name":"openrouter","base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk","proxy-url":""}],"models":[],"headers":{"X-Provider":"openrouter"}}}' \
        http://localhost:8317/v0/management/openai-compatibility
      ```
    - Request (by index):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"index":0,"value":{"name":"openrouter","base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk","proxy-url":""}],"models":[],"headers":{"X-Provider":"openrouter"}}}' \
        http://localhost:8317/v0/management/openai-compatibility
      ```
    - Response:
      ```json
      { "status": "ok" }
      ```

    - Notes:
        - Legacy `api-keys` input remains accepted; keys are migrated into `api-key-entries` automatically so the legacy field will eventually remain empty in responses.
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
          "iflow": ["deepseek-v3.1", "glm-4.5"]
        }
      }
      ```
- PUT `/oauth-excluded-models` — Replace the full map
    - Request:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"openai":["gpt-4.1-mini"],"iflow":["deepseek-v3.1","glm-4.5"]}' \
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
        -d '{"provider":"iflow","models":["deepseek-v3.1","glm-4.5"]}' \
        http://localhost:8317/v0/management/oauth-excluded-models
      ```
    - Request (delete provider by sending empty models):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"provider":"iflow","models":[]}' \
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
        -X DELETE 'http://localhost:8317/v0/management/oauth-excluded-models?provider=iflow'
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

For Anthropic, Codex, Gemini CLI, Antigravity, and iFlow you can append `?is_webui=true` to reuse the embedded callback forwarder when launching from the management UI.

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

- GET `/gemini-cli-auth-url` — Start Google (Gemini CLI) login
    - Query params:
        - `project_id` (optional): Google Cloud project ID.
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        'http://localhost:8317/v0/management/gemini-cli-auth-url?project_id=<PROJECT_ID>'
      ```
    - Response:
      ```json
      { "status": "ok", "url": "https://...", "state": "gem-1716206400" }
      ```
    - Notes:
        - When `project_id` is omitted, the server queries Cloud Resource Manager for accessible projects, picks the first available one, and stores it in the token file (marked with `auto: true`).
        - The flow checks and, if needed, enables `cloudaicompanion.googleapis.com` via the Service Usage API; failures surface through `/get-auth-status` as errors such as `project activation required: ...`.

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

- GET `/qwen-auth-url` — Start Qwen login (device flow)
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/qwen-auth-url
      ```
    - Response:
      ```json
      { "status": "ok", "url": "https://...", "state": "gem-1716206400" }
      ```

- GET `/iflow-auth-url` — Start iFlow login
    - Request:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/iflow-auth-url
      ```
    - Response:
      ```json
      { "status": "ok", "url": "https://...", "state": "ifl-1716206400" }
      ```

- POST `/iflow-auth-url` — Authenticate using an existing iFlow cookie
    - Request body:
      ```bash
      curl -X POST -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"cookie":"<YOUR_IFLOW_COOKIE>"}' \
        http://localhost:8317/v0/management/iflow-auth-url
      ```
    - Successful response:
      ```json
      {
        "status": "ok",
        "saved_path": "/abs/path/auths/iflow-user.json",
        "email": "user@example.com",
        "expired": "2025-05-20T10:00:00Z",
        "type": "cookie"
      }
      ```
    - Notes:
        - The `cookie` field is required and must be non-empty; invalid or malformed cookies return `400` with `{ "status": "error", "error": "..." }`.
        - On success the server normalizes the cookie, exchanges it for an API token, persists it as an `iflow-*.json` auth file, and returns the saved path and basic metadata.

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
- `allow-remote-management` and `remote-management-key` cannot be changed via the API; configure them in the config file.
