---
outline: 'deep'
---

# Management API Capability

The Management API capability lets a plugin register its own management endpoints and browser resource pages. It is suitable for status pages, diagnostics pages, configuration helpers, or plugin-specific action entry points.

## Capability Field

```json
{
  "capabilities": {
    "management_api": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `ManagementAPI`, `ManagementRegistrationRequest`, `ManagementRoute`, `ResourceRoute`, `ManagementRequest`, `ManagementResponse`
- `sdk/pluginabi/types.go`: `management.register`, `management.handle`
- `internal/pluginhost/management.go`: management route and resource route registration, authentication boundaries

Example references:

- `examples/plugin/management-api/go/main.go`
- `examples/plugin/host-callback/go/main.go`
- `examples/plugin/host-model-callback/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodManagementRegister`, `MethodManagementHandle`

## Methods

| Method | Purpose |
| --- | --- |
| `management.register` | Registers plugin-owned management routes and browser resources. |
| `management.handle` | Handles HTTP requests matched to plugin routes. |

## Route Types

| Type | Registration Field | Exposed Path | Authentication |
| --- | --- | --- | --- |
| Plugin-owned management API | `Routes` | `/v0/management/...` | Requires the management key. |
| Browser resource page | `Resources` | `/v0/resource/plugins/<pluginID>/...` | Accessed as a resource route. |

## Registration Response

```json
{
  "Routes": [
    {
      "Method": "POST",
      "Path": "/plugins/example/run"
    }
  ],
  "Resources": [
    {
      "Path": "/status",
      "Menu": "Example Plugin",
      "Description": "Shows example plugin status."
    }
  ]
}
```

Example final resource path:

```text
/v0/resource/plugins/example/status
```

## Handling Requests

`management.handle` receives:

```json
{
  "Method": "GET",
  "Path": "/v0/resource/plugins/example/status",
  "Headers": {},
  "Query": {},
  "Body": "base64-body"
}
```

Response:

```json
{
  "StatusCode": 200,
  "Headers": {
    "Content-Type": ["text/html; charset=utf-8"]
  },
  "Body": "base64-html"
}
```

## Authentication Boundaries

- Plugin management APIs under `/v0/management/...` require the management key.
- `/v0/resource/plugins/<pluginID>/...` is a browser resource path and does not use the same Management API authentication.
- Legacy GET management routes with `Menu` are migrated by the host to resource routes to avoid exposing menu pages as management APIs.

## Development Notes

- Plugin management routes cannot override existing host `/v0/management` routes.
- Resource paths cannot contain whitespace, `:`, `*`, or `..`.
- When returning HTML, still avoid rendering secrets, tokens, or credential JSON into the page.
- Use [host callbacks](./host-callbacks) when you need host model, HTTP, or credential file capabilities.

