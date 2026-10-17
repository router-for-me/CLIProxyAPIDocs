---
title: Credentials
feature_ids:
  - management.v8.delete-credentials
  - management.v8.get-credentials
  - management.v8.get-credentials-download
  - management.v8.get-credentials-models
  - management.v8.patch-credentials-fields
  - management.v8.patch-credentials-status
  - management.v8.post-credentials
  - management.v8.post-credentials-refresh
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Credentials

## 1. What this solves

From the management API, list, upload, download, delete, and refresh saved credentials, and change the disabled state or fields of one credential.

## 2. Scope and non-goals

Every path is under `/v8/management` and requires the management key. Authentication rules are in [Management API v8](/management/apiv8). This page does not start an OAuth login. Login is in [OAuth](/management/v8-oauth). It does not reset routing cooldown. That is [Routing actions](/management/v8-routing).

## 3. How to configure or call it

The base URL is `https://example.invalid`. The header is `Authorization: Bearer YOUR_API_KEY`.

| Method and path | Purpose |
| --- | --- |
| GET /v8/management/credentials | List existing credentials. |
| POST /v8/management/credentials | Upload one or more JSON credentials. |
| DELETE /v8/management/credentials | Delete by name, or delete every JSON credential when that is explicitly requested. |
| GET /v8/management/credentials/models | Query the models visible to clients for one credential. |
| GET /v8/management/credentials/download | Download JSON by file name. |
| PATCH /v8/management/credentials/status | Set whether it is disabled. |
| PATCH /v8/management/credentials/fields | Change fields on that credential. |
| POST /v8/management/credentials/refresh | Force a refresh of one credential or of all credentials. |

Listing accepts the query parameters `name` and `auth_index`. Pagination starts only when `page` or `page_size` is present. `page` defaults to 1 and `page_size` defaults to 50. Both must be positive integers. A paged response also contains `total`, `page`, `page_size`, and `has_more`. Without paging, the response is `observed_at` and `files`.

Upload can use a multipart file, or give a file name ending in `.json` in the `name` query parameter and submit raw JSON. To delete everything, the `all` query parameter is `true`, `1`, or `*`. Otherwise use repeated `name` query parameters, or `name`, `names`, or a string array in a JSON body.

Refresh can use the query parameters `all=true`, `name`, and `auth_index`, or the JSON body `{"name":"...","auth_index":"...","all":false}`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| DELETE /v8/management/credentials | Delete credential files. |  | If no core credential manager is available, the response is 503. If no legal name is given, the response is 400 `invalid name`. A partial failure is 207, and the body contains `status: partial`. |
| GET /v8/management/credentials | List credentials. |  | If `page` is not a positive integer, the response is 400 `page must be a positive integer`. `page_size` must also be a positive integer. |
| GET /v8/management/credentials/download | Download one JSON credential file. |  | `name` must be only a file name and end with `.json`, otherwise 400. A missing file is 404 `file not found`. |
| GET /v8/management/credentials/models | Return the model list for that credential. |  | The `name` query parameter is required, otherwise 400 `name is required`. The response is `{"models":[...]}`. |
| PATCH /v8/management/credentials/fields | Update a credential by field. |  | The JSON must contain `name`. A missing credential is 404 `auth file not found`. A virtual credential expanded by a plugin returns 409. `weight` must be an integer and cannot be written as a nested field. |
| PATCH /v8/management/credentials/status | Set `disabled`. |  | The body needs `name` and a boolean `disabled`. `auth_index` may be included. A missing `disabled` is 400 `disabled is required`. |
| POST /v8/management/credentials | Write uploaded credentials. |  | A non-JSON file name returns 400 `file must be .json`. A multipart request with no file is 400 `no files uploaded`. A partial failure of several files is 207. |
| POST /v8/management/credentials/refresh | Force a credential refresh. |  | If `name` is missing and all credentials were not requested, the response is 400 `name or all=true is required`. Not found is 404 `auth file not found`. A successful refresh of all returns `ok` and `results`. |

## 5. Common errors and limits

If the core credential manager is unavailable, upload, delete, status changes, field changes, and refresh return 503 `core auth manager unavailable`. Listing falls back to reading the disk when the manager is missing. A download name that contains a path component is treated as `invalid name`. When an API-key credential in the configuration is disabled, the excluded models in the configuration are used, and `via` in the response is `config:excluded-models`. The status of a virtual plugin credential can be changed only against the source file name. An expanded project credential cannot be changed on its own.

## 6. Related behavior

Login and import are in [OAuth](/management/v8-oauth). Cooldown reset is in [Routing actions](/management/v8-routing).

## 7. Field experience

- [Pause a credential with the management API](/experience/management#exp-management-disable-credential)
- [A disabled OAuth credential is still refreshed](/experience/management#exp-management-disabled-oauth-still-refreshes)
- [Set priority on a credential field](/experience/management#exp-management-set-credential-priority)
- [fill-first returns to the previous account after quota recovers](/experience/routing#exp-routing-fill-first-recovers)
