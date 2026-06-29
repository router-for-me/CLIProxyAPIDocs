---
outline: 'deep'
---

# Plugin Development

CLIProxyAPI's plugin system connects model, credential, scheduling, translation, interception, usage observation, command line extension, and management page capabilities into the host flow. Plugins run as native dynamic libraries inside the CLIProxyAPI process. The host calls plugins through a stable C ABI, and plugins can call back into the host to reuse CLIProxyAPI's existing HTTP, model execution, credential file, and logging capabilities.

## Scope

Plugins are suitable for:

- Providing model lists, credential parsing, login refresh, and request execution capabilities for a new upstream.
- Translating requests, normalizing requests, choosing schedules, or intercepting requests before they reach upstream.
- Translating responses, normalizing responses, or intercepting streaming chunks before responses return to clients.
- Receiving usage records or adding plugin-specific pages and diagnostic endpoints to the management side.
- Calling the host's existing model execution path instead of copying secrets, proxy settings, logging, usage accounting, and routing logic into the plugin.

Plugins are not suitable for running untrusted code. Standard dynamic library plugins run in the same process as the service binary. The host can recover from some panics, but it cannot prevent a plugin from exiting the process, corrupting memory, changing process-wide state, or leaking sensitive data.

## Capability Documents

Each capability has its own page. The content is organized from `sdk/pluginapi/types.go`, `sdk/pluginabi/types.go`, `internal/pluginhost` call paths, and `examples/plugin` examples.

| Category | Capability | Document |
| --- | --- | --- |
| Entry capability | `model_registrar` | [Model registrar](./model-registrar) |
| Entry capability | `model_provider` | [Model provider](./model-provider) |
| Entry capability | `auth_provider` | [Credential provider](./auth-provider) |
| Entry capability | `frontend_auth_provider` | [Frontend authentication provider](./frontend-auth-provider) |
| Entry capability | `frontend_auth_provider_exclusive` | [Frontend authentication exclusive mode](./frontend-auth-exclusive) |
| Entry capability | `scheduler` | [Scheduler](./scheduler) |
| Entry capability | `model_router` | [Model router](./model-router) |
| Entry capability | `executor` | [Executor](./executor) |
| Request processing | `request_translator` | [Request translator](./request-translator) |
| Request processing | `request_normalizer` | [Request normalizer](./request-normalizer) |
| Request processing | `request_interceptor` | [Request interceptor](./request-interceptor) |
| Response processing | `response_translator` | [Response translator](./response-translator) |
| Response processing | `response_before_translator` | [Response pre-translation normalizer](./response-before-translator) |
| Response processing | `response_after_translator` | [Response post-translation normalizer](./response-after-translator) |
| Response processing | `response_interceptor` | [Response interceptor](./response-interceptor) |
| Response processing | `response_stream_interceptor` | [Streaming response interceptor](./response-stream-interceptor) |
| Extension capability | `thinking_applier` | [Thinking applier](./thinking-applier) |
| Extension capability | `usage_plugin` | [Usage observer](./usage-plugin) |
| Extension capability | `command_line_plugin` | [Command line extension](./command-line-plugin) |
| Extension capability | `management_api` | [Management API](./management-api) |
| Host capability | `host.*` | [Host callbacks](./host-callbacks) |

## Runtime Requirements

Plugin capabilities require a CGO build. Management API responses include:

```http
X-CPA-SUPPORT-PLUGIN: 1
```

`1` means the current binary supports dynamic library plugins, and `0` means it does not. This header only reports build capability. It does not mean plugins are enabled or that a specific plugin has been loaded.

The global plugin switch must also be enabled in configuration:

```yaml
plugins:
  enabled: true
  dir: "plugins"
  configs: {}
```

If `plugins.enabled` is `false`, plugin files and individual plugin configuration can still exist, but they do not become effectively enabled.

## Plugin File Discovery

The plugin ID comes from the dynamic library file name without the extension. For example:

