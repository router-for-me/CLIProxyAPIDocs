---
title: Kimi 登录
feature_ids:
  - auth.kimi.login
  - cli.server.kimi-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Kimi 登录

## 1. 这段解决什么问题

这里说明 Kimi.com 的设备码登录。

## 2. 适用条件与不做的事

Kimi.ai 使用另一条命令，见 Kimi.ai 登录。本页不配置 API 密钥。

## 3. 怎么配置或怎么调用

```bash
cli-proxy-api --kimi-login
cli-proxy-api --kimi-login --no-browser
```

命令打印验证地址和用户码。没有 `--no-browser` 时尝试打开浏览器。保存的提供商是 `kimi`。这条流程不使用 `--oauth-callback-port`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| Kimi login | 启动这一登录或导入的命令。 |  | Kimi.com 用 --kimi-login。Kimi.ai 用 --kimi-ai-login。 |
| --kimi-login | 启动这一登录或导入的命令。 | false | Kimi.com 设备码。保存提供商 kimi。不使用回调端口参数。 |

## 5. 常见错误与边界

设备码流程无法开始时失败，错误含 `kimi: failed to start device flow`。授权超时或被拒绝时失败，错误含 `kimi:`。

## 6. 相关功能

Kimi.ai 见 [Kimi.ai 登录](/cn/accounts/kimi-ai)。

## 7. 使用经验

- [Kimi 使用国际站登录](/cn/experience/accounts#exp-accounts-kimi-international-login)
- [失效的 Kimi 密钥改走 OAuth](/cn/experience/accounts#exp-accounts-kimi-oauth-instead-of-broken-key)
- [Kimi responses 保持 Kimi 自己的工具](/cn/experience/api#exp-api-kimi-native-responses)
- [可见模型以钉住目录为准](/cn/experience/introduction#exp-introduction-catalog-is-authoritative)
