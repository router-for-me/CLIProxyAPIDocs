---
outline: 'deep'
---

# Thinking Applier Capability

The Thinking applier capability writes a thinking configuration that the host has already parsed, normalized, and validated into a provider payload. It preserves the architecture boundary of "canonical thinking configuration to provider-specific fields".

## Capability Field

```json
{
  "capabilities": {
    "thinking_applier": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `ThinkingApplier`, `ThinkingApplyRequest`, `ThinkingConfig`
- `sdk/pluginabi/types.go`: `thinking.identifier`, `thinking.apply`
- `internal/pluginhost/adapters.go`: Thinking applier registration and invocation
- `internal/thinking/`: host thinking parsing, normalization, and validation flow

Example references:

- `examples/plugin/thinking/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodThinkingIdentifier`, `MethodThinkingApply`

## Methods

| Method | Purpose |
| --- | --- |
| `thinking.identifier` | Returns the provider identifier handled by this plugin. |
| `thinking.apply` | Applies the canonical thinking configuration to a provider payload. |

## Request

```json
{
  "Provider": "plugin-example",
  "Model": {
    "ID": "plugin-example-model",
    "Thinking": {
      "Min": 0,
      "Max": 32768,
      "ZeroAllowed": true,
      "DynamicAllowed": true,
      "Levels": ["low", "medium", "high"]
    }
  },
  "Config": {
    "Mode": "budget",
    "Budget": 1024,
    "Level": ""
  },
  "Body": "base64-provider-payload"
}
```

`Config` is already the host-normalized configuration. The plugin does not need to parse suffixes or raw thinking input from the request body again.

## Response

```json
{
  "Body": "base64-provider-payload-with-thinking"
}
```

## Development Notes

- A plugin should only handle the provider returned by its `thinking.identifier`.
- Do not bypass host thinking validation; assume `Config` is already canonical.
- Do not perform request translation, credential selection, or upstream execution inside the Thinking applier capability.