```text
plugins/darwin/arm64/example-provider.dylib
```

Corresponding configuration key:

```yaml
plugins:
  configs:
    example-provider:
      enabled: true
      priority: 1
```

Plugin IDs must match:

```text
[A-Za-z0-9][A-Za-z0-9._-]{0,127}
```

The host searches these paths in order for the current platform:

```text
plugins/<GOOS>/<GOARCH>-<variant>
plugins/<GOOS>/<GOARCH>
plugins
```

macOS uses `.dylib`, Linux and FreeBSD use `.so`, and Windows uses `.dll`. If the same plugin ID appears in multiple directories, the higher-priority directory wins.

## ABI Basics

Every standard dynamic library plugin must export:

```c
int cliproxy_plugin_init(const cliproxy_host_api* host, cliproxy_plugin_api* plugin);
```

During initialization, the plugin fills its function table:

```c
int call(char* method, uint8_t* request, size_t request_len, cliproxy_buffer* response);
void free_buffer(void* ptr, size_t len);
void shutdown(void);
```

The host-provided function table lets the plugin call back into the host:

```c
int call(void* host_ctx, char* method, uint8_t* request, size_t request_len, cliproxy_buffer* response);
void free_buffer(void* ptr, size_t len);
```

The C ABI only passes method names, byte arrays, and lengths. It does not pass Go interfaces, Go slices, Go maps, Go channels, `context.Context`, or Go errors. Requests and responses use JSON envelopes, and raw byte fields are automatically represented as base64 in JSON.

Successful response:

```json
{
  "ok": true,
  "result": {}
}
```

Error response:

```json
{
  "ok": false,
  "error": {
    "code": "invalid_request",
    "message": "request is invalid"
  }
}
```

## Lifecycle

The host calls these base methods:

| Method | Direction | Purpose |
| --- | --- | --- |
| `plugin.register` | Host calls plugin | Loads the plugin for the first time and reads metadata, configuration fields, and capability declarations. |
| `plugin.reconfigure` | Host calls plugin | Passes updated configuration to the plugin after configuration changes. |
| `plugin.shutdown` | Host calls plugin | Releases resources when the plugin is unloaded or the host shuts down. |

Requests for `plugin.register` and `plugin.reconfigure` include `config_yaml`. It comes from `plugins.configs.<pluginID>`. The host preserves the plugin's own YAML fields and only parses the host-owned `enabled` and `priority` fields.

The registration response must return:

```json
{
  "schema_version": 1,
  "metadata": {
    "Name": "example-provider",
    "Version": "0.1.0",
    "Author": "router-for-me",
    "GitHubRepository": "https://github.com/router-for-me/example-provider",
    "Logo": "https://example.com/logo.png",
    "ConfigFields": [
      {
        "Name": "mode",
        "Type": "enum",
        "EnumValues": ["safe", "fast"],
        "Description": "Execution mode."
      }
    ]
  },
  "capabilities": {
    "request_normalizer": true,
    "management_api": true
  }
}
```

`ConfigFields` is used by the management side to render plugin-owned configuration. It does not replace the plugin's own configuration validation. The plugin should still validate the fields it cares about in `plugin.register` or `plugin.reconfigure`.

## Configuration Semantics

Recommended minimum configuration:

```yaml
plugins:
  enabled: true
  dir: "plugins"
  configs:
    example-provider:
      enabled: true
      priority: 1
      mode: "safe"
```

Field meanings:

| Field | Description |
| --- | --- |
| `plugins.enabled` | Global plugin loading switch. |
| `plugins.dir` | Plugin discovery directory. The default is `plugins`. |
| `plugins.store-sources` | Additional plugin store registry URL list. |
| `plugins.configs.<pluginID>.enabled` | Individual plugin switch. If omitted, it is treated as enabled. |
| `plugins.configs.<pluginID>.priority` | Plugin startup, registration, and routing order. Higher-priority plugins run first. |
| Other fields | Plugin-owned configuration. The host preserves it as-is and passes it to the plugin. |

