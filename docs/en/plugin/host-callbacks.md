---
outline: 'deep'
---

# Host Callbacks

Host callbacks are the mechanism for a plugin to call CLIProxyAPI host capabilities. They are not plugin capability fields, but they are important for executor, Management API, credential, and resource-page plugins.

## Method List

Source references:

- `sdk/pluginabi/types.go`: all `host.*` method names
- `sdk/pluginapi/types.go`: request and response structures for HTTP, model execution, and credential files
- `internal/pluginhost/host_callbacks.go`: host callback implementation

Example references:

- `examples/plugin/host-callback/go/main.go`
- `examples/plugin/host-callback-auth-files/go/main.go`
- `examples/plugin/host-model-callback/go/main.go`

## HTTP Callbacks

| Method | Purpose |
| --- | --- |
| `host.http.do` | Executes a normal HTTP request through the host. |
| `host.http.do_stream` | Executes a streaming HTTP request through the host. |
| `host.http.stream_read` | Reads an HTTP stream held by the host. |
| `host.http.stream_close` | Closes an HTTP stream held by the host. |

Plugins should prefer these methods for external HTTP services so proxy settings, transport policy, and request logging remain managed by the host.

## Model Execution Callbacks

| Method | Purpose |
| --- | --- |
| `host.model.execute` | Starts a non-streaming model request. |
| `host.model.execute_stream` | Starts a streaming model request and returns `stream_id`. |
| `host.model.stream_read` | Reads a model stream chunk. |
| `host.model.stream_close` | Closes a model stream. |

Core request fields:

```json
{
  "entry_protocol": "openai",
  "exit_protocol": "openai",
  "model": "gpt-5.5",
  "stream": false,
  "body": "base64-request-body",
  "headers": {},
  "query": {},
  "alt": ""
}
```

## host_callback_id

When a plugin calls `host.model.*` from a host-invoked context such as `management.handle`, it should forward the request's `host_callback_id`.

The host uses this ID to identify the plugin that originated the callback. During nested model execution, it skips that plugin's own request, response, and stream interceptors to avoid recursion. Other enabled plugins may still handle the nested request.

## Credential File Callbacks

| Method | Purpose |
| --- | --- |
| `host.auth.list` | Lists host credential records. |
| `host.auth.get` | Reads a physical credential JSON file by auth index. |
| `host.auth.get_runtime` | Reads runtime credential information by auth index. |
| `host.auth.save` | Writes credential JSON and updates the runtime credential record. |

`examples/plugin/host-callback-auth-files` shows how to call these methods from a resource page.

## Stream Bridge And Logging

| Method | Purpose |
| --- | --- |
| `host.stream.emit` | Lets an executor plugin send a streaming chunk to the host. |
| `host.stream.close` | Lets an executor plugin close a stream. |
| `host.log` | Writes through the host logger. |

## Development Notes

- Explicitly call the matching close method after using a streaming callback.
- Do not use host callbacks to bypass the plugin's own security boundary; a plugin is still trusted in-process code.
- Do not write credential JSON, tokens, or user request bodies to logs.
- Do not expose credential-reading, credential-writing, or other privileged host callbacks directly through unauthenticated resource GET query parameters. If a resource page needs a user-facing control for those actions, let its same-origin JavaScript read the trusted Management Center storage and call an authenticated `/v0/management/...` route.
- When the host model execution path can be reused, prefer `host.model.*` instead of copying host credentials into the plugin.
