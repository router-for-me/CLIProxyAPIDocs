---
title: Request Interceptor
feature_ids:
  - plugin.request-interceptor.intercept-request-before-auth
  - plugin.request-interceptor.intercept-request-after-auth
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Request Interceptor

`RequestInterceptor` rewrites the request that is about to execute, both before and after a credential is selected.

## 1. What this solves

The plugin can replace some headers and the body, delete headers, change the path, or stop the request before it reaches the executor and supply a downstream response.

## 2. Scope and non-goals

Both methods share `RequestInterceptRequest` and `RequestInterceptResponse`. Before credential selection, `ToFormat` is empty. After selection, `Model` is the selected upstream model. It does not handle streaming chunks and does not handle usage.

`Body`, `Headers`, and `Metadata` are treated as read-only. Body changes must be placed in the return value.

## 3. How to configure or call it

Set `capabilities.request_interceptor` to true.

```go
InterceptRequestBeforeAuth(context.Context, RequestInterceptRequest) (RequestInterceptResponse, error)
InterceptRequestAfterAuth(context.Context, RequestInterceptRequest) (RequestInterceptResponse, error)
```

The ABI method names are `request.intercept_before` and `request.intercept_after`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.request-interceptor.intercept-request-before-auth | `InterceptRequestBeforeAuth`, ABI `request.intercept_before`. |  | Called before credential selection. |
| plugin.request-interceptor.intercept-request-after-auth | `InterceptRequestAfterAuth`, ABI `request.intercept_after`. |  | Called after credential selection. |
| RequestInterceptRequest.RequestID | ID of one model execution. |  | Associated with the completion event. |
| RequestInterceptRequest.TraceID | Trace ID of the inbound HTTP request. It may be empty. |  | String. |
| RequestInterceptRequest.SourceFormat | Original client protocol. |  | String. |
| RequestInterceptRequest.ToFormat | Selected upstream protocol. |  | Empty before a credential is selected. |
| RequestInterceptRequest.Model | Current execution model. |  | After selection it is the upstream model. |
| RequestInterceptRequest.RequestedModel | Client model before an alias or model pool rewrites it. |  | String. |
| RequestInterceptRequest.Stream | Whether it is streaming. |  | Boolean. |
| RequestInterceptRequest.Headers | Current upstream request headers. |  | Read-only. |
| RequestInterceptRequest.Body | Current payload. |  | Read-only. Changes go in the response `Body`. |
| RequestInterceptRequest.Metadata | Context snapshot. |  | Read-only, understood as JSON values. |
| RequestInterceptResponse.Path | Optional target path. |  | For example `/v1/images/generations`. Blank means no change. |
| RequestInterceptResponse.Headers | Replace headers of the same name. |  | Headers not mentioned are kept. |
| RequestInterceptResponse.Body | Replace the body. |  | Replaced only when non-empty. |
| RequestInterceptResponse.ClearHeaders | Header names to delete first. |  | Deleted before `Headers` is applied. |
| RequestInterceptResponse.Terminate | Stop later interceptors and keep the request from reaching the executor. |  | When true, the three downstream fields below are used. |
| RequestInterceptResponse.StatusCode | Downstream status code on termination. |  | Changed to 403 when less than 200 or greater than 599. |
| RequestInterceptResponse.ResponseHeaders | Downstream headers on termination. |  | `http.Header`. |
| RequestInterceptResponse.ResponseBody | Downstream body on termination. |  | `[]byte`. |

## 5. Common errors and limits

When a method returns `error`, ABI `ok` is false. When `http_status` is omitted or 0, it is treated as HTTP 500.

An empty `Body` does not replace the existing body. When the `Terminate` status code is outside 200 through 599, downstream sees 403. The completion event after termination has the result `rejected`. See [Request Lifecycle](/plugin/request-lifecycle).

## 6. Related behavior

Completion notification is in [Request Lifecycle](/plugin/request-lifecycle). Protocol translation is in [Request Translator](/plugin/request-translator).

## 7. Field experience

None yet.