When the Management API updates configuration, it tries to preserve the original YAML tree and only changes the requested fields. After the plugin store installs a plugin, it writes the dynamic library and sets the corresponding plugin configuration to `enabled: true`, but it does not forcibly enable `plugins.enabled`.

## Capability Model

Plugins declare the capabilities they implement through `capabilities`. Common capabilities:

| Capability | Method Direction | Use |
| --- | --- | --- |
| Model registrar | `model.register` | Register static model metadata with the host. |
| Model provider | `model.static` / `model.for_auth` | Provide static models or models for credential records. |
| Credential provider | `auth.*` | Parse, log in, poll, and refresh credentials for the plugin provider. |
| Frontend authentication provider | `frontend_auth.*` | Authenticate client requests before proxy processing. |
| Scheduler | `scheduler.pick` | Select a credential from candidates or delegate to a built-in scheduler. |
| Model router | `model.route` | Route matching requests to a plugin executor, the router's own executor, or a built-in provider before provider/auth selection. |
| Executor | `executor.*` | Directly execute upstream requests or streaming requests. |
| Request translator | `request.translate` | Convert a canonical request into an upstream protocol. |
| Request normalizer | `request.normalize` | Normalize requests entering the execution path. |
| Request interceptor | `request.intercept_before` / `request.intercept_after` | Rewrite execution requests before or after credential selection. |
| Response translator | `response.translate` | Convert a canonical response into the client protocol. |
| Response normalizer | `response.normalize_before` / `response.normalize_after` | Normalize responses before or after native translation. |
| Response interceptor | `response.intercept_after` | Rewrite non-streaming responses. |
| Streaming response interceptor | `response.intercept_stream_chunk` | Rewrite streaming response chunks. |
| Thinking applier | `thinking.apply` | Apply a validated thinking configuration. |
| Usage observer | `usage.handle` | Receive completed request usage records. |
| Command line extension | `command_line.*` | Register and handle plugin-owned CLI flags. |
| Management API | `management.*` | Register plugin-owned management routes or browser resources. |

The host's general rule is native logic first and plugins fill the gaps. When multiple plugins can handle the same stage, higher-priority plugins run first.

## Host Callbacks

Host callbacks are plugin calls into the host, not host calls into plugins. They are suitable for reusing host-managed proxy behavior, credentials, model routing, logging, usage statistics, and resource management.

Common callbacks:

| Callback | Use |
| --- | --- |
| `host.http.do` | Execute one normal HTTP request through the host. |
| `host.http.do_stream` / `host.http.stream_read` / `host.http.stream_close` | Execute a streaming HTTP request through the host and read or close the stream. |
| `host.model.execute` | Start a non-streaming model request through the host model execution path. |
| `host.model.execute_stream` / `host.model.stream_read` / `host.model.stream_close` | Start a streaming model request through the host model execution path and read or close the stream. |
| `host.stream.emit` / `host.stream.close` | Let executor plugins send chunks to the host stream bridge or close a stream. |
| `host.log` | Write through the host logger. |
| `host.auth.list` | List host credential records. |
| `host.auth.get` | Read a physical credential JSON file. |
| `host.auth.get_runtime` | Read runtime credential information. |
| `host.auth.save` | Write credential JSON and update the runtime credential record. |

If a plugin calls `host.model.execute` or `host.model.execute_stream` from `management.handle` or another host-invoked context, it should forward the request's `host_callback_id`. The host uses it to identify the callback origin and skip the same plugin's request, response, and stream interceptors during nested model execution, preventing the plugin from recursively calling itself. Other enabled plugins can still handle the nested request.

Streaming callbacks should explicitly call the matching `*_close` method. The host can clean up some resources at the end of the RPC scope, but explicit close releases stream resources sooner and makes errors easier to locate.

