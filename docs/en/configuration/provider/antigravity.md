---
title: Antigravity provider options
feature_ids:
  - oauth.providers.antigravity-antigravity-credits
  - oauth.providers.antigravity-connection-pool-enabled
  - oauth.providers.antigravity-connection-pool-idle-conn-timeout
  - oauth.providers.antigravity-connection-pool-max-idle-conns-per-host
  - oauth.providers.antigravity-sensitive-words
  - oauth.providers.antigravity-signature-bypass-strict
  - oauth.providers.antigravity-signature-cache-enabled
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Antigravity provider options

## 1. What this solves

This page covers credits, the connection pool, sensitive words, and the thinking-signature cache shared by Antigravity OAuth credentials.

## 2. Scope and non-goals

The login command is not on this page. These options do not apply to an API-key group.

## 3. How to configure or call it

```yaml
oauth:
  providers:
    antigravity:
      antigravity-credits: false
      sensitive-words:
        - "API"
      connection-pool:
        enabled: false
        idle-conn-timeout: "30s"
        max-idle-conns-per-host: 2
      signature-cache-enabled: true
      signature-bypass-strict: false
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| oauth.providers.antigravity.antigravity-credits | After the free tier is exhausted, whether to switch to a credential that has Google One AI credits. | false | It applies only to Claude models. Only after every free-tier credential is exhausted by 429 or 503 does it use a credential that still has credits as the last fallback. false, or omitting it, does not do that fallback. |
| oauth.providers.antigravity.connection-pool.enabled | oauth.providers.antigravity.connection-pool.enabled | Defaults to false (short-lived connection mode). | oauth.providers.antigravity.connection-pool.enabled |
| oauth.providers.antigravity.connection-pool.idle-conn-timeout | oauth.providers.antigravity.connection-pool.idle-conn-timeout | Defaults to "30s". | oauth.providers.antigravity.connection-pool.idle-conn-timeout |
| oauth.providers.antigravity.connection-pool.max-idle-conns-per-host | oauth.providers.antigravity.connection-pool.max-idle-conns-per-host | Defaults to 2. | oauth.providers.antigravity.connection-pool.max-idle-conns-per-host |
| oauth.providers.antigravity.sensitive-words | oauth.providers.antigravity.sensitive-words | nil | Listed words are disrupted with zero-width characters in the matching prompt. When omitted, they are not processed. |
| oauth.providers.antigravity.signature-bypass-strict | oauth.providers.antigravity.signature-bypass-strict | nil | oauth.providers.antigravity.signature-bypass-strict |
| oauth.providers.antigravity.signature-cache-enabled | oauth.providers.antigravity.signature-cache-enabled | When true (default), cached signatures are preferred and validated. | oauth.providers.antigravity.signature-cache-enabled |

## 5. Common errors and limits

The connection pool is enabled only when enabled is true. If idle-conn-timeout cannot be parsed, a warning is logged and 30s is used. Above 210s it is truncated to 210s. Less than or equal to 0 switches to a short-lived connection. If max-idle-conns-per-host is greater than 100, it is truncated to 100. Less than 0 switches to a short-lived connection. When the signature cache is omitted, it is true. signature-bypass-strict takes effect only after the cache is turned off. When antigravity-credits is true, a credential that still has Google One AI credits is used only after every free-tier credential for Claude models is exhausted by 429 or 503. false, or omitting it, does not do that fallback.

## 6. Related behavior

Login is in [Antigravity login](/accounts/antigravity).

## 7. Field experience

- [Use the credits fallback before switching quota](/experience/configuration#exp-configuration-antigravity-credits)
