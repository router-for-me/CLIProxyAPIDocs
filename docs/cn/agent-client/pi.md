---
title: PI
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# PI

这里说明如何用官方 PI 提供方把基址和访问密钥交给 CLIProxyAPI，以及该提供方会调用哪些已登记端点。

## 1. 这段解决什么问题

`@router-for-me/pi-cliproxyapi-provider` 从本代理读取模型目录，并把推理请求发到 Codex Responses 别名。基址填本代理的根地址，访问密钥填客户端密钥。传输选 `websocket-cached` 时，续写走已登记的 WebSocket。

## 2. 适用条件与不做的事

先安装这个提供方，再在 PI 里登录。本页不配置 Fast、请求暂停，也不改 `client.codex` 的目录开关。那些开关见 [Codex 客户端目录](/cn/routing/client)。

登录地址用根地址 `https://example.invalid`，不要把 `/v1` 或 `/backend-api` 当作必须手写的基址。提供方会自己规范化。密钥见[客户端密钥](/cn/api/access)。

## 3. 怎么配置或怎么调用

安装：

```bash
pi install npm:@router-for-me/pi-cliproxyapi-provider
```

在 PI 中执行 `/login CLIProxyAPI` 或 `/login cliproxyapi`，填入：

- 基址：`https://example.invalid`
- 访问密钥：`YOUR_API_KEY`

然后执行 `/settings`，把 `Transport` 设为 `websocket-cached`。

不通过交互登录时，可以写 `~/.pi/agent/cliproxyapi.json`：

```json
{
  "baseUrl": "https://example.invalid",
  "apiKey": "YOUR_API_KEY"
}
```

环境变量 `CLIPROXYAPI_BASE_URL` 和 `CLIPROXYAPI_API_KEY` 优先于这个文件。提供方拉取目录时发送 `Authorization: Bearer YOUR_API_KEY`。

提供方把根地址规范化成两个固定地址：模型目录是 `https://example.invalid/v1/models?client_version=pi`，推理基址是 `https://example.invalid/backend-api/`。因此它调用：

| 方法与路径 | route ID |
| --- | --- |
| `GET /v1/models` | `route.v1.get-models` |
| `POST /backend-api/codex/responses` | `route.backend-api.post-codex-responses` |
| `GET /backend-api/codex/responses` | `route.backend-api.get-codex-responses` |
| `POST /backend-api/codex/responses/compact` | `route.backend-api.post-codex-responses-compact` |

输入已经带有 `/v1` 或 `/backend-api` 时，推理仍规范化到同一个 `/backend-api/`，目录仍是根地址上的 `/v1/models?client_version=pi`。`websocket-cached` 使用 `GET /backend-api/codex/responses` 的 WebSocket。HTTP 对话使用同路径的 `POST`。压缩使用 `POST /backend-api/codex/responses/compact`；压缩之后提供方会关掉该会话复用的 WebSocket。

## 4. 细项说明

这些字段属于 PI 提供方，不是本代理的 YAML 键。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| `baseUrl` | 本代理根地址。 | 未设置环境变量和配置文件时，提供方使用它自己的根地址缺省。本页示例写 `https://example.invalid`。 | 优先使用根地址。带 `/v1` 或 `/backend-api` 也会被规范化，不会改目录 URL 的位置。 |
| `apiKey` | 发给本代理的客户端密钥。 |  | 必填，除非已由 `/login` 或 `CLIPROXYAPI_API_KEY` 提供。值是 `YOUR_API_KEY`，放在 `Authorization: Bearer` 中。 |
| `CLIPROXYAPI_BASE_URL` | 覆盖 `baseUrl` 的环境变量。 |  | 非空时优先于配置文件和登录保存的地址。 |
| `CLIPROXYAPI_API_KEY` | 覆盖 `apiKey` 的环境变量。 |  | 非空时优先于配置文件和登录保存的密钥。 |
| `Transport` | PI 的传输方式。 |  | 本页设为 `websocket-cached`，对应 `GET /backend-api/codex/responses`。 |

查询串只要出现 `client_version` 这个键，`GET /v1/models` 就返回 Codex 客户端目录。提供方发送的值是 `pi`。`X-Slot-Session-Id` 会被认成 PI 会话，它不是一条路由。

登录校验只要求目录请求返回 HTTP 200。空模型列表仍算登录成功。非 200 或网络错误会要求重新填写基址和密钥。

## 5. 常见错误与边界

目录请求未带 `Authorization: Bearer YOUR_API_KEY`，且没有别的已配置密钥时，返回 401，正文是 `{"error":"Missing API key"}`。值不匹配时返回 401，正文是 `{"error":"Invalid API key"}`。提供方把非 200 当成登录失败。

示例密钥安全模式命中时，`/v1` 和 `/backend-api/codex` 都在进入处理函数前返回 403，并设置 `X-CPA-SAFE-MODE: example-api-key`。登录因此不会成功。

`POST /backend-api/codex/responses` 与 `POST /v1/responses` 使用同一处理函数：只有 JSON 布尔值 `stream: true` 才返回 SSE。`POST /backend-api/codex/responses/compact` 遇到 JSON 布尔值 `stream: true` 返回 400。`GET /backend-api/codex/responses` 必须完成 WebSocket 升级；升级失败不会开始会话。`access.api-keys` 为空时，这些路由不再要求客户端密钥，但提供方仍然会发送 `Authorization`。

## 6. 相关功能

密钥见[客户端密钥](/cn/api/access)。这四条路由的处理说明见 [Responses](/cn/api/responses) 和 [OpenAI Chat](/cn/api/openai-chat)。Codex 目录开关见 [Codex 客户端目录](/cn/routing/client)。会话粘性见[路由策略](/cn/routing/strategy)。

## 7. 使用经验

暂无
