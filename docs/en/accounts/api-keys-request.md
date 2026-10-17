---
title: Retry and request-scoped errors
feature_ids:
  - api-keys.claude.request-retry
  - api-keys.claude.request-scoped-errors-action
  - api-keys.claude.request-scoped-errors-match
  - api-keys.claude.request-scoped-errors-match-regexr
  - api-keys.claude.request-scoped-errors-status
  - api-keys.codex.request-retry
  - api-keys.codex.request-scoped-errors-action
  - api-keys.codex.request-scoped-errors-match
  - api-keys.codex.request-scoped-errors-match-regexr
  - api-keys.codex.request-scoped-errors-status
  - api-keys.gemini.request-retry
  - api-keys.gemini.request-scoped-errors-action
  - api-keys.gemini.request-scoped-errors-match
  - api-keys.gemini.request-scoped-errors-match-regexr
  - api-keys.gemini.request-scoped-errors-status
  - api-keys.interactions.request-retry
  - api-keys.interactions.request-scoped-errors-action
  - api-keys.interactions.request-scoped-errors-match
  - api-keys.interactions.request-scoped-errors-match-regexr
  - api-keys.interactions.request-scoped-errors-status
  - api-keys.meta.request-retry
  - api-keys.meta.request-scoped-errors-action
  - api-keys.meta.request-scoped-errors-match
  - api-keys.meta.request-scoped-errors-match-regexr
  - api-keys.meta.request-scoped-errors-status
  - api-keys.openai-compatibility.request-retry
  - api-keys.openai-compatibility.request-scoped-errors-action
  - api-keys.openai-compatibility.request-scoped-errors-match
  - api-keys.openai-compatibility.request-scoped-errors-match-regexr
  - api-keys.openai-compatibility.request-scoped-errors-status
  - api-keys.vertex.request-retry
  - api-keys.xai.request-retry
  - api-keys.xai.request-scoped-errors-action
  - api-keys.xai.request-scoped-errors-match
  - api-keys.xai.request-scoped-errors-match-regexr
  - api-keys.xai.request-scoped-errors-status
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Retry and request-scoped errors

## 1. What this solves

Override the global retry count per credential or provider, and decide whether to stop, continue, and whether to cool down from the upstream status code and error body.

## 2. Scope and non-goals

A Vertex key has only request-retry in the ledger. It has no request-scoped error fields. The same kind of rule for an OAuth file credential is on the OAuth page.

## 3. How to configure or call it

