---
title: Codex
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Codex

这里说明如何把 Codex 的提供方基址和访问密钥指到本代理，以及 `wire_api = "responses"` 时会调用哪些已登记端点。

## 1. 这段解决什么问题

Codex 可以把自定义提供方的 Responses 请求发到本代理。访问密钥仍然是本代理的客户端密钥。模型目录、Responses、压缩和可选的 WebSocket 都落在已经登记的路由上。

## 2. 适用条件与不做的事

本页只改 Codex 自己的 `config.toml` 和，在 API 模式下，`auth.json` 里的客户端密钥。它不登录上游 Codex，也不改 `client.codex` 里的目录开关。那些开关见 [Codex 客户端目录](/cn/routing/client)。

本页不设置审批策略、沙箱、推理强度或某个具体模型名。模型必须是当前目录里已经出现的 ID。不使用语音时，不要配置实时基址。

## 3. 怎么配置或怎么调用

两种方式都把提供方基址设为 `https://example.invalid/v1`，并把 `wire_api` 设为 `responses`。区别只在访问密钥放在哪里。

用请求头带上本代理密钥，同时保留 Codex 自己的登录文件时：

```toml
model_provider = "cliproxyapi"
model = "<已登记的模型 ID>"

[model_providers.cliproxyapi]
name = "cliproxyapi"
base_url = "https://example.invalid/v1"
wire_api = "responses"
requires_openai_auth = true
http_headers = { "X-Api-Key" = "YOUR_API_KEY" }
```

这种方式不要把 ChatGPT 登录材料改成客户端密钥。`requires_openai_auth = true` 不会自动把 `YOUR_API_KEY` 发给本代理，所以必须有上面的 `X-Api-Key`。

改由 API 密钥调用时，`~/.codex/auth.json` 写成：

```json
{
  "OPENAI_API_KEY": "YOUR_API_KEY"
}
```

对应的提供方不再另放 `X-Api-Key`：

```toml
model_provider = "cliproxyapi"
model = "<已登记的模型 ID>"

[model_providers.cliproxyapi]
name = "cliproxyapi"
base_url = "https://example.invalid/v1"
wire_api = "responses"
requires_openai_auth = true
```

`YOUR_API_KEY` 必须与某一项已配置的客户端密钥完全相同。本代理依次查看 `Authorization`、`X-Goog-Api-Key`、`X-Api-Key`，以及查询参数 `key`、`auth_token`。某一把不匹配时，仍会继续看后面的值；任意一把匹配即通过。

`base_url` 为 `https://example.invalid/v1` 且 `wire_api` 为 `responses` 时，客户端调用：

| 方法与路径 | route ID |
| --- | --- |
| `GET /v1/models` | `route.v1.get-models` |
| `POST /v1/responses` | `route.v1.post-responses` |
| `GET /v1/responses` | `route.v1.get-responses` |
| `POST /v1/responses/compact` | `route.v1.post-responses-compact` |

模型目录请求会带上查询参数 `client_version`。只要这个键出现，`GET /v1/models` 就返回 Codex 客户端目录。`GET /v1/responses` 只在客户端开启 WebSocket 时使用，例如把 `supports_websockets` 设为 `true`。

若客户端按官方 Codex 后端路径访问本代理根地址，而不是访问带 `/v1` 的提供方基址，同一批处理函数也登记在：

| 方法与路径 | route ID |
| --- | --- |
| `POST /backend-api/codex/responses` | `route.backend-api.post-codex-responses` |
| `GET /backend-api/codex/responses` | `route.backend-api.get-codex-responses` |
| `POST /backend-api/codex/responses/compact` | `route.backend-api.post-codex-responses-compact` |

上面的自定义提供方配置不会调用这三条。不要把 `base_url` 同时写成根地址和 `/v1`。

语音不是必需项。只有 Codex 客户端确实要使用实时通话时，才把实时基址指到同一个 `/v1` 前缀：

