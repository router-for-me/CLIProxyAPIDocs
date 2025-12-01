---
outline: 'deep'
---

# 管理 API

基础路径：`http://localhost:8317/v0/management`

该 API 用于管理 CLIProxyAPI 的运行时配置与认证文件。所有变更会持久化写入 YAML 配置文件，并由服务自动热重载。

注意：以下选项不能通过 API 修改，需在配置文件中设置（如有必要可重启）：
- `allow-remote-management`
- `remote-management-key`（若在启动时检测到明文，会自动进行 bcrypt 加密并写回配置）

## 认证

- 所有请求（包括本地访问）都必须提供有效的管理密钥.
- 远程访问需要在配置文件中开启远程访问： `allow-remote-management: true`
- 通过以下任意方式提供管理密钥（明文）：
    - `Authorization: Bearer <plaintext-key>`
    - `X-Management-Key: <plaintext-key>`

若在启动时检测到配置中的管理密钥为明文，会自动使用 bcrypt 加密并回写到配置文件中。

其它说明：
- 设置环境变量 `MANAGEMENT_PASSWORD` 会将其视为额外的明文管理密钥，并强制启用远程管理（即便 `allow-remote-management` 为 false）。该值不会写入配置，需要通过 `Authorization` / `X-Management-Key` 头部直接发送。
- 通过 `cliproxy run --password <pwd>` 或 SDK 的 `WithLocalManagementPassword` 启动服务后，来自 `127.0.0.1`/`::1` 的请求可使用该“本地密码”替代远程密钥，同样通过上述头部传递；该密码仅存在于运行时内存。
- 仅当 `remote-management.secret-key` 为空且未设置 `MANAGEMENT_PASSWORD` 时，管理 API 才会整体被禁用（所有 `/v0/management` 路由均返回 404）。
- 对于远程 IP，连续 5 次认证失败会触发临时封禁（约 30 分钟）。

## 请求/响应约定

- Content-Type：`application/json`（除非另有说明）。
- 布尔/整数/字符串更新：请求体为 `{ "value": <type> }`。
- 数组 PUT：既可使用原始数组（如 `["a","b"]`），也可使用 `{ "items": [ ... ] }`。
- 数组 PATCH：支持 `{ "old": "k1", "new": "k2" }` 或 `{ "index": 0, "value": "k2" }`。
- 对象数组 PATCH：支持按索引或按关键字段匹配（各端点中单独说明）。

## 端点说明

### Usage（请求统计）
- GET `/usage` — 获取内存中的请求统计
    - 响应：
      ```json
      {
        "usage": {
          "total_requests": 24,
          "success_count": 22,
          "failure_count": 2,
          "total_tokens": 13890,
          "requests_by_day": {
            "2024-05-20": 12
          },
          "requests_by_hour": {
            "09": 4,
            "18": 8
          },
          "tokens_by_day": {
            "2024-05-20": 9876
          },
          "tokens_by_hour": {
            "09": 1234,
            "18": 865
          },
          "apis": {
            "POST /v1/chat/completions": {
              "total_requests": 12,
              "total_tokens": 9021,
              "models": {
                "gpt-4o-mini": {
                  "total_requests": 8,
                  "total_tokens": 7123,
                  "details": [
                    {
                      "timestamp": "2024-05-20T09:15:04.123456Z",
                      "tokens": {
                        "input_tokens": 523,
                        "output_tokens": 308,
                        "reasoning_tokens": 0,
                        "cached_tokens": 0,
                        "total_tokens": 831
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        "failed_requests": 2
      }
      ```
    - 说明：
        - 仅统计带有 token 使用信息的请求，服务重启后数据会被清空。
        - 小时维度会将所有日期折叠到 `00`–`23` 的统一小时桶中。
        - 顶层字段 `failed_requests` 与 `usage.failure_count` 相同，便于轮询。

