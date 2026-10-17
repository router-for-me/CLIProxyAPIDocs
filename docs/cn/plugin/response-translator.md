---
title: 响应转换
feature_ids:
  - plugin.response-translator.translate-response
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 响应转换

`ResponseTranslator` 把规范形响应载荷转换成另一种格式。

## 1. 这段解决什么问题

插件同时看到原始客户端请求、已转换的提供方请求和待转换的响应正文，返回目标格式的字节。

## 2. 适用条件与不做的事

只有 `TranslateResponse`。规范形收拢由 [响应规整](/cn/plugin/response-normalizer) 负责，并且转换前、转换后是两个登记槽，不是两个接口。成功响应的再改写见 [响应拦截](/cn/plugin/response-interceptor)。

## 3. 怎么配置或怎么调用

`capabilities.response_translator` 设为 true。

```go
TranslateResponse(context.Context, ResponseTransformRequest) (PayloadResponse, error)
```

ABI 方法名是 `response.translate`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.response-translator.translate-response | `TranslateResponse`，ABI `response.translate`。 |  | 参数 `ResponseTransformRequest`，返回 `PayloadResponse`。 |
| ResponseTransformRequest.FromFormat | 来源协议。 |  | 字符串。 |
| ResponseTransformRequest.ToFormat | 目标协议。 |  | 字符串。 |
| ResponseTransformRequest.Model | 模型 ID。 |  | 字符串。 |
| ResponseTransformRequest.Stream | 响应是否为流式。 |  | 布尔。 |
| ResponseTransformRequest.OriginalRequest | 原始客户端请求正文。 |  | `[]byte`。 |
| ResponseTransformRequest.TranslatedRequest | 提供方请求正文。 |  | `[]byte`。 |
| ResponseTransformRequest.Body | 待转换的响应载荷。 |  | `[]byte`。 |
| PayloadResponse.Body | 转换后的载荷。 |  | `[]byte`。 |

## 5. 常见错误与边界

返回 `error` 时 ABI `ok` 为 false。`http_status` 省略或为 0 时按 HTTP 500 处理。本方法不改状态码。

## 6. 相关功能

转换前后的同一规整接口见 [响应规整](/cn/plugin/response-normalizer)。

## 7. 使用经验

暂无
