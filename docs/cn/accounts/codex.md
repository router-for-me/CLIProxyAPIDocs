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

- [Codex 凭证文件不能写注释](/cn/experience/accounts#exp-accounts-codex-auth-file-shape)
- [Codex 回调成功后回到终端确认](/cn/experience/accounts#exp-accounts-codex-callback-enter)
- [Codex 客户端要匹配 User-Agent 默认值](/cn/experience/accounts#exp-accounts-codex-client-user-agent)
- [桌面端按自己的方式指向代理](/cn/experience/accounts#exp-accounts-codex-desktop-proxy)
- [同一 Codex 账号保留两份工作区](/cn/experience/accounts#exp-accounts-codex-keep-workspaces)
- [套餐或令牌变化后重新登录 Codex](/cn/experience/accounts#exp-accounts-codex-login-again)
- [Claude Code 使用 Codex 登录而不是原始令牌](/cn/experience/accounts#exp-accounts-codex-login-for-claude-code)
- [内置图像使用 Codex OAuth](/cn/experience/accounts#exp-accounts-codex-oauth-for-images)
- [高级账号安全会让 Codex 更常刷新](/cn/experience/accounts#exp-accounts-codex-refresh-security)
- [在单份凭证上排除模型](/cn/experience/accounts#exp-accounts-exclude-model)
- [Codex 客户端调用 responses 路由](/cn/experience/api#exp-api-call-responses)
- [停止注入图像工具](/cn/experience/api#exp-api-disable-image-tool-injection)
- [发往 Codex 前丢掉不支持的 Claude 字段](/cn/experience/api#exp-api-drop-unsupported-claude-fields)
- [目录不返回思考文本时不要期待代理补写](/cn/experience/api#exp-api-no-synthetic-reasoning)
- [调用公开路由时带上客户端密钥](/cn/experience/api#exp-api-require-client-key)
- [responses 用 instructions 代替 system](/cn/experience/api#exp-api-responses-instructions)
- [打开多智能体兼容开关](/cn/experience/configuration#exp-configuration-optimize-multi-agent)
- [可见模型以钉住目录为准](/cn/experience/introduction#exp-introduction-catalog-is-authoritative)
- [禁用的 OAuth 凭证仍会刷新](/cn/experience/management#exp-management-disabled-oauth-still-refreshes)
- [在管理页重置 Codex 账号](/cn/experience/management#exp-management-reset-codex-from-panel)
- [auth_unavailable 表示没有可用凭证](/cn/experience/operations#exp-operations-auth-unavailable-means-no-credential)
- [429 后按恢复时间跳过该模型](/cn/experience/routing#exp-routing-cooldown-until-reset)
- [关闭冷却以保持凭证可选](/cn/experience/routing#exp-routing-disable-cooling)
- [让服务器自己经代理完成登录](/cn/experience/routing#exp-routing-proxy-for-token-exchange)
- [responses 靠共享缓存键轮换](/cn/experience/routing#exp-routing-responses-cache-key)
- [同名模型共用路由策略](/cn/experience/routing#exp-routing-same-model-name)
