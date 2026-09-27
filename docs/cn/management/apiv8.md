---
outline: 'deep'
---

# 管理 API v8

基础路径：`http://localhost:8317/v8/management`

这是 v8 配置布局的配置与运维 API。配置路径与 [配置选项](../configuration/options) 中的 v8 YAML 树一致。成功的配置写入会持久化到文件，并由服务热重载。

`/v0/management` 仍可供现有客户端使用，但已临近废弃。请勿再基于该接口开发新功能。

## 认证

- 除 OAuth 回调外，所有请求都必须携带有效的管理密钥，包括来自 localhost 的请求。
- 远程访问需要 `management.allow-remote: true`。在 v8 写入迁移文件之前，旧名称 `remote-management.allow-remote` 仍然有效。
- 用以下任一请求头发送明文密钥：
    - `Authorization: Bearer <plaintext-key>`
    - `X-Management-Key: <plaintext-key>`

补充说明：

- `MANAGEMENT_PASSWORD` 会额外注册一个仅存在于内存中的管理密钥，并在 `allow-remote` 为 false 时仍保持远程管理可用。该值不会写入磁盘。
- `cliproxy run --password <pwd>` 和 SDK 的 `WithLocalManagementPassword` 只接受来自 localhost（`127.0.0.1` 或 `::1`）的该密码。它只存在于内存中。
- 当 `management.secret-key` 为空、未设置 `MANAGEMENT_PASSWORD`，且启动时没有配置本地管理密码时，路由返回 404。`/v0/management` 同样返回 404。
- Home 模式不暴露此 API，同样返回 404。
- 同一个客户端 IP（包括 localhost）连续 5 次认证失败后，会被临时封禁约 30 分钟。
- 明文 `management.secret-key` 会在配置加载或保存时进行 bcrypt 哈希。

## 请求与响应约定

- 除非端点另有说明，已认证的配置和运维请求使用 `Content-Type: application/json`。
- v8 配置请求体就是值本身。不要包在 `{ "value": ... }`、`{ "items": ... }` 或旧字段名里。
- `GET /config` 和 `GET /config/<path>` 把对应 YAML 节点返回为 JSON。路径不存在时返回 `404` 和 `{ "error": "not_found" }`。
- `PUT` 替换所选节点。`PATCH` 对对象做深度合并，其他类型直接替换。`null` 会被保存，不会删除字段。删除字段请使用 `DELETE`。
- 路径段是 YAML 映射键，不是数组下标。列表必须整体替换。
- 成功的配置变更返回 `{ "status": "ok", "config-version": 8 }`，并热重载已保存的文件。
- `GET` 返回 v8 视图，但不会改写文件。第一次成功的 `PUT`、`PATCH` 或 `DELETE` 会把旧文件迁移为 `config-version: 8`，删除旧写法并保留注释。被拒绝的写入不会迁移文件。
- v8 写入会拒绝旧字段名和未知根配置节。旧字段对照见 [配置选项](../configuration/options)。

以下字段归 Home 所有。修改它们会返回 `400` 和 `{ "error": "read_only_field", "field": "<path>" }`：

- `credentials/concurrency/lifecycle-config-revision`
- `credentials/concurrency/observation-barrier-revision`
- `plugins/auth-revision`

## 配置

字段名、默认值和提供商规则见 [配置选项](../configuration/options)。下面的示例只说明传输方式。

### 读取配置

- `GET /config`：完整 v8 文档。
- `GET /config/<section>/<key>/...`：一个嵌套节点。
- `GET /config.yaml`：同一份 v8 视图的 YAML。

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/config
```

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/config/routing/strategy
```

```text
"round-robin"
```

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Accept: application/yaml' \
  http://localhost:8317/v8/management/config.yaml
