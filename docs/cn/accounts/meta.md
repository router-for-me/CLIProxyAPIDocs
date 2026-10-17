---
title: Meta 登录
feature_ids:
  - auth.meta.login
  - cli.server.meta-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Meta 登录

## 1. 这段解决什么问题

这里说明 Meta Muse 的设备码登录。

## 2. 适用条件与不做的事

API 密钥在上游密钥各页。本页不描述 Muse 的内部令牌交换。

## 3. 怎么配置或怎么调用

```bash
cli-proxy-api --meta-login
cli-proxy-api --meta-login --no-browser
```

命令打印验证地址和用户码。未加 `--no-browser` 时打开浏览器，并一直等到 Meta 报告过期或授权完成。`--oauth-callback-port` 不被这条流程使用。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| Meta login | 启动这一登录或导入的命令。 |  | 由 --meta-login 启动。 |
| --meta-login | 启动这一登录或导入的命令。 | false | Meta Muse 设备码。不使用回调端口参数。 |

## 5. 常见错误与边界

缺少 device code 或 user code 时失败。设备码过期时错误含 `device code has expired`。授权被拒绝时流程失败。

## 6. 相关功能

密钥见 [上游 API 密钥](/cn/accounts/api-keys-api)。

## 7. 使用经验

暂无
