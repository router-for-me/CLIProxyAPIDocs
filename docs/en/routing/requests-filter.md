---
title: Filter payload rules
feature_ids:
  - requests.payload.filter-models-exist
  - requests.payload.filter-models-from-protocol
  - requests.payload.filter-models-headers
  - requests.payload.filter-models-match
  - requests.payload.filter-models-name
  - requests.payload.filter-models-not-exist
  - requests.payload.filter-models-not-match
  - requests.payload.filter-models-protocol
  - requests.payload.filter-params
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Filter payload rules

## 1. What this solves

`requests.payload.filter` deletes fields by JSON path. It is used to remove parameters the upstream should not see.

## 2. Scope and non-goals

Filtering runs after the default rules and the override rules, so it can delete a path those rules just wrote. `params` here is a list of paths, not a map from path to value. When `models` is empty, or no model entry matches completely, the rule deletes nothing. If any one model entry in the same rule matches, it deletes. This page does not write a new value.

## 3. How to configure or call it

```yaml
requests:
  payload:
    filter:
      - models:
          - name: "gemini-*"
            protocol: "gemini"
        params:
          - "generationConfig.thinkingConfig.thinkingBudget"
          - "generationConfig.responseJsonSchema"
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| requests.payload.filter.models.exist | These JSON paths must exist and not be null. | nil | The path must exist and not be null. An empty path is ignored. |
| requests.payload.filter.models.from-protocol | Source-protocol limit. | empty string | An empty value does not limit. openai-response, openai-responses, and response are normalized to responses. When the source protocol is empty, a non-empty condition does not match. |
| requests.payload.filter.models.headers | Request-header patterns that must match. | nil | Every configured header must match. `*` in a value is a wildcard. An empty map does not limit. If the request does not have that header, the rule does not match. |
| requests.payload.filter.models.match | JSON paths must equal these values. | nil | Every condition must succeed. An empty path is ignored. Comparison uses the normalized JSON value. |
| requests.payload.filter.models.name | Model name or wildcard. | empty string | An empty name does not match. `*` matches any candidate. Candidates include the upstream model name. If there is a request model, they also include the name after the thinking suffix is removed. The original request name with the suffix is added only when the request name itself has a thinking suffix. |
| requests.payload.filter.models.not-exist | These JSON paths must be missing or null. | nil | The path must be missing or null. A non-null value means the rule does not match. An empty path is ignored. |
| requests.payload.filter.models.not-match | JSON paths must not equal these values. | nil | If any path equals the configured value, the whole rule does not match. An empty path is ignored. |
| requests.payload.filter.models.protocol | Target-protocol limit. | empty string | Case-insensitive. An empty value does not limit. The executor passes the actual protocol, such as openai, gemini, claude, codex, antigravity, or interactions. |
| requests.payload.filter.params | JSON paths to delete from the payload. | nil | Deleted after default, default-raw, override, and override-raw. It can therefore delete a path that was just written. An empty path is skipped. A failed deletion is also skipped. |

## 5. Common errors and limits

An empty path and a failed deletion are both skipped. They do not stop the other paths. When a model or protocol condition does not match, nothing is deleted. When `models` is empty, the rule does not take effect.

## 6. Related behavior

The other two kinds of rules are in [Default payload rules](/routing/requests-default), [Override payload rules](/routing/requests-override), and [Filter payload rules](/routing/requests-filter). Model thinking itself is in [Model thinking](/configuration/thinking-models).

## 7. Field experience

- [A thinking level cannot be declared by filtering](/experience/configuration#exp-configuration-levels-before-filter)
- [Filter the field when the level is not allowed](/experience/configuration#exp-configuration-levels-or-filter)
- [Do not also set a budget when filtering reasoning_effort](/experience/routing#exp-routing-filter-effort-without-budget)
- [Use a payload filter to drop fields the upstream rejects](/experience/routing#exp-routing-filter-rejected-fields)
