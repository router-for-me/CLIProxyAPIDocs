# Claude Code

编辑 `~/.claude/settings.json` 文件，设置如下内容：

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "<your_api_key>",
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:8317",
    "CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY": "1",
    "API_TIMEOUT_MS": "600000",
    "BASH_DEFAULT_TIMEOUT_MS": "600000",
    "BASH_MAX_TIMEOUT_MS": "600000",
    "CLAUDE_API_TIMEOUT": "600000",
    "CLAUDE_CODE_MAX_CONTEXT_TOKENS": "200000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "95",
    "DISABLE_TELEMETRY": "1",
    "MCP_TIMEOUT": "30000",
    "MCP_TOOL_TIMEOUT": "600000"
  },
  "permissions": {
    "allow": [],
    "deny": [],
    "defaultMode": "bypassPermissions"
  },
  "model": "claude-opus-5",
  "hooks": {},
  "worktree": {
    "baseRef": "fresh"
  },
  "effortLevel": "high",
  "skipDangerousModePermissionPrompt": true,
  "skipWorkflowUsageWarning": true,
  "verbose": true,
  "autoCompactEnabled": true
}
```

## 网关认证

`ANTHROPIC_AUTH_TOKEN` 用于 Claude Code 向 CLIProxyAPI 进行身份验证。请将它
设置为 CLIProxyAPI 配置中 `api-keys` 下的一个值。它只是本地网关凭据，
并不是 Anthropic 或 OpenAI 的上游 API Key。例如，执行 `--codex-login` 后，
CLIProxyAPI 会使用已保存的 ChatGPT OAuth 凭据发送上游请求。

启动 Claude Code 前，请清除 shell 中继承的 Anthropic API Key，避免它的
优先级高于网关 Token：

```bash
unset ANTHROPIC_API_KEY
```

启用网关认证后，Claude Code 无法加载从 claude.ai 同步的连接器，并可能显示
相关警告。可显式禁用这些连接器以隐藏警告：

```bash
export ENABLE_CLAUDEAI_MCP_SERVERS=false
```

此设置仅影响 claude.ai 托管的连接器。直接在 Claude Code 中配置的本地 MCP
服务器和本地 Skills 仍然可用。

## 可复用启动脚本

以下启动脚本将网关认证、模型选择和推理强度集中管理：

```bash
#!/usr/bin/env bash
set -euo pipefail

unset ANTHROPIC_API_KEY
export ANTHROPIC_BASE_URL="${CLIPROXY_BASE_URL:-http://127.0.0.1:8317}"
export ANTHROPIC_AUTH_TOKEN="${CLIPROXY_API_KEY:-sk-dummy}"
export ENABLE_CLAUDEAI_MCP_SERVERS=false

model="${CLIPROXY_MODEL:-gpt-5-codex}"
effort="${CLIPROXY_REASONING_EFFORT:-high}"
model_with_effort="${model}(${effort})"

export ANTHROPIC_DEFAULT_OPUS_MODEL="$model_with_effort"
export ANTHROPIC_DEFAULT_SONNET_MODEL="$model_with_effort"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="$model_with_effort"
export ANTHROPIC_MODEL="$model_with_effort"
export ANTHROPIC_SMALL_FAST_MODEL="$model_with_effort"

exec claude "$@"
```

请将 `sk-dummy` 替换为已配置的 CLIProxyAPI 客户端 Key，或通过
`CLIPROXY_API_KEY` 提供。可使用 `CLIPROXY_MODEL` 和
`CLIPROXY_REASONING_EFFORT` 覆盖默认值。

