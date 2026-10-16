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

## Remote Control

Claude Code v2.1.196+ disables Remote Control (and `/schedule`, claude.ai MCP connectors) whenever `ANTHROPIC_BASE_URL` points anywhere other than `api.anthropic.com`. The standard setup above therefore conflicts with it.

Options:

- **Don't need Remote Control** — keep the setup above, nothing to do.
- **Need Remote Control** — don't set `ANTHROPIC_BASE_URL`/`ANTHROPIC_AUTH_TOKEN`. Instead run a local **forward proxy** that keeps the base URL at `api.anthropic.com` and reroutes `/v1/messages*` to CLIProxyAPI at the network layer (`HTTPS_PROXY` + a MITM cert trusted via `NODE_EXTRA_CA_CERTS`). Reference implementation: [dthinkr/claude-rc-proxy](https://github.com/dthinkr/claude-rc-proxy). Note this breaks if Anthropic ever adds certificate pinning.
