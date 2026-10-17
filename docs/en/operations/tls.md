---
title: TLS
feature_ids:
  - server.tls.cert
  - server.tls.enable
  - server.tls.key
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# TLS

## 1. What this solves

Decide whether the API server listens with HTTPS, and which certificate and private key it uses.

## 2. Scope and non-goals

This applies only to this process's listener. It does not configure client mTLS for the Home control plane, and it does not replace TLS for an upstream `base-url`. The bind address and port are in [Listener and process](/operations/server).

## 3. How to configure or call it

```yaml
server:
  tls:
    enable: false
    cert: ""
    key: ""
```

When enabling it, set `cert` and `key` to the paths of the certificate file and the private-key file. Do not paste the private key into configuration notes or logs.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| server.tls.cert | Path of the TLS certificate file. | empty string | When `enable` is true, it cannot be empty, and it must form a usable certificate pair with the private key. |
| server.tls.enable | Whether to listen with HTTPS. | false | When false, the server starts as ordinary HTTP. When true, that certificate pair is used on the bound address, and HTTP/2 and HTTP/1.1 are attempted. |
| server.tls.key | Path of the TLS private-key file. | empty string | When `enable` is true, it cannot be empty. |

## 5. Common errors and limits

If `enable` is true but the certificate or private-key path is empty, startup fails with the error `tls.cert or tls.key is empty`. If the paths have values but the certificate pair cannot be loaded, startup fails as well. Filling in only one of the paths is not enough.

## 6. Related behavior

The listen address is in [Listener and process](/operations/server). The TLS mark in discovery records is in [LAN discovery](/operations/discovery).

## 7. Field experience

- [Enabling TLS requires a certificate](/experience/operations#exp-operations-tls-needs-cert)
