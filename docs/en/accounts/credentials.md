---
title: Credential concurrency and in-flight observation
feature_ids:
  - credentials.concurrency.busy-retry-max
  - credentials.concurrency.busy-retry-min
  - credentials.concurrency.cleanup-interval
  - credentials.concurrency.cpa-cancel-bound
  - credentials.concurrency.cpa-heartbeat-timeout
  - credentials.concurrency.lifecycle-config-revision
  - credentials.concurrency.max-limit
  - credentials.concurrency.observation-barrier-revision
  - credentials.concurrency.reclaim-grace
  - credentials.concurrency.release-flush-interval
  - credentials.concurrency.release-max-backoff
  - credentials.in-flight.max-aggregate-groups
  - credentials.in-flight.max-details
  - credentials.in-flight.max-part-bytes
  - credentials.in-flight.max-part-count
  - credentials.in-flight.max-revision-bytes
  - credentials.in-flight.max-string-bytes
  - credentials.in-flight.snapshot-interval
  - credentials.in-flight.staging-retention
  - credentials.in-flight.stale-after
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Credential concurrency and in-flight observation

## 1. What this solves

This page covers the credential concurrency leases used by Home, and the limits of the in-flight observation snapshot.

## 2. Scope and non-goals

These keys are for Home's credential lifecycle. They do not select a model, and they do not save an OAuth token. The v8 paths are `credentials.concurrency` and `credentials.in-flight`. The old paths are `credential-concurrency` and `credential-in-flight`.

## 3. How to configure or call it

```yaml
credentials:
  concurrency:
    lifecycle-config-revision: 1
    observation-barrier-revision: 0
    cpa-heartbeat-timeout: 3s
    cpa-cancel-bound: 5s
    reclaim-grace: 5s
    cleanup-interval: 5s
    release-flush-interval: 250ms
    release-max-backoff: 2s
    busy-retry-min: 250ms
    busy-retry-max: 1s
    max-limit: 1000000
  in-flight:
    snapshot-interval: 2s
    stale-after: 10s
    max-part-bytes: 262144
    max-part-count: 64
    max-revision-bytes: 16777216
    max-aggregate-groups: 100000
    max-details: 10000
    max-string-bytes: 256
    staging-retention: 1m
```

The concurrency times above are the values `WithDefaults` fills in when a field is at its zero default. The in-flight fields are filled by the loader before YAML is parsed. The Default column in the table is still the zero-value text from the ledger.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| credentials.concurrency.busy-retry-max | Upper bound of the retry wait when a credential is busy. | 0s | The default 0 becomes 1s. It must be a positive whole number of milliseconds, and it cannot be less than busy-retry-min. |
| credentials.concurrency.busy-retry-min | Lower bound of the retry wait when a credential is busy. | 0s | The default 0 becomes 250ms. It must be a positive whole number of milliseconds, and it cannot be greater than busy-retry-max. |
| credentials.concurrency.cleanup-interval | Cleanup interval for concurrency leases. | 0s | The default 0 becomes 5s. It must be positive. |
| credentials.concurrency.cpa-cancel-bound | Time limit for cancelling a CPA-side concurrency lease. | 0s | The default 0 becomes 5s. Node heartbeat plus reclaim-grace must be greater than this plus cpa-heartbeat-timeout. |
| credentials.concurrency.cpa-heartbeat-timeout | CPA concurrency heartbeat timeout. | 0s | The default 0 becomes 3s. It must be positive. |
| credentials.concurrency.lifecycle-config-revision | Home lifecycle configuration revision. | 0 | The zero default may be 0. Once it is written, 0 or a negative value makes loading fail. |
| credentials.concurrency.max-limit | Upper bound on the number of concurrency leases. | 0 | The default 0 becomes 1000000. The allowed range is 1 to 1000000. |
| credentials.concurrency.observation-barrier-revision | Observation-barrier revision. | 0 | It cannot be negative. The zero default stays 0. |
| credentials.concurrency.reclaim-grace | Grace period before a lease is reclaimed. | 0s | The default 0 becomes 5s. It must be positive. |
| credentials.concurrency.release-flush-interval | Release flush interval. | 0s | The default 0 becomes 250ms. It must be positive, and it cannot be greater than release-max-backoff. |
| credentials.concurrency.release-max-backoff | Maximum backoff for a release flush. | 0s | The default 0 becomes 2s. It must be positive, and it cannot be less than release-flush-interval. |
| credentials.in-flight.max-aggregate-groups | Upper bound on aggregate groups kept by in-flight observation. | 0 | The loader fills 100000 at the zero default. Allowed range is 1 to 100000. |
| credentials.in-flight.max-details | Upper bound on details kept by in-flight observation. | 0 | The loader fills 10000 at the zero default. Allowed range is 0 to 10000. |
| credentials.in-flight.max-part-bytes | Byte limit of one snapshot part. | 0 | The loader fills 262144 at the zero default. It cannot be less than 1024. |
| credentials.in-flight.max-part-count | Number of parts allowed in one revision. | 0 | The loader fills 64 at the zero default. Allowed range is 1 to 64. |
| credentials.in-flight.max-revision-bytes | Byte limit of one revision. | 0 | The loader fills 16777216 at the zero default. It must fall between max-part-bytes and 16777216, and it must fit in the part count. |
| credentials.in-flight.max-string-bytes | Byte limit kept for one observation string. | 0 | The loader fills 256 at the zero default. Allowed range is 1 to 256. |
| credentials.in-flight.snapshot-interval | In-flight snapshot interval. | empty string | The loader fills 2s at the zero default. It must be a positive duration, and stale-after must be at least three times that interval. |
| credentials.in-flight.staging-retention | Retention of staged observation data. | empty string | The loader fills 1m at the zero default. It must be a positive duration. |
| credentials.in-flight.stale-after | Age at which a snapshot is treated as stale. | empty string | The loader fills 10s at the zero default. It must be at least three snapshot intervals. |

## 5. Common errors and limits

Configuration loading fails when the concurrency configuration does not satisfy a positive duration, millisecond alignment, backoff order, or the `max-limit` range. Once `lifecycle-config-revision` is present, it cannot be 0 or negative. Loading also fails when an in-flight duration cannot be parsed, `stale-after` is less than three snapshot intervals, or the part capacity cannot hold the revision size. Node heartbeat plus reclaim-grace must be greater than the CPA heartbeat plus the cancel bound, or lifecycle validation fails.

## 6. Related behavior

The credential file directory is in [OAuth directory, aliases, and exclusions](/accounts/oauth).

## 7. Field experience

None yet.
