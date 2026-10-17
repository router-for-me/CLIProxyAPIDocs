---
title: Claude 登录
feature_ids:
  - auth.claude.login
  - cli.server.claude-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Claude 登录

## 1. 这段解决什么问题

这里说明如何用浏览器 OAuth 登录 Claude，并把令牌写入凭证目录。

## 2. 适用条件与不做的事

只包含 --claude-login。API 密钥、伪装、指纹和 CCH 不在本页。Kimi 登录也不在本页。

## 3. 怎么配置或怎么调用

```bash
cli-proxy-api --claude-login
cli-proxy-api --claude-login --no-browser
cli-proxy-api --claude-login --oauth-callback-port 54545
```

默认监听 `54545`。`--no-browser` 打印授权地址，不自动打开浏览器。等待回调的时间是 5 分钟。成功时打印保存路径和 `Claude authentication successful!`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| Claude login | 启动这一登录或导入的命令。 |  | 由 --claude-login 启动，令牌写入 oauth.auth-dir。 |
| --claude-login | 启动这一登录或导入的命令。 | false | 默认端口 54545，等待 5 分钟。端口被占用时退出码 13。 |

## 5. 常见错误与边界

端口已被占用时进程以退出码 13 结束，错误类型是 `port_in_use`。其他认证失败会打印 `Claude authentication failed:`，不一定退出进程。

## 6. 相关功能

密钥和伪装见 [上游 API 密钥](/cn/accounts/api-keys-api) 与 [Claude 请求伪装](/cn/accounts/api-keys-cloak)。主服务回调见 [OAuth 回调](/cn/accounts/oauth-callback)。

## 7. 使用经验

- [不需要伪装时关闭 Claude cloak](/cn/experience/accounts#exp-accounts-claude-cloak-off)
- [没有浏览器时使用手动登录](/cn/experience/accounts#exp-accounts-claude-manual-login)
- [调用公开路由时带上客户端密钥](/cn/experience/api#exp-api-require-client-key)
- [启动前提供配置或登录](/cn/experience/introduction#exp-introduction-start-with-config-or-login)
- [auth_unavailable 表示没有可用凭证](/cn/experience/operations#exp-operations-auth-unavailable-means-no-credential)
- [让服务器自己经代理完成登录](/cn/experience/routing#exp-routing-proxy-for-token-exchange)