### Config
- GET `/config` — 获取完整的配置
    - 请求:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/config
      ```
    - 响应:
      ```json
      {"debug":true,"proxy-url":"","api-keys":["1...5","JS...W"],"quota-exceeded":{"switch-project":true,"switch-preview-model":true},"gemini-api-key":[{"api-key":"AI...01","base-url":"https://generativelanguage.googleapis.com","headers":{"X-Custom-Header":"custom-value"},"proxy-url":""},{"api-key":"AI...02","proxy-url":"socks5://proxy.example.com:1080"}],"generative-language-api-key":["AI...01","AI...02"],"request-log":true,"request-retry":3,"claude-api-key":[{"api-key":"cr...56","base-url":"https://example.com/api","proxy-url":"socks5://proxy.example.com:1080","models":[{"name":"claude-3-5-sonnet-20241022","alias":"claude-sonnet-latest"}]},{"api-key":"cr...e3","base-url":"http://example.com:3000/api","proxy-url":""},{"api-key":"sk-...q2","base-url":"https://example.com","proxy-url":""}],"codex-api-key":[{"api-key":"sk...01","base-url":"https://example/v1","proxy-url":""}],"openai-compatibility":[{"name":"openrouter","base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk...01","proxy-url":""}],"models":[{"name":"moonshotai/kimi-k2:free","alias":"kimi-k2"}]},{"name":"iflow","base-url":"https://apis.iflow.cn/v1","api-key-entries":[{"api-key":"sk...7e","proxy-url":"socks5://proxy.example.com:1080"}],"models":[{"name":"deepseek-v3.1","alias":"deepseek-v3.1"},{"name":"glm-4.5","alias":"glm-4.5"},{"name":"kimi-k2","alias":"kimi-k2"}]}]}
      ```
    - 说明：
        - 返回中会附带 `gl-api-key`，其内容来自 `gemini-api-key` 的 API Key 列表（仅保留纯字符串视图）。
        - 若服务尚未加载配置文件，则返回空对象 `{}`。

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
        - 服务会先加载 YAML 验证其有效性，校验失败返回 `422` 以及 `{ "error": "invalid_config", "message": "..." }`。
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
          {"api-key":"AIzaSy...01","base-url":"https://generativelanguage.googleapis.com","headers":{"X-Custom-Header":"custom-value"},"proxy-url":""},
          {"api-key":"AIzaSy...02","proxy-url":"socks5://proxy.example.com:1080"}
        ]
      }
      ```
- PUT `/gemini-api-key`
    - 请求（数组形式）：
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '[{"api-key":"AIzaSy-1","headers":{"X-Custom-Header":"vendor-value"}},{"api-key":"AIzaSy-2","base-url":"https://custom.example.com"}]' \
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
        -d '{"index":0,"value":{"api-key":"AIzaSy-1","base-url":"https://custom.example.com","headers":{"X-Custom-Header":"custom-value"},"proxy-url":""}}' \
        http://localhost:8317/v0/management/gemini-api-key
      ```
    - 请求（按 api-key 匹配更新）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"match":"AIzaSy-1","value":{"api-key":"AIzaSy-1","headers":{"X-Custom-Header":"custom-value"},"proxy-url":"socks5://proxy.example.com:1080"}}' \
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

### Generative Language API Key（兼容接口）
- GET `/generative-language-api-key`
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/generative-language-api-key
      ```
    - 响应：
      ```json
      { "generative-language-api-key": ["AIzaSy...01","AIzaSy...02"] }
      ```
- PUT `/generative-language-api-key`
    - 请求：
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '["AIzaSy-1","AIzaSy-2"]' \
        http://localhost:8317/v0/management/generative-language-api-key
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
- PATCH `/generative-language-api-key`
    - 请求：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"old":"AIzaSy-1","new":"AIzaSy-1b"}' \
        http://localhost:8317/v0/management/generative-language-api-key
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
- DELETE `/generative-language-api-key`
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/generative-language-api-key?value=AIzaSy-2'
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```
- 说明：
    - 该接口只读写纯字符串列表，实际上会映射到 `gemini-api-key`。

### Codex API KEY（对象数组）
- GET `/codex-api-key` — 列出全部
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/codex-api-key
      ```
    - 响应：
      ```json
      { "codex-api-key": [ { "api-key": "sk-a", "base-url": "https://codex.example.com/v1", "proxy-url": "socks5://proxy.example.com:1080", "headers": { "X-Team": "cli" } } ] }
      ```
- PUT `/codex-api-key` — 完整改写列表
    - 请求：
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '[{"api-key":"sk-a","base-url":"https://codex.example.com/v1","proxy-url":"socks5://proxy.example.com:1080","headers":{"X-Team":"cli"}},{"api-key":"sk-b","base-url":"https://custom.example.com","proxy-url":"","headers":{"X-Env":"prod"}}]' \
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
        -d '{"index":1,"value":{"api-key":"sk-b2","base-url":"https://c.example.com","proxy-url":"","headers":{"X-Env":"stage"}}}' \
        http://localhost:8317/v0/management/codex-api-key
      ```
    - 请求（按匹配）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"match":"sk-a","value":{"api-key":"sk-a","base-url":"https://codex.example.com/v1","proxy-url":"socks5://proxy.example.com:1080","headers":{"X-Team":"cli"}}}' \
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
      { "claude-api-key": [ { "api-key": "sk-a", "base-url": "https://example.com/api", "proxy-url": "socks5://proxy.example.com:1080", "headers": { "X-Workspace": "team-a" } } ] }
      ```
