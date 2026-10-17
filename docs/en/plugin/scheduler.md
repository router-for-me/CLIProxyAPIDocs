---
title: Scheduler
feature_ids:
  - plugin.scheduler.pick
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Scheduler

`Scheduler` makes one selection from the candidate credentials before the built-in scheduler.

## 1. What this solves

The plugin can name one `AuthID`, hand the selection back to the built-in `round-robin` or `fill-first`, or explicitly reject this round of candidates.

## 2. Scope and non-goals

There is only `Pick`. It does not log in and does not refresh credentials. It also does not rewrite the route from a model to an executor. That is [Model Router](/plugin/model-router).

When `SchedulerAcrossPriorities` is false, `Candidates` contains only credentials available in the current highest-priority tier. When true, it contains every priority tier. This is the registration boolean `scheduler_across_priorities`, not a method of this interface.

## 3. How to configure or call it

Set `capabilities.scheduler` to true.

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-scheduler",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-scheduler"
    },
    "capabilities": {
      "scheduler": true
    }
  }
}
```

```go
Pick(context.Context, SchedulerPickRequest) (SchedulerPickResponse, error)
```

The ABI method name is `scheduler.pick`. The JSON of `SchedulerPickResponse` accepts both the Go exported name and the snake name: `AuthID` or `auth_id`, `DelegateBuiltin` or `delegate_builtin`, `Handled` or `handled`, `Reject` or `reject`, `RejectReason` or `reject_reason`, `RejectCode` or `reject_code`. For the same field, the Go exported name comes first.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.scheduler.pick | `Pick`, ABI `scheduler.pick`. |  | Parameter `SchedulerPickRequest`, return `SchedulerPickResponse`. |
| SchedulerPickRequest.Plugin | Plugin metadata. |  | `Metadata`. |
| SchedulerPickRequest.Provider | Primary provider of the routed request. |  | String. |
| SchedulerPickRequest.Providers | Every provider accepted by that route. |  | `[]string`. |
| SchedulerPickRequest.Model | Requested model ID. |  | String. |
| SchedulerPickRequest.Stream | Whether streaming output is expected. |  | Boolean. |
| SchedulerPickRequest.Options | Request-level scheduling input. |  | `Headers` is `map[string][]string`. `Metadata` is `map[string]any`. |
| SchedulerPickRequest.Candidates | Credentials available to choose from. |  | See the candidate fields below. Without crossing priorities, only the highest tier is included. |
| SchedulerAuthCandidate.ID | Credential ID. |  | The selected `AuthID` must equal some candidate ID. |
| SchedulerAuthCandidate.Provider | Credential provider. |  | String. |
| SchedulerAuthCandidate.Priority | Host priority. |  | Integer. |
| SchedulerAuthCandidate.Status | Status visible to the host. |  | String. |
| SchedulerAuthCandidate.Attributes | Immutable attributes. |  | `map[string]string`. |
| SchedulerAuthCandidate.Metadata | Host-mutable metadata. |  | `map[string]any`. |
| SchedulerPickResponse.AuthID | Selected credential ID. |  | Must appear in `Candidates`. |
| SchedulerPickResponse.DelegateBuiltin | Name of the built-in scheduler to hand off to. |  | Can only be `round-robin` or `fill-first`. |
| SchedulerPickResponse.Handled | Whether the plugin made a scheduling decision. |  | When false, this result is not adopted. |
| SchedulerPickResponse.Reject | Whether selection is explicitly rejected. |  | When this and `Handled` are both true, selection ends and an error is returned, with no fallback to the built-in scheduler. |
| SchedulerPickResponse.RejectReason | Rejection reason. |  | When blank, `scheduler rejected candidate selection` is used. |
| SchedulerPickResponse.RejectCode | Rejection error code. |  | When blank, `auth_unavailable` is used. |

## 5. Common errors and limits

When `Pick` returns `error`, this round of selection ends with that error. When ABI `http_status` is omitted or 0, it is treated as HTTP 500.

`Handled` false, or neither `AuthID` nor `DelegateBuiltin`, is not a valid decision. An `AuthID` that is not among the candidates, or a `DelegateBuiltin` that is not `round-robin` or `fill-first`, is also invalid. When `Reject` and `Handled` are both true, there is no fallback.

## 6. Related behavior

Credential contents are in [Credential Provider](/plugin/auth-provider). Changing the model route is in [Model Router](/plugin/model-router).

## 7. Field experience

None yet.

