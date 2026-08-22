# Z.AI / GLM (OAuth Login)

CLIProxyAPI supports Z.AI GLM coding plans through OAuth — no API key required. Two identity providers are available: **Z.AI international** (`chat.z.ai`) and **BigModel / Zhipu** (China mainland, `bigmodel.cn`). After login the account is exposed as the `zai` provider and serves GLM models through the Anthropic-compatible endpoint by default (`https://api.z.ai/api/anthropic` for Z.AI, `https://open.bigmodel.cn/api/anthropic` for BigModel).

## Login

### Z.AI (international)

```bash
./cli-proxy-api --zai-login
```

### BigModel (China mainland)

```bash
./cli-proxy-api --zai-login --zai-provider bigmodel
```

No API key is needed — after authorization the login provisions a standard coding-plan API key automatically (the same step the official client performs).

Options: add `--no-browser` to print the login URL instead of opening a browser.

- **Z.AI** uses a server-mediated CLI flow (poll based); no local callback server is started.
- **BigModel** completes the login through a local loopback callback. It binds an automatic free port by default; override it with `--oauth-callback-port <port>`:

```bash
./cli-proxy-api --zai-login --zai-provider bigmodel --oauth-callback-port <port>
```

Because the BigModel callback is a loopback address, the browser and the proxy must run on the same host (always the case for the CLI login).

## Supported Models

- `glm-4.5`
- `glm-4.5-air`
- `glm-4.6`
- `glm-4.7`
- `glm-5`
- `glm-5-turbo`
- `glm-5.1`
- `glm-5.2`

GLM models are hybrid reasoning: thinking can be disabled, and `glm-5.2` exposes two thinking-effort levels (`high`, `max`).

## Model Controls

Use the `zai` channel under `oauth-model-alias` to expose a different client-visible model name:

```yaml
oauth-model-alias:
  zai:
    - name: "glm-4.6"
      alias: "glm-latest"
```

Use the same channel under `oauth-excluded-models` to hide models from listing and routing:

```yaml
oauth-excluded-models:
  zai:
    - "glm-4.5-air"
```

## Request Notes

The OAuth token is not itself an inference credential, so the login provisions a standard coding-plan API key and sends it as `x-api-key` to the Anthropic-compatible endpoint, which has no client/captcha check. The minted key is stored in the authentication files and used for model routing; GLM requests are translated through the Anthropic-compatible path.
