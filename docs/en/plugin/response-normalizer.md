---
title: Response Normalizer
feature_ids:
  - plugin.response-normalizer.normalize-response
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Response Normalizer

`ResponseNormalizer` folds a response payload into canonical form. The same method is used before and after translation.

## 1. What this solves

Before native translation, the plugin can fold an upstream response into canonical form. After translation finishes and before it is handed downstream, it can fold the response once more. Both calls use `NormalizeResponse`.

## 2. Scope and non-goals

This page has only this one method. The old before-translation and after-translation pages no longer own feature IDs. The guides are [Response Pre-Translation Normalizer](/plugin/response-before-translator) and [Response Post-Translation Normalizer](/plugin/response-after-translator). Turning canonical form into the target format is [Response Translator](/plugin/response-translator).

Either slot can be turned on alone. Which one is on is decided by the registration boolean, not by a different Go method.

## 3. How to configure or call it

Set `response_before_translator` for before translation and `response_after_translator` for after translation. Both can be true at the same time.

```go
NormalizeResponse(context.Context, ResponseTransformRequest) (PayloadResponse, error)
```

The ABI method names are `response.normalize_before` and `response.normalize_after`. The parameter structure is the same.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.response-normalizer.normalize-response | `NormalizeResponse`. |  | Both slots share this method. |
| response.normalize_before | ABI name of the before-translation slot. |  | Matches the registration key `response_before_translator`. |
| response.normalize_after | ABI name of the after-translation slot. |  | Matches the registration key `response_after_translator`. |
| ResponseTransformRequest.FromFormat | Source protocol. |  | String. |
| ResponseTransformRequest.ToFormat | Target protocol. |  | String. |
| ResponseTransformRequest.Model | Model ID. |  | String. |
| ResponseTransformRequest.Stream | Whether the response is streaming. |  | Boolean. |
| ResponseTransformRequest.OriginalRequest | Original client request body. |  | `[]byte`. |
| ResponseTransformRequest.TranslatedRequest | Provider request body. |  | `[]byte`. |
| ResponseTransformRequest.Body | Response payload to normalize. |  | `[]byte`. |
| PayloadResponse.Body | Normalized payload. |  | `[]byte`. |

## 5. Common errors and limits

When `error` is returned, ABI `ok` is false. When `http_status` is omitted or 0, it is treated as HTTP 500.

There is no separate before-translation or after-translation return type. The result of both ABI names is `PayloadResponse`.

## 6. Related behavior

Target-format translation is in [Response Translator](/plugin/response-translator). Rewriting a successful response is in [Response Interceptor](/plugin/response-interceptor).

## 7. Field experience

None yet.

