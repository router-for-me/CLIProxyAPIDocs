---
title: Health checks
feature_ids:
  - route.healthz.get
  - route.healthz.head
  - route.keep-alive.get
  - route.root.get
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Health checks

## 1. What this solves

Provide a liveness probe that does not go through model routing, a short description at the root path, and a keep-alive request that stops a process started with a local password from exiting because nobody called it.

## 2. Scope and non-goals

`GET /healthz`, `HEAD /healthz`, and `GET /` do not check a client API key. They do not mean an upstream model is usable, and they do not replace the management API. `GET /keep-alive` is registered only when the process is started with a local password.

## 3. How to configure or call it

Replace the host with the address that is actually listening. The example uses `https://example.invalid`.

`GET /healthz` returns `200` and `{"status":"ok"}`.

`HEAD /healthz` returns `200` with no response body.

`GET /` returns `200`. The JSON has `message` set to `CLI Proxy API Server` and an `endpoints` list: `POST /v1/chat/completions`, `POST /v1/completions`, and `GET /v1/models`.

`GET /keep-alive` is registered only when the process is started with `--password`. The request must carry that local password in `Authorization: Bearer YOUR_API_KEY` or `X-Local-Password`. Success returns `{"status":"ok"}`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| GET /healthz | Return liveness JSON. |  | No key. `200`, body `{"status":"ok"}`. |
| HEAD /healthz | Return only the liveness status code. |  | No key. `200`, no body. |
| GET /keep-alive | Reset the idle timer of a process that has a local password. |  | Registered only when startup included a local password. 10 seconds of idle shuts the process down. A mismatched password is `401` with the error `invalid password`. |
| GET / | Return the server description and three sample endpoints. |  | No key. It does not list every route. |

## 5. Common errors and limits

Without `--password`, `GET /keep-alive` does not appear on the default server. The request hits an unregistered route, not a successful keep-alive. A wrong password does not reset the timer. These three public probes do not verify that an upstream credential can still call a model.

## 6. Related behavior

The listen port is in [Listener and process](/operations/server). The local password is also used for local access to the management API. See [Management settings](/operations/management-settings).

## 7. Field experience

None yet.
