# Factory Droid

启动 CLIProxyAPI 服务器，然后编辑 `~/.factory/config.json` 文件。

config.json:
```json
{
  "custom_models": [
    {
      "model": "gemini-2.5-pro",
      "base_url": "http://127.0.0.1:8317/v1",
      "api_key": "sk-dummy",
      "provider": "openai"
    },
    {
      "model": "claude-sonnet-4-5-20250929",
      "base_url": "http://127.0.0.1:8317",
      "api_key": "sk-dummy",
      "provider": "anthropic"
    },
    {
      "model": "claude-opus-4-1-20250805",
      "base_url": "http://127.0.0.1:8317",
      "api_key": "sk-dummy",
      "provider": "anthropic"
    },
    {
      "model": "claude-sonnet-4-20250514",
      "base_url": "http://127.0.0.1:8317",
      "api_key": "sk-dummy",
      "provider": "anthropic"
    },
    {
      "model": "gpt-5",
      "base_url": "http://127.0.0.1:8317/v1",
      "api_key": "sk-dummy",
      "provider": "openai"
    },
    {
      "model": "gpt-5-minimal",
      "base_url": "http://127.0.0.1:8317/v1",
      "api_key": "sk-dummy",
      "provider": "openai"
    },
    {
      "model": "gpt-5-low",
      "base_url": "http://127.0.0.1:8317/v1",
      "api_key": "sk-dummy",
      "provider": "openai"
    },
    {
      "model": "gpt-5-medium",
      "base_url": "http://127.0.0.1:8317/v1",
      "api_key": "sk-dummy",
      "provider": "openai"
    },
    {
      "model": "gpt-5-high",
      "base_url": "http://127.0.0.1:8317/v1",
      "api_key": "sk-dummy",
      "provider": "openai"
    },
    {
      "model": "gpt-5-codex",
      "base_url": "http://127.0.0.1:8317/v1",
      "api_key": "sk-dummy",
      "provider": "openai"
    },
    {
      "model": "gpt-5-codex-low",
      "base_url": "http://127.0.0.1:8317/v1",
      "api_key": "sk-dummy",
      "provider": "openai"
    },
    {
      "model": "gpt-5-codex-medium",
      "base_url": "http://127.0.0.1:8317/v1",
      "api_key": "sk-dummy",
      "provider": "openai"
    },
    {
      "model": "gpt-5-codex-high",
      "base_url": "http://127.0.0.1:8317/v1",
      "api_key": "sk-dummy",
      "provider": "openai"
    }
  ]
}
```
