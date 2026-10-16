---
title: Codex 提供商选项
feature_ids:
  - oauth.providers.codex-header-defaults-beta-features
  - oauth.providers.codex-header-defaults-user-agent
  - oauth.providers.codex-live-media-relay-disable-private-remote-ips
  - oauth.providers.codex-live-media-relay-enabled
  - oauth.providers.codex-live-media-relay-ice-servers-credential
  - oauth.providers.codex-live-media-relay-ice-servers-urls
  - oauth.providers.codex-live-media-relay-ice-servers-username
  - oauth.providers.codex-live-media-relay-max-sessions
  - oauth.providers.codex-live-media-relay-public-ip
  - oauth.providers.codex-live-media-relay-udp-port-max
  - oauth.providers.codex-live-media-relay-udp-port-min
  - oauth.providers.codex-signin-with-chatgpt-identifier
  - upstream.codex.disable-codex-cloaking
  - upstream.codex.model-level-cooling
  - upstream.codex.orphan-delegation-compatibility
  - upstream.codex.response-steering
  - upstream.codex.stream-bootstrap-buffering
  - upstream.codex.stream-bootstrap-timeout
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Codex 提供商选项

## 1. 这段解决什么问题

说明 Codex OAuth 和文件凭证共用的伪装、流缓冲、媒体中继、请求头和 Sign in with ChatGPT 标识。

## 2. 适用条件与不做的事

API 密钥的 websockets、alpha-search 和 disable-codex-cloaking 不在本页。登录命令不在本页。

## 3. 怎么配置或怎么调用

```yaml
oauth:
  providers:
    codex:
      signin-with-chatgpt-identifier: "CLIProxyAPI"
      header-defaults:
        user-agent: ""
        beta-features: ""
      live-media-relay:
        enabled: false
        max-sessions: 0
        disable-private-remote-ips: false
        public-ip: ""
        udp-port-min: 0
        udp-port-max: 0
upstream:
  codex:
    disable-codex-cloaking: false
    model-level-cooling: false
    orphan-delegation-compatibility: false
    response-steering: false
    stream-bootstrap-buffering: false
    stream-bootstrap-timeout: "0"
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| oauth.providers.codex.header-defaults.beta-features | oauth.providers.codex.header-defaults.beta-features | empty string | 只补给 Codex OAuth 的 WebSocket。不作用于 HTTP，也不作用于 api-keys.codex。 |
| oauth.providers.codex.header-defaults.user-agent | oauth.providers.codex.header-defaults.user-agent | empty string | 只补给没有发送该头的 Codex OAuth 或文件凭证，HTTP 和 WebSocket 都包括。不作用于 api-keys.codex。 |
| oauth.providers.codex.live-media-relay.disable-private-remote-ips | oauth.providers.codex.live-media-relay.disable-private-remote-ips | false | true 拒绝私网、回环、链路本地和未指定地址。不能与旧键 allow-private-remote-ips 同时出现。 |
| oauth.providers.codex.live-media-relay.enabled | oauth.providers.codex.live-media-relay.enabled | false | true 时本进程终止并中继 WebRTC，需要入站 UDP。false 保持直连。 |
| oauth.providers.codex.live-media-relay.ice-servers.credential | oauth.providers.codex.live-media-relay.ice-servers.credential | empty string | YAML 接受，JSON 配置接口不返回。 |
| oauth.providers.codex.live-media-relay.ice-servers.urls | oauth.providers.codex.live-media-relay.ice-servers.urls | nil | 启用后必填。方案只能是 stun、stuns、turn 或 turns。 |
| oauth.providers.codex.live-media-relay.ice-servers.username | oauth.providers.codex.live-media-relay.ice-servers.username | empty string | YAML 接受，JSON 配置接口不返回。 |
| oauth.providers.codex.live-media-relay.max-sessions | oauth.providers.codex.live-media-relay.max-sessions | 0 | 0 或省略按 32。启用后负数会使载入失败。 |
| oauth.providers.codex.live-media-relay.public-ip | oauth.providers.codex.live-media-relay.public-ip | empty string | 空值不额外公布。启用后，非空但不是 IP 的值会使载入失败。 |
| oauth.providers.codex.live-media-relay.udp-port-max | oauth.providers.codex.live-media-relay.udp-port-max | 0 | 不能小于 udp-port-min。只填一端会使启用中的中继载入失败。 |
| oauth.providers.codex.live-media-relay.udp-port-min | oauth.providers.codex.live-media-relay.udp-port-min | 0 | 必须和 udp-port-max 同时设置。启用后范围至少要有每会话两个端口。 |
| oauth.providers.codex.signin-with-chatgpt-identifier | oauth.providers.codex.signin-with-chatgpt-identifier | Defaults to "CLIProxyAPI". | 空白或省略时使用 CLIProxyAPI。同时用于 agent_name_hint 和 User-Agent 前缀。 |
| upstream.codex.disable-codex-cloaking | 是否停止强制官方 Codex 身份头。 | false | true 时不再强制官方 Codex 身份头，HTTP/SSE 和 WebSocket 都包括。 |
| upstream.codex.model-level-cooling | 配额冷却是否只作用于当前模型。 | false | true 时只把 usage_limit_reached 冷却限制在当前模型。 |
| upstream.codex.orphan-delegation-compatibility | 是否启用孤立委托输出兼容。 | false | true 时为带 X-Openai-Subagent: collab_spawn 的孤立委托输出做兼容转换。 |
| upstream.codex.response-steering | 是否启用全双工 Codex WebSocket。 | Default is false. | true 时启用全双工 WebSocket，整段生命绑定同一上游模型、账号和套接字。 |
| upstream.codex.stream-bootstrap-buffering | 是否先扣住生成开始前的流帧。 | Default is false. | true 时先扣住生成开始前的握手、心跳和仍空的 added 帧。上限是 48 帧和 1MB，不是墙钟。只有超载和限流会故意切换凭证。 |
| upstream.codex.stream-bootstrap-timeout | 扣住响应头的最长时间。 | Defaults to "0" (unlimited time, relying purely on the 48-frame and 1MB byte bounds). | 0、0s、none、unlimited、disabled、off、never 或无法解析的值都表示不限时。正数时长到达后放行流。 |

## 5. 常见错误与边界

媒体中继 enabled 为 false 时不校验其余字段。启用后，max-sessions 为负、public-ip 不是 IP、UDP 只填一端、范围小于每会话两个端口，或 ICE URL 方案不是 stun、stuns、turn、turns，都会让配置载入失败。allow-private-remote-ips 已弃用，不能和 disable-private-remote-ips 同时出现。stream-bootstrap-timeout 接受时长或纯秒数；0、0s、none、unlimited、disabled、off、never 以及无法解析的字符串都表示不限时。空白的 Sign in with ChatGPT 标识使用 CLIProxyAPI。

## 6. 相关功能

登录见 [Codex 登录](/cn/accounts/codex)。密钥级 WebSocket 见 [Responses WebSocket 传输](/cn/accounts/api-keys-websockets)。

## 7. 使用经验

暂无
