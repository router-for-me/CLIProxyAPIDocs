---
outline: 'deep'
---

# Usage Observer Capability

The usage observer capability receives usage, latency, failure, and billing-related information after a request completes. It is suitable for integrating external statistics, auditing, billing, or monitoring systems.

## Capability Field

```json
{
  "capabilities": {
    "usage_plugin": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `UsagePlugin`, `UsageRecord`, `UsageDetail`, `UsageFailure`
- `sdk/pluginabi/types.go`: `usage.handle`
- `internal/pluginhost/adapters.go`: `RegisterUsagePlugins`, `HandleUsage`

Example references:

- `examples/plugin/usage/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodUsageHandle`

## Methods

| Method | Purpose |
| --- | --- |
| `usage.handle` | Receives one completed request usage record. |

## Record Content

`UsageRecord` contains:

```json
{
  "Provider": "codex",
  "ExecutorType": "codex",
  "Model": "gpt-5.5",
  "Alias": "gpt-5.5",
  "APIKey": "client-key-id",
  "AuthID": "auth-1",
  "AuthIndex": "0",
  "AuthType": "oauth",
  "Source": "openai",
  "ReasoningEffort": "high",
  "ServiceTier": "priority",
  "RequestedAt": "2026-06-15T12:00:00Z",
  "Latency": 1234567890,
  "TTFT": 120000000,
  "Failed": false,
  "Detail": {
    "InputTokens": 10,
    "OutputTokens": 20,
    "ReasoningTokens": 0,
    "CachedTokens": 0,
    "TotalTokens": 30
  },
  "ResponseHeaders": {}
}
```

Failed requests include `Failed: true` and `Failure`:

```json
{
  "Failure": {
    "StatusCode": 429,
    "Body": "rate limited"
  }
}
```

## Development Notes

- Usage plugins should return quickly to avoid blocking the request completion path.
- If data must be written to an external system, buffer or send asynchronously inside the plugin.
- Do not leak client API keys, upstream tokens, or complete sensitive response bodies.
- Usage observation is a side-channel capability and should not change requests or responses.

