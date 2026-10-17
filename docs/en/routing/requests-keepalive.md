---
title: Streaming keep-alive
feature_ids:
  - requests.streaming.keepalive-seconds
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Streaming keep-alive

## 1. What this solves

After a stream has started, the proxy can send keep-alives at a fixed interval so an intermediate device does not close an idle connection.

## 2. Scope and non-goals

This key only decides the interval. It does not decide whether to send before the first token arrives, and it does not retry a stream that has not yet written a byte. Non-streaming blank-line keep-alive is another key.

## 3. How to configure or call it

```yaml
requests:
  streaming:
    keepalive-seconds: 0
```

The sample configuration writes the enabled interval as 15. The zero value when it is not written is the defaults in the table.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| requests.streaming.keepalive-seconds | Interval in seconds for an SSE heartbeat or a WebSocket Ping. | Default is 0. | Less than or equal to 0 turns it off. The SSE heartbeat body is `: keep-alive` plus a blank line. WebSocket sends a Ping control frame. |

## 5. Common errors and limits

0 or a negative value is not rejected. It simply sends no keep-alive. Setting only this key to a positive number does not send a heartbeat before the first token.

## 6. Related behavior

The time before the first token is in [Keep-alive before the first token](/routing/requests-send). Retries before the first byte are in [Retry before the first byte](/routing/requests-bootstrap). Non-streaming blank lines are in [Outbound requests](/routing/requests-value).

## 7. Field experience

- [A keep-alive marker is not a JSON response](/experience/routing#exp-routing-keepalive-is-not-json)
