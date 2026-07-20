---
outline: 'deep'
---

# 管理 API

基础路径：`http://localhost:8317/v0/management`

该 API 用于管理 CLIProxyAPI 的运行时配置与认证文件。所有变更会持久化写入 YAML 配置文件，并由服务自动热重载。

注意：以下选项不能通过 API 修改，需在配置文件中设置（如有必要可重启）：
- `remote-management.allow-remote`
- `remote-management.secret-key`（若在启动时检测到明文，会自动进行 bcrypt 加密并写回配置）

## 认证

- 所有请求（包括本地访问）都必须提供有效的管理密钥.
- 远程访问需要在配置文件中开启远程访问： `remote-management.allow-remote: true`
- 通过以下任意方式提供管理密钥（明文）：
    - `Authorization: Bearer <plaintext-key>`
    - `X-Management-Key: <plaintext-key>`

若在启动时检测到配置中的管理密钥为明文，会自动使用 bcrypt 加密并回写到配置文件中。

其它说明：
- 设置环境变量 `MANAGEMENT_PASSWORD` 会将其视为额外的明文管理密钥，并强制启用远程管理（即便 `remote-management.allow-remote` 为 false）。该值不会写入配置，需要通过 `Authorization` / `X-Management-Key` 头部直接发送。
- 通过 `cliproxy run --password <pwd>` 或 SDK 的 `WithLocalManagementPassword` 启动服务后，来自 `127.0.0.1`/`::1` 的请求可使用该“本地密码”替代远程密钥，同样通过上述头部传递；该密码仅存在于运行时内存。
- 仅当 `remote-management.secret-key` 为空、未设置 `MANAGEMENT_PASSWORD` 且启动时未配置本地管理密码时，管理 API 路由才不会注册（所有 `/v0/management` 路由均返回 404）。
- 对于任意客户端 IP（包括 localhost），连续 5 次认证失败会触发临时封禁（约 30 分钟）。

## 请求/响应约定

- Content-Type：`application/json`（除非另有说明）。
- 布尔/整数/字符串更新：请求体为 `{ "value": <type> }`。
- 数组 PUT：既可使用原始数组（如 `["a","b"]`），也可使用 `{ "items": [ ... ] }`。
- 数组 PATCH：支持 `{ "old": "k1", "new": "k2" }` 或 `{ "index": 0, "value": "k2" }`。
- 对象数组 PATCH：支持按索引或按关键字段匹配（各端点中单独说明）。

## 端点说明

### 用量统计队列
- 旧的内存聚合 usage 端点（`/usage`、`/usage/export`、`/usage/import`）已移除。如需读取每次请求的队列记录，请使用 `GET /usage-queue`。
- 如需以 JSON 拉取每次请求的用量记录，请使用同端口暴露的 [Redis 用量队列](./redis-usage-queue)（RESP）。
- 通过 `/usage-statistics-enabled` 开启/关闭用量发布。

- GET `/usage-queue?count=10` — 从队列中弹出最多 `count` 条用量记录
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        'http://localhost:8317/v0/management/usage-queue?count=10'
      ```
    - 响应：
      ```json
      [
        {
          "timestamp": "2026-05-05T12:00:00Z",
          "latency_ms": 1234,
          "source": "user@example.com",
          "auth_index": "0",
          "tokens": {
            "input_tokens": 10,
            "output_tokens": 20,
            "reasoning_tokens": 0,
            "cached_tokens": 0,
            "total_tokens": 30
          },
          "failed": false,
          "provider": "openai",
          "model": "gpt-5.4",
          "alias": "gpt-5.4",
          "endpoint": "POST /v1/chat/completions",
          "auth_type": "api_key",
          "api_key": "sk-...",
          "request_id": "req_..."
        }
      ]
      ```
    - 说明：
        - `count` 可选，默认值为 `1`，且必须为正整数。
        - 响应始终是数组，包括 `count=1`；队列为空时返回 `[]`。
        - 通过该接口返回的记录会从队列中移除。
        - Redis 兼容用量队列读取的是同一个队列；`LPOP` 和 `RPOP` 也会移除返回的记录。

### Config
- GET `/config` — 获取完整的配置
    - 请求:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/config
      ```
    - 响应:
      ```json
      {"debug":true,"proxy-url":"","api-keys":["1...5","JS...W"],"quota-exceeded":{"switch-project":true,"switch-preview-model":true},"gemini-api-key":[{"api-key":"AI...01","base-url":"https://generativelanguage.googleapis.com","headers":{"X-Custom-Header":"custom-value"},"proxy-url":"","excluded-models":["gemini-1.5-pro","gemini-1.5-flash"]},{"api-key":"AI...02","proxy-url":"socks5://proxy.example.com:1080","excluded-models":["gemini-pro-vision"]}],"request-log":true,"request-retry":3,"claude-api-key":[{"api-key":"cr...56","base-url":"https://example.com/api","proxy-url":"socks5://proxy.example.com:1080","models":[{"name":"claude-3-5-sonnet-20241022","alias":"claude-sonnet-latest"}],"excluded-models":["claude-3-opus"]},{"api-key":"cr...e3","base-url":"http://example.com:3000/api","proxy-url":""},{"api-key":"sk-...q2","base-url":"https://example.com","proxy-url":""}],"codex-api-key":[{"api-key":"sk...01","base-url":"https://example/v1","proxy-url":"","excluded-models":["gpt-4o-mini"]}],"openai-compatibility":[{"name":"openrouter","base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk...01","proxy-url":""}],"models":[{"name":"moonshotai/kimi-k2:free","alias":"kimi-k2"}]}]}
      ```
    - 说明：
        - 返回内容反映当前已加载的运行时配置。
        - 若服务尚未加载配置文件，则返回空对象 `{}`。

### 最新版本
- GET `/latest-version` — 查询最新发行版本号（仅返回版本字符串，不下载资源）
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/latest-version
      ```
    - 响应：
      ```json
      { "latest-version": "v1.2.3" }
      ```
    - 说明：
        - 版本信息来源 `https://api.github.com/repos/router-for-me/CLIProxyAPI/releases/latest`，请求头使用 `User-Agent: CLIProxyAPI`。
        - 若配置了 `proxy-url`，查询会复用该代理；仅返回版本号，不会下载发布资产。

### Debug
- GET `/debug` — 获取当前 debug 状态
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/debug
      ```
    - 响应：
      ```json
      { "debug": false }
      ```
- PUT/PATCH `/debug` — 设置 debug（布尔值）
    - 请求：
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":true}' \
        http://localhost:8317/v0/management/debug
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```

