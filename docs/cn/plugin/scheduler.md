---
outline: 'deep'
---

# 调度器能力

调度器能力用于在宿主内置调度器运行前，从候选凭证记录中选择一个凭证，或显式委托给内置调度器。

## 能力字段

```json
{
  "capabilities": {
    "scheduler": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`Scheduler`、`SchedulerPickRequest`、`SchedulerPickResponse`
- `sdk/pluginabi/types.go`：`scheduler.pick`
- `internal/pluginhost/adapters.go`：调度能力注册与调用

示例参考：

- `examples/plugin/scheduler/go/main.go`
- `examples/plugin/scheduler/README.md`

## 方法

| 方法 | 作用 |
| --- | --- |
| `scheduler.pick` | 根据请求上下文和候选凭证返回调度决定。 |

## 请求

```json
{
  "Provider": "codex",
  "Providers": ["codex"],
  "Model": "gpt-5.5",
  "Stream": true,
  "Options": {
    "Headers": {},
    "Metadata": {}
  },
  "Candidates": [
    {
      "ID": "auth-1",
      "Provider": "codex",
      "Priority": 1,
      "Status": "available",
      "Attributes": {},
      "Metadata": {}
    }
  ]
}
```

## 响应

选择具体凭证：

```json
{
  "AuthID": "auth-1",
  "Handled": true
}
```

委托内置调度器：

```json
{
  "DelegateBuiltin": "round-robin",
  "Handled": true
}
```

不处理本次调度：

```json
{
  "Handled": false
}
```

支持的内置委托值：

- `round-robin`
- `fill-first`

## 配置示例

```yaml
plugins:
  configs:
    scheduler:
      enabled: true
      priority: 1
      auth_id: ""
      delegate: ""
      deny: false
```

示例插件行为：

- `deny: true` 时返回错误。
- `delegate` 为 `fill-first` 或 `round-robin` 时委托内置调度器。
- `auth_id` 非空且存在于候选列表时选择该凭证。

## 开发注意

- 只从 `Candidates` 中选择凭证 ID，不要返回请求上下文之外的 ID。
- 返回错误会让本次调度失败，适合显式拒绝请求。
- 不想处理时返回 `Handled: false`，让后续插件或宿主内置逻辑继续处理。
