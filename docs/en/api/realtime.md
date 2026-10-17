---
title: Realtime sessions
feature_ids:
  - route.v1.post-live
  - route.v1.get-live-call-id
  - route.v1.get-realtime
  - route.v1.post-realtime
  - route.v1.post-realtime-calls
  - route.v1.get-realtime-calls-call-id
  - route.v1.post-realtime-client-secrets
  - route.v1.post-realtime-sessions
  - route.v1.post-realtime-transcription-sessions
  - route.v1.get-realtime-translations
  - route.v1.post-realtime-translations
  - route.v1.post-realtime-translations-client-secrets
  - route.v1.post-realtime-calls-call-id-hangup
  - route.v1.post-realtime-calls-call-id-accept
  - route.v1.post-realtime-calls-call-id-reject
  - route.v1.post-realtime-calls-call-id-refer
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Realtime sessions

This page covers Codex realtime calls, the sideband WebSocket, short-lived client secrets, and the realtime capabilities that are explicitly rejected, in the pinned commit.

## 1. What this solves

`/v1/live` and `/v1/realtime` establish a Codex realtime call, or attach the sideband WebSocket of a call that is already established. `/v1/realtime/client_secrets` and `/v1/realtime/sessions` issue a short-lived secret that is valid only inside this proxy. Translation, transcription, and SIP control have no matching capability on the current Codex OAuth upstream. Calling them returns 501 directly.

## 2. Scope and non-goals

`/v1/live` and `/v1/live/:call_id` are on the `/v1` group and use the ordinary client-key check. The error body is the string `error`. The other routes on this page are not in that group.

`/v1/realtime`, `/v1/realtime/calls`, `/v1/realtime/calls/:call_id`, and the two translation entries first recognize a short-lived secret in `Authorization: Bearer` that starts with `ek_`. When it is not `ek_`, the client-key check runs again, but the error is wrapped as an object. An invalid or expired short-lived secret returns 401. `error.code` is `invalid_realtime_client_secret`, `error.type` is `invalid_request_error`, and the message is `Realtime client secret is invalid or expired`.

`client_secrets`, `sessions`, transcription, the translation `client_secrets`, hangup, and the three SIP paths use only the realtime error format of the client key. They do not accept `ek_` as a substitute authentication. The client key itself is in [Client API keys](/api/access).

These routes select a Codex OAuth credential. This page does not describe the Responses `GET /v1/responses` WebSocket.

## 3. How to configure or call it

Establish a call. `POST /v1/live`, `POST /v1/realtime`, and `POST /v1/realtime/calls` use the same handler. JSON may omit `model`. The credential is then selected as `gpt-live-1-codex`. You can also submit `multipart/form-data`, or submit SDP while holding a short-lived secret.

```bash
curl https://example.invalid/v1/live \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-live-1-codex"}'
```

The sideband WebSocket must be an upgrade. The call ID comes from the response that established the call, and it must match `^[A-Za-z0-9_-]{1,128}$`.

```text
GET https://example.invalid/v1/live/<call_id>
GET https://example.invalid/v1/realtime/calls/<call_id>
GET https://example.invalid/v1/realtime?call_id=<call_id>
```

`GET /v1/realtime` without `call_id` is a different WebSocket. When the `model` query parameter is omitted, it is handled as `gpt-realtime` first.

Issue a short-lived secret. An empty body is allowed. When `session` is omitted, the session is written as `{"type":"realtime","model":"gpt-realtime"}`.

```bash
curl https://example.invalid/v1/realtime/client_secrets \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"expires_after":{"anchor":"created_at","seconds":600}}'
```

`POST /v1/realtime/sessions` treats the whole body as the session object. It is not wrapped in `session`. On success it also returns `client_secret.value` and `client_secret.expires_at`.

Hang up an established call:

