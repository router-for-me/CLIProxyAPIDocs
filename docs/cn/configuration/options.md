# 配置选项

以下默认值与 `config.example.yaml` 保持同步。

## 基础

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `host` | string | `""` | 绑定地址；`""` 监听所有 IPv4/IPv6；用 `127.0.0.1` 仅限本机。 |
| `port` | integer | `8317` | 服务器监听端口。 |
| `tls.enable` | boolean | `false` | 是否启用 HTTPS。 |
| `tls.cert` | string | `""` | TLS 证书路径。 |
| `tls.key` | string | `""` | TLS 私钥路径。 |
| `auth-dir` | string | `"~/.cli-proxy-api"` | 身份凭据目录，支持 `~`。 |
| `api-keys` | string[] | `[]` | 内置 API 密钥列表。 |
| `debug` | boolean | `false` | 调试日志。 |
| `commercial-mode` | boolean | `false` | 关闭高开销中间件以降低内存。 |
| `logging-to-file` | boolean | `false` | 写入滚动日志文件而非 stdout。 |
| `logs-max-total-size-mb` | integer | `0` | 日志目录大小上限，0 表示不限制。 |
| `usage-statistics-enabled` | boolean | `false` | 是否启用内存用量统计。 |
| `proxy-url` | string | `""` | 全局代理，支持 socks5/http/https。 |
| `force-model-prefix` | boolean | `false` | 无前缀的模型请求仅使用无前缀凭据。 |
| `request-retry` | integer | `3` | 403/408/500/502/503/504 时的重试次数。 |
| `max-retry-interval` | integer | `30` | 冷却凭据等待秒数上限，超出即触发重试。 |
| `routing.strategy` | string | `"round-robin"` | 多匹配凭据的选择策略：`round-robin` 或 `fill-first`。 |
| `ws-auth` | boolean | `false` | 是否为 `/v1/ws` 启用认证。 |
| `streaming.keepalive-seconds` | integer | `0` | SSE 保活间隔，≤0 禁用。 |
| `streaming.bootstrap-retries` | integer | `0` | 首字节前的安全重试次数。 |

## 管理 API

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `remote-management.allow-remote` | boolean | `false` | 是否允许非 localhost 访问管理接口。 |
| `remote-management.secret-key` | string | `""` | 管理密钥；明文将启动时哈希；为空则整体 404。 |
| `remote-management.disable-control-panel` | boolean | `false` | true 时禁用内置管理面板资源与路由。 |
| `remote-management.panel-github-repository` | string | `"https://github.com/router-for-me/Cli-Proxy-API-Management-Center"` | 管理面板资源仓库或 releases API 地址。 |

## 配额与路由

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `quota-exceeded.switch-project` | boolean | `true` | 配额超限时自动切换项目。 |
| `quota-exceeded.switch-preview-model` | boolean | `true` | 配额超限时自动切换预览模型。 |

## 提供商凭据（均为数组，未配置时默认 `[]`）

### Gemini

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `gemini-api-key.*.api-key` | string | `""` | API Key。 |
| `gemini-api-key.*.prefix` | string | `""` | 可选前缀，需以 `prefix/model` 访问。 |
| `gemini-api-key.*.base-url` | string | `"https://generativelanguage.googleapis.com"` | 自定义端点。 |
| `gemini-api-key.*.headers` | object | `{}` | 仅对该端点附加的自定义请求头。 |
| `gemini-api-key.*.proxy-url` | string | `""` | 覆盖全局代理。 |
| `gemini-api-key.*.models.*.name` | string | `""` | 上游模型名。 |
| `gemini-api-key.*.models.*.alias` | string | `""` | 客户端别名。 |
| `gemini-api-key.*.excluded-models` | string[] | `[]` | 排除匹配的模型（支持通配符）。 |

### Codex

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `codex-api-key.*.api-key` | string | `""` | API Key。 |
| `codex-api-key.*.prefix` | string | `""` | 可选前缀。 |
| `codex-api-key.*.base-url` | string | `""` | 自定义 Codex 端点。 |
| `codex-api-key.*.headers` | object | `{}` | 自定义请求头。 |
| `codex-api-key.*.proxy-url` | string | `""` | 覆盖全局代理。 |
| `codex-api-key.*.models.*.name` | string | `""` | 上游模型名。 |
| `codex-api-key.*.models.*.alias` | string | `""` | 客户端别名。 |
| `codex-api-key.*.excluded-models` | string[] | `[]` | 排除模型（支持通配符）。 |

