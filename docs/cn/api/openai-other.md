---
title: 其他入口
feature_ids:
  - route.v1.get-models-model
  - route.v1.post-alpha-search
  - route.management-html.get
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 其他入口

这里说明钉住提交里尚未归到其他调用页的三个公开入口：单条模型、`/v1/alpha/search`，以及管理面板页面。

## 1. 这段解决什么问题

`GET /v1/models/*model` 从同一次模型目录里取出一条记录。`POST /v1/alpha/search` 把 Codex 搜索请求交给已选中的 Codex 凭证。`GET /management.html` 返回管理控制面板文件；它不在 `/v1` 分组上。

## 2. 适用条件与不做的事

模型查询和搜索都先经过客户端密钥校验。密钥和示例密钥安全模式见[客户端密钥](/cn/api/access)。`GET /management.html` 注册时没有这层客户端密钥校验。

完整模型列表在 [OpenAI Chat](/cn/api/openai-chat)。`/backend-api/codex/alpha/search` 使用同一个搜索处理函数，说明在 [Responses](/cn/api/responses)。管理密钥、管理 API 和面板仓库地址不在本页。

## 3. 怎么配置或怎么调用

单条模型。路径中的一段是目录条目的 `id`；条目没有 `id` 时用 `slug` 比较。

```bash
curl https://example.invalid/v1/models/<已登记的模型 ID> \
  -H "Authorization: Bearer YOUR_API_KEY"
```

搜索。可选的 JSON 字段 `id` 和 `model` 会被读取。`id` 去掉空白后非空时，作为选择凭证用的 `X-Session-ID`。

```bash
curl https://example.invalid/v1/alpha/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>"}'
```

管理面板：

```bash
curl -I https://example.invalid/management.html
```

示例密钥安全模式已经启用时，要打开仍可配置的面板，使用 `/management.html?safe-mode=configure`。不带这个查询的 `GET` 或 `HEAD` 会先变成警告页。

## 4. 细项说明

「默认值」与台账 `defaults` 逐字相同。空白单元格表示该字段是空字符串。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| route.v1.get-models-model | `GET /v1/models/*model`。 |  | 去掉前导斜杠后的整段作为要查找的模型 ID。目录格式与 `GET /v1/models` 相同，但只写回匹配的那一条 JSON。 |
| route.v1.post-alpha-search | `POST /v1/alpha/search`。 |  | 读取最多 16 MiB。能解析为 JSON 对象时，转发前删除 `prompt_cache_key` 和 `prompt_cache_retention`。 |
| route.management-html.get | `GET /management.html`。 |  | 不经过客户端密钥中间件。文件不存在时会尝试下载面板；下载失败仍是 404。 |

搜索对 API key 形态的 Codex 凭证要求 base URL，转发到该地址下的 `/alpha/search`。OAuth 凭证走 Codex 搜索上游。模型路由目标如果不是 `codex`，请求不会发出。

## 5. 常见错误与边界

单条模型只在整份目录 `json.Unmarshal` 失败时返回 502，正文为 `{"error":{"message":"Invalid model catalog","type":"api_error"}}`。目录是合法 JSON 但没有 `data` 或 `models` 数组，以及没有 `id` 或 `slug` 与路径相同的条目时，都返回 404，正文为 `{"error":{"message":"Model not found","type":"invalid_request_error","code":"model_not_found"}}`。

列表格式的选择和 Home 失败状态与 `GET /v1/models` 相同，见 [OpenAI Chat](/cn/api/openai-chat)。Home 或 Grok Shell 目录同样先形成列表，再按 `id` 或 `slug` 取一条。

搜索的状态与 `/backend-api/codex/alpha/search` 相同：认证管理器不可用是 503 `Codex auth manager unavailable`；没有凭证是 503 `Codex auth unavailable`；API key 凭证缺少 base URL 是 503 `Codex Alpha Search API key base URL unavailable`。读请求体失败且不能归类时为 400，`error` 为 `Failed to read search request`。选路或模型路由失败且不能归类时为 503。上游请求或读取上游正文失败且不能归类时为 502，后者的 `error` 为 `Failed to read Codex search response`。到达上游后，状态码、正文和上游给出的 `Content-Type` 按原样写回。选路错误携带的 `Retry-After` 会附加到响应。

`GET /management.html` 在配置为空、启用了 Home，或管理控制面板被关闭时直接返回 404，没有 JSON 正文。面板路径为空、文件不存在且无法下载时也是 404。读取文件状态出现其他错误时返回 500。成功时按文件内容返回，不套 JSON。

## 6. 相关功能

模型列表见 [OpenAI Chat](/cn/api/openai-chat)。Codex 别名搜索见 [Responses](/cn/api/responses)。客户端密钥见[客户端密钥](/cn/api/access)。管理面板的使用说明见[Web UI](/cn/management/webui)。

## 7. 使用经验

- [在管理页重置 Codex 账号](/cn/experience/management#exp-management-reset-codex-from-panel)
- [管理登录使用 secret-key](/cn/experience/operations#exp-operations-management-secret)
- [关闭面板后没有哈希管理地址](/cn/experience/operations#exp-operations-panel-route-is-html)
- [让管理页文件能够下载](/cn/experience/routing#exp-routing-management-page-download)
