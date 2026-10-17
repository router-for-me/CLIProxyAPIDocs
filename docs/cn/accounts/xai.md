---
title: xAI 登录
feature_ids:
  - auth.xai.login
  - cli.server.xai-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# xAI 登录

## 1. 这段解决什么问题

这里说明 xAI 的设备码登录。当前登录不是本地浏览器回调端口。

## 2. 适用条件与不做的事

不包含 API 密钥，也不包含 x_search 注入。旧文档里的 `127.0.0.1:56121/callback` 不是这条命令的现行行为。

## 3. 怎么配置或怎么调用

```bash
cli-proxy-api --xai-login
cli-proxy-api --xai-login --no-browser
```

命令向 xAI 申请设备码，打印验证地址和用户码，并在未指定 `--no-browser` 时打开浏览器。等待时间来自 xAI 返回的过期秒数。成功时打印 `xAI authentication successful`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| Xai login | 启动这一登录或导入的命令。 |  | 由 --xai-login 启动。 |
| --xai-login | 启动这一登录或导入的命令。 | false | 设备码流程。不使用 --oauth-callback-port。等待时间来自 xAI 返回的过期秒数。 |

## 5. 常见错误与边界

设备码响应缺少 device_code、user_code 或验证地址时失败。过期、拒绝或上下文取消都会终止登录。`--oauth-callback-port` 不改变这条流程。

## 6. 相关功能

搜索工具见 [xAI 搜索工具](/cn/configuration/provider/xai)。密钥见 [上游 API 密钥](/cn/accounts/api-keys-api)。

## 7. 使用经验

- [xAI 403 时改用 API key](/cn/experience/accounts#exp-accounts-xai-api-key-fallback)
- [用设备码登录 xAI](/cn/experience/accounts#exp-accounts-xai-device-login)
- [打开多智能体兼容开关](/cn/experience/configuration#exp-configuration-optimize-multi-agent)
- [用载荷过滤去掉上游拒绝的字段](/cn/experience/routing#exp-routing-filter-rejected-fields)
- [用载荷覆盖修补 Grok 子代理](/cn/experience/routing#exp-routing-override-grok-subagent)
