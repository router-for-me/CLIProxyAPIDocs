---
title: Kimi.ai 登录
feature_ids:
  - cli.server.kimi-ai-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Kimi.ai 登录

## 1. 这段解决什么问题

这里说明 Kimi.ai 的设备码登录。它和 Kimi.com 不是同一个提供商。

## 2. 适用条件与不做的事

不包含 Kimi.com，也不包含把 Kimi 当作 Claude 网关时的指纹配置。

## 3. 怎么配置或怎么调用

```bash
cli-proxy-api --kimi-ai-login
cli-proxy-api --kimi-ai-login --no-browser
```

命令打印验证地址和用户码，并在未指定 `--no-browser` 时打开浏览器。保存的提供商是 `kimi-ai`。`--oauth-callback-port` 不参与这条流程。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| --kimi-ai-login | 启动这一登录或导入的命令。 | false | Kimi.ai 设备码。保存提供商 kimi-ai。不使用回调端口参数。 |

## 5. 常见错误与边界

和 Kimi.com 相同，启动失败或授权失败会带 `kimi:` 前缀返回。

## 6. 相关功能

Kimi.com 见 [Kimi 登录](/cn/accounts/kimi)。指纹见 [Claude 指纹配置](/cn/accounts/api-keys-fingerprint)。

## 7. 使用经验

暂无