### Config YAML
- GET `/config.yaml` — 原样下载持久化的 YAML 配置
    - 响应头：
        - `Content-Type: application/yaml; charset=utf-8`
        - `Cache-Control: no-store`
    - 响应体：保留注释与格式的原始 YAML 流。
- PUT `/config.yaml` — 使用 YAML 文档整体替换配置
    - 请求：
      ```bash
      curl -X PUT -H 'Content-Type: application/yaml' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        --data-binary @config.yaml \
        http://localhost:8317/v0/management/config.yaml
      ```
    - 响应：
      ```json
      { "ok": true, "changed": ["config"] }
      ```
    - 说明：
        - YAML 格式错误返回 `400` 以及 `{ "error": "invalid_yaml", "message": "..." }`；YAML 可解析但配置校验失败时返回 `422` 以及 `{ "error": "invalid_config", "message": "..." }`。
        - 写入失败会返回 `500`，格式 `{ "error": "write_failed", "message": "..." }`。

### 文件日志开关
- GET `/logging-to-file` — 查看是否启用文件日志
    - 响应：
      ```json
      { "logging-to-file": true }
      ```
- PUT/PATCH `/logging-to-file` — 开启或关闭文件日志
    - 请求：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":false}' \
        http://localhost:8317/v0/management/logging-to-file
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```

### 日志文件
- GET `/logs` — 获取合并后的最新日志行
    - 查询参数：
        - `after`（可选）：Unix 时间戳，仅返回该时间之后的日志。
    - 响应：
      ```json
      {
        "lines": ["2024-05-20 12:00:00 info request accepted"],
        "line-count": 125,
        "latest-timestamp": 1716206400
      }
      ```
    - 说明：
        - 需要先启用文件日志，否则会以 `400` 返回 `{ "error": "logging to file disabled" }`。
        - 若当前没有日志文件，返回的 `lines` 为空数组、`line-count` 为 `0`。
        - `latest-timestamp` 是本轮扫描到的最大时间戳；若日志无时间戳，则返回输入的 `after`（或 `0`），可直接作为下一次轮询的 `after`。
        - `line-count` 为本轮遍历的行总数，包含被 `after` 过滤掉的旧日志，可帮助判断日志是否有新增。
- DELETE `/logs` — 删除轮换日志并清空主日志
    - 响应：
      ```json
      { "success": true, "message": "Logs cleared successfully", "removed": 3 }
      ```

### 请求错误日志
- GET `/request-error-logs` — 在关闭请求日志时列出错误请求日志文件
    - 响应：
      ```json
      {
        "files": [
          {
            "name": "error-2024-05-20.log",
            "size": 12345,
            "modified": 1716206400
          }
        ]
      }
      ```
    - 说明：
        - 当 `request-log` 为 `true` 时，该接口始终返回空列表。
        - 文件来自同一日志目录，文件名必须以 `error-` 开头并以 `.log` 结尾。
        - `modified` 为最后修改时间的 Unix 时间戳。
- GET `/request-error-logs/:name` — 下载指定错误请求日志文件
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -OJ 'http://localhost:8317/v0/management/request-error-logs/error-2024-05-20.log'
      ```
    - 说明：
        - `name` 必须是安全文件名（不能包含 `/` 或 `\`），且必须与现有的 `error-*.log` 条目匹配，否则会返回校验错误或未找到错误。
        - 处理函数会在发送文件前校验解析后的完整路径，确保其仍位于日志目录之内。

### Usage 统计开关
- GET `/usage-statistics-enabled` — 查看是否启用请求统计
    - 响应：
      ```json
      { "usage-statistics-enabled": true }
      ```
- PUT/PATCH `/usage-statistics-enabled` — 启用或关闭统计
    - 请求：
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":true}' \
        http://localhost:8317/v0/management/usage-statistics-enabled
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```

### 代理服务器 URL
- GET `/proxy-url` — 获取代理 URL 字符串
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/proxy-url
      ```
    - 响应：
      ```json
      { "proxy-url": "socks5://user:pass@127.0.0.1:1080/" }
      ```
- PUT/PATCH `/proxy-url` — 设置代理 URL 字符串
    - 请求（PUT）：
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":"socks5://user:pass@127.0.0.1:1080/"}' \
        http://localhost:8317/v0/management/proxy-url
      ```
    - 请求（PATCH）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":"http://127.0.0.1:8080"}' \
        http://localhost:8317/v0/management/proxy-url
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
- DELETE `/proxy-url` — 清空代理 URL
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE http://localhost:8317/v0/management/proxy-url
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```

### 超出配额行为
- GET `/quota-exceeded/switch-project`
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/quota-exceeded/switch-project
      ```
    - 响应：
      ```json
      { "switch-project": true }
      ```
- PUT/PATCH `/quota-exceeded/switch-project` — 布尔值
    - 请求：
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":false}' \
        http://localhost:8317/v0/management/quota-exceeded/switch-project
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
- GET `/quota-exceeded/switch-preview-model`
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/quota-exceeded/switch-preview-model
      ```
    - 响应：
      ```json
      { "switch-preview-model": true }
      ```
- PUT/PATCH `/quota-exceeded/switch-preview-model` — 布尔值
    - 请求：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":true}' \
        http://localhost:8317/v0/management/quota-exceeded/switch-preview-model
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
- POST `/reset-quota` — 清除指定凭据的配额/cooldown 路由状态
    - 请求：
      ```bash
      curl -X POST -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"auth_index":"<AUTH_INDEX>"}' \
        http://localhost:8317/v0/management/reset-quota
      ```
    - 响应：
      ```json
      {
        "status": "ok",
        "auth_index": "<AUTH_INDEX>",
        "models": ["gpt-5"]
      }
      ```
    - 说明：
        - `auth_index` 是 `GET /auth-files` 返回的稳定运行时凭据标识。
        - 该接口不接受认证文件名或 auth ID。
        - 调用后会清除运行时 quota/cooldown 状态，并立即恢复该凭据参与路由。

### API Keys（代理服务认证）
这些接口会更新配置中 `auth.providers` 内置的 `config-api-key` 提供方，旧版顶层 `api-keys` 会自动保持同步。
- GET `/api-keys` — 返回完整列表
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/api-keys
      ```
    - 响应：
      ```json
      { "api-keys": ["k1","k2","k3"] }
      ```
