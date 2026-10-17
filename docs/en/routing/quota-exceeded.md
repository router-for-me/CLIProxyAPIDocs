---
title: Quota compatibility switches
feature_ids:
  - quota-exceeded.switch-preview-model.value
  - quota-exceeded.switch-project.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Quota compatibility switches

## 1. What this solves

Old configuration used two booleans to say whether to switch project or preview model after quota was exhausted. The pinned code still stores both values, but neither the selector nor the executor reads them to perform a switch.

## 2. Scope and non-goals

They have no new v8 counterpart, and the active v8 sample template does not write them. Old files and v8 migration keep an existing value. Antigravity credits have moved to `oauth.providers.antigravity.antigravity-credits` and do not belong on this page. This page does not change cooldown time or retry rounds.

## 3. How to configure or call it

```yaml
quota-exceeded:
  switch-project: false
  switch-preview-model: false
```

The old management routes are still registered:

- `GET`, `PUT`, `PATCH` `/v0/management/quota-exceeded/switch-project`
- `GET`, `PUT`, `PATCH` `/v0/management/quota-exceeded/switch-preview-model`

`GET` returns the matching boolean field. `PUT` and `PATCH` read the boolean `value` in a JSON object.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| quota-exceeded.switch-preview-model | Stores whether it is marked to switch the preview model when quota is exhausted. | false | The selector and the executor do not read the value, so it does not change the project or the model. Old files and v8 migration keep it. The active v8 sample template omits it. |
| quota-exceeded.switch-project | Stores whether it is marked to switch project when quota is exhausted. | false | The selector and the executor do not read the value, so it does not change the project or the model. Old files and v8 migration keep it. The active v8 sample template omits it. |

## 5. Common errors and limits

If `PUT` or `PATCH` on the old management API has no boolean `value`, the response is 400 with the body `invalid body`. Setting only these two keys to true does not make the current selector switch project or preview model.

## 6. Related behavior

The actual cooldown is in [Cooldown](/routing/cooldown). Antigravity credits are not on this page.

## 7. Field experience

- [An alias takes part in round-robin only when it matches the requested model name](/experience/accounts#exp-accounts-alias-matches-request)
