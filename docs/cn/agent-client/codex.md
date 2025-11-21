# Codex

启动 CLI Proxy API 服务器, 修改 `~/.codex/config.toml` 和 `~/.codex/auth.json` 文件。

config.toml:
```toml
# 无需确认是否执行操作，危险指令，初次接触codex不建议开启，移除#号即可开启
# approval_policy = "never"

# 沙箱模式超高权限，危险指令，初次接触codex不建议开启，移除#号即可开启
# sandbox_mode = "danger-full-access"

model_provider = "cliproxyapi"
model = "gpt-5-codex" # 或者是gpt-5，你也可以使用任何我们支持的模型
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
