---
title: xAI search tool
feature_ids:
  - upstream.xai.inject-x-search
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# xAI search tool

## 1. What this solves

When a request has not declared x_search, the proxy adds xAI's native search tool.

## 2. Scope and non-goals

Login and API keys are not on this page. After injection, it is also added to tool_choice.allowed_tools when that applies.

## 3. How to configure or call it

```yaml
upstream:
  xai:
    inject-x-search: false
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| upstream.xai.inject-x-search | Whether to inject xAI's x_search when the request did not declare it. | false | When true, it is injected only if the request did not declare x_search, and it is also added to tool_choice.allowed_tools when that applies. |

## 5. Common errors and limits

false, or omitting it, injects nothing. true injects only when the request itself did not declare that tool.

## 6. Related behavior

Login is in [xAI login](/accounts/xai).

## 7. Field experience

None yet.
