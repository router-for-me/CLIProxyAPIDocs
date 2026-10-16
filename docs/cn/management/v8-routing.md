---
title: 管理端路由操作
feature_ids:
  - management.v8.get-routing-model-definitions-channel
  - management.v8.post-routing-cooldown-reset
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 管理端路由操作

## 1. 这段解决什么问题

查询某个渠道的静态模型定义，或清除一份凭证上的配额与冷却路由状态。

## 2. 适用条件与不做的事

两条路由都需要管理密钥。它们不修改 `routing` 配置；策略和冷却时长仍由路由配置页决定。清除的是运行中的冷却状态，不是删除凭证文件。

## 3. 怎么配置或怎么调用

基址使用 `https://example.invalid`，请求头使用 `Authorization: Bearer YOUR_API_KEY`。

读取模型定义。`:channel` 也可以用查询参数 `channel`，路径为空时才读查询参数。

```http
GET /v8/management/routing/model-definitions/codex HTTP/1.1
Host: example.invalid
Authorization: Bearer YOUR_API_KEY
```

清除冷却：

```http
POST /v8/management/routing/cooldown/reset HTTP/1.1
Host: example.invalid
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{"auth_index":"AUTH_INDEX"}
```

`AUTH_INDEX` 来自凭证列表里的 auth index，不是模型名。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| GET /v8/management/routing/model-definitions/:channel | 返回该渠道的静态模型列表。 |  | 渠道必填，否则 400 `channel is required`。未知渠道 400 `unknown channel`。已知渠道：`claude`、`gemini`、`gemini-interactions`、`vertex`、`aistudio`、`codex`、`kimi`、`kimi-ai`、`kimi.ai`、`kimi.com`、`antigravity`、`xai`、`x-ai`、`grok`、`devin`、`meta`、`muse`。响应含小写后的 `channel` 和 `models`。 |
| POST /v8/management/routing/cooldown/reset | 按 `auth_index` 清除配额和冷却路由状态。 |  | 正文无效时 400 `invalid request body`。空的 `auth_index` 为 400 `auth_index is required`。找不到凭证时 404 `auth not found`。管理器不可用时 503。成功返回 `status`、`auth_index` 和 `models`。 |

## 5. 常见错误与边界

渠道比较不区分大小写，但未知别名不会猜测到别的提供商。`kimi` 与 `kimi-ai` 使用同一组静态模型；`xai` 与 `grok`、`meta` 与 `muse` 也各自共用。重置不会创建凭证。重置过程内部失败时返回 500，错误以 `failed to reset quota` 开头。

## 6. 相关功能

凭证列表见 [管理凭证](/cn/management/v8-credentials)。选择策略不在本页修改。

## 7. 使用经验

暂无
