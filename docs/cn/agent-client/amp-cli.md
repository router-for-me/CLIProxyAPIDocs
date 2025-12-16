---
outline: 'deep'
---

# Amp CLI

本指南讲解了如何将 CLIProxyAPI 与 Amp CLI 及 Amp IDE 扩展结合使用。此设置让你能够通过自己的提供商账户（如 Google、ChatGPT Plus 或 Claude Pro）来路由 Amp 的 AI 模型请求，同时使用 API 密钥安全地连接到 Amp 后端进行账户管理。

## 概述

Amp CLI 集成为 Amp 的 API 模式添加了专用路由，同时保持与所有现有 CLIProxyAPI 功能的完全兼容。这使你可以在同一个代理服务器上同时使用传统的 CLIProxyAPI 功能和 Amp CLI。

### 主要特性

- **提供商路由别名**：将 Amp 的 `/api/provider/{provider}/v1...` 模式映射到 CLIProxyAPI 的处理器
- **管理代理**：使用安全的上游 API 密钥将账户管理请求转发到 Amp 的控制平面
- **智能回退**：自动将未配置的模型路由到 ampcode.com
- **密钥管理**：可配置的优先级（配置 > 环境变量 > 文件），带有 5 分钟缓存
- **安全优先**：管理路由需要 API 密钥认证（可选的 localhost 限制）
- **自动 gzip 处理**：解压来自 Amp 上游的响应

### 你可以做什么

- 将 Amp CLI 与你的 Google 账户一起使用（Gemini 3 Pro Preview、Gemini 2.5 Pro、Gemini 2.5 Flash）
- 将 Amp CLI 与你的 ChatGPT Plus/Pro 订阅一起使用（GPT-5、GPT-5 Codex 模型）
- 将 Amp CLI 与你的 Claude Pro/Max 订阅一起使用（Claude Sonnet 4.5、Opus 4.1）
- 将 Amp IDE 扩展（VS Code、Cursor、Windsurf 等）与同一个代理一起使用
- 通过一个代理服务器运行多个 CLI 工具（Factory + Amp）
- 自动将未配置的模型路由到 ampcode.com

### 你应该认证哪些提供商？

**重要提示**：你需要认证的提供商取决于你安装的 Amp 版本当前使用的模型和功能。Amp 为各种代理模式和专门的子代理使用不同的提供商：

- **Smart 模式**：使用 Google/Gemini 模型（Gemini 3 Pro）
- **Rush 模式**：使用 Anthropic/Claude 模型（Claude Haiku 4.5）
- **Oracle 子代理**：使用 OpenAI/GPT 模型（GPT-5 medium reasoning）
- **Librarian 子代理**：使用 Anthropic/Claude 模型（Claude Sonnet 4.5）
- **Search 子代理**：使用 Anthropic/Claude 模型（Claude Haiku 4.5）
- **Review 功能**：使用 Google/Gemini 模型（Gemini 2.5 Flash-Lite）

