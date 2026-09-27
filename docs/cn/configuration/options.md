# 配置选项

默认值和可用字段与 `config.example.yaml` 的 v8 布局保持同步。

v8 文件需要设置 `config-version: 8`。已有的旧配置文件和 `/v0/management` 请求仍然可用。同一设置同时存在 v8 字段和旧写法时，v8 的值胜出，包括 `false`、`0` 和空集合，加载或保存时会删除对应的旧字段。仅存在于旧布局中的字段会保留，直到通过 `/v8/management` 成功写入配置。只设置 `config-version: 8`，或读取配置，都不会单独迁移文件。v8 管理写入会拒绝旧字段名和未知的根配置节。

根级 `api-keys` 映射只用于上游提供商分组。原来放在根级 `api-keys` 列表中的客户端密钥现在是 `access.api-keys`。这两种含义不能共用同一个 YAML 键。

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `config-version` | integer | — | 存在时必须为 `8`。 |

## 服务器

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `server.host` | string | `""` | 绑定地址。空值监听所有 IPv4 和 IPv6 接口。使用 `127.0.0.1` 或 `localhost` 仅允许本机访问。 |
| `server.port` | integer | `8317` | 服务器端口。`0` 或负数也会回退到 `8317`。 |
| `server.trusted-proxies` | string[] | `[]` | 允许提供转发客户端 IP 头的 IP 或 CIDR。空列表不信任任何转发头。修改后需要重启。 |
| `server.tls.enable` | boolean | `false` | 启用 HTTPS。 |
| `server.tls.cert` / `server.tls.key` | string | `""` | TLS 证书和私钥路径。 |
| `server.commercial-mode` | boolean | `false` | 关闭高开销的请求日志和中间件以降低内存使用。 |
| `server.discovery.enabled` | boolean | `false` | 通过 mDNS / DNS-SD 广播 `_ai-gateway._tcp`。Docker 必须使用 host 网络；链路本地多播无法穿过默认网桥。 |
| `server.discovery.service-name` | string | `""` | 可选名称前缀。广播名为 `CPA-<ShortID>` 或 `<name>-<ShortID>`。 |
| `server.discovery.service-type` | string | `"_ai-gateway._tcp"` | DNS-SD 服务类型。 |
| `server.discovery.subtypes` | string[] | chat、responses、messages、generate-content、interactions | API 协议子类型。每个值都带前导下划线，例如 `_responses`。 |
| `server.discovery.interfaces.include` / `exclude` | string[] | `[]` | 网卡白名单和额外排除模式。include 为空时自动检测物理网卡。 |
| `server.discovery.auth-required` | boolean | `true` | 广播客户端必须认证。 |
| `server.discovery.advertise-management` | boolean | `false` | 广播管理接口可用。 |

## 管理 API

`secret-key` 为空时，`/v0/management` 和 `/v8/management` 都会返回 404。localhost 访问同样需要该密钥。

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `management.allow-remote` | boolean | `false` | 允许非 localhost 的管理访问。 |
| `management.secret-key` | string | `""` | 管理密钥。明文会在启动时哈希。 |
| `management.disable-control-panel` | boolean | `false` | 禁用内置管理面板资源和路由。 |
| `management.disable-auto-update-panel` | boolean | `false` | 禁用管理面板的周期性后台更新。资源缺失时，首次访问仍会下载。 |
| `management.base-url` | string | `http://127.0.0.1:<port>` | `cliproxyapi --tui` 使用的远程管理 API 基址。`--management-base-url` 会覆盖它。 |
| `management.panel-github-repository` | string | `"https://github.com/router-for-me/Cli-Proxy-API-Management-Center"` | 管理面板包的仓库或 releases API URL。 |

## 访问控制

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `access.api-keys` | string[] | `[]` | 此代理接受的客户端密钥。它们不是上游提供商密钥。 |

## 路由

`routing.strategy` 接受 `round-robin`（默认）、`weighted-round-robin` 或 `fill-first`。`weightedroundrobin`、`wrr`、`fillfirst` 和 `ff` 是别名。

加权轮询使用每个凭据的整数 `weight`。省略时为 `1`，最大值为 `1,000,000`；非正数会在该策略生效期间排除该凭据。OAuth 或文件凭据把数字 `weight` 放在 auth JSON 的顶层。

