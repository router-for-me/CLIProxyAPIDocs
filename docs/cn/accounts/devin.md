---
title: Devin 登录
feature_ids:
  - auth.devin.login
  - cli.server.devin-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Devin 登录

## 1. 这段解决什么问题

这里说明如何登录 Devin / Cognition，并保存会话凭证。

## 2. 适用条件与不做的事

敏感词在 OAuth 页的提供商设置里，不在本页。主服务上的 `/callback` 也单独成页。

## 3. 怎么配置或怎么调用

```bash
cli-proxy-api --devin-login
cli-proxy-api --devin-login --no-browser
```

不带 `--no-browser` 时，默认绑定一个临时端口；`--oauth-callback-port` 大于 0 时改用该端口。回调地址形如 `http://127.0.0.1:<port>/callback`，等待 5 分钟。`--no-browser` 不启动回调端口，而是要求在提示符粘贴授权码或会话令牌。提示语是 `Paste the Devin authorization code or session token directly:`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| Devin login | 启动这一登录或导入的命令。 |  | 由 --devin-login 启动，可以是浏览器回调或粘贴令牌。 |
| --devin-login | 启动这一登录或导入的命令。 | false | 默认临时端口；--no-browser 时改为粘贴授权码或会话令牌。回调等待 5 分钟。 |

## 5. 常见错误与边界

无浏览器模式但没有交互提示时失败，错误含 `requires an interactive prompt`。空输入会取消。state 不一致时失败，错误含 `state mismatch`。回调写入失败见 OAuth 回调页。

## 6. 相关功能

敏感词见 [OAuth 目录、别名与排除](/cn/accounts/oauth)。主服务回调见 [OAuth 回调](/cn/accounts/oauth-callback)。

## 7. 使用经验

暂无
