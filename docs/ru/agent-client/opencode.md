# OpenCode

Запустите сервер CLIProxyAPI, затем отредактируйте файл `~/.config/opencode/opencode.json` (если файла нет, создайте его).

```json
{
    "$schema": "https://opencode.ai/config.json",
    "provider": {
        "openai": {
            "options": {
                "baseURL": "http://127.0.0.1:8317/v1",
                "apiKey": "sk-dummy"
            }
        }
    },
    "model": "gpt-5.3-codex"
}
```
