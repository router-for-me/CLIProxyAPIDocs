---
title: Keep-alive before the first token
feature_ids:
  - requests.streaming.send-keepalive-before-ft
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Keep-alive before the first token

## 1. What this solves

Some clients disconnect because of idle time before the first token arrives. This switch allows SSE heartbeats during that interval.

## 2. Scope and non-goals

It only controls the time before the first token. The interval is still decided by `keepalive-seconds`. When this key is true but the interval is not positive, nothing is sent. It does not change the WebSocket Ping interval configuration itself.

## 3. How to configure or call it

```yaml
requests:
  streaming:
    keepalive-seconds: 0
    send-keepalive-before-ft: false
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| requests.streaming.send-keepalive-before-ft | Whether to send SSE heartbeats before the first token. | Default is false. | A heartbeat is sent only when this key is true and keepalive-seconds is greater than 0. true by itself does not turn keep-alive on. |

## 5. Common errors and limits

false is not an error. true together with a 0 or negative `keepalive-seconds` also sends no heartbeat. The configuration itself is not rejected.

## 6. Related behavior

The interval is in [Streaming keep-alive](/routing/requests-keepalive).

## 7. Field experience

None yet.
