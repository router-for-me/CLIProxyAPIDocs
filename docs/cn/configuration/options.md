# 配置选项

默认值和可用字段与 `config.example.yaml` 保持同步。

## 基础配置

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `host` | string | `""` | 绑定地址；`""` 监听所有 IPv4/IPv6 接口。使用 `127.0.0.1` 或 `localhost` 仅允许本机访问。 |
| `port` | integer | `8317` | 服务器端口。 |
| `tls.enable` | boolean | `false` | 启用 HTTPS。 |
| `tls.cert` / `tls.key` | string | `""` | TLS 证书和私钥路径。 |
| `auth-dir` | string | `"~/.cli-proxy-api"` | 凭据目录，支持 `~`。 |
| `api-keys` | string[] | `[]` | 此代理接受的 API 密钥。 |
| `debug` | boolean | `false` | 启用调试日志。 |
| `request-log` | boolean | `false` | 启用详细的请求和响应日志。 |
| `pprof.enable` | boolean | `false` | 启用 pprof HTTP 调试服务。 |
| `pprof.addr` | string | `"127.0.0.1:8316"` | pprof 绑定地址；应仅绑定本机。 |
| `commercial-mode` | boolean | `false` | 关闭高开销的请求日志和中间件以降低内存使用。 |
| `logging-to-file` | boolean | `false` | 写入滚动应用日志而非 stdout。 |
| `logs-max-total-size-mb` | integer | `0` | 日志目录总大小上限（MB）；`0` 表示不限制。 |
| `error-logs-max-files` | integer | `10` | 请求日志关闭时保留的错误日志文件数；`0` 表示不清理。 |
| `usage-statistics-enabled` | boolean | `false` | 启用内存用量统计聚合。 |
| `redis-usage-queue-retention-seconds` | integer | `60` | 管理 API 的用量队列项在内存中保留的秒数；最大值为 `3600`。 |
| `proxy-url` | string | `""` | 全局出站代理（`socks5`、`http` 或 `https`）。每个凭据的 `proxy-url` 可为 `direct` 或 `none`，以绕过全局和环境代理。 |
| `force-model-prefix` | boolean | `false` | 为 `true` 时，无前缀模型请求仅使用无前缀凭据（前缀与模型名相同时除外）。 |
| `passthrough-headers` | boolean | `false` | 将经过筛选的上游响应头转发给客户端。 |
| `request-retry` | integer | `3` | 对 403/408/500/502/503/504 响应的重试次数。 |
| `max-retry-credentials` | integer | `0` | 单次失败请求尝试的最大凭据数；`0` 保持“尝试全部”的旧行为。 |
| `max-retry-interval` | integer | `30` | 重试前等待冷却中凭据的最长秒数。 |
| `disable-cooling` | boolean | `false` | 全局关闭凭据/模型冷却调度。 |
| `save-cooldown-status` | boolean | `false` | 将凭据冷却状态持久化为 auth 文件旁的 `.cds` 文件。 |
| `transient-error-cooldown-seconds` | integer | `0` | 408/500/502/503/504 等临时错误的冷却时间；`0` 使用旧的 60 秒，`-1` 禁用。 |
| `disable-claude-cloak-mode` | boolean | `false` | 全局关闭 Claude 请求伪装；单个凭据仍可覆盖。 |
| `disable-image-generation` | boolean \| `"chat"` \| `"passthrough"` | `false` | `true` 完全禁用图像生成并使 `/v1/images/*` 返回 404；`"chat"` 仅在非图像端点禁用注入；`"passthrough"` 不修改非图像端点的客户端负载，图像端点行为与 `"chat"` 相同。 |
| `gpt-image-2-base-model` | string | `"gpt-5.4-mini"` | 旧版托管图像生成路径的基础模型；必须以 `gpt-` 开头。 |
| `video-result-auth-cache-ttl` | string | `"3h"` | 视频 ID 与创建凭据的绑定时长。 |
| `auth-auto-refresh-workers` | integer | `16` | OAuth/文件凭据自动刷新工作线程数；大于 `0` 时覆盖默认值。 |
| `ws-auth` | boolean | `true` | 为 `/v1/ws` 要求认证。 |
| `nonstream-keepalive-interval` | integer | `0` | 为非流式响应每 N 秒输出空行；`0` 禁用。 |
| `streaming.keepalive-seconds` | integer | `0` | SSE 保活间隔；≤ `0` 禁用。 |
| `streaming.bootstrap-retries` | integer | `0` | 首字节发送前的安全流式重试次数。 |
| `antigravity-signature-cache-enabled` | boolean | `true` | 优先使用并验证缓存的思考块签名；仅在需要绕过模式时设为 `false`。 |
| `antigravity-signature-bypass-strict` | boolean | `false` | 绕过模式下验证完整 Claude protobuf 签名结构，而非仅校验基本格式。 |

