# xAI / Grok (OAuth Login)

CLIProxyAPI supports Grok Build accounts through xAI OAuth. After login, the account is exposed as the `xai` provider and uses the xAI API base URL `https://api.x.ai/v1` by default.

## Login

```bash
./cli-proxy-api --xai-login
```

Options: add `--no-browser` to print the login URL instead of opening a browser. The local OAuth callback listens on `127.0.0.1:56121/callback` by default.

If the default callback port is unavailable, override it:

```bash
./cli-proxy-api --xai-login --oauth-callback-port <port>
```

In a remote or headless environment, follow the SSH tunnel instructions printed by the command. If the CLI asks for a manual callback token, paste only the token value, not the full callback URL.

## Supported APIs

- Text models are routed to xAI's Responses API and can be called through the OpenAI-compatible endpoints such as `/v1/responses` and `/v1/chat/completions`.
- Image requests use `/v1/images/generations` and `/v1/images/edits` with `grok-imagine-image` or `grok-imagine-image-quality`.
- Video requests use `/v1/videos`, `/v1/videos/generations`, `/v1/videos/edits`, `/v1/videos/extensions`, and `/v1/videos/{request_id}` with `grok-imagine-video`.

For xAI image and video models, model names can be used directly or with an `xai/`, `x-ai/`, or `grok/` prefix.

## Model Controls

Use the `xai` channel under `oauth-model-alias` to expose a different client-visible model name:

```yaml
oauth-model-alias:
  xai:
    - name: "grok-4.3"
      alias: "grok-latest"
```

Use the same channel under `oauth-excluded-models` to hide models from listing and routing:

```yaml
oauth-excluded-models:
  xai:
    - "grok-3-mini"
```

## Request Notes

CLIProxyAPI normalizes xAI Responses requests before sending them upstream. Unsupported continuation/cache fields are removed, tool definitions are adjusted for xAI compatibility, and reasoning settings are kept only for Grok models that support reasoning effort.
