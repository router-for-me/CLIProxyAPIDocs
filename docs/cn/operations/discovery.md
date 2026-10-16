---
title: 局域网发现
feature_ids:
  - server.discovery.advertise-management
  - server.discovery.auth-required
  - server.discovery.enabled
  - server.discovery.interfaces-exclude
  - server.discovery.interfaces-include
  - server.discovery.service-name
  - server.discovery.service-type
  - server.discovery.subtypes
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 局域网发现

## 1. 这段解决什么问题

在本地网络上用 mDNS / DNS-SD 广播本实例，让同一局域网里的客户端发现网关地址、是否要求认证，以及是否广播管理接口可用。

## 2. 适用条件与不做的事

只在 `server.discovery.enabled` 为 true 时广播。它不代替客户端密钥，也不打开远程管理。Docker 默认网桥传不过链路本地多播 `224.0.0.251`；要在物理局域网上广播，容器需要 host 网络。监听地址见 [监听与进程](/cn/operations/server)。

## 3. 怎么配置或怎么调用

示例配置里，发现默认关闭，其余项以注释给出：

```yaml
server:
  discovery:
    enabled: false
    # service-name: ""
    # service-type: "_ai-gateway._tcp"
    # subtypes:
    #   - "_chat-completions"
    #   - "_responses"
    #   - "_messages"
    #   - "_generate-content"
    #   - "_interactions"
    # interfaces:
    #   include: []
    #   exclude: []
    # auth-required: true
    # advertise-management: false
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| server.discovery.advertise-management | 是否在广播中声明管理接口可用。 | AdvertiseManagement explicitly controls whether management endpoints are exposed (default: false). | 只影响 TXT 记录，不会因此注册管理路由。 |
| server.discovery.auth-required | 向客户端声明调用是否需要认证。 | AuthRequired indicates whether authentication is required for client calls (default: true). | 省略时按 true 广播。显式 false 会写入 TXT。它不改变 API 本身的认证中间件。 |
| server.discovery.enabled | 是否在本地网络做 mDNS 广播。 | Enabled toggles mDNS service advertising on the local network (default: false). | false 时不广播。 |
| server.discovery.interfaces.exclude | 额外排除的网卡匹配模式。 | nil | 与 include 一起过滤。过滤后没有合格物理网卡时拒绝广播，不会退回全部网卡。 |
| server.discovery.interfaces.include | 网卡白名单。 | nil | 空列表时自动检测物理网卡。 |
| server.discovery.service-name | 可选实例名前缀。 | When empty, defaults to CPA-&lt;ShortID&gt;. | 空名称广播为 `CPA-&lt;ShortID&gt;`。自定义名称广播为 `&lt;name&gt;-&lt;ShortID&gt;`。 |
| server.discovery.service-type | DNS-SD 服务类型。 | ServiceType is the DNS-SD service type (default: _ai-gateway._tcp). | 空值使用 `_ai-gateway._tcp`。非空值必须符合服务类型格式，否则发现规格构建失败。 |
| server.discovery.subtypes | 要广播的 API 协议子类型。 | nil | 省略或空列表时使用 `_chat-completions`、`_responses`、`_messages`、`_generate-content`、`_interactions`。清理后若一个都不剩，则只保留 `_chat-completions`。 |

## 5. 常见错误与边界

绑定地址是 `localhost` 或其他环回地址时，拒绝做局域网广播。绑定地址不是 IP 时也拒绝。端口不在 1 到 65535 时，发现规格无效。没有任何合格物理网卡，或没有网卡拥有该绑定地址时，不广播。`service-type` 格式不合法时失败。这些失败不代表 HTTP 端口没有起来。

## 6. 相关功能

绑定主机见 [监听与进程](/cn/operations/server)。HTTPS 标记来自 [TLS](/cn/operations/tls)。管理接口是否真正可调用见 [管理端设置](/cn/operations/management-settings)。

## 7. 使用经验

暂无