有关 Amp 使用哪些模型的最新信息，请参阅 **[Amp 模型文档](https://ampcode.com/models)**。

#### 回退行为

CLIProxyAPI 使用一个智能回退系统：

1. **提供商在本地已认证** (`--login`, `--codex-login`, `--claude-login`):
   - 请求使用**你的 OAuth 订阅**（ChatGPT Plus/Pro、Claude Pro/Max、Google 账户）
   - 你可以受益于订阅中包含的使用配额
   - 不消耗 Amp 点数

2. **提供商在本地未认证**:
   - 请求自动转发到 **ampcode.com**
   - 使用 Amp 的后端提供商连接
   - 如果提供商是付费的（OpenAI、Anthropic 付费层级），则**需要 Amp 点数**
   - 如果 Amp 点数余额不足，可能会导致错误

**建议**：认证你拥有订阅的所有提供商，以最大化价值并最小化 Amp 点数的使用。如果你没有订阅 Amp 使用的所有提供商，请确保你有足够的 Amp 点数用于回退请求。

## 架构

### 请求流程

```
Amp CLI/IDE
  ↓
  ├─ 提供商 API 请求 (/api/provider/{provider}/v1/...)
  │   ↓
  │   ├─ 模型在本地配置了吗?
  │   │   是 → 使用本地 OAuth 令牌 (OpenAI/Claude/Gemini 处理器)
  │   │   否  → 转发到 ampcode.com (反向代理)
  │   ↓
  │   响应
  │
  └─ 管理请求 (/api/auth, /api/user, /api/threads, ...)
      ↓
      ├─ 使用 CLIProxyAPI 的 `api-keys` 进行认证
      ↓
      ├─ 可选的 localhost 限制
      ↓
      └─ 反向代理到 ampcode.com (使用 `upstream-api-key`)
          ↓
          响应 (如果是 gzipped 则自动解压)
```

### 组件

Amp 集成是作为一个模块化的路由模块（`internal/api/modules/amp/`）实现的，包含以下组件：

1. **路由别名** (`routes.go`): 将 Amp 风格的路径映射到标准处理器
2. **反向代理** (`proxy.go`): 将管理请求转发到 ampcode.com
3. **回退处理器** (`fallback_handlers.go`): 将未配置的模型路由到 ampcode.com
4. **密钥管理** (`secret.go`): 带缓存的多源 API 密钥解析
5. **主模块** (`amp.go`): 协调注册和配置

## 配置

### 基础配置

将 `ampcode` 块添加到你的 `config.yaml` 中（从 v6.5.37 开始，旧版的 `amp-upstream-*` 密钥会在加载时自动迁移并重写为该结构）：

```yaml
# 供客户端（例如 Amp CLI、VS Code）向 CLIProxyAPI 认证的 API 密钥
api-keys:
  - "your-client-secret-key" # 给你的客户端使用的示例密钥

ampcode:
  # Amp 上游控制平面（管理路由必需）
  upstream-url: "https://ampcode.com"
  # CLIProxyAPI 用来向 ampcode.com 认证的 API 密钥
  # 从 https://ampcode.com/settings 获取
  upstream-api-key: "your-ampcode-api-key-goes-here"
  # 可选：将管理路由限制在 localhost（默认：false）
  restrict-management-to-localhost: false
  # 可选：将缺失的 Amp 模型映射到本地模型
  # model-mappings:
  #   - from: "claude-opus-4.5"
  #     to: "claude-sonnet-4"
```

### 安全设置

#### 管理路由的 API 密钥认证

从 v6.6.15 版本开始，Amp 管理路由（`/api/auth`、`/api/user`、`/api/threads`、`/threads` 等）受到 CLIProxyAPI 标准 API 密钥认证中间件的保护。

- 如果你在 `config.yaml` 中配置了 `api-keys`（推荐做法），这些路由会要求请求中包含一个有效的 API 密钥（`Authorization: Bearer <key>` 或 `X-Api-Key: <key>`），否则将返回 `401 Unauthorized`。
- 本地认证成功后，代理会剥离客户端的 `Authorization`/`X-Api-Key`，并使用 `ampcode.upstream-api-key` 来调用上游的 ampcode.com 服务。

#### `ampcode.restrict-management-to-localhost`

**默认值：`false`**

启用后，管理路由（`/api/auth`、`/api/user`、`/api/threads` 等）只接受来自 localhost (127.0.0.1, ::1) 的连接。这可以防止：

- 路过式浏览器攻击
- 对管理端点的远程访问
- 基于 CORS 的攻击
- 头部欺骗攻击（例如 `X-Forwarded-For: 127.0.0.1`）

#### 工作原理

此限制使用**实际的 TCP 连接地址** (`RemoteAddr`)，而不是像 `X-Forwarded-For` 这样的 HTTP 头部。这可以防止头部欺骗攻击，但有重要的影响：

- ✅ **适用于直接连接**：直接在你的机器或服务器上运行 CLIProxyAPI
- ⚠️ **在反向代理后可能无法工作**：如果部署在 nginx、Cloudflare 或其他代理之后，连接将看起来来自代理的 IP，而不是 localhost

#### 反向代理部署

如果你需要在反向代理（nginx、Caddy、Cloudflare Tunnel 等）后面运行 CLIProxyAPI：

1. **保持 localhost 限制为禁用状态（默认）**：
   ```yaml
   ampcode:
     restrict-management-to-localhost: false
   ```

2. **确保 API 密钥认证已启用**（推荐）：
   - 在 `config.yaml` 中配置 `api-keys`，并让客户端发送密钥
   - 结合防火墙/VPN/零信任控制来减少暴露面

3. **nginx 配置示例**（阻止对管理路由的外部访问）：
   ```nginx
   location /api/auth { deny all; }
   location /api/user { deny all; }
   location /api/threads { deny all; }
   location /api/internal { deny all; }
   ```

**注意**：`ampcode.restrict-management-to-localhost` 是一个额外的加固选项；在反向代理后面，通常保持为 `false`。

## 设置

### 1. 配置 CLIProxyAPI

创建或编辑 `config.yaml`。你将需要两种类型的 API 密钥：
1.  `api-keys`：供像 Amp CLI 这样的客户端连接到你的 CLIProxyAPI 实例。
2.  `ampcode.upstream-api-key`：供 CLIProxyAPI 连接到 `ampcode.com` 后端。请从 **[https://ampcode.com/settings](https://ampcode.com/settings)** 获取。

```yaml
port: 8317
auth-dir: "~/.cli-proxy-api"

# 供客户端（例如 Amp CLI）使用的 API 密钥
api-keys:
  - "your-client-secret-key" # 你可以更改此密钥

# Amp 集成
ampcode:
  upstream-url: "https://ampcode.com"
  # 你在 ampcode.com 的个人 API 密钥
  upstream-api-key: "paste-your-ampcode-api-key-here"
  restrict-management-to-localhost: false

# 其他标准设置...
debug: false
logging-to-file: true
```

### 2. 认证提供商

为你想使用的提供商运行 OAuth 登录：

**Google 账户 (Gemini 2.5 Pro, Gemini 2.5 Flash, Gemini 3 Pro Preview):**
```bash
./cli-proxy-api --login
```

**ChatGPT Plus/Pro (GPT-5, GPT-5 Codex):**
```bash
./cli-proxy-api --codex-login
```

**Claude Pro/Max (Claude Sonnet 4.5, Opus 4.1):**
```bash
./cli-proxy-api --claude-login
```

令牌会保存到：
- Gemini: `~/.cli-proxy-api/gemini-<email>.json`
- OpenAI Codex: `~/.cli-proxy-api/codex-<email>.json`
- Claude: `~/.cli-proxy-api/claude-<email>.json`

### 3. 启动代理

```bash
./cli-proxy-api --config config.yaml
```

### 4. 配置 Amp CLI

#### 选项 A：设置文件

编辑 `~/.config/amp/settings.json`:

```json
{
  "amp.url": "http://localhost:8317",
  "amp.apiKey": "your-client-secret-key"
}
```

#### 选项 B：环境变量

```bash
export AMP_URL=http://localhost:8317
export AMP_API_KEY=your-client-secret-key
```

有了这个配置，`amp login` 命令就不再需要了。

### 5. 使用 Amp

现在你已经准备好使用 Amp 了。所有请求都将通过你的代理进行路由。

```bash
amp "用 Python 写一个 hello world 程序"
```

### 6. (可选) 配置 Amp IDE 扩展

该代理也适用于 VS Code、Cursor、Windsurf 等 Amp IDE 扩展。

1.  在你的 IDE 中打开 Amp 扩展设置。
2.  将 **Amp URL** 设置为 `http://localhost:8317`。
3.  将 **Amp API Key** 设置为你配置的密钥（例如 `your-client-secret-key`）。
4.  开始在你的 IDE 中使用 Amp。
CLI 和 IDE 可以同时使用该代理。

## 用法

### 支持的路由

#### 提供商别名（始终可用）

即使没有配置 `ampcode.upstream-url`，这些路由也能工作：

- `/api/provider/openai/v1/chat/completions`
- `/api/provider/openai/v1/responses`
- `/api/provider/anthropic/v1/messages`
- `/api/provider/google/v1beta/models/:action`

Amp CLI 使用你在 CLIProxyAPI 中配置的经 OAuth 认证的模型来调用这些路由。

#### 管理路由（需要 `ampcode.upstream-url`）

这些路由被代理到 ampcode.com：

- `/api/auth` - 认证
- `/api/user` - 用户资料
- `/api/meta` - 元数据
- `/api/threads` - 对话线程
- `/api/telemetry` - 使用遥测
- `/api/internal` - 内部 API

**安全**：需要一个 API 密钥；`ampcode.restrict-management-to-localhost` 是可选的（默认：false）。

### 模型回退行为

当 Amp 请求一个模型时：

1. **检查本地配置**：CLIProxyAPI 是否有该模型提供商的 OAuth 令牌？
2. **如果有**：路由到本地处理器（使用你的 OAuth 订阅）
3. **如果没有**：转发到 ampcode.com（使用 Amp 的默认路由）

这实现了无缝的混合使用：
- 你已配置的模型（Gemini、ChatGPT、Claude）→ 你的 OAuth 订阅
- 你未配置的模型 → Amp 的默认提供商

### API 调用示例

**使用本地 OAuth 进行聊天补全：**
```bash
curl http://localhost:8317/api/provider/openai/v1/chat/completions \
  -H "Authorization: Bearer <your-cli-proxy-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

**管理端点（需要 API 密钥）：**
```bash
curl http://localhost:8317/api/user \
  -H "Authorization: Bearer <your-cli-proxy-api-key>"
```

## 故障排查

### 常见问题

| 症状 | 可能的原因 | 解决方法 |
|---|---|---|
| `/api/provider/...` 404 | 路由路径不正确 | 确保路径完全匹配: `/api/provider/{provider}/v1...` |
| `/api/user` 401 | 缺少/无效的 API 密钥 | 配置 `api-keys` 并发送 `Authorization: Bearer <key>` 或 `X-Api-Key: <key>` |
| `/api/user` 403 | 启用了 localhost 限制且请求是远程的 | 从同一台机器运行或将 `ampcode.restrict-management-to-localhost` 设置为 `false` |
| 提供商返回 401/403 | 缺少/过期的 OAuth | 重新运行 `--codex-login` 或 `--claude-login` |
| Amp gzip 错误 | 响应解压问题 | 更新到最新版本；自动解压应该能处理这个问题 |
| 模型未使用代理 | Amp URL 错误 | 验证 `amp.url` 设置或 `AMP_URL` 环境变量 |
| CORS 错误 | 受保护的管理端点 | 使用 CLI/终端，而不是浏览器 |

### 诊断

**检查代理日志：**
```bash
# 如果 logging-to-file: true
tail -f logs/requests.log

# 如果在 tmux 中运行
tmux attach-session -t proxy
```

**临时启用调试模式**：
```yaml
debug: true
```

**测试基本连接性：**
```bash
# 检查代理是否正在运行
curl http://localhost:8317/v1/models

# 检查 Amp 特定路由
curl http://localhost:8317/api/provider/openai/v1/models
```

**验证 Amp 配置：**
```bash
# 检查 Amp 是否正在使用代理
amp config get amp.url

# 或检查环境变量
echo $AMP_URL
```

### 安全清单

- ✅ 配置并保护 `api-keys`（管理路由需要 API 密钥）
- ✅ 在可能的情况下启用 `ampcode.restrict-management-to-localhost: true` 以进行额外加固（默认：false）
- ✅ 不要公网暴露代理（绑定到 localhost 或使用防火墙/VPN）
- ✅ 在配置文件中安全地存储你的 `ampcode.upstream-api-key`。
- ✅ 通过重新运行登录命令定期轮换 OAuth 令牌
- ✅ 如果处理敏感数据，将配置和 auth-dir 存储在加密磁盘上
- ✅ 保持代理二进制文件为最新版本以获取安全修复

## 其他资源

- [Amp CLI 官方手册](https://ampcode.com/manual)