已建立的会话绑定优先于凭据优先级。优先级仍决定冷绑定、没有会话的请求，以及故障转移后的重新绑定。

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `routing.strategy` | string | `"round-robin"` | 凭据选择策略。 |
| `routing.session-affinity` | boolean | `false` | 将会话绑定到凭据。优先使用 Claude Code、Codex、OpenCode 和 pi 的显式会话头，然后是 `prompt_cache_key`、Responses 对话 ID、旧的请求体 ID、执行或派生的会话标识，以及首条消息 hash。故障转移保持开启。 |
| `routing.session-affinity-ttl` | string | `"1h"` | 会话到凭据绑定的 TTL。小于一秒的值会提升到一秒。 |
| `routing.session-affinity-subagents` | boolean | `true` | 带父引用的子会话在 Claude、Codex、Antigravity 和 Gemini 上复用父凭据。`false` 时由回退选择器分散到凭据池。会话粘性关闭时忽略。 |
| `routing.force-model-prefix` | boolean | `false` | 无前缀模型请求只使用无前缀凭据，前缀与模型名相同时除外。 |
| `routing.retry.request-retry` | integer | `3` | 第 0 轮之后的额外凭据轮次。第 `r` 轮只接纳有效值至少为 `r` 的凭据。适用于 HTTP 403、408、429、500、502、503 和 504。 |
| `routing.retry.max-retry-credentials` | integer | `0` | 每轮在轮次过滤后尝试的不同凭据数。`0` 表示尝试所有合格凭据。被上限跳过的凭据仍随全局轮次老化。 |
| `routing.retry.max-retry-interval` | integer | `30` | 两轮之间等待冷却的最长秒数。`0` 或更小表示不等待。它不会关闭同一轮故障转移或无需等待的后续轮次。 |
| `routing.cooldown.disable-cooling` | boolean | `false` | 全局关闭凭据和模型冷却。凭据或提供商上显式给出的值会覆盖它。 |
| `routing.cooldown.save-cooldown-status` | boolean | `false` | 将冷却状态持久化为 auth 文件旁的 `.cds` 文件。 |
| `routing.cooldown.transient-error-cooldown-seconds` | integer | `0` | 408、500、502、503、504 和 520-526 等临时错误的冷却时间。`0` 使用旧的 60 秒。`-1` 禁用。 |

单个凭据的 `request-retry`：显式非负值优先，`0` 只允许第 0 轮，省略或负值继承 `routing.retry.request-retry`。

## 请求

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `requests.proxy-url` | string | `""` | 全局出站代理（`socks5`、`http` 或 `https`）。 |
| `requests.passthrough-headers` | boolean | `false` | 将经过筛选的上游响应头转发给客户端。 |
| `requests.nonstream-keepalive-interval` | integer | `0` | 为非流式响应每 N 秒输出空行。`0` 禁用。 |
| `requests.streaming.keepalive-seconds` | integer | `0` | SSE 保活间隔。`<= 0` 禁用。 |
| `requests.streaming.bootstrap-retries` | integer | `0` | 首字节发送前的安全流式重试次数。 |

单个条目的 `proxy-url` 可以是 `direct` 或 `none`，以同时绕过该代理和环境代理。以 `$` 开头的请求头值会复制对应的客户端请求头；客户端没有发送时则省略该头。

