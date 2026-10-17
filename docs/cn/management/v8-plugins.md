---
title: 管理端插件
feature_ids:
  - management.v8.delete-plugins-id
  - management.v8.delete-plugins-id-quota
  - management.v8.get-plugins
  - management.v8.get-plugins-id-quota
  - management.v8.get-plugins-store
  - management.v8.post-plugins-id-quota
  - management.v8.post-plugins-store-id-install
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 管理端插件

## 1. 这段解决什么问题

列出已发现和已配置的插件、删除本地插件及其配置、浏览插件商店并安装，以及读取或重置某个插件为其凭证提供的配额。

## 2. 适用条件与不做的事

这些路由需要管理密钥。是否加载插件、目录和商店认证见 [插件加载与商店](/cn/operations/plugins)。这里不实现插件接口。配额只对声明了配额能力的插件有意义。

## 3. 怎么配置或怎么调用

基址使用 `https://example.invalid`，请求头使用 `Authorization: Bearer YOUR_API_KEY`。

| 方法与路径 | 作用 |
| --- | --- |
| GET /v8/management/plugins | 列出目录、配置和已注册插件。 |
| DELETE /v8/management/plugins/:id | 删除该本地插件文件和已保存配置。 |
| GET /v8/management/plugins/store | 拉取商店目录及本地安装状态。 |
| POST /v8/management/plugins/store/:id/install | 从商店安装该插件。 |
| GET /v8/management/plugins/:id/quota | 读取该插件对某凭证的配额。 |
| POST /v8/management/plugins/:id/quota | 向插件重新拉取配额。 |
| DELETE /v8/management/plugins/:id/quota | 让插件重置配额，并重置路由侧配额状态。 |

配额的 `auth_index` 可以放在查询参数 `auth_index` 或 `authIndex`。POST 与 DELETE 也可在 JSON 里使用 `auth_index`、`authIndex` 或 `AuthIndex`。安装可用查询参数 `version` 和 `source`；若正文也带 `version`，两边规范化后必须一致。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| DELETE /v8/management/plugins/:id | 删除本地插件和配置项。 |  | 找不到时 404 `plugin_not_found`。目录无法解析时 500 `plugin_directory_invalid`。成功时 `status` 为 `deleted`。 |
| DELETE /v8/management/plugins/:id/quota | 重置插件配额。 |  | 缺少 `auth_index` 时 400。凭证不存在时 404 `auth not found`。插件没有配额提供者时 404 `quota provider not found for plugin`。插件拒绝时 502。 |
| GET /v8/management/plugins | 返回插件列表。 |  | 成功正文含 `plugins_enabled`、`plugins_dir` 和 `plugins`。单个实例只有在全局启用、实例启用且已注册时，`effective_enabled` 才为 true。 |
| GET /v8/management/plugins/:id/quota | 读取配额。 |  | 查询参数里的 auth index 必填，否则 400 `auth_index is required`。拉取失败时 502。 |
| GET /v8/management/plugins/store | 列出商店条目。 |  | 源配置无效时 500 `plugin_store_source_invalid`。没有任何插件且源错误时 502 `plugin_store_registry_failed`。部分源失败仍会返回 `source_errors`。 |
| POST /v8/management/plugins/:id/quota | 按正文中的凭证重新拉取配额。 |  | 正文无效时 400 `invalid request body`。其余错误与 GET 相同。 |
| POST /v8/management/plugins/store/:id/install | 安装商店中的插件。 |  | 查询 `version` 与正文 `version` 冲突时 400 `invalid_request`。可用 `source` 指定来源。 |

## 5. 常见错误与边界

插件 ID 不合法时返回 400，错误为 `invalid_plugin_id`。商店列表不会为未安装、或该来源不能更新已安装插件的条目去查询最新发行版。安装使用进程自身的操作系统和架构。重置配额时，插件已成功但路由侧重置失败，返回 500，错误以 `failed to reset routing quota` 开头。全局 `plugins.enabled` 为 false 时，列表里的有效启用仍是 false。

## 6. 相关功能

配置键见 [插件加载与商店](/cn/operations/plugins)。凭证文件见 [管理凭证](/cn/management/v8-credentials)。

## 7. 使用经验

暂无
