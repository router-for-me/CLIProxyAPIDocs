---
title: Codex 登录
feature_ids:
  - auth.codex.login
  - cli.server.codex-device-login
  - cli.server.codex-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Codex 登录

## 1. 这段解决什么问题

这里说明 Codex 的两种登录：浏览器回调，以及设备码。

## 2. 适用条件与不做的事

不包含 API 密钥、WebSocket、Alpha Search，也不包含提供商级的流缓冲和媒体中继。

## 3. 怎么配置或怎么调用

```bash
cli-proxy-api --codex-login
cli-proxy-api --codex-login --no-browser
cli-proxy-api --codex-device-login
```

浏览器登录默认监听 `1455`，回调路径是 `/auth/callback`，等待 5 分钟。设备码登录打印 `https://auth.openai.com/codex/device` 和设备码；除非带 `--no-browser`，否则会尝试打开该地址。设备码流程不等待本地 OAuth 端口，最长等待 15 分钟。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| Codex login | 启动这一登录或导入的命令。 |  | 浏览器流程用 --codex-login，设备码用 --codex-device-login。 |
| --codex-device-login | 启动这一登录或导入的命令。 | false | 打印设备地址和设备码，最长等待 15 分钟，不监听 OAuth 端口。 |
| --codex-login | 启动这一登录或导入的命令。 | false | 默认端口 1455，路径 /auth/callback，等待 5 分钟。端口被占用时退出码 13。 |

## 5. 常见错误与边界

浏览器登录在端口被占用时以退出码 13 结束。设备码响应缺少必要字段时失败，错误分别是 `codex device flow did not return required fields` 或 `codex device flow token response missing required fields`。

## 6. 相关功能

提供商选项见 [Codex 提供商选项](/cn/configuration/provider/codex)。密钥见 [上游 API 密钥](/cn/accounts/api-keys-api)。

## 7. 使用经验

暂无
