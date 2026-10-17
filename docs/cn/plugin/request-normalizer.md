---
title: 请求规整
feature_ids:
  - plugin.request-normalizer.normalize-request
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 请求规整

`RequestNormalizer` 把提供方特定的请求载荷收成规范形。

## 1. 这段解决什么问题

插件收到来源格式、目标格式、模型、是否流式和正文，返回规范载荷字节。

## 2. 适用条件与不做的事

只有 `NormalizeRequest`。从规范形转到提供方格式是 [请求转换](/cn/plugin/request-translator)。响应规整是另一个接口。

## 3. 怎么配置或怎么调用

`capabilities.request_normalizer` 设为 true。

```go
NormalizeRequest(context.Context, RequestTransformRequest) (PayloadResponse, error)
```

ABI 方法名是 `request.normalize`。参数和返回值与请求转换使用同一对结构。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.request-normalizer.normalize-request | `NormalizeRequest`，ABI `request.normalize`。 |  | 参数 `RequestTransformRequest`，返回 `PayloadResponse`。 |
| RequestTransformRequest.FromFormat | 来源协议。 |  | 字符串。 |
| RequestTransformRequest.ToFormat | 目标协议。 |  | 字符串。 |
| RequestTransformRequest.Model | 模型 ID。 |  | 字符串。 |
| RequestTransformRequest.Stream | 是否期望流式输出。 |  | 布尔。 |
| RequestTransformRequest.Body | 待规整载荷。 |  | `[]byte`。 |
| PayloadResponse.Body | 规整后的载荷。 |  | `[]byte`。 |

## 5. 常见错误与边界

返回 `error` 时 ABI `ok` 为 false。`http_status` 省略或为 0 时按 HTTP 500 处理。

## 6. 相关功能

规范形再转出见 [请求转换](/cn/plugin/request-translator)。

## 7. 使用经验

暂无
