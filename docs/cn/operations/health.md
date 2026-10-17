---
title: 健康检查
feature_ids:
  - route.healthz.get
  - route.healthz.head
  - route.keep-alive.get
  - route.root.get
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 健康检查

## 1. 这段解决什么问题

提供不走模型路由的存活探测、根路径说明，以及在带本地密码启动时防止进程因无人访问而退出的保活请求。

## 2. 适用条件与不做的事

`GET /healthz`、`HEAD /healthz` 和 `GET /` 不检查客户端 API 密钥。它们不代表上游模型可用，也不代替管理 API。`GET /keep-alive` 只在使用本地密码启动时注册。

## 3. 怎么配置或怎么调用

把主机换成实际监听地址。示例使用 `https://example.invalid`。

`GET /healthz` 返回 `200` 和 `{"status":"ok"}`。

`HEAD /healthz` 返回 `200`，没有响应体。

`GET /` 返回 `200`，JSON 含 `message` 为 `CLI Proxy API Server`，以及 `endpoints` 列表：`POST /v1/chat/completions`、`POST /v1/completions`、`GET /v1/models`。

使用 `--password` 启动时才会注册 `GET /keep-alive`。请求必须带上这个本地密码，放在 `Authorization: Bearer YOUR_API_KEY` 或 `X-Local-Password`。成功返回 `{"status":"ok"}`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| GET /healthz | 返回存活 JSON。 |  | 无密钥。`200`，正文 `{"status":"ok"}`。 |
| HEAD /healthz | 只返回存活状态码。 |  | 无密钥。`200`，无正文。 |
| GET /keep-alive | 重置本地密码进程的空闲计时。 |  | 仅当启动时带有本地密码才注册。空闲 10 秒会关闭进程。密码不匹配时 `401`，错误为 `invalid password`。 |
| GET / | 返回服务器说明和三条示例端点。 |  | 无密钥。不列出全部路由。 |

## 5. 常见错误与边界

未使用 `--password` 时，`GET /keep-alive` 不会出现在默认服务器上，请求得到的是未注册路由，而不是保活成功。密码错误不会重置计时。这三条公开探测都不验证上游凭证是否还能调用模型。

## 6. 相关功能

监听端口见 [监听与进程](/cn/operations/server)。本地密码也用于管理 API 的本机访问，见 [管理端设置](/cn/operations/management-settings)。

## 7. 使用经验

暂无
