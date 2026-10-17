---
title: Listener and process
feature_ids:
  - server.commercial-mode.value
  - server.github-token.value
  - server.host.value
  - server.max-request-body-bytes.value
  - server.port.value
  - server.trusted-proxies.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Listener and process

## 1. What this solves

This page decides which interface and port the process listens on, how large an inbound request body may be, whether a client address forwarded by a reverse proxy is trusted, and whether expensive logs and middleware are turned off to reduce memory under high concurrency. The token used for GitHub release information is here as well.

## 2. Scope and non-goals

These keys belong to `server`. They do not issue a client access key, and they do not open the management API. HTTPS certificates are in [TLS](/operations/tls). LAN advertisements are in [LAN discovery](/operations/discovery). Home mode has its own port normalization. See [CLIProxyAPI Home](/operations/home).

## 3. How to configure or call it

The sample configuration uses the values below. Keys that are not written still follow the defaults in section 4.

```yaml
server:
  host: ""
  port: 8317
  max-request-body-bytes: 0
  github-token: ""
  trusted-proxies: []
  commercial-mode: false
```

A `trusted-proxies` sample entry is an IP or CIDR, for example `127.0.0.1` and `192.0.2.0/24`. Do not write a token into the repository. When one is needed, use the placeholder `YOUR_API_KEY`, or leave it empty and use an environment variable instead.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| server.commercial-mode | To reduce per-request memory, turn off expensive request logs and HTTP middleware features. | false | When true, request-log middleware is not attached for this process, and request logging on the SDK side is treated as off. |
| server.github-token | Global token used for GitHub requests. It takes priority over `GITHUB_TOKEN`. | empty string | A non-empty configured value wins. Otherwise `GITHUB_TOKEN` and then `github_token` are used. `GITSTORE_GIT_TOKEN` is used only when `GITSTORE_GIT_URL` points at github.com. The token is used only for HTTPS `api.github.com`. |
| server.host | Host or interface the API server binds. | Default is empty ("") to bind all interfaces (IPv4 + IPv6). | An empty string binds every IPv4 and IPv6 interface. To limit it to this machine, write `127.0.0.1` or `localhost`. |
| server.max-request-body-bytes | Byte limit for an inbound HTTP request body. | Values <= 0 disable the limit (default). | Less than or equal to 0 means no limit. A request over the limit returns HTTP 413. |
| server.port | Listen port of the API server. | 0 | A normal load does not change 0 into another port. The sample configuration writes 8317. Only a port fetched from Home is changed to 8317 when it is omitted or not positive. |
| server.trusted-proxies | IPs or CIDRs allowed to supply a forwarded client-IP header. | nil | An empty list does not trust forwarded headers. Applied at startup. An illegal entry (blank, leading or trailing space, neither an IP nor a CIDR) makes configuration loading fail. If the list cannot be applied, forwarded headers are ignored. A change requires a restart. |

## 5. Common errors and limits

If `trusted-proxies` contains an empty string, leading or trailing whitespace, or an address that cannot be parsed, configuration loading fails. The error says an IP or CIDR is expected. When the port is 0 and this is not the Home normalization path, the process listens on `host:0` and does not automatically change it to the sample 8317. `commercial-mode: true` does not by itself turn off the management API.

## 6. Related behavior

The certificate and private key are in [TLS](/operations/tls). Liveness probes are in [Health checks](/operations/health). Log switches are in [Logs and usage](/operations/observability).

## 7. Field experience

- [An empty host listens on every interface](/experience/operations#exp-operations-bind-host-port)
- [Stop the old process first when the port is already in use](/experience/operations#exp-operations-port-already-bound)
- [Turn off expensive logs to reduce memory](/experience/operations#exp-operations-reduce-memory)
