---
title: 响应规整
feature_ids:
  - plugin.response-normalizer.normalize-response
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 响应规整

`ResponseNormalizer` 把响应载荷收成规范形。转换前和转换后用的是同一个方法。

## 1. 这段解决什么问题

原生转换之前，插件可以把上游响应收成规范形。转换完成、交给下游之前，也可以再收一次。两次都调用 `NormalizeResponse`。

## 2. 适用条件与不做的事

本页只有这一个方法。旧的转换前、转换后页面不再拥有功能 ID，导读见 [转换前](/cn/plugin/response-before-translator) 与 [转换后](/cn/plugin/response-after-translator)。从规范形转到目标格式是 [响应转换](/cn/plugin/response-translator)。

两个槽可以只开一个。开哪个由登记布尔值决定，不由不同的 Go 方法决定。

## 3. 怎么配置或怎么调用

转换前设置 `response_before_translator`，转换后设置 `response_after_translator`。可以同时为 true。

```go
NormalizeResponse(context.Context, ResponseTransformRequest) (PayloadResponse, error)
```

ABI 方法名分别是 `response.normalize_before` 与 `response.normalize_after`。参数结构相同。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.response-normalizer.normalize-response | `NormalizeResponse`。 |  | 两个槽共用这一方法。 |
| response.normalize_before | 转换前槽的 ABI 名。 |  | 对应登记键 `response_before_translator`。 |
| response.normalize_after | 转换后槽的 ABI 名。 |  | 对应登记键 `response_after_translator`。 |
| ResponseTransformRequest.FromFormat | 来源协议。 |  | 字符串。 |
| ResponseTransformRequest.ToFormat | 目标协议。 |  | 字符串。 |
| ResponseTransformRequest.Model | 模型 ID。 |  | 字符串。 |
| ResponseTransformRequest.Stream | 响应是否为流式。 |  | 布尔。 |
| ResponseTransformRequest.OriginalRequest | 原始客户端请求正文。 |  | `[]byte`。 |
| ResponseTransformRequest.TranslatedRequest | 提供方请求正文。 |  | `[]byte`。 |
| ResponseTransformRequest.Body | 待规整的响应载荷。 |  | `[]byte`。 |
| PayloadResponse.Body | 规整后的载荷。 |  | `[]byte`。 |

## 5. 常见错误与边界

返回 `error` 时 ABI `ok` 为 false。`http_status` 省略或为 0 时按 HTTP 500 处理。

没有单独的转换前或转换后返回类型。两个 ABI 名的结果都是 `PayloadResponse`。

## 6. 相关功能

目标格式转换见 [响应转换](/cn/plugin/response-translator)。成功响应改写见 [响应拦截](/cn/plugin/response-interceptor)。

## 7. 使用经验

暂无
