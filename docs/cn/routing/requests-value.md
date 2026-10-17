---
title: 出站请求
feature_ids:
  - requests.nonstream-keepalive-interval.value
  - requests.passthrough-headers.value
  - requests.proxy-url.value
  - requests.tls-handshake-timeout-seconds.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 出站请求

## 1. 这段解决什么问题

这里控制所有上游请求共用的代理、响应头转发、非流式空行保活，以及内置 uTLS 客户端的 TLS 握手时限。

## 2. 适用条件与不做的事

代理地址是全局值。单条凭证上的 `proxy-url` 另有覆盖；`direct` 和 `none` 只属于那些条目，用来同时绕过本全局值和环境代理，不能当作本字段的全局写法。握手时限只包住共享 uTLS 客户端上的 TLS 握手，不限制拨号、代理 CONNECT、推理或已建立的长流。

## 3. 怎么配置或怎么调用

```yaml
requests:
  proxy-url: ""
  tls-handshake-timeout-seconds: 0
  passthrough-headers: false
  nonstream-keepalive-interval: 0
```

需要全局代理时，方案只使用 `socks5`、`socks5h`、`http` 或 `https`，例如 `socks5://example.invalid:1080`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| requests.nonstream-keepalive-interval | 非流式响应输出空行的间隔秒数。 | 0 | 小于或等于 0 时关闭。单位是秒，输出的是空行。 |
| requests.passthrough-headers | 是否把过滤后的上游响应头转给客户端。 | Default is false (disabled). | false 不向普通客户端转发。转发前会去掉逐跳头、Set-Cookie、Content-Length、Content-Encoding、CPA 管理的 CORS 与 X-Cpa-Trace-Id、Connection 指定的头，以及 x-litellm-、helicone-、x-portkey-、cf-aig-、x-kong-、x-bt- 前缀。插件宿主的内部执行即使为 false 仍收到过滤后的头。 |
| requests.proxy-url | 全局出站代理地址。 | empty string | 空字符串不设置全局代理。仅 socks5、socks5h、http、https 有效。缺少方案或主机，或其他方案，均无效。direct 与 none 不是本字段的全局值。 |
| requests.tls-handshake-timeout-seconds | 共享 uTLS 客户端的 TLS 握手上限秒数。 | The default 0 disables the bound (previous behavior); negative values are treated as 0, and values beyond the representable duration range saturate. | 只作用于 Claude Code 的 Anthropic uTLS 传输和 Chrome ChatGPT/Codex uTLS 传输，不作用于标准回退传输。计时从 TCP 或代理连接返回之后开始。握手成功后取消限制。0 关闭；负数按 0；超出可表示时长时饱和到最大时长。 |

## 5. 常见错误与边界

全局 `proxy-url` 缺少方案或主机，或使用未支持的方案时，代理设置无效，传输会退回上下文中的 RoundTripper。`passthrough-headers: false` 不是错误。握手时限为 0 时不设置上限，对端接受连接但不完成 ClientHello 时，该 uTLS 路径仍可能一直等待。

## 6. 相关功能

流式保活见 [流式保活](/cn/routing/requests-keepalive)、[首字节前重试](/cn/routing/requests-bootstrap) 和 [首个 token 前保活](/cn/routing/requests-send)。按密钥代理见 [按密钥代理](/cn/accounts/api-keys-proxy)。

## 7. 使用经验

- [畸形响应先检查密钥上的代理](/cn/experience/accounts#exp-accounts-trace-key-proxy)
- [管理代发请求仍会使用全局代理](/cn/experience/management#exp-management-api-call-proxy-order)
- [让管理页文件能够下载](/cn/experience/routing#exp-routing-management-page-download)
- [为单个凭证指定代理](/cn/experience/routing#exp-routing-per-credential-proxy)
- [让服务器自己经代理完成登录](/cn/experience/routing#exp-routing-proxy-for-token-exchange)