- PUT `/api-keys` — 完整改写列表
    - 请求：
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '["k1","k2","k3"]' \
        http://localhost:8317/v0/management/api-keys
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
- PATCH `/api-keys` — 修改其中一个（`old/new` 或 `index/value`）
    - 请求（按 old/new）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"old":"k2","new":"k2b"}' \
        http://localhost:8317/v0/management/api-keys
      ```
    - 请求（按 index/value）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"index":0,"value":"k1b"}' \
        http://localhost:8317/v0/management/api-keys
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
- DELETE `/api-keys` — 删除其中一个（`?value=` 或 `?index=`）
    - 请求（按值删除）：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/api-keys?value=k1'
      ```
    - 请求（按索引删除）：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/api-keys?index=0'
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```

- GET `/api-key-usage` — 按 provider 与 API key 分组的近期请求桶
    - 响应：
      ```json
      {
        "openai": {
          "https://openrouter.ai/api/v1|k1": {
            "success": 12,
            "failed": 1,
            "recent_requests": [
              { "time": "12:00-12:10", "success": 3, "failed": 0 },
              { "time": "12:10-12:20", "success": 1, "failed": 1 }
            ]
          }
        }
      }
      ```
    - 说明：
        - 顶层 key 为 provider 名称。
        - 二级 key 为 `base_url|api_key`（base URL 可能为空，例如 `|k1`）。
        - `recent_requests` 为固定长度 20 个 bucket（每个 bucket 10 分钟，使用本地时间标签 `HH:MM-HH:MM`）。

### Gemini API Key
- GET `/gemini-api-key`
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/gemini-api-key
      ```
    - 响应：
      ```json
      {
        "gemini-api-key": [
          {"api-key":"AIzaSy...01","auth-index":"a1b2c3d4e5f67890","base-url":"https://generativelanguage.googleapis.com","headers":{"X-Custom-Header":"custom-value"},"proxy-url":"","excluded-models":["gemini-1.5-pro","gemini-1.5-flash"]},
          {"api-key":"AIzaSy...02","auth-index":"b1c2d3e4f5a67890","proxy-url":"socks5://proxy.example.com:1080","excluded-models":["gemini-pro-vision"]}
        ]
      }
      ```
- PUT `/gemini-api-key`
    - 请求（数组形式）：
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '[{"api-key":"AIzaSy-1","headers":{"X-Custom-Header":"vendor-value"},"excluded-models":["gemini-1.5-flash"]},{"api-key":"AIzaSy-2","base-url":"https://custom.example.com","excluded-models":["gemini-pro-vision"]}]' \
        http://localhost:8317/v0/management/gemini-api-key
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
- PATCH `/gemini-api-key`
    - 请求（按索引更新）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"index":0,"value":{"api-key":"AIzaSy-1","base-url":"https://custom.example.com","headers":{"X-Custom-Header":"custom-value"},"proxy-url":"","excluded-models":["gemini-1.5-pro","gemini-pro-vision"]}}' \
        http://localhost:8317/v0/management/gemini-api-key
      ```
    - 请求（按 api-key 匹配更新）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"match":"AIzaSy-1","value":{"api-key":"AIzaSy-1","headers":{"X-Custom-Header":"custom-value"},"proxy-url":"socks5://proxy.example.com:1080","excluded-models":["gemini-1.5-pro-latest"]}}' \
        http://localhost:8317/v0/management/gemini-api-key
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
- DELETE `/gemini-api-key`
    - 请求（按 api-key 删除）：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE \
        'http://localhost:8317/v0/management/gemini-api-key?api-key=AIzaSy-1'
      ```
    - 请求（按索引删除）：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE \
        'http://localhost:8317/v0/management/gemini-api-key?index=0'
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
    - 说明：
        - `excluded-models` 为可选字段，服务端会先转小写、去除首尾空白、去重并忽略空字符串后再保存。

### Codex API KEY（对象数组）
- GET `/codex-api-key` — 列出全部
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/codex-api-key
      ```
    - 响应：
      ```json
      { "codex-api-key": [ { "api-key": "sk-a", "base-url": "https://codex.example.com/v1", "proxy-url": "socks5://proxy.example.com:1080", "headers": { "X-Team": "cli" }, "excluded-models": ["gpt-4o-mini"] } ] }
      ```
- PUT `/codex-api-key` — 完整改写列表
    - 请求：
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '[{"api-key":"sk-a","base-url":"https://codex.example.com/v1","proxy-url":"socks5://proxy.example.com:1080","headers":{"X-Team":"cli"},"excluded-models":["gpt-4o-mini","gpt-4.1-mini"]},{"api-key":"sk-b","base-url":"https://custom.example.com","proxy-url":"","headers":{"X-Env":"prod"},"excluded-models":["gpt-3.5-turbo"]}]' \
        http://localhost:8317/v0/management/codex-api-key
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
- PATCH `/codex-api-key` — 修改其中一个（按 `index` 或 `match`）
    - 请求（按索引）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"index":1,"value":{"api-key":"sk-b2","base-url":"https://c.example.com","proxy-url":"","headers":{"X-Env":"stage"},"excluded-models":["gpt-3.5-turbo-instruct"]}}' \
        http://localhost:8317/v0/management/codex-api-key
      ```
    - 请求（按匹配）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"match":"sk-a","value":{"api-key":"sk-a","base-url":"https://codex.example.com/v1","proxy-url":"socks5://proxy.example.com:1080","headers":{"X-Team":"cli"},"excluded-models":["gpt-4o-mini","gpt-4.1"]}}' \
        http://localhost:8317/v0/management/codex-api-key
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
- DELETE `/codex-api-key` — 删除其中一个（`?api-key=` 或 `?index=`）
    - 请求（按 api-key）：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/codex-api-key?api-key=sk-b2'
      ```
    - 请求（按索引）：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/codex-api-key?index=0'
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
    - 说明：
        - `base-url` 必填；若 PUT/PATCH 中将 `base-url` 留空，则该条目会被视为删除。
        - `headers` 支持自定义请求头，服务端会自动去除空白键值对。
        - `excluded-models` 可用于屏蔽该提供商下的指定模型，服务端会先转小写、去除首尾空白、去重并忽略空字符串。

### 请求重试次数
- GET `/request-retry` — 获取整数
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/request-retry
      ```
    - 响应：
      ```json
      { "request-retry": 3 }
      ```
- PUT/PATCH `/request-retry` — 设置整数
    - 请求：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":5}' \
        http://localhost:8317/v0/management/request-retry
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```

### 最大重试间隔
- GET `/max-retry-interval` — 获取最大重试间隔（秒）
    - 请求：
      ```bash
      curl -H 'Authorization: BearER <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/max-retry-interval
      ```
    - 响应：
      ```json
      { "max-retry-interval": 30 }
      ```
- PUT/PATCH `/max-retry-interval` — 设置最大重试间隔（秒）
    - 请求：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: BearER <MANAGEMENT_KEY>' \
        -d '{"value":60}' \
        http://localhost:8317/v0/management/max-retry-interval
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```

