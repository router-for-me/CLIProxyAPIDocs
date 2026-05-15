---
outline: 'deep'
---

# Redis Usage Queue (RESP)

CLIProxyAPI exposes a minimal Redis RESP interface on the same TCP port as the HTTP API (default `8317`). It is designed for pulling **recent per-request usage records** as JSON so external collectors can ingest telemetry without scraping logs.

## Availability

- The RESP interface is only available when **Management is enabled** (same condition as `/v0/management`). If Management is disabled, RESP connections are closed immediately.
- It shares the same listener as HTTP/HTTPS. If TLS is enabled for the API server, RESP uses that same TLS listener.

## Authentication

- Authenticate with the **Management key** (same secret you use for `/v0/management`).
- Supported forms:
  - `AUTH <password>`
  - `AUTH <username> <password>` (username is ignored; supported for compatibility)
- The IP-ban policy is shared with the Management API: **5 consecutive failures** trigger a temporary ban.

## Enabling usage publishing

The queue only receives records when usage publishing is enabled:

- Config: set `usage-statistics-enabled: true` and restart/hot-reload
- Or via Management API: `PUT /usage-statistics-enabled` with `{ "value": true }`

## Commands

This is **not** a full Redis server. Only these commands are implemented:

- `AUTH`
- `LPOP <key> [count]`
- `RPOP <key> [count]`
- `SUBSCRIBE usage`

Notes:

- The `<key>` argument is currently ignored. Use `queue` for readability.
- Without `count`, `LPOP`/`RPOP` return a single Bulk String (JSON) or `nil` when empty.
- With `count`, `LPOP`/`RPOP` return an Array of Bulk Strings; an empty array when empty.
- Items are retained in memory for `redis-usage-queue-retention-seconds` (seconds, default `60`, max `3600`). Poll frequently if you need lossless capture.
- `SUBSCRIBE usage` uses Redis pub/sub framing. While at least one client is subscribed, new usage records are broadcast to all subscribed clients and are not stored in the FIFO queue. Those records cannot be fetched later with `LPOP`/`RPOP` or the Management usage queue endpoint.
- If no clients are subscribed, new usage records continue to enter the FIFO queue as before.
- In subscription mode, `PING`, `UNSUBSCRIBE`, and `QUIT` are supported for basic connection control.

## Examples

Using `redis-cli`:

```bash
# pop one item (prints JSON)
redis-cli -h 127.0.0.1 -p 8317 -a "<MANAGEMENT_KEY>" --no-auth-warning --raw LPOP queue

# pop up to 50 items
redis-cli -h 127.0.0.1 -p 8317 -a "<MANAGEMENT_KEY>" --no-auth-warning --raw RPOP queue 50

# subscribe to live usage records
redis-cli -h 127.0.0.1 -p 8317 -a "<MANAGEMENT_KEY>" --no-auth-warning --raw SUBSCRIBE usage
```

## Payload schema

Each queue item is a single JSON object with these fields:

- `timestamp` (RFC 3339 timestamp string)
- `latency_ms` (integer)
- `source` (string)
- `auth_index` (string)
- `tokens`:
  - `input_tokens` (integer)
  - `output_tokens` (integer)
  - `reasoning_tokens` (integer)
  - `cached_tokens` (integer)
  - `total_tokens` (integer)
- `failed` (boolean)
- `provider` (string)
- `model` (string, actual model name used for execution)
- `alias` (string, model name requested by the client)
- `endpoint` (string, e.g. `POST /v1/chat/completions`)
- `auth_type` (string)
- `api_key` (string)
- `request_id` (string)

Example:

```json
{
  "timestamp": "2026-04-25T00:00:00Z",
  "latency_ms": 1500,
  "source": "user@example.com",
  "auth_index": "0",
  "tokens": {
    "input_tokens": 10,
    "output_tokens": 20,
    "reasoning_tokens": 0,
    "cached_tokens": 0,
    "total_tokens": 30
  },
  "failed": false,
  "provider": "openai",
  "model": "gpt-5.4",
  "alias": "client-gpt",
  "endpoint": "POST /v1/chat/completions",
  "auth_type": "apikey",
  "api_key": "test-key",
  "request_id": "ctx-request-id"
}
```
