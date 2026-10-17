---
title: 管理凭证
feature_ids:
  - management.v8.delete-credentials
  - management.v8.get-credentials
  - management.v8.get-credentials-download
  - management.v8.get-credentials-models
  - management.v8.patch-credentials-fields
  - management.v8.patch-credentials-status
  - management.v8.post-credentials
  - management.v8.post-credentials-refresh
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 管理凭证

## 1. 这段解决什么问题

在管理 API 中列出、上传、下载、删除和刷新已保存的凭证，并修改单份凭证的禁用状态或字段。

## 2. 适用条件与不做的事

全部路径都在 `/v8/management` 下，并且需要管理密钥。认证规则见 [管理 API v8](/cn/management/apiv8)。这里不发起 OAuth 登录；登录见 [管理 OAuth](/cn/management/v8-oauth)。不重置路由冷却；那是 [管理端路由操作](/cn/management/v8-routing)。

## 3. 怎么配置或怎么调用

基址使用 `https://example.invalid`，请求头使用 `Authorization: Bearer YOUR_API_KEY`。

| 方法与路径 | 作用 |
| --- | --- |
| GET /v8/management/credentials | 列出现有凭证。 |
| POST /v8/management/credentials | 上传一份或多份 JSON 凭证。 |
| DELETE /v8/management/credentials | 按名称删除，或在明确要求时删除全部 JSON 凭证。 |
| GET /v8/management/credentials/models | 查询某份凭证对客户端可见的模型。 |
| GET /v8/management/credentials/download | 按文件名下载 JSON。 |
| PATCH /v8/management/credentials/status | 设置是否禁用。 |
| PATCH /v8/management/credentials/fields | 修改该凭证上的字段。 |
| POST /v8/management/credentials/refresh | 强制刷新一份或全部凭证。 |

列出时可用查询参数 `name`、`auth_index`。带上 `page` 或 `page_size` 才分页：`page` 缺省为 1，`page_size` 缺省为 50，都必须是正整数。分页响应额外包含 `total`、`page`、`page_size` 和 `has_more`。不分页时返回 `observed_at` 和 `files`。

上传可以使用 multipart 文件，或在查询参数 `name` 中给出以 `.json` 结尾的文件名并提交原始 JSON。删除全部时查询参数 `all` 为 `true`、`1` 或 `*`。否则用重复的 `name` 查询参数，或 JSON 正文里的 `name`、`names`，或字符串数组。

刷新可用查询参数 `all=true`、`name`、`auth_index`，或 JSON 正文 `{"name":"...","auth_index":"...","all":false}`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| DELETE /v8/management/credentials | 删除凭证文件。 |  | 没有可用的核心凭证管理器时 503。未给出合法名称时 400 `invalid name`。部分失败时 207，正文含 `status: partial`。 |
| GET /v8/management/credentials | 列出凭证。 |  | `page` 不是正整数时 400 `page must be a positive integer`。`page_size` 同样必须为正整数。 |
| GET /v8/management/credentials/download | 下载单个 JSON 凭证文件。 |  | `name` 必须只是文件名且以 `.json` 结尾，否则 400。文件不存在为 404 `file not found`。 |
| GET /v8/management/credentials/models | 返回该凭证的模型列表。 |  | 查询参数 `name` 必填，否则 400 `name is required`。响应为 `{"models":[...]}`。 |
| PATCH /v8/management/credentials/fields | 按字段更新凭证。 |  | JSON 必须含 `name`。找不到凭证为 404 `auth file not found`。插件展开的虚拟凭证返回 409。`weight` 必须是整数，且不能写成嵌套字段。 |
| PATCH /v8/management/credentials/status | 设置 `disabled`。 |  | 正文需要 `name` 和布尔 `disabled`。可带 `auth_index`。缺少 `disabled` 时 400 `disabled is required`。 |
| POST /v8/management/credentials | 写入上传的凭证。 |  | 非 JSON 文件名返回 400 `file must be .json`。multipart 没有文件时 400 `no files uploaded`。多文件部分失败时 207。 |
| POST /v8/management/credentials/refresh | 强制刷新凭证。 |  | 未给 `name` 且未要求全部时 400 `name or all=true is required`。找不到时 404 `auth file not found`。全部刷新成功时返回 `ok` 和 `results`。 |

## 5. 常见错误与边界

核心凭证管理器不可用时，上传、删除、改状态、改字段和刷新返回 503 `core auth manager unavailable`。列出在管理器缺失时改为读磁盘。下载名称含路径成分时视为 `invalid name`。配置里的 API 密钥凭证被禁用时，走的是配置中的排除模型，响应里的 `via` 为 `config:excluded-models`。虚拟插件凭证的状态只能对着源文件名修改，不能单独改展开出来的项目凭证。

## 6. 相关功能

登录与导入见 [管理 OAuth](/cn/management/v8-oauth)。冷却重置见 [管理端路由操作](/cn/management/v8-routing)。

## 7. 使用经验

- [用管理接口暂停凭证](/cn/experience/management#exp-management-disable-credential)
- [禁用的 OAuth 凭证仍会刷新](/cn/experience/management#exp-management-disabled-oauth-still-refreshes)
- [在凭证字段上设置优先级](/cn/experience/management#exp-management-set-credential-priority)
- [fill-first 会在额度恢复后回到先前账号](/cn/experience/routing#exp-routing-fill-first-recovers)
