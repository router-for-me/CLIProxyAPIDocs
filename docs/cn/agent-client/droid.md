# Factory / Droid

先启动 CLIProxyAPI，然后编辑 `~/.factory/settings.json`。

Factory 对 GPT / Codex 系列模型走 OpenAI 兼容路径，所以 `baseUrl` 应该指向代理的 `/v1` 端点。

本文档对应当前 Droid / Factory 的配置格式：

- 文件：`~/.factory/settings.json`
- 模型列表字段：`customModels`
- OpenAI 兼容字段：`baseUrl`、`apiKey`、`provider`

## 最小模型配置

```json
{
  "customModels": [
    {
      "model": "gpt-5.4",
      "id": "custom:gpt-5.4",
      "index": 0,
      "baseUrl": "http://127.0.0.1:8317/v1",
      "apiKey": "sk-dummy",
      "displayName": "GPT 5.4",
      "maxOutputTokens": 128000,
      "noImageSupport": false,
      "provider": "openai"
    }
  ]
}
```

## Fast 别名

如果你想通过 CLIProxyAPI 使用 GPT-5.4 high fast 模式，Factory 里应当填写别名，而不是原始模型名。

示例：

```json
{
  "customModels": [
    {
      "model": "gpt-5.4-high-fast",
      "id": "custom:gpt-5.4-high-fast",
      "index": 0,
      "baseUrl": "http://127.0.0.1:8317/v1",
      "apiKey": "sk-dummy",
      "displayName": "GPT 5.4 High Fast",
      "maxOutputTokens": 128000,
      "noImageSupport": false,
      "provider": "openai"
    }
  ]
}
```

这个别名必须先在 CLIProxyAPI 配置中存在。常见做法是：

- `oauth-model-alias.codex`：把 `gpt-5.4-high-fast` 映射到 `gpt-5.4`
- `payload.override`：注入 `service_tier: "priority"`
- `payload.override`：注入 `reasoning.effort: "high"`

仅仅调用 `/v1` 并不会自动开启 fast 模式。真正的开关是这个别名。

如果你使用的是托管版 CLIProxyAPI，可以通过带认证的 `/v1/models` 检查别名是否已经生效。如果模型列表里没有 `gpt-5.4-high-fast`，说明 harness 配置没有问题，而是代理端还没有加载这个别名。

## 默认模型

如果你想让 Factory 默认使用这个别名，可以把这些设置指向对应的自定义模型 ID：

```json
{
  "sessionDefaultSettings": {
    "model": "custom:gpt-5.4-high-fast",
    "reasoningEffort": "none"
  },
  "missionOrchestratorModel": "custom:gpt-5.4-high-fast",
  "missionOrchestratorReasoningEffort": "none",
  "missionModelSettings": {
    "workerModel": "custom:gpt-5.4-high-fast",
    "workerReasoningEffort": "none",
    "validationWorkerModel": "custom:gpt-5.4-high-fast",
    "validationWorkerReasoningEffort": "none"
  }
}
```

如果代理别名已经注入了 `reasoning.effort: "high"`，建议把 Factory 这一层的 `reasoningEffort` 保持为 `none`，避免两层同时控制同一个请求。

## 说明

- 通过 CLIProxyAPI 路由 GPT / Codex 系列模型时，使用 `provider: "openai"`
- OpenAI 兼容路径的 `baseUrl` 使用 `http://127.0.0.1:8317/v1`
- 如果同一份配置里还要接入 Anthropic 原生模型，它们的 `provider` 和 `baseUrl` 形式不同

## 排查

- `POST /v1/responses` 调用别名返回 `502`，但原始 `gpt-5.4` 还能正常工作：
  通常说明代理端还没有加载别名配置。
- `/v1/models` 中看不到别名：
  说明当前运行实例没有启用那份代理配置。
- 热重载没有感知到配置修改：
  如果你是先删除 `config.yaml` 再重新写入，建议直接重启服务。对于配置热重载，原地编辑通常比删除后重建更可靠。
