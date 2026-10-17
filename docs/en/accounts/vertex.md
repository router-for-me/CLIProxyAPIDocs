---
title: Vertex service-account import
feature_ids:
  - auth.vertex.login
  - cli.server.vertex-import
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Vertex service-account import

## 1. What this solves

This page explains how to import a Google Cloud service-account JSON as a vertex credential. It is not a browser login.

## 2. Scope and non-goals

The Vertex API key and base-url are on the upstream-key pages. This page covers only --vertex-import and the login-entry record.

## 3. How to configure or call it

```bash
cli-proxy-api --vertex-import /path/to/service-account.json
cli-proxy-api --vertex-import /path/to/service-account.json --vertex-import-prefix teamA
```

The file is written into `oauth.auth-dir`. The saved location is `us-central1`, and it can be changed later in the credential file. The prefix must be a single segment and cannot contain `/`. The file name is `vertex-<project_id>.json`. With a prefix it is `vertex-<prefix>-<project_id>.json`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| Vertex login | The command that starts this login or import. |  | A service account is imported by --vertex-import. It is not a browser login. |
| --vertex-import | The command that starts this login or import. | empty string | A path and project_id are required. The prefix cannot contain /. The saved location is us-central1. |

## 5. Common errors and limits

An empty path, a failed file read, invalid JSON, or a missing `project_id` only logs an error and returns. A missing `client_email` is only a warning, and the import continues. If the prefix contains `/`, the error contains `prefix must be a single segment`. On success it prints `Vertex credentials imported:` and the path.

## 6. Related behavior

The API key is in [Upstream API keys](/accounts/api-keys-api) and [Upstream base URLs](/accounts/api-keys-base).

## 7. Field experience

None yet.
