---
title: Response Interceptor
feature_ids:
  - plugin.response-interceptor.intercept-response
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Response Interceptor

`ResponseInterceptor` rewrites a successful non-streaming HTTP execution result before it is handed downstream.

## 1. What this solves

The plugin can replace response headers of the same name, delete named headers, or replace the body when the body is non-empty.

## 2. Scope and non-goals

It only handles a successful non-streaming response. Streaming chunks are in [Streaming Response Interceptor](/plugin/response-stream-interceptor). It does not observe WebSocket frames.

## 3. How to configure or call it

Set `capabilities.response_interceptor` to true.

```go
InterceptResponse(context.Context, ResponseInterceptRequest) (ResponseInterceptResponse, error)
```

The ABI method name is `response.intercept_after`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.response-interceptor.intercept-response | `InterceptResponse`, ABI `response.intercept_after`. |  | Parameter `ResponseInterceptRequest`, return `ResponseInterceptResponse`. |
| ResponseInterceptRequest.RequestID | Execution ID. |  | String. |
| ResponseInterceptRequest.SourceFormat | Client protocol. |  | String. |
| ResponseInterceptRequest.Model | Execution model. |  | String. |
| ResponseInterceptRequest.RequestedModel | Model requested by the client. |  | String. |
| ResponseInterceptRequest.Stream | Whether the request is marked as streaming. |  | This interface still rewrites only a successful non-streaming result. |
| ResponseInterceptRequest.RequestHeaders | Request headers. |  | `http.Header`. |
| ResponseInterceptRequest.ResponseHeaders | Current response headers. |  | `http.Header`. |
| ResponseInterceptRequest.OriginalRequest | Original client body. |  | `[]byte`. |
| ResponseInterceptRequest.RequestBody | Request payload that was actually executed. |  | `[]byte`. |
| ResponseInterceptRequest.Body | Current response body. |  | `[]byte`. |
| ResponseInterceptRequest.StatusCode | Current status code. |  | Integer. This return value cannot change the status code. |
| ResponseInterceptRequest.Metadata | Context snapshot. |  | Read-only, understood as JSON values. |
| ResponseInterceptResponse.Headers | Replace response headers of the same name. |  | Headers not mentioned are kept. |
| ResponseInterceptResponse.Body | Replace the body. |  | Replaced only when non-empty. |
| ResponseInterceptResponse.ClearHeaders | Response headers to delete first. |  | Deleted before `Headers` is applied. |

## 5. Common errors and limits

When `error` is returned, ABI `ok` is false. When `http_status` is omitted or 0, it is treated as HTTP 500.

An empty `Body` does not replace the existing body. The return value has no status-code field.

## 6. Related behavior

Streaming chunks are in [Streaming Response Interceptor](/plugin/response-stream-interceptor). Protocol translation is in [Response Translator](/plugin/response-translator).

## 7. Field experience

None yet.

