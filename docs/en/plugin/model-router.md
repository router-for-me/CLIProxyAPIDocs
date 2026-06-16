---
outline: 'deep'
---

# Model Router Capability

The model router capability lets a plugin choose where a matching model request should execute before the host resolves the requested model to a provider and before auth selection runs.

Use it when request content, headers, query parameters, or the original client model should decide between:

- the router plugin's own executor;
- another plugin executor;
- a built-in provider path such as `codex`, `antigravity`, `xai`, or `claude`.

## Capability Field

```json
{
  "capabilities": {
    "model_router": true
  }
}
```

If the router can route to its own executor, declare the executor capability too:

```json
{
  "capabilities": {
    "model_router": true,
    "executor": true,
    "executor_model_scope": "static",
    "executor_input_formats": ["claude"],
    "executor_output_formats": ["claude"]
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `ModelRouter`, `ModelRouteRequest`, `ModelRouteResponse`, `ModelRouteTargetKind`
- `sdk/pluginabi/types.go`: `model.route`
- `internal/pluginhost/model_router.go`: router priority, target validation, and built-in provider availability checks
- `sdk/api/handlers/handlers.go`: request entry point before normal provider/auth resolution

Example references:

- `examples/plugin/claude-web-search-router/go/main.go`
- `examples/plugin/claude-web-search-router/go/fallback.go`

## Methods

| Method | Purpose |
| --- | --- |
| `model.route` | Returns a routing decision for the current client request. |

## When It Runs

The host asks enabled model routers before the normal model-to-provider lookup and auth selection. Higher-priority plugins run first. A router that returns `Handled: false`, an invalid target, or an unavailable target is skipped, and the host tries the next router. If no router handles the request, the normal host path continues.

The request still uses the original client protocol. For example, a Claude-compatible request arrives with `SourceFormat: "claude"` and the raw Claude request body in `Body`.

## Request

```json
{
  "Plugin": {},
  "PluginID": "claude-web-search-router",
  "SourceFormat": "claude",
  "RequestedModel": "claude-sonnet-4-6",
  "Stream": true,
  "Headers": {},
  "Query": {},
  "Body": "base64-client-body",
  "Metadata": {},
  "AvailableProviders": ["antigravity", "codex", "xai"]
}
```

Important fields:

| Field | Description |
| --- | --- |
| `PluginID` | Host-local ID of the router plugin being called. |
| `SourceFormat` | Original client protocol format, such as `openai`, `claude`, or `gemini`. |
| `RequestedModel` | Client-requested model before provider/auth resolution. |
| `Stream` | Whether the client expects streaming output. |
| `Headers` / `Query` | Inbound request headers and query parameters. |
| `Body` | Raw client request body. In RPC JSON it is base64 encoded. |
| `Metadata` | Best-effort request context snapshot. Treat it as read-only JSON-like data. |
| `AvailableProviders` | Built-in provider keys that currently have registered auth. Use this before returning `TargetKind: "provider"`. |

## Response

Do not handle:

```json
{
  "Handled": false
}
```

Route to the same plugin's executor:

```json
{
  "Handled": true,
  "TargetKind": "self",
  "Reason": "matched_web_search"
}
```

Route to another plugin executor:

```json
{
  "Handled": true,
  "TargetKind": "executor",
  "Target": "search-executor",
  "Reason": "matched_search_executor"
}
```

Route to a built-in provider:

```json
{
  "Handled": true,
  "TargetKind": "provider",
  "Target": "codex",
  "TargetModel": "gpt-5.4-mini",
  "Reason": "matched_codex_web_search"
}
```

## Target Kinds

| TargetKind | Target | TargetModel | Behavior |
| --- | --- | --- | --- |
| `self` | Ignored by the plugin; the host uses the current router plugin ID. | Ignored. | Executes the router plugin's own executor. |
| `executor` | Target plugin ID. | Ignored. | Executes another plugin executor directly. |
| `provider` | Built-in provider key. | Optional model override. | Continues through the built-in AuthManager and provider executor path. |

Direct plugin executor routes run without selecting an auth record. The target executor must declare the executor capability, must allow static execution through `executor_model_scope: "static"` or `"both"`, and must support the request/response protocol formats for the current request.

Provider routes must target a provider that is present in `AvailableProviders`. If `TargetModel` is empty, the host keeps the original client-requested model. If the target provider needs a provider-native model name, set `TargetModel` explicitly instead of forwarding the client model name.

## Configuration Example

The `claude-web-search-router` example uses ModelRouter to detect Claude Code built-in `web_search` requests and route them to built-in web-search-capable providers or to its own Tavily-backed executor.

```yaml
plugins:
  enabled: true
  dir: "plugins"
  configs:
    claude-web-search-router:
      enabled: true
      priority: 20
      route: fallback
      antigravity_model: "gemini-3.1-flash-lite"
      codex_model: "gpt-5.4-mini"
      xai_model: "grok-4.3"
      tavily_api_keys:
        - "tvly-xxxxxxxx"
      require_web_search_only: true
```

Example route behavior:

| Route | Target |
| --- | --- |
| `antigravity_google` | `TargetKind: "provider"`, `Target: "antigravity"`, `TargetModel: antigravity_model` |
| `codex_web_search` | `TargetKind: "provider"`, `Target: "codex"`, `TargetModel: codex_model` |
| `xai_web_search` | `TargetKind: "provider"`, `Target: "xai"`, `TargetModel: xai_model` |
| `tavily` | `TargetKind: "self"` so the plugin executor handles Tavily itself. |
| `fallback` | `TargetKind: "self"` so the plugin executor can orchestrate fallback across configured backends. |

## Development Notes

- Return `Handled: false` for requests the plugin does not recognize so lower-priority routers and the normal host path can continue.
- Keep `model.route` fast. It should classify and choose a target, not perform the full upstream request.
- Use `AvailableProviders` before returning a built-in provider target.
- Use `self` when the plugin executor needs to orchestrate fallback, call `host.model.*`, or use a plugin-owned external service.
- Use `provider` when the request should continue through host-managed auth selection, request logging, usage accounting, and the built-in executor.
- `model_router` is gated by the capability flag and the `model.route` method. It does not require a plugin schema version bump.