```bash
curl -X POST https://example.invalid/v1/realtime/calls/<call_id>/hangup \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 4. Details

The Default column matches the ledger `defaults` verbatim. A blank cell means the field is an empty string.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| route.v1.post-live | `POST /v1/live`. |  | Ordinary key check. The request body is at most 16 MiB. The default model is `gpt-live-1-codex`. |
| route.v1.get-live-call-id | `GET /v1/live/:call_id`. |  | Sideband WebSocket. Ordinary key check. The call ID must match the regular expression above. |
| route.v1.get-realtime | `GET /v1/realtime`. |  | When `call_id` is present, it switches to the sideband. Otherwise it must be a WebSocket upgrade. The query model defaults to `gpt-realtime`. |
| route.v1.post-realtime | `POST /v1/realtime`. |  | The same handler as `POST /v1/live`, but the authentication and the error shape differ. |
| route.v1.post-realtime-calls | `POST /v1/realtime/calls`. |  | Also calls the handler that establishes a call. |
| route.v1.get-realtime-calls-call-id | `GET /v1/realtime/calls/:call_id`. |  | Sideband WebSocket, using realtime authentication. |
| route.v1.post-realtime-client-secrets | `POST /v1/realtime/client_secrets`. |  | The body is at most 64 KiB. Success returns `value`, `expires_at`, and `session`. `Cache-Control` is `no-store`. |
| route.v1.post-realtime-sessions | `POST /v1/realtime/sessions`. |  | Legacy entry. The body itself is the session object. The response adds `client_secret` outside the session fields. |
| route.v1.post-realtime-transcription-sessions | `POST /v1/realtime/transcription_sessions`. |  | Always returns 501. |
| route.v1.get-realtime-translations | `GET /v1/realtime/translations`. |  | Always returns 501. |
| route.v1.post-realtime-translations | `POST /v1/realtime/translations`. |  | Always returns 501. |
| route.v1.post-realtime-translations-client-secrets | `POST /v1/realtime/translations/client_secrets`. |  | Always returns 501. It uses only standard realtime authentication. |
| route.v1.post-realtime-calls-call-id-hangup | `POST /v1/realtime/calls/:call_id/hangup`. |  | Hangs up only a call this proxy established and still records locally. |
| route.v1.post-realtime-calls-call-id-accept | `POST /v1/realtime/calls/:call_id/accept`. |  | Always returns 501. |
| route.v1.post-realtime-calls-call-id-reject | `POST /v1/realtime/calls/:call_id/reject`. |  | Always returns 501. |
| route.v1.post-realtime-calls-call-id-refer | `POST /v1/realtime/calls/:call_id/refer`. |  | Always returns 501. |

`gpt-realtime`, a name that starts with `gpt-realtime-`, and a name that contains `realtime-preview` are all treated as `gpt-live-1-codex` when selecting a credential. The comparison is case-insensitive. Any other non-empty model name is kept as it is.

The short-lived secret `value` starts with `ek_`. When `expires_after` is omitted, the lifetime is 10 minutes. `anchor` can only be empty or `created_at`. `seconds` must be from 10 to 7200. When session `type` is omitted, it is written as `realtime`, and it can only be `realtime`. When `model` is omitted, it is written as `gpt-realtime`. In a success response, `session.object` is `realtime.session`, and it carries `id` and `expires_at`. One issuing identity may have at most 64 unexpired secrets. The process may have at most 1024.

A call-establishment request that holds `ek_` must be SDP, plaintext SDP, or JSON. JSON is written into the `session` saved with that secret. On the WebSocket, the model in the secret and the query model must be the same after the mapping above.

## 5. Common errors and limits

If the body that establishes a call is larger than 16 MiB, the response is 413 and the message is `Codex live request body too large`. If the read fails and cannot be classified, the status is 400 and the message starts with `failed to read Codex live request:`. If the auth manager is unavailable, the response is 503 and the message is `Codex auth manager unavailable`. If no credential is selected, the response is 503 and the message is `Codex auth unavailable`. Under `/v1/realtime`, these `writeLiveError` failures are wrapped as an object. For 4xx, `type` is `invalid_request_error`. For 401, `type` is `authentication_error`. For other statuses, `type` is `api_error` and `code` is `realtime_request_failed`. Under `/v1/live`, the body of the same failure is `{"error":"<message>"}`. If selection fails and cannot be classified, the status is 503, the message is the selection error text, and the `Retry-After` carried by that error is attached. The shape still follows the path above.

If a sideband connection is not a WebSocket upgrade, the response is 426, `Upgrade: websocket` is set, and the message is `WebSocket upgrade required`. If the call ID does not match the regular expression, the response is 400. The `/v1/live` message is `Invalid Codex live call ID`. The `/v1/realtime` sideband uses the same function, so the message is the same, but the shape becomes an object and `code` is `realtime_request_failed`. If the session is already joining, the response is 409 and the message is `Codex live session already joining`. If the call is not local, the response is 404 and the message is `Codex live session not found`.

If the short-lived secret does not match the call, the response is 403. The message is `Realtime client secret is not valid for this call`, and `code` is `realtime_client_secret_scope_mismatch`. If the identity of an ordinary key does not match the identity that created the call, the response is 403. The message is `Realtime call belongs to another API principal`, and `code` is `realtime_call_scope_mismatch`. These two are objects on `/v1/live` as well. They are not strings.

If `GET /v1/realtime` is not a WebSocket upgrade, the response is 426. `code` is `websocket_upgrade_required`, and the message is `WebSocket upgrade required`. If the short-lived secret's model does not match the query model, the response is 403. `code` is `realtime_client_secret_scope_mismatch`, and the message is `Realtime client secret is not valid for the requested model`. If the auth manager or a Codex credential is unavailable, the response is 503 and `code` is `codex_auth_unavailable`.

If the body that issues a secret is larger than 64 KiB, the response is 413. The message is still `Codex live request body too large`, and `code` is `invalid_request`. Invalid JSON for `client_secrets` returns 400 with the message `Invalid Realtime client secret request`. If the session is not a JSON object, the response is 400. The message is `session must be a valid JSON object`, and `code` is `invalid_session`. If `type` is not `realtime`, the response is 501. `code` is `realtime_capability_not_supported`, and the message contains `Realtime session type is not supported by the Codex OAuth upstream`. If `expires_after.anchor` is not `created_at`, the response is 400 and the message is `expires_after.anchor must be created_at`. If the seconds are out of range, the response is 400. The message is `expires_after.seconds must be between 10 and 7200`, and `code` is `invalid_expires_after`. When capacity is exhausted, the response is 429, the header is `Retry-After: 1`, the message is `Realtime client secret capacity exhausted`, `type` is `rate_limit_error`, and `code` is `realtime_client_secret_capacity_exhausted`. If the service is unavailable, the response is 503 and `code` is `realtime_client_secret_unavailable`.

If a hangup call ID does not match the regular expression, the response is 400. The message is `Invalid Realtime call ID`, and `code` is `invalid_call_id`. If there is no local call, the response is 404. The message is `Realtime call not found`, and `code` is `realtime_call_not_found`. An identity mismatch returns the 403 above. If the service is unavailable, the response is 503. The message is `Codex live session service unavailable`, and `code` is `realtime_session_unavailable`. After the call is found, the hangup status and the upstream body are written back from the upstream response.

Transcription returns 501. The message is `Realtime transcription-only sessions are not supported by the ChatGPT/Codex OAuth upstream`. Both translation entries and the translation `client_secrets` return 501. The message is `Realtime translation sessions are not supported by the ChatGPT/Codex OAuth upstream`. `accept`, `reject`, and `refer` return 501. The messages are `Realtime SIP accept are not supported by the ChatGPT/Codex OAuth upstream`, `Realtime SIP reject are not supported by the ChatGPT/Codex OAuth upstream`, and `Realtime SIP refer are not supported by the ChatGPT/Codex OAuth upstream`. For these 501 responses, `type` is `not_supported_error` and `code` is `realtime_capability_not_supported`.

## 6. Related behavior

The client key is in [Client API keys](/api/access). The Responses WebSocket is in [Responses](/api/responses).

## 7. Field experience

None yet.
