---
title: Vertex Interactions
feature_ids:
  - api-keys.vertex.interactions
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Vertex Interactions

## 1. What this solves

Let one Vertex API key use the native Vertex Interactions API.

## 2. Scope and non-goals

This is only this one setting. The Gemini interactions key group is a separate set of keys. This boolean does not switch it.

## 3. How to configure or call it

```yaml
api-keys:
  vertex:
    - name: vertex-1
      interactions: true
      keys:
        - api-key: "YOUR_API_KEY"
```

To enable it on a service-account JSON file, write `interactions: true` at the file root.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.vertex.interactions | Whether this Vertex key uses the native Interactions API. | nil | Omitted or false does not enable it. true makes this Vertex key use the native Vertex Interactions API. A service-account file writes interactions: true at the root. |

## 5. Common errors and limits

Omitting it is treated as not enabled. It does not change an ordinary Gemini generateContent key.

## 6. Related behavior

The Interactions key is the interactions entry in [Upstream API keys](/accounts/api-keys-api).

## 7. Field experience

None yet.
