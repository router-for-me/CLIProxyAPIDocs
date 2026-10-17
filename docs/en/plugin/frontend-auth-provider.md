---
title: Frontend Authentication Provider
feature_ids:
  - plugin.frontend-auth-provider.identifier
  - plugin.frontend-auth-provider.authenticate
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Frontend Authentication Provider

`FrontendAuthProvider` performs frontend authentication before a request enters proxy handling.

## 1. What this solves

The plugin inspects the inbound method, path, headers, query, and body, decides whether to accept the request, and supplies a principal identifier plus attributes available downstream.

## 2. Scope and non-goals

It does not parse upstream credential files. That is [Credential Provider](/plugin/auth-provider). The exclusive switch is not a method. See [Frontend Authentication Exclusive Mode](/plugin/frontend-auth-exclusive).

## 3. How to configure or call it

Set `capabilities.frontend_auth_provider` to true. To require exclusive mode, also add `frontend_auth_provider_exclusive`. That switch is not explained on this page.

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-frontend-auth",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-frontend-auth"
    },
    "capabilities": {
      "frontend_auth_provider": true
    }
  }
}
```

```go
Identifier() string
Authenticate(context.Context, FrontendAuthRequest) (FrontendAuthResponse, error)
```

The ABI method names are `frontend_auth.identifier` and `frontend_auth.authenticate`. The field on the identifier result object is `identifier`. The example is `examples/plugin/frontend-auth`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.frontend-auth-provider.identifier | `Identifier`, ABI `frontend_auth.identifier`. |  | No parameters. Returns a string. Failure or blank is treated as an empty string. |
| plugin.frontend-auth-provider.authenticate | `Authenticate`, ABI `frontend_auth.authenticate`. |  | Parameter `FrontendAuthRequest`, return `FrontendAuthResponse`. |
| FrontendAuthRequest.Method | HTTP method. |  | String. |
| FrontendAuthRequest.Path | Request path. |  | String. |
| FrontendAuthRequest.Headers | Inbound headers. |  | `http.Header`. |
| FrontendAuthRequest.Query | Query parameters. |  | `url.Values`. |
| FrontendAuthRequest.Body | Raw body. |  | `[]byte`, base64 in JSON. |
| FrontendAuthResponse.Authenticated | Whether the request is accepted. |  | Boolean. |
| FrontendAuthResponse.Principal | Authenticated principal identifier. |  | String. |
| FrontendAuthResponse.Metadata | Identity attributes handed downstream. |  | `map[string]string`. |

## 5. Common errors and limits

When `Authenticate` returns `error`, ABI `ok` is false. When `http_status` is omitted or 0, it is treated as HTTP 500.

`Authenticated` set to false means the request was not accepted. That is not the same path as the method returning an error.

## 6. Related behavior

The exclusive boolean is in [Frontend Authentication Exclusive Mode](/plugin/frontend-auth-exclusive). Upstream credentials are in [Credential Provider](/plugin/auth-provider).

## 7. Field experience

None yet.

