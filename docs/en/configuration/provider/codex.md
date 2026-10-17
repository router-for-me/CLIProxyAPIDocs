---
title: Codex provider options
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
translation_pending: false
---

# Codex provider options

## 1. What this solves

This page covers cloaking, stream buffering, the media relay, request headers, and the Sign in with ChatGPT identifier shared by Codex OAuth and file credentials.

## 2. Scope and non-goals

websockets, alpha-search, and disable-codex-cloaking on an API key are not on this page. The login command is not on this page.

## 3. How to configure or call it

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

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| oauth.providers.codex.header-defaults.beta-features | oauth.providers.codex.header-defaults.beta-features | empty string | Supplied only to a Codex OAuth WebSocket. It does not apply to HTTP, and it does not apply to api-keys.codex. |
| oauth.providers.codex.header-defaults.user-agent | oauth.providers.codex.header-defaults.user-agent | empty string | Supplied only to a Codex OAuth or file credential that did not send that header, for both HTTP and WebSocket. It does not apply to api-keys.codex. |
| oauth.providers.codex.live-media-relay.disable-private-remote-ips | oauth.providers.codex.live-media-relay.disable-private-remote-ips | false | true rejects private, loopback, link-local, and unspecified addresses. It cannot appear together with the old key allow-private-remote-ips. |
| oauth.providers.codex.live-media-relay.enabled | oauth.providers.codex.live-media-relay.enabled | false | When true, this process terminates and relays WebRTC, and inbound UDP is required. false keeps a direct connection. |
| oauth.providers.codex.live-media-relay.ice-servers.credential | oauth.providers.codex.live-media-relay.ice-servers.credential | empty string | YAML accepts it. The JSON configuration API does not return it. |
| oauth.providers.codex.live-media-relay.ice-servers.urls | oauth.providers.codex.live-media-relay.ice-servers.urls | nil | Required after it is enabled. The scheme can only be stun, stuns, turn, or turns. |
| oauth.providers.codex.live-media-relay.ice-servers.username | oauth.providers.codex.live-media-relay.ice-servers.username | empty string | YAML accepts it. The JSON configuration API does not return it. |
| oauth.providers.codex.live-media-relay.max-sessions | oauth.providers.codex.live-media-relay.max-sessions | 0 | 0 or omitted is treated as 32. After it is enabled, a negative value makes loading fail. |
| oauth.providers.codex.live-media-relay.public-ip | oauth.providers.codex.live-media-relay.public-ip | empty string | An empty value publishes nothing extra. After it is enabled, a non-empty value that is not an IP makes loading fail. |
| oauth.providers.codex.live-media-relay.udp-port-max | oauth.providers.codex.live-media-relay.udp-port-max | 0 | It cannot be less than udp-port-min. Filling in only one end makes an enabled relay fail to load. |
| oauth.providers.codex.live-media-relay.udp-port-min | oauth.providers.codex.live-media-relay.udp-port-min | 0 | It must be set together with udp-port-max. After it is enabled, the range must have at least two ports per session. |
| oauth.providers.codex.signin-with-chatgpt-identifier | oauth.providers.codex.signin-with-chatgpt-identifier | Defaults to "CLIProxyAPI". | Blank or omitted uses CLIProxyAPI. It is used for both agent_name_hint and the User-Agent prefix. |
| upstream.codex.disable-codex-cloaking | Whether to stop forcing the official Codex identity headers. | false | When true, the official Codex identity headers are no longer forced, for both HTTP/SSE and WebSocket. |
| upstream.codex.model-level-cooling | Whether quota cooling applies only to the current model. | false | When true, usage_limit_reached cooling is limited to the current model. |
| upstream.codex.orphan-delegation-compatibility | Whether orphan-delegation output compatibility is enabled. | false | When true, orphan delegation output that carries X-Openai-Subagent: collab_spawn is converted for compatibility. |
| upstream.codex.response-steering | Whether the full-duplex Codex WebSocket is enabled. | Default is false. | When true, the full-duplex WebSocket is enabled, and the whole lifetime is bound to the same upstream model, account, and socket. |
| upstream.codex.stream-bootstrap-buffering | Whether to hold stream frames from before generation starts. | Default is false. | When true, handshake, heartbeat, and still-empty added frames from before generation starts are held first. The limit is 48 frames and 1MB, not wall-clock time. Only overload and rate limiting deliberately switch credentials. |
| upstream.codex.stream-bootstrap-timeout | The longest time to hold response headers. | Defaults to "0" (unlimited time, relying purely on the 48-frame and 1MB byte bounds). | 0, 0s, none, unlimited, disabled, off, never, or a value that cannot be parsed all mean unlimited time. After a positive duration is reached, the stream is released. |

## 5. Common errors and limits

When the media relay enabled is false, the other fields are not validated. After it is enabled, a negative max-sessions, a public-ip that is not an IP, only one UDP end filled in, a range smaller than two ports per session, or an ICE URL scheme that is not stun, stuns, turn, or turns all make configuration loading fail. allow-private-remote-ips is deprecated and cannot appear together with disable-private-remote-ips. stream-bootstrap-timeout accepts a duration or a bare number of seconds. 0, 0s, none, unlimited, disabled, off, never, and a string that cannot be parsed all mean unlimited time. A blank Sign in with ChatGPT identifier uses CLIProxyAPI.

## 6. Related behavior

Login is in [Codex login](/accounts/codex). Per-key WebSocket is in [Responses WebSocket transport](/accounts/api-keys-websockets).

## 7. Field experience

- [A Codex client must match the User-Agent default](/experience/accounts#exp-accounts-codex-client-user-agent)
- [On a 503, check both Codex cloaking and User-Agent](/experience/accounts#exp-accounts-codex-cloak-and-user-agent)
