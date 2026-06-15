---
outline: 'deep'
---

# 响应转换前规整能力

响应转换前规整能力用于在宿主原生响应转换之前改写上游响应。它适合修正上游返回的 provider-native payload，再交给宿主或插件响应转换器处理。

## 能力字段

```json
{
  "capabilities": {
    "response_before_translator": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`ResponseNormalizer`、`ResponseTransformRequest`、`PayloadResponse`
- `sdk/pluginabi/types.go`：`response.normalize_before`
- `internal/pluginhost/adapters.go`：`NormalizeResponse` 转换前阶段

示例参考：

- `examples/plugin/response-normalizer/go/main.go`
- `examples/plugin/simple/go/main.go`：`MethodResponseNormalizeBefore`

## 方法

| 方法 | 作用 |
| --- | --- |
| `response.normalize_before` | 在响应翻译前返回规整后的响应体。 |

## 请求与响应

请求使用 `ResponseTransformRequest`，响应使用 `PayloadResponse`：

```json
{
  "Body": "base64-normalized-provider-response"
}
```

## 与响应转换后规整的区别

- `response_before_translator` 处理 provider-native 响应。
- [响应转换后规整能力](./response-after-translator) 处理已经翻译成客户端协议后的响应。

## 开发注意

- 适合修正上游字段缺失、兼容非标准 provider 响应。
- 不要输出客户端协议格式，除非当前阶段的 `ToFormat` 本来就是该格式。
- 需要同时支持转换前和转换后时，可以两个能力都声明。

