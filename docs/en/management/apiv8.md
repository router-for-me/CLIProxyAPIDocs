---
outline: 'deep'
---

# Management API v8

Base path: `http://localhost:8317/v8/management`

This is the configuration and operations API for the v8 layout. Configuration paths mirror the v8 YAML tree documented in [Configuration Options](../configuration/options). A successful configuration write persists the file and hot-reloads the service.

`/v0/management` remains available for existing clients, but it is near deprecation. Do not build new functionality against that API.

## Authentication

- Every request except the OAuth callback must carry a valid management key, including requests from localhost.
- Remote access requires `management.allow-remote: true`. Until a v8 write migrates the file, the legacy name `remote-management.allow-remote` still works.
- Send the plaintext key with either header:
    - `Authorization: Bearer <plaintext-key>`
    - `X-Management-Key: <plaintext-key>`

Additional notes:

- `MANAGEMENT_PASSWORD` registers an extra in-memory management secret and keeps remote management enabled even when `allow-remote` is false. It is never written to disk.
- `cliproxy run --password <pwd>` and the SDK `WithLocalManagementPassword` accept that password from localhost (`127.0.0.1` or `::1`) only. It stays in memory.
- Routes return 404 when `management.secret-key` is empty, `MANAGEMENT_PASSWORD` is unset, and no local management password was configured. The same 404 applies to `/v0/management`.
- Home mode does not expose this API and also returns 404.
- Five consecutive authentication failures from one client IP, including localhost, impose a temporary ban of about 30 minutes.
- A plaintext `management.secret-key` is bcrypt-hashed when the configuration is loaded or saved.

## Request and response conventions

- Authenticated configuration and operation bodies use `Content-Type: application/json` unless the endpoint says otherwise.
- A v8 configuration body is the value itself. Do not wrap it in `{ "value": ... }`, `{ "items": ... }`, or a legacy field name.
- `GET /config` and `GET /config/<path>` return that YAML node as JSON. A missing path returns `404` with `{ "error": "not_found" }`.
- `PUT` replaces the selected node. `PATCH` deep-merges objects and replaces every other kind. `null` is stored; it does not delete a field. Use `DELETE` to remove a field.
- Path segments are YAML mapping keys. They are not array indexes. Lists are replaced as a whole.
- A successful configuration mutation returns `{ "status": "ok", "config-version": 8 }` and hot-reloads the saved file.
- `GET` returns a v8 view but does not rewrite the file. The first successful `PUT`, `PATCH`, or `DELETE` migrates a legacy file to `config-version: 8`, removes legacy spellings, and preserves comments. A rejected write does not migrate the file.
- v8 writes reject legacy field names and unknown root sections. See the legacy map in [Configuration Options](../configuration/options).

These fields are owned by Home. Changing them returns `400` with `{ "error": "read_only_field", "field": "<path>" }`:

- `credentials/concurrency/lifecycle-config-revision`
- `credentials/concurrency/observation-barrier-revision`
- `plugins/auth-revision`

## Configuration

Field names, defaults, and provider rules are defined in [Configuration Options](../configuration/options). The examples below show only the transport.

### Read configuration

- `GET /config` — full v8 document.
- `GET /config/<section>/<key>/...` — one nested node.
- `GET /config.yaml` — the same v8 view as YAML.

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/config
```

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/config/routing/strategy
```

```text
"round-robin"
```

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Accept: application/yaml' \
  http://localhost:8317/v8/management/config.yaml
```

Notes:

- Responses send `Cache-Control: no-store`.
- YAML uses `Content-Type: application/yaml; charset=utf-8`.
- JSON reads omit `username` and `credential` from `oauth.providers.codex.live-media-relay.ice-servers`. The YAML read still contains them.
- When no usable configuration can be read, the handler returns `500` with `{ "error": "read_failed" }` or `{ "error": "invalid_config" }`.

### Replace or merge configuration

- `PUT /config` replaces the whole document. The body must be a JSON object.
- `PATCH /config` deep-merges a JSON object into the document.
- `PUT /config/<path>` replaces that node. The body is the raw JSON value: object, array, string, number, boolean, or `null`.
- `PATCH /config/<path>` merges when both the current node and the body are objects; otherwise it replaces the node.
- `PUT /config.yaml` replaces the file from a v8 YAML document. `Content-Type` may be `application/yaml`. There is no `PATCH` for `/config.yaml`.

```bash
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"routing":{"retry":{"request-retry":0}},"oauth":{"providers":{"aistudio":{"ws-auth":false}}}}' \
  http://localhost:8317/v8/management/config
```

```bash
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '"direct"' \
  http://localhost:8317/v8/management/config/requests/proxy-url
```

```bash
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '["client-key-1","client-key-2"]' \
  http://localhost:8317/v8/management/config/access/api-keys
