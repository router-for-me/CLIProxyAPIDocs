---
title: 反重力登录
feature_ids:
  - auth.antigravity.login
  - cli.server.antigravity-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 反重力登录

## 1. 这段解决什么问题

这里说明如何把 Antigravity 账号登录进本代理，并把令牌保存到凭证目录。

## 2. 适用条件与不做的事

只包含 --antigravity-login 和对应的登录入口。连接池、敏感词、credits 和签名缓存在反重力提供商选项页。回调如果打到正在运行的主服务，见 OAuth 回调。

## 3. 怎么配置或怎么调用

```bash
cli-proxy-api --antigravity-login
cli-proxy-api --antigravity-login --no-browser
cli-proxy-api --antigravity-login --oauth-callback-port 51121
```

默认在本机 `51121` 端口等待，回调路径是 `/oauth-callback`。`--oauth-callback-port` 大于 0 时改用该端口。`--no-browser` 只打印地址和 SSH 隧道提示，不打开浏览器。等待时间是 5 分钟。成功时打印保存路径、账号标签和 `Antigravity authentication successful!`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| Antigravity login | 启动这一登录或导入的命令。 |  | 由 --antigravity-login 启动。 |
| --antigravity-login | 启动这一登录或导入的命令。 | false | 默认端口 51121，路径 /oauth-callback，等待 5 分钟。失败只记录错误并返回。 |

## 5. 常见错误与边界

回调端口无法监听或认证失败时，命令记录错误并返回，不会像 Claude 或 Codex 那样以退出码 13 结束。这不是客户端 API 密钥。

## 6. 相关功能

提供商选项见 [反重力提供商选项](/cn/configuration/provider/antigravity)。主服务上的回调见 [OAuth 回调](/cn/accounts/oauth-callback)。凭证目录见 [OAuth 目录、别名与排除](/cn/accounts/oauth)。

## 7. 使用经验

暂无
