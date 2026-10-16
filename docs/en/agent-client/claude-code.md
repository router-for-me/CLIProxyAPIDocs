# Claude Code

Edit the `~/.claude/settings.json` file and add the following content:

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

## Gateway authentication

`ANTHROPIC_AUTH_TOKEN` authenticates Claude Code to CLIProxyAPI. Set it to one
of the values under `api-keys` in your CLIProxyAPI configuration. It is a local
gateway credential, not an Anthropic or OpenAI provider API key. For example,
after `--codex-login`, CLIProxyAPI uses the saved ChatGPT OAuth credential for
upstream requests.

Unset any inherited Anthropic API key before starting Claude Code so that it
cannot take precedence over the gateway token:

```bash
unset ANTHROPIC_API_KEY
```

Claude Code cannot load connectors synced from claude.ai while gateway
authentication is active and may display a warning about them. Disable those
connectors explicitly to suppress the warning:

```bash
export ENABLE_CLAUDEAI_MCP_SERVERS=false
```

This affects only claude.ai-hosted connectors. Local MCP servers configured
directly in Claude Code and local skills remain available.

## Reusable launcher

The following launcher keeps gateway authentication, model selection, and
reasoning effort in one place:

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

Replace `sk-dummy` with a configured CLIProxyAPI client key, or provide it via
`CLIPROXY_API_KEY`. Override the defaults with `CLIPROXY_MODEL` and
`CLIPROXY_REASONING_EFFORT`.

