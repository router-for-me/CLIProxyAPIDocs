# macOS Local Launcher

This page describes a practical macOS pattern for running CLIProxyAPI as a local service with:

- a fixed writable checkout directory
- a thin `.app` launcher in `/Applications`
- automatic opening of the built-in Web UI
- a separate update workflow

The goal is to keep runtime state, updates, and the app bundle decoupled.

## Recommended layout

Keep the real checkout outside the `.app` bundle, for example:

```text
~/CLIProxyAPI/
  bin/
  auths/
  logs/
  temp/
  config.yaml
```

Recommended responsibilities:

- `config.yaml`: local runtime configuration
- `auths/`: OAuth and provider auth files
- `logs/`: runtime logs
- `bin/`: built binaries and local helper scripts
- `temp/`: PID files, browser profiles, and temporary control files

This keeps mutable runtime data out of the application bundle.

## Keep the `.app` thin

The macOS `.app` should be a thin launcher, not a second installation.

Recommended pattern:

1. Store the actual CLIProxyAPI checkout in a stable writable directory such as `~/CLIProxyAPI`.
2. Put a small `.app` bundle in `/Applications`.
3. Make the `.app` call scripts from the real checkout.

This avoids embedding a stale server binary inside the app bundle.

## Start flow

A robust start flow usually looks like this:

1. Check whether CLIProxyAPI is already running.
2. If it is not running, start the local binary in a detached session.
3. Wait for `http://127.0.0.1:8317/` to respond.
4. Wait for `http://127.0.0.1:8317/management.html` to become available.
5. Open the Web UI.

The built-in management panel is served from:

```text
http://127.0.0.1:8317/management.html
```

Do not treat `/` as the management UI entrypoint. The root path is only a lightweight status endpoint.

## Stop flow

If the launcher also needs a one-click stop action, keep it symmetrical:

1. Stop the local CLIProxyAPI process using a PID file or a dedicated status script.
2. Close only the Web UI window that belongs to CLIProxyAPI.

Do not close arbitrary browser windows or tabs from the user's normal browsing session.

## Use a dedicated browser profile for the Web UI

If you want a reliable "close Web UI" action, do not open the panel in a random existing browser tab.

Instead, use a dedicated browser profile or app-style window.

### Chrome or Chromium

```bash
open -na "Google Chrome" --args \
  --user-data-dir="$HOME/CLIProxyAPI/temp/webui-browser-profile" \
  --app="http://127.0.0.1:8317/management.html"
```

This is usually the most reliable option when the launcher also needs to close the matching Web UI window later.

### Firefox

```bash
open -na "Firefox" --args \
  --profile "$HOME/CLIProxyAPI/temp/webui-firefox-profile" \
  --new-window "http://127.0.0.1:8317/management.html"
```

This provides an isolated browser profile, although the result is less app-like than Chrome's `--app` mode.

### Safari

Safari can open the URL:

```bash
open -a "Safari" "http://127.0.0.1:8317/management.html"
```

However, Safari does not provide a directly equivalent command-line flow for a dedicated profile plus an app-style window.

If you need a deterministic "open only this window" and "close only this window" workflow, Chrome-based browsers or Firefox are usually a better fit. If you prefer Safari, check Safari and macOS automation documentation for the current supported options.

## Keep updates separate from launching

Do not make the `.app` responsible for updating the repository automatically.

Instead, keep updates in a separate terminal workflow such as:

- `up`
- `git pull`
- a local rebuild script

This keeps updates explicit, easier to debug, and independent from app launching.

## Relationship with Gemini CLI

If you use Gemini CLI on macOS together with CLIProxyAPI, this pattern works well with the configuration documented in [Gemini CLI](/agent-client/gemini-cli).

The usual split is:

- `.app`: start and stop the local service and Web UI
- terminal command: update the checkout and rebuild binaries
- `gemini`: point the client at the local CLIProxyAPI endpoint
