---
title: Command-line flags
feature_ids:
  - cli.server.config
  - cli.server.discover
  - cli.server.discover-config
  - cli.server.discover-exclude
  - cli.server.discover-include
  - cli.server.discover-json
  - cli.server.discover-service-type
  - cli.server.discover-timeout
  - cli.server.exclude
  - cli.server.include
  - cli.server.json
  - cli.server.local-model
  - cli.server.no-browser
  - cli.server.oauth-callback-port
  - cli.server.password
  - cli.server.service-type
  - cli.server.siwc-bind
  - cli.server.timeout
  - cli.server.vertex-import-prefix
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Command-line flags

This page covers only the `CLIProxyAPI` flags that belong to this page in the pinned commit. The binary name matches `./CLIProxyAPI` inside the image. Go's flag parser accepts one or two dashes. The text below uses two dashes, matching the ledger titles.

## 1. What this solves

These flags choose which configuration file the process reads, whether to run LAN discovery once and exit, whether login opens a browser, which local callback port to use, whether to set a local management password, and whether to switch to the built-in model catalog. Discovery has two forms: the `discover` subcommand, and the still-supported `--discover` / `--discover-json` flags.

## 2. Scope and non-goals

This applies when you run the binary directly. The `discover` subcommand is parsed on its own and then exits. It does not start the proxy, and it does not accept the older `--discover-*` flags.

This page does not describe provider login flags, how the management key is configured, or Docker Compose. `--vertex-import-prefix` takes effect only together with `--vertex-import`. The import steps are not on this page. `--password` is not a substitute for the management key: when both the management key and the `MANAGEMENT_PASSWORD` environment variable are empty, the management API does not accept this password.

## 3. How to configure or call it

Select a configuration file. When the value is left empty, and there is no Postgres, object-storage, Git, or Home configuration source, the process loads `config.yaml` from the working directory.

```bash
CLIProxyAPI --config /path/to/config.yaml
```

Subcommand discovery. `--include` and `--exclude` take comma-separated interface names. Names are case-insensitive, and a trailing `*` is a prefix. If either flag is non-empty, both filter lists in the configuration file are replaced at once.

```bash
CLIProxyAPI discover --timeout 3 --include eth0 --exclude "docker*"
CLIProxyAPI discover --json --config /path/to/config.yaml
```

Legacy flag discovery. `--discover-json` by itself starts the scan and then exits.

```bash
CLIProxyAPI --discover --discover-timeout 3 --discover-include eth0 --discover-exclude "docker*"
CLIProxyAPI --discover-json
```

Built-in model catalog, do not open a browser, local management password, and write Sign in with ChatGPT into an existing Codex credential file:

```bash
CLIProxyAPI --local-model
CLIProxyAPI --no-browser --siwc-bind credential.json
CLIProxyAPI --password YOUR_API_KEY
```

`credential.json` must be a file name in the configured authentication directory, or an absolute path to a file inside that directory. When `--oauth-callback-port` is greater than 0, it overrides the local callback port for login and for `--siwc-bind`. The default `0` keeps each provider's own port.

```bash
CLIProxyAPI --vertex-import /path/to/service-account.json --vertex-import-prefix team-a
```

`team-a` is only an example of a prefix without a slash. It is not a default.

## 4. Details

