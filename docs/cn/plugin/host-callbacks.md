---
title: 宿主 HTTP 客户端
feature_ids:
  - plugin.host-http-client.do
  - plugin.host-http-client.do-stream
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 宿主 HTTP 客户端

`HostHTTPClient` 是宿主交给插件的公开 HTTP 客户端。本页只写分配在这里的两个方法。

## 1. 这段解决什么问题

插件通过宿主发非流式或流式上游请求，从而沿用宿主的传输策略。执行器在请求日志打开时，也靠它留下出站请求和原始上游响应。

## 2. 适用条件与不做的事

只有 `Do` 与 `DoStream`。没有分配到本页的其他宿主回调不在这里说明，也不写宿主私有实现。

调用点出现在凭证登录、刷新、按凭证发现模型、执行器和额度查询的请求结构里，字段名都是 `HTTPClient`，并且 `json` 标签为 `-`，不会出现在 ABI 请求 JSON 中。Go 插件直接调用这个接口。

## 3. 怎么配置或怎么调用

这不是插件在 `capabilities` 里打开的能力，而是宿主传入的客户端。

```go
Do(context.Context, HTTPRequest) (HTTPResponse, error)
DoStream(context.Context, HTTPRequest) (HTTPStreamResponse, error)
```

ABI 方法名是 `host.http.do` 与 `host.http.do_stream`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.host-http-client.do | `Do`，ABI `host.http.do`。 |  | 参数 `HTTPRequest`，返回 `HTTPResponse`。 |
| plugin.host-http-client.do-stream | `DoStream`，ABI `host.http.do_stream`。 |  | 参数 `HTTPRequest`，返回 `HTTPStreamResponse`。 |
| HTTPRequest.Method | HTTP 方法。 |  | 字符串。 |
| HTTPRequest.URL | 绝对上游地址。 |  | 字符串。 |
| HTTPRequest.Headers | 请求头。 |  | `http.Header`。 |
| HTTPRequest.Body | 原始正文。 |  | `[]byte`，JSON 中为 base64。 |
| HTTPRequest.WireProfile | 可选的线上表示。 |  | 指针为空则不改。JSON 名 `wire_profile`。 |
| HTTPWireProfile.HTTP1Only | 只用 HTTP/1.1，不协商 HTTP/2。 |  | JSON 名 `http1_only`。 |
| HTTPWireProfile.DisableAutoCompression | 关闭透明解压和自动 `Accept-Encoding`。 |  | JSON 名 `disable_auto_compression`。 |
| HTTPWireProfile.HeaderProfile | 希望的头名顺序和大小写。 |  | JSON 名 `header_profile`，`[]string`。 |
| HTTPResponse.StatusCode | 上游状态码。 |  | 整数。 |
| HTTPResponse.Headers | 上游响应头。 |  | `http.Header`。 |
| HTTPResponse.Body | 原始响应正文。 |  | `[]byte`。 |
| HTTPStreamResponse.StatusCode | 上游状态码。 |  | 整数。 |
| HTTPStreamResponse.Headers | 上游响应头。 |  | `http.Header`。 |
| HTTPStreamResponse.Chunks | 流式块，直到通道关闭。 |  | 元素为 `HTTPStreamChunk`。 |
| HTTPStreamChunk.Payload | 一块原始字节。 |  | `[]byte`。 |
| HTTPStreamChunk.Err | 这一块附带的错误。 |  | `error`。 |

## 5. 常见错误与边界

两个方法都返回 `error`。ABI 失败信封的 `http_status` 省略或为 0 时按 HTTP 500 处理。

`URL` 是绝对地址。`WireProfile` 为空指针时不附加线上配置。流式结果通过 `Chunks` 通道交付，通道关闭表示结束。

## 6. 相关功能

执行器必须使用该客户端访问上游，见 [执行器](/cn/plugin/executor)。登录和刷新见 [凭证提供方](/cn/plugin/auth-provider)。

## 7. 使用经验

暂无
