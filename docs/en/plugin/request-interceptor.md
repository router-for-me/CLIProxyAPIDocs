---
outline: 'deep'
---

# Request Interceptor Capability

The request interceptor capability rewrites request headers or bodies before an upstream request is executed. It has two stages: before credential selection and after credential selection.

## Capability Field

```json
{
  "capabilities": {
    "request_interceptor": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `RequestInterceptor`, `RequestInterceptRequest`, `RequestInterceptResponse`
- `sdk/pluginabi/types.go`: `request.intercept_before`, `request.intercept_after`
- `internal/pluginhost/adapters.go`: `InterceptRequestBeforeAuth`, `InterceptRequestAfterAuth`

Example references:

- `internal/pluginhost/adapters_test.go`: tests for request interceptor chains, source-plugin skipping, and error handling
- `examples/plugin/antigravity-web-search/go/main.go`: real migration example based on the current interceptor seam

## Methods

| Method | Purpose |
| --- | --- |
| `request.intercept_before` | Rewrites the request before credential selection. `ToFormat` may be empty at this point. |
| `request.intercept_after` | Rewrites the request after credential selection. The model and upstream format are more specific at this point. |

## Request

```json
{
  "SourceFormat": "chat-completions",
  "ToFormat": "codex",
  "Model": "gpt-5.5",
  "RequestedModel": "gpt-5.5",
  "Stream": false,
  "Headers": {},
  "Body": "base64-body",
  "Metadata": {}
}
```

## Response

```json
{
  "Headers": {
    "X-Plugin": ["example"]
  },
  "Body": "base64-new-body",
  "ClearHeaders": ["X-Old-Header"]
}
```

Semantics:

- `Headers` overrides headers with the same name while preserving headers that are not mentioned.
- A non-empty `Body` replaces the current body.
- `ClearHeaders` removes the specified headers before applying `Headers`.

## Recursion Guard

When a plugin starts a nested model request through `host.model.*` and passes `host_callback_id`, the host skips that originating plugin's own request interceptors to avoid recursive self-calls. Request interceptors from other plugins can still handle the nested request.

## Development Notes

- `Metadata` is a host context snapshot and should be treated as read-only.
- Do not depend on credential fields before credential selection. Handle credential-context rewrites after credential selection.
- Do not call upstream models directly from a request interceptor. Use [host callbacks](./host-callbacks) when a model request is needed.

