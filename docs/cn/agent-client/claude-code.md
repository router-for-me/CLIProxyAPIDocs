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

## Remote Control(手机接管)

Claude Code v2.1.196 起,只要 `ANTHROPIC_BASE_URL` 不是 `api.anthropic.com`,Remote Control
(以及 `/schedule`、claude.ai MCP connectors)就会被直接关闭 —— 与上面的标准接法冲突。

两种选择:

- **不需要 Remote Control** —— 维持上面的配置即可。
- **需要 Remote Control** —— 不要设 `ANTHROPIC_BASE_URL` / `ANTHROPIC_AUTH_TOKEN`,
  改用本地**正向代理**:让 Claude Code 以为直连 `api.anthropic.com`,
  在网络层把 `/v1/messages*` 改道给 CLIProxyAPI(`HTTPS_PROXY` +
  经 `NODE_EXTRA_CA_CERTS` 信任的 MITM 证书)。参考实现:
  [dthinkr/claude-rc-proxy](https://github.com/dthinkr/claude-rc-proxy)。
  注意:若 Anthropic 未来加证书钉扎,此路线会失效。
