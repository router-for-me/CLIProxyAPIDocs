---
title: Observability
feature_ids:
  - management.v8.delete-observability-logs
  - management.v8.get-observability-logs
  - management.v8.get-observability-logs-errors
  - management.v8.get-observability-logs-errors-name
  - management.v8.get-observability-logs-requests-id
  - management.v8.get-observability-usage-api-keys
  - management.v8.get-observability-usage-queue
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Observability

## 1. What this solves

From the management API, read or clear application logs, list or download error-request logs, fetch a request log by request ID, and take the in-memory usage queue and the API-key usage counters.

## 2. Scope and non-goals

Every one of these routes requires the management key. Whether files are written, whether requests are logged, and how long usage is kept are decided by [Logs and usage](/operations/observability). This page does not change those configuration keys. Change configuration with [Management API v8](/management/apiv8).

## 3. How to configure or call it

The base URL is `https://example.invalid`. The header is `Authorization: Bearer YOUR_API_KEY`.

| Method and path | Purpose |
| --- | --- |
| GET /v8/management/observability/logs | Read application log lines. |
| DELETE /v8/management/observability/logs | Delete rolled logs and truncate the current log. |
| GET /v8/management/observability/logs/errors | List error-request logs. |
| GET /v8/management/observability/logs/errors/:name | Download the named error-log file. |
| GET /v8/management/observability/logs/requests/:id | Download the matching request log by request ID. |
| GET /v8/management/observability/usage/api-keys | Return in-memory success, failure, and recent-request counts for each API key. |
| GET /v8/management/observability/usage/queue | Take the oldest usage-queue records. |

Application logs accept the query parameters `cursor`, `limit`, and `after`. Omitting `limit` means no count truncation. When given, it must be an integer greater than 0. An `after` that is not a positive integer is treated as 0 and is not reported as its own error. Omitting `count` on the usage queue means 1. When given, it must be a positive integer.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| DELETE /v8/management/observability/logs | Clear the application log files. |  | When `logging-to-file` is false, the response is 400 `logging to file disabled`. A missing directory is 404 `log directory not found`. The success body contains `success: true` and `removed`. |
| GET /v8/management/observability/logs | Read application logs. |  | This also requires `logging-to-file` to be true. An illegal `limit` returns 400 `invalid limit`. |
| GET /v8/management/observability/logs/errors | List `error-*.log`. |  | When `request-log` is true, the response is an empty `files`, not an error. A missing directory also returns an empty list. |
| GET /v8/management/observability/logs/errors/:name | Download one error log. |  | The name must start with `error-`, end with `.log`, and contain no slash. Otherwise it is treated as not found, or as 400 `invalid log file name`. |
| GET /v8/management/observability/logs/requests/:id | Match a log file by the request-ID suffix. |  | A missing ID is 400 `missing request ID`. A slash is 400 `invalid request ID`. No matching file is 404. |
| GET /v8/management/observability/usage/api-keys | Summarize usage of `api_key` credentials. |  | If the credential manager is unavailable, the response is 503. The key is the provider, and under it usage is aggregated by `base_url\|api_key`. |
| GET /v8/management/observability/usage/queue | Pop the oldest usage records. |  | If `count` is not a positive integer, the response is 400 `count must be a positive integer`. The response is a JSON array. |

## 5. Common errors and limits

If the configuration object is unavailable, log routes return 503 `configuration unavailable`. If the log directory is not configured, the response is 500 `log directory not configured`. `DELETE` only deletes rolled logs and truncates the file that is the current active log. It does not delete unrelated files in the directory. When usage statistics are off, the queue has no new data to take. API-key usage counts only credentials whose kind is `api_key` and whose key is non-empty.

## 6. Related behavior

Switches and retention are in [Logs and usage](/operations/observability).

## 7. Field experience

- [Usage stays only in memory](/experience/operations#exp-operations-usage-stays-in-memory)
