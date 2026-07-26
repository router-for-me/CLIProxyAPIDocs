# Codex

## Настройка режима OAuth-авторизации (рекомендуется)

Запустите сервер CLIProxyAPI, затем войдите в Codex CLI или Codex App, используя учётную запись ChatGPT (любая подписка, включая бесплатную).

Отредактируйте файл `~/.codex/config.toml` и добавьте следующее содержимое:

```toml
model = "gpt-5.6-sol" # Или gpt-5.6-terra, gpt-5.6-luna, вы также можете использовать любую из поддерживаемых нами моделей.
model_provider = "cliproxyapi"

# Отключает все запросы на подтверждение действий. Опасно — не рекомендуется для новичков в Codex. Удалите # для включения.
# approval_policy = "never"

# Предоставляет неограниченный доступ к системе. Опасно — не рекомендуется для новичков в Codex. Удалите # для включения.
# sandbox_mode = "danger-full-access" 

model_reasoning_effort = "xhigh"
plan_mode_reasoning_effort = "xhigh"

[model_providers.cliproxyapi]
base_url = "http://127.0.0.1:8317/v1"
experimental_bearer_token = "sk-dummy" # Замените на API-ключ, созданный для Codex в CLIProxyAPI
name = "OpenAI"
wire_api = "responses"
requires_openai_auth = true
supports_websockets = true # При необходимости выберите, включать ли websockets
```

Редактировать файл `auth.json` не требуется.

## Настройка режима API

Запустите сервер CLIProxyAPI, а затем отредактируйте файлы `~/.codex/config.toml` и `~/.codex/auth.json`.

config.toml:
```toml
# Отключает все запросы на подтверждение действий. Опасно — не рекомендуется для новичков в Codex. Удалите # для включения.
# approval_policy = "never"

# Предоставляет неограниченный доступ к системе. Опасно — не рекомендуется для новичков в Codex. Удалите # для включения.
# sandbox_mode = "danger-full-access"

model_provider = "cliproxyapi"
model = "gpt-5.6-sol" # Или gpt-5.6-terra, gpt-5.6-luna, вы также можете использовать любую из поддерживаемых нами моделей.
model_reasoning_effort = "high"

[model_providers.cliproxyapi]
name = "cliproxyapi"
base_url = "http://127.0.0.1:8317/v1"
wire_api = "responses"
http_headers = { "X-OpenAI-Actor-Authorization" = "local-proxy" }
```

auth.json:
```json
{
  "OPENAI_API_KEY": "sk-dummy"
}
```