---
title: Proxied request
feature_ids:
  - management.v8.post-requests-api-call
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Proxied request

## 1. What this solves

Let a caller that has already authenticated with the management key ask the process to send one HTTP request to another address, optionally using one credential's token and proxy.

## 2. Scope and non-goals

There is only `POST /v8/management/requests/api-call`. It requires the management key. The rules are in [Management API v8](/management/apiv8). It is not a public model route, and it does not save a credential for the caller.

## 3. How to configure or call it

```http
POST /v8/management/requests/api-call HTTP/1.1
Host: example.invalid
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "method": "GET",
  "url": "https://example.invalid/v1/models",
  "header": {},
  "data": ""
}
```

Optional fields:

- `auth_index`, `authIndex`, or `AuthIndex`: an index in the credential list. If omitted, no credential-specific proxy is selected.
- `proxy_url`: a proxy used only for this request. It must be parseable as a proxy.
- `header`: request headers as string-to-string values.
- `data`: the raw request body as a string. An empty string means no body.

The literal `$TOKEN$` in a header or in `data` is replaced with that credential's token. On success this endpoint returns 200. The body contains the upstream `status_code`, `header`, and `body`. A non-2xx upstream status does not become a failure status of this management endpoint.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| POST /v8/management/requests/api-call | Send one HTTP request with the given method and URL. |  | `method` and `url` are required. The URL must have a scheme and a host. The timeout is 60 seconds. If `$TOKEN$` cannot be resolved, the response is 400. A network failure or a failure reading the response is 502. |

## 5. Common errors and limits

A body that is not JSON is 400 `invalid body`. A missing method is 400 `missing method`. A missing URL is 400 `missing url`. A URL without a scheme or host is 400 `invalid url`. A `proxy_url` that cannot be parsed is 400 `invalid proxy_url`. If `auth_index` is given but the credential cannot be found, and `$TOKEN$` still needs to be replaced, the 400 error is `auth credential not found for auth_index`. If there is no token, the error is `auth token not found`. If refresh fails, the error is `auth token refresh failed`. A header named `Host` changes the request Host. It is not an ordinary header.

## 6. Related behavior

`auth_index` comes from the list in [Credentials](/management/v8-credentials). The management key is in [Management settings](/operations/management-settings).

## 7. Field experience

- [A management proxied request still uses the global proxy](/experience/management#exp-management-api-call-proxy-order)
