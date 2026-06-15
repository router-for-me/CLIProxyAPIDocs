---
outline: 'deep'
---

# Scheduler Capability

The scheduler capability selects a credential from candidate credential records before the host built-in scheduler runs, or explicitly delegates to a built-in scheduler.

## Capability Field

```json
{
  "capabilities": {
    "scheduler": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `Scheduler`, `SchedulerPickRequest`, `SchedulerPickResponse`
- `sdk/pluginabi/types.go`: `scheduler.pick`
- `internal/pluginhost/adapters.go`: scheduler capability registration and invocation

Example references:

- `examples/plugin/scheduler/go/main.go`
- `examples/plugin/scheduler/README.md`

## Methods

| Method | Purpose |
| --- | --- |
| `scheduler.pick` | Returns a scheduling decision from request context and candidate credentials. |

## Request

```json
{
  "Provider": "codex",
  "Providers": ["codex"],
  "Model": "gpt-5.5",
  "Stream": true,
  "Options": {
    "Headers": {},
    "Metadata": {}
  },
  "Candidates": [
    {
      "ID": "auth-1",
      "Provider": "codex",
      "Priority": 1,
      "Status": "available",
      "Attributes": {},
      "Metadata": {}
    }
  ]
}
```

## Response

Select a specific credential:

```json
{
  "AuthID": "auth-1",
  "Handled": true
}
```

Delegate to a built-in scheduler:

```json
{
  "DelegateBuiltin": "round-robin",
  "Handled": true
}
```

Do not handle this scheduling request:

```json
{
  "Handled": false
}
```

Supported built-in delegation values:

- `round-robin`
- `fill-first`

## Configuration Example

```yaml
plugins:
  configs:
    scheduler:
      enabled: true
      priority: 1
      auth_id: ""
      delegate: ""
      deny: false
```

Example plugin behavior:

- When `deny: true`, return an error.
- When `delegate` is `fill-first` or `round-robin`, delegate to the built-in scheduler.
- When `auth_id` is non-empty and exists in the candidate list, select that credential.

## Development Notes

- Only select credential IDs from `Candidates`; do not return IDs outside the request context.
- Returning an error fails the current scheduling attempt and is suitable for explicit request denial.
- Return `Handled: false` when the plugin does not want to handle the request, allowing later plugins or the host built-in logic to continue.

