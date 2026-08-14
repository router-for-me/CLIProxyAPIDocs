# Claude Code

Отредактируйте файл `~/.claude/settings.json` и добавьте следующее содержимое:

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
