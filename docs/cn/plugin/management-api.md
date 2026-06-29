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
| 浏览器资源页面 | `Resources` | `/v0/resource/plugins/<pluginID>/...` | 资源请求本身不走管理鉴权。同源管理中心部署下，受信任页面的 JavaScript 可以读取已保存的管理密钥并调用 `/v0/management/...`。 |

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
- `/v0/resource/plugins/<pluginID>/...` 是浏览器资源路径。用于返回页面的 GET 请求本身不走 Management API 鉴权。
- 同源部署下，插件资源页可以读取管理中心的 `localStorage`，并复用其中保存的管理密钥。安装并启用这类插件，应视为信任该插件的浏览器端代码。
- 跨源部署不能依赖这个存储访问方式。插件页面必须处理管理状态缺失或无法读取的情况。
- 带 `Menu` 的旧式 GET management route 会被宿主迁移为资源路由，避免把菜单页面暴露成管理 API。

## 受信任资源页模式

需要执行特权操作时，推荐采用这种结构：

1. 用资源页承载插件 UI。
2. 页面 JavaScript 在同源可用时读取管理中心存储。
3. 使用读到的管理密钥，通过 `Authorization: Bearer <management-key>` 调用插件自己的 `/v0/management/...` 路由。

不要把敏感动作直接绑定到未鉴权的资源 GET 请求上。资源路由如果读取 query 后立刻修改配置、读取凭证文件，或调用特权宿主回调，只要资源 URL 可访问，这些动作就暴露出去了。

## 开发注意

- 插件管理路由不能覆盖宿主已有 `/v0/management` 路由。
- 资源路径不能包含空白、`:`、`*` 或 `..`。
- 返回 HTML 时仍要避免把 secret、token 或凭证 JSON 渲染到页面。
- 插件资源页应自行打包脚本。加载第三方脚本会让这些脚本获得同源管理存储的访问能力。
- 需要调用宿主模型、HTTP 或凭证文件能力时，使用 [宿主回调](./host-callbacks)。
