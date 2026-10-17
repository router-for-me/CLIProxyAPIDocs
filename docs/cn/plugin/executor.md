---
title: 执行器
feature_ids:
  - plugin.provider-executor.identifier
  - plugin.provider-executor.execute
  - plugin.provider-executor.execute-stream
  - plugin.provider-executor.count-tokens
  - plugin.provider-executor.http-request
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 执行器

`ProviderExecutor` 把请求发到上游或本地后端，并提供流式、计数和原始 HTTP。

## 1. 这段解决什么问题

宿主选定凭证和协议之后，由插件完成非流式执行、流式执行、token 计数，或一条执行器自己的 HTTP 请求。

## 2. 适用条件与不做的事

五个方法都属于这一个接口。协议转换不是执行器的职责，见请求和响应各页。上游 HTTP 应使用参数里的 `HTTPClient`，而不是插件自行绕过宿主，见 [宿主 HTTP 客户端](/cn/plugin/host-callbacks)。

执行器必须至少声明一种输入格式和一种输出格式。`executor_model_scope` 为空时按 `both`。无法识别的值同样按 `both`。`both` 同时覆盖静态模型与 OAuth 凭证模型，`static` 只有非 OAuth 静态模型，`oauth` 只有 OAuth 凭证模型。

格式名先按别名归一：`chat-completions`、`chat_completions`、`openai-chat-completions`、`openai_chat_completions` 都是 `openai`；`responses`、`openai-responses`、`openai_responses` 都是 `openai-response`；`anthropic` 是 `claude`。空串和 `none` 会被丢掉。其余名字按原样修剪空白后使用。`sdk/translator` 里的公开格式还有 `gemini`、`codex`、`antigravity`、`interactions`。

## 3. 怎么配置或怎么调用

`capabilities.executor` 设为 true，并写出 scope 与格式。

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

ABI 方法名是 `executor.identifier`、`executor.execute`、`executor.execute_stream`、`executor.count_tokens`、`executor.http_request`。标识结果字段是 `identifier`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.provider-executor.identifier | `Identifier`，ABI `executor.identifier`。 |  | 无参数。返回字符串。失败或空白按空字符串处理。 |
| plugin.provider-executor.execute | `Execute`，ABI `executor.execute`。 |  | 参数 `ExecutorRequest`，返回 `ExecutorResponse`。 |
| plugin.provider-executor.execute-stream | `ExecuteStream`，ABI `executor.execute_stream`。 |  | 参数 `ExecutorRequest`，返回 `ExecutorStreamResponse`。 |
| plugin.provider-executor.count-tokens | `CountTokens`，ABI `executor.count_tokens`。 |  | 参数 `ExecutorRequest`，返回 `ExecutorResponse`。 |
| plugin.provider-executor.http-request | `HttpRequest`，ABI `executor.http_request`。 |  | 参数 `ExecutorHTTPRequest`，返回 `ExecutorHTTPResponse`。 |
| ExecutorRequest.AuthID | 选中的凭证 ID。 |  | 字符串。 |
| ExecutorRequest.AuthProvider | 凭证提供方。 |  | 字符串。 |
| ExecutorRequest.Model | 请求的模型。 |  | 字符串。 |
| ExecutorRequest.Format | 目标协议格式。 |  | 必须落在已声明的格式里。 |
| ExecutorRequest.Stream | 是否流式。 |  | 布尔。 |
| ExecutorRequest.Alt | 备用路由或模式后缀。 |  | 字符串。 |
| ExecutorRequest.Headers | 交给执行器的头。 |  | `http.Header`。 |
| ExecutorRequest.Query | 查询参数。 |  | `url.Values`。 |
| ExecutorRequest.OriginalRequest | 原始客户端正文。 |  | `[]byte`。 |
| ExecutorRequest.SourceFormat | 客户端原始协议。 |  | 字符串。 |
| ExecutorRequest.Payload | 已转换的提供方载荷。 |  | `[]byte`。 |
| ExecutorRequest.Metadata | 扩展袋。 |  | `map[string]any`。 |
| ExecutorRequest.StorageJSON | 这条凭证的插件存储。 |  | `[]byte`。 |
| ExecutorRequest.AuthMetadata | 宿主可改的凭证元数据。 |  | `map[string]any`。 |
| ExecutorRequest.AuthAttributes | 不可变属性。 |  | `map[string]string`。 |
| ExecutorRequest.HTTPClient | 宿主 HTTP 客户端。 |  | JSON 忽略。 |
| ExecutorResponse.Payload | 原始响应正文。 |  | `[]byte`。 |
| ExecutorResponse.Headers | 要转发或检查的响应头。 |  | `http.Header`。 |
| ExecutorResponse.Metadata | 执行器扩展数据。 |  | `map[string]any`。 |
| ExecutorStreamResponse.Headers | 块开始前就有的响应头。 |  | `http.Header`。 |
| ExecutorStreamResponse.Chunks | 流式块，直到通道关闭。 |  | 元素为 `ExecutorStreamChunk`。 |
| ExecutorStreamChunk.Payload | 一块原始字节。 |  | `[]byte`。 |
| ExecutorStreamChunk.Err | 这一块附带的错误。 |  | `error`。 |
| ExecutorHTTPRequest.AuthID | 选中的凭证 ID。 |  | 字符串。 |
| ExecutorHTTPRequest.AuthProvider | 凭证提供方。 |  | 字符串。 |
| ExecutorHTTPRequest.Method | HTTP 方法。 |  | 字符串。 |
| ExecutorHTTPRequest.URL | 绝对上游地址。 |  | 字符串。 |
| ExecutorHTTPRequest.Headers | 请求头。 |  | `http.Header`。 |
| ExecutorHTTPRequest.Body | 原始正文。 |  | `[]byte`。 |
| ExecutorHTTPRequest.StorageJSON | 插件凭证存储。 |  | `[]byte`。 |
| ExecutorHTTPRequest.Metadata | 宿主可改元数据。 |  | `map[string]any`。 |
| ExecutorHTTPRequest.Attributes | 不可变属性。 |  | `map[string]string`。 |
| ExecutorHTTPRequest.HTTPClient | 宿主 HTTP 客户端。 |  | JSON 忽略。 |
| ExecutorHTTPResponse.StatusCode | 上游状态码。 |  | 整数。 |
| ExecutorHTTPResponse.Headers | 上游响应头。 |  | `http.Header`。 |
| ExecutorHTTPResponse.Body | 原始响应正文。 |  | `[]byte`。 |

## 5. 常见错误与边界

没有留下任何输入格式时，错误是 `plugin executor <identifier> declares no input formats`。请求格式不在声明中时，错误是 `plugin executor <identifier> does not support input format "<format>"`。输出格式对应 `declares no output formats` 与 `does not support output format`。

方法返回 `error` 时，ABI `http_status` 省略或为 0 时按 HTTP 500 处理。`HTTPClient` 不进入 JSON。

## 6. 相关功能

把请求送进本执行器见 [模型路由](/cn/plugin/model-router)。出站 HTTP 见 [宿主 HTTP 客户端](/cn/plugin/host-callbacks)。

## 7. 使用经验

暂无