### 请求日志开关
- GET `/request-log` — 获取布尔值
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/request-log
      ```
    - 响应：
      ```json
      { "request-log": false }
      ```
- PUT/PATCH `/request-log` — 设置布尔值
    - 请求：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":true}' \
        http://localhost:8317/v0/management/request-log
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```

### WebSocket 鉴权（`ws-auth`）
- GET `/ws-auth` — 查看 WebSocket 网关是否启用鉴权
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/ws-auth
      ```
    - 响应：
      ```json
      { "ws-auth": true }
      ```
- PUT/PATCH `/ws-auth` — 切换 `/ws/*` 路由是否强制鉴权
    - 请求：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":false}' \
        http://localhost:8317/v0/management/ws-auth
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
    - 说明：
        - 当从 `false` 切换为 `true` 时，服务会主动断开所有现有的 WebSocket 连接，确保重连时必须携带有效的 API 凭据。
        - 关闭鉴权不会影响已建立的连接，但新的连接会跳过鉴权流程，直到再次开启。

### Claude API KEY（对象数组）
- GET `/claude-api-key` — 列出全部
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/claude-api-key
      ```
    - 响应：
      ```json
      { "claude-api-key": [ { "api-key": "sk-a", "base-url": "https://example.com/api", "proxy-url": "socks5://proxy.example.com:1080", "headers": { "X-Workspace": "team-a" }, "excluded-models": ["claude-3-opus"] } ] }
      ```
- PUT `/claude-api-key` — 完整改写列表
    - 请求：
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '[{"api-key":"sk-a","proxy-url":"socks5://proxy.example.com:1080","headers":{"X-Workspace":"team-a"},"excluded-models":["claude-3-opus"]},{"api-key":"sk-b","base-url":"https://c.example.com","proxy-url":"","headers":{"X-Env":"prod"},"excluded-models":["claude-3-sonnet","claude-3-5-haiku"]}]' \
        http://localhost:8317/v0/management/claude-api-key
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
- PATCH `/claude-api-key` — 修改其中一个（按 `index` 或 `match`）
    - 请求（按索引）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
          -d '{"index":1,"value":{"api-key":"sk-b2","base-url":"https://c.example.com","proxy-url":"","headers":{"X-Env":"stage"},"excluded-models":["claude-3.7-sonnet"]}}' \
          http://localhost:8317/v0/management/claude-api-key
        ```
    - 请求（按匹配）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
          -d '{"match":"sk-a","value":{"api-key":"sk-a","base-url":"","proxy-url":"socks5://proxy.example.com:1080","headers":{"X-Workspace":"team-a"},"excluded-models":["claude-3-opus","claude-3.5-sonnet"]}}' \
          http://localhost:8317/v0/management/claude-api-key
        ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
- DELETE `/claude-api-key` — 删除其中一个（`?api-key=` 或 `?index=`）
    - 请求（按 api-key）：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/claude-api-key?api-key=sk-b2'
      ```
    - 请求（按索引）：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/claude-api-key?index=0'
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
    - 说明：
        - `headers` 为可选的键值对，服务端会自动去除空白键/值；若需要移除某个头，在请求中省略该字段即可。
        - `excluded-models` 可用于屏蔽对应 Claude 模型，服务端会先转小写、去除首尾空白、去重并忽略空字符串。

### OpenAI 兼容提供商（对象数组）
- GET `/openai-compatibility` — 列出全部
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/openai-compatibility
      ```
    - 响应：
      ```json
      {
        "openai-compatibility": [
          {
            "name": "openrouter",
            "disabled": false,
            "base-url": "https://openrouter.ai/api/v1",
            "api-key-entries": [
              { "api-key": "sk", "proxy-url": "", "auth-index": "a1b2c3d4e5f67890" }
            ],
            "models": [],
            "headers": { "X-Provider": "openrouter" }
          }
        ]
      }
      ```
- PUT `/openai-compatibility` — 完整改写列表
    - 请求：
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '[{"name":"openrouter","base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk","proxy-url":""}],"models":[{"name":"m","alias":"a"}],"headers":{"X-Provider":"openrouter"}}]' \
        http://localhost:8317/v0/management/openai-compatibility
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
- PATCH `/openai-compatibility` — 修改其中一个（按 `index` 或 `name`）
    - 请求（按名称）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"name":"openrouter","value":{"name":"openrouter","disabled":false,"base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk","proxy-url":""}],"models":[],"headers":{"X-Provider":"openrouter"}}}' \
        http://localhost:8317/v0/management/openai-compatibility
      ```
    - 请求（按索引）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"index":0,"value":{"name":"openrouter","disabled":false,"base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk","proxy-url":""}],"models":[],"headers":{"X-Provider":"openrouter"}}}' \
        http://localhost:8317/v0/management/openai-compatibility
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```

    - 说明：
        - 仍可提交遗留的 `api-keys` 字段，但所有密钥会自动迁移到 `api-key-entries` 中，返回结果中的 `api-keys` 会逐步留空。
        - `disabled: true` 可在不删除配置的情况下禁用该提供商（路由/选钥会跳过）。
        - `headers` 可用于为某个兼容提供商统一追加 HTTP 头，服务端会自动去除空白键值。
        - `base-url` 不能为空；若 PUT/PATCH 将 `base-url` 设为空字符串，则该提供商会被删除。
- DELETE `/openai-compatibility` — 删除（`?name=` 或 `?index=`）
    - 请求（按名称）：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/openai-compatibility?name=openrouter'
      ```
    - 请求（按索引）：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/openai-compatibility?index=0'
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```

### OAuth 排除模型
用于为基于 OAuth 的提供商配置需要排除的模型列表。键为提供商标识字符串，值为字符串数组。

- GET `/oauth-excluded-models` — 获取当前映射
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/oauth-excluded-models
      ```
    - 响应：
      ```json
      {
        "oauth-excluded-models": {
          "openai": ["gpt-4.1-mini"],
          "claude": ["claude-3-5-haiku-20241022"]
        }
      }
      ```
- PUT `/oauth-excluded-models` — 完整替换整张映射表
    - 请求：
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"openai":["gpt-4.1-mini"],"claude":["claude-3-5-haiku-20241022"]}' \
        http://localhost:8317/v0/management/oauth-excluded-models
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
    - 说明：
        - 请求体也可以为 `{ "items": { ... } }` 形式；无论哪种形式，空白模型名称都会被自动过滤。
- PATCH `/oauth-excluded-models` — 新增/更新或删除单个提供商条目
    - 请求（新增或更新）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"provider":"claude","models":["claude-3-5-haiku-20241022"]}' \
        http://localhost:8317/v0/management/oauth-excluded-models
      ```
    - 请求（通过空数组删除提供商）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"provider":"claude","models":[]}' \
        http://localhost:8317/v0/management/oauth-excluded-models
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
    - 说明：
        - `provider` 会被标准化为小写。若传入空的 `models` 数组，则表示删除该提供商；如提供商不存在，则返回 `404`。
- DELETE `/oauth-excluded-models` — 删除某个提供商的全部排除模型
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -X DELETE 'http://localhost:8317/v0/management/oauth-excluded-models?provider=claude'
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```

### 认证文件管理

管理 `auth-dir` 下的 JSON 令牌文件：列出、下载、上传、删除。

- GET `/auth-files` — 列表
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/auth-files
      ```
    - 响应（运行时认证管理器可用时）：
      ```json
      {
        "files": [
          {
            "id": "claude-user@example.com",
            "auth_index": "a1b2c3d4e5f67890",
            "name": "claude-user@example.com.json",
            "provider": "claude",
            "label": "Claude Prod",
            "status": "ready",
            "status_message": "ok",
            "disabled": false,
            "unavailable": false,
            "runtime_only": false,
            "source": "file",
            "path": "/abs/path/auths/claude-user@example.com.json",
            "size": 2345,
            "modtime": "2025-08-30T12:34:56Z",
            "success": 12,
            "failed": 1,
            "recent_requests": [
              { "time": "12:00-12:10", "success": 3, "failed": 0 },
              { "time": "12:10-12:20", "success": 1, "failed": 1 }
            ],
            "email": "user@example.com",
            "account_type": "anthropic",
            "account": "workspace-1",
            "created_at": "2025-08-30T12:00:00Z",
            "updated_at": "2025-08-31T01:23:45Z",
            "last_refresh": "2025-08-31T01:23:45Z"
          }
        ]
      }
      ```
    - 说明：
        - 列表对 `name` 做不区分大小写的排序；`status`、`status_message`、`disabled`、`unavailable` 直接反映运行时认证状态，便于识别失效凭据。
        - `runtime_only=true` 表示该凭据仅存在于运行时存储（例如 Git/PG/ObjectStore 或远程导入），`source` 会是 `memory`；若存在对应磁盘文件则 `source=file` 并补充 `path`/`size`/`modtime`。
        - `auth_index` 是凭据的稳定运行时标识（可用于 `/api-call` 等接口）。
        - `success`/`failed` 为累计计数（内存态）。
        - `recent_requests` 为固定长度 20 个 bucket（每个 bucket 10 分钟，使用本地时间标签 `HH:MM-HH:MM`）。
        - `email`、`account_type`、`account`、`last_refresh` 来源于 JSON 内的元数据（自动兼容 `last_refresh`／`lastRefreshedAt` 等字段）。
        - 当核心认证管理器不可用时会退回到扫描 `auth-dir`，此时仅返回 `name`、`size`、`modtime`、`type`、`email` 字段。
        - `runtime_only` 数据无法通过下载/删除端点处理，需要在对应提供商后台或通过其他 API 撤销。

- GET `/auth-files/download?name=<file.json>` — 下载单个文件
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -OJ 'http://localhost:8317/v0/management/auth-files/download?name=acc1.json'
      ```
    - 说明：
        - `name` 必须是 `.json` 文件名，且仅能下载 `source=file` 的条目；`runtime_only` 凭据没有磁盘文件无法导出。

- POST `/auth-files` — 上传
    - 请求（multipart）：
      ```bash
      curl -X POST -F 'file=@/path/to/acc1.json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/auth-files
      ```
    - 请求（原始 JSON）：
      ```bash
      curl -X POST -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d @/path/to/acc1.json \
        'http://localhost:8317/v0/management/auth-files?name=acc1.json'
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
    - 说明：
        - 需确保核心认证管理器已启用，否则会以 `503` 返回 `{ "error": "core auth manager unavailable" }`。
        - multipart 与原始 JSON 两种上传方式都要求文件名以 `.json` 结尾，并会立即注册到运行时认证管理器中。

- DELETE `/auth-files?name=<file.json>` — 删除单个文件
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/auth-files?name=acc1.json'
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
    - 说明：
        - 仅删除磁盘上的 `.json` 文件，并在成功删除后通知运行时管理器禁用对应凭据；`runtime_only` 条目不会被该端点移除。

- DELETE `/auth-files?all=true` — 删除 `auth-dir` 下所有 `.json` 文件
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/auth-files?all=true'
      ```
    - 响应：
      ```json
      { "status": "ok", "deleted": 3 }
      ```
    - 说明：
        - 仅统计并删除磁盘文件，成功后同样会对被移除的凭据执行禁用；对纯内存条目无影响。

### Vertex 凭据导入
等同 CLI `vertex-import`，用于上传 Google 服务账号 JSON，并在 `auth-dir` 下生成 `vertex-<project>.json`。

- POST `/vertex/import` — 上传 Vertex 服务账号密钥
    - 请求（multipart）：
      ```bash
      curl -X POST \
        -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -F 'file=@/path/to/my-project-sa.json' \
        -F 'location=us-central1' \
        http://localhost:8317/v0/management/vertex/import
      ```
    - 响应：
      ```json
      {
        "status": "ok",
        "auth-file": "/abs/path/auths/vertex-my-project.json",
        "project_id": "my-project",
        "email": "svc@my-project.iam.gserviceaccount.com",
        "location": "us-central1"
      }
      ```
    - 说明：
        - 必须使用 `multipart/form-data` 并通过 `file` 字段上传完整的服务账号 JSON。若 JSON 无效或缺少 `project_id`/`private_key` 会返回 `400`。
        - `location` 表单（或查询）字段可选，未提供时保存为 `us-central1`，后续可在生成的文件中手动调整。
        - 服务会自动规范化 `private_key`，写入 `vertex` 标签并通过 token store 持久化；若持久化失败，将以 `500` 返回 `{ "error": "save_failed", ... }`。

### 登录/授权 URL

以下端点用于发起各提供商的登录流程，并返回需要在浏览器中打开的 URL。流程完成后，令牌会保存到 `auths/` 目录。

对于 Anthropic、Codex 与 Antigravity，可附加 `?is_webui=true` 以便从管理界面复用内置回调转发。

- GET `/anthropic-auth-url` — 开始 Anthropic（Claude）登录
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/anthropic-auth-url
      ```
    - 响应：
      ```json
      { "status": "ok", "url": "https://...", "state": "anth-1716206400" }
      ```
    - 说明：
        - 若从 Web UI 触发，可添加 `?is_webui=true` 复用本地回调服务。

- GET `/codex-auth-url` — 开始 Codex 登录
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/codex-auth-url
      ```
    - 响应：
      ```json
      { "status": "ok", "url": "https://...", "state": "codex-1716206400" }
      ```

- GET `/antigravity-auth-url` — 开始 Antigravity 登录
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/antigravity-auth-url
      ```
    - 响应：
      ```json
      { "status": "ok", "url": "https://...", "state": "ant-1716206400" }
      ```
    - 说明：
        - 若从 Web UI 触发，可添加 `?is_webui=true`，服务会在本地 `51121` 端口启动临时回调转发器，并复用主 HTTP 端口接收最终重定向。

- GET `/get-auth-status?state=<state>` — 轮询 OAuth 流程状态
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        'http://localhost:8317/v0/management/get-auth-status?state=<STATE_FROM_AUTH_URL>'
      ```
    - 响应示例：
      ```json
      { "status": "wait" }
      ```
      
      ```json
      { "status": "ok" }
      ```
      
      ```json
      { "status": "error", "error": "Authentication failed" }
      ```
    - 说明：
        - `state` 参数必须与登录端点返回的值一致；若状态进入 `ok` 或 `error`，服务会清除该 state，再次轮询会收到 `{ "status": "ok" }` 表示流程已收尾。
        - `status: "wait"` 表示仍在等待回调或令牌交换，可按需继续轮询。

### 插件

- GET `/plugins` — 列出已发现、已配置和已注册的插件。响应包含全局 `plugins_enabled`、解析后的 `plugins_dir`，以及每个插件的 `id`、`path`、`configured`、`registered`、`enabled`、`effective_enabled`、OAuth 支持、元数据、配置字段和菜单等状态。
- GET `/plugins/:id/config` — 返回保存的 `plugins.configs.<id>` 对象；已发现或已注册但未保存配置的插件返回 `{}`。
- PUT `/plugins/:id/config` — 完整替换插件配置对象。
- PATCH `/plugins/:id/config` — 浅合并配置对象。将字段设为 `null` 会删除该顶层字段。
- PATCH `/plugins/:id/enabled` — 仅更新插件的启用状态。请求：`{ "enabled": true }`。
- DELETE `/plugins/:id` — 删除本地插件文件和已保存的配置。无法卸载的已加载插件会返回 `409` 及 `restart_required: true`。
- GET `/plugin-store` — 列出配置的插件商店源中的插件，包括源错误、安装状态、已安装来源和可更新状态。
- POST `/plugin-store/:id/install` — 从商店源下载或更新插件、在配置中启用它，并返回安装路径和版本。若存在重复 ID，请通过 `?source=<source-id>` 选择来源；可在查询参数或请求体（`{ "version": "1.2.3" }`）中指定 `version`。

插件 ID 必须符合主机插件 ID 规则。商店安装可能下载可执行插件产物；使用前请配置并信任商店源。

### 其它运行时设置与日志

本节中的所有 PUT/PATCH 端点均使用 `{ "value": ... }`，并返回 `{ "status": "ok" }`。

- GET/PUT/PATCH `/logs-max-total-size-mb` — 日志总大小上限（MiB）。负值会按 `0` 保存。
- GET/PUT/PATCH `/error-logs-max-files` — 保留的请求错误日志文件数量。提交负值会回退为 `10`。
- GET/PUT/PATCH `/force-model-prefix` — 是否强制使用已配置模型前缀的布尔开关。
- GET/PUT/PATCH `/routing/strategy` — 凭据选择策略。有效值为 `round-robin`（也可为 `roundrobin`/`rr`）与 `fill-first`（也可为 `fillfirst`/`ff`）；GET 返回 `{ "strategy": "..." }`。
- GET `/logs` 还支持 `limit` 和不透明的 `cursor` 参数。未传 `after` 且传入 `limit` 时返回最新日志行；将响应中的 `next-cursor` 作为下一次的 `cursor` 可增量读取。游标失效时响应包含 `cursor-reset: true`。
- GET `/request-log-by-id/:id` — 下载文件名以 `-<id>.log` 结尾的请求日志。请求 ID 不得包含路径分隔符。

### 其它提供商 API Key 集合

`/interactions-api-key`、`/xai-api-key` 和 `/vertex-api-key` 都是对象数组集合，均支持 GET、PUT、PATCH 和 DELETE。GET 返回以端点名为 key 的对象，并在适用时添加运行时 `auth-index`；PUT 接受原始数组或 `{ "items": [ ... ] }`；PATCH 使用 `{ "index": 0, "value": { ... } }` 或 `{ "match": "<api-key>", "value": { ... } }`；DELETE 使用 `?index=` 或 `?api-key=`（同一 key 出现多次时请附加 `&base-url=`）。

- `/interactions-api-key` 配置 Google Interactions API Key。条目使用 Gemini Key 结构：`api-key`、`priority`、`prefix`、`base-url`、`proxy-url`、`models`、`headers`、`excluded-models` 和 `disable-cooling`。
- `/xai-api-key` 配置原生 xAI API Key。条目使用 Codex Key 结构，另支持 `priority`、`websockets` 和 `disable-cooling`；保留条目必须有 `base-url`，PATCH 将 `base-url` 设为空会删除该条目。
- `/vertex-api-key` 配置 Vertex 兼容 API Key。PUT 中每个条目必须提供 `api-key`，可选字段包括 `priority`、`prefix`、`base-url`、`proxy-url`、`headers`、`models` 和 `excluded-models`。模型条目使用 `name`、`alias`、可选的 `display-name` 和 `force-mapping`。PATCH 将 `api-key` 或 `base-url` 设为空会删除该条目。

### OAuth 模型别名

- GET `/oauth-model-alias` — 返回 `{ "oauth-model-alias": { "<channel>": [ ... ] } }`。
- PUT `/oauth-model-alias` — 完整替换 channel 到别名列表的映射；请求体也可包装为 `{ "items": { ... } }`。
- PATCH `/oauth-model-alias` — 替换单个 channel 条目。请求：`{ "channel": "codex", "aliases": [{ "name": "upstream", "alias": "client-name", "fork": false, "display-name": "Client Name", "force-mapping": true }] }`。`provider` 可作为 `channel` 的别名；空别名数组会删除已有 channel。
- DELETE `/oauth-model-alias?channel=codex` — 删除一个 channel；查询参数也可使用 `provider`。

### 认证文件扩展接口

- GET `/auth-files/models?name=<name-or-auth-id>` — 返回单个凭据支持的模型定义：`{ "models": [...] }`。
- GET `/model-definitions/:channel` — 返回静态目录元数据：`{ "channel": "...", "models": [...] }`；channel 未知时返回 `400`。省略必填的 `:channel` 路径段不会匹配此路由，返回 `404`。
- PATCH `/auth-files/status` — 启用或禁用认证记录。请求：`{ "name": "<file-name-or-id>", "disabled": true }`。配置型 API Key 会通过其 `excluded-models` 配置禁用；插件虚拟子凭据不能单独修改。
- PATCH `/auth-files/fields` — 更新文件名或 auth ID 对应的元数据字段。请求体包含 `name` 和至少一个字段；点路径可更新嵌套元数据，例如 `{ "name": "acc.json", "project_id": "my-project", "headers.X-Team": "prod" }`。`headers` 对象会与现有自定义请求头合并，空的头值会删除对应请求头。

### 携带认证的上游调用

- POST `/api-call` — 发起出站 HTTP 请求，可通过 `auth_index`（也接受 `authIndex` 或 `AuthIndex`）指定凭据。请求字段为 `method`、绝对 `url`、可选字符串映射 `header` 和可选原始字符串 `data`。
- 在请求头值中使用 `$TOKEN$` 可替换为所选凭据的 access token 或 API Key。凭据级代理优先于全局 `proxy-url`；否则请求会直接连接。响应为 `{ "status_code": 200, "header": { ... }, "body": "..." }`，上游状态码保留在 `status_code` 中。

该端点可以使用已配置凭据发起任意出站请求，请严格限制管理密钥的访问权限。

### 其它 OAuth 流程与回调

- GET `/kimi-auth-url` 与 GET `/xai-auth-url` 发起设备码流程。两者都会返回 `status`、`url`、`state` 和 `flow: "device"`，也可能返回 `user_code` 和 `expires_in`。
- DELETE `/oauth-session?state=<state>` — 取消待处理的 OAuth 会话，返回 `{ "status": "ok", "cancelled": true|false }`。已取消的设备码或回调流程不会保存凭据。
- GET/POST `/oauth-callback` 在认证路由组之外接收 OAuth 回调。GET 使用查询参数 `provider`、`state`、`code` 和 `error`/`error_description`；POST 接受 `{ "provider", "redirect_url", "code", "state", "error" }`，其中 `redirect_url` 可以提供回调查询值。只有 provider 与会话匹配且 state 有效、仍待处理时才会接受回调。
- `GET /get-auth-status?state=...` 在会话待处理时返回 `wait`，完成后返回 `ok`，失败、取消、过期或 state 未知时返回 `error`。已完成 state 会短暂保留，以便客户端读取 `ok`。

### 新增端点示例

除无需认证的 `/oauth-callback` 示例外，以下所有示例均需要 `Authorization: Bearer <MANAGEMENT_KEY>`。

#### 插件

- 列出本地插件：
  ```bash
  curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
    http://localhost:8317/v0/management/plugins
  ```
  ```json
  {
    "plugins_enabled": true,
    "plugins_dir": "/abs/path/plugins",
    "plugins": [{
      "id": "example-plugin", "path": "/abs/path/plugins/example-plugin.so",
      "configured": true, "registered": true, "enabled": true,
      "effective_enabled": true, "supports_oauth": false,
      "oauth_provider": "", "logo": "", "config_fields": [], "menus": [],
      "metadata": { "name": "Example", "version": "1.0.0", "author": "Example", "github_repository": "", "logo": "", "config_fields": [] }
    }]
  }
  ```
- 读取、替换、修补、启用和删除插件配置：
  ```bash
  curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
    http://localhost:8317/v0/management/plugins/example-plugin/config
  # {"enabled":true,"priority":10,"endpoint":"https://plugin.example.com"}

  curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' \
    -d '{"enabled":true,"priority":10,"endpoint":"https://plugin.example.com"}' \
    http://localhost:8317/v0/management/plugins/example-plugin/config
  # {"status":"ok"}

  curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' \
    -d '{"priority":20,"endpoint":null}' \
    http://localhost:8317/v0/management/plugins/example-plugin/config
  # {"status":"ok"}

  curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' \
    -d '{"enabled":false}' http://localhost:8317/v0/management/plugins/example-plugin/enabled
  # {"status":"ok"}
  ```
  ```bash
  curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
    http://localhost:8317/v0/management/plugins/example-plugin
  ```
  ```json
  { "status": "deleted", "id": "example-plugin", "path": "/abs/path/plugins/example-plugin.so", "file_deleted": true, "configured_removed": true, "restart_required": false }
  ```
- 列出并从插件商店安装：
  ```bash
  curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/plugin-store
  ```
  ```json
  { "plugins_enabled": true, "plugins_dir": "/abs/path/plugins", "sources": [{"id":"official","name":"Official","url":"https://example.com/registry.json"}], "plugins": [{"store_id":"official/example-plugin","source_id":"official","source_name":"Official","source_url":"https://example.com/registry.json","id":"example-plugin","name":"Example","description":"Example plugin","author":"Example","version":"1.2.3","repository":"example/example-plugin","install_type":"github-release","auth_required":false,"auth_configured":true,"installed":false,"installed_version":"","path":"","configured":false,"registered":false,"enabled":false,"effective_enabled":false,"update_available":false}] }
  ```
  ```bash
  curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' \
    -d '{"version":"1.2.3"}' 'http://localhost:8317/v0/management/plugin-store/example-plugin/install?source=official'
  ```
  ```json
  { "status": "installed", "source_id": "official", "source_name": "Official", "source_url": "https://example.com/registry.json", "id": "example-plugin", "version": "1.2.3", "install_type": "github-release", "path": "/abs/path/plugins/example-plugin.so", "plugins_enabled": true, "restart_required": false }
  ```

#### 运行时设置与日志

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/logs-max-total-size-mb
# {"logs-max-total-size-mb":512}
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"value":20}' http://localhost:8317/v0/management/error-logs-max-files
# {"status":"ok"}
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"value":true}' http://localhost:8317/v0/management/force-model-prefix
# {"status":"ok"}
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"value":"fill-first"}' http://localhost:8317/v0/management/routing/strategy
# {"status":"ok"}
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/logs?limit=2'
```
```json
{ "lines": ["2026-05-05 12:00:00 info request accepted"], "line-count": 1, "latest-timestamp": 1777982400, "next-cursor": "<OPAQUE_CURSOR>" }
```
```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/logs?cursor=<OPAQUE_CURSOR>&limit=100'
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -OJ http://localhost:8317/v0/management/request-log-by-id/req_123
```

#### 提供商 API Key 集合

以下示例展示每种集合操作；请按目标提供商替换端点和 Key 结构。

```bash
# Interactions：GET、PUT、PATCH、DELETE
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/interactions-api-key
# {"interactions-api-key":[{"api-key":"AIza...","auth-index":"a1b2","base-url":"https://generativelanguage.googleapis.com","excluded-models":[]}]}
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '[{"api-key":"AIza...","priority":10,"prefix":"team/","base-url":"https://generativelanguage.googleapis.com","proxy-url":"","models":[],"headers":{"X-Team":"prod"},"excluded-models":["gemini-2.0-flash"],"disable-cooling":true}]' http://localhost:8317/v0/management/interactions-api-key
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"index":0,"value":{"proxy-url":"socks5://127.0.0.1:1080"}}' http://localhost:8317/v0/management/interactions-api-key
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/interactions-api-key?api-key=AIza...&base-url=https%3A%2F%2Fgenerativelanguage.googleapis.com'
# 每次变更均返回：{"status":"ok"}

# xAI：GET、PUT、PATCH、DELETE
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/xai-api-key
# {"xai-api-key":[{"api-key":"xai...","auth-index":"c3d4","base-url":"https://api.x.ai/v1","websockets":true}]}
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '[{"api-key":"xai...","priority":10,"prefix":"xai/","base-url":"https://api.x.ai/v1","websockets":true,"proxy-url":"","models":[{"name":"grok-3","alias":"grok"}],"headers":{},"excluded-models":[],"disable-cooling":false}]' http://localhost:8317/v0/management/xai-api-key
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"match":"xai...","value":{"websockets":false}}' http://localhost:8317/v0/management/xai-api-key
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/xai-api-key?index=0'
# 每次变更均返回：{"status":"ok"}

# Vertex 兼容：GET、PUT、PATCH、DELETE
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/vertex-api-key
# {"vertex-api-key":[{"api-key":"vertex...","auth-index":"e5f6","base-url":"https://vertex.example.com"}]}
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '[{"api-key":"vertex...","priority":10,"prefix":"vertex/","base-url":"https://vertex.example.com","proxy-url":"","headers":{},"models":[{"name":"gemini-2.5-pro","alias":"vertex-gemini","display-name":"Vertex Gemini","force-mapping":true}],"excluded-models":[]}]' http://localhost:8317/v0/management/vertex-api-key
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"match":"vertex...","value":{"headers":{"X-Team":"prod"}}}' http://localhost:8317/v0/management/vertex-api-key
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/vertex-api-key?index=0'
# 每次变更均返回：{"status":"ok"}
```

#### OAuth 别名、认证文件与上游调用

```bash
# OAuth 模型别名：GET、PUT、PATCH、DELETE
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/oauth-model-alias
# {"oauth-model-alias":{"codex":[{"name":"gpt-5","alias":"gpt-5-fast","fork":true,"display-name":"GPT-5 Fast","force-mapping":true}]}}
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"codex":[{"name":"gpt-5","alias":"gpt-5-fast","fork":true,"display-name":"GPT-5 Fast","force-mapping":true}]}' http://localhost:8317/v0/management/oauth-model-alias
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"channel":"codex","aliases":[{"name":"gpt-5","alias":"gpt-5-fast"}]}' http://localhost:8317/v0/management/oauth-model-alias
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/oauth-model-alias?channel=codex'
# 每次变更均返回：{"status":"ok"}

# 凭据模型、静态定义、状态和元数据
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/auth-files/models?name=codex-user.json'
# {"models":[{"id":"gpt-5","display_name":"GPT-5","type":"model","owned_by":"openai"}]}
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/model-definitions/codex
# {"channel":"codex","models":[...]}
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"name":"codex-user.json","disabled":true}' http://localhost:8317/v0/management/auth-files/status
# {"status":"ok","disabled":true}
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"name":"codex-user.json","project_id":"my-project","headers.X-Team":"prod"}' http://localhost:8317/v0/management/auth-files/fields
# {"status":"ok"}

# 携带认证的上游请求
curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"auth_index":"a1b2","method":"GET","url":"https://api.example.com/v1/ping","header":{"Authorization":"Bearer $TOKEN$"}}' http://localhost:8317/v0/management/api-call
# {"status_code":200,"header":{"Content-Type":["application/json"]},"body":"{\"ok\":true}"}
```

#### 设备 OAuth 与回调

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/kimi-auth-url
# {"status":"ok","url":"https://...","state":"kmi-...","flow":"device","user_code":"ABCD-EFGH","expires_in":900}
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/xai-auth-url
# {"status":"ok","url":"https://...","state":"xai-...","flow":"device","user_code":"ABCD-EFGH","expires_in":1800}
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/get-auth-status?state=xai-...'
# {"status":"wait"}
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/oauth-session?state=xai-...'
# {"status":"ok","cancelled":true}

# 回调路由不使用管理密钥中间件；由 state 校验保护。
curl 'http://localhost:8317/v0/management/oauth-callback?provider=codex&state=codex-...&code=AUTHORIZATION_CODE'
# {"status":"ok"}
curl -X POST -H 'Content-Type: application/json' -d '{"provider":"codex","state":"codex-...","code":"AUTHORIZATION_CODE"}' http://localhost:8317/v0/management/oauth-callback
# {"status":"ok"}
```

## 错误响应

通用错误格式：
- 400 Bad Request: `{ "error": "invalid body" }`
- 401 Unauthorized: `{ "error": "missing management key" }` 或 `{ "error": "invalid management key" }`
- 403 Forbidden: `{ "error": "remote management disabled" }`
- 404 Not Found: `{ "error": "item not found" }` 或 `{ "error": "file not found" }`
- 422 Unprocessable Entity: `{ "error": "invalid_config", "message": "..." }`
- 500 Internal Server Error: `{ "error": "failed to save config: ..." }`
- 503 Service Unavailable: `{ "error": "core auth manager unavailable" }`

## 说明

- 变更会写回 YAML 配置文件，并由文件监控器热重载配置与客户端。
- `remote-management.allow-remote` 与 `remote-management.secret-key` 不能通过 API 修改，需在配置文件中设置。
