# OpenCode

启动 CLIProxyAPI 服务器, 修改 `~/.config/opencode/opencode.json` 文件(如果没有就新建)。

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


