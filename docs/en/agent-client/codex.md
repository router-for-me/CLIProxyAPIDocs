---
title: Codex
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Codex

This page explains how to point Codex's provider base URL and access key at this proxy, and which registered endpoints are called when `wire_api = "responses"`.

## 1. What this solves

Codex can send a custom provider's Responses requests to this proxy. The access key is still this proxy's client key. The model catalog, Responses, compaction, and the optional WebSocket all land on routes that are already registered.

## 2. Scope and non-goals

This page changes only Codex's own `config.toml` and, in API mode, the client key in `auth.json`. It does not log in to upstream Codex, and it does not change the catalog switches in `client.codex`. Those switches are in [Codex client catalog](/routing/client).

This page does not set an approval policy, sandbox, reasoning effort, or a specific model name. The model must be an ID that already appears in the current catalog. If you are not using voice, do not configure a realtime base URL.

## 3. How to configure or call it

Both forms set the provider base URL to `https://example.invalid/v1` and set `wire_api` to `responses`. The only difference is where the access key is stored.

To send this proxy's key in a request header while keeping Codex's own login file:

```toml
model_provider = "cliproxyapi"
model = "<已登记的模型 ID>"

[model_providers.cliproxyapi]
name = "cliproxyapi"
base_url = "https://example.invalid/v1"
wire_api = "responses"
requires_openai_auth = true
http_headers = { "X-Api-Key" = "YOUR_API_KEY" }
```

Do not replace the ChatGPT login material with the client key in this form. `requires_openai_auth = true` does not automatically send `YOUR_API_KEY` to this proxy, so the `X-Api-Key` above is required.

When calling with an API key instead, write `~/.codex/auth.json` as:

```json
{
  "OPENAI_API_KEY": "YOUR_API_KEY"
}
```

The matching provider does not add another `X-Api-Key`:

```toml
model_provider = "cliproxyapi"
model = "<已登记的模型 ID>"

[model_providers.cliproxyapi]
name = "cliproxyapi"
base_url = "https://example.invalid/v1"
wire_api = "responses"
requires_openai_auth = true
```

`YOUR_API_KEY` must be exactly equal to one configured client key. This proxy checks `Authorization`, `X-Goog-Api-Key`, `X-Api-Key`, and the query parameters `key` and `auth_token`, in that order. If one value does not match, it still continues to the later values. Any one match is enough.

When `base_url` is `https://example.invalid/v1` and `wire_api` is `responses`, the client calls:

| Method and path | route ID |
| --- | --- |
| `GET /v1/models` | `route.v1.get-models` |
| `POST /v1/responses` | `route.v1.post-responses` |
| `GET /v1/responses` | `route.v1.get-responses` |
| `POST /v1/responses/compact` | `route.v1.post-responses-compact` |

The model-catalog request includes the query parameter `client_version`. As soon as that key is present, `GET /v1/models` returns the Codex client catalog. `GET /v1/responses` is used only when the client enables WebSocket, for example by setting `supports_websockets` to `true`.

If the client reaches this proxy's root address by the official Codex backend path, instead of the provider base URL that includes `/v1`, the same handlers are also registered at:

| Method and path | route ID |
| --- | --- |
| `POST /backend-api/codex/responses` | `route.backend-api.post-codex-responses` |
| `GET /backend-api/codex/responses` | `route.backend-api.get-codex-responses` |
| `POST /backend-api/codex/responses/compact` | `route.backend-api.post-codex-responses-compact` |

The custom provider configuration above does not call these three. Do not write `base_url` as both the root address and `/v1`.

Voice is not required. Only when the Codex client actually needs a realtime call, point the realtime base URLs at the same `/v1` prefix:

```toml
experimental_realtime_webrtc_call_base_url = "https://example.invalid/v1"
experimental_realtime_ws_base_url = "https://example.invalid/v1"
```

Call setup then uses `POST /v1/realtime` (`route.v1.post-realtime`), `POST /v1/realtime/calls` (`route.v1.post-realtime-calls`), `GET /v1/realtime` (`route.v1.get-realtime`), and `GET /v1/realtime/calls/:call_id` (`route.v1.get-realtime-calls-call-id`). The short-lived key is `POST /v1/realtime/client_secrets` (`route.v1.post-realtime-client-secrets`). Translation, transcription, and SIP routes currently return 501. Do not treat them as usable steps.

## 4. Details

These fields belong to Codex. They are not YAML keys of this proxy.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| `model_providers.cliproxyapi.base_url` | Base URL of the Responses provider. |  | This page writes `https://example.invalid/v1`. The client appends `/responses`, `/responses/compact`, and `/models`. |
| `wire_api` | Protocol used by the provider. |  | This page writes only `responses`. Do not change it to chat completions, or the Responses routes in the table above are not called. |
| `X-Api-Key` in `http_headers` | Client key submitted in a request header. |  | The value is `YOUR_API_KEY`. When it appears together with `Authorization`, any one configured key is enough. |
| `OPENAI_API_KEY` | Client key that Codex places in `Authorization` in API mode. |  | Write it to `auth.json` only in API mode. The value is still `YOUR_API_KEY`, not an upstream key. |
| `requires_openai_auth` | Whether Codex reads its own `auth.json`. |  | `true` does not replace this proxy's key. Header mode must also add `X-Api-Key`. |
| `supports_websockets` | Whether to upgrade the Responses WebSocket. |  | Set it to `true` only when needed. That corresponds to `GET /v1/responses`. |
| `experimental_realtime_webrtc_call_base_url` | Realtime WebRTC base URL. |  | Do not set it when voice is unused. When set, use `https://example.invalid/v1`. |
| `experimental_realtime_ws_base_url` | Realtime WebSocket base URL. |  | Same as the previous row. Do not point it at an unregistered path. |

When the query parameter `client_version` is present, `GET /v1/models` uses the Codex client catalog. When Home is enabled, it switches to Home's Codex catalog. `Session-Id` is recognized as a Codex session. It is not a route.

## 5. Common errors and limits

If none of the accepted keys is present, the response is 401 with the body `{"error":"Missing API key"}`. If every candidate fails to match, the response is 401 with the body `{"error":"Invalid API key"}`. A ChatGPT login alone, with neither `X-Api-Key` nor `OPENAI_API_KEY`, falls into one of those two 401 responses. When `access.api-keys` is empty, the client key is no longer checked.

When sample-key safe mode matches, both `/v1` and `/backend-api/codex` return 403 before the handler runs and set `X-CPA-SAFE-MODE: example-api-key`.

`POST /v1/responses` returns SSE only for the JSON boolean `stream: true`. `POST /v1/responses/compact` returns 400 for the JSON boolean `stream: true`, with the message `Streaming not supported for compact responses`. `GET /v1/responses` must be a WebSocket upgrade. A failed upgrade does not start a session. Realtime error objects and 501 are in [Realtime sessions](/api/realtime).

## 6. Related behavior

The key is in [Client API keys](/api/access). Responses and the `/backend-api/codex` aliases are in [Responses](/api/responses). The catalog format is in [OpenAI Chat](/api/openai-chat). Realtime calls are in [Realtime sessions](/api/realtime). The `apply_patch` and multi-agent switches in the catalog are in [Codex client catalog](/routing/client). Session affinity is in [Routing strategy](/routing/strategy).

## 7. Field experience

None yet.
