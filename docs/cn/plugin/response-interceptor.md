---
title: 响应拦截
feature_ids:
  - plugin.response-interceptor.intercept-response
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 响应拦截

`ResponseInterceptor` 在成功的非流式 HTTP 执行结果交给下游之前改写它。

## 1. 这段解决什么问题

插件可以替换同名响应头、删除指定头，或在正文非空时替换正文。

## 2. 适用条件与不做的事

只处理成功的非流式响应。流式块见 [流式响应拦截](/cn/plugin/response-stream-interceptor)。它不观察 WebSocket 帧。

## 3. 怎么配置或怎么调用

`capabilities.response_interceptor` 设为 true。

```go
InterceptResponse(context.Context, ResponseInterceptRequest) (ResponseInterceptResponse, error)
```

ABI 方法名是 `response.intercept_after`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.response-interceptor.intercept-response | `InterceptResponse`，ABI `response.intercept_after`。 |  | 参数 `ResponseInterceptRequest`，返回 `ResponseInterceptResponse`。 |
| ResponseInterceptRequest.RequestID | 执行 ID。 |  | 字符串。 |
| ResponseInterceptRequest.SourceFormat | 客户端协议。 |  | 字符串。 |
| ResponseInterceptRequest.Model | 执行模型。 |  | 字符串。 |
| ResponseInterceptRequest.RequestedModel | 客户端请求的模型。 |  | 字符串。 |
| ResponseInterceptRequest.Stream | 请求是否标记为流式。 |  | 本接口仍只改写成功的非流式结果。 |
| ResponseInterceptRequest.RequestHeaders | 请求头。 |  | `http.Header`。 |
| ResponseInterceptRequest.ResponseHeaders | 当前响应头。 |  | `http.Header`。 |
| ResponseInterceptRequest.OriginalRequest | 原始客户端正文。 |  | `[]byte`。 |
| ResponseInterceptRequest.RequestBody | 实际执行的请求载荷。 |  | `[]byte`。 |
| ResponseInterceptRequest.Body | 当前响应正文。 |  | `[]byte`。 |
| ResponseInterceptRequest.StatusCode | 当前状态码。 |  | 整数。本返回值不能改状态码。 |
| ResponseInterceptRequest.Metadata | 上下文快照。 |  | 只读，按 JSON 值理解。 |
| ResponseInterceptResponse.Headers | 替换同名响应头。 |  | 未提到的头保留。 |
| ResponseInterceptResponse.Body | 替换正文。 |  | 只有非空时才替换。 |
| ResponseInterceptResponse.ClearHeaders | 先删除的响应头。 |  | 在 `Headers` 应用之前删除。 |

## 5. 常见错误与边界

返回 `error` 时 ABI `ok` 为 false。`http_status` 省略或为 0 时按 HTTP 500 处理。

空 `Body` 不替换现有正文。返回值没有状态码字段。

## 6. 相关功能

流式块见 [流式响应拦截](/cn/plugin/response-stream-interceptor)。协议转换见 [响应转换](/cn/plugin/response-translator)。

## 7. 使用经验

暂无
