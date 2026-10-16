---
title: 监听与进程
feature_ids:
  - server.commercial-mode.value
  - server.github-token.value
  - server.host.value
  - server.max-request-body-bytes.value
  - server.port.value
  - server.trusted-proxies.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 监听与进程

## 1. 这段解决什么问题

这里决定进程听在哪张网卡、哪个端口，入站请求体最大有多大，是否信任反向代理传来的客户端地址，以及是否为了降低高并发内存而关掉高开销日志和中间件。GitHub 发布信息所用的令牌也在这里。

## 2. 适用条件与不做的事

这些键属于 `server`。它们不签发客户端访问密钥，也不打开管理 API。HTTPS 证书见 [TLS](/cn/operations/tls)。局域网广播见 [局域网发现](/cn/operations/discovery)。Home 模式另有端口规范化，见 [CLIProxyAPI Home](/cn/operations/home)。

## 3. 怎么配置或怎么调用

示例配置使用下面的值。未写出的键仍按第 4 节的 defaults。

```yaml
server:
  host: ""
  port: 8317
  max-request-body-bytes: 0
  github-token: ""
  trusted-proxies: []
  commercial-mode: false
```

`trusted-proxies` 的示例条目是 IP 或 CIDR，例如 `127.0.0.1` 与 `192.0.2.0/24`。令牌不要写进仓库；需要时使用占位 `YOUR_API_KEY`，或留空改走环境变量。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| server.commercial-mode | 为降低单请求内存，关闭高开销请求日志和 HTTP 中间件功能。 | false | true 时不为该进程挂上请求日志中间件，并把 SDK 侧的请求日志视为关闭。 |
| server.github-token | GitHub 请求使用的全局令牌，优先于 `GITHUB_TOKEN`。 | empty string | 非空配置值优先。否则依次使用 `GITHUB_TOKEN`、`github_token`；仅当 `GITSTORE_GIT_URL` 指向 github.com 时才使用 `GITSTORE_GIT_TOKEN`。该令牌只用于 HTTPS 的 `api.github.com`。 |
| server.host | API 服务器绑定的主机或网卡。 | Default is empty ("") to bind all interfaces (IPv4 + IPv6). | 空字符串绑定全部 IPv4 和 IPv6 接口。限制本机可写 `127.0.0.1` 或 `localhost`。 |
| server.max-request-body-bytes | 入站 HTTP 请求体的字节上限。 | Values <= 0 disable the limit (default). | 小于等于 0 不限制。超过上限的请求返回 HTTP 413。 |
| server.port | API 服务器监听端口。 | 0 | 普通加载不会把 0 改成别的端口。示例配置写 8317。只有从 Home 取回的端口在省略或非正数时改为 8317。 |
| server.trusted-proxies | 允许提供转发客户端 IP 头的 IP 或 CIDR。 | nil | 空列表不信任转发头。启动时应用；非法条目（空白、首尾空格、既不是 IP 也不是 CIDR）会导致配置加载失败。列表无法应用时，转发头被忽略。修改后需要重启。 |

## 5. 常见错误与边界

`trusted-proxies` 含空字符串、首尾空白或无法解析的地址时，配置加载失败，错误说明期望的是 IP 或 CIDR。端口为 0 且不是 Home 规范化路径时，进程会按 `host:0` 去监听，而不会自动改成示例里的 8317。`commercial-mode: true` 不会单独关闭管理 API。

## 6. 相关功能

证书与私钥见 [TLS](/cn/operations/tls)。存活探测见 [健康检查](/cn/operations/health)。日志开关见 [日志与用量](/cn/operations/observability)。

## 7. 使用经验

暂无
