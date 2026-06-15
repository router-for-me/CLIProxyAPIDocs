---
outline: 'deep'
---

# Request Translator Capability

The request translator capability converts a canonical request into the target provider protocol. It runs in the protocol translation stage before request execution and is suitable for translating a CLIProxyAPI-normalized request body into the upstream payload.

## Capability Field

```json
{
  "capabilities": {
    "request_translator": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `RequestTranslator`, `RequestTransformRequest`, `PayloadResponse`
- `sdk/pluginabi/types.go`: `request.translate`
- `internal/pluginhost/adapters.go`: `TranslateRequest`, `callRequestTranslator`

Example references:

- `examples/plugin/request-translator/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodRequestTranslate`

## Methods

| Method | Purpose |
| --- | --- |
| `request.translate` | Converts `Body` from `FromFormat` to `ToFormat`. |

## Request

```json
{
  "FromFormat": "chat-completions",
  "ToFormat": "anthropic",
  "Model": "claude-sonnet",
  "Stream": false,
  "Body": "base64-request-body"
}
```

## Response

```json
{
  "Body": "base64-translated-body"
}
```

## Difference From Request Normalization

- The [request normalizer capability](./request-normalizer) normalizes provider or special-entry requests into a canonical format the host understands.
- The request translator capability converts the canonical format into the target upstream protocol.

## Development Notes

- Only handle format combinations that are explicitly supported. Return an error or do not declare the capability if a combination cannot be handled.
- `Body` must be a complete and valid target protocol payload.
- Do not perform credential selection or upstream HTTP requests inside a translator. Those belong to the scheduler and executor stages.

