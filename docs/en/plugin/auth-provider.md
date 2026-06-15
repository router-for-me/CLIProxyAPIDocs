---
outline: 'deep'
---

# Credential Provider Capability

The credential provider capability lets a plugin participate in credential file parsing, login, polling, and refresh. It is suitable for adding an upstream provider that needs OAuth, device codes, API key files, or custom JSON credentials.

## Capability Field

```json
{
  "capabilities": {
    "auth_provider": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `AuthProvider`, `AuthData`, `AuthParseRequest`, `AuthLoginStartRequest`, `AuthLoginPollRequest`, `AuthRefreshRequest`
- `sdk/pluginabi/types.go`: `auth.identifier`, `auth.parse`, `auth.login.start`, `auth.login.poll`, `auth.refresh`
- `internal/pluginhost/adapters.go`: credential parsing, refresh, and host HTTP client bridging

Example references:

- `examples/plugin/auth/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodAuthIdentifier`, `MethodAuthParse`, `MethodAuthLoginStart`, `MethodAuthLoginPoll`, `MethodAuthRefresh`

## Methods

| Method | Purpose |
| --- | --- |
| `auth.identifier` | Returns the provider identifier handled by the plugin. |
| `auth.parse` | Tries to parse a credential JSON file discovered by the host. |
| `auth.login.start` | Starts a login flow and returns the URL and polling state for the user. |
| `auth.login.poll` | Polls the login flow and returns `AuthData` when it succeeds. |
| `auth.refresh` | Refreshes an existing credential and returns updated credential data plus the next refresh time. |

## AuthData

`AuthData` is the core structure exchanged between the plugin and the host for credential data:

```json
{
  "Provider": "plugin-example",
  "ID": "plugin-example-auth",
  "FileName": "plugin-example.json",
  "Label": "Plugin Example",
  "Prefix": "",
  "ProxyURL": "",
  "Disabled": false,
  "StorageJSON": "base64-json",
  "Metadata": {},
  "Attributes": {},
  "NextRefreshAfter": "2026-06-15T12:00:00Z"
}
```

Field responsibilities:

- `StorageJSON` is the persistent credential content owned by the plugin.
- `Metadata` is host-managed but mutable metadata.
- `Attributes` are immutable routing and provider-related attributes.
- `NextRefreshAfter` controls the next active refresh time for the host.

## Login Flow

`auth.login.start` returns:

```json
{
  "Provider": "plugin-example",
  "URL": "https://example.com/login",
  "State": "opaque-state",
  "ExpiresAt": "2026-06-15T12:05:00Z",
  "Metadata": {}
}
```

`auth.login.poll` returns a status:

```json
{
  "Status": "pending",
  "Message": "waiting for user confirmation"
}
```

When login succeeds, `Status` is `success` and `Auth` is populated.

## Development Notes

- `auth.parse` must use `Handled` to explicitly state whether it recognizes the credential file.
- When the plugin needs to call an upstream login or refresh endpoint, use the host HTTP bridge to avoid bypassing proxy and logging policy.
- Do not log `StorageJSON`, access tokens, refresh tokens, or raw user credentials.
- If the plugin also provides model discovery, it usually works together with the [model provider capability](./model-provider).

