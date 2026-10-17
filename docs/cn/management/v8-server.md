---
title: 查询最新版本
feature_ids:
  - management.v8.get-server-latest-version
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 查询最新版本

## 1. 这段解决什么问题

向管理 API 询问 CLIProxyAPI 在 GitHub 上的最新发行版标签，不下载发布附件。

## 2. 适用条件与不做的事

需要管理密钥。它不升级进程，也不读取本机二进制的版本号作为“最新”。GitHub 令牌的优先级见 [监听与进程](/cn/operations/server)。

## 3. 怎么配置或怎么调用

```http
GET /v8/management/server/latest-version HTTP/1.1
Host: example.invalid
Authorization: Bearer YOUR_API_KEY
```

成功时返回 JSON，字段 `latest-version` 为发行版标签。请求发往 GitHub 的 latest release 接口。若配置了出站 `proxy-url`，这次查询走该代理。本页不新增代理键。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| GET /v8/management/server/latest-version | 读取 GitHub 最新发行版的标签或名称。 |  | 优先使用 `tag_name`，为空时用 `name`。两者都空时 502 `invalid_response`。上游非 200、网络失败或无法解码时 502。创建请求失败时 500 `request_create_failed`。 |

## 5. 常见错误与边界

查询超时时间是 10 秒。没有可用的 GitHub 令牌时仍会发起未认证请求，可能受到 GitHub 的速率限制并得到 502 `unexpected_status`。响应不会附带发布说明或安装包。

## 6. 相关功能

令牌来源见 [监听与进程](/cn/operations/server)。管理密钥见 [管理端设置](/cn/operations/management-settings)。

## 7. 使用经验

暂无
