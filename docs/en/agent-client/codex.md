# Codex

## Configure as OAuth Login Mode (Recommended)

Start CLIProxyAPI server, then log in to Codex CLI or Codex App using your ChatGPT account (any subscription, including free accounts).

Edit the `~/.codex/config.toml` file and add the following content:

```toml
model = "gpt-5.5" # Or gpt-5.5, you can also use any of the models that we support.
model_provider = "cliproxyapi"

# Disables all user confirmation prompts for actions. Dangerous—not recommended for Codex beginners. Remove the # to enable.
# approval_policy = "never"

# Grants unrestricted sandbox access. Dangerous—not recommended for Codex beginners. Remove the # to enable.
# sandbox_mode = "danger-full-access" 

model_reasoning_effort = "xhigh"
plan_mode_reasoning_effort = "xhigh"
supports_websockets = true

[model_providers.cliproxyapi]
base_url = "http://127.0.0.1:8317/v1"
experimental_bearer_token = "sk-dummy" # Replace with the API Key you created for Codex in CLIProxyAPI
name = "cliproxyapi"
wire_api = "responses"
requires_openai_auth = true
```

No need to edit the `auth.json` file.

## Configure as API Mode

Start CLIProxyAPI server, and then edit the `~/.codex/config.toml` and `~/.codex/auth.json` files.

config.toml:
```toml
# Disables all user confirmation prompts for actions. Dangerous—not recommended for Codex beginners. Remove the # to enable.
# approval_policy = "never"

# Grants unrestricted sandbox access. Dangerous—not recommended for Codex beginners. Remove the # to enable.
# sandbox_mode = "danger-full-access"

model_provider = "cliproxyapi"
model = "gpt-5.5" # Or gpt-5.4, you can also use any of the models that we support.
model_reasoning_effort = "high"

[model_providers.cliproxyapi]
name = "cliproxyapi"
base_url = "http://127.0.0.1:8317/v1"
wire_api = "responses"
```

`wire_api = "responses"` is also the recommended setting when you use a Codex fast alias backed by `service_tier: "priority"`, because the current Codex fast-tier behavior is most reliable on the Responses path.

auth.json:
```json
{
  "OPENAI_API_KEY": "sk-dummy"
}
```