### Claude

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `claude-api-key.*.api-key` | string | `""` | API Key。 |
| `claude-api-key.*.prefix` | string | `""` | 可选前缀。 |
| `claude-api-key.*.base-url` | string | `""` | 自定义 Claude 端点。 |
| `claude-api-key.*.headers` | object | `{}` | 自定义请求头。 |
| `claude-api-key.*.proxy-url` | string | `""` | 覆盖全局代理。 |
| `claude-api-key.*.models.*.name` | string | `""` | 上游模型名。 |
| `claude-api-key.*.models.*.alias` | string | `""` | 客户端别名。 |
| `claude-api-key.*.excluded-models` | string[] | `[]` | 排除模型（支持通配符）。 |

### OpenAI 兼容提供商

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `openai-compatibility.*.name` | string | `""` | 提供商名称（用于 UA 等）。 |
| `openai-compatibility.*.prefix` | string | `""` | 可选前缀。 |
| `openai-compatibility.*.base-url` | string | `""` | 提供商基础 URL。 |
| `openai-compatibility.*.headers` | object | `{}` | 额外请求头。 |
| `openai-compatibility.*.api-key-entries.*.api-key` | string | `""` | API Key。 |
| `openai-compatibility.*.api-key-entries.*.proxy-url` | string | `""` | 针对该密钥的代理。 |
| `openai-compatibility.*.models.*.name` | string | `""` | 上游模型名。 |
| `openai-compatibility.*.models.*.alias` | string | `""` | 客户端别名。 |

### Vertex

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `vertex-api-key.*.api-key` | string | `""` | `x-goog-api-key` 值。 |
| `vertex-api-key.*.prefix` | string | `""` | 可选前缀。 |
| `vertex-api-key.*.base-url` | string | `""` | Vertex 兼容端点。 |
| `vertex-api-key.*.proxy-url` | string | `""` | 针对该密钥的代理。 |
| `vertex-api-key.*.headers` | object | `{}` | 额外请求头。 |
| `vertex-api-key.*.models.*.name` | string | `""` | 上游模型名。 |
| `vertex-api-key.*.models.*.alias` | string | `""` | 客户端别名。 |

## Amp 集成 (`ampcode`)

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `ampcode.upstream-url` | string | `""` | Amp CLI OAuth/管理上游地址。 |
| `ampcode.upstream-api-key` | string | `""` | 覆盖用的 Amp 上游 API Key。 |
| `ampcode.upstream-api-keys[].upstream-api-key` | string | `""` | 为特定客户端映射的上游 Key。 |
| `ampcode.upstream-api-keys[].api-keys` | string[] | `[]` | 需要映射到该上游 Key 的客户端密钥。 |
| `ampcode.restrict-management-to-localhost` | boolean | `false` | 是否将 Amp 管理路由限制为 localhost。 |
| `ampcode.force-model-mappings` | boolean | `false` | 是否在检查本地 API 密钥前强制执行模型映射。 |
| `ampcode.model-mappings[].from` | string | `""` | Amp 请求的模型名。 |
| `ampcode.model-mappings[].to` | string | `""` | 本地可用模型名。 |

## OAuth 模型映射

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `oauth-model-mappings` | object | `{}` | 按渠道重命名模型（gemini-cli、vertex、aistudio、antigravity、claude、codex、qwen、iflow）。 |
| `oauth-excluded-models` | object | `{}` | 按渠道排除模型，支持通配符。 |

## Payload 规则

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `payload.default[].models[].name` | string | `""` | 匹配的模型名（可通配）。 |
| `payload.default[].models[].protocol` | string | `""` | 限定协议：`openai`/`gemini`/`claude`/`codex`。 |
| `payload.default[].params` | object | `{}` | 缺省时写入的 JSON 路径 → 值。 |
| `payload.override[].models[].name` | string | `""` | 匹配的模型名（可通配）。 |
| `payload.override[].models[].protocol` | string | `""` | 限定协议。 |
| `payload.override[].params` | object | `{}` | 总是覆盖的 JSON 路径 → 值。 |
