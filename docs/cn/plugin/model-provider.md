---
title: 模型提供方
feature_ids:
  - plugin.model-provider.static-models
  - plugin.model-provider.models-for-auth
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 模型提供方

`ModelProvider` 提供静态模型，以及按一条凭证发现的模型。

## 1. 这段解决什么问题

静态列表不依赖某条登录凭证。`ModelsForAuth` 则用该凭证向提供方查询模型，并可以顺便交回更新后的凭证。

## 2. 适用条件与不做的事

两个方法都要实现。开发期一次性登记见 [模型注册器](/cn/plugin/model-registrar)，不是本接口。本接口不执行聊天请求。

若同一插件还有执行器，`executor_model_scope` 决定静态模型和 OAuth 凭证模型哪一侧可用：`static`、`oauth` 或 `both`。空值按 `both`。该字段属于执行器登记，见 [执行器](/cn/plugin/executor)。

## 3. 怎么配置或怎么调用

`capabilities.model_provider` 设为 true。

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-model-provider",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-model-provider"
    },
    "capabilities": {
      "model_provider": true
    }
  }
}
```

```go
StaticModels(context.Context, StaticModelRequest) (ModelResponse, error)
ModelsForAuth(context.Context, AuthModelRequest) (ModelResponse, error)
```

ABI 方法名是 `model.static` 与 `model.for_auth`。无标签字段用 Go 导出名。`[]byte` 为 base64。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.model-provider.static-models | `StaticModels`，ABI `model.static`。 |  | 参数 `StaticModelRequest`，返回 `ModelResponse`。 |
| plugin.model-provider.models-for-auth | `ModelsForAuth`，ABI `model.for_auth`。 |  | 参数 `AuthModelRequest`，返回 `ModelResponse`。 |
| StaticModelRequest.Plugin | 插件元数据。 |  | `Metadata`。 |
| StaticModelRequest.Host | 宿主配置摘要。 |  | `AuthDir`、`ProxyURL`、`ForceModelPrefix`、`OAuthModelAlias`、`ExcludedModels`。 |
| AuthModelRequest.Plugin | 插件元数据。 |  | `Metadata`。 |
| AuthModelRequest.AuthID | 用于发现的凭证 ID。 |  | 字符串。 |
| AuthModelRequest.AuthProvider | 凭证提供方。 |  | 字符串。 |
| AuthModelRequest.StorageJSON | 插件持久化数据。 |  | `[]byte`。 |
| AuthModelRequest.Metadata | 宿主可改元数据。 |  | `map[string]any`。 |
| AuthModelRequest.Attributes | 不可变属性。 |  | `map[string]string`。 |
| AuthModelRequest.Host | 宿主配置摘要。 |  | `HostConfigSummary`。 |
| AuthModelRequest.HTTPClient | 宿主 HTTP 客户端。 |  | JSON 忽略。见 [宿主 HTTP 客户端](/cn/plugin/host-callbacks)。 |
| ModelResponse.Provider | 模型所属 provider。 |  | 字符串。 |
| ModelResponse.Models | 发现到的完整模型集。 |  | `[]ModelInfo`。字段与 [模型注册器](/cn/plugin/model-registrar) 的 `ModelInfo` 相同。 |
| ModelResponse.AuthUpdate | 发现过程需要写回的凭证。 |  | `AuthData`。不需要更新时保持空值。 |

## 5. 常见错误与边界

返回 `error` 时 ABI `ok` 为 false。`http_status` 省略或为 0 时按 HTTP 500 处理。

`Models` 是完整集合。`HTTPClient` 不进入 JSON。

## 6. 相关功能

一次性登记见 [模型注册器](/cn/plugin/model-registrar)。凭证形状见 [凭证提供方](/cn/plugin/auth-provider)。

## 7. 使用经验

暂无
