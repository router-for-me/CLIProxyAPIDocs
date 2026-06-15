---
outline: 'deep'
---

# Request Normalizer Capability

The request normalizer capability rewrites a request payload before it enters the execution path into a shape that later host stages can handle more easily. It is commonly used to fill defaults, fix provider-specific payloads, or implement lightweight request rewrites.

## Capability Field

```json
{
  "capabilities": {
    "request_normalizer": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `RequestNormalizer`, `RequestTransformRequest`, `PayloadResponse`
- `sdk/pluginabi/types.go`: `request.normalize`
- `internal/pluginhost/adapters.go`: `NormalizeRequest`, `callRequestNormalizer`

Example references:

- `examples/plugin/request-normalizer/go/main.go`
- `examples/plugin/codex-service-tier/go/main.go`
- `examples/plugin/codex-service-tier/README.md`
- `examples/plugin/simple/go/main.go`: `MethodRequestNormalize`

## Methods

| Method | Purpose |
| --- | --- |
| `request.normalize` | Returns a new request body based on format, model, and stream flag. |

## Request

```json
{
  "FromFormat": "chat-completions",
  "ToFormat": "codex",
  "Model": "gpt-5.5",
  "Stream": false,
  "Body": "base64-request-body"
}
```

## Response

```json
{
  "Body": "base64-normalized-body"
}
```

## Example: Codex Service Tier

`examples/plugin/codex-service-tier` is a request normalizer example closer to real usage. It reads the `fast` field from plugin configuration and modifies Codex requests when all of these conditions match:

- `ToFormat` is `codex`
- `Model` is `gpt-5.5`
- `fast` is `true`

Configuration example:

```yaml
plugins:
  configs:
    codex-service-tier:
      enabled: true
      priority: 1
      fast: true
```

## Development Notes

- Request normalization should stay narrow and predictable. It should not take on executor responsibilities.
- An empty `Body` prevents the host from applying an effective rewrite. Return the original `Body` when the original content should be kept.
- Plugin-owned configuration is passed to `plugin.register` and `plugin.reconfigure` through `config_yaml`; parse and cache it there.

