---
title: OpenCode
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# OpenCode

这里说明如何把 OpenCode 内置 OpenAI 提供方的基址和访问密钥指到本代理，以及这个提供方会调用哪些已登记端点。

## 1. 这段解决什么问题

OpenCode 的 `openai` 提供方默认使用 OpenAI 兼容的模型目录和 Chat Completions。把 `baseURL` 和 `apiKey` 指到本代理后，这两类请求进入已经登记的 `/v1` 路由。

## 2. 适用条件与不做的事

本页只改 `~/.config/opencode/opencode.json` 里的内置 `openai` 提供方。文件不存在时新建。它不配置 Anthropic 提供方，也不把这个提供方改成 Responses。

密钥的接受顺序见[客户端密钥](/cn/api/access)。模型必须是当前目录里已经出现的 ID。本页不安装额外的 npm 提供方。

## 3. 怎么配置或怎么调用

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "openai": {
      "options": {
        "baseURL": "https://example.invalid/v1",
        "apiKey": "YOUR_API_KEY"
      }
    }
  }
}
```

`baseURL` 要带 `/v1`。`apiKey` 必须是已配置的客户端密钥，OpenCode 会把它放进 `Authorization: Bearer YOUR_API_KEY`。

这个提供方调用：

| 方法与路径 | route ID |
| --- | --- |
| `GET /v1/models` | `route.v1.get-models` |
| `POST /v1/chat/completions` | `route.v1.post-chat-completions` |

没有 `Anthropic-Version`，且 `User-Agent` 不是 `claude-cli` 前缀、也不包含 `grok-shell`、查询串里也没有 `client_version` 时，`GET /v1/models` 返回 OpenAI 列表。

## 4. 细项说明

这些字段属于 OpenCode，不是本代理的 YAML 键。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| `provider.openai.options.baseURL` | OpenAI 提供方的基址。 |  | 写 `https://example.invalid/v1`。客户端接上 `/models` 和 `/chat/completions`。 |
| `provider.openai.options.apiKey` | 发给本代理的客户端密钥。 |  | 值为 `YOUR_API_KEY`。本代理把它当作 `Authorization` 中的令牌。 |
| `model` | 可选的默认模型 ID。 |  | 若设置，必须是已登记的模型 ID。本页不指定具体名称。 |

OpenCode 发送的 `X-Session-Affinity` 会被认成 OpenCode 会话。它不是一条路由，只参与会话粘性。

## 5. 常见错误与边界

未带密钥时返回 401，正文是 `{"error":"Missing API key"}`。密钥不匹配时返回 401，正文是 `{"error":"Invalid API key"}`。`access.api-keys` 为空时不再校验。示例密钥安全模式命中时，`/v1` 返回 403。

`baseURL` 漏掉 `/v1` 或多写一层 `/v1` 时，拼出来的路径不是上表中的已登记路径。`POST /v1/chat/completions` 只有 JSON 布尔值 `stream: true` 才返回 SSE。没有 `messages` 但有 `input` 或 `instructions` 时，先转换成 Chat Completions 再执行。

这段配置不会调用 `POST /v1/messages` 或 `POST /v1/responses`。

## 6. 相关功能

密钥见[客户端密钥](/cn/api/access)。模型列表和 Chat Completions 见 [OpenAI Chat](/cn/api/openai-chat)。会话粘性见[路由策略](/cn/routing/strategy)。

## 7. 使用经验

暂无