```toml
experimental_realtime_webrtc_call_base_url = "https://example.invalid/v1"
experimental_realtime_ws_base_url = "https://example.invalid/v1"
```

这时通话建立使用 `POST /v1/realtime`（`route.v1.post-realtime`）、`POST /v1/realtime/calls`（`route.v1.post-realtime-calls`）、`GET /v1/realtime`（`route.v1.get-realtime`）和 `GET /v1/realtime/calls/:call_id`（`route.v1.get-realtime-calls-call-id`）。短期密钥是 `POST /v1/realtime/client_secrets`（`route.v1.post-realtime-client-secrets`）。翻译、转写和 SIP 路由当前返回 501，不要当作可用步骤。

## 4. 细项说明

这些字段属于 Codex，不是本代理的 YAML 键。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| `model_providers.cliproxyapi.base_url` | Responses 提供方的基址。 |  | 本页写 `https://example.invalid/v1`。客户端会接上 `/responses`、`/responses/compact` 和 `/models`。 |
| `wire_api` | 提供方使用的协议。 |  | 本页只写 `responses`。不要改成聊天补全，否则不会调用上表的 Responses 路由。 |
| `http_headers` 的 `X-Api-Key` | 用请求头提交的客户端密钥。 |  | 值为 `YOUR_API_KEY`。与 `Authorization` 同时出现时，任意一把已配置密钥都能通过。 |
| `OPENAI_API_KEY` | API 模式下由 Codex 放进 `Authorization` 的客户端密钥。 |  | 只在 API 模式写入 `auth.json`。值仍是 `YOUR_API_KEY`，不是上游密钥。 |
| `requires_openai_auth` | 是否让 Codex 读取自己的 `auth.json`。 |  | `true` 不会代替本代理密钥。头模式必须另加 `X-Api-Key`。 |
| `supports_websockets` | 是否升级 Responses WebSocket。 |  | 只有需要时设为 `true`，对应 `GET /v1/responses`。 |
| `experimental_realtime_webrtc_call_base_url` | 实时 WebRTC 基址。 |  | 不用语音时不要设置。设置时用 `https://example.invalid/v1`。 |
| `experimental_realtime_ws_base_url` | 实时 WebSocket 基址。 |  | 与上一行相同。不要指向未登记的路径。 |

查询参数 `client_version` 出现时，`GET /v1/models` 走 Codex 客户端目录。Home 启用时改用 Home 的 Codex 目录。`Session-Id` 会被认成 Codex 会话，它不是一条路由。

## 5. 常见错误与边界

未带任何接受的密钥时返回 401，正文是 `{"error":"Missing API key"}`。所有候选值都不匹配时返回 401，正文是 `{"error":"Invalid API key"}`。只配置了 ChatGPT 登录、又没有 `X-Api-Key` 或 `OPENAI_API_KEY` 时，就会落在这两种 401 里。`access.api-keys` 为空时不再校验客户端密钥。

示例密钥安全模式命中时，`/v1` 和 `/backend-api/codex` 都在进入处理函数前返回 403，并设置 `X-CPA-SAFE-MODE: example-api-key`。

`POST /v1/responses` 只有 JSON 布尔值 `stream: true` 才返回 SSE。`POST /v1/responses/compact` 遇到 JSON 布尔值 `stream: true` 返回 400，说明是 `Streaming not supported for compact responses`。`GET /v1/responses` 必须是 WebSocket 升级；升级失败不会开始会话。实时路由的错误对象和 501 见[实时会话](/cn/api/realtime)。

## 6. 相关功能

密钥见[客户端密钥](/cn/api/access)。Responses 与 `/backend-api/codex` 别名见 [Responses](/cn/api/responses)。目录格式见 [OpenAI Chat](/cn/api/openai-chat)。实时通话见[实时会话](/cn/api/realtime)。目录中的 `apply_patch` 和多代理开关见 [Codex 客户端目录](/cn/routing/client)。会话粘性见[路由策略](/cn/routing/strategy)。

## 7. 使用经验

暂无
