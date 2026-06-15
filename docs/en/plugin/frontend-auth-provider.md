---
outline: 'deep'
---

# Frontend Authentication Provider Capability

The frontend authentication provider capability authenticates client requests before they enter the proxy flow. It answers "who may call CLIProxyAPI" and does not handle upstream credential selection.

## Capability Field

```json
{
  "capabilities": {
    "frontend_auth_provider": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `FrontendAuthProvider`, `FrontendAuthRequest`, `FrontendAuthResponse`
- `sdk/pluginabi/types.go`: `frontend_auth.identifier`, `frontend_auth.authenticate`
- `internal/pluginhost/adapters.go`: `RegisterFrontendAuthProviders`

Example references:

- `examples/plugin/frontend-auth/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodFrontendAuthIdentifier`, `MethodFrontendAuthAuthenticate`

## Methods

| Method | Purpose |
| --- | --- |
| `frontend_auth.identifier` | Returns the stable identifier of this frontend authentication provider. |
| `frontend_auth.authenticate` | Determines whether authentication succeeds from the HTTP request content. |

## Request

`frontend_auth.authenticate` receives:

```json
{
  "Method": "POST",
  "Path": "/v1/chat/completions",
  "Headers": {
    "Authorization": ["Bearer ..."]
  },
  "Query": {},
  "Body": "base64-body"
}
```

## Response

```json
{
  "Authenticated": true,
  "Principal": "user-or-client-id",
  "Metadata": {
    "provider": "example-frontend-auth-go"
  }
}
```

`Principal` is the authenticated subject. `Metadata` can carry identity attributes for downstream use.

## Relationship With Built-In API Keys

A normal frontend authentication provider works together with existing host authentication methods. Only when [frontend authentication exclusive mode](./frontend-auth-exclusive) is declared can the plugin become the only frontend authentication source after it is selected.

## Development Notes

- Frontend authentication only authenticates client requests and should not read or return upstream credentials.
- Be careful with body size and sensitive information when authenticating from the request body. Do not log the raw body.
- When a plugin returns `Authenticated: false`, the host continues through the current authentication chain or rejects the request, depending on whether exclusive mode is enabled.

