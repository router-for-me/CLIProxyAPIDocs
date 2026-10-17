---
title: Executor
feature_ids:
  - plugin.provider-executor.identifier
  - plugin.provider-executor.execute
  - plugin.provider-executor.execute-stream
  - plugin.provider-executor.count-tokens
  - plugin.provider-executor.http-request
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Executor

`ProviderExecutor` sends a request to an upstream or local backend and provides streaming, counting, and raw HTTP.

## 1. What this solves

After the host has selected a credential and a protocol, the plugin performs non-streaming execution, streaming execution, token counting, or one HTTP request of its own as the executor.

## 2. Scope and non-goals

All five methods belong to this one interface. Protocol translation is not the executor's job. See the request and response pages. Upstream HTTP should use the `HTTPClient` in the parameters rather than bypassing the host from the plugin. See [Host Callbacks](/plugin/host-callbacks).

An executor must declare at least one input format and one output format. An empty `executor_model_scope` is treated as `both`. A value that cannot be recognized is also treated as `both`. `both` covers both static models and OAuth credential models. `static` is only non-OAuth static models. `oauth` is only OAuth credential models.

Format names are normalized by alias first: `chat-completions`, `chat_completions`, `openai-chat-completions`, and `openai_chat_completions` are all `openai`. `responses`, `openai-responses`, and `openai_responses` are all `openai-response`. `anthropic` is `claude`. An empty string and `none` are dropped. Every other name is used after surrounding whitespace is trimmed. Public formats in `sdk/translator` also include `gemini`, `codex`, `antigravity`, and `interactions`.

## 3. How to configure or call it

Set `capabilities.executor` to true and write the scope and formats.

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-executor",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-executor"
    },
    "capabilities": {
      "executor": true,
      "executor_model_scope": "both",
      "executor_input_formats": ["openai"],
      "executor_output_formats": ["openai"]
    }
  }
}
```

```go
Identifier() string
Execute(context.Context, ExecutorRequest) (ExecutorResponse, error)
ExecuteStream(context.Context, ExecutorRequest) (ExecutorStreamResponse, error)
CountTokens(context.Context, ExecutorRequest) (ExecutorResponse, error)
HttpRequest(context.Context, ExecutorHTTPRequest) (ExecutorHTTPResponse, error)
```

The ABI method names are `executor.identifier`, `executor.execute`, `executor.execute_stream`, `executor.count_tokens`, and `executor.http_request`. The identifier result field is `identifier`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.provider-executor.identifier | `Identifier`, ABI `executor.identifier`. |  | No parameters. Returns a string. Failure or blank is treated as an empty string. |
| plugin.provider-executor.execute | `Execute`, ABI `executor.execute`. |  | Parameter `ExecutorRequest`, return `ExecutorResponse`. |
| plugin.provider-executor.execute-stream | `ExecuteStream`, ABI `executor.execute_stream`. |  | Parameter `ExecutorRequest`, return `ExecutorStreamResponse`. |
| plugin.provider-executor.count-tokens | `CountTokens`, ABI `executor.count_tokens`. |  | Parameter `ExecutorRequest`, return `ExecutorResponse`. |
| plugin.provider-executor.http-request | `HttpRequest`, ABI `executor.http_request`. |  | Parameter `ExecutorHTTPRequest`, return `ExecutorHTTPResponse`. |
| ExecutorRequest.AuthID | Selected credential ID. |  | String. |
| ExecutorRequest.AuthProvider | Credential provider. |  | String. |
| ExecutorRequest.Model | Requested model. |  | String. |
| ExecutorRequest.Format | Target protocol format. |  | Must fall within the declared formats. |
| ExecutorRequest.Stream | Whether it is streaming. |  | Boolean. |
| ExecutorRequest.Alt | Alternate route or mode suffix. |  | String. |
| ExecutorRequest.Headers | Headers handed to the executor. |  | `http.Header`. |
| ExecutorRequest.Query | Query parameters. |  | `url.Values`. |
| ExecutorRequest.OriginalRequest | Original client body. |  | `[]byte`. |
| ExecutorRequest.SourceFormat | Original client protocol. |  | String. |
| ExecutorRequest.Payload | Already translated provider payload. |  | `[]byte`. |
| ExecutorRequest.Metadata | Extension bag. |  | `map[string]any`. |
| ExecutorRequest.StorageJSON | Plugin storage for this credential. |  | `[]byte`. |
| ExecutorRequest.AuthMetadata | Host-mutable credential metadata. |  | `map[string]any`. |
| ExecutorRequest.AuthAttributes | Immutable attributes. |  | `map[string]string`. |
| ExecutorRequest.HTTPClient | Host HTTP client. |  | Ignored by JSON. |
| ExecutorResponse.Payload | Raw response body. |  | `[]byte`. |
| ExecutorResponse.Headers | Response headers to forward or inspect. |  | `http.Header`. |
| ExecutorResponse.Metadata | Executor extension data. |  | `map[string]any`. |
| ExecutorStreamResponse.Headers | Response headers available before chunks start. |  | `http.Header`. |
| ExecutorStreamResponse.Chunks | Streaming chunks until the channel closes. |  | Elements are `ExecutorStreamChunk`. |
| ExecutorStreamChunk.Payload | One chunk of raw bytes. |  | `[]byte`. |
| ExecutorStreamChunk.Err | Error attached to this chunk. |  | `error`. |
| ExecutorHTTPRequest.AuthID | Selected credential ID. |  | String. |
| ExecutorHTTPRequest.AuthProvider | Credential provider. |  | String. |
| ExecutorHTTPRequest.Method | HTTP method. |  | String. |
| ExecutorHTTPRequest.URL | Absolute upstream address. |  | String. |
| ExecutorHTTPRequest.Headers | Request headers. |  | `http.Header`. |
| ExecutorHTTPRequest.Body | Raw body. |  | `[]byte`. |
| ExecutorHTTPRequest.StorageJSON | Plugin credential storage. |  | `[]byte`. |
| ExecutorHTTPRequest.Metadata | Host-mutable metadata. |  | `map[string]any`. |
| ExecutorHTTPRequest.Attributes | Immutable attributes. |  | `map[string]string`. |
| ExecutorHTTPRequest.HTTPClient | Host HTTP client. |  | Ignored by JSON. |
| ExecutorHTTPResponse.StatusCode | Upstream status code. |  | Integer. |
| ExecutorHTTPResponse.Headers | Upstream response headers. |  | `http.Header`. |
| ExecutorHTTPResponse.Body | Raw response body. |  | `[]byte`. |

## 5. Common errors and limits

When no input format is left, the error is `plugin executor <identifier> declares no input formats`. When the request format is not among those declared, the error is `plugin executor <identifier> does not support input format "<format>"`. Output formats correspond to `declares no output formats` and `does not support output format`.

When a method returns `error`, an omitted or 0 ABI `http_status` is treated as HTTP 500. `HTTPClient` does not enter JSON.

## 6. Related behavior

Sending a request into this executor is in [Model Router](/plugin/model-router). Outbound HTTP is in [Host Callbacks](/plugin/host-callbacks).

## 7. Field experience

None yet.

