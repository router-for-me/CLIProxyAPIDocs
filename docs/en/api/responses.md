---
title: Responses
feature_ids:
  - route.v1.post-responses
  - route.v1.get-responses
  - route.v1.post-responses-compact
  - route.backend-api.post-codex-responses
  - route.backend-api.get-codex-responses
  - route.backend-api.post-codex-responses-compact
  - route.backend-api.post-codex-alpha-search
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Responses

This page covers OpenAI Responses, compaction, and the `/backend-api/codex` aliases that Codex CLI can call directly, in the pinned commit.

## 1. What this solves

`/v1/responses` accepts Responses JSON. When `stream` is the JSON boolean `true`, the response is SSE. Otherwise it is one JSON body. The matching `GET` upgrades the connection to a WebSocket. `/responses/compact` accepts only non-streaming compaction. The same paths under `/backend-api/codex` call the same handlers. That prefix also has Codex Alpha Search.

## 2. Scope and non-goals

These routes belong to the `/v1` and `/backend-api/codex` groups. Both pass the client-key check first. The key and sample-key safe mode are in [Client API keys](/api/access).

`/v1/alpha/search` is not on this page. It is in [Other endpoints](/api/openai-other), but it uses the same search handler. Chat Completions are not on this page. A Chat Completions body that has no `messages` but has `input` or `instructions` is converted to Chat Completions first. That is behavior of [OpenAI Chat](/api/openai-chat).

This page does not describe upstream protocol conversion. The caller submits Responses JSON, or the JSON read by the search handler.

## 3. How to configure or call it

Non-streaming Responses. Replacing `/v1` on the host with `/backend-api/codex` calls the same handler.

```bash
curl https://example.invalid/v1/responses \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>","stream":false}'
```

A streaming request sets `stream` to the JSON boolean `true`. The response is SSE.

Compaction cannot stream:

```bash
curl https://example.invalid/v1/responses/compact \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>"}'
```

WebSocket uses `GET /v1/responses` or `GET /backend-api/codex/responses`, with the WebSocket upgrade headers. Text messages use JSON. The handler recognizes messages whose `type` is `response.create`, `response.append`, or `response.interrupt`.

Codex Alpha Search:

```bash
curl https://example.invalid/backend-api/codex/alpha/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>"}'
```

## 4. Details

The Default column matches the ledger `defaults` verbatim. A blank cell means the field is an empty string.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| route.v1.post-responses | `POST /v1/responses`. |  | The JSON boolean `stream: true` uses SSE. Otherwise the response is one JSON body. The `model` in the request body is used. |
| route.v1.get-responses | `GET /v1/responses`. |  | Upgrades to a WebSocket. The upgrader allows any Origin. |
| route.v1.post-responses-compact | `POST /v1/responses/compact`. |  | The JSON boolean `stream: true` is rejected immediately. If `stream` is present but is not that boolean, the field is deleted first and execution continues as non-streaming. |
| route.backend-api.post-codex-responses | `POST /backend-api/codex/responses`. |  | The same handler as `POST /v1/responses`. |
| route.backend-api.get-codex-responses | `GET /backend-api/codex/responses`. |  | The same WebSocket handler as `GET /v1/responses`. |
| route.backend-api.post-codex-responses-compact | `POST /backend-api/codex/responses/compact`. |  | The same handler as `POST /v1/responses/compact`. |
| route.backend-api.post-codex-alpha-search | `POST /backend-api/codex/alpha/search`. |  | At most 16 MiB is read. `id` and `model` in a JSON object take part in selection. When `id` is non-empty, it is written as the `X-Session-ID` used for selection. |

If a search request parses as a JSON object, `prompt_cache_key` and `prompt_cache_retention` are removed before forwarding. If parsing fails, the original bytes are kept. A Codex credential in API-key form must have a base URL. The forward path is `/alpha/search` under that address. An OAuth credential uses the Codex search upstream. If model routing points the target at a provider other than `codex`, the request is not sent.

