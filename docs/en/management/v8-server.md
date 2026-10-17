---
title: Latest version
feature_ids:
  - management.v8.get-server-latest-version
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Latest version

## 1. What this solves

Ask the management API for the latest CLIProxyAPI release tag on GitHub. It does not download release assets.

## 2. Scope and non-goals

A management key is required. This does not upgrade the process, and it does not read the local binary's version as "latest". GitHub token priority is in [Listener and process](/operations/server).

## 3. How to configure or call it

```http
GET /v8/management/server/latest-version HTTP/1.1
Host: example.invalid
Authorization: Bearer YOUR_API_KEY
```

On success the response is JSON. The `latest-version` field is the release tag. The request goes to GitHub's latest-release endpoint. If an outbound `proxy-url` is configured, this query uses that proxy. This page does not add a proxy key.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| GET /v8/management/server/latest-version | Read the tag or name of the latest GitHub release. |  | `tag_name` is preferred. If it is empty, `name` is used. If both are empty, the response is 502 `invalid_response`. A non-200 upstream, a network failure, or a decode failure is 502. If creating the request fails, the response is 500 `request_create_failed`. |

## 5. Common errors and limits

The query timeout is 10 seconds. If no GitHub token is available, an unauthenticated request is still sent. It may hit GitHub's rate limit and return 502 `unexpected_status`. The response does not include release notes or an install package.

## 6. Related behavior

The token source is in [Listener and process](/operations/server). The management key is in [Management settings](/operations/management-settings).

## 7. Field experience

None yet.
