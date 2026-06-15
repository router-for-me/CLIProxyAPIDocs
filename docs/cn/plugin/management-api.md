---
outline: 'deep'
---

# Management API 能力

Management API 能力允许插件注册自己的管理接口和浏览器资源页面。它适合提供状态页、诊断页、配置辅助工具或插件专属操作入口。

## 能力字段

```json
{
  "capabilities": {
    "management_api": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`ManagementAPI`、`ManagementRegistrationRequest`、`ManagementRoute`、`ResourceRoute`、`ManagementRequest`、`ManagementResponse`
- `sdk/pluginabi/types.go`：`management.register`、`management.handle`
- `internal/pluginhost/management.go`：管理路由与资源路由注册、鉴权边界

示例参考：

- `examples/plugin/management-api/go/main.go`
- `examples/plugin/host-callback/go/main.go`
- `examples/plugin/host-model-callback/go/main.go`
- `examples/plugin/simple/go/main.go`：`MethodManagementRegister`、`MethodManagementHandle`

## 方法

| 方法 | 作用 |
| --- | --- |
| `management.register` | 注册插件自己的管理路由和浏览器资源。 |
| `management.handle` | 处理匹配到插件路由的 HTTP 请求。 |

## 路由类型

| 类型 | 注册字段 | 暴露路径 | 认证 |
| --- | --- | --- | --- |
| 插件自有管理接口 | `Routes` | `/v0/management/...` | 需要管理密钥。 |
| 浏览器资源页面 | `Resources` | `/v0/resource/plugins/<pluginID>/...` | 资源路由访问。 |

## 注册响应

```json
{
  "Routes": [
    {
      "Method": "POST",
      "Path": "/plugins/example/run"
    }
  ],
  "Resources": [
    {
      "Path": "/status",
      "Menu": "Example Plugin",
      "Description": "Shows example plugin status."
    }
  ]
}
```

资源示例最终路径：

```text
/v0/resource/plugins/example/status
```

## 处理请求

`management.handle` 接收：

```json
{
  "Method": "GET",
  "Path": "/v0/resource/plugins/example/status",
  "Headers": {},
  "Query": {},
  "Body": "base64-body"
}
```

响应：

```json
{
  "StatusCode": 200,
  "Headers": {
    "Content-Type": ["text/html; charset=utf-8"]
  },
  "Body": "base64-html"
}
```

## 鉴权边界

- `/v0/management/...` 下的插件管理接口需要管理密钥。
- `/v0/resource/plugins/<pluginID>/...` 是浏览器资源路径，不走同样的 Management API 鉴权。
- 带 `Menu` 的旧式 GET management route 会被宿主迁移为资源路由，避免把菜单页面暴露成管理 API。

## 开发注意

- 插件管理路由不能覆盖宿主已有 `/v0/management` 路由。
- 资源路径不能包含空白、`:`、`*` 或 `..`。
- 返回 HTML 时仍要避免把 secret、token 或凭证 JSON 渲染到页面。
- 需要调用宿主模型、HTTP 或凭证文件能力时，使用 [宿主回调](./host-callbacks)。