```

说明：

- 响应带有 `Cache-Control: no-store`。
- YAML 的 `Content-Type` 为 `application/yaml; charset=utf-8`。
- JSON 读取会省略 `oauth.providers.codex.live-media-relay.ice-servers` 中的 `username` 和 `credential`。YAML 读取仍包含它们。
- 无法读取可用配置时，返回 `500` 以及 `{ "error": "read_failed" }` 或 `{ "error": "invalid_config" }`。

### 替换或合并配置

- `PUT /config` 替换整份文档。请求体必须是 JSON 对象。
- `PATCH /config` 把 JSON 对象深度合并进文档。
- `PUT /config/<path>` 替换该节点。请求体是原始 JSON 值：对象、数组、字符串、数字、布尔值或 `null`。
- `PATCH /config/<path>` 在当前节点和请求体都是对象时合并，否则替换该节点。
- `PUT /config.yaml` 用一份 v8 YAML 文档替换文件。`Content-Type` 可以是 `application/yaml`。`/config.yaml` 没有 `PATCH`。

```bash
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"routing":{"retry":{"request-retry":0}},"oauth":{"providers":{"aistudio":{"ws-auth":false}}}}' \
  http://localhost:8317/v8/management/config
```

```bash
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '"direct"' \
  http://localhost:8317/v8/management/config/requests/proxy-url
```

```bash
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '["client-key-1","client-key-2"]' \
  http://localhost:8317/v8/management/config/access/api-keys
```

```bash
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"enabled":true,"priority":10}' \
  http://localhost:8317/v8/management/config/plugins/configs/example-plugin
```

```bash
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/yaml' \
  --data-binary @config.yaml \
  http://localhost:8317/v8/management/config.yaml
```

响应：

```json
{ "status": "ok", "config-version": 8 }
```

上游 API key 是分组列表。请替换整个提供商列表；路径不能选择 `api-keys/codex/0`。

```bash
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '[{"name":"codex-1","base-url":"https://example.invalid","keys":[{"api-key":"sk-example","weight":1}]}]' \
  http://localhost:8317/v8/management/config/api-keys/codex
```

说明：

- `{ "value": 0 }` 这类旧包装不是 v8 的值，验证会失败。
- 未知配置节、旧字段名，以及无法通过配置解析的值都会被拒绝。原文件保持不变。
- 把已脱敏的 JSON ICE 服务器列表写回时，会为 `urls` 相同的条目保留 TURN 的 `username` 和 `credential`。显式空字符串或 `null` 会清除该密钥。YAML 替换不会保留被省略的密钥。
- 写入会原地更新现有配置文件，因此 Docker 的单文件挂载会保持同一个 inode。
- 可以修改 `management.secret-key` 或 `management.allow-remote`。如果密钥为空且没有备用密码，后续管理请求会返回 404。

### 删除配置字段

- `DELETE /config/<path>` 删除该字段，并修剪因此变空的映射祖先。
- `DELETE /config` 会被拒绝。

```bash
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/config/requests/proxy-url
```

## 服务器

### 最新版本

- `GET /server/latest-version`：最新的 GitHub release 标签。不会下载发布资产。

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/server/latest-version
```

```json
{ "latest-version": "v1.2.3" }
```

查询使用 `https://api.github.com/repos/router-for-me/CLIProxyAPI/releases/latest`，`User-Agent` 为 `CLIProxyAPI`。如果配置了 `requests.proxy-url`，请求会走该代理。

## 请求

### 带凭据的上游调用

- `POST /requests/api-call`：发送一个出站 HTTP 请求，可以选择使用已保存的凭据。

```bash
curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"auth_index":"a1b2","method":"GET","url":"https://api.example.com/v1/ping","header":{"Authorization":"Bearer $TOKEN$"}}' \
  http://localhost:8317/v8/management/requests/api-call
```

```json
{ "status_code": 200, "header": { "Content-Type": ["application/json"] }, "body": "{\"ok\":true}" }
```

说明：

- 必填字段是 `method` 和绝对 `url`。可选字段是字符串映射 `header`、原始字符串 `data` 和 `proxy_url`。
- `auth_index` 也接受 `authIndex` 或 `AuthIndex`。
- 请求头中的 `$TOKEN$` 会替换为所选凭据的 access token 或 API key。
- 凭据代理优先于请求中的 `proxy_url` 和全局代理。响应在 `status_code` 中保留上游状态码。
- 此接口可以使用已保存凭据调用任意 URL。请保护管理密钥。

## 路由

