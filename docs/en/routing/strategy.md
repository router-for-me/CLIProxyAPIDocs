---
title: Routing strategy
feature_ids:
  - routing.force-model-prefix.value
  - routing.retry.max-retry-credentials
  - routing.retry.max-retry-interval
  - routing.retry.request-retry
  - routing.session-affinity-rebind-on.value
  - routing.session-affinity-subagents.value
  - routing.session-affinity-ttl.value
  - routing.session-affinity.value
  - routing.strategy.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Routing strategy

## 1. What this solves

This page decides which matching credential is used first, whether the same session stays on the same credential, and after a failure how many more rounds are allowed, how many credentials each round may try, and how long to wait at most.

## 2. Scope and non-goals

These keys belong to `routing`. They do not create an upstream key, and they do not change `weight`, `priority`, or `request-retry` on a single key. An established session binding wins over credential priority. Priority still decides a cold bind, a request without a session, and rebinding after failover. When `session-affinity` is false, neither child-session inheritance nor the rebind condition takes effect.

## 3. How to configure or call it

```yaml
routing:
  strategy: "round-robin"
  session-affinity: false
  session-affinity-ttl: "1h"
  session-affinity-subagents: true
  session-affinity-rebind-on: "any"
  force-model-prefix: false
  retry:
    request-retry: 0
    max-retry-credentials: 0
    max-retry-interval: 0
```

The sample configuration writes `request-retry` as 3 and `max-retry-interval` as 30. The zero values when they are not written are still the defaults in the table.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| routing.force-model-prefix | Whether a model name without a prefix can land only on a credential without a prefix. | false | When true, a request without a prefix uses only credentials that have no prefix, unless the prefix itself equals the model name. When false, a request without a prefix may also use a credential that has a prefix. A prefixed credential still exposes prefix/model. |
| routing.retry.max-retry-credentials | How many different credentials one round may try at most. | 0 | 0 or a negative value means every qualified credential in that round is tried. A negative value is normalized to 0 on load and at runtime. A credential skipped by the limit still ages with the global rounds. |
| routing.retry.max-retry-interval | The longest wait, in seconds, for cooldown before the next round. | 0 | A non-positive value does not allow a positive cooldown wait, but it does not turn off failover in the same round, and it does not turn off later rounds that need no wait. |
| routing.retry.request-retry | How many credential rounds may still run after round 0. | 0 | A negative value is treated as 0. Round r accepts only a credential whose effective value is at least r. An explicit non-negative value on a credential or provider wins. Omitted or negative inherits this value. An explicit 0 enters only round 0. Extra rounds apply to HTTP 403, 408, 429, 500, 502, 503, 504, and temporary transport errors. |
| routing.session-affinity-rebind-on | Which failures rebind an already bound session to the failover credential. | Supported values: - "any" (default): any credential-attributed failure unbinds and rebinds on failover. | Only quota changes the default any. Under quota, 408, 5xx, an empty stream, and a buffer limit fail over for that request only and keep the original binding. 429, 401, 402, 403, 404, an unsupported model, or invalid_grant still rebind. Any other value is treated as any. It is ignored when session affinity is off. |
| routing.session-affinity-subagents | Whether a request that carries a child-session reference reuses the parent credential. | Default: true. | Omitted or a null pointer stays true. When false, the child session uses the fallback selector. It applies only to Claude, Codex, Antigravity, and Gemini. It is ignored when session affinity is off. |
| routing.session-affinity-ttl | How long a session-to-credential binding is kept. | Default: 1h. | The runtime default is 1h. A positive duration shorter than 1 second is raised to 1 second. An empty value, a value that cannot be parsed, or a non-positive duration stays 1h. 30m, 1h, and 2h30m can be written. |
| routing.session-affinity | Pin a session to the same upstream credential. | false | It prefers the explicit session headers of Claude Code, Codex, OpenCode, and pi, then prompt_cache_key, a Responses conversation ID, an old request-body ID, an execution or derived session identifier, and a hash of the message content. If the bound credential is unavailable, failover still happens. |
| routing.strategy | Credential selection strategy. | Supported values: "round-robin" (default), "weighted-round-robin", "fill-first". | round-robin, weighted-round-robin, and fill-first. The aliases roundrobin, rr, weightedroundrobin, wrr, fillfirst, and ff are normalized. Any other value is still round-robin. Weighted selection uses the credential's integer weight. Omitted is 1. The maximum is 1,000,000. A non-positive number excludes the credential while that strategy is in effect. fill-first takes the first available credential in a fixed order. |

## 5. Common errors and limits

An unrecognized `strategy` is not reported as an error. round-robin continues to be used. If `session-affinity-ttl` cannot be parsed, the configuration is not rejected. The binding is still kept for 1 hour. If `session-affinity-rebind-on` is not `quota`, it is treated as `any` and no configuration error is returned. If the global `request-retry` is negative, it is treated as 0 and startup is not rejected.

## 6. Related behavior

Cooldown is in [Cooldown](/routing/cooldown). The outbound proxy is in [Outbound requests](/routing/requests-value). Credential weight is in [Credential weight](/accounts/api-keys-weight).

## 7. Field experience

- [Map a client model name to the real model with an alias](/experience/accounts#exp-accounts-alias-client-model)
- [An alias takes part in round-robin only when it matches the requested model name](/experience/accounts#exp-accounts-alias-matches-request)
- [Codex goal mode needs all three settings together](/experience/accounts#exp-accounts-codex-goal-mode)
- [Compatible providers share the same routing strategy](/experience/routing#exp-routing-compat-shares-strategy)
- [After a 429, skip that model until the reset time](/experience/routing#exp-routing-cooldown-until-reset)
- [Use fill-first to fill one credential](/experience/routing#exp-routing-fill-first)
- [fill-first returns to the previous account after quota recovers](/experience/routing#exp-routing-fill-first-recovers)
- [If a request without a prefix fails, check the forced prefix](/experience/routing#exp-routing-force-prefix-off)
- [Round-robin starts only after priority is exhausted](/experience/routing#exp-routing-priority-before-strategy)
- [responses rotates by a shared cache key](/experience/routing#exp-routing-responses-cache-key)
- [A 503 is handled by the retry rounds](/experience/routing#exp-routing-retry-503)
- [Round-robin skips a credential that cannot serve](/experience/routing#exp-routing-round-robin-skip)
- [Models with the same name share a routing strategy](/experience/routing#exp-routing-same-model-name)
- [Turn on session affinity to keep encrypted reasoning](/experience/routing#exp-routing-session-affinity)
- [Use the existing retry and cooldown for a 429 retry](/experience/routing#exp-routing-tune-retry-and-cooling)
