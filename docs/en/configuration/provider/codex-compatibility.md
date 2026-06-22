# Codex Compatibility Providers

Configure upstream Codex compatible providers via `codex-api-key`.

- api-key: API key for the provider
- base-url: provider base URL
- proxy-url: optional proxy URL for the provider

Example:
```yaml
codex-api-key:
  - api-key: "sk-atSM..."
    base-url: "https://www.example.com" # use the custom codex API endpoint
    proxy-url: "socks5://proxy.example.com:1080" # optional: per-key proxy override
```

## Compact models

`codex-api-key` can expose any upstream model that your Codex-compatible provider actually supports.
If the upstream supports them, you can map compact models such as `gpt-5.3-codex-spark` or `gpt-5.4-mini` with `models[].name` and optionally give them client-facing aliases with `models[].alias`.

Example:

```yaml
codex-api-key:
  - api-key: "sk-atSM..."
    base-url: "https://www.example.com/v1"
    models:
      - name: "gpt-5.4-mini"
        alias: "codex-mini"
      - name: "gpt-5.3-codex-spark"
        alias: "codex-spark"
```

## Fast mode

For Codex-compatible providers, the recommended fast-mode setup is the same idea as OAuth-backed Codex:

1. expose a client-facing alias under `codex-api-key[].models`
2. inject `service_tier: "priority"` with `payload.override`
3. optionally pin `reasoning.effort`

If your client only uses the standard `v1` endpoints and does not send `service_tier`, use the alias as the model name and let CLIProxyAPI inject `service_tier: "priority"` on the server side.
The endpoint alone does not switch the request into fast mode.

Example:

```yaml
codex-api-key:
  - api-key: "sk-atSM..."
    base-url: "https://www.example.com/v1"
    models:
      - name: "gpt-5.4"
        alias: "gpt-5.4-high-fast"

payload:
  override:
    - models:
        - name: "gpt-5.4-high-fast"
          protocol: "codex"
      params:
        "service_tier": "priority"
        "reasoning.effort": "high"
```

## OpenAI-compatible upstreams

If you are routing through `openai-compatibility` instead of `codex-api-key`, the aliasing pattern is the same, but fast-tier behavior depends on whether that upstream actually accepts and honors `service_tier`.