### 重置冷却

- `POST /routing/cooldown/reset`：清除一个凭据的配额和冷却状态。

```bash
curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"auth_index":"a1b2"}' \
  http://localhost:8317/v8/management/routing/cooldown/reset
```

```json
{ "status": "ok", "auth_index": "a1b2", "models": ["gpt-5.4"] }
```

未知的 `auth_index` 返回 `404` 和 `{ "error": "auth not found" }`。

### 静态模型定义

- `GET /routing/model-definitions/:channel`：一个渠道的静态目录元数据。

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/routing/model-definitions/codex
```

响应为 `{ "channel": "codex", "models": [ ... ] }`。

未知渠道返回 `400` 和 `{ "error": "unknown channel", "channel": "..." }`。

## 可观测性

### 应用日志

- `GET /observability/logs`：读取日志行。
- `DELETE /observability/logs`：删除滚动日志并截断当前日志。

`GET` 的查询参数：

- `after`：Unix 时间戳，只返回更新的行。
- `limit`：最大行数。有 `limit` 且没有 `after` 时返回最新的行。
- `cursor`：上一次响应中的不透明 `next-cursor`。

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  'http://localhost:8317/v8/management/observability/logs?limit=2'
```

```json
{
  "lines": ["2026-05-05 12:00:00 info request accepted"],
  "line-count": 1,
  "latest-timestamp": 1777982400,
  "next-cursor": "<OPAQUE_CURSOR>"
}
```

说明：

- 必须通过 `observability.logs.logging-to-file` 启用文件日志。否则返回 `400` 和 `{ "error": "logging to file disabled" }`。
- 日志文件尚不存在时，返回空的 `lines` 和 `line-count: 0`。
- 把 `next-cursor` 作为下一次的 `cursor`。游标重置时响应包含 `"cursor-reset": true`。
- `DELETE` 返回 `{ "success": true, "message": "Logs cleared successfully", "removed": 3 }`。

### 请求错误日志

- `GET /observability/logs/errors`：列出 `error-*.log` 文件。
- `GET /observability/logs/errors/:name`：下载一个错误日志。
- `GET /observability/logs/requests/:id`：下载文件名以 `-<id>.log` 结尾的请求日志。

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/observability/logs/errors
```

```json
{ "files": [{ "name": "error-2026-05-05.log", "size": 12345, "modified": 1777982400 }] }
```

说明：

- 启用请求日志时，错误日志列表为空。
- `:name` 必须是已存在的 `error-*.log` 文件名，且不能包含路径分隔符。
- `:id` 不能包含路径分隔符。

### 用量

- `GET /observability/usage/queue?count=10`：弹出最多 `count` 条用量记录。`count` 默认为 `1`，且必须是正整数。记录会从内存队列中移除。空队列返回 `[]`。
- `GET /observability/usage/api-keys`：API key 凭据的内存成功和失败统计，按提供商分组，键为 `base_url|api_key`。

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  'http://localhost:8317/v8/management/observability/usage/queue?count=10'
```

本地 Redis RESP 用量输出已禁用。期望收到记录前，请先启用 `observability.usage.usage-statistics-enabled`。

## 凭据

这些路由管理 `oauth.auth-dir` 下的文件和运行时状态。它们不编辑 `api-keys` 分组；分组请使用配置路由。

### 列出、上传和删除

