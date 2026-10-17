---
title: Usage Observer
feature_ids:
  - plugin.usage-plugin.handle-usage
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Usage Observer

`UsagePlugin` receives one usage record after a request completes.

## 1. What this solves

The plugin receives the model, credential, latency, failure information, and token counts of this execution, for its own statistics.

## 2. Scope and non-goals

`HandleUsage` has no `error` return value, so it cannot reject a record by returning an error. It also does not rewrite a response that has already been produced. The terminal-state notification is [Request Lifecycle](/plugin/request-lifecycle), which is a different interface.

## 3. How to configure or call it

Set `capabilities.usage_plugin` to true.

```go
HandleUsage(context.Context, UsageRecord)
```

The ABI method name is `usage.handle`. Fields without a tag use the Go exported name. `time.Time` is RFC3339. `time.Duration` is an integer number of nanoseconds.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.usage-plugin.handle-usage | `HandleUsage`, ABI `usage.handle`. |  | Parameter `UsageRecord`. No return value. |
| UsageRecord.RequestID | ID of this model execution. |  | UUID v4 string. |
| UsageRecord.TraceID | Inbound HTTP trace ID. |  | 8 hexadecimal characters. It may be empty. |
| UsageRecord.Provider | Upstream provider. |  | String. |
| UsageRecord.BaseURL | Upstream base URL on this request or credential. |  | May be empty. |
| UsageRecord.ExecutorType | Executor implementation name. |  | String. |
| UsageRecord.Model | Model actually used. |  | String. |
| UsageRecord.Alias | User-side alias. |  | May be empty when no alias was used. |
| UsageRecord.APIKey | Client key identifier. |  | May be empty. It is not a field that guarantees the raw key. Understand it as the identifier supplied by the host. |
| UsageRecord.IsNativeKey | Whether this proxy's native configuration authenticated the provider. |  | Boolean. |
| UsageRecord.AccessProvider | Client authentication provider. |  | For example `config-inline` or a plugin ID. |
| UsageRecord.SessionID | Session ID. |  | May be empty. |
| UsageRecord.ParentSessionID | Parent session ID. |  | May be empty. |
| UsageRecord.AuthID | Selected credential ID. |  | String. |
| UsageRecord.AuthIndex | Credential index. |  | May be empty. |
| UsageRecord.AuthType | Credential type. |  | String. |
| UsageRecord.Source | Request source. |  | String. |
| UsageRecord.ReasoningEffort | Requested reasoning effort. |  | String. |
| UsageRecord.ServiceTier | Requested or reported service tier. |  | String. |
| UsageRecord.ResponseServiceTier | Final tier on the upstream response. |  | String. |
| UsageRecord.ResponseModel | Model name in the upstream response. |  | Empty when unknown. |
| UsageRecord.Generate | Whether the client asked for actual generation. |  | The host normalizes an omitted value to true before delivery. |
| UsageRecord.Stream | Whether execution was streaming. |  | Boolean. |
| UsageRecord.RequestedAt | Time the request was received. |  | `time.Time`. |
| UsageRecord.Latency | Total latency. |  | `time.Duration`. |
| UsageRecord.TTFT | Time to the first streaming token. |  | `time.Duration`. |
| UsageRecord.Failed | Whether it failed. |  | Boolean. |
| UsageRecord.Failure | Failure detail. |  | `StatusCode` and `Body`. |
| UsageRecord.Detail | Token counts. |  | See the count fields below. Every type is `int64`. |
| UsageRecord.ResponseHeaders | Selected upstream response headers. |  | `http.Header`. |
| UsageDetail.InputTokens | Input tokens. |  | `int64`. |
| UsageDetail.OutputTokens | Output tokens. |  | `int64`. |
| UsageDetail.ReasoningTokens | Reasoning tokens. |  | `int64`. |
| UsageDetail.CachedTokens | Cached token total. |  | `int64`. |
| UsageDetail.CacheReadTokens | Cache reads. |  | `int64`. |
| UsageDetail.CacheCreationTokens | Cache creation. |  | `int64`. |
| UsageDetail.TotalTokens | Total. |  | `int64`. |

## 5. Common errors and limits

This method has no error return. The ABI failure envelope is not used to reject a usage record. When `Generate` is omitted, it is already true before it reaches the plugin. The failure body is in `Failure.Body`, and the status code is in `Failure.StatusCode`.

## 6. Related behavior

The terminal state is in [Request Lifecycle](/plugin/request-lifecycle).

## 7. Field experience

None yet.

