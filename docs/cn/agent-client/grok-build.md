---
title: Grok Build
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Grok Build

这里说明如何把 Grok Build 的模型目录地址和访问密钥指到本代理，以及它会调用哪些已登记端点。

## 1. 这段解决什么问题

Grok Build 用自己的配置指定模型列表地址和 API 基址。指到本代理后，目录请求由 `GET /v1/models` 按 Grok Shell 目录返回；目录条目的 `api_backend` 为 `responses`，随后的对话走 Responses 路由。

## 2. 适用条件与不做的事

本页只改 `~/.grok/auth.json` 里的 API 密钥，以及 `~/.grok/config.toml` 里的端点。它不登录上游 xAI，也不改本代理的 `api-keys.xai` 或 `oauth` 凭证。

账号文件里的用户、邮箱和保留期限不是客户端密钥，本页不写。模型必须是 Grok Shell 目录里已经出现的 ID。密钥见[客户端密钥](/cn/api/access)。

## 3. 怎么配置或怎么调用

`~/.grok/auth.json`：

```json
{
  "xai::api_key": {
    "key": "YOUR_API_KEY",
    "auth_mode": "api_key"
  }
}
```

`~/.grok/config.toml`：

```toml
[features]
remote_fetch = true

[endpoints]
models_base_url = "https://example.invalid/v1"
models_list_url = "https://example.invalid/v1/models"
```

`YOUR_API_KEY` 必须是已配置的客户端密钥。本代理接受 `Authorization: Bearer YOUR_API_KEY` 和 `X-Api-Key: YOUR_API_KEY`。

`remote_fetch = true` 时，客户端按 `models_list_url` 拉目录，再按 `models_base_url` 发 Responses 请求：

| 方法与路径 | route ID |
| --- | --- |
| `GET /v1/models` | `route.v1.get-models` |
| `POST /v1/responses` | `route.v1.post-responses` |

`User-Agent` 包含 `grok-shell` 时，`GET /v1/models` 返回 Grok Shell 目录，而不是 OpenAI 列表。该目录把每条模型的 `api_backend` 写成 `responses`，因此对话基址是 `https://example.invalid/v1`，路径是 `/responses`。

## 4. 细项说明

这些字段属于 Grok Build，不是本代理的 YAML 键。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| `xai::api_key.key` | 发给本代理的客户端密钥。 |  | 值为 `YOUR_API_KEY`。`auth_mode` 使用 `api_key`。 |
| `features.remote_fetch` | 是否按配置的地址拉取远程目录。 |  | 设为 `true` 才会请求 `models_list_url`。 |
| `endpoints.models_list_url` | 模型目录的完整 URL。 |  | 必须是 `https://example.invalid/v1/models`，对应 `route.v1.get-models`。 |
| `endpoints.models_base_url` | Responses 的基址。 |  | 写 `https://example.invalid/v1`。客户端接上 `/responses`，对应 `route.v1.post-responses`。 |

比较 `grok-shell` 时不区分大小写，并且先于查询参数 `client_version`。`User-Agent` 包含 `grok-shell` 时，即使请求带有 `client_version`，`GET /v1/models` 仍返回 Grok Shell 目录，每条模型的 `api_backend` 仍是 `responses`。只有请求不是 Grok Shell 时，出现 `client_version` 才会改走 Codex 客户端目录。

## 5. 常见错误与边界

未带密钥时返回 401，正文是 `{"error":"Missing API key"}`。密钥不匹配时返回 401，正文是 `{"error":"Invalid API key"}`。`access.api-keys` 为空时不再校验。示例密钥安全模式命中时，这两条 `/v1` 路径返回 403。

`models_list_url` 若不是 `/v1/models`，就不会命中 `route.v1.get-models`。`models_base_url` 若再带一层 `/v1` 或漏掉 `/v1`，对话也不会命中 `POST /v1/responses`。

`User-Agent` 不含 `grok-shell` 时，同一次 `GET /v1/models` 不会返回 Grok Shell 目录。`POST /v1/responses` 只有 JSON 布尔值 `stream: true` 才返回 SSE。本页的配置不调用 `GET /v1/responses`，也不调用 `/backend-api/codex` 下的别名。

## 6. 相关功能

密钥见[客户端密钥](/cn/api/access)。目录的格式选择见 [OpenAI Chat](/cn/api/openai-chat)。Responses 的状态和正文见 [Responses](/cn/api/responses)。

## 7. 使用经验

暂无