Payload 规则位于 `requests.payload`。参见 [Payload 规则](#payload-规则)。

## 多媒体

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `multimedia.disable-image-generation` | boolean \| `"chat"` \| `"passthrough"` | `false` | `true` 完全禁用图像生成，并使 `/v1/images/*` 返回 404。`"chat"` 只在非图像端点禁用注入。`"passthrough"` 不修改非图像端点的客户端负载，图像端点行为与 `"chat"` 相同。 |
| `multimedia.gpt-image-2-base-model` | string | `"gpt-5.4-mini"` | 旧版托管图像生成路径的基础模型，必须以 `gpt-` 开头。无效值会使用默认值。 |
| `multimedia.video-result-auth-cache-ttl` | string | `"3h"` | `/openai/v1/videos` 和 xAI 视频创建返回的视频 ID 与创建凭据的绑定时长。 |

## 可观测性

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `observability.logs.debug` | boolean | `false` | 启用调试日志。 |
| `observability.logs.request-log` | boolean | `false` | 记录代理请求和响应。管理请求除外。 |
| `observability.logs.logging-to-file` | boolean | `false` | 写入滚动应用日志，而不是 stdout。 |
| `observability.logs.logs-max-total-size-mb` | integer | `0` | 日志目录总大小上限（MB）。`0` 表示不限制。 |
| `observability.logs.error-logs-max-files` | integer | `10` | 请求日志关闭时保留的错误日志文件数。`0` 表示不清理。 |
| `observability.usage.usage-statistics-enabled` | boolean | `false` | 启用内存用量统计聚合。 |
| `observability.usage.redis-usage-queue-retention-seconds` | integer | `60` | 管理 API 的用量队列项在内存中保留的秒数，最大 `3600`。本地 Redis RESP 用量输出已禁用。 |
| `observability.pprof.enable` | boolean | `false` | 启用 pprof HTTP 调试服务。 |
| `observability.pprof.addr` | string | `"127.0.0.1:8316"` | pprof 绑定地址，应仅绑定本机。 |

## 插件

受信任的进程内插件默认关闭。`plugins.configs.<plugin-id>.enabled` 不会改变 `plugins.enabled`。`plugins.auth-revision` 是 Home 拥有的元数据，不是普通设置。

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `plugins.enabled` | boolean | `false` | 启用动态插件。 |
| `plugins.dir` | string | `"plugins"` | 插件发现目录。 |
| `plugins.store-sources` | string[] | `[]` | 额外的插件商店注册表 URL。官方注册表始终包含。 |
| `plugins.store-auth[].match` | string | `""` | 一条认证规则匹配的 URL 前缀。HTTP 需要 `allow-insecure: true`。 |
| `plugins.store-auth[].apply-to` | string[] | `[]` | 请求类别：`registry`、`metadata` 和/或 `artifact`。 |
| `plugins.store-auth[].type` | string | `""` | `none`、`bearer`、`basic`、`header` 或 `github-token`。 |
| `plugins.store-auth[].token-env` | string | `""` | 存放 bearer、GitHub 或其他令牌的环境变量。 |
| `plugins.store-auth[].username-env` / `password-env` | string | `""` | Basic 认证的用户名和密码环境变量。 |
| `plugins.store-auth[].header-name` / `header-value-env` | string | `""` | 请求头名称，以及存放其值的环境变量。 |
| `plugins.store-auth[].allow-insecure` | boolean | `false` | 在支持时允许不安全的认证配置。 |
| `plugins.configs.<plugin-id>.enabled` | boolean | `false` | 启用一个插件实例。 |
| `plugins.configs.<plugin-id>.priority` | integer | `0` | 插件启动和路由优先级。 |

插件实例下的其他键会原样保留给该插件。

## OAuth 与文件凭据

`oauth.providers` 只作用于 OAuth 和文件凭据，不作用于 `api-keys` 分组。令牌材料保留在凭据存储中。

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `oauth.auth-dir` | string | `"~/.cli-proxy-api"` | 凭据目录，支持 `~`。 |
| `oauth.auth-auto-refresh-workers` | integer | `16` | OAuth 和文件凭据刷新工作线程数。`<= 0` 保持默认值。 |
| `oauth.model-alias` | object | `{}` | 按渠道配置模型别名：`vertex`、`aistudio`、`antigravity`、`claude`、`codex`、`kimi`、`xai`、`meta`，或 OAuth 插件提供商 key。不作用于 `api-keys` 分组。 |
| `oauth.model-alias.*.*.name` / `alias` | string | `""` | 上游模型 ID 和客户端可见 ID。同一个 name 可以重复配置不同 alias。 |
| `oauth.model-alias.*.*.fork` | boolean | `false` | 保留上游模型，并额外暴露别名。 |
| `oauth.model-alias.*.*.display-name` | string | `""` | 别名的目录标签。 |
| `oauth.model-alias.*.*.force-mapping` | boolean | `false` | 在上游响应模型字段中返回客户端可见别名。 |
| `oauth.excluded-models` | object | `{}` | 按相同渠道排除模型，支持通配符。 |
| `oauth.request-scoped-errors` | object | `{}` | 按渠道配置的自定义上游错误规则。 |
| `oauth.request-scoped-errors.*.[].status` | integer | — | 要匹配的 HTTP 状态码。 |
| `oauth.request-scoped-errors.*.[].match` | string[] | `[]` | 响应体子串，匹配区分大小写。 |
| `oauth.request-scoped-errors.*.[].match-regexr` | string[] | `[]` | 针对响应体的正则表达式。 |
| `oauth.request-scoped-errors.*.[].action` | string | — | `stop`、`stop-and-cooldown`、`continue` 或 `continue-and-cooldown`。 |

请求级规则如果没有状态码，或没有任何 `match` / `match-regexr` 模式，会被忽略。

auth JSON 中的单个凭据 `model_aliases` 数组只作用于该凭据，并覆盖同一客户端可见名称的全局别名。旧的 `model-aliases` 会在加载时规范化。

### AI Studio

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `oauth.providers.aistudio.ws-auth` | boolean | `true` | 为 `/v1/ws` 要求认证。 |

### Codex

这些字段不作用于 `api-keys.codex`。API key 的伪装使用 `keys[].disable-codex-cloaking`。

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `oauth.providers.codex.response-steering` | boolean | `false` | 实验性的全双工 Responses WebSocket steering。一个 socket 固定一个账号和模型，已接受的输入不会重放。 |
| `oauth.providers.codex.identity-confuse` | boolean | `false` | 使用 `fill-first` 或会话粘性时，按选定凭据重映射 Codex `prompt_cache_key` 和安装标识。 |
| `oauth.providers.codex.disable-codex-cloaking` | boolean | `false` | 不在 HTTP、SSE 或 WebSocket 请求上强制官方 Codex User-Agent 和 Originator 头。 |
| `oauth.providers.codex.stream-bootstrap-buffering` | boolean | `false` | 暂存握手、心跳和空的 `*.added` 帧，直到第一个生成事件，以便流内过载或限流失败能在响应头提交前故障转移。上限是 48 帧和 1 MiB，而不是时间。 |
| `oauth.providers.codex.stream-bootstrap-timeout` | string | `"0"` | 可选时间上限，例如 `"20s"`。`0`、`0s`、`none`、`unlimited`、`disabled`、`off` 和 `never` 表示没有上限。这不会中断上游连接。 |
| `oauth.providers.codex.optimize-multi-agent-v2` | boolean | `false` | 优化 Codex Desktop、`codex-tui` 和 `codex_cli_rs` 的 multi-agent v2 请求。不作用于 API key 凭据。 |
| `oauth.providers.codex.orphan-delegation-compatibility` | boolean | `false` | 当 `X-Openai-Subagent` 为 `collab_spawn` 时，把 `codex_app/create_thread` 和 `codex_app/send_message_to_thread` 中的孤立 `function_call_output` 转成用户消息。 |
| `oauth.providers.codex.model-level-cooling` | boolean | `false` | 将 Codex `usage_limit_reached` 冷却限制到所请求的模型。 |
| `oauth.providers.codex.header-defaults.user-agent` | string | `""` | 客户端未提供时，HTTP 和 WebSocket OAuth 请求使用的 User-Agent。 |
| `oauth.providers.codex.header-defaults.beta-features` | string | `""` | 仅用于 WebSocket OAuth 请求的 beta features 回退值。 |
| `oauth.providers.codex.live-media-relay.enabled` | boolean | `false` | 在本进程中转发 Codex Live 的 WebRTC 音频和 DataChannel。需要入站 UDP 可达。 |
| `oauth.providers.codex.live-media-relay.max-sessions` | integer | `32` | 最大并发媒体会话数。`0` 表示 32。 |
| `oauth.providers.codex.live-media-relay.disable-private-remote-ips` | boolean | `false` | 拒绝指向私有、回环、链路本地或未指定地址的下游 SDP candidate。 |
| `oauth.providers.codex.live-media-relay.public-ip` | string | `""` | 位于 1:1 NAT 后时对外通告的公网地址。 |
| `oauth.providers.codex.live-media-relay.udp-port-min` / `udp-port-max` | integer | `0` | 可选 UDP 端口范围。两个值必须同时设置，且每个会话至少两个端口。 |
| `oauth.providers.codex.live-media-relay.ice-servers[].urls` | string[] | `[]` | STUN 或 TURN URL。 |
| `oauth.providers.codex.live-media-relay.ice-servers[].username` / `credential` | string | `""` | TURN 凭据。JSON 配置 API 不会返回它们。 |

使用 `http`、`https`、`socks5` 或 `socks5h` 代理时，面向 OpenAI 的媒体链路被强制走带认证的 ICE-TCP，不会回退到 UDP 或直连。面向 Codex Desktop 的链路保持直连。旧名称 `allow-private-remote-ips` 是 `disable-private-remote-ips` 的反义，只在 v8 迁移或保存时改写。

### Claude

`disable-claude-cloak-mode` 只影响 OAuth 凭据。API key 使用 `api-keys.claude[].keys[].cloak`。

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `oauth.providers.claude.model-level-cooling` | boolean | `false` | 将配额冷却限制到所请求的模型，而不是整个凭据。 |
| `oauth.providers.claude.disable-claude-cloak-mode` | boolean | `false` | 原样传递原始 system prompt。凭据中的 `cloak_mode` 可以覆盖它。`false` 保持按客户端判断的 `auto` 行为。 |
| `oauth.providers.claude.claude-code.disable-cloaking-model-list` | boolean | `false` | Anthropic 模型列表返回原始模型 ID，而不是伪装后的 ID。 |
| `oauth.providers.claude.header-defaults.user-agent` | string | `""` | 客户端未确认，或不在配置的 major/minor 版本线上时使用的 Claude Code CLI 基线。 |
| `oauth.providers.claude.header-defaults.package-version` / `runtime-version` | string | `""` | 该基线中的包版本和运行时版本。 |
| `oauth.providers.claude.header-defaults.os` / `arch` | string | `""` | 默认由运行时推导；启用设备配置稳定化后固定为这里的值。 |
| `oauth.providers.claude.header-defaults.timeout` | string | `""` | 超时请求头的回退值。 |
| `oauth.providers.claude.header-defaults.timezone` | string | `""` | 伪装 `currentDate` 使用的 IANA 时区回退值。凭据 JSON 中的 `timezone` 优先。 |
| `oauth.providers.claude.header-defaults.stabilize-device-profile` | boolean | `false` | 为每个凭据将操作系统和架构固定为该基线。 |

### Antigravity、xAI 和 Devin

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `oauth.providers.antigravity.antigravity-credits` | boolean | `true` | Claude 的最后兜底：free-tier 凭据耗尽（429/503）后，改用有 Google One AI credits 的凭据重试。 |
| `oauth.providers.antigravity.signature-cache-enabled` | boolean | `true` | 优先使用并验证缓存的思考块签名。`false` 进入绕过模式。 |
| `oauth.providers.antigravity.signature-bypass-strict` | boolean | `false` | 绕过模式下验证完整 Claude protobuf 签名，而不是只检查基本格式。 |
| `oauth.providers.antigravity.sensitive-words` | string[] | `[]` | 在 system instructions 中用零宽字符混淆的词。 |
| `oauth.providers.antigravity.connection-pool.enabled` | boolean | `false` | 启用上游 HTTP 连接池。 |
| `oauth.providers.antigravity.connection-pool.idle-conn-timeout` | string | `"30s"` | 空闲 keep-alive 超时，上限 210 秒。 |
| `oauth.providers.antigravity.connection-pool.max-idle-conns-per-host` | integer | `2` | 每个凭据对每个主机保留的最大空闲连接数。 |
| `oauth.providers.xai.inject-x-search` | boolean | `false` | 请求未声明原生 `x_search` 工具时注入它；适用时也加入 `tool_choice.allowed_tools`。 |
| `oauth.providers.devin.sensitive-words` | string[] | `[]` | 在 Devin 的 system instructions 和 prompt 中用零宽字符混淆的词。 |

## 上游 API key

`api-keys.<provider>` 是分组列表。每个分组有一个 `name`、一个 `base-url`、共享设置和一个 `keys` 列表。另一个端点应新增分组。`base-url` 属于分组，不属于单个 key。

共享分组字段为 `priority`、`prefix`、`proxy-url`、`headers`、`models`、`excluded-models`、`disable-cooling`、`request-retry` 和 `request-scoped-errors`。key 上缺失或为 `null` 的字段先继承分组值，再使用运行时回退值。字段支持时，显式的 `false`、`0`、空字符串和空集合会覆盖继承。map 和 list 覆盖会整体替换继承值。`weight` 属于每个 key。key 的 `proxy-url` 为空时回退到 `requests.proxy-url`。

`priority` 默认为 `0`，较大值优先。省略的 `weight` 默认为 `1`。

### 共享字段

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `api-keys.<provider>[].name` | string | — | 分组名称。 |
| `api-keys.<provider>[].base-url` | string | 因提供商而异 | 分组内所有 key 共用的端点。 |
| `api-keys.<provider>[].priority` | integer | `0` | 选择优先级。 |
| `api-keys.<provider>[].prefix` | string | `""` | 可选模型前缀。客户端按 `prefix/model` 调用。 |
| `api-keys.<provider>[].disable-cooling` | boolean | 继承 | 存在时覆盖 `routing.cooldown.disable-cooling`。 |
| `api-keys.<provider>[].request-retry` | integer | 继承 | 分组级重试覆盖。见上方路由重试。 |
| `api-keys.<provider>[].request-scoped-errors[]` | object[] | `[]` | 与 `oauth.request-scoped-errors` 相同的 `status`、`match`、`match-regexr` 和 `action`。规则需要状态码和至少一个模式。Vertex 不支持该字段。 |
| `api-keys.<provider>[].headers` | object | `{}` | 额外请求头。 |
| `api-keys.<provider>[].proxy-url` | string | `""` | 分组代理覆盖。 |
| `api-keys.<provider>[].excluded-models` | string[] | `[]` | 排除的模型。支持 `*`、前缀、后缀和子串通配符。 |
| `api-keys.<provider>[].keys[].api-key` | string | `""` | 上游 API key。 |
| `api-keys.<provider>[].keys[].weight` | integer | `1` | 加权轮询份额。最大 `1,000,000`。非正数会在该策略生效期间排除此 key。 |
| `api-keys.<provider>[].models[].name` / `alias` | string | `""` | 上游模型名和客户端别名。 |
| `api-keys.<provider>[].models[].display-name` | string | `""` | 目录标签。 |
| `api-keys.<provider>[].models[].max-context-length` | integer | `0` | 覆盖向 Codex 客户端通告的上下文窗口。Vertex 不使用。 |
| `api-keys.<provider>[].models[].force-mapping` | boolean | `false` | 将上游响应模型字段重写为别名。 |
| `api-keys.<provider>[].models[].is-compat` | boolean | `false` | 为兼容上游保留空签名的思考块。Codex 在同时开启 `optimize-multi-agent-v2` 时，用它做可移植的 multi-agent `agent_message` 转换。Vertex 不使用。 |
| `api-keys.<provider>[].models[].thinking.levels` | string[] | 因提供商而异 | 离散推理等级。 |
| `api-keys.<provider>[].models[].thinking.min` / `max` | integer | — | 模型按预算而非等级思考时的预算范围。 |
| `api-keys.<provider>[].models[].thinking.zero-allowed` / `dynamic-allowed` | boolean | `false` | 允许预算 `0`，或动态预算 `-1`。 |

同一个 key 可以覆盖共享分组字段。key 不能再次设置 `base-url`。

### Gemini 和 Interactions

`api-keys.gemini` 与 `api-keys.interactions` 使用共享字段。Interactions key 只用于直接执行 `/v1beta/interactions`。客户端经 interactions API 进入时，Gemini key 仍处理 `generateContent`。

默认 base URL 为 `https://generativelanguage.googleapis.com`。API key 和 base URL 都为空的条目会被删除，重复的 Gemini 条目也会被删除。

### Vertex

`api-keys.vertex` 使用共享字段，但不包括 `request-scoped-errors`、`max-context-length` 和 `is-compat`。`base-url` 可选，省略时回退到 Google Vertex。API key 通过 `x-goog-api-key` 发送。没有 API key 的条目会被删除。模型映射必须同时有 `name` 和 `alias`。

### Codex

`api-keys.codex` 使用共享字段。没有 `base-url` 的分组会被丢弃。OAuth Codex 提供商选项在这里不适用。

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `api-keys.codex[].keys[].websockets` | boolean | `false` | 使用上游 Responses API WebSocket 传输。 |
| `api-keys.codex[].keys[].alpha-search` | boolean | `false` | 允许此 key 通过 `base-url` + `/alpha/search` 提供 `/v1/alpha/search`。 |
| `api-keys.codex[].keys[].disable-codex-cloaking` | boolean | `false` | `true` 关闭此 key 的伪装。省略时不继承 `oauth.providers.codex.disable-codex-cloaking`。 |
| `api-keys.codex[].models[].support-configuration-update` | boolean | `false` | 为此 API key 模型启用 `configuration_update`。 |

### Claude

`api-keys.claude` 使用共享字段。官方 Claude API 的 `base-url` 可以为空。OAuth 伪装和默认请求头不作用于这些 key。

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `api-keys.claude[].keys[].rebuild-mid-system-message` | boolean | `false` | 将角色为 `system` 的消息移到 Claude 顶层 system 字段。 |
| `api-keys.claude[].keys[].cloak.mode` | string | `"auto"` | `auto` 伪装未确认客户端，`always` 伪装所有未确认客户端，`never` 关闭伪装。已确认的原生 Claude Code 保持透传。 |
| `api-keys.claude[].keys[].cloak.strict-mode` | boolean | `false` | `true` 删除调用方 prompt，只保留 Claude Code 的计费和身份块。 |
| `api-keys.claude[].keys[].cloak.sensitive-words` | string[] | `[]` | 用零宽字符混淆的词。 |
| `api-keys.claude[].keys[].cloak.cache-user-id` | boolean | `false` | 为此 API key 复用缓存的 `user_id`。 |
| `api-keys.claude[].keys[].fingerprint-profile` | string | `""` | 空值保留调用方指纹。`claude-code-cli` 选择 Claude Code CLI 的 Messages 形态。`oauth-cli` 是旧别名。 |
| `api-keys.claude[].keys[].experimental-cch-signing` | boolean | `false` | 已弃用的兼容字段。真实 Claude OAuth 会自动生成 CCH；`claude-code-cli` 配置只在 `api.anthropic.com` 上生成。 |

委托的 OAuth 文件在 auth JSON 中使用 `fingerprint_profile`。旧的 `fingerprint-profile` 会在加载时规范化。`count_tokens` 保持原生的 model、messages 和 tools 形态。CCH 签名遵循原生范围：仅 `api.anthropic.com` 和 Vertex。

### xAI

`api-keys.xai` 使用原生 xAI executor 和共享字段。没有 `base-url` 的分组会被丢弃。常用端点是 `https://api.x.ai/v1`。

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `api-keys.xai[].keys[].websockets` | boolean | `false` | 对下游 WebSocket 请求使用 xAI 上游 WebSocket 传输。 |

xAI key 的 `alpha-search` 会被强制关闭。

### Meta

`api-keys.meta` 使用原生 Meta executor。空的 `base-url` 会变成 `https://api.meta.ai/v1`。API key 为空或以 `dca:` 开头的条目会被删除；DCA 令牌应放在 OAuth 存储中。

### OpenAI 兼容提供商

`api-keys.openai-compatibility` 把提供商设置留在分组上。它的 `keys` 只是 API key 记录，并取代旧的 `api-key-entries`。没有 `base-url` 的分组会被丢弃。

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `api-keys.openai-compatibility[].name` | string | `""` | 提供商标识，也会用于 user agent。 |
| `api-keys.openai-compatibility[].disabled` | boolean | `false` | 禁用该提供商但不删除配置。 |
| `api-keys.openai-compatibility[].support-prompt-cache-key` | boolean | `false` | 为所有输入协议的请求派生 `prompt_cache_key`。 |
| `api-keys.openai-compatibility[].keys[].api-key` / `proxy-url` / `weight` | mixed | — | 密钥、可选代理和加权轮询权重。 |
| `api-keys.openai-compatibility[].models[].image` | boolean | `false` | 允许模型用于 `/v1/images/generations` 和 `/v1/images/edits`。这不声明 chat 或 responses 的图像输入。 |
| `api-keys.openai-compatibility[].models[].input-modalities` / `output-modalities` | string[] | `[]` | 声明的输入或输出能力，例如 `text` 和 `image`。 |
| `api-keys.openai-compatibility[].models[].use-max-completion-tokens` | boolean | `false` | 发送 `max_completion_tokens` 而不是 `max_tokens`。 |
| `api-keys.openai-compatibility[].models[].thinking.levels` | string[] | `["low", "medium", "high"]` | 省略 `thinking` 时使用。未声明的更高等级（如 `max`、`xhigh`）会被限制为 `high`。 |

重复同一个 alias 会建立内部上游池。客户端只看到一个 alias。请求在这些上游名称间轮询；所选上游在产生输出前失败时，会继续尝试下一个名称。

## Payload 规则

`requests.payload.default`、`default-raw`、`override`、`override-raw` 和 `filter` 都是规则数组。`default*` 只写入缺失值，`override*` 始终写入，`filter` 删除路径。`*-raw` 的值必须是有效 JSON，并按原始 JSON 插入。

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `requests.payload.<rule>[].models[].name` | string | `""` | 模型名或通配符。 |
| `requests.payload.<rule>[].models[].protocol` | string | `""` | 目标协议：`openai`、`gemini`、`claude`、`codex` 或 `antigravity`。 |
| `requests.payload.<rule>[].models[].from-protocol` | string | `""` | 源协议：`openai`、`responses`、`gemini` 或 `claude`。`openai-response`、`openai-responses` 和 `response` 会规范化为 `responses`。 |
| `requests.payload.<rule>[].models[].headers` | object | `{}` | 必须匹配的请求头模式。值支持 `*`。 |
| `requests.payload.<rule>[].models[].match` / `not-match` | object[] | `[]` | 必须等于，或不得等于指定值的 JSON 路径条件。 |
| `requests.payload.<rule>[].models[].exist` / `not-exist` | string[] | `[]` | 必须存在且非 null，或必须缺失或为 null 的 JSON 路径。 |
| `requests.payload.default[].params` / `override[].params` | object | `{}` | JSON 路径到值。 |
| `requests.payload.default-raw[].params` / `override-raw[].params` | object | `{}` | JSON 路径到原始 JSON。 |
| `requests.payload.filter[].params` | string[] | `[]` | 要删除的 JSON 路径。 |

## 旧布局

旧文件在成功的 v8 写入之前继续有效。混合文件中若要重新使用旧字段，先删除对应的 v8 字段。

| 旧字段 | v8 |
| --- | --- |
| `host`、`port`、`trusted-proxies`、`tls`、`commercial-mode`、`discovery` | `server.*` |
| `remote-management` | `management` |
| `api-keys` 字符串列表 | `access.api-keys` |
| `credential-concurrency`、`credential-in-flight` | `credentials.concurrency`、`credentials.in-flight` |
| `force-model-prefix` | `routing.force-model-prefix` |
| `request-retry`、`max-retry-credentials`、`max-retry-interval` | `routing.retry.*` |
| `disable-cooling`、`save-cooldown-status`、`transient-error-cooldown-seconds` | `routing.cooldown.*` |
| `proxy-url`、`passthrough-headers`、`nonstream-keepalive-interval`、`streaming`、`payload` | `requests.*` |
| `auth-dir`、`auth-auto-refresh-workers` | `oauth.auth-dir`、`oauth.auth-auto-refresh-workers` |
| `oauth-model-alias`、`oauth-excluded-models`、`oauth-request-scoped-errors` | `oauth.model-alias`、`oauth.excluded-models`、`oauth.request-scoped-errors` |
| `ws-auth` | `oauth.providers.aistudio.ws-auth` |
| `codex`、`codex-header-defaults` | `oauth.providers.codex`，包含 `header-defaults` |
| `claude`、`claude-code`、`disable-claude-cloak-mode`、`claude-header-defaults` | `oauth.providers.claude` |
| `antigravity`、`antigravity-signature-cache-enabled`、`antigravity-signature-bypass-strict` | `oauth.providers.antigravity` |
| `quota-exceeded.antigravity-credits` | `oauth.providers.antigravity.antigravity-credits` |
| `xai`、`devin` | `oauth.providers.xai`、`oauth.providers.devin` |
| `disable-image-generation`、`gpt-image-2-base-model`、`video-result-auth-cache-ttl` | `multimedia.*` |
| `debug`、`logging-to-file`、`logs-max-total-size-mb`、`error-logs-max-files`、`request-log` | `observability.logs.*` |
| `usage-statistics-enabled`、`redis-usage-queue-retention-seconds` | `observability.usage.*` |
| `pprof` | `observability.pprof` |
| `gemini-api-key`、`interactions-api-key`、`vertex-api-key`、`codex-api-key`、`claude-api-key`、`xai-api-key`、`meta-api-key` | 带 `keys` 列表的 `api-keys.<provider>` 分组 |
| `openai-compatibility` 和 `api-key-entries` | `api-keys.openai-compatibility` 和 `keys` |

`credentials.concurrency` 与 `credentials.in-flight` 是 Home 管理的契约。Home 模式下，合成后的 Home 配置优先，本地值会被忽略。

`quota-exceeded.switch-project` 和 `quota-exceeded.switch-preview-model` 没有 v8 对应字段。它们仍可在旧文件和 `/v0/management` 中读取和编辑，但 v8 模板不再包含它们。
