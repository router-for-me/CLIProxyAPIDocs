---
title: Default payload rules
feature_ids:
  - requests.payload.default-models-exist
  - requests.payload.default-models-from-protocol
  - requests.payload.default-models-headers
  - requests.payload.default-models-match
  - requests.payload.default-models-name
  - requests.payload.default-models-not-exist
  - requests.payload.default-models-not-match
  - requests.payload.default-models-protocol
  - requests.payload.default-params
  - requests.payload.default-raw-models-exist
  - requests.payload.default-raw-models-from-protocol
  - requests.payload.default-raw-models-headers
  - requests.payload.default-raw-models-match
  - requests.payload.default-raw-models-name
  - requests.payload.default-raw-models-not-exist
  - requests.payload.default-raw-models-not-match
  - requests.payload.default-raw-models-protocol
  - requests.payload.default-raw-params
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Default payload rules

## 1. What this solves

`requests.payload.default` fills in only fields that are not already in the original payload. `default-raw` also fills only missing fields, but inserts the value as raw JSON.

## 2. Scope and non-goals

The rules hang on `requests.payload`. They are applied after the built-in protocol translation and image-tool cleanup, and before the request is sent. When `models` is empty, or no model entry satisfies the name, protocol, source header, and path conditions at the same time, the rule writes no field. If any one model entry in the same rule matches, it writes. The rules on this page do not overwrite a value that already exists, and they do not delete fields.

## 3. How to configure or call it

```yaml
requests:
  payload:
    default:
      - models:
          - name: "gemini-*"
            protocol: "gemini"
            from-protocol: "responses"
            headers:
              X-Client-Tier: "tenant-*-region-*"
            match:
              - "metadata.client": "codex"
            not-match:
              - "metadata.mode": "dev"
            exist:
              - "tools"
            not-exist:
              - "metadata.disable_payload"
        params:
          "generationConfig.thinkingConfig.thinkingBudget": 32768
    default-raw:
      - models:
          - name: "gemini-2.5-pro"
            protocol: "gemini"
        params:
          "generationConfig.responseJsonSchema": "{\"type\":\"object\"}"
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| requests.payload.default.models.exist | These JSON paths must exist and not be null. | nil | The path must exist and not be null. An empty path is ignored. |
| requests.payload.default.models.from-protocol | Source-protocol limit. | empty string | An empty value does not limit. openai-response, openai-responses, and response are normalized to responses. When the source protocol is empty, a non-empty condition does not match. |
| requests.payload.default.models.headers | Request-header patterns that must match. | nil | Every configured header must match. * in a value is a wildcard. An empty map does not limit. If the request does not have that header, the rule does not match. |
| requests.payload.default.models.match | JSON paths must equal these values. | nil | Every condition must succeed. An empty path is ignored. Comparison uses the normalized JSON value. |
| requests.payload.default.models.name | Model name or wildcard. | empty string | An empty name does not match. * matches any candidate. Candidates include the upstream model name. If there is a request model, they also include the name after the thinking suffix is removed. The original request name with the suffix is added only when the request name itself has a thinking suffix. |
| requests.payload.default.models.not-exist | These JSON paths must be missing or null. | nil | The path must be missing or null. A non-null value means the rule does not match. An empty path is ignored. |
| requests.payload.default.models.not-match | JSON paths must not equal these values. | nil | If any path equals the configured value, the whole rule does not match. An empty path is ignored. |
| requests.payload.default.models.protocol | Target-protocol limit. | empty string | Case-insensitive. An empty value does not limit. The executor passes the actual protocol, such as openai, gemini, claude, codex, antigravity, or interactions. |
| requests.payload.default.params | JSON paths and values to write into the payload. | nil | An ordinary value is written only when the original payload lacks that path. The first successful write by default or default-raw on the same path wins. |
| requests.payload.default-raw.models.exist | These JSON paths must exist and not be null. | nil | The path must exist and not be null. An empty path is ignored. |
| requests.payload.default-raw.models.from-protocol | Source-protocol limit. | empty string | An empty value does not limit. openai-response, openai-responses, and response are normalized to responses. When the source protocol is empty, a non-empty condition does not match. |
| requests.payload.default-raw.models.headers | Request-header patterns that must match. | nil | Every configured header must match. * in a value is a wildcard. An empty map does not limit. If the request does not have that header, the rule does not match. |
| requests.payload.default-raw.models.match | JSON paths must equal these values. | nil | Every condition must succeed. An empty path is ignored. Comparison uses the normalized JSON value. |
| requests.payload.default-raw.models.name | Model name or wildcard. | empty string | An empty name does not match. * matches any candidate. Candidates include the upstream model name. If there is a request model, they also include the name after the thinking suffix is removed. The original request name with the suffix is added only when the request name itself has a thinking suffix. |
| requests.payload.default-raw.models.not-exist | These JSON paths must be missing or null. | nil | The path must be missing or null. A non-null value means the rule does not match. An empty path is ignored. |
| requests.payload.default-raw.models.not-match | JSON paths must not equal these values. | nil | If any path equals the configured value, the whole rule does not match. An empty path is ignored. |
| requests.payload.default-raw.models.protocol | Target-protocol limit. | empty string | Case-insensitive. An empty value does not limit. The executor passes the actual protocol, such as openai, gemini, claude, codex, antigravity, or interactions. |
| requests.payload.default-raw.params | JSON paths and raw JSON to write into the payload. | nil | Written only when the original payload lacks that path. A string is inserted as raw JSON and must be valid JSON. Other types are JSON-encoded first. It shares the first write with default. If SetRawBytes fails, the path is skipped. |

## 5. Common errors and limits

If the raw JSON is not valid JSON, or `SetRawBytes` fails, that path is skipped. No separate configuration-load error is returned. When the model list is empty, the whole rule does not match. A path written by `default` or `default-raw` is not rewritten by a later default rule.

## 6. Related behavior

The other two kinds of rules are in [Default payload rules](/routing/requests-default), [Override payload rules](/routing/requests-override), and [Filter payload rules](/routing/requests-filter). Model thinking itself is in [Model thinking](/configuration/thinking-models).

## 7. Field experience

- [Use a fork alias to distinguish image sizes](/experience/routing#exp-routing-fork-alias-for-image-size)
- [Image size is written in imageConfig](/experience/routing#exp-routing-gemini-image-config-path)

