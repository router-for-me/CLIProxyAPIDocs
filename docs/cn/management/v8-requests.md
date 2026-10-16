---
title: 管理端代发请求
feature_ids:
  - management.v8.post-requests-api-call
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 管理端代发请求

## 1. 这段解决什么问题

让已经通过管理密钥认证的调用方，委托进程向另一个 HTTP 地址发出一次请求，并可选用某份凭证的令牌和代理。

## 2. 适用条件与不做的事

只有 `POST /v8/management/requests/api-call`。它需要管理密钥，规则见 [管理 API v8](/cn/management/apiv8)。它不是公开的模型路由，也不会替调用方保存凭证。

## 3. 怎么配置或怎么调用

```http
POST /v8/management/requests/api-call HTTP/1.1
Host: example.invalid
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "method": "GET",
  "url": "https://example.invalid/v1/models",
  "header": {},
  "data": ""
}
```

可选字段：

- `auth_index`、`authIndex` 或 `AuthIndex`：凭证列表中的索引。省略时不做凭证专用代理选择。
- `proxy_url`：这次请求单独使用的代理。必须能被代理解析。
- `header`：字符串到字符串的请求头。
- `data`：原始请求体字符串。空字符串表示不带正文。

请求头或 `data` 中的字面量 `$TOKEN$` 会被该凭证的令牌替换。成功时本接口返回 200，正文含上游的 `status_code`、`header` 和 `body`。上游的非 2xx 不会变成这个管理接口的失败状态。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| POST /v8/management/requests/api-call | 按给定方法和 URL 发出一次 HTTP 请求。 |  | `method` 与 `url` 必填。URL 必须带方案和主机。超时 60 秒。`$TOKEN$` 无法解析时 400。网络失败或读响应失败时 502。 |

## 5. 常见错误与边界

正文不是 JSON 时 400 `invalid body`。缺少方法时 400 `missing method`。缺少 URL 时 400 `missing url`。URL 没有方案或主机时 400 `invalid url`。`proxy_url` 无法解析时 400 `invalid proxy_url`。给出了 `auth_index` 但找不到凭证，且又需要替换 `$TOKEN$` 时，400 的错误为 `auth credential not found for auth_index`。没有令牌时错误为 `auth token not found`。刷新失败时错误为 `auth token refresh failed`。名为 `Host` 的头会改请求的 Host，而不是普通头。

## 6. 相关功能

`auth_index` 从 [管理凭证](/cn/management/v8-credentials) 的列表取得。管理密钥见 [管理端设置](/cn/operations/management-settings)。

## 7. 使用经验

暂无
