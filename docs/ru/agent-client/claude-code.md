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

## Аутентификация через шлюз

`ANTHROPIC_AUTH_TOKEN` используется для аутентификации Claude Code в
CLIProxyAPI. Укажите одно из значений `api-keys` из конфигурации CLIProxyAPI.
Это локальный ключ шлюза, а не API-ключ провайдера Anthropic или OpenAI.
Например, после `--codex-login` CLIProxyAPI использует сохранённые учётные
данные ChatGPT OAuth для запросов к провайдеру.

Перед запуском Claude Code удалите унаследованный API-ключ Anthropic, чтобы он
не имел приоритета над токеном шлюза:

```bash
unset ANTHROPIC_API_KEY
```

При активной аутентификации через шлюз Claude Code не может загрузить
коннекторы, синхронизированные с claude.ai, и может показывать предупреждение.
Чтобы скрыть его, явно отключите эти коннекторы:

```bash
export ENABLE_CLAUDEAI_MCP_SERVERS=false
```

Это влияет только на коннекторы, размещённые на claude.ai. Локальные MCP-серверы,
настроенные непосредственно в Claude Code, и локальные навыки остаются доступны.

## Переиспользуемый скрипт запуска

Следующий скрипт объединяет настройки аутентификации шлюза, выбора модели и
уровня рассуждений:

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

Замените `sk-dummy` на настроенный клиентский ключ CLIProxyAPI или передайте его
через `CLIPROXY_API_KEY`. Значения по умолчанию можно переопределить через
`CLIPROXY_MODEL` и `CLIPROXY_REASONING_EFFORT`.

