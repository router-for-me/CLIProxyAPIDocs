---
title: Factory Droid
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Factory Droid

这里说明如何在 Factory Droid 的自定义模型里设置基址和访问密钥，以及每种 `provider` 会调用哪条已登记端点。

## 1. 这段解决什么问题

Droid 按 `provider` 选择请求形态。把基址指到本代理、把 `apiKey` 设成客户端密钥之后，Anthropic 模型走 Messages，OpenAI Responses 模型走 Responses，其余 OpenAI 兼容模型走 Chat Completions。三条路径都是已经登记的路由。

## 2. 适用条件与不做的事

现行文件是 `~/.factory/settings.json` 里的 `customModels`。本页不维护旧的 `~/.factory/config.json`。

本页不配置 Bedrock，不设置组织级限制，也不为本代理登记新的模型名。`model` 必须是当前目录里已经出现的 ID。密钥的接受顺序见[客户端密钥](/cn/api/access)。

## 3. 怎么配置或怎么调用

在 `customModels` 里按协议各写一条。`apiKey` 都是 `YOUR_API_KEY`。

```json
{
  "customModels": [
    {
      "model": "<已登记的模型 ID>",
      "baseUrl": "https://example.invalid",
      "apiKey": "YOUR_API_KEY",
      "provider": "anthropic"
    },
    {
      "model": "<已登记的模型 ID>",
      "baseUrl": "https://example.invalid/v1",
      "apiKey": "YOUR_API_KEY",
      "provider": "openai"
    },
    {
      "model": "<已登记的模型 ID>",
      "baseUrl": "https://example.invalid/v1",
      "apiKey": "YOUR_API_KEY",
      "provider": "generic-chat-completion-api"
    }
  ]
}
```

`provider` 决定客户端接上的路径：

| provider | 基址 | 方法与路径 | route ID |
| --- | --- | --- | --- |
| `anthropic` | `https://example.invalid` | `POST /v1/messages` | `route.v1.post-messages` |
| `openai` | `https://example.invalid/v1` | `POST /v1/responses` | `route.v1.post-responses` |
| `generic-chat-completion-api` | `https://example.invalid/v1` | `POST /v1/chat/completions` | `route.v1.post-chat-completions` |

`anthropic` 的基址不要带 `/v1`。`openai` 不要用来调用 Chat Completions；那种模型改用 `generic-chat-completion-api`。

`anthropic` 默认把 `apiKey` 放进 `X-Api-Key`。网关要求 `Authorization: Bearer` 时，给该条加上 `"authMode": "bearer"`。两种头本代理都接受。`openai` 与 `generic-chat-completion-api` 使用 `Authorization: Bearer YOUR_API_KEY`。

## 4. 细项说明

这些字段属于 Droid 的 `customModels`，不是本代理的 YAML 键。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| `model` | 请求体里的模型 ID。 |  | 必须是本代理当前能够路由的 ID。本页不新增模型名。 |
| `baseUrl` | 该条模型的 API 基址。 |  | `anthropic` 用根地址 `https://example.invalid`。另外两种用 `https://example.invalid/v1`。 |
| `apiKey` | 发给本代理的客户端密钥。 |  | 值为 `YOUR_API_KEY`。可以省略，但省略后本代理仍配置了密钥时会返回 401。 |
| `provider` | 决定请求形态。 |  | 只使用上表三个值。`openai` 是 Responses，不是 Chat Completions。 |
| `authMode` | `anthropic` 的密钥放在哪个头。 |  | 省略或 `provider-default` 时使用 `X-Api-Key`。`bearer` 时使用 `Authorization: Bearer`。只适用于非 Bedrock 的 `anthropic`。 |

`GET /v1/models`（`route.v1.get-models`）不是这三条自定义模型的必经调用。自定义模型的 ID 来自 `model` 字段。

## 5. 常见错误与边界

未带密钥时返回 401，正文是 `{"error":"Missing API key"}`。密钥不在 `access.api-keys` 中时返回 401，正文是 `{"error":"Invalid API key"}`。列表为空时不再校验。

`anthropic` 的基址写成 `https://example.invalid/v1` 时，客户端再接 `/v1/messages`，得到的不是已登记的 `POST /v1/messages`。`openai` 的基址若漏掉 `/v1`，也不会落到 `POST /v1/responses`。

`POST /v1/messages` 只把缺失的 `stream` 或 JSON 布尔值 `false` 当成一份 JSON。`POST /v1/responses` 只有 JSON 布尔值 `stream: true` 才返回 SSE。`POST /v1/chat/completions` 同样只把 JSON 布尔值 `true` 当成流式；没有 `messages` 但有 `input` 或 `instructions` 时，会先转换成 Chat Completions。

示例密钥安全模式命中时，这些 `/v1` 路径在进入处理函数前返回 403。

## 6. 相关功能

密钥见[客户端密钥](/cn/api/access)。Messages 见 [Claude Messages](/cn/api/claude-messages)。Responses 见 [Responses](/cn/api/responses)。Chat Completions 见 [OpenAI Chat](/cn/api/openai-chat)。

## 7. 使用经验

暂无
