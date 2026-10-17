---
title: 模型路由
feature_ids:
  - plugin.model-router.route-model
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 模型路由

`ModelRouter` 在模型到提供方的解析和凭证选择之前，决定请求交给谁执行。

## 1. 这段解决什么问题

插件可以把自己的执行器、另一个插件执行器，或一个已有内置提供方，指定为这次请求的目标。

## 2. 适用条件与不做的事

只有 `RouteModel`。它不替代执行器本身。目标是 `self` 时，仍要有本插件的 [执行器](/cn/plugin/executor)。它也不从候选凭证里挑 ID，那是 [调度器](/cn/plugin/scheduler)。

## 3. 怎么配置或怎么调用

`capabilities.model_router` 设为 true。

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-router",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-router"
    },
    "capabilities": {
      "model_router": true
    }
  }
}
```

```go
RouteModel(context.Context, ModelRouteRequest) (ModelRouteResponse, error)
```

ABI 方法名是 `model.route`。`Handled` 为 true 时，`TargetKind` 必须是 `self`、`executor` 或 `provider`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.model-router.route-model | `RouteModel`，ABI `model.route`。 |  | 参数 `ModelRouteRequest`，返回 `ModelRouteResponse`。 |
| ModelRouteRequest.Plugin | 插件元数据。 |  | `Metadata`。 |
| ModelRouteRequest.PluginID | 宿主本地插件 ID。 |  | 字符串。 |
| ModelRouteRequest.SourceFormat | 客户端原始协议。 |  | 字符串。 |
| ModelRouteRequest.RequestedModel | 尚未选择提供方和凭证时的客户端模型。 |  | 字符串。 |
| ModelRouteRequest.Stream | 是否期望流式输出。 |  | 布尔。 |
| ModelRouteRequest.Headers | 入站头。 |  | `http.Header`。 |
| ModelRouteRequest.Query | 查询参数。 |  | `url.Values`。 |
| ModelRouteRequest.Body | 原始客户端正文。 |  | `[]byte`，JSON 中为 base64。 |
| ModelRouteRequest.Metadata | 上下文快照。 |  | 只读，按 JSON 值理解。 |
| ModelRouteRequest.AvailableProviders | 当前已登记凭证的内置 provider 键。 |  | 只读。`TargetKind` 为 `provider` 时可从中选择。 |
| ModelRouteResponse.Handled | 是否作出路由决定。 |  | false 时不采用。 |
| ModelRouteResponse.TargetKind | 目标种类。 |  | `self`、`executor`、`provider`。其他值无效。 |
| ModelRouteResponse.Target | 目标。 |  | `executor` 时是插件 ID；`provider` 时是 provider 键，空白无效。`self` 使用当前路由插件 ID。 |
| ModelRouteResponse.TargetModel | 提供方路径上的模型名。 |  | 仅 `provider` 有意义。空则保留客户端请求的模型。 |
| ModelRouteResponse.Reason | 可选的诊断原因。 |  | 字符串。 |

## 5. 常见错误与边界

方法返回 `error` 时，该次路由失败，ABI `http_status` 省略或为 0 时按 HTTP 500 处理。

`Handled` 为 true 但种类不是三者之一，或 `executor` / `provider` 的 `Target` 为空白，都不是有效决定。`provider` 的目标键会去掉首尾空白并转为小写。

## 6. 相关功能

执行见 [执行器](/cn/plugin/executor)。凭证选择见 [调度器](/cn/plugin/scheduler)。

## 7. 使用经验

暂无
