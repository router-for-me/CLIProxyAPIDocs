---
title: Gemini
feature_ids:
  - route.v1beta.get-models
  - route.v1beta.get-models-action
  - route.v1beta.post-models-action
  - route.v1beta.post-interactions
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Gemini

This page covers the Gemini-compatible routes in the pinned commit: the model list, a single-model query, `models/*action` calls, and Interactions.

## 1. What this solves

These routes are mounted on the `/v1beta` group. A caller can list models in Gemini form, read one of them, start generation or counting on `model-name:method-name`, or submit a request to `/v1beta/interactions` that contains only `model` or only `agent`.

## 2. Scope and non-goals

All four routes pass the client-key check first. The key and sample-key safe mode are in [Client API keys](/api/access).

This page does not describe OpenAI `/v1/models` or Claude Messages. An Interactions `agent` always uses the Interactions provider. An ordinary `model` request does not force that provider.

`POST /v1beta/models/*action` enters only three methods: `generateContent`, `streamGenerateContent`, and `countTokens`. Other method names are not handled by these three branches.

## 3. How to configure or call it

The model list and one model. The single-model path is written after `models/`. The name may or may not have a `models/` prefix.

```bash
curl https://example.invalid/v1beta/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

```bash
curl https://example.invalid/v1beta/models/<已登记的模型 ID> \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Generation, streaming generation, and counting. The path must be one model segment, one colon, and one method name.

```bash
curl https://example.invalid/v1beta/models/<已登记的模型 ID>:generateContent \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

```bash
curl "https://example.invalid/v1beta/models/<已登记的模型 ID>:streamGenerateContent?alt=sse" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

```bash
curl https://example.invalid/v1beta/models/<已登记的模型 ID>:countTokens \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Interactions. Exactly one of `model` and `agent` may be non-empty. If `stream` is present, it must be a JSON boolean.

```bash
curl https://example.invalid/v1beta/interactions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>","stream":false}'
```

## 4. Details

The Default column matches the ledger `defaults` verbatim. A blank cell means the field is an empty string.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| route.v1beta.get-models | `GET /v1beta/models`. |  | The body is `{"models":[...]}`. An existing name that does not have the `models/` prefix is given that prefix in the response. Empty `displayName` and `description` are filled with the name. When `supportedGenerationMethods` is absent, it is written as `["generateContent"]`. |
| route.v1beta.get-models-action | `GET /v1beta/models/*action`. |  | After the leading slash is removed, matching uses the model name or `models/` plus the model name. On a hit, the name is completed as an object with the `models/` prefix. |
| route.v1beta.post-models-action | `POST /v1beta/models/*action`. |  | After the leading slash is removed, the path must split into exactly `model-name:method-name`. The methods handled are only `generateContent`, `streamGenerateContent`, and `countTokens`. |
| route.v1beta.post-interactions | `POST /v1beta/interactions`. |  | The JSON must be valid. Exactly one of `model` and `agent` is non-empty. `stream` defaults to false. When present, it must be a boolean. |

`streamGenerateContent` reads the query parameter `alt`, then `$alt` if it is absent. When the value is `sse`, or neither is present, the response is written as SSE, with `data: ` before each chunk. Any other `alt` value is written as the raw chunk, without that SSE frame.

If an Interactions `model` starts with `models/`, that prefix is removed before execution. When `agent` is non-empty, the model name used to select a credential is `gemini-2.5-flash`, and the provider is forced to Interactions. That does not change the value the caller wrote in `agent`.

## 5. Common errors and limits

If `*action` on `GET` or `POST` cannot bind the path, the response is 400. `error.type` is `invalid_request_error`, and the message starts with `Invalid request:`.

A single model that is not found returns 404. `error.message` is `Not Found`, and `error.type` is `not_found`.

If a `POST` path is not exactly two segments split by one colon, the response is 404. `error.type` is `invalid_request_error`, and the message is the request path plus ` not found.`. If the method name is not `generateContent`, `streamGenerateContent`, or `countTokens`, the handler writes no response.

If a `POST` fails to read the request body and the original body exists, the status of that read error is returned. When it cannot be classified, the status is 400 and `error.type` is `invalid_request_error`.

`streamGenerateContent` returns 500 when an HTTP flusher cannot be obtained. `error.message` is `Streaming not supported`, and `error.type` is `server_error`.

Invalid Interactions JSON returns 400 with the message `invalid JSON body`. When `model` and `agent` are both empty or both non-empty, the response is 400 with the message `request requires exactly one of model or agent`. When `stream` is not a boolean, the response is 400 with the message `stream must be a boolean`. The `error.type` of these bodies is `invalid_request_error`. `stream: true` uses SSE. If a flusher cannot be obtained, the response is also 500 `Streaming not supported`.

When Home is enabled, the list and the single model fetch the catalog from Home instead. An unavailable control center returns 503. `error.message` is `home control center unavailable`, and `error.type` is `server_error`. A failed catalog fetch returns 502. When Home marks authentication as failed, `error.type` is `authentication_error`. A Home single model that is not found is still 404 `Not Found`.

## 6. Related behavior

The client key is in [Client API keys](/api/access). The OpenAI model list is in [OpenAI Chat](/api/openai-chat).

## 7. Field experience

- [Image models use the Gemini protocol](/experience/api#exp-api-gemini-for-images)
- [Gemini images and structured output use the native route](/experience/api#exp-api-gemini-native-route)
- [Forward AI Studio thinking by the upstream field](/experience/api#exp-api-gemini-thinking-field)
