---
outline: 'deep'
---

# Response Translator Capability

The response translator capability converts a canonical response back into the target protocol requested by the client. It is symmetrical with the [request translator capability](./request-translator) and runs after the upstream response is returned but before it is sent to the client.

## Capability Field

```json
{
  "capabilities": {
    "response_translator": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `ResponseTranslator`, `ResponseTransformRequest`, `PayloadResponse`
- `sdk/pluginabi/types.go`: `response.translate`
- `internal/pluginhost/adapters.go`: `TranslateResponse`, `callResponseTranslator`

Example references:

- `examples/plugin/response-translator/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodResponseTranslate`

## Methods

| Method | Purpose |
| --- | --- |
| `response.translate` | Converts response `Body` from `FromFormat` to `ToFormat`. |

## Request

```json
{
  "FromFormat": "codex",
  "ToFormat": "chat-completions",
  "Model": "gpt-5.5",
  "Stream": false,
  "OriginalRequest": "base64-client-body",
  "TranslatedRequest": "base64-provider-request",
  "Body": "base64-upstream-response"
}
```

## Response

```json
{
  "Body": "base64-client-response"
}
```

## Development Notes

- `OriginalRequest` is the raw client request, and `TranslatedRequest` is the request sent upstream. They can be used to complete the response format.
- Response translation should output a complete response required by the client protocol.
- Whether streaming responses can be translated depends on host executor and format capabilities. Plugins should explicitly test streaming scenarios.

