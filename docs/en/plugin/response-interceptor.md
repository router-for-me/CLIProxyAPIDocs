---
outline: 'deep'
---

# Response Interceptor Capability

The response interceptor capability rewrites response headers or bodies before a successful non-streaming HTTP execution response is returned to the client.

## Capability Field

```json
{
  "capabilities": {
    "response_interceptor": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `ResponseInterceptor`, `ResponseInterceptRequest`, `ResponseInterceptResponse`
- `sdk/pluginabi/types.go`: `response.intercept_after`
- `internal/pluginhost/adapters.go`: `InterceptResponse`

Example references:

- `internal/pluginhost/adapters_test.go`: tests for response interceptor chains, header clearing, and error handling
- `examples/plugin/antigravity-web-search/go/main.go`: real migration example based on response interception

## Methods

| Method | Purpose |
| --- | --- |
| `response.intercept_after` | Rewrites successful non-streaming responses. |

## Request

```json
{
  "SourceFormat": "chat-completions",
  "Model": "gpt-5.5",
  "RequestedModel": "gpt-5.5",
  "Stream": false,
  "RequestHeaders": {},
  "ResponseHeaders": {},
  "OriginalRequest": "base64-client-body",
  "RequestBody": "base64-upstream-request",
  "Body": "base64-response-body",
  "StatusCode": 200,
  "Metadata": {}
}
```

## Response

```json
{
  "Headers": {
    "X-Plugin": ["example"]
  },
  "Body": "base64-new-response-body",
  "ClearHeaders": ["X-Old-Header"]
}
```

## Development Notes

- This only handles successful non-streaming responses. Use the [streaming response interceptor capability](./response-stream-interceptor) for streaming responses.
- `Headers` overrides response headers with the same name while preserving headers that are not mentioned.
- A non-empty `Body` replaces the response body.
- Host model callbacks started with `host_callback_id` skip the originating plugin's own response interceptors.

