---
title: Outbound requests
feature_ids:
  - requests.nonstream-keepalive-interval.value
  - requests.passthrough-headers.value
  - requests.proxy-url.value
  - requests.tls-handshake-timeout-seconds.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Outbound requests

## 1. What this solves

This page controls the proxy shared by every upstream request, response-header forwarding, non-streaming blank-line keep-alive, and the TLS handshake limit of the built-in uTLS client.

## 2. Scope and non-goals

The proxy address is a global value. A `proxy-url` on a single credential overrides it separately. `direct` and `none` belong only to those entries. They bypass both this global value and the environment proxy at the same time, and they cannot be used as a global spelling of this field. The handshake limit covers only the TLS handshake on the shared uTLS client. It does not limit dialing, proxy CONNECT, inference, or a long stream that is already established.

## 3. How to configure or call it

```yaml
requests:
  proxy-url: ""
  tls-handshake-timeout-seconds: 0
  passthrough-headers: false
  nonstream-keepalive-interval: 0
```

When a global proxy is needed, the scheme is only `socks5`, `socks5h`, `http`, or `https`, for example `socks5://example.invalid:1080`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| requests.nonstream-keepalive-interval | Interval in seconds for blank lines on a non-streaming response. | 0 | Less than or equal to 0 turns it off. The unit is seconds, and the output is a blank line. |
| requests.passthrough-headers | Whether to forward filtered upstream response headers to the client. | Default is false (disabled). | false does not forward them to an ordinary client. Before forwarding, hop-by-hop headers, Set-Cookie, Content-Length, Content-Encoding, CPA-managed CORS and X-Cpa-Trace-Id, headers named by Connection, and the prefixes x-litellm-, helicone-, x-portkey-, cf-aig-, x-kong-, and x-bt- are removed. The plugin host's internal execution still receives the filtered headers even when this is false. |
| requests.proxy-url | Global outbound proxy address. | empty string | An empty string does not set a global proxy. Only socks5, socks5h, http, and https are valid. A missing scheme or host, or any other scheme, is invalid. direct and none are not global values of this field. |
| requests.tls-handshake-timeout-seconds | TLS handshake limit in seconds for the shared uTLS client. | The default 0 disables the bound (previous behavior); negative values are treated as 0, and values beyond the representable duration range saturate. | It applies only to the Claude Code Anthropic uTLS transport and the Chrome ChatGPT/Codex uTLS transport, not to the standard fallback transport. Timing starts after the TCP or proxy connection returns. The limit is cancelled after the handshake succeeds. 0 turns it off. A negative value is treated as 0. A value beyond the representable duration saturates to the maximum duration. |

## 5. Common errors and limits

If the global `proxy-url` is missing a scheme or host, or uses an unsupported scheme, the proxy setting is invalid and transport falls back to the RoundTripper in the context. `passthrough-headers: false` is not an error. When the handshake limit is 0, no upper bound is set. If the peer accepts the connection but does not complete ClientHello, that uTLS path can still wait indefinitely.

## 6. Related behavior

Streaming keep-alive is in [Streaming keep-alive](/routing/requests-keepalive), [Retry before the first byte](/routing/requests-bootstrap), and [Keep-alive before the first token](/routing/requests-send). Per-key proxy is in [Per-key proxy](/accounts/api-keys-proxy).

## 7. Field experience

- [If the response is malformed, check the proxy on the key first](/experience/accounts#exp-accounts-trace-key-proxy)
- [A management proxied request still uses the global proxy](/experience/management#exp-management-api-call-proxy-order)
- [Make the management page files downloadable](/experience/routing#exp-routing-management-page-download)
- [Assign a proxy to one credential](/experience/routing#exp-routing-per-credential-proxy)
- [Let the server complete login through a proxy itself](/experience/routing#exp-routing-proxy-for-token-exchange)
