---
title: OAuth
feature_ids:
  - management.v8.delete-oauth-session
  - management.v8.get-oauth-auth-url
  - management.v8.get-oauth-callback
  - management.v8.get-oauth-status
  - management.v8.post-oauth-callback
  - management.v8.post-oauth-import
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# OAuth

## 1. What this solves

Use the management API to start a provider login, submit a callback, query or cancel a session, and import a supported credential.

## 2. Scope and non-goals

Starting a login, querying status, cancelling a session, and importing all require the management key. `GET` and `POST /v8/management/oauth/callback` do not pass through the management-key middleware, but they are still limited by whether the management API is enabled. Home mode, or management routes that are not enabled, returns 404. Adding and deleting saved files is in [Credentials](/management/v8-credentials).

## 3. How to configure or call it

The base URL is `https://example.invalid`. Requests that need a key use `Authorization: Bearer YOUR_API_KEY`.

| Method and path | Purpose |
| --- | --- |
| GET /v8/management/oauth/auth-url?provider= | Start a login for the provider and return an authorization URL or device-code information. |
| GET /v8/management/oauth/status?state= | Query a session. If `state` is omitted, the response is only `{"status":"ok"}`. |
| DELETE /v8/management/oauth/session?state= | Cancel the pending session for that state. |
| POST /v8/management/oauth/import?provider= | Import a credential. The built-in dispatch currently accepts only `vertex`. |
| GET /v8/management/oauth/callback | Receive a provider callback from query parameters. |
| POST /v8/management/oauth/callback | Receive a callback as JSON. |

The `provider` query value is lowercased before matching. Starting a login accepts `claude`, `codex`, `antigravity`, `kimi`, `kimi-ai`, `xai`, `devin`, and `meta`. If none match, a registered plugin that can handle the provider receives it. Otherwise the response is 404 `provider_not_found`.

The JSON fields of a POST callback are `provider`, `redirect_url`, `code`, `state`, `error`. `state`, `code`, `error`, or `error_description` inside `redirect_url` fills the matching field when that field is empty.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| DELETE /v8/management/oauth/session | Cancel a pending OAuth session. |  | A missing `state` is 400 `missing state`. An illegal state is 400 `invalid state`. Success returns `status: ok` and a boolean `cancelled`. |
| GET /v8/management/oauth/auth-url | Start a login for `provider`. |  | If provider is missing, the response is 400 `provider is required`. If it is unknown and no plugin handles it, the response is 404 `provider_not_found`. |
| GET /v8/management/oauth/callback | Complete a callback from query parameters. |  | A management key is not required. `state` is required. At least one of `code` and `error` is required. |
| GET /v8/management/oauth/status | Read session status. |  | An illegal state is 400 `invalid state`. If the state is unknown or expired, HTTP is still 200 and the body `status` is `error`. When complete, `status` is `ok`. While still waiting, it is `wait`. |
| POST /v8/management/oauth/callback | Complete a callback from JSON. |  | If the body cannot be bound, the response is 400 `invalid body`. If `redirect_url` cannot be parsed, the response is 400 `invalid redirect_url`. |
| POST /v8/management/oauth/import | Import by `provider`. |  | If provider is missing, the response is 400 `provider is required`. If it is not `vertex`, the response is 404 `provider_not_found`. |

## 5. Common errors and limits

The state in a callback must still be a pending session. Unknown or expired returns 404 `unknown or expired state`. Already completed returns 409 `oauth flow is already completed`. A provider that does not match the session returns 400 `provider does not match state`. If the session already has an error status, the response is 409 and the body `error` is that status. An unsupported provider string returns 400 `unsupported provider`. Cancelling a legal state that does not exist still returns 200, but `cancelled` is false.

## 6. Related behavior

Uploading existing JSON is in [Credentials](/management/v8-credentials). The key is in [Management settings](/operations/management-settings).

## 7. Field experience

None yet.
