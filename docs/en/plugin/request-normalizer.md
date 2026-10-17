---
title: Request normalization
feature_ids:
  - plugin.request-normalizer.normalize-request
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Request normalization

`RequestNormalizer` folds a provider-specific request payload into canonical form.

## 1. What this solves

The plugin receives the source format, target format, model, whether the response is streaming, and the body, and returns the canonical payload bytes.

## 2. Scope and non-goals

There is only `NormalizeRequest`. Turning canonical form into a provider format is [Request translation](/plugin/request-translator). Response normalization is a different interface.

## 3. How to configure or call it

Set `capabilities.request_normalizer` to true.

```go
NormalizeRequest(context.Context, RequestTransformRequest) (PayloadResponse, error)
```

The ABI method name is `request.normalize`. The parameters and return value use the same pair of structures as request translation.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.request-normalizer.normalize-request | `NormalizeRequest`, ABI `request.normalize`. |  | Parameter `RequestTransformRequest`, return `PayloadResponse`. |
| RequestTransformRequest.FromFormat | Source protocol. |  | String. |
| RequestTransformRequest.ToFormat | Target protocol. |  | String. |
| RequestTransformRequest.Model | Model ID. |  | String. |
| RequestTransformRequest.Stream | Whether streaming output is expected. |  | Boolean. |
| RequestTransformRequest.Body | Payload to normalize. |  | `[]byte`. |
| PayloadResponse.Body | Normalized payload. |  | `[]byte`. |

## 5. Common errors and limits

When `error` is returned, ABI `ok` is false. When `http_status` is omitted or 0, it is treated as HTTP 500.

## 6. Related behavior

Turning the canonical form back out is in [Request translation](/plugin/request-translator).

## 7. Field experience

None yet.