## Management API And Plugin Resources

Plugins can declare two kinds of management capability:

1. Plugin-owned APIs that need to manage credentials.
2. Plugin resource pages that can be opened directly by a browser.

Their route boundaries are different:

| Type | Registration Field | Exposed Path | Authentication |
| --- | --- | --- | --- |
| Plugin-owned Management API | `routes` | `/v0/management/...` | Requires the management key. |
| Plugin resource page | `resources` | `/v0/resource/plugins/<pluginID>/...` | The resource request itself is not management-authenticated. In same-origin Management Center deployments, trusted page JavaScript may read the stored management key and call `/v0/management/...`. |

Example: when the plugin ID is `example-provider` and the resource path is `/status`, the final URL is:

```text
http://localhost:8317/v0/resource/plugins/example-provider/status
```

The plugin returns routes and resources from `management.register`:

```json
{
  "resources": [
    {
      "Path": "/status",
      "Menu": "Example Provider",
      "Description": "Show plugin status."
    }
  ],
  "routes": [
    {
      "Method": "POST",
      "Path": "/plugins/example-provider/run"
    }
  ]
}
```

The host forwards matching requests to `management.handle`. Requests contain method, path, headers, query, and body. Responses contain status code, headers, and body.

Notes:

- Plugin-owned Management API routes are checked against existing host `/v0/management` routes, and conflicting plugin routes are skipped.
- Plugin resource paths are always mounted under `/v0/resource/plugins/<pluginID>/`.
- Legacy GET management routes with `Menu` are handled as browser resources and are no longer exposed as management APIs.
- Resource paths cannot contain whitespace, `:`, `*`, or `..`.
- Installing and enabling a plugin with resource pages is a trust decision for that plugin's browser code. In same-origin deployments, that code can read the Management Center's `localStorage`, including the saved management key when it is present.
- Keep sensitive operations behind `/v0/management/...` routes. Let the resource page call those routes with the stored management key instead of performing sensitive work directly from an unauthenticated resource GET request.
- Bundle resource page scripts with the plugin. Do not load third-party scripts into a page that can access the same-origin management context.

## Management Endpoints

The following endpoints are under `/v0/management` and require the management key.

| Method And Path | Purpose |
| --- | --- |
| `GET /plugins` | Lists discovered, configured, and registered plugins, and returns `plugins_enabled`, `effective_enabled`, menus, metadata, and configuration fields. |
| `PATCH /plugins/{pluginID}/enabled` | Only updates `plugins.configs.<pluginID>.enabled`; it does not modify global `plugins.enabled`. |
| `GET /plugins/{pluginID}/config` | Gets the preserved configuration object for a plugin. |
| `PUT /plugins/{pluginID}/config` | Replaces the whole plugin configuration object. |
| `PATCH /plugins/{pluginID}/config` | Shallow-merges the configuration object; `null` values delete fields. |
| `DELETE /plugins/{pluginID}` | Target-unloads a plugin, deletes the local dynamic library, and removes saved configuration. |
| `GET /plugin-store` | Lists plugins in the plugin store and their local installation state. |
| `POST /plugin-store/{pluginID}/install` | Installs or updates a plugin from the plugin store; use `?source=<sourceID>` when multiple sources have the same ID. |

Do not mix up these status fields from `GET /plugins`:

- `plugins_enabled`: global plugin switch.
- `enabled`: individual plugin configuration switch.
- `registered`: dynamic library has been loaded and registration completed.
- `effective_enabled`: actual enabled state after the global switch, individual switch, and registration state are all satisfied.

When installing or updating a plugin, the host downloads the release asset and verifies `checksums.txt`, then target-unloads the plugin before overwriting the dynamic library, writes the new file, and triggers configuration hot reload. If the platform or file locks prevent an already loaded dynamic library from being overwritten, the endpoint returns a conflict response that requires restart.

## Plugin Store Publishing Format

