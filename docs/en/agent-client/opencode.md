# OpenCode

Start the CLIProxyAPI server, then edit `~/.config/opencode/opencode.json` (create it if it does not exist).

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
