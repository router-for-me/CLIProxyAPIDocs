---
outline: 'deep'
---

# 模型路由能力

模型路由能力允许插件在宿主把请求模型解析为 provider、并选择凭证之前，决定匹配的模型请求应该由哪里执行。

适用场景包括根据请求体、请求头、查询参数或客户端原始模型，在以下目标之间选择：

- 当前路由插件自己的执行器；
- 另一个插件执行器；
- 内置 provider 路径，例如 `codex`、`antigravity`、`xai` 或 `claude`。

## 能力字段

```json
{
  "capabilities": {
    "model_router": true
  }
}
```

如果路由器可能把请求路由到自己的执行器，也要声明执行器能力：

```json
{
  "capabilities": {
    "model_router": true,
    "executor": true,
    "executor_model_scope": "static",
    "executor_input_formats": ["claude"],
    "executor_output_formats": ["claude"]
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`ModelRouter`、`ModelRouteRequest`、`ModelRouteResponse`、`ModelRouteTargetKind`
- `sdk/pluginabi/types.go`：`model.route`
- `internal/pluginhost/model_router.go`：路由优先级、目标校验和内置 provider 可用性检查
- `sdk/api/handlers/handlers.go`：常规 provider/auth 解析前的请求入口

示例参考：

- `examples/plugin/claude-web-search-router/go/main.go`
- `examples/plugin/claude-web-search-router/go/fallback.go`

## 方法

| 方法 | 作用 |
| --- | --- |
| `model.route` | 为当前客户端请求返回路由决定。 |

## 运行时机

宿主会在常规模型到 provider 的解析和凭证选择之前询问已启用的模型路由器。高优先级插件先执行。路由器返回 `Handled: false`、目标无效或目标不可用时，宿主会跳过该结果并尝试下一个路由器。没有路由器处理请求时，继续走宿主常规路径。

请求仍保持客户端原始协议。例如 Claude 兼容请求会以 `SourceFormat: "claude"` 进入，原始 Claude 请求体放在 `Body` 中。

## 请求

```json
{
  "Plugin": {},
  "PluginID": "claude-web-search-router",
  "SourceFormat": "claude",
  "RequestedModel": "claude-sonnet-4-6",
  "Stream": true,
  "Headers": {},
  "Query": {},
  "Body": "base64-client-body",
  "Metadata": {},
  "AvailableProviders": ["antigravity", "codex", "xai"]
}
```

重要字段：

| 字段 | 说明 |
| --- | --- |
| `PluginID` | 当前被调用的路由插件在宿主内的 ID。 |
| `SourceFormat` | 客户端原始协议格式，例如 `openai`、`claude` 或 `gemini`。 |
| `RequestedModel` | provider/auth 解析前的客户端请求模型。 |
| `Stream` | 客户端是否期望流式输出。 |
| `Headers` / `Query` | 入站请求头和查询参数。 |
| `Body` | 原始客户端请求体。在 RPC JSON 中会以 base64 表示。 |
| `Metadata` | 尽力复制的请求上下文快照。按只读、JSON-like 数据处理。 |
| `AvailableProviders` | 当前已有凭证注册的内置 provider key。返回 `TargetKind: "provider"` 前应先检查它。 |

## 响应

不处理：

```json
{
  "Handled": false
}
```

路由到当前插件自己的执行器：

```json
{
  "Handled": true,
  "TargetKind": "self",
  "Reason": "matched_web_search"
}
```

路由到另一个插件执行器：

```json
{
  "Handled": true,
  "TargetKind": "executor",
  "Target": "search-executor",
  "Reason": "matched_search_executor"
}
```

路由到内置 provider：

```json
{
  "Handled": true,
  "TargetKind": "provider",
  "Target": "codex",
  "TargetModel": "gpt-5.4-mini",
  "Reason": "matched_codex_web_search"
}
```

## 目标类型

| TargetKind | Target | TargetModel | 行为 |
| --- | --- | --- | --- |
| `self` | 插件返回值会被忽略；宿主使用当前路由插件 ID。 | 忽略。 | 执行当前路由插件自己的执行器。 |
| `executor` | 目标插件 ID。 | 忽略。 | 直接执行另一个插件执行器。 |
| `provider` | 内置 provider key。 | 可选模型覆盖。 | 继续走内置 AuthManager 和 provider 执行器路径。 |

直接插件执行器路由不会先选择凭证。目标执行器必须声明执行器能力，必须通过 `executor_model_scope: "static"` 或 `"both"` 允许静态执行，并且必须支持当前请求的输入/输出协议格式。

provider 路由必须指向 `AvailableProviders` 中存在的 provider。`TargetModel` 为空时，宿主保留客户端原始请求模型。如果目标 provider 需要 provider 原生模型名，应显式设置 `TargetModel`，不要直接转发客户端模型名。

## 配置示例

`claude-web-search-router` 示例使用 ModelRouter 检测 Claude Code 内置 `web_search` 请求，并把请求路由到支持 web search 的内置 provider，或路由到插件自己的 Tavily 执行器。

```yaml
plugins:
  enabled: true
  dir: "plugins"
  configs:
    claude-web-search-router:
      enabled: true
      priority: 20
      route: fallback
      antigravity_model: "gemini-3.1-flash-lite"
      codex_model: "gpt-5.4-mini"
      xai_model: "grok-4.3"
      tavily_api_keys:
        - "tvly-xxxxxxxx"
      require_web_search_only: true
```

示例路由行为：

| Route | 目标 |
| --- | --- |
| `antigravity_google` | `TargetKind: "provider"`，`Target: "antigravity"`，`TargetModel: antigravity_model` |
| `codex_web_search` | `TargetKind: "provider"`，`Target: "codex"`，`TargetModel: codex_model` |
| `xai_web_search` | `TargetKind: "provider"`，`Target: "xai"`，`TargetModel: xai_model` |
| `tavily` | `TargetKind: "self"`，由插件执行器自己处理 Tavily。 |
| `fallback` | `TargetKind: "self"`，由插件执行器编排多个后端的 fallback。 |

## 开发注意

- 插件不识别的请求应返回 `Handled: false`，让低优先级路由器和宿主常规路径继续处理。
- `model.route` 应保持快速，只负责分类和选择目标，不要在这里执行完整上游请求。
- 返回内置 provider 目标前先检查 `AvailableProviders`。
- 需要插件执行器编排 fallback、调用 `host.model.*` 或使用插件自有外部服务时，使用 `self`。
- 希望请求继续走宿主管理的凭证选择、请求日志、用量统计和内置执行器时，使用 `provider`。
- `model_router` 由能力标记和 `model.route` 方法启用，不需要提升插件 schema version。
