---
title: Response Translator
feature_ids:
  - plugin.response-translator.translate-response
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Response Translator

`ResponseTranslator` converts a canonical response payload into another format.

## 1. What this solves

The plugin sees the original client request, the already translated provider request, and the response body to translate, and returns bytes in the target format.

## 2. Scope and non-goals

There is only `TranslateResponse`. Folding into canonical form is done by [Response Normalizer](/plugin/response-normalizer). Before and after translation are two registration slots, not two interfaces. Rewriting a successful response is in [Response Interceptor](/plugin/response-interceptor).

## 3. How to configure or call it

Set `capabilities.response_translator` to true.

```go
TranslateResponse(context.Context, ResponseTransformRequest) (PayloadResponse, error)
```

The ABI method name is `response.translate`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.response-translator.translate-response | `TranslateResponse`, ABI `response.translate`. |  | Parameter `ResponseTransformRequest`, return `PayloadResponse`. |
| ResponseTransformRequest.FromFormat | Source protocol. |  | String. |
| ResponseTransformRequest.ToFormat | Target protocol. |  | String. |
| ResponseTransformRequest.Model | Model ID. |  | String. |
| ResponseTransformRequest.Stream | Whether the response is streaming. |  | Boolean. |
| ResponseTransformRequest.OriginalRequest | Original client request body. |  | `[]byte`. |
| ResponseTransformRequest.TranslatedRequest | Provider request body. |  | `[]byte`. |
| ResponseTransformRequest.Body | Response payload to translate. |  | `[]byte`. |
| PayloadResponse.Body | Translated payload. |  | `[]byte`. |

## 5. Common errors and limits

When `error` is returned, ABI `ok` is false. When `http_status` is omitted or 0, it is treated as HTTP 500. This method does not change the status code.

## 6. Related behavior

The same normalization interface used before and after translation is in [Response Normalizer](/plugin/response-normalizer).

## 7. Field experience

None yet.

