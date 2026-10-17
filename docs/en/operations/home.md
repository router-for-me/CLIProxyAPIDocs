---
title: CLIProxyAPI Home
feature_ids:
  - cli.server.home-disable-cluster-discovery
  - cli.server.home-jwt
  - mode.home.jwt
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# CLIProxyAPI Home

## 1. What this solves

Connect this process to CLIProxyAPI Home with a control-plane JWT: bootstrap the mTLS certificate, pull configuration from Home, and run with that configuration. Cluster-node discovery can optionally be turned off so the address in the JWT stays fixed.

## 2. Scope and non-goals

This is not the management API and not the terminal interface. After Home is enabled, `/v0/management` and `/v8/management` return 404. Local Postgres, object storage, and Git storage are turned off while configuration is loaded from Home. Whether a plugin's Home sync succeeds is not expanded into install steps here. The plugin directory is in [Plugin loading and the store](/operations/plugins).

## 3. How to configure or call it

```bash
cli-proxy-api --home-jwt YOUR_API_KEY
```

The JWT should already contain the fields the control plane requires. Do not write a real JWT into a configuration file or the documentation.

Keep the address in the JWT and skip CLUSTER NODES discovery:

```bash
cli-proxy-api --home-jwt YOUR_API_KEY --home-disable-cluster-discovery
```

When the command-line `--home-jwt` is empty, a non-empty environment variable `HOME_JWT` or `home_jwt` fills the same value.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| --home-disable-cluster-discovery | Turn off Home CLUSTER NODES discovery and keep using the address configured in `--home-jwt`. | false | `DisableClusterDiscovery` is set to true only after the JWT has been parsed and a Home configuration has been produced. |
| --home-jwt | Home control-plane JWT, used for mTLS certificate bootstrap and the connection. | empty string | It must parse to `certificate_id`, `cluster_id`, `ca_fingerprint`, `enrollment_secret`, plus a non-empty IP and a positive port. If it is invalid, `invalid -home-jwt` is logged and startup exits. A failed configuration pull also stops startup. |
| CLIProxyAPI Home | Connect to CLIProxyAPI Home with a control-plane JWT. |  | After success, configuration is read from Home, usage statistics are set to true, and the port is normalized to 8317 when it is omitted or not positive. |

## 5. Common errors and limits

If the JWT is not three segments, is missing one of the fields above, or the target address is invalid, the proxy does not start. Fetching or parsing configuration from Home also returns. A failed plugin sync logs an error and stops the rest of startup. In Home mode, do not expect the local management API. Calls receive 404.

## 6. Related behavior

The terminal interface is in [Terminal interface](/operations/tui). Why the management key has no effect under Home is in [Management settings](/operations/management-settings).

## 7. Field experience

None yet.