```

```bash
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"enabled":true,"priority":10}' \
  http://localhost:8317/v8/management/config/plugins/configs/example-plugin
```

```bash
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/yaml' \
  --data-binary @config.yaml \
  http://localhost:8317/v8/management/config.yaml
```

Response:

```json
{ "status": "ok", "config-version": 8 }
```

Upstream API keys are lists of groups. Replace the provider list; a path cannot select `api-keys/codex/0`.

```bash
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '[{"name":"codex-1","base-url":"https://example.invalid","keys":[{"api-key":"sk-example","weight":1}]}]' \
  http://localhost:8317/v8/management/config/api-keys/codex
```

Notes:

- A legacy envelope such as `{ "value": 0 }` is not a v8 value and fails validation.
- Unknown sections, legacy names, and values that fail configuration parsing are rejected. The previous file stays in place.
- Writing the redacted JSON ICE-server list back preserves TURN `username` and `credential` for an entry with the same `urls`. An explicit empty string or `null` clears the secret. A YAML replacement does not preserve omitted secrets.
- The write updates the existing config file in place, so a Docker file mount keeps the same inode.
- Changing `management.secret-key` or `management.allow-remote` is possible. An empty secret with no fallback password makes later management calls return 404.

### Delete a configuration field

- `DELETE /config/<path>` removes that field and prunes mapping ancestors that become empty.
- `DELETE /config` is rejected.

```bash
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/config/requests/proxy-url
```

## Server

### Latest version

- `GET /server/latest-version` — latest GitHub release tag. It does not download assets.

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/server/latest-version
```

```json
{ "latest-version": "v1.2.3" }
```

The lookup uses `https://api.github.com/repos/router-for-me/CLIProxyAPI/releases/latest` with `User-Agent: CLIProxyAPI`. A configured `requests.proxy-url` is honored.

## Requests

### Authenticated upstream call

- `POST /requests/api-call` — send one outbound HTTP request, optionally with a stored credential.

```bash
curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"auth_index":"a1b2","method":"GET","url":"https://api.example.com/v1/ping","header":{"Authorization":"Bearer $TOKEN$"}}' \
  http://localhost:8317/v8/management/requests/api-call
```

```json
{ "status_code": 200, "header": { "Content-Type": ["application/json"] }, "body": "{\"ok\":true}" }
```

Notes:

- Required fields are `method` and an absolute `url`. Optional fields are string-map `header`, raw-string `data`, and `proxy_url`.
- `auth_index` is also accepted as `authIndex` or `AuthIndex`.
- `$TOKEN$` in a header is replaced with the selected credential's access token or API key.
- The credential proxy takes precedence over the request `proxy_url` and the global proxy. The response preserves the upstream status in `status_code`.
- This can call arbitrary URLs with stored credentials. Protect the management key.

## Routing

### Reset cooldown

- `POST /routing/cooldown/reset` — clear quota and cooldown state for one credential.

```bash
curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"auth_index":"a1b2"}' \
  http://localhost:8317/v8/management/routing/cooldown/reset
```

```json
{ "status": "ok", "auth_index": "a1b2", "models": ["gpt-5.4"] }
```

An unknown `auth_index` returns `404` with `{ "error": "auth not found" }`.

### Static model definitions

- `GET /routing/model-definitions/:channel` — static catalog metadata for one channel.

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/routing/model-definitions/codex
```

The response is `{ "channel": "codex", "models": [ ... ] }`.

An unknown channel returns `400` with `{ "error": "unknown channel", "channel": "..." }`.

## Observability

### Application logs

- `GET /observability/logs` — read log lines.
- `DELETE /observability/logs` — delete rotated logs and truncate the active log.

Query parameters for `GET`:

- `after`: Unix timestamp. Return only newer lines.
- `limit`: maximum lines. With `limit` and no `after`, the newest lines are returned.
- `cursor`: opaque cursor from a previous `next-cursor`.

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  'http://localhost:8317/v8/management/observability/logs?limit=2'
```

```json
{
  "lines": ["2026-05-05 12:00:00 info request accepted"],
  "line-count": 1,
  "latest-timestamp": 1777982400,
  "next-cursor": "<OPAQUE_CURSOR>"
}
```

Notes:

- File logging must be enabled through `observability.logs.logging-to-file`. Otherwise the response is `400` with `{ "error": "logging to file disabled" }`.
- A missing log file returns empty `lines` and `line-count: 0`.
- Pass `next-cursor` back as `cursor`. A reset response includes `"cursor-reset": true`.
- `DELETE` returns `{ "success": true, "message": "Logs cleared successfully", "removed": 3 }`.

### Request error logs

