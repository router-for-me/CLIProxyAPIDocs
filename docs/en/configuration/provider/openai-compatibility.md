# OpenAI Compatibility Providers

Configure upstream OpenAI-compatible providers (e.g., OpenRouter) via `openai-compatibility`.

- name: provider identifier used internally
- disabled: optional flag to disable this provider without removing it
- base-url: provider base URL
- api-key-entries: list of API key entries with optional per-key proxy configuration (recommended and persisted)
- models: list of mappings from upstream model `name` to local `alias`

> Compatibility: legacy `api-keys` are migrated into `api-key-entries` on load and removed when the config is saved; use `api-key-entries` going forward.

Example with per-key proxy support:

```yaml
openai-compatibility:
  - name: "openrouter"
    disabled: false
    base-url: "https://openrouter.ai/api/v1"
    api-key-entries:
      - api-key: "sk-or-v1-...b780"
        proxy-url: "socks5://proxy.example.com:1080"
      - api-key: "sk-or-v1-...b781"
    models:
      - name: "moonshotai/kimi-k2:free"
        alias: "kimi-k2"
```

Usage:

Call OpenAI's endpoint `/v1/chat/completions` with `model` set to the alias (e.g., `kimi-k2`). The proxy routes to the configured provider/model automatically.