- PUT `/claude-api-key` — 完整改写列表
    - 请求：
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '[{"api-key":"sk-a","proxy-url":"socks5://proxy.example.com:1080","headers":{"X-Workspace":"team-a"}},{"api-key":"sk-b","base-url":"https://c.example.com","proxy-url":"","headers":{"X-Env":"prod"}}]' \
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
          -d '{"index":1,"value":{"api-key":"sk-b2","base-url":"https://c.example.com","proxy-url":"","headers":{"X-Env":"stage"}}}' \
          http://localhost:8317/v0/management/claude-api-key
        ```
    - 请求（按匹配）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
          -d '{"match":"sk-a","value":{"api-key":"sk-a","base-url":"","proxy-url":"socks5://proxy.example.com:1080","headers":{"X-Workspace":"team-a"}}}' \
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

### OpenAI 兼容提供商（对象数组）
- GET `/openai-compatibility` — 列出全部
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/openai-compatibility
      ```
    - 响应：
      ```json
      { "openai-compatibility": [ { "name": "openrouter", "base-url": "https://openrouter.ai/api/v1", "api-key-entries": [ { "api-key": "sk", "proxy-url": "" } ], "models": [], "headers": { "X-Provider": "openrouter" } } ] }
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
        -d '{"name":"openrouter","value":{"name":"openrouter","base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk","proxy-url":""}],"models":[],"headers":{"X-Provider":"openrouter"}}}' \
        http://localhost:8317/v0/management/openai-compatibility
      ```
    - 请求（按索引）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"index":0,"value":{"name":"openrouter","base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk","proxy-url":""}],"models":[],"headers":{"X-Provider":"openrouter"}}}' \
        http://localhost:8317/v0/management/openai-compatibility
      ```
    - 响应：
      ```json
      { "status": "ok" }
      ```

    - 说明：
        - 仍可提交遗留的 `api-keys` 字段，但所有密钥会自动迁移到 `api-key-entries` 中，返回结果中的 `api-keys` 会逐步留空。
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
          "iflow": ["deepseek-v3.1", "glm-4.5"]
        }
      }
      ```
- PUT `/oauth-excluded-models` — 完整替换整张映射表
    - 请求：
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"openai":["gpt-4.1-mini"],"iflow":["deepseek-v3.1","glm-4.5"]}' \
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
        -d '{"provider":"iflow","models":["deepseek-v3.1","glm-4.5"]}' \
        http://localhost:8317/v0/management/oauth-excluded-models
      ```
    - 请求（通过空数组删除提供商）：
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"provider":"iflow","models":[]}' \
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
        -X DELETE 'http://localhost:8317/v0/management/oauth-excluded-models?provider=iflow'
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

对于 Anthropic、Codex、Gemini CLI、Antigravity 与 iFlow，可附加 `?is_webui=true` 以便从管理界面复用内置回调转发。

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

- GET `/gemini-cli-auth-url` — 开始 Google（Gemini CLI）登录
    - 查询参数：
        - `project_id`（可选）：Google Cloud 项目 ID。
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        'http://localhost:8317/v0/management/gemini-cli-auth-url?project_id=<PROJECT_ID>'
      ```
    - 响应：
      ```json
      { "status": "ok", "url": "https://...", "state": "gem-1716206400" }
      ```
    - 说明：
        - 若未提供 `project_id`，服务会通过 Cloud Resource Manager API 枚举可访问的项目并自动选择首个可用项目，写入的 token 会包含该项目 ID 以及 `auto: true` 标记。
        - 登录过程中会检测 `cloudaicompanion.googleapis.com` 是否已启用，若未启用则调用 Service Usage API 尝试开启；若开启失败，`/get-auth-status` 会返回 `project activation required: ...` 之类的错误提示。

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

- GET `/qwen-auth-url` — 开始 Qwen 登录（设备授权流程）
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/qwen-auth-url
      ```
    - 响应：
      ```json
      { "status": "ok", "url": "https://...", "state": "gem-1716206400" }
      ```

- GET `/iflow-auth-url` — 开始 iFlow 登录
    - 请求：
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/iflow-auth-url
      ```
    - 响应：
      ```json
      { "status": "ok", "url": "https://...", "state": "ifl-1716206400" }
      ```

- POST `/iflow-auth-url` — 使用已有 iFlow Cookie 登录
    - 请求体：
      ```bash
      curl -X POST -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"cookie":"<YOUR_IFLOW_COOKIE>"}' \
        http://localhost:8317/v0/management/iflow-auth-url
      ```
    - 成功响应：
      ```json
      {
        "status": "ok",
        "saved_path": "/abs/path/auths/iflow-user.json",
        "email": "user@example.com",
        "expired": "2025-05-20T10:00:00Z",
        "type": "cookie"
      }
      ```
    - 说明：
        - `cookie` 字段必填且不能为空，若缺失或格式不合法，会以 `400` 返回 `{ "status": "error", "error": "..." }`。
        - 成功后服务会规范化 Cookie，换取 API token，将其保存为 `iflow-*.json` 认证文件，并返回保存路径与基础元信息。

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
- `allow-remote-management` 与 `remote-management-key` 不能通过 API 修改，需在配置文件中设置。
