# Codex

## 配置为OAuth登录模式（推荐）

启动 CLIProxyAPI 服务器，然后使用 ChatGPT 账户（任意订阅，包含免费账户）登录 Codex CLI 或者 Codex App。

修改 `~/.codex/config.toml` 文件，添加以下内容：

```toml
model = "gpt-5.6-sol" # 或者是gpt-5.6-terra、gpt-5.6-luna，你也可以使用任何我们支持的模型
model_provider = "cliproxyapi"

# 无需确认是否执行操作，危险指令，初次接触codex不建议开启，移除#号即可开启
# approval_policy = "never"

# 沙箱模式超高权限，危险指令，初次接触codex不建议开启，移除#号即可开启
# sandbox_mode = "danger-full-access" 

model_reasoning_effort = "xhigh"
plan_mode_reasoning_effort = "xhigh"

[model_providers.cliproxyapi]
base_url = "http://127.0.0.1:8317/v1"
experimental_bearer_token = "sk-dummy" # 这里修改为你在 CLIProxyAPI 中为 Codex 创建的 API Key
name = "OpenAI"
wire_api = "responses"
requires_openai_auth = true
supports_websockets = true # 按需要选择是否开启websockets
```

无需修改 `auth.json` 文件。

## 配置为API模式

启动 CLIProxyAPI 服务器，修改 `~/.codex/config.toml` 和 `~/.codex/auth.json` 文件。

config.toml:
```toml
# 无需确认是否执行操作，危险指令，初次接触codex不建议开启，移除#号即可开启
# approval_policy = "never"

# 沙箱模式超高权限，危险指令，初次接触codex不建议开启，移除#号即可开启
# sandbox_mode = "danger-full-access"

model_provider = "cliproxyapi"
model = "gpt-5.6-sol" # 或者是gpt-5.6-terra、gpt-5.6-luna，你也可以使用任何我们支持的模型
model_reasoning_effort = "high"

[model_providers.cliproxyapi]
name = "cliproxyapi"
base_url = "http://127.0.0.1:8317/v1"
wire_api = "responses"
http_headers = { "X-OpenAI-Actor-Authorization" = "local-proxy" }
```

auth.json:
```json
{
  "OPENAI_API_KEY": "sk-dummy"
}
```