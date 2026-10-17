---
title: Request Lifecycle
feature_ids:
  - plugin.request-lifecycle-plugin.handle-request-complete
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Request Lifecycle

`RequestLifecyclePlugin` asynchronously receives one terminal state after the request has reached the intercept stage.

## 1. What this solves

When execution succeeds, execution fails, an interceptor rejects the request, or the request is canceled, the plugin receives one completion record each time, for cleanup rather than for rewriting the response.

## 2. Scope and non-goals

There is only `HandleRequestComplete`. It does not change the request or the response. Usage counting is [Usage Observer](/plugin/usage-plugin).

`sdk/pluginabi` says request completion exists from contract version 2. The current `SchemaVersion` is 6, so the capability is included.

## 3. How to configure or call it

Set `capabilities.request_lifecycle_plugin` to true.

```go
HandleRequestComplete(context.Context, RequestCompletion) error
```

The ABI method name is `request.complete`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.request-lifecycle-plugin.handle-request-complete | `HandleRequestComplete`, ABI `request.complete`. |  | Parameter `RequestCompletion`. Returns only `error`. |
| RequestCompletion.RequestID | Execution ID, the same as the intercepted request. |  | String. |
| RequestCompletion.TraceID | Inbound trace ID. |  | String. |
| RequestCompletion.SourceFormat | Client protocol. |  | String. |
| RequestCompletion.Model | Execution model. |  | String. |
| RequestCompletion.RequestedModel | Model requested by the client. |  | String. |
| RequestCompletion.Stream | Whether it is streaming. |  | Boolean. |
| RequestCompletion.Outcome | Terminal state. |  | `succeeded`, `failed`, `rejected`, `canceled`. |
| RequestCompletion.StatusCode | Status code of the terminal state. |  | 0 when canceled. |
| RequestCompletion.Error | Error text. |  | String. |
| RequestCompletion.StartedAt | Start time. |  | `time.Time`, JSON is RFC3339. |
| RequestCompletion.CompletedAt | Completion time. |  | `time.Time`. |
| RequestCompletion.Metadata | Context snapshot. |  | `map[string]any`. |

## 5. Common errors and limits

When `error` is returned, ABI `ok` is false. When `http_status` is omitted or 0, it is treated as HTTP 500.

`rejected` means an interceptor stopped the request before execution. `canceled` means the context was canceled or the downstream disconnected, and the status code is then 0. `failed` means model execution failed. Each request that reached the intercept stage has only one terminal state.

## 6. Related behavior

Interception is in [Request Interceptor](/plugin/request-interceptor). Usage is in [Usage Observer](/plugin/usage-plugin).

## 7. Field experience

None yet.

