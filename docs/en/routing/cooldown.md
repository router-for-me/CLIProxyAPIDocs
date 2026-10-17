---
title: Cooldown
feature_ids:
  - routing.cooldown.disable-cooling
  - routing.cooldown.save-cooldown-status
  - routing.cooldown.transient-error-cooldown-seconds
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Cooldown

## 1. What this solves

After an upstream failure, the proxy can temporarily take a credential or a model out of selection. This page controls whether that cooldown is scheduled, whether cooldown state is written to disk, and how long a temporary upstream error cools down.

## 2. Scope and non-goals

This is the global cooldown policy. When `disable-cooling` appears on a credential or a provider, that explicit value wins, including an explicit false. This page does not define exponential backoff after quota exhaustion, and it does not switch project or preview model. Home mode does not schedule local cooldown in this process.

## 3. How to configure or call it

```yaml
routing:
  cooldown:
    disable-cooling: false
    save-cooldown-status: false
    transient-error-cooldown-seconds: 0
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| routing.cooldown.disable-cooling | When true, credential and model cooldown are not scheduled. | false | An explicit value on a credential or provider overrides it. Home mode does not schedule local cooldown. |
| routing.cooldown.save-cooldown-status | Whether to write runtime cooldown state next to the credential. | false | When true, a .cds file is written next to each credential. When false, it stays only in memory. |
| routing.cooldown.transient-error-cooldown-seconds | Cooldown seconds for a temporary upstream error. | 0 keeps the legacy default cooldown. | Applies to 408, 500, 502, 503, 504, and 520 through 526. 0 uses the old 60 seconds. A negative value turns this kind of cooldown off. When a positive Retry-After is present, that hint is used. |

## 5. Common errors and limits

Setting the temporary cooldown seconds to 0 does not turn cooldown off and is not rejected. It stays at 60 seconds. Only a negative value turns this kind of cooldown off. `disable-cooling: false` is a valid value. It cannot be used to mean "omitted".

## 6. Related behavior

Retry rounds are in [Routing strategy](/routing/strategy). The old project and preview-model switches are in [Quota compatibility switches](/routing/quota-exceeded).

## 7. Field experience

- [Pause a credential with the management API](/experience/management#exp-management-disable-credential)
- [Clear cooldown with the management route](/experience/management#exp-management-reset-cooldown)
- [After a 429, skip that model until the reset time](/experience/routing#exp-routing-cooldown-until-reset)
- [Turn cooling off to keep the credential selectable](/experience/routing#exp-routing-disable-cooling)
- [Use the existing retry and cooldown for a 429 retry](/experience/routing#exp-routing-tune-retry-and-cooling)
