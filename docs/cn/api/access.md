---
title: 客户端密钥
feature_ids:
  - access.api-keys.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 客户端密钥

这里只说明钉住提交里、用来调用本代理公开接口的客户端密钥。它不是上游提供商密钥。

## 1. 这段解决什么问题

`access.api-keys` 列出本代理接受的客户端密钥。配置了至少一把有效密钥之后，本册各公开路由会核对请求里的密钥。列表为空时，这些路由不再要求客户端密钥。

## 2. 适用条件与不做的事

v8 配置写在 `access.api-keys`。旧文件里的根级字符串列表 `api-keys` 仍会载入同一字段。两边同时出现时，包括新字段明确写成空列表，都以 `access.api-keys` 为准。

根级 `api-keys` 如果是映射，表示上游提供商分组，不会被当作客户端密钥，也不能和客户端列表共用同一个 YAML 键。上游分组、管理密钥和环境变量 `MANAGEMENT_PASSWORD` 都不在本页。

空白项会被去掉，重复项只保留一次。没有任何剩余密钥时，内置的 `config-api-key` 提供者不注册。

## 3. 怎么配置或怎么调用

```yaml
access:
  api-keys:
    - "YOUR_API_KEY"
```

调用本册需要密钥的路由时，下面任意一种写法都可以。按这个顺序采用第一把已配置的密钥：`Authorization`、`X-Goog-Api-Key`、`X-Api-Key`、查询参数 `key`、查询参数 `auth_token`。

`Authorization` 以 `Bearer` 加空格开头时，只取后面的令牌，方案名不区分大小写。否则把整个头的值当作密钥。

```bash
curl https://example.invalid/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

```bash
curl "https://example.invalid/v1/models?key=YOUR_API_KEY"
```

## 4. 细项说明

「默认值」与台账 `defaults` 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| access.api-keys.value | 本代理的客户端密钥列表。 | nil | 空白项删除，重复项忽略。空列表表示不校验客户端密钥。 |

## 5. 常见错误与边界

未提供上述任何一种密钥时返回 401，正文是 `{"error":"Missing API key"}`。提供了值但没有一把与配置相同，返回 401，正文是 `{"error":"Invalid API key"}`。

实时路由里使用实时认证中间件的路径，把同一失败包成对象：`type` 为 `authentication_error`，`code` 为 `invalid_api_key`，`param` 为 `null`。请求体超过配置的请求体上限而在认证阶段被拒绝时，这些路径的 `type` 改为 `invalid_request_error`，`code` 改为 `request_body_too_large`。认证服务返回 500 及以上时，`type` 为 `server_error`，`code` 为 `authentication_service_error`。普通 `/v1`、`/v1beta`、`/openai/v1` 和 `/backend-api/codex` 分组仍使用上面的字符串 `error`。

示例密钥安全模式只在普通启动或 TUI standalone 中启用。登录、导入、`--siwc-bind`、Home，以及云部署但配置文件不存在时不启用。只作为 TUI 客户端连接已有服务时也不启用。启用后，只要列表里仍有 `your-api-key-1`、`your-api-key-2` 或 `your-api-key-3`，`/v1`、`/v1beta`、`/openai/v1` 和 `/backend-api/codex` 前缀都会在进入处理函数前返回 403，并设置响应头 `X-CPA-SAFE-MODE: example-api-key`。正文是：

```json
{"error":"unsafe_example_api_key","message":"Proxy API endpoints are disabled because api-keys contains template values. Open /management.html?safe-mode=configure, update api-keys in Management, then retry."}
```

此时 `GET` 或 `HEAD` `/` 以及 `/management.html` 返回警告页，不再提供原来的响应。`/management.html?safe-mode=configure` 除外，它仍进入管理面板。

## 6. 相关功能

使用这些密钥的调用见 [OpenAI Chat](/cn/api/openai-chat)、[Responses](/cn/api/responses)、[Claude Messages](/cn/api/claude-messages)、[Gemini](/cn/api/gemini)、[图像、语音与视频](/cn/api/media)、[实时会话](/cn/api/realtime) 和 [其他入口](/cn/api/openai-other)。

## 7. 使用经验

暂无
