---
title: 调度器
feature_ids:
  - plugin.scheduler.pick
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 调度器

`Scheduler` 在内置调度之前，从候选凭证里做一次选择。

## 1. 这段解决什么问题

插件可以指定一条 `AuthID`，或把选择交回内置的 `round-robin`、`fill-first`，也可以明确拒绝本轮候选。

## 2. 适用条件与不做的事

只有 `Pick`。它不登录、不刷新凭证。它也不改写模型到执行器的路由，那是 [模型路由](/cn/plugin/model-router)。

`SchedulerAcrossPriorities` 为 false 时，`Candidates` 只含当前最高优先级层里可用的凭证。为 true 时包含所有优先级层。这是登记布尔值 `scheduler_across_priorities`，不是本接口的方法。

## 3. 怎么配置或怎么调用

`capabilities.scheduler` 设为 true。

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-scheduler",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-scheduler"
    },
    "capabilities": {
      "scheduler": true
    }
  }
}
```

```go
Pick(context.Context, SchedulerPickRequest) (SchedulerPickResponse, error)
```

ABI 方法名是 `scheduler.pick`。`SchedulerPickResponse` 的 JSON 同时接受 Go 导出名和蛇形名：`AuthID` 或 `auth_id`，`DelegateBuiltin` 或 `delegate_builtin`，`Handled` 或 `handled`，`Reject` 或 `reject`，`RejectReason` 或 `reject_reason`，`RejectCode` 或 `reject_code`。同名字段以 Go 导出名为先。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.scheduler.pick | `Pick`，ABI `scheduler.pick`。 |  | 参数 `SchedulerPickRequest`，返回 `SchedulerPickResponse`。 |
| SchedulerPickRequest.Plugin | 插件元数据。 |  | `Metadata`。 |
| SchedulerPickRequest.Provider | 路由请求的主 provider。 |  | 字符串。 |
| SchedulerPickRequest.Providers | 该路由接受的全部 provider。 |  | `[]string`。 |
| SchedulerPickRequest.Model | 请求的模型 ID。 |  | 字符串。 |
| SchedulerPickRequest.Stream | 是否期望流式输出。 |  | 布尔。 |
| SchedulerPickRequest.Options | 请求级调度输入。 |  | `Headers` 为 `map[string][]string`，`Metadata` 为 `map[string]any`。 |
| SchedulerPickRequest.Candidates | 可供选择的凭证。 |  | 见下方候选字段。未跨优先级时只有最高层。 |
| SchedulerAuthCandidate.ID | 凭证 ID。 |  | 选中的 `AuthID` 必须等于某个候选的 ID。 |
| SchedulerAuthCandidate.Provider | 凭证提供方。 |  | 字符串。 |
| SchedulerAuthCandidate.Priority | 宿主优先级。 |  | 整数。 |
| SchedulerAuthCandidate.Status | 宿主可见状态。 |  | 字符串。 |
| SchedulerAuthCandidate.Attributes | 不可变属性。 |  | `map[string]string`。 |
| SchedulerAuthCandidate.Metadata | 宿主可改元数据。 |  | `map[string]any`。 |
| SchedulerPickResponse.AuthID | 选中的凭证 ID。 |  | 必须出现在 `Candidates`。 |
| SchedulerPickResponse.DelegateBuiltin | 交给内置调度器的名字。 |  | 只能是 `round-robin` 或 `fill-first`。 |
| SchedulerPickResponse.Handled | 插件是否作出调度决定。 |  | false 时不采用本结果。 |
| SchedulerPickResponse.Reject | 是否明确拒绝选择。 |  | 与 `Handled` 同为 true 时结束选择并返回错误，不再回退内置调度。 |
| SchedulerPickResponse.RejectReason | 拒绝原因。 |  | 空白时使用 `scheduler rejected candidate selection`。 |
| SchedulerPickResponse.RejectCode | 拒绝错误码。 |  | 空白时使用 `auth_unavailable`。 |

## 5. 常见错误与边界

`Pick` 返回 `error` 时，本轮选择以该错误结束。ABI `http_status` 省略或为 0 时按 HTTP 500 处理。

`Handled` 为 false，或既没有 `AuthID` 也没有 `DelegateBuiltin`，都不是有效决定。`AuthID` 不在候选中，或 `DelegateBuiltin` 不是 `round-robin` / `fill-first`，同样无效。`Reject` 与 `Handled` 同为 true 时不再回退。

## 6. 相关功能

凭证内容见 [凭证提供方](/cn/plugin/auth-provider)。模型改道见 [模型路由](/cn/plugin/model-router)。

## 7. 使用经验

暂无
