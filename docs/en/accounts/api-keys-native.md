---
title: Native Claude tool search
feature_ids:
  - api-keys.claude.native-tool-search
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Native Claude tool search

## 1. What this solves

Declare that a Claude key using a custom address can receive Anthropic native tool search.

## 2. Scope and non-goals

The official api.anthropic.com does not need this switch. It also depends on upstream.claude.tool-search.

## 3. How to configure or call it

```yaml
api-keys:
  claude:
    - name: claude-1
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
          native-tool-search: true
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.claude.native-tool-search | Whether to trust Anthropic native tool search on a custom address. | false | The official api.anthropic.com does not need it. A custom base-url must set it to true, and upstream.claude.tool-search must also be true, before defer_loading and tool_reference are trusted. |

## 5. Common errors and limits

When false or omitted, a custom gateway is not treated as native tool search. Turning on only this item while global tool-search is still false does not enable Codex tool_search by itself.

## 6. Related behavior

The global switch is in [Claude upstream behavior](/accounts/upstream).

## 7. Field experience

None yet.
