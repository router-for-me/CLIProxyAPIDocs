---
title: 模型注册器
feature_ids:
  - plugin.model-registrar.register-models
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 模型注册器

`ModelRegistrar` 在登记时提交一组开发期模型元数据。

## 1. 这段解决什么问题

插件用一次调用声明自己的 provider 键和完整模型列表，供宿主登记这些模型。

## 2. 适用条件与不做的事

只有 `RegisterModels`。它不按单条凭证发现模型，那是 [模型提供方](/cn/plugin/model-provider) 的 `ModelsForAuth`。它也不执行请求。

登记元数据 `Name`、`Version`、`Author`、`GitHubRepository` 不能为空白。加载开关见 [插件加载与商店](/cn/operations/plugins)。

## 3. 怎么配置或怎么调用

`capabilities.model_registrar` 设为 true。当前契约版本是 6。

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-models",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-models"
    },
    "capabilities": {
      "model_registrar": true
    }
  }
}
```

```go
RegisterModels(context.Context, ModelRegistrationRequest) (ModelRegistrationResponse, error)
```

ABI 方法名是 `model.register`。无 `json` 标签的字段用 Go 导出名。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.model-registrar.register-models | `RegisterModels`，ABI `model.register`。 |  | 参数 `ModelRegistrationRequest`，返回 `ModelRegistrationResponse`。 |
| ModelRegistrationRequest.Plugin | 正在登记的插件元数据。 |  | `Metadata`：`Name`、`Version`、`Author`、`GitHubRepository`、`Logo`、`ConfigFields`。 |
| ModelRegistrationResponse.Provider | 这组模型的 provider 键。 |  | 字符串。 |
| ModelRegistrationResponse.Models | 插件提供的完整模型集。 |  | `[]ModelInfo`。 |
| ModelInfo.ID | 请求里使用的稳定模型 ID。 |  | 字符串。 |
| ModelInfo.Object | API 对象类型，通常是 `model`。 |  | 字符串。 |
| ModelInfo.Created | 元数据创建时间。 |  | Unix 秒，`int64`。 |
| ModelInfo.OwnedBy | 所有者或提供方。 |  | 字符串。 |
| ModelInfo.Type | 能力族分类。 |  | 字符串。 |
| ModelInfo.DisplayName | 展示名。 |  | 字符串。 |
| ModelInfo.Name | 提供方原生模型名。 |  | 字符串。 |
| ModelInfo.Version | 修订版本，可空。 |  | 字符串。 |
| ModelInfo.Description | 简短说明。 |  | 字符串。 |
| ModelInfo.InputTokenLimit | 可接受的最大输入 token。 |  | `int64`。 |
| ModelInfo.OutputTokenLimit | 最大输出 token。 |  | `int64`。 |
| ModelInfo.SupportedGenerationMethods | 支持的生成方法名。 |  | `[]string`。 |
| ModelInfo.ContextLength | 上下文总长度上限。 |  | `int64`。 |
| ModelInfo.MaxCompletionTokens | 最大补全 token。 |  | `int64`。 |
| ModelInfo.SupportedParameters | 支持的请求参数名。 |  | `[]string`。 |
| ModelInfo.SupportedInputModalities | 输入模态。 |  | `[]string`。 |
| ModelInfo.SupportedOutputModalities | 输出模态。 |  | `[]string`。 |
| ModelInfo.Thinking | 可选的推理预算。 |  | `ThinkingSupport`：`Min`、`Max`、`ZeroAllowed`、`DynamicAllowed`、`Levels`。 |
| ModelInfo.UserDefined | 是否来自用户配置。 |  | 布尔。 |

## 5. 常见错误与边界

方法返回 `error` 时，ABI 信封 `ok` 为 false。`error.code` 与 `error.message` 必填。`http_status` 省略或为 0 时按 HTTP 500 处理。

`Models` 表示完整集合，不是增量补丁。

## 6. 相关功能

按凭证发现模型见 [模型提供方](/cn/plugin/model-provider)。真正发送请求见 [执行器](/cn/plugin/executor)。

## 7. 使用经验

暂无
