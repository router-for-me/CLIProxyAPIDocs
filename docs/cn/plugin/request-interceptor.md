---
title: 请求拦截
feature_ids:
  - plugin.request-interceptor.intercept-request-before-auth
  - plugin.request-interceptor.intercept-request-after-auth
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 请求拦截

`RequestInterceptor` 在选出凭证之前和之后改写即将执行的请求。

## 1. 这段解决什么问题

插件可以替换部分头和正文、删掉头、改路径，或在请求到达执行器之前终止并给出下游响应。

## 2. 适用条件与不做的事

两个方法共用 `RequestInterceptRequest` 与 `RequestInterceptResponse`。凭证选择前 `ToFormat` 为空；选择后 `Model` 是选中的上游模型。不负责流式块，也不负责用量。

`Body`、`Headers`、`Metadata` 按只读对待。正文修改必须放在返回值里。

## 3. 怎么配置或怎么调用

`capabilities.request_interceptor` 设为 true。

```go
InterceptRequestBeforeAuth(context.Context, RequestInterceptRequest) (RequestInterceptResponse, error)
InterceptRequestAfterAuth(context.Context, RequestInterceptRequest) (RequestInterceptResponse, error)
```

ABI 方法名是 `request.intercept_before` 与 `request.intercept_after`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.request-interceptor.intercept-request-before-auth | `InterceptRequestBeforeAuth`，ABI `request.intercept_before`。 |  | 凭证选择前调用。 |
| plugin.request-interceptor.intercept-request-after-auth | `InterceptRequestAfterAuth`，ABI `request.intercept_after`。 |  | 凭证选择后调用。 |
| RequestInterceptRequest.RequestID | 一次模型执行的 ID。 |  | 与完成事件关联。 |
| RequestInterceptRequest.TraceID | 入站 HTTP 的追踪 ID，可空。 |  | 字符串。 |
| RequestInterceptRequest.SourceFormat | 客户端原始协议。 |  | 字符串。 |
| RequestInterceptRequest.ToFormat | 选中的上游协议。 |  | 选择凭证前为空。 |
| RequestInterceptRequest.Model | 当前执行模型。 |  | 选择后是上游模型。 |
| RequestInterceptRequest.RequestedModel | 别名或模型池改写前的客户端模型。 |  | 字符串。 |
| RequestInterceptRequest.Stream | 是否流式。 |  | 布尔。 |
| RequestInterceptRequest.Headers | 当前上游请求头。 |  | 只读。 |
| RequestInterceptRequest.Body | 当前载荷。 |  | 只读。修改放在响应 `Body`。 |
| RequestInterceptRequest.Metadata | 上下文快照。 |  | 只读，按 JSON 值理解。 |
| RequestInterceptResponse.Path | 可选的目标路径。 |  | 例如 `/v1/images/generations`。空白表示不改。 |
| RequestInterceptResponse.Headers | 替换同名头。 |  | 未提到的头保留。 |
| RequestInterceptResponse.Body | 替换正文。 |  | 只有非空时才替换。 |
| RequestInterceptResponse.ClearHeaders | 先删除的头名。 |  | 在 `Headers` 应用之前删除。 |
| RequestInterceptResponse.Terminate | 停止后续拦截并阻止到达执行器。 |  | 为 true 时使用下面三个下游字段。 |
| RequestInterceptResponse.StatusCode | 终止时的下游状态码。 |  | 小于 200 或大于 599 时改为 403。 |
| RequestInterceptResponse.ResponseHeaders | 终止时的下游头。 |  | `http.Header`。 |
| RequestInterceptResponse.ResponseBody | 终止时的下游正文。 |  | `[]byte`。 |

## 5. 常见错误与边界

方法返回 `error` 时 ABI `ok` 为 false。`http_status` 省略或为 0 时按 HTTP 500 处理。

空 `Body` 不替换现有正文。`Terminate` 的状态码超出 200 到 599 时，下游看到 403。终止后的完成事件结果是 `rejected`，见 [请求生命周期](/cn/plugin/request-lifecycle)。

## 6. 相关功能

完成通知见 [请求生命周期](/cn/plugin/request-lifecycle)。协议转换见 [请求转换](/cn/plugin/request-translator)。

## 7. 使用经验

暂无
