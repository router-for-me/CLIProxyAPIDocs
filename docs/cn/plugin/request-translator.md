---
title: 请求转换
feature_ids:
  - plugin.request-translator.translate-request
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 请求转换

`RequestTranslator` 把已是规范形的请求载荷转换成另一种格式。

## 1. 这段解决什么问题

插件按来源格式、目标格式、模型、是否流式和正文，返回转换后的原始字节。

## 2. 适用条件与不做的事

只有 `TranslateRequest`。把提供方请求收成规范形是 [请求规整](/cn/plugin/request-normalizer)，不是本接口。响应不在本页。

## 3. 怎么配置或怎么调用

`capabilities.request_translator` 设为 true。

```go
TranslateRequest(context.Context, RequestTransformRequest) (PayloadResponse, error)
```

ABI 方法名是 `request.translate`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.request-translator.translate-request | `TranslateRequest`，ABI `request.translate`。 |  | 参数 `RequestTransformRequest`，返回 `PayloadResponse`。 |
| RequestTransformRequest.FromFormat | 来源协议。 |  | 字符串。 |
| RequestTransformRequest.ToFormat | 目标协议。 |  | 字符串。 |
| RequestTransformRequest.Model | 模型 ID。 |  | 字符串。 |
| RequestTransformRequest.Stream | 是否期望流式输出。 |  | 布尔。 |
| RequestTransformRequest.Body | 待转换载荷。 |  | `[]byte`，JSON 中为 base64。 |
| PayloadResponse.Body | 转换后的载荷。 |  | `[]byte`。 |

## 5. 常见错误与边界

返回 `error` 时 ABI `ok` 为 false。`http_status` 省略或为 0 时按 HTTP 500 处理。本方法不改凭证，也不终止请求。

## 6. 相关功能

反向收成规范形见 [请求规整](/cn/plugin/request-normalizer)。改写即将发出的请求见 [请求拦截](/cn/plugin/request-interceptor)。

## 7. 使用经验

暂无