- `GET /credentials`：列出凭据文件和运行时记录。
- `POST /credentials`：上传一个 `.json` 凭据。可以使用 multipart 字段 `file`，或在原始 JSON 请求体上加 `?name=<file.json>`。
- `DELETE /credentials?name=<file.json>`：删除一个磁盘凭据，并在运行时禁用它。
- `DELETE /credentials?all=true`：删除所有磁盘上的 `.json` 凭据。响应为 `{ "status": "ok", "deleted": 3 }`。
- `GET /credentials/download?name=<file.json>`：下载一个磁盘凭据。
- `GET /credentials/models?name=<file-or-id>`：一个凭据的模型定义，响应为 `{ "models": [ ... ] }`。

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/credentials
```

```json
{
  "files": [
    {
      "id": "claude-user@example.com",
      "auth_index": "a1b2c3d4e5f67890",
      "name": "claude-user@example.com.json",
      "provider": "claude",
      "status": "ready",
      "disabled": false,
      "unavailable": false,
      "runtime_only": false,
      "source": "file"
    }
  ]
}
```

说明：

- 条目按 `name` 排序。`runtime_only: true` 表示凭据只存在于内存中；这类条目不能在这里下载或删除。
- 上传需要核心 auth manager。不可用时返回 `503` 和 `{ "error": "core auth manager unavailable" }`。
- 上传文件名必须以 `.json` 结尾。成功后会立即注册，并返回 `{ "status": "ok" }`。

### 状态、字段和刷新

- `PATCH /credentials/status`：`{ "name": "<file-or-id>", "disabled": true }`。API key 记录通过其排除模型配置禁用。插件虚拟子凭据不能单独修改。
- `PATCH /credentials/fields`：`{ "name": "<file-or-id>", ...fields }`。点路径更新嵌套元数据，例如 `headers.X-Team`。`headers` 对象会与现有请求头合并；空值会删除该请求头。
- `POST /credentials/refresh`：刷新文件型 OAuth 凭据。

```bash
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"name":"codex-user.json","disabled":true}' \
  http://localhost:8317/v8/management/credentials/status
```

### 配额

- `GET /credentials/quota/providers`：已注册的配额提供方。响应为 `{ "providers": [ ... ] }`。
- `POST /credentials/quota/fetch`：获取一个凭据的配额。
- `POST /credentials/quota/reset`：通过其提供方重置一个凭据的配额。

```bash
curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"auth_index":"a1b2","provider":"codex"}' \
  http://localhost:8317/v8/management/credentials/quota/fetch
```

`auth_index` 必填，也接受 `authIndex` 或 `AuthIndex`。可选的 `plugin_id` 用于选择一个插件提供方；可选的 `provider` 会覆盖凭据提供商。没有可用提供方时返回 `501`。获取和重置失败返回 `502`。

## OAuth

### 开始登录

- `GET /oauth/auth-url?provider=<provider>`：启动提供商登录并返回浏览器 URL。

提供商：`claude`、`codex`、`antigravity`、`kimi`、`kimi-ai`、`xai`、`devin`、`meta`，以及插件注册的 OAuth 提供商。

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  'http://localhost:8317/v8/management/oauth/auth-url?provider=claude&is_webui=true'
```

```json
{ "status": "ok", "url": "https://...", "state": "anth-1716206400" }
```

说明：

- 缺少 `provider` 时返回 `400` 和 `{ "error": "provider is required" }`。未知提供商返回 `404` 和 `{ "error": "provider_not_found" }`，除非有插件处理它。
- `is_webui=true` 会为支持它的提供商复用管理界面的回调转发器。
- 设备码提供商还可能返回 `flow`、`user_code` 和 `expires_in`。

### 轮询和取消

- `GET /oauth/status?state=<state>`：等待中为 `wait`，成功后为 `ok`，失败时为 `error` 并带有 `error` 字符串。完成状态会短暂保留，便于客户端观察到 `ok`。
- `DELETE /oauth/session?state=<state>`：取消等待中的会话。响应为 `{ "status": "ok", "cancelled": true }`。已取消的流程不会保存凭据。

### 导入

- `POST /oauth/import?provider=vertex`：导入 Google 服务账号 JSON 文件。当前支持的提供商是 `vertex`。

```bash
curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -F 'file=@/path/to/service-account.json' \
  -F 'location=us-central1' \
  'http://localhost:8317/v8/management/oauth/import?provider=vertex'
```

```json
{
  "status": "ok",
  "auth-file": "/abs/path/auths/vertex-my-project.json",
  "project_id": "my-project",
  "email": "svc@my-project.iam.gserviceaccount.com",
  "location": "us-central1"
}
```

上传使用 `multipart/form-data` 的 `file` 字段。`location` 可选，默认是 `us-central1`。

### 回调

`GET /oauth/callback` 和 `POST /oauth/callback` 不经过管理密钥中间件。它们只接受提供商与待处理会话匹配的回调。

