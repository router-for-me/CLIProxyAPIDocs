# Codex

Start CLIProxyAPI server, and then edit the `~/.codex/config.toml` and `~/.codex/auth.json` files.

config.toml:
```toml
# Disables all user confirmation prompts for actions. Extremely dangerous—remove this setting if you're new to Codex.
# approval_policy = "never"

# Grants unrestricted system access: AI can read/write any file and execute network-enabled commands. Highly risky—remove this setting if you're new to Codex.
# sandbox_mode = "danger-full-access"

model_provider = "cliproxyapi"
model = "gpt-5-codex" # Or gpt-5, you can also use any of the models that we support.
model_reasoning_effort = "high"

[model_providers.cliproxyapi]
name = "cliproxyapi"
base_url = "http://127.0.0.1:8317/v1"
wire_api = "responses"
```

auth.json:
```json
{
  "OPENAI_API_KEY": "sk-dummy"
}
```
