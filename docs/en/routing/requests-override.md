---
title: Override payload rules
feature_ids:
  - requests.payload.override-models-exist
  - requests.payload.override-models-from-protocol
  - requests.payload.override-models-headers
  - requests.payload.override-models-match
  - requests.payload.override-models-name
  - requests.payload.override-models-not-exist
  - requests.payload.override-models-not-match
  - requests.payload.override-models-protocol
  - requests.payload.override-params
  - requests.payload.override-raw-models-exist
  - requests.payload.override-raw-models-from-protocol
  - requests.payload.override-raw-models-headers
  - requests.payload.override-raw-models-match
  - requests.payload.override-raw-models-name
  - requests.payload.override-raw-models-not-exist
  - requests.payload.override-raw-models-not-match
  - requests.payload.override-raw-models-protocol
  - requests.payload.override-raw-params
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Override payload rules

## 1. What this solves

`requests.payload.override` always writes a field and replaces an existing value. `override-raw` also always writes, but inserts the value as raw JSON.

## 2. Scope and non-goals

On the same path, the later matching override rule wins. They run after the default rules and before the filter rules. A filter rule can still delete a path written here. When `models` is empty, or no model entry matches completely, the rule writes nothing. If any one model entry in the same rule matches, it writes. This page does not cover "write only when missing".

## 3. How to configure or call it

```yaml
requests:
  payload:
    override:
      - models:
          - name: "gpt-*"
            protocol: "codex"
        params:
          "reasoning.effort": "high"
    override-raw:
      - models:
          - name: "gpt-*"
            protocol: "codex"
        params:
          "response_format": "{\"type\":\"json_schema\"}"
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| requests.payload.override.models.exist | These JSON paths must exist and not be null. | nil | The path must exist and not be null. An empty path is ignored. |
| requests.payload.override.models.from-protocol | Source-protocol limit. | empty string | An empty value does not limit. openai-response, openai-responses, and response are normalized to responses. When the source protocol is empty, a non-empty condition does not match. |
| requests.payload.override.models.headers | Request-header patterns that must match. | nil | Every configured header must match. * in a value is a wildcard. An empty map does not limit. If the request does not have that header, the rule does not match. |
| requests.payload.override.models.match | JSON paths must equal these values. | nil | Every condition must succeed. An empty path is ignored. Comparison uses the normalized JSON value. |
| requests.payload.override.models.name | Model name or wildcard. | empty string | An empty name does not match. * matches any candidate. Candidates include the upstream model name. If there is a request model, they also include the name after the thinking suffix is removed. The original request name with the suffix is added only when the request name itself has a thinking suffix. |
| requests.payload.override.models.not-exist | These JSON paths must be missing or null. | nil | The path must be missing or null. A non-null value means the rule does not match. An empty path is ignored. |
| requests.payload.override.models.not-match | JSON paths must not equal these values. | nil | If any path equals the configured value, the whole rule does not match. An empty path is ignored. |
| requests.payload.override.models.protocol | Target-protocol limit. | empty string | Case-insensitive. An empty value does not limit. The executor passes the actual protocol, such as openai, gemini, claude, codex, antigravity, or interactions. |
| requests.payload.override.params | JSON paths and values to write into the payload. | nil | Always written, replacing an existing value. The later matching override rule wins. |
| requests.payload.override-raw.models.exist | These JSON paths must exist and not be null. | nil | The path must exist and not be null. An empty path is ignored. |
| requests.payload.override-raw.models.from-protocol | Source-protocol limit. | empty string | An empty value does not limit. openai-response, openai-responses, and response are normalized to responses. When the source protocol is empty, a non-empty condition does not match. |
| requests.payload.override-raw.models.headers | Request-header patterns that must match. | nil | Every configured header must match. * in a value is a wildcard. An empty map does not limit. If the request does not have that header, the rule does not match. |
| requests.payload.override-raw.models.match | JSON paths must equal these values. | nil | Every condition must succeed. An empty path is ignored. Comparison uses the normalized JSON value. |
| requests.payload.override-raw.models.name | Model name or wildcard. | empty string | An empty name does not match. * matches any candidate. Candidates include the upstream model name. If there is a request model, they also include the name after the thinking suffix is removed. The original request name with the suffix is added only when the request name itself has a thinking suffix. |
| requests.payload.override-raw.models.not-exist | These JSON paths must be missing or null. | nil | The path must be missing or null. A non-null value means the rule does not match. An empty path is ignored. |
| requests.payload.override-raw.models.not-match | JSON paths must not equal these values. | nil | If any path equals the configured value, the whole rule does not match. An empty path is ignored. |
| requests.payload.override-raw.models.protocol | Target-protocol limit. | empty string | Case-insensitive. An empty value does not limit. The executor passes the actual protocol, such as openai, gemini, claude, codex, antigravity, or interactions. |
| requests.payload.override-raw.params | JSON paths and raw JSON to write into the payload. | nil | Raw JSON is always written. A string is inserted as it is and must be valid JSON. The later matching override-raw wins. If SetRawBytes fails, the path is skipped. |

## 5. Common errors and limits

If the raw JSON is invalid or `SetRawBytes` fails, that path is skipped. When a protocol or model condition does not match, nothing is written and no configuration error is reported. An empty `models` makes the whole rule inactive.

## 6. Related behavior

The other two kinds of rules are in [Default payload rules](/routing/requests-default), [Override payload rules](/routing/requests-override), and [Filter payload rules](/routing/requests-filter). Model thinking itself is in [Model thinking](/configuration/thinking-models).

## 7. Field experience

- [A third-party DeepSeek does not fill OpenAI thinking fields](/experience/api#exp-api-deepseek-no-openai-thinking)
- [An alias plus an override expresses Opus effort](/experience/routing#exp-routing-alias-and-override-effort)
- [gpt-image-2 is called through chat completions after an override](/experience/routing#exp-routing-gpt-image-override)
- [Add extra_body with an override rule](/experience/routing#exp-routing-override-extra-body)
- [Patch a Grok sub-agent with a payload override](/experience/routing#exp-routing-override-grok-subagent)
- [A payload override still applies after a thinking suffix](/experience/routing#exp-routing-override-is-final)
- [Different models use different override rules](/experience/routing#exp-routing-separate-payload-by-model)

