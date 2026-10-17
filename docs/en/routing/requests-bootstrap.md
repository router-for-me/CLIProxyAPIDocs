---
title: Retry before the first byte
feature_ids:
  - requests.streaming.bootstrap-retries
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Retry before the first byte

## 1. What this solves

If a streaming response fails before any byte is written to the client, the proxy can still switch credentials or ride out a temporary error. This key limits how many such safe retries are allowed.

## 2. Scope and non-goals

It happens only before the first byte is sent. After a byte has been written to the client, this key is not used to retry. It is also not the credential round of `routing.retry.request-retry`.

## 3. How to configure or call it

```yaml
requests:
  streaming:
    bootstrap-retries: 0
```

The sample configuration writes 1 when it is enabled. The zero value when it is not written is the defaults in the table.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| requests.streaming.bootstrap-retries | Streaming retries allowed before the first byte is sent. | Default is 0. | Less than or equal to 0 turns it off. A negative value is treated as 0. It is used for credential rotation or temporary-error recovery before a byte is written. |

## 5. Common errors and limits

0 or a negative value is not rejected, and it does not become one retry. After the first byte has been sent, this count is no longer used.

## 6. Related behavior

Credential rounds are in [Routing strategy](/routing/strategy). The keep-alive interval is in [Streaming keep-alive](/routing/requests-keepalive).

## 7. Field experience

None yet.
