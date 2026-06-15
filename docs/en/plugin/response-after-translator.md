---
outline: 'deep'
---

# Response Post-Translation Normalizer Capability

The response post-translation normalizer capability performs final rewrites after a response has already been translated into the client protocol. It is useful for strict-client compatibility, filling fields, or lightweight response post-processing.

## Capability Field

```json
{
  "capabilities": {
    "response_after_translator": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `ResponseNormalizer`, `ResponseTransformRequest`, `PayloadResponse`
- `sdk/pluginabi/types.go`: `response.normalize_after`
- `internal/pluginhost/adapters.go`: post-translation phase of `NormalizeResponse`

Example references:

- `examples/plugin/response-normalizer/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodResponseNormalizeAfter`

## Methods

| Method | Purpose |
| --- | --- |
| `response.normalize_after` | Returns the normalized client response body after response translation. |

## Request

The request contains the original client request, translated upstream request, and current response body:

```json
{
  "FromFormat": "codex",
  "ToFormat": "chat-completions",
  "Model": "gpt-5.5",
  "Stream": false,
  "OriginalRequest": "base64-client-body",
  "TranslatedRequest": "base64-provider-request",
  "Body": "base64-translated-response"
}
```

## Response

```json
{
  "Body": "base64-final-client-response"
}
```

## Development Notes

- This is suitable for filling compatibility fields required by the client protocol.
- Do not call upstream again or change billing semantics here.
- To change HTTP headers, use the [response interceptor capability](./response-interceptor), not response normalization.

