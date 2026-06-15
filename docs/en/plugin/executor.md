---
outline: 'deep'
---

# Executor Capability

The executor capability sends model requests to an upstream provider or local backend. It is the capability closest to an upstream adapter.

## Capability Field

```json
{
  "capabilities": {
    "executor": true,
    "executor_model_scope": "both",
    "executor_input_formats": ["chat-completions"],
    "executor_output_formats": ["chat-completions"]
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `ProviderExecutor`, `ExecutorRequest`, `ExecutorResponse`, `ExecutorStreamResponse`, `ExecutorHTTPRequest`
- `sdk/pluginabi/types.go`: `executor.identifier`, `executor.execute`, `executor.execute_stream`, `executor.count_tokens`, `executor.http_request`
- `internal/pluginhost/adapters.go`: executor registration, protocol format selection, and execution bridge

Example references:

- `examples/plugin/executor/go/main.go`
- `examples/plugin/protocol-format/go/main.go`
- `examples/plugin/simple/go/main.go`: executor-related methods

## Methods

| Method | Purpose |
| --- | --- |
| `executor.identifier` | Returns the provider identifier handled by this executor. |
| `executor.execute` | Executes a non-streaming model request. |
| `executor.execute_stream` | Executes a streaming model request. |
| `executor.count_tokens` | Handles a token counting request. |
| `executor.http_request` | Entry point for executor-owned HTTP requests. |

## Protocol Formats

`executor_input_formats` declares the request protocols the executor can receive directly. `executor_output_formats` declares the response protocols the executor outputs directly.

Common values:

- `chat-completions`
- `responses`
- `anthropic`

`examples/plugin/protocol-format` demonstrates a declaration with `chat-completions` input and `responses` output.

## Model Scope

`executor_model_scope` controls how the executor relates to model registration:

| Value | Description |
| --- | --- |
| `static` | The executor only serves static models. |
| `oauth` | The executor only serves OAuth or credential-bound models. |
| `both` | The executor serves both static and credential-bound models. |

An empty value is treated as `both`.

## ExecutorRequest

The execution request contains:

```json
{
  "AuthID": "auth-1",
  "AuthProvider": "plugin-example",
  "Model": "plugin-example-model",
  "Format": "chat-completions",
  "Stream": false,
  "Headers": {},
  "Query": {},
  "OriginalRequest": "base64-client-body",
  "SourceFormat": "chat-completions",
  "Payload": "base64-provider-payload",
  "StorageJSON": "base64-auth-json",
  "AuthMetadata": {},
  "AuthAttributes": {}
}
```

When a plugin sends HTTP requests upstream, it should use the host-provided HTTP client through `host.http.*`. This keeps request logging, proxy settings, transport policy, and credential context under host control.

## Responses

Non-streaming response:

```json
{
  "Payload": "base64-response-body",
  "Headers": {
    "content-type": ["application/json"]
  },
  "Metadata": {}
}
```

A streaming response returns `Headers` and a chunk stream. C ABI examples place finite chunks in a response array, and the host converts them into an internal stream.

## Development Notes

- An executor must declare at least one input format and one output format.
- `Payload` is already translated to the target protocol request body; do not infer the original client protocol again.
- If you need to reuse the host model routing path, do not write an executor. Use `host.model.*` from [host callbacks](./host-callbacks).
- Do not store or print upstream secrets in the plugin. Credential data from `StorageJSON` should be used and then discarded.

