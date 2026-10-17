---
title: Management API
feature_ids:
  - management.v0.deprecated
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Management API

## 1. What this solves

This page states that `/v0/management` is no longer maintained. New calls must not treat this set of endpoints as current.

## 2. Scope and non-goals

This page does not register the old routes and does not give call steps. The current management API is [Management API v8](/management/apiv8). The key and the remote switch are still in [Management settings](/operations/management-settings). Those settings still apply to process behavior that remains, but they are not a usage guide for v0.

## 3. How to configure or call it

There is no current way to call it. Use `/v8/management`, starting from [Management API v8](/management/apiv8).

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| management.v0.deprecated | `/v0/management` is no longer maintained and is not documented route by route. |  | The owning page keeps only the deprecation note. |

## 5. Common errors and limits

In Home mode, or when the management key, `MANAGEMENT_PASSWORD`, and the local password are all unset, this prefix returns 404. Do not record a response that an old client once received as the current contract.

## 6. Related behavior

Current configuration and operations routes are in [Management API v8](/management/apiv8).

## 7. Field experience

None yet.