Default plugin store registry:

```text
https://raw.githubusercontent.com/router-for-me/CLIProxyAPI-Plugins-Store/main/registry.json
```

Additional third-party sources can be configured:

```yaml
plugins:
  store-sources:
    - "https://example.com/cliproxyapi-plugins/registry.json"
```

Registry format:

```json
{
  "schema_version": 1,
  "plugins": [
    {
      "id": "example-provider",
      "name": "Example Provider",
      "description": "Example plugin provider.",
      "author": "router-for-me",
      "version": "0.1.0",
      "repository": "https://github.com/router-for-me/example-provider",
      "logo": "https://example.com/logo.png",
      "homepage": "https://example.com",
      "license": "MIT",
      "tags": ["provider"]
    }
  ]
}
```

Requirements:

- `schema_version` must be `1`.
- `id`, `name`, `description`, `author`, and `repository` are required.
- `repository` must be `https://github.com/{owner}/{repo}`.
- `version` is the display fallback. The actual installed version comes from the GitHub latest release tag. Tags may start with `v`; the host strips the leading `v` before version validation.

Plugin releases must provide a zip asset for the current platform and `checksums.txt`:

```text
<pluginID>_<version>_<goos>_<goarch>.zip
checksums.txt
```

The zip root must directly contain the target dynamic library:

```text
example-provider.dylib
```

Do not put the dynamic library in a subdirectory. `checksums.txt` uses the common sha256 format:

```text
<sha256>  example-provider_0.1.0_darwin_arm64.zip
```

## Development Advice

Start from the examples in the repository:

```bash
make -C examples/plugin list
make -C examples/plugin build
```

Common examples:

| Example | Focus |
| --- | --- |
| `examples/plugin/simple` | Complete ABI skeletons in Go, C, and Rust. |
| `examples/plugin/codex-service-tier` | Request normalizer plugin. |
| `examples/plugin/scheduler` | Scheduler plugin. |
| `examples/plugin/claude-web-search-router` | ModelRouter plugin that routes Claude Code `web_search` requests to built-in providers or its own executor. |
| `examples/plugin/management-api` | Plugin-owned management routes and resource pages. |
| `examples/plugin/host-callback-auth-files` | Calls host credential file callbacks. |
| `examples/plugin/host-model-callback` | Calls host model execution callbacks and demonstrates recursion protection. |

During development:

- Declare only capabilities the plugin actually implements.
- Prefer `host.http.*` for plugin-owned HTTP requests to avoid bypassing host proxy, logging, and transport policy.
- Prefer `host.model.*` when a model request is needed. Do not copy host credentials into the plugin.
- Explicitly close streaming resources after use.
- Do not expose host callbacks that read credentials, write credentials, or execute privileged actions directly through unauthenticated resource query parameters. Use a same-origin trusted resource page plus an authenticated `/v0/management/...` call when user-facing UI needs to trigger them.
- Keep plugin-owned configuration fields backward compatible and support old configuration when removing fields.
- Do not log secrets, tokens, raw credential JSON, or sensitive user request bodies.
- After changing a dynamic library, use the plugin management API or restart the service so the old plugin instance is no longer loaded.

## Minimal Verification Flow

After developing a local plugin, verify it with this flow:

1. Build the dynamic library for the current platform and place it in `plugins/<GOOS>/<GOARCH>/` or `plugins/`.
2. Enable `plugins.enabled` in `config.yaml` and add `plugins.configs.<pluginID>`.
3. Start CLIProxyAPI.
4. Request `GET /v0/management/plugins` and confirm `registered: true` and `effective_enabled: true`.
5. If the plugin has resource pages, open `/v0/resource/plugins/<pluginID>/<path>`.
6. If the plugin has a Management API, request the corresponding `/v0/management/...` route with the management key.
7. After modifying the plugin, install or delete it through the management API, or restart the service, and confirm the old dynamic library is no longer being used.
