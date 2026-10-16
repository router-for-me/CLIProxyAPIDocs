---
title: Claude Code
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Claude Code

这里说明如何把 Claude Code 的基址和访问密钥指到本代理，以及这样配置后会调用哪些已登记端点。

## 1. 这段解决什么问题

Claude Code 默认把 Anthropic 兼容请求发到官方地址。把基址改到本代理、把访问密钥改成 `access.api-keys` 中的一项之后，对话、计数和模型目录都进本代理已经登记的路由。

## 2. 适用条件与不做的事

本页只改 Claude Code 自己的环境变量。它不创建上游 Claude 凭证，也不改本代理的 `access.api-keys`。密钥的接受顺序和示例密钥安全模式见[客户端密钥](/cn/api/access)。

本页不设置权限模式、超时、遥测、推理强度或某个具体模型名。模型必须是当前目录里已经出现的 ID。本页也不描述请求进入上游之前的协议转换。

## 3. 怎么配置或怎么调用

编辑 `~/.claude/settings.json`。基址不要带 `/v1`，客户端会自己接上后面的路径。

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://example.invalid",
    "ANTHROPIC_AUTH_TOKEN": "YOUR_API_KEY",
    "CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY": "1"
  }
}
```

`YOUR_API_KEY` 必须与某一项已配置的客户端密钥完全相同。本代理依次查看 `Authorization`、`X-Goog-Api-Key`、`X-Api-Key`，以及查询参数 `key`、`auth_token`，采用第一把已经配置的密钥。`Authorization` 以 `Bearer` 加空格开头时，只取后面的令牌。

这样配置后，客户端调用下面这些已登记端点：

| 方法与路径 | route ID |
| --- | --- |
| `POST /v1/messages` | `route.v1.post-messages` |
| `POST /v1/messages/count_tokens` | `route.v1.post-messages-count-tokens` |
| `GET /v1/models` | `route.v1.get-models` |

模型目录只在打开上面的发现开关、并且客户端实际去拉目录时才会调用。对话和计数不依赖这个开关。

## 4. 细项说明

这些字段属于 Claude Code，不是本代理的 YAML 键。空白的默认值表示不指向本代理。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| `ANTHROPIC_BASE_URL` | Claude Code 使用的 API 根地址。 |  | 写 `https://example.invalid` 这种根地址，不要写成 `https://example.invalid/v1`。客户端会接上 `/v1/messages`、`/v1/messages/count_tokens` 和 `/v1/models`。 |
| `ANTHROPIC_AUTH_TOKEN` | 发给本代理的客户端密钥。 |  | 值必须是 `YOUR_API_KEY` 这类已配置密钥。它不是上游提供商密钥。 |
| `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY` | 是否让客户端拉取模型目录。 |  | 设为 `1` 时才会请求 `GET /v1/models`。请求带 `Anthropic-Version`，或 `User-Agent` 以 `claude-cli` 开头时，该路由返回 Claude 目录。 |

`X-Claude-Code-Session-Id` 会被本代理认成 Claude 会话，用来做会话粘性。它不是一条路由。

## 5. 常见错误与边界

未带任何接受的密钥时返回 401，正文是 `{"error":"Missing API key"}`。带了值但没有一把与配置相同，返回 401，正文是 `{"error":"Invalid API key"}`。`access.api-keys` 为空时，这些路由不再要求客户端密钥。

示例密钥安全模式已经启用，且列表里仍有 `your-api-key-1`、`your-api-key-2` 或 `your-api-key-3` 时，`/v1` 前缀会在进入处理函数前返回 403，并设置 `X-CPA-SAFE-MODE: example-api-key`。不要把模板密钥当作 `ANTHROPIC_AUTH_TOKEN`。

基址多写了 `/v1` 时，客户端拼出来的路径不是上表里的已登记路径。`POST /v1/messages` 只在 `stream` 缺失或为 JSON 布尔值 `false` 时返回一份 JSON；其他已存在的 `stream` 值走 SSE。计数路由只返回 JSON。

## 6. 相关功能

密钥写法见[客户端密钥](/cn/api/access)。两条消息路由的状态和正文见 [Claude Messages](/cn/api/claude-messages)。目录格式见 [OpenAI Chat](/cn/api/openai-chat)。会话粘性见[路由策略](/cn/routing/strategy)。

## 7. 使用经验

暂无