## 管理 API

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `remote-management.allow-remote` | boolean | `false` | 允许非 localhost 的管理访问。 |
| `remote-management.secret-key` | string | `""` | 管理密钥；明文会在启动时哈希。为空时所有 `/v0/management` 路由返回 404。 |
| `remote-management.disable-control-panel` | boolean | `false` | 禁用内置管理面板资源和路由。 |
| `remote-management.disable-auto-update-panel` | boolean | `false` | 禁用管理面板的周期性后台更新；资源缺失时首次访问仍会下载。 |
| `remote-management.panel-github-repository` | string | `"https://github.com/router-for-me/Cli-Proxy-API-Management-Center"` | 管理面板包的仓库或 releases API URL。 |

## 插件

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `plugins.enabled` | boolean | `false` | 启用受信任的进程内动态插件。 |
| `plugins.dir` | string | `"plugins"` | 插件发现目录。 |
| `plugins.store-sources` | string[] | `[]` | 额外的插件商店注册表 URL；官方注册表始终包含。 |
| `plugins.store-auth[].match` | string | `""` | 插件商店认证规则匹配的 URL 前缀；HTTP 需要设置 `allow-insecure: true`。 |
| `plugins.store-auth[].apply-to` | string[] | `[]` | 需认证的请求类别：`registry`、`metadata`、`artifact`。 |
| `plugins.store-auth[].type` | string | `""` | 认证类型：`none`、`bearer`、`basic`、`header` 或 `github-token`。 |
| `plugins.store-auth[].token-env` | string | `""` | 包含 bearer、GitHub 或其他令牌的环境变量。 |
| `plugins.store-auth[].username-env` / `password-env` | string | `""` | Basic 认证用户名和密码的环境变量。 |
| `plugins.store-auth[].header-name` / `header-value-env` | string | `""` | `header` 认证的请求头名称及其值所在的环境变量。 |
| `plugins.store-auth[].allow-insecure` | boolean | `false` | 在支持时允许不安全的认证配置。 |
| `plugins.configs.<plugin-id>.enabled` | boolean | `false` | 启用一个插件实例；不会更改 `plugins.enabled`。 |
| `plugins.configs.<plugin-id>.priority` | integer | `0` | 插件启动与路由优先级。 |

## 配额、路由和 Codex

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `quota-exceeded.switch-project` | boolean | `true` | 配额耗尽时自动切换项目。 |
| `quota-exceeded.switch-preview-model` | boolean | `true` | 配额耗尽时自动切换预览模型。 |
| `quota-exceeded.antigravity-credits` | boolean | `true` | Claude 的最后兜底：free-tier 凭据都耗尽（429/503）后，使用有 Google One AI credits 的凭据。 |
| `routing.strategy` | string | `"round-robin"` | 凭据选择策略：`round-robin` 或 `fill-first`。 |
| `routing.session-affinity` | boolean | `false` | 将会话绑定到凭据。ID 来自 `metadata.user_id`、`X-Session-ID`、`Session_id`、`X-Client-Request-Id`、`conversation_id` 或消息 hash；故障转移始终可用。 |
| `routing.session-affinity-ttl` | string | `"1h"` | 会话到凭据绑定的 TTL。 |
| `codex.identity-confuse` | boolean | `false` | 使用 `fill-first` 或会话粘性时，按选定凭据重映射 Codex 缓存和安装标识。 |

