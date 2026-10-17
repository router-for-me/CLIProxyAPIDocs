---
title: Logs and usage
feature_ids:
  - observability.logs.debug
  - observability.logs.error-logs-max-files
  - observability.logs.logging-to-file
  - observability.logs.logs-max-total-size-mb
  - observability.logs.request-log
  - observability.pprof.addr
  - observability.pprof.enable
  - observability.usage.redis-usage-queue-retention-seconds
  - observability.usage.usage-statistics-enabled
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Logs and usage

## 1. What this solves

Decide whether application logs go to standard output or to rolling files, whether proxy requests are recorded, how error logs and the log directory are cleaned up, whether usage is summarized in memory, and whether a separate pprof debug port is opened.

## 2. Scope and non-goals

These keys belong to `observability`. The management API routes that read logs and the usage queue are in [Observability](/management/v8-observability). `commercial-mode` turns off expensive request logs. See [Listener and process](/operations/server). This page does not configure an access key.

## 3. How to configure or call it

```yaml
observability:
  logs:
    debug: false
    logging-to-file: false
    logs-max-total-size-mb: 0
    error-logs-max-files: 10
    request-log: false
  usage:
    usage-statistics-enabled: false
    redis-usage-queue-retention-seconds: 60
  pprof:
    enable: false
    addr: "127.0.0.1:8316"
```

The sample places pprof on local `127.0.0.1:8316`. Do not expose it on a public address.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| observability.logs.debug | Turn debug-level logs and other debug features on or off. | false | After load, the log level is set from this value. |
| observability.logs.error-logs-max-files | How many error-log files to keep when request logging is off. | Default is 10. | Beyond that, the oldest error logs are deleted. 0 turns cleanup off. A negative value is changed back to 10 on load. |
| observability.logs.logging-to-file | Whether application logs are written to rolling files or to standard output. | false | true writes rolling files. The management API requires this to be true before it reads application logs. |
| observability.logs.logs-max-total-size-mb | Total size limit, in MB, of log files under the log directory. | 0 | Beyond the limit, the oldest logs are deleted until the total is back under the limit. 0 turns that cleanup off. A negative value is changed to 0 on load. |
| observability.logs.request-log | Whether to record detailed proxy request logs. | false | Management requests are not written to this log. When `commercial-mode` is true, request-log middleware is not attached. |
| observability.pprof.addr | host:port of the pprof HTTP server. | empty string | An empty value uses `127.0.0.1:8316` at load and at runtime. |
| observability.pprof.enable | Whether to start the pprof HTTP debug server. | false | When false, it does not listen. Changing it to true, or changing the address, restarts that debug server. |
| observability.usage.redis-usage-queue-retention-seconds | Seconds a usage-queue entry is kept in memory for the management API. | Default: 60. | The maximum is 3600. Less than or equal to 0 is loaded as 60. Greater than 3600 is clamped to 3600 and a warning is written. Redis RESP usage output is disabled only in Home mode. |
| observability.usage.usage-statistics-enabled | Whether to summarize usage in memory. | false | When false, usage data is discarded. Home mode forces this to true. |

## 5. Common errors and limits

When `logging-to-file` is false, management `GET /v8/management/observability/logs` returns 400 with the error `logging to file disabled`. When `request-log` is true, the error-log list endpoint returns an empty `files`. Leaving the pprof address empty does not keep the empty string. The process listens on `127.0.0.1:8316` instead. A retention above 3600 seconds does not refuse startup. It is only clamped.

## 6. Related behavior

Reading the queue and log files is in [Observability](/management/v8-observability). Commercial mode is in [Listener and process](/operations/server).

## 7. Field experience

- [A non-Claude upstream reports usage only at the end of the message](/experience/api#exp-api-messages-usage-at-end)
- [Send the client key when calling a public route](/experience/api#exp-api-require-client-key)
- [auth_unavailable means no usable credential](/experience/operations#exp-operations-auth-unavailable-means-no-credential)
- [Cap the total size of request logs](/experience/operations#exp-operations-cap-request-logs)
- [Turn off request logs to stop the flood](/experience/operations#exp-operations-disable-request-log)
- [There is no final usage after the client disconnects](/experience/operations#exp-operations-disconnect-drops-usage)
- [Logs are written in a writable logs directory](/experience/operations#exp-operations-log-directory)
- [Turn off expensive logs to reduce memory](/experience/operations#exp-operations-reduce-memory)
- [Use the request log to see the original text](/experience/operations#exp-operations-request-log-text)
- [Usage stays only in memory](/experience/operations#exp-operations-usage-stays-in-memory)
