# Codex (OpenAI via OAuth)

```bash
./cli-proxy-api --codex-login
```

Options: add `--no-browser` to print the login URL instead of opening a browser. The local OAuth callback uses port `1455`.

## Supported model notes

Codex OAuth uses the server's model registry plus any aliases you expose in config.

- `gpt-5.3-codex-spark` is supported as a fast Codex model.
- `gpt-5.4-mini` is supported on the Codex path.
- `gpt-5.4-nano` is not available on the Codex OAuth path because it is API-only rather than Codex-backed.

## Fast mode

CLIProxyAPI does not currently expose a built-in `*-fast` Codex model family.
The recommended pattern is:

1. expose a client-facing alias with `oauth-model-alias.codex`
2. inject `service_tier: "priority"` with `payload.override`
3. optionally inject `reasoning.effort` on the same alias

If your client only calls the normal `v1` endpoints and never sends `service_tier` itself, this alias-plus-payload pattern is the supported way to request fast mode.
Calling `/v1/chat/completions` or `/v1/responses` by itself does not enable fast mode.

Example:

```yaml
oauth-model-alias:
  codex:
    - name: "gpt-5.4"
      alias: "gpt-5.4-high-fast"
      fork: true

payload:
  override:
    - models:
        - name: "gpt-5.4-high-fast"
          protocol: "codex"
      params:
        "service_tier": "priority"
        "reasoning.effort": "high"
```

Then call the alias as your model name:

```json
{
  "model": "gpt-5.4-high-fast",
  "input": "Reply with exactly OK."
}
```

## Endpoint caveat

For Codex fast-tier behavior, prefer the OpenAI Responses surface:

- `POST /v1/responses`: preserves `service_tier: "priority"` on the current Codex path
- `POST /v1/chat/completions`: still translates into Codex Responses internally, but the current Codex translation path does not reliably preserve `service_tier`

If your client can choose, use `wire_api = "responses"` or call `/v1/responses` directly when you need fast-mode behavior.
If your client is locked to `/v1/chat/completions`, the docs should treat fast mode as best-effort rather than guaranteed on the current Codex path.