- `GET /observability/logs/errors` — list `error-*.log` files.
- `GET /observability/logs/errors/:name` — download one error log.
- `GET /observability/logs/requests/:id` — download the request log whose filename ends in `-<id>.log`.

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/observability/logs/errors
```

```json
{ "files": [{ "name": "error-2026-05-05.log", "size": 12345, "modified": 1777982400 }] }
```

Notes:

- When request logging is enabled, the error-log list is empty.
- `:name` must be an existing `error-*.log` filename without path separators.
- `:id` must not contain path separators.

### Usage

- `GET /observability/usage/queue?count=10` — pop up to `count` usage records. `count` defaults to `1` and must be a positive integer. Records are removed from the in-memory queue. An empty queue returns `[]`.
- `GET /observability/usage/api-keys` — in-memory success and failure buckets for API-key credentials, grouped by provider and keyed by `base_url|api_key`.

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  'http://localhost:8317/v8/management/observability/usage/queue?count=10'
```

The local Redis RESP usage output is disabled. Enable aggregation with `observability.usage.usage-statistics-enabled` before expecting records.

## Credentials

These routes manage files and runtime state under `oauth.auth-dir`. They do not edit `api-keys` groups; use the configuration routes for those.

### List, upload, and delete

- `GET /credentials` — list credential files and runtime records.
- `POST /credentials` — upload one `.json` credential, as multipart field `file` or as a raw JSON body with `?name=<file.json>`.
- `DELETE /credentials?name=<file.json>` — delete one on-disk credential and disable it in the runtime.
- `DELETE /credentials?all=true` — delete every on-disk `.json` credential. The response is `{ "status": "ok", "deleted": 3 }`.
- `GET /credentials/download?name=<file.json>` — download one on-disk credential.
- `GET /credentials/models?name=<file-or-id>` — model definitions for one credential: `{ "models": [ ... ] }`.

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/credentials
```

```json
{
  "files": [
    {
      "id": "claude-user@example.com",
      "auth_index": "a1b2c3d4e5f67890",
      "name": "claude-user@example.com.json",
      "provider": "claude",
      "status": "ready",
      "disabled": false,
      "unavailable": false,
      "runtime_only": false,
      "source": "file"
    }
  ]
}
```

Notes:

- Entries are sorted by `name`. `runtime_only: true` means the credential exists only in memory; those entries cannot be downloaded or deleted here.
- Upload requires the core auth manager. If it is unavailable the response is `503` with `{ "error": "core auth manager unavailable" }`.
- Upload filenames must end in `.json`. A successful upload is registered immediately and returns `{ "status": "ok" }`.

### Status, fields, and refresh

- `PATCH /credentials/status` — `{ "name": "<file-or-id>", "disabled": true }`. API-key records are disabled through their excluded-model configuration. A plugin virtual child cannot be changed on its own.
- `PATCH /credentials/fields` — `{ "name": "<file-or-id>", ...fields }`. Dot paths update nested metadata, for example `headers.X-Team`. A `headers` object merges with existing headers; an empty value removes that header.
- `POST /credentials/refresh` — refresh file-backed OAuth credentials.

```bash
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"name":"codex-user.json","disabled":true}' \
  http://localhost:8317/v8/management/credentials/status
```

### Quota

- `GET /credentials/quota/providers` — registered quota providers. The response is `{ "providers": [ ... ] }`.
- `POST /credentials/quota/fetch` — fetch quota for one credential.
- `POST /credentials/quota/reset` — reset quota for one credential through its provider.

```bash
curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"auth_index":"a1b2","provider":"codex"}' \
  http://localhost:8317/v8/management/credentials/quota/fetch
```

`auth_index` is required and is also accepted as `authIndex` or `AuthIndex`. Optional `plugin_id` selects one plugin provider; optional `provider` overrides the credential provider. No available provider returns `501`. Fetch and reset failures return `502`.

## OAuth

### Start a login

- `GET /oauth/auth-url?provider=<provider>` — start a provider login and return the browser URL.

Providers: `claude`, `codex`, `antigravity`, `kimi`, `kimi-ai`, `xai`, `devin`, `meta`, and an OAuth provider registered by a plugin.

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  'http://localhost:8317/v8/management/oauth/auth-url?provider=claude&is_webui=true'
```

```json
{ "status": "ok", "url": "https://...", "state": "anth-1716206400" }
```

Notes:

- A missing `provider` returns `400` with `{ "error": "provider is required" }`. An unknown provider returns `404` with `{ "error": "provider_not_found" }` unless a plugin handles it.
- `is_webui=true` reuses the management UI callback forwarder for providers that support it.
- Device-code providers can also return `flow`, `user_code`, and `expires_in`.

### Poll and cancel

