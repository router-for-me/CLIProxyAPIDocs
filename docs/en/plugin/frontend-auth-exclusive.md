---
outline: 'deep'
---

# Frontend Authentication Exclusive Mode

Frontend authentication exclusive mode is not a standalone interface. It is an additional capability for a frontend authentication provider. When the plugin is selected, the host uses only this plugin as the frontend request authentication source.

## Capability Field

```json
{
  "capabilities": {
    "frontend_auth_provider": true,
    "frontend_auth_provider_exclusive": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `FrontendAuthProviderExclusive`
- `internal/pluginhost/rpc_schema.go`: `frontend_auth_provider_exclusive`
- `internal/pluginhost/adapters.go`: exclusive frontend authentication provider selection logic

Example reference:

- `examples/plugin/frontend-auth-exclusive/go/main.go`

## Selection Rules

When the host registers frontend authentication providers, it prefers plugins that declare `frontend_auth_provider_exclusive`:

- It is only effective for plugins that also declare `frontend_auth_provider`.
- If multiple exclusive plugins exist, the higher-priority plugin wins.
- If priorities are equal, the host uses a stable selection rule.
- When an exclusive plugin is removed or disabled, the host clears the exclusive state.

## Request And Response

Exclusive mode still uses `frontend_auth.authenticate`:

```json
{
  "Authenticated": true,
  "Principal": "example-frontend-auth-exclusive-go",
  "Metadata": {
    "mode": "exclusive",
    "provider": "example-frontend-auth-exclusive-go"
  }
}
```

The example plugin checks this request header:

```text
X-Example-Frontend-Auth: exclusive
```

## Development Notes

- Exclusive mode changes the overall frontend authentication boundary and must be enabled carefully.
- The plugin should return `Authenticated: false` on failure; it should not panic or exit the process.
- Do not declare only `frontend_auth_provider_exclusive`. Without `frontend_auth_provider`, the field does not create a valid frontend authentication provider.

