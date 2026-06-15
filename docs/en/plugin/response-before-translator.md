---
outline: 'deep'
---

# Response Pre-Translation Normalizer Capability

The response pre-translation normalizer capability rewrites upstream responses before the host's native response translation. It is suitable for fixing provider-native payloads before they are handled by the host or by a plugin response translator.

## Capability Field

```json
{
  "capabilities": {
    "response_before_translator": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `ResponseNormalizer`, `ResponseTransformRequest`, `PayloadResponse`
- `sdk/pluginabi/types.go`: `response.normalize_before`
- `internal/pluginhost/adapters.go`: pre-translation phase of `NormalizeResponse`

Example references:

- `examples/plugin/response-normalizer/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodResponseNormalizeBefore`

## Methods

| Method | Purpose |
| --- | --- |
| `response.normalize_before` | Returns the normalized response body before response translation. |

## Request And Response

The request uses `ResponseTransformRequest`, and the response uses `PayloadResponse`:

```json
{
  "Body": "base64-normalized-provider-response"
}
```

## Difference From Post-Translation Normalization

- `response_before_translator` handles provider-native responses.
- The [response post-translation normalizer capability](./response-after-translator) handles responses after they have already been translated into the client protocol.

## Development Notes

- This is suitable for fixing missing upstream fields or non-standard provider responses.
- Do not output the client protocol format unless the current stage's `ToFormat` is already that format.
- A plugin can declare both capabilities when it needs to support both pre-translation and post-translation normalization.

