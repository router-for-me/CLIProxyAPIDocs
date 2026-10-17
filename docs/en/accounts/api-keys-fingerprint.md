---
title: Claude fingerprint
feature_ids:
  - api-keys.claude.fingerprint-profile
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Claude fingerprint

## 1. What this solves

Decide whether one Claude API key uses the caller's own fingerprint on Messages requests, or the Claude Code CLI fingerprint.

## 2. Scope and non-goals

It does not turn an API key into an OAuth token, and it does not enable refresh or OAuth cancellation semantics. count_tokens still keeps the native shape of the model, messages, and tools.

## 3. How to configure or call it

```yaml
api-keys:
  claude:
    - name: cli-compatible-gateway
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
          fingerprint-profile: "claude-code-cli"
```

Omitting it, or an empty string, keeps the caller fingerprint. `oauth-cli` is the old spelling of `claude-code-cli`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.claude.fingerprint-profile | Request fingerprint used by this Claude API key. | Empty/default keeps the caller request fingerprint and headers, including first-party api.anthropic.com API keys. | api-keys.claude.fingerprint-profile |

## 5. Common errors and limits

Any other string does not fail an ordinary configuration load. At request time it is treated as an empty fingerprint. A management API write rejects an unrecognized value. The error contains `unsupported fingerprint-profile`. CCH is sent only on api.anthropic.com and Vertex. Another gateway does not carry cch even if the CLI fingerprint is selected.

## 6. Related behavior

Cloaking is in [Claude request cloaking](/accounts/api-keys-cloak). The global fingerprint baseline is in [Claude upstream behavior](/accounts/upstream).

## 7. Field experience

None yet.