```yaml
api-keys:
  claude:
    - name: claude-1
      request-retry: 3
      request-scoped-errors:
        - status: 400
          match:
            - "prompt is too long"
          match-regexr:
            - "prompt is too long$"
          action: "stop"
      keys:
        - api-key: "YOUR_API_KEY"
          request-retry: 0
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.claude.request-retry | Extra retry rounds for this credential. | nil | When omitted or negative, the global request-retry is used. 0 turns off extra retry rounds. |
| api-keys.claude.request-scoped-errors.action | What to do with this upstream error after a match. | empty string | Only stop, stop-and-cooldown, continue, and continue-and-cooldown are used. In a global OAuth rule, an empty action is dropped and is not reported as its own error. |
| api-keys.claude.request-scoped-errors.match | Match the upstream error body with a substring. | nil | When omitted, there is no substring match. If the status code is not positive, or both the substring and the regular expression are empty, this OAuth rule is dropped. |
| api-keys.claude.request-scoped-errors.match-regexr | Match the upstream error body with a regular expression. | nil | When omitted, there is no regular-expression match. Blank items are removed. |
| api-keys.claude.request-scoped-errors.status | Upstream HTTP status code to match. | 0 | Match the HTTP status code of the upstream response, for example 400. An OAuth rule less than or equal to 0 is dropped. |
| api-keys.codex.request-retry | Extra retry rounds for this credential. | nil | When omitted or negative, the global request-retry is used. 0 turns off extra retry rounds. |
| api-keys.codex.request-scoped-errors.action | What to do with this upstream error after a match. | empty string | Only stop, stop-and-cooldown, continue, and continue-and-cooldown are used. In a global OAuth rule, an empty action is dropped and is not reported as its own error. |
| api-keys.codex.request-scoped-errors.match | Match the upstream error body with a substring. | nil | When omitted, there is no substring match. If the status code is not positive, or both the substring and the regular expression are empty, this OAuth rule is dropped. |
| api-keys.codex.request-scoped-errors.match-regexr | Match the upstream error body with a regular expression. | nil | When omitted, there is no regular-expression match. Blank items are removed. |
| api-keys.codex.request-scoped-errors.status | Upstream HTTP status code to match. | 0 | Match the HTTP status code of the upstream response, for example 400. An OAuth rule less than or equal to 0 is dropped. |
| api-keys.gemini.request-retry | Extra retry rounds for this credential. | nil | When omitted or negative, the global request-retry is used. 0 turns off extra retry rounds. |
| api-keys.gemini.request-scoped-errors.action | What to do with this upstream error after a match. | empty string | Only stop, stop-and-cooldown, continue, and continue-and-cooldown are used. In a global OAuth rule, an empty action is dropped and is not reported as its own error. |
| api-keys.gemini.request-scoped-errors.match | Match the upstream error body with a substring. | nil | When omitted, there is no substring match. If the status code is not positive, or both the substring and the regular expression are empty, this OAuth rule is dropped. |
| api-keys.gemini.request-scoped-errors.match-regexr | Match the upstream error body with a regular expression. | nil | When omitted, there is no regular-expression match. Blank items are removed. |
| api-keys.gemini.request-scoped-errors.status | Upstream HTTP status code to match. | 0 | Match the HTTP status code of the upstream response, for example 400. An OAuth rule less than or equal to 0 is dropped. |
| api-keys.interactions.request-retry | Extra retry rounds for this credential. | nil | When omitted or negative, the global request-retry is used. 0 turns off extra retry rounds. |
| api-keys.interactions.request-scoped-errors.action | What to do with this upstream error after a match. | empty string | Only stop, stop-and-cooldown, continue, and continue-and-cooldown are used. In a global OAuth rule, an empty action is dropped and is not reported as its own error. |
| api-keys.interactions.request-scoped-errors.match | Match the upstream error body with a substring. | nil | When omitted, there is no substring match. If the status code is not positive, or both the substring and the regular expression are empty, this OAuth rule is dropped. |
| api-keys.interactions.request-scoped-errors.match-regexr | Match the upstream error body with a regular expression. | nil | When omitted, there is no regular-expression match. Blank items are removed. |
| api-keys.interactions.request-scoped-errors.status | Upstream HTTP status code to match. | 0 | Match the HTTP status code of the upstream response, for example 400. An OAuth rule less than or equal to 0 is dropped. |
| api-keys.meta.request-retry | Extra retry rounds for this credential. | nil | When omitted or negative, the global request-retry is used. 0 turns off extra retry rounds. |
| api-keys.meta.request-scoped-errors.action | What to do with this upstream error after a match. | empty string | Only stop, stop-and-cooldown, continue, and continue-and-cooldown are used. In a global OAuth rule, an empty action is dropped and is not reported as its own error. |
| api-keys.meta.request-scoped-errors.match | Match the upstream error body with a substring. | nil | When omitted, there is no substring match. If the status code is not positive, or both the substring and the regular expression are empty, this OAuth rule is dropped. |
| api-keys.meta.request-scoped-errors.match-regexr | Match the upstream error body with a regular expression. | nil | When omitted, there is no regular-expression match. Blank items are removed. |
| api-keys.meta.request-scoped-errors.status | Upstream HTTP status code to match. | 0 | Match the HTTP status code of the upstream response, for example 400. An OAuth rule less than or equal to 0 is dropped. |
| api-keys.openai-compatibility.request-retry | Extra retry rounds for this credential. | nil | When omitted or negative, the global request-retry is used. 0 turns off extra retry rounds. |
| api-keys.openai-compatibility.request-scoped-errors.action | What to do with this upstream error after a match. | empty string | Only stop, stop-and-cooldown, continue, and continue-and-cooldown are used. In a global OAuth rule, an empty action is dropped and is not reported as its own error. |
| api-keys.openai-compatibility.request-scoped-errors.match | Match the upstream error body with a substring. | nil | When omitted, there is no substring match. If the status code is not positive, or both the substring and the regular expression are empty, this OAuth rule is dropped. |
| api-keys.openai-compatibility.request-scoped-errors.match-regexr | Match the upstream error body with a regular expression. | nil | When omitted, there is no regular-expression match. Blank items are removed. |
| api-keys.openai-compatibility.request-scoped-errors.status | Upstream HTTP status code to match. | 0 | Match the HTTP status code of the upstream response, for example 400. An OAuth rule less than or equal to 0 is dropped. |
| api-keys.vertex.request-retry | Extra retry rounds for this credential. | nil | When omitted or negative, the global request-retry is used. 0 turns off extra retry rounds. |
| api-keys.xai.request-retry | Extra retry rounds for this credential. | nil | When omitted or negative, the global request-retry is used. 0 turns off extra retry rounds. |
| api-keys.xai.request-scoped-errors.action | What to do with this upstream error after a match. | empty string | Only stop, stop-and-cooldown, continue, and continue-and-cooldown are used. In a global OAuth rule, an empty action is dropped and is not reported as its own error. |
| api-keys.xai.request-scoped-errors.match | Match the upstream error body with a substring. | nil | When omitted, there is no substring match. If the status code is not positive, or both the substring and the regular expression are empty, this OAuth rule is dropped. |
| api-keys.xai.request-scoped-errors.match-regexr | Match the upstream error body with a regular expression. | nil | When omitted, there is no regular-expression match. Blank items are removed. |
| api-keys.xai.request-scoped-errors.status | Upstream HTTP status code to match. | 0 | Match the HTTP status code of the upstream response, for example 400. An OAuth rule less than or equal to 0 is dropped. |

## 5. Common errors and limits

When request-retry is omitted or negative, the global value is inherited. 0 turns off the extra rounds. action uses stop, stop-and-cooldown, continue, and continue-and-cooldown. The OAuth path drops incomplete rules. API-key rules are configured with the same four actions.

## 6. Related behavior

OAuth rules are in [OAuth directory, aliases, and exclusions](/accounts/oauth).

## 7. Field experience

- [Handle a specific 429 with a request-scoped error rule](/experience/accounts#exp-accounts-request-scoped-error-action)
