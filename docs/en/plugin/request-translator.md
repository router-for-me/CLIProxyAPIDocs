---
title: Request translation
feature_ids:
  - plugin.request-translator.translate-request
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Request translation

`RequestTranslator` converts a request payload that is already in canonical form into another format.

## 1. What this solves

From the source format, target format, model, whether the response is streaming, and the body, the plugin returns the translated raw bytes.

## 2. Scope and non-goals

There is only `TranslateRequest`. Folding a provider request into canonical form is [Request normalization](/plugin/request-normalizer), not this interface. Responses are not on this page.

## 3. How to configure or call it

Set `capabilities.request_translator` to true.

```go
TranslateRequest(context.Context, RequestTransformRequest) (PayloadResponse, error)
```

The ABI method name is `request.translate`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.request-translator.translate-request | `TranslateRequest`, ABI `request.translate`. |  | Parameter `RequestTransformRequest`, return `PayloadResponse`. |
| RequestTransformRequest.FromFormat | Source protocol. |  | String. |
| RequestTransformRequest.ToFormat | Target protocol. |  | String. |
| RequestTransformRequest.Model | Model ID. |  | String. |
| RequestTransformRequest.Stream | Whether streaming output is expected. |  | Boolean. |
| RequestTransformRequest.Body | Payload to translate. |  | `[]byte`, base64 in JSON. |
| PayloadResponse.Body | Translated payload. |  | `[]byte`. |

## 5. Common errors and limits

When `error` is returned, ABI `ok` is false. When `http_status` is omitted or 0, it is treated as HTTP 500. This method does not change credentials and does not stop the request.

## 6. Related behavior

Folding back into canonical form is in [Request normalization](/plugin/request-normalizer). Rewriting a request that is about to be sent is in [Request interceptor](/plugin/request-interceptor).

## 7. Field experience

None yet.
