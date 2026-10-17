---
title: OAuth callbacks
feature_ids:
  - route.anthropic.get-callback
  - route.antigravity.get-callback
  - route.callback.get
  - route.codex.get-callback
  - route.devin.get-callback
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# OAuth callbacks

## 1. What this solves

The main service can receive a callback for an OAuth session that has already started, and hand the short-lived code and state to the login that is waiting.

## 2. Scope and non-goals

These routes do not check a client API key. The port a local login command listens on itself is a different path. This page applies only when the callback hits the main service.

## 3. How to configure or call it

When the browser is redirected to the running proxy, use the paths below. The query parameters are `code`, `state`, and `error` or `error_description`.

```text
GET /anthropic/callback
GET /codex/callback
GET /antigravity/callback
GET /callback
GET /devin/callback
```

The address uses your proxy root, for example `https://example.invalid/anthropic/callback`. Anthropic, Codex, and Antigravity write the result to the matching waiting session in the credential directory when `state` is non-empty. Devin's two paths share one handler.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| GET /anthropic/callback | OAuth callback on the main service port. |  | When state is non-empty, it is written to the waiting anthropic session. It always returns HTTP 200 HTML. |
| GET /antigravity/callback | OAuth callback on the main service port. |  | When state is non-empty, it is written to the waiting antigravity session. It always returns HTTP 200 HTML. |
| GET /callback | OAuth callback on the main service port. |  | When both code and error are missing, the response is 400 code or error is required. A failed write returns 400 invalid or expired OAuth callback. |
| GET /codex/callback | OAuth callback on the main service port. |  | When state is non-empty, it is written to the waiting codex session. It always returns HTTP 200 HTML. |
| GET /devin/callback | OAuth callback on the main service port. |  | Uses the same handler as GET /callback. |

## 5. Common errors and limits

The first three return HTTP 200 and HTML even when there is no state. Devin returns 400 when both `code` and `error` are missing. The body is `{"error":"code or error is required"}`. An invalid or expired session returns 400. The body is `{"error":"invalid or expired OAuth callback"}`. The Devin response carries `Cache-Control: no-store`.

## 6. Related behavior

Starting a login is in [Claude login](/accounts/claude), [Codex login](/accounts/codex), [Antigravity login](/accounts/antigravity), and [Devin login](/accounts/devin).

## 7. Field experience

None yet.
