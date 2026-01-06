# 基础配置

## 配置文件

服务器默认使用项目根目录的 YAML 配置文件（`config.yaml`）。可通过 `--config` 指定其他路径：

```bash
./cli-proxy-api --config /path/to/your/config.yaml
```

### 配置文件示例

```yaml
# 服务器绑定主机/接口，默认空字符串同时绑定 IPv4/IPv6。
# 使用 "127.0.0.1" 或 "localhost" 可限制仅本机访问。
host: ""

# 服务器端口
port: 8317

# TLS 设置：启用后使用提供的证书与私钥监听 HTTPS。
tls:
  enable: false
  cert: ""
  key: ""

# 管理 API 设置
remote-management:
  # 是否允许远程（非 localhost）访问管理接口。
  # 为 false 时仅允许 localhost，仍需管理密钥。
  allow-remote: false

  # 管理密钥。若填写明文，启动时会自动哈希后生效。
  # 所有管理请求（包括本地）都需要该密钥。
  # 留空则完全禁用管理 API（所有 /v0/management 路由返回 404）。
  secret-key: ""

  # 为 true 时禁用内置管理面板资源下载与路由。
  disable-control-panel: false

  # 管理面板的 GitHub 仓库，可填写仓库 URL 或 releases API URL。
  panel-github-repository: "https://github.com/router-for-me/Cli-Proxy-API-Management-Center"

# 认证目录（支持 ~ 展开为主目录）
auth-dir: "~/.cli-proxy-api"

# 用于请求认证的 API 密钥
api-keys:
  - "your-api-key-1"
  - "your-api-key-2"
  - "your-api-key-3"

# 是否启用调试日志
debug: false

# 为 true 时禁用高开销 HTTP 中间件以降低高并发下的内存占用
commercial-mode: false

# 为 true 时将应用日志写入滚动文件而非 stdout
logging-to-file: false

# 日志目录的最大总大小（MB）；超过后会删除最旧的日志。0 表示不限制。
logs-max-total-size-mb: 0

# 为 false 时禁用内存用量统计聚合
usage-statistics-enabled: false

# 代理地址。支持 socks5/http/https，例如 socks5://user:pass@192.168.1.1:1080/
proxy-url: ""

# 为 true 时，无前缀模型请求只会匹配无前缀凭据（除非前缀与模型名相同）。
force-model-prefix: false

# 请求重试次数；当响应码为 403/408/500/502/503/504 时重试。
request-retry: 3

# 冷却中的凭据等待的最长时间（秒），超过则触发重试。
max-retry-interval: 30

# 配额超限时的处理
quota-exceeded:
  switch-project: true # 配额超限时是否自动切换其他项目
  switch-preview-model: true # 配额超限时是否自动切换预览模型

# 多凭据匹配时的路由策略
routing:
  strategy: "round-robin" # 轮询（默认）或 fill-first

# 是否为 WebSocket API (/v1/ws) 启用认证
ws-auth: false

# 流式传输行为（SSE keep-alive 与安全启动重试）
streaming:
  keepalive-seconds: 15   # 默认 0（禁用）；≤0 关闭 keep-alive。
  bootstrap-retries: 1    # 默认 0（禁用）；首字节前的重试次数。

# Gemini API 密钥
gemini-api-key:
  - api-key: "AIzaSy...01"
    prefix: "test" # 可选：需要以 "test/gemini-3-pro-preview" 访问
    base-url: "https://generativelanguage.googleapis.com"
    headers:
      X-Custom-Header: "custom-value"
    proxy-url: "socks5://proxy.example.com:1080"
    models:
      - name: "gemini-2.5-flash" # 上游模型名
        alias: "gemini-flash"    # 客户端别名
    excluded-models:
      - "gemini-2.5-pro"     # 精确排除
      - "gemini-2.5-*"       # 前缀通配
      - "*-preview"          # 后缀通配
      - "*flash*"            # 子串通配
  - api-key: "AIzaSy...02"

# Codex API 密钥
codex-api-key:
  - api-key: "sk-atSM..."
    prefix: "test" # 可选：需以 "test/gpt-5-codex" 访问
    base-url: "https://www.example.com" # 自定义 Codex 端点
    headers:
      X-Custom-Header: "custom-value"
    proxy-url: "socks5://proxy.example.com:1080" # 可选：单独代理
    models:
      - name: "gpt-5-codex"   # 上游模型名
        alias: "codex-latest" # 客户端别名
    excluded-models:
      - "gpt-5.1"         # 精确排除
      - "gpt-5-*"         # 前缀通配
      - "*-mini"          # 后缀通配
      - "*codex*"         # 子串通配

# Claude API 密钥
claude-api-key:
  - api-key: "sk-atSM..." # 使用官方 Claude API 时无需 base-url
  - api-key: "sk-atSM..."
    prefix: "test" # 可选：需以 "test/claude-sonnet-latest" 访问
    base-url: "https://www.example.com" # 自定义 Claude 端点
    headers:
      X-Custom-Header: "custom-value"
    proxy-url: "socks5://proxy.example.com:1080" # 可选：单独代理
    models:
      - name: "claude-3-5-sonnet-20241022" # 上游模型名
        alias: "claude-sonnet-latest"      # 客户端别名
    excluded-models:
      - "claude-opus-4-5-20251101" # 精确排除
      - "claude-3-*"               # 前缀通配
      - "*-thinking"               # 后缀通配
      - "*haiku*"                  # 子串通配

# OpenAI 兼容提供商
openai-compatibility:
  - name: "openrouter" # 提供商名称，用于 UA 等
    prefix: "test" # 可选：需以 "test/kimi-k2" 访问
    base-url: "https://openrouter.ai/api/v1" # 提供商基础 URL
    headers:
      X-Custom-Header: "custom-value"
    api-key-entries:
      - api-key: "sk-or-v1-...b780"
        proxy-url: "socks5://proxy.example.com:1080" # 可选：单独代理
      - api-key: "sk-or-v1-...b781" # 无代理
    models: # 提供商支持的模型
      - name: "moonshotai/kimi-k2:free" # 上游模型名
        alias: "kimi-k2" # 客户端别名

# Vertex API 密钥（Vertex 兼容端点，使用 API key + base URL）
vertex-api-key:
  - api-key: "vk-123..."                        # x-goog-api-key 头
    prefix: "test"                              # 可选前缀
    base-url: "https://example.com/api"         # 例如 https://zenmux.ai/api
    proxy-url: "socks5://proxy.example.com:1080" # 可选单独代理
    headers:
      X-Custom-Header: "custom-value"
    models:                                     # 可选：别名到上游模型
      - name: "gemini-2.5-flash"                # 上游模型名
        alias: "vertex-flash"                   # 客户端别名
      - name: "gemini-2.5-pro"
        alias: "vertex-pro"

# Amp 集成
ampcode:
  # Amp CLI OAuth 与管理功能的上游地址
  upstream-url: "https://ampcode.com"
  # 可选：覆盖 Amp 上游 API Key（否则使用环境变量或文件）
  upstream-api-key: ""
  # 按客户端的上游 API Key 映射
  # 将顶层 api-keys 中的客户端密钥映射到不同的 Amp 上游密钥。
  # 若未匹配到则回退到 upstream-api-key。
  upstream-api-keys:
    - upstream-api-key: "amp_key_for_team_a"    # 供这些客户端使用的上游密钥
      api-keys:                                 # 使用该上游密钥的客户端密钥
        - "your-api-key-1"
        - "your-api-key-2"
    - upstream-api-key: "amp_key_for_team_b"
      api-keys:
        - "your-api-key-3"
  # 是否将 Amp 管理路由 (/api/auth, /api/user 等) 仅限 localhost（默认 false）
  restrict-management-to-localhost: false
  # 是否在检查本地 API 密钥前强制执行模型映射（默认 false）
  force-model-mappings: false
  # Amp 模型映射：当请求的模型不可用时路由到本地可用模型
  # 适用于 Amp CLI 请求不可用模型（如 Claude Opus 4.5）但本地有相似模型的情况
  model-mappings:
    - from: "claude-opus-4-5-20251101"          # Amp 请求的模型
      to: "gemini-claude-opus-4-5-thinking"     # 路由到的可用模型
    - from: "claude-sonnet-4-5-20250929"
      to: "gemini-claude-sonnet-4-5-thinking"
    - from: "claude-haiku-4-5-20251001"
      to: "gemini-2.5-flash"

# 全局 OAuth 模型重命名（按渠道）
# 为模型列表与请求路由改名。
# 支持渠道：gemini-cli、vertex、aistudio、antigravity、claude、codex、qwen、iflow。
# 注意：不适用于 gemini-api-key、codex-api-key、claude-api-key、openai-compatibility、vertex-api-key、ampcode。
oauth-model-mappings:
  gemini-cli:
    - name: "gemini-2.5-pro"          # 该渠道下的原始模型名
      alias: "g2.5p"                  # 客户端可见别名
      fork: true                      # true 表示保留原名并同时增加别名（默认 false）
  vertex:
    - name: "gemini-2.5-pro"
      alias: "g2.5p"
  aistudio:
    - name: "gemini-2.5-pro"
      alias: "g2.5p"
  antigravity:
    - name: "gemini-3-pro-preview"
      alias: "g3p"
  claude:
    - name: "claude-sonnet-4-5-20250929"
      alias: "cs4.5"
  codex:
    - name: "gpt-5"
      alias: "g5"
  qwen:
    - name: "qwen3-coder-plus"
      alias: "qwen-plus"
  iflow:
    - name: "glm-4.7"
      alias: "glm-god"

# OAuth 提供商的模型排除列表
oauth-excluded-models:
  gemini-cli:
    - "gemini-2.5-pro"     # 精确排除
    - "gemini-2.5-*"       # 前缀通配
    - "*-preview"          # 后缀通配
    - "*flash*"            # 子串通配
  vertex:
    - "gemini-3-pro-preview"
  aistudio:
    - "gemini-3-pro-preview"
  antigravity:
    - "gemini-3-pro-preview"
  claude:
    - "claude-3-5-haiku-20241022"
  codex:
    - "gpt-5-codex-mini"
  qwen:
    - "vision-model"
  iflow:
    - "tstars2.0"

# 可选的 payload 配置
payload:
  default: # 仅在 payload 缺少对应字段时写入
    - models:
        - name: "gemini-2.5-pro" # 支持通配（如 "gemini-*"）
          protocol: "gemini" # 限定协议：openai、gemini、claude、codex
      params: # JSON 路径（gjson/sjson 语法）到值
        "generationConfig.thinkingConfig.thinkingBudget": 32768
  override: # 总是写入并覆盖已有值
    - models:
        - name: "gpt-*" # 支持通配
          protocol: "codex" # 限定协议
      params: # JSON 路径到值
        "reasoning.effort": "high"
```