## 提供商凭据

所有提供商列表默认均为 `[]`。`priority` 默认值为 `0`，较高值优先。`models.*.display-name` 是模型目录显示名称，`models.*.force-mapping` 会将上游响应模型字段重写为客户端别名。

### Gemini 和原生 Interactions

`gemini-api-key[]` 与 `interactions-api-key[]` 字段相同；后者仅用于直接执行 `/v1beta/interactions`。

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `<provider>.*.api-key` | string | `""` | API 密钥。 |
| `<provider>.*.priority` | integer | `0` | 凭据选择优先级。 |
| `<provider>.*.prefix` | string | `""` | 可选前缀，按 `prefix/model` 调用。 |
| `<provider>.*.disable-cooling` | boolean | `false` | 关闭此凭据的冷却调度。 |
| `<provider>.*.base-url` | string | `"https://generativelanguage.googleapis.com"` | 自定义端点。 |
| `<provider>.*.headers` | object | `{}` | 额外请求头。 |
| `<provider>.*.proxy-url` | string | `""` | 此密钥的代理覆盖。 |
| `<provider>.*.models.*.name` / `alias` | string | `""` | 上游模型名和客户端别名。 |
| `<provider>.*.models.*.display-name` | string | `""` | 模型目录的人类可读标签。 |
| `<provider>.*.models.*.force-mapping` | boolean | `false` | 在上游响应模型字段中返回别名。 |
| `<provider>.*.excluded-models` | string[] | `[]` | 要排除的模型，支持通配符。 |

### Codex 和 xAI

`codex-api-key[]` 与 `xai-api-key[]` 使用下列字段；xAI 使用原生 xAI executor。

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `<provider>.*.api-key`、`priority`、`prefix`、`disable-cooling`、`headers`、`proxy-url`、`excluded-models` | mixed | — | 含义与 Gemini 凭据字段相同。 |
| `<provider>.*.base-url` | string | — | 必填的自定义端点；为空时该条目会被丢弃。 |
| `<provider>.*.websockets` | boolean | `false` | 使用上游 Responses API WebSocket 传输。 |
| `<provider>.*.models.*.name` / `alias` / `display-name` / `force-mapping` | mixed | — | 含义与上方模型映射字段相同。 |

### Claude

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `claude-api-key.*.api-key`、`priority`、`prefix`、`disable-cooling`、`base-url`、`headers`、`proxy-url`、`excluded-models` | mixed | — | 含义与 Gemini 凭据字段相同。 |
| `claude-api-key.*.models.*.name` / `alias` / `display-name` / `force-mapping` | mixed | — | 上游映射和响应模型重写控制。 |
| `claude-api-key.*.rebuild-mid-system-message` | boolean | `false` | 将角色为 `system` 的消息移至 Claude 顶层 system 字段。 |
| `claude-api-key.*.cloak.mode` | string | `"auto"` | 伪装模式：`auto`（非 Claude Code 客户端）、`always` 或 `never`。 |
| `claude-api-key.*.cloak.strict-mode` | boolean | `false` | 删除用户 system 消息，仅保留 Claude Code 提示。 |
| `claude-api-key.*.cloak.sensitive-words` | string[] | `[]` | 用零宽字符混淆的词。 |
| `claude-api-key.*.cloak.cache-user-id` | boolean | `false` | 为此 API 密钥复用缓存的 `user_id`。 |
| `claude-api-key.*.experimental-cch-signing` | boolean | `false` | 使用当前 Claude Code CCH 算法对最终伪装的 `/v1/messages` 请求体签名。 |