- `GET` 读取 `provider`、`state`、`code`，以及 `error` 或 `error_description`。
- `POST` 接受 `{ "provider", "redirect_url", "code", "state", "error" }`。`redirect_url` 可以携带回调查询参数。

```bash
curl 'http://localhost:8317/v8/management/oauth/callback?provider=codex&state=codex-...&code=AUTHORIZATION_CODE'
```

```json
{ "status": "ok" }
```

## 插件

插件启用状态和插件自有设置属于配置，不是独立路由：

- `GET /config/plugins` 读取插件配置节。
- `PUT` 或 `PATCH /config/plugins/configs/<plugin-id>` 替换或合并一个插件对象。
- `PUT /config/plugins/configs/<plugin-id>/enabled` 的请求体为 `true` 或 `false` 时只修改该开关。它不会改变 `plugins.enabled`。

### 发现和商店

- `GET /plugins`：已发现、已配置和已注册的插件，包括 `plugins_enabled`、`plugins_dir`，以及每个插件的 id、路径、启用状态、元数据、配置字段和菜单。
- `DELETE /plugins/:id`：删除本地插件文件及其已保存配置。无法卸载的插件返回 `409`，并可能设置 `restart_required: true`。
- `GET /plugins/store`：商店目录、源错误、安装状态和可用更新。
- `POST /plugins/store/:id/install`：下载或更新一个插件并启用它。ID 冲突时使用 `?source=<source-id>`。`version` 可以是查询参数，也可以是 `{ "version": "1.2.3" }`。

```bash
curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"version":"1.2.3"}' \
  'http://localhost:8317/v8/management/plugins/store/example-plugin/install?source=official'
```

```json
{
  "status": "installed",
  "source_id": "official",
  "id": "example-plugin",
  "version": "1.2.3",
  "path": "/abs/path/plugins/example-plugin.so",
  "restart_required": false
}
```

商店安装可以下载可执行产物。启用前请确认商店来源可信。

### 插件配额

- `GET /plugins/:id/quota?auth_index=<auth-index>`
- `POST /plugins/:id/quota`，请求体为 `{ "auth_index": "<auth-index>" }`
- `DELETE /plugins/:id/quota?auth_index=<auth-index>`

也接受别名 `authIndex`。找不到配额提供方时返回 `404`。提供方失败返回 `502`。v8 不注册旧的 `/quota/reset` 别名。

## 错误响应

配置和运维处理器使用各自的错误字符串。常见结果如下：

- `400`：`{ "error": "invalid_json" }`、`{ "error": "invalid_body" }`、`{ "error": "invalid_path" }`、`{ "error": "config_must_be_object" }`、`{ "error": "cannot_delete_config" }`，或 `{ "error": "invalid_config", "message": "..." }`
- `400`：`{ "error": "read_only_field", "field": "plugins/auth-revision" }`
- `401`：`{ "error": "missing management key" }` 或 `{ "error": "invalid management key" }`
- `403`：`{ "error": "remote management disabled" }`
- `404`：`{ "error": "not_found" }`、`{ "error": "provider_not_found" }` 或 `{ "error": "auth not found" }`
- `409`：插件无法卸载或需要重启
- `422`：文档可以解析但配置验证失败时返回 `{ "error": "invalid_config", "message": "..." }`
- `500`：`{ "error": "write_failed", "message": "..." }` 或 `{ "error": "read_failed" }`
- `501`：没有可用的配额提供方
- `502`：配额提供方失败
- `503`：`{ "error": "core auth manager unavailable" }`

管理密钥为空且没有备用密码时，这些处理器运行前就会返回 `404`。

## 说明

- 新客户端只应发送 v8 路径。文件迁移后，旧的 `/v0/management` 更新仍会修改有效值，但它不是新开发的契约。
- `quota-exceeded.switch-project` 和 `quota-exceeded.switch-preview-model` 没有 v8 名称。不要添加依赖它们的功能。
- `oauth.providers` 下的 OAuth 提供商设置不作用于 `api-keys` 分组。这些凭据应使用上游 API key 文档中的分组和 key 字段。