`response.interrupt` on the WebSocket is forwarded to the current upstream socket. It does not start a new turn because of that. `response.create` and `response.append` are Responses requests on the same connection. When the upstream requires a switch to HTTP replay, the connection ends with close code 1012 and the reason `upstream requires HTTP replay`.

## 5. Common errors and limits

If either Responses `POST` or compaction fails to read the request body, the status of that read error is returned. When it cannot be classified, the status is 400. `error.type` is `invalid_request_error`, and the message starts with `Invalid request:`.

Compaction returns 400 when `stream` is the JSON boolean `true`. The message is `Streaming not supported for compact responses`, and `error.type` is `invalid_request_error`.

Streaming Responses returns 500 when an HTTP flusher cannot be obtained. `error.type` is `server_error`. If the WebSocket upgrade fails, the handler does not continue the session. The error is written back by the upgrader.

Search returns 503 when the auth manager is unavailable. The body `error` is `Codex auth manager unavailable`. When no credential is selected, the response is 503 and `error` is `Codex auth unavailable`. When an API-key credential has no base URL, the response is 503 and `error` is `Codex Alpha Search API key base URL unavailable`. When the model-routing target is unsupported, the status of that error is returned. When it cannot be classified, the status is 503 and the body `error` is the routing error text. A selection failure likewise returns its status. When it cannot be classified, the status is 503, and `Retry-After` is attached as it is. If reading the request body fails and cannot be classified, the status is 400 and `error` is `Failed to read search request`. If the upstream request fails and cannot be classified, the status is 502. If reading the upstream body fails and cannot be classified, the status is 502 and `error` is `Failed to read Codex search response`. After the request reaches the upstream, the status code and body are written back as the upstream sent them. If the upstream supplied `Content-Type`, it is written back as well.

## 6. Related behavior

`/v1/alpha/search` for the same search handler is in [Other endpoints](/api/openai-other). The client key is in [Client API keys](/api/access). The realtime WebSocket is in [Realtime sessions](/api/realtime).

## 7. Field experience

- [Antigravity hides models the account cannot use](/experience/accounts#exp-accounts-antigravity-hides-unusable-models)
- [A responses upstream is written to a Codex API key](/experience/accounts#exp-accounts-codex-api-key-base-url)
- [A Codex client must match the User-Agent default](/experience/accounts#exp-accounts-codex-client-user-agent)
- [Built-in images use Codex OAuth](/experience/accounts#exp-accounts-codex-oauth-for-images)
- [Codex can use the client WebSocket or the proxy WebSocket](/experience/accounts#exp-accounts-codex-websocket-or-http)
- [An OpenAI-compatible base URL includes the version segment](/experience/accounts#exp-accounts-openai-base-url-v1)
- [A Codex client calls the responses route](/experience/api#exp-api-call-responses)
- [Compaction needs the upstream to provide a compaction model](/experience/api#exp-api-compaction-needs-model)
- [Stop injecting the image tool](/experience/api#exp-api-disable-image-tool-injection)
- [Image models use the Gemini protocol](/experience/api#exp-api-gemini-for-images)
- [Kimi responses keep Kimi's own tools](/experience/api#exp-api-kimi-native-responses)
- [A reasoning summary appears only when the request asks for it](/experience/api#exp-api-reasoning-summary-vs-effort)
- [Send the client key when calling a public route](/experience/api#exp-api-require-client-key)
- [responses uses instructions instead of system](/experience/api#exp-api-responses-instructions)
- [A responses stream does not use DONE as the end](/experience/api#exp-api-responses-stream-shape)
- [Choose a thinking level with a parenthetical suffix](/experience/configuration#exp-configuration-thinking-suffix)
- [Use a payload filter to drop fields the upstream rejects](/experience/routing#exp-routing-filter-rejected-fields)
- [responses rotates by a shared cache key](/experience/routing#exp-routing-responses-cache-key)
- [Turn on session affinity to keep encrypted reasoning](/experience/routing#exp-routing-session-affinity)
