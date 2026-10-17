---
title: Vertex 服务账号导入
feature_ids:
  - auth.vertex.login
  - cli.server.vertex-import
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Vertex 服务账号导入

## 1. 这段解决什么问题

这里说明如何把 Google Cloud 服务账号 JSON 导入为 vertex 凭证。它不是浏览器登录。

## 2. 适用条件与不做的事

Vertex API 密钥和 base-url 在上游密钥各页。本页只覆盖 --vertex-import 和登录入口记录。

## 3. 怎么配置或怎么调用

```bash
cli-proxy-api --vertex-import /path/to/service-account.json
cli-proxy-api --vertex-import /path/to/service-account.json --vertex-import-prefix teamA
```

文件会写入 `oauth.auth-dir`。保存的 location 是 `us-central1`，之后可以在凭证文件里修改。前缀只能是一段，不能含 `/`。文件名是 `vertex-<project_id>.json`；有前缀时是 `vertex-<prefix>-<project_id>.json`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| Vertex login | 启动这一登录或导入的命令。 |  | 由 --vertex-import 导入服务账号，不是浏览器登录。 |
| --vertex-import | 启动这一登录或导入的命令。 | empty string | 必须有路径和 project_id。前缀不能含 /。保存的 location 是 us-central1。 |

## 5. 常见错误与边界

路径为空、文件读失败、JSON 无效或缺少 `project_id` 时只记录错误并返回。`client_email` 缺失只警告，仍会继续。前缀含 `/` 时错误含 `prefix must be a single segment`。成功时打印 `Vertex credentials imported:` 和路径。

## 6. 相关功能

API 密钥见 [上游 API 密钥](/cn/accounts/api-keys-api) 和 [上游基础地址](/cn/accounts/api-keys-base)。

## 7. 使用经验

暂无
