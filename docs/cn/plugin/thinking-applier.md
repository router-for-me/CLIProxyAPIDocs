---
title: Thinking 处理
feature_ids:
  - plugin.thinking-applier.identifier
  - plugin.thinking-applier.apply-thinking
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Thinking 处理

`ThinkingApplier` 把已经规范化的思考配置写进提供方载荷。

## 1. 这段解决什么问题

宿主完成思考模式解析之后，插件按自己的 provider 键改写正文里的提供方字段。

## 2. 适用条件与不做的事

不负责解析用户请求里的思考后缀，只接收已经规范化的 `ThinkingConfig`。模式只有 `budget`、`level`、`none`、`auto` 这四个规范值。

## 3. 怎么配置或怎么调用

`capabilities.thinking_applier` 设为 true。

```go
Identifier() string
ApplyThinking(context.Context, ThinkingApplyRequest) (PayloadResponse, error)
```

ABI 方法名是 `thinking.identifier` 与 `thinking.apply`。标识结果字段是 `identifier`，并且应返回本应用器处理的 provider 键。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.thinking-applier.identifier | `Identifier`，ABI `thinking.identifier`。 |  | 无参数。返回 provider 键。失败或空白按空字符串处理。 |
| plugin.thinking-applier.apply-thinking | `ApplyThinking`，ABI `thinking.apply`。 |  | 参数 `ThinkingApplyRequest`，返回 `PayloadResponse`。 |
| ThinkingApplyRequest.Provider | 正在应用的 provider 键。 |  | 已规范化。 |
| ThinkingApplyRequest.Model | 关联模型。 |  | `ModelInfo`，字段见 [模型注册器](/cn/plugin/model-registrar)。 |
| ThinkingApplyRequest.Config | 已解析的规范思考配置。 |  | `Mode`、`Budget`、`Level`。 |
| ThinkingApplyRequest.Body | 要改写的提供方载荷。 |  | `[]byte`。 |
| ThinkingConfig.Mode | 规范模式。 |  | `budget`、`level`、`none` 或 `auto`。 |
| ThinkingConfig.Budget | 规范化后的 token 预算。 |  | 整数。 |
| ThinkingConfig.Level | 规范化后的具名档位。 |  | 字符串。 |
| PayloadResponse.Body | 写好提供方字段后的载荷。 |  | `[]byte`。 |

## 5. 常见错误与边界

`ApplyThinking` 返回 `error` 时 ABI `ok` 为 false。`http_status` 省略或为 0 时按 HTTP 500 处理。

标识为空时无法按 provider 匹配。`Mode` 不在四个规范值之内不属于本接口要再解析的输入。

## 6. 相关功能

模型上的思考能力字段 `ThinkingSupport` 见 [模型注册器](/cn/plugin/model-registrar)。

## 7. 使用经验

暂无
