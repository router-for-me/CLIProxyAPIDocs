---
title: 管理接口
feature_ids:
  - plugin.management-api.register-management
  - plugin.management-handler.handle-management
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 管理接口

本页承接已经分配到这里的两个公开接口：`ManagementAPI` 负责登记路由，`ManagementHandler` 负责处理命中的请求。

## 1. 这段解决什么问题

插件在宿主给出的前缀下声明精确的管理路由和浏览器资源路由，并在请求到达时返回状态码、头和正文。

## 2. 适用条件与不做的事

不实现宿主自己的管理 API。登记请求里的 `BasePath` 是插件唯一可以挂管理路由的前缀，值为 `/v0/management`。`ResourceBasePath` 是 `/v0/resource/plugins/` 加上插件 ID。

资源路由不走管理认证。带非空 `Menu` 的 GET 管理声明不会同时登记管理端点，只会按资源路由登记。

## 3. 怎么配置或怎么调用

`capabilities.management_api` 设为 true。

```go
RegisterManagement(context.Context, ManagementRegistrationRequest) (ManagementRegistrationResponse, error)
HandleManagement(context.Context, ManagementRequest) (ManagementResponse, error)
```

ABI 方法名是 `management.register` 与 `management.handle`。每条 `ManagementRoute` 和 `ResourceRoute` 的 `Handler` 实现第二个接口。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.management-api.register-management | `RegisterManagement`，ABI `management.register`。 |  | 参数 `ManagementRegistrationRequest`。 |
| plugin.management-handler.handle-management | `HandleManagement`，ABI `management.handle`。 |  | 参数 `ManagementRequest`，返回 `ManagementResponse`。 |
| ManagementRegistrationRequest.Plugin | 插件元数据。 |  | `Metadata`。 |
| ManagementRegistrationRequest.BasePath | 管理路由前缀。 |  | 固定为 `/v0/management`。 |
| ManagementRegistrationRequest.ResourceBasePath | 资源前缀。 |  | `/v0/resource/plugins/<pluginID>`。 |
| ManagementRegistrationResponse.Routes | 要暴露的精确管理路由。 |  | `[]ManagementRoute`。 |
| ManagementRegistrationResponse.Resources | 浏览器资源。 |  | 挂在资源前缀下。 |
| ManagementRoute.Method | HTTP 方法。 |  | 空白按 GET。含空白则整条路由无效。 |
| ManagementRoute.Path | 精确路径。 |  | 相对路径会补上 `/`，再挂到 `/v0/management` 下。已带该前缀的会先去掉再挂回。 |
| ManagementRoute.Menu | 旧式资源菜单标题。 |  | GET 且非空时不登记 `/v0/management` 端点，只按资源路由登记。 |
| ManagementRoute.Description | 旧式菜单说明。 |  | 字符串。 |
| ManagementRoute.Handler | 处理该路由的对象。 |  | 不能为空，否则路由无效。 |
| ResourceRoute.Path | 资源精确路径。 |  | 挂到该插件的资源前缀下。 |
| ResourceRoute.Menu | 管理界面菜单标题。 |  | 资源请求是 GET。 |
| ResourceRoute.Description | 界面说明。 |  | 字符串。 |
| ResourceRoute.Handler | 资源处理对象。 |  | 不能为空。资源请求不带管理认证。 |
| ManagementRequest.Method | 实际 HTTP 方法。 |  | 字符串。 |
| ManagementRequest.Path | 请求路径。 |  | 字符串。 |
| ManagementRequest.Headers | 请求头。 |  | `http.Header`。 |
| ManagementRequest.Query | 查询参数。 |  | `url.Values`。 |
| ManagementRequest.Body | 原始正文。 |  | `[]byte`。资源 GET 不使用正文。 |
| ManagementResponse.StatusCode | HTTP 状态码。 |  | 0 按 200。 |
| ManagementResponse.Headers | 响应头。 |  | `http.Header`。 |
| ManagementResponse.Body | 原始响应正文。 |  | 契约 6 及以上的 JSON 字符串不做 HTML 转义。低于 6 时仍转义。当前版本是 6。 |

## 5. 常见错误与边界

处理函数返回 `error` 时，管理请求得到 HTTP 502，正文是 `plugin management handler failed`。资源请求同样是 502，正文是 `plugin resource handler failed`。

下列路由不会被登记：空路径、方法含空白、最终路径不在对应前缀之下、路径含空白、`:` 或 `*`。资源路径还拒绝 `..`。与保留路由冲突，或与更高优先级插件的资源路径冲突时，该条被跳过。带非空 `Menu` 的 GET 管理声明不会进入 `/v0/management`，只会按资源路由登记。

登记方法自己的 `error` 仍走 ABI 信封。`http_status` 省略或为 0 时按 HTTP 500 处理。

## 6. 相关功能

宿主管理面的既有路由不在本页。插件安装见 [插件加载与商店](/cn/operations/plugins)。

## 7. 使用经验

暂无