### OpenAI 兼容提供商

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `openai-compatibility.*.name`、`priority`、`prefix`、`base-url`、`headers` | mixed | — | 提供商标识、选择优先级、可选前缀、端点和请求头。 |
| `openai-compatibility.*.disabled` / `disable-cooling` | boolean | `false` | 禁用该提供商，或关闭其冷却调度。 |
| `openai-compatibility.*.api-key-entries.*.api-key` / `proxy-url` | string | `""` | 提供商 API 密钥及可选的单密钥代理。 |
| `openai-compatibility.*.models.*.name` / `alias` / `display-name` / `force-mapping` | mixed | — | 上游映射和响应模型重写控制。 |
| `openai-compatibility.*.models.*.image` | boolean | `false` | 允许模型用于 `/v1/images/generations` 和 `/v1/images/edits`。 |
| `openai-compatibility.*.models.*.input-modalities` / `output-modalities` | string[] | `[]` | 声明的输入/输出能力，例如 `text`、`image`。 |
| `openai-compatibility.*.models.*.thinking.levels` | string[] | `["low", "medium", "high"]` | 支持的推理强度等级。 |

### Vertex 兼容 API 密钥

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `vertex-api-key.*.api-key`、`priority`、`prefix`、`base-url`、`headers`、`proxy-url`、`excluded-models` | mixed | — | Vertex 兼容凭据和路由设置。 |
| `vertex-api-key.*.models.*.name` / `alias` / `display-name` / `force-mapping` | mixed | — | 上游映射和响应模型重写控制。 |

## OAuth 模型控制与默认请求头

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `oauth-model-alias` | object | `{}` | 按 OAuth 渠道配置模型别名：`vertex`、`aistudio`、`antigravity`、`claude`、`codex`、`kimi`、`xai` 或 OAuth 插件提供商 key。 |
| `oauth-model-alias.*.*.name` / `alias` | string | `""` | 上游和客户端可见模型 ID。 |
| `oauth-model-alias.*.*.fork` | boolean | `false` | 保留上游模型，并将别名额外暴露为一个模型。 |
| `oauth-model-alias.*.*.display-name` | string | `""` | 别名的模型目录标签。 |
| `oauth-model-alias.*.*.force-mapping` | boolean | `false` | 在上游响应模型字段中返回客户端别名。 |
| `oauth-excluded-models` | object | `{}` | 按渠道排除 OAuth 模型，支持通配符。 |
| `claude-header-defaults.user-agent`、`package-version`、`runtime-version`、`timeout` | string | `""` | 客户端未提供时使用的 Claude OAuth 请求头。 |
| `claude-header-defaults.os` / `arch` | string | `""` | 默认由运行时推导；启用设备配置稳定化时作为固定的平台基准。 |
| `claude-header-defaults.stabilize-device-profile` | boolean | `false` | 为每个凭据将 OS/架构固定为配置的基准值。 |
| `codex-header-defaults.user-agent` / `beta-features` | string | `""` | Codex OAuth 默认请求头；`beta-features` 仅适用于 WebSocket 请求。 |

## Payload 规则

`payload.default`、`default-raw`、`override`、`override-raw` 和 `filter` 均为规则数组。`default*` 仅写入缺失值，`override*` 始终写入，`filter` 删除路径；`*-raw` 的值必须是有效 JSON。

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `payload.<rule>[].models[].name` | string | `""` | 匹配的模型名，支持通配符。 |
| `payload.<rule>[].models[].protocol` | string | `""` | 目标协议：`openai`、`responses`、`gemini`、`claude`、`codex` 或 `antigravity`。 |
| `payload.<rule>[].models[].from-protocol` | string | `""` | 限定源协议：`openai`、`responses`、`gemini` 或 `claude`。 |
| `payload.<rule>[].models[].headers` | object | `{}` | 必须匹配的请求头模式；值支持 `*` 通配符。 |
| `payload.<rule>[].models[].match` / `not-match` | object[] | `[]` | 必须等于，或不得等于指定值的 JSON 路径条件。 |
| `payload.<rule>[].models[].exist` / `not-exist` | string[] | `[]` | 必须存在且非 null，或必须缺失/null 的 JSON 路径。 |
| `payload.default[].params` / `payload.override[].params` | object | `{}` | JSON 路径 → 值。 |
| `payload.default-raw[].params` / `payload.override-raw[].params` | object | `{}` | JSON 路径 → 原始 JSON 值。 |
| `payload.filter[].params` | string[] | `[]` | 要删除的 JSON 路径。 |
