---
title: Terminal interface
feature_ids:
  - cli.server.management-base-url
  - cli.server.standalone
  - cli.server.tui
  - mode.tui.start
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Terminal interface

## 1. What this solves

Use a management interface in the terminal to operate a proxy that is already running, or start an embedded server in the same process and then connect to it.

## 2. Scope and non-goals

`--tui` by itself does not choose an upstream account. Without `--standalone`, it is only a client of the management API, and the proxy must already be running. The management key and `base-url` are in [Management settings](/operations/management-settings). The Home connection is in [CLIProxyAPI Home](/operations/home).

## 3. How to configure or call it

Client only:

```bash
cli-proxy-api --tui --management-base-url https://example.invalid
```

Embed a server in this process and open the terminal interface:

```bash
cli-proxy-api --tui --standalone
```

The matching configuration key is `management.base-url`. A non-empty command-line value takes priority over the configuration. If both are empty, the client connects to `http://127.0.0.1:` plus the port. If `server.port` is positive, that port is used. Otherwise 8317 is used.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| --management-base-url | Remote management API base URL for TUI client mode. | empty string | Used to choose the target only when `--tui` is set and `--standalone` is not. The example form is `https://example.invalid`. |
| --standalone | Start an embedded local server in TUI mode. | false | It follows the embedded-server path only together with `--tui`. If `--password` is not given, the process generates a local management password that exists only in memory. If the embedded server is still not ready after about 30 probes, the process exits and reports `embedded server is not ready`. |
| --tui | Start the terminal management interface. | false | When false, the process starts as an ordinary proxy. |
| TUI | User entry: start with the terminal management interface. |  | Entered by `--tui`. Without `--standalone`, this process does not start the proxy. |

## 5. Common errors and limits

`--standalone` alone, without `--tui`, does not open the terminal interface and does not embed a server just because of that switch. If client mode cannot reach the management API, the terminal interface reports `TUI error`. Embedded mode temporarily connects standard output and standard error to a null device, then restores them and prints the error on failure. `--local-model` does not print that local-catalog startup note for a pure client TUI (`--tui` without `--standalone`).

## 6. Related behavior

The base URL and key are in [Management settings](/operations/management-settings). The keep-alive endpoint appears when a local password is set. See [Health checks](/operations/health).

## 7. Field experience

- [TUI is only a management client by default](/experience/operations#exp-operations-tui-is-client)
