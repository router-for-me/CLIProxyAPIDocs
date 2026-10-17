---
title: 插件加载与商店
feature_ids:
  - plugins.auth-revision.value
  - plugins.configs.enabled
  - plugins.configs.priority
  - plugins.dir.value
  - plugins.enabled.value
  - plugins.store-auth.allow-insecure
  - plugins.store-auth.apply-to
  - plugins.store-auth.header-name
  - plugins.store-auth.header-value-env
  - plugins.store-auth.match
  - plugins.store-auth.password-env
  - plugins.store-auth.token-env
  - plugins.store-auth.type
  - plugins.store-auth.username-env
  - plugins.store-sources.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 插件加载与商店

## 1. 这段解决什么问题

决定是否加载动态插件、从哪个目录发现它们、每个插件实例是否启用以及启动顺序，并可选地追加第三方插件商店和这些商店的认证规则。

## 2. 适用条件与不做的事

这里是宿主配置，不是插件作者要实现的接口。接口说明仍在插件开发各页。管理端的列出、安装和配额路由见 [管理端插件](/cn/management/v8-plugins)。`plugins.auth-revision` 由 Home 维护，不能当普通设置去改。

## 3. 怎么配置或怎么调用

```yaml
plugins:
  enabled: false
  dir: "plugins"
  configs:
    example:
      enabled: true
      priority: 1
```

追加商店和认证时，地址使用 `https://example.invalid`。密钥放在环境变量里，配置只写变量名。示例中的类型为 `bearer`、`basic`、`header` 和 `github-token`。

```yaml
plugins:
  store-sources:
    - "https://example.invalid/cliproxy-plugins/registry.json"
  store-auth:
    - match: "https://example.invalid/bearer/"
      apply-to: ["registry", "artifact"]
      type: "bearer"
      token-env: "CLIPROXY_PLUGIN_STORE_TOKEN"
      allow-insecure: false
    - match: "https://example.invalid/basic/"
      apply-to: ["registry", "artifact"]
      type: "basic"
      username-env: "CLIPROXY_PLUGIN_STORE_USER"
      password-env: "CLIPROXY_PLUGIN_STORE_PASSWORD"
      allow-insecure: false
    - match: "https://example.invalid/header/"
      apply-to: ["registry", "artifact"]
      type: "header"
      header-name: "X-Plugin-Token"
      header-value-env: "CLIPROXY_PLUGIN_STORE_HEADER_TOKEN"
      allow-insecure: false
    - match: "https://example.invalid/repos/example/"
      apply-to: ["registry", "artifact"]
      type: "github-token"
      token-env: "CLIPROXY_PLUGIN_GITHUB_TOKEN"
      allow-insecure: false
```

内置官方商店始终包含在内。`store-sources` 只是追加。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugins.auth-revision | Home 管理的插件凭证发生变化时改变。 | 0 | 管理 API v8 若改动该字段，返回 400，错误为 `read_only_field`。 |
| plugins.configs.enabled | 该插件实例是否启用。 | nil | YAML 解析时 nil 规范为 false。单个实例的 enabled 不会隐式打开全局 `plugins.enabled`。 |
| plugins.configs.priority | 插件启动和路由顺序。 | 0 | 整数。未写时为 0。 |
| plugins.dir | 插件发现目录。 | empty string | 空字符串规范为 `plugins`。以 `~` 开头时展开为用户主目录。`plugins.enabled` 为 true 且目录无法解析时，配置加载失败。 |
| plugins.enabled | 是否加载动态插件。 | false | false 时不按启用状态加载。 |
| plugins.store-auth.allow-insecure | 是否允许匹配到的商店 URL 使用 http。 | false | 仅当某条规则的 match 和 apply-to 命中该 URL，且此项为 true 时，http URL 才被接受。否则错误为 insecure plugin store url requires matching allow-insecure auth rule。 |
| plugins.store-auth.apply-to | 这条认证用于哪些请求种类。 | nil | 允许 `registry`、`metadata`、`artifact`。其他值在解析后的认证上不被接受。空列表不添加种类。 |
| plugins.store-auth.header-name | `header` 类型使用的请求头名。 | empty string | 不能为空，也不能含回车、换行或冒号。 |
| plugins.store-auth.header-value-env | 存放 header 值的环境变量名。 | empty string | 变量值为空则该 header 认证视为未配置。值不能含 CR 或 LF。 |
| plugins.store-auth.match | 用来匹配商店 URL 的前缀。 | empty string | 空 match 在规范化时丢弃。必须是带主机的 https URL，不能带用户信息、查询或片段。 |
| plugins.store-auth.password-env | `basic` 类型的密码环境变量名。 | empty string | 必须与用户名变量同时非空。 |
| plugins.store-auth.token-env | `bearer` 或 `github-token` 的令牌环境变量名。 | empty string | 变量值为空则该类型认证不成立。令牌不写入插件清单。 |
| plugins.store-auth.type | 认证类型。 | empty string | 空类型规范为 `none`。可用 `none`、`bearer`、`basic`、`header`、`github-token`。其他类型报 unsupported。 |
| plugins.store-auth.username-env | `basic` 类型的用户名环境变量名。 | empty string | 必须与密码变量同时非空。 |
| plugins.store-sources | 追加到内置官方源之外的第三方商店注册表。 | nil | 无效源会使管理端商店列表返回 500 `plugin_store_source_invalid`。 |

## 5. 常见错误与边界

商店 URL 不能内嵌用户名密码，也不能带敏感查询参数。`match` 不是 https，或带查询、片段、用户信息时，解析后的规则无效。`http` 商店地址没有命中 `allow-insecure: true` 的规则时被拒绝。全局 `enabled` 为 false 时，某个 `configs.example.enabled: true` 的实例仍然不是有效启用。修改 `auth-revision` 的 v8 写入会被拒绝，文件不会因此保存。

## 6. 相关功能

安装和配额见 [管理端插件](/cn/management/v8-plugins)。Home 同步见 [CLIProxyAPI Home](/cn/operations/home)。

## 7. 使用经验

暂无