The Default column matches the ledger `defaults` verbatim. A blank cell means the field is an empty string.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| cli.server.config | Top-level `--config`. Selects the YAML to load when there is no Postgres, object-storage, Git, or Home configuration source. If Home already supplied a configuration, a non-empty value is only kept for later components and is not loaded again as the configuration file. | empty string | Empty uses `config.yaml` in the working directory. |
| cli.server.discover | `--discover`. Scans the LAN for AI gateways and CLIProxyAPI instances, prints the result, and exits without starting the proxy. | false | `--discover-json` enters the same scan. |
| cli.server.discover-config | `--config` on the `discover` subcommand. Used only to read `discovery.interfaces` from that file. | empty string | This is not the top-level `--config`. If the file is missing or the YAML is invalid, the filter lists are empty and the scan still continues. Empty uses `config.yaml` in the working directory. |
| cli.server.discover-exclude | With `--discover` or `--discover-json`, skip the listed interfaces. |  | Comma-separated. Empty items and duplicates are ignored. If this or `--discover-include` is non-empty, both command-line lists replace the filters in the configuration file. |
| cli.server.discover-include | With `--discover` or `--discover-json`, scan only the listed interfaces and override the default physical-LAN interface filter. |  | Same rules as `--discover-exclude`. |
| cli.server.discover-json | Run the same scan, write the gateways as a JSON array to standard output, and exit. | false | Does not write the version banner to standard output. |
| cli.server.discover-service-type | With the legacy discovery flags, set the DNS-SD service type. | empty string | An empty value uses `_ai-gateway._tcp`. |
| cli.server.discover-timeout | With the legacy discovery flags, set the scan timeout in seconds. | 3 | Less than or equal to 0 is treated as 3 seconds. Greater than 60 seconds is treated as 60 seconds. |
| cli.server.exclude | `--exclude` on the `discover` subcommand. Skip the listed interfaces. |  | Matching rules are the same as `--discover-exclude`. If this or the subcommand `--include` is non-empty, both replace the filters in the configuration file. |
| cli.server.include | `--include` on the `discover` subcommand. Scan only the listed interfaces and override the default physical-LAN interface filter. |  | Matching rules are the same as `--discover-include`. |
| cli.server.json | `--json` on the `discover` subcommand. Output a JSON array and omit the version banner. | false | Scan errors become a JSON object with `error` and an empty `gateways`. |
| cli.server.local-model | Use the built-in model catalog when the corresponding catalog source is empty. If `models.catalog`, `models.codex-catalog`, or `models.devin-catalog` is non-empty, that entry still uses the explicit source. | false | Normal startup and TUI standalone honor it. It is not called when the process is only a TUI client connected to an existing service. |
| cli.server.no-browser | OAuth login does not open a browser. The authorization URL is printed instead. | false | Devin login prints the authorization URL and asks you to paste an authorization code or session token. The command line installs the default interactive prompt. |
| cli.server.oauth-callback-port | When greater than 0, override the local callback port for login commands and `--siwc-bind`. | 0 | 0 keeps the provider's own port. Devin uses an ephemeral port when this is not overridden. |
| cli.server.password | Local management password passed to the service. The help text does not show this flag. | empty string | `GET /keep-alive` is registered only on a normal startup when this flag is non-empty, and the 10-second idle time is counted from when the endpoint is enabled. TUI standalone does not register that endpoint, and does not exit because of it, even when this flag is non-empty or a password was generated because the flag was empty. A normal startup with an empty flag does not set this password. TUI standalone generates a password only when this flag is empty. |
| cli.server.service-type | `--service-type` on the `discover` subcommand. | empty string | An empty value uses `_ai-gateway._tcp`. |
| cli.server.siwc-bind | Name an existing Codex credential file, run Sign in with ChatGPT, write the SIWC section and `use_siwc=true`, then exit without starting the proxy. | empty string | It must be an absolute path or a bare file name inside the authentication directory. `--no-browser` and `--oauth-callback-port` apply to it. |
| cli.server.timeout | `--timeout` on the `discover` subcommand, in seconds. | 3 | Less than or equal to 0 is treated as 3 seconds. Greater than 60 seconds is treated as 60 seconds. |
| cli.server.vertex-import-prefix | When used with `--vertex-import`, add a prefix to the Vertex model name and to the saved credential file. | empty string | If a `/` remains after trimming leading and trailing slashes, the save is rejected. Using the prefix alone does not import a key. |

## 5. Common errors and limits

If the discovery scan finds no qualified physical interface, the exit code is 1. Non-JSON output writes `Error scanning LAN: no qualified physical interfaces found for LAN discovery` to standard error. JSON output is an object that contains `error` and an empty `gateways`. Finding no gateway is not an error. The exit code is 0, and the process prints a hint that includes the requirement `discovery.enabled: true` on the target. This page does not expand on discovery configuration.

If the `discover` subcommand or the top-level parser sees an unrecognized flag, it exits through Go's `ExitOnError` with exit code 2.

`--siwc-bind` rejects an empty path, an unconfigured authentication directory, a relative path that contains a directory separator, a missing file, and a file that is not inside the authentication directory. If the callback port is already in use, the process exits with an error.

When `--vertex-import-prefix` contains a slash, the error `vertex-import: prefix must be a single segment (no '/' allowed)` is logged and the credential is not saved.

`GET /keep-alive` is registered only on a normal startup when `--password` is non-empty. That endpoint reads the password from `Authorization: Bearer` or `X-Local-Password`. A missing or mismatched password returns 401 with the body `invalid password`. Timing starts when the endpoint is enabled: the process exits if the endpoint is never called successfully, or if 10 seconds have passed since the last successful call. TUI standalone does not register that endpoint, and does not exit after 10 seconds because of it, even when the password is non-empty or was generated by the program. The management API still requires a configured management key or `MANAGEMENT_PASSWORD` first. If both are empty, it returns 403 `remote management key not set` and does not fall back to this flag. A local request that already has one of those keys can pass the check with this flag.

`--config` cannot override a Postgres, object-storage, Git, or Home configuration source that is already enabled.

## 6. Related behavior

Catalog sources are covered in [Model catalogs](/introduction/models). Starting with the Compose file in the repository is covered in [Run with Docker Compose](/docker/docker).

## 7. Field experience

- [Use manual login when there is no browser](/experience/accounts#exp-accounts-claude-manual-login)
- [Send the client key when calling a public route](/experience/api#exp-api-require-client-key)
- [Enable Git storage with environment variables](/experience/configuration#exp-configuration-git-storage-env)
- [Git and object storage are not live multi-machine sync](/experience/configuration#exp-configuration-storage-is-not-live-sync)
- [Unknown keys become comments during migration](/experience/configuration#exp-configuration-unknown-keys-on-migrate)
- [Mount a real configuration file into the container](/experience/docker#exp-docker-mount-real-config)
- [Start from the sample configuration file](/experience/introduction#exp-introduction-copy-example-config)
- [The local-model switch skips the remote refresh](/experience/introduction#exp-introduction-local-model-catalog)
- [Provide a configuration file or a login before startup](/experience/introduction#exp-introduction-start-with-config-or-login)
- [Management login uses secret-key](/experience/operations#exp-operations-management-secret)