- `GET /oauth/status?state=<state>` — `wait` while pending, `ok` after success, or `error` with an `error` string. Completed states remain briefly so a client can observe `ok`.
- `DELETE /oauth/session?state=<state>` — cancel a pending session. Response: `{ "status": "ok", "cancelled": true }`. A cancelled flow does not store credentials.

### Import

- `POST /oauth/import?provider=vertex` — import a Google service-account JSON file. `vertex` is the supported provider.

```bash
curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -F 'file=@/path/to/service-account.json' \
  -F 'location=us-central1' \
  'http://localhost:8317/v8/management/oauth/import?provider=vertex'
```

```json
{
  "status": "ok",
  "auth-file": "/abs/path/auths/vertex-my-project.json",
  "project_id": "my-project",
  "email": "svc@my-project.iam.gserviceaccount.com",
  "location": "us-central1"
}
```

The upload is `multipart/form-data` in the `file` field. `location` is optional and defaults to `us-central1`.

### Callback

`GET /oauth/callback` and `POST /oauth/callback` are outside the management-key middleware. They accept a callback only for a pending state whose provider matches the session.

- `GET` reads `provider`, `state`, `code`, and `error` or `error_description`.
- `POST` accepts `{ "provider", "redirect_url", "code", "state", "error" }`. `redirect_url` may carry the callback query.

```bash
curl 'http://localhost:8317/v8/management/oauth/callback?provider=codex&state=codex-...&code=AUTHORIZATION_CODE'
```

```json
{ "status": "ok" }
```

## Plugins

Plugin enablement and plugin-owned settings are configuration, not separate routes:

- `GET /config/plugins` reads the plugin section.
- `PUT` or `PATCH /config/plugins/configs/<plugin-id>` replaces or merges one plugin object.
- `PUT /config/plugins/configs/<plugin-id>/enabled` with `true` or `false` changes only that flag. It does not change `plugins.enabled`.

### Discovery and store

- `GET /plugins` — discovered, configured, and registered plugins, including `plugins_enabled`, `plugins_dir`, and per-plugin id, path, enabled state, metadata, config fields, and menus.
- `DELETE /plugins/:id` — remove the local plugin file and its saved configuration. A plugin that cannot be unloaded returns `409` and may set `restart_required: true`.
- `GET /plugins/store` — store catalog, source errors, install state, and update availability.
- `POST /plugins/store/:id/install` — download or update one plugin and enable it. Use `?source=<source-id>` when IDs collide. `version` may be a query parameter or `{ "version": "1.2.3" }`.

```bash
curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"version":"1.2.3"}' \
  'http://localhost:8317/v8/management/plugins/store/example-plugin/install?source=official'
```

```json
{
  "status": "installed",
  "source_id": "official",
  "id": "example-plugin",
  "version": "1.2.3",
  "path": "/abs/path/plugins/example-plugin.so",
  "restart_required": false
}
```

Store installs can download executable artifacts. Trust store sources before enabling them.

### Plugin quota

- `GET /plugins/:id/quota?auth_index=<auth-index>`
- `POST /plugins/:id/quota` with `{ "auth_index": "<auth-index>" }`
- `DELETE /plugins/:id/quota?auth_index=<auth-index>`

`authIndex` is accepted as an alias. A missing quota provider returns `404`. Provider failures return `502`. v8 does not register the legacy `/quota/reset` alias.

## Error responses

Configuration and operation handlers use their own error strings. Common results are:

- `400` `{ "error": "invalid_json" }`, `{ "error": "invalid_body" }`, `{ "error": "invalid_path" }`, `{ "error": "config_must_be_object" }`, `{ "error": "cannot_delete_config" }`, or `{ "error": "invalid_config", "message": "..." }`
- `400` `{ "error": "read_only_field", "field": "plugins/auth-revision" }`
- `401` `{ "error": "missing management key" }` or `{ "error": "invalid management key" }`
- `403` `{ "error": "remote management disabled" }`
- `404` `{ "error": "not_found" }`, `{ "error": "provider_not_found" }`, or `{ "error": "auth not found" }`
- `409` plugin unload or restart required
- `422` `{ "error": "invalid_config", "message": "..." }` when the document parses but fails configuration validation
- `500` `{ "error": "write_failed", "message": "..." }` or `{ "error": "read_failed" }`
- `501` no quota provider is available
- `502` quota provider failure
- `503` `{ "error": "core auth manager unavailable" }`

An empty management secret with no fallback password returns `404` before these handlers run.

## Notes

- New clients should send v8 paths only. After the file is migrated, a legacy `/v0/management` update still edits the effective value, but it is not a contract for new work.
- `quota-exceeded.switch-project` and `quota-exceeded.switch-preview-model` have no v8 names. Do not add features that depend on them.
- OAuth provider settings under `oauth.providers` do not apply to `api-keys` groups. Keep those credentials in the group and key fields documented for upstream API keys.
