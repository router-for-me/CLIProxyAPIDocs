# Web UI

Project URL:
[Cli-Proxy-API-Management-Center](https://github.com/router-for-me/Cli-Proxy-API-Management-Center)

An official web-based management center for CLIProxyAPI.

Base path: `http://localhost:8317/management.html`

Set `remote-management.disable-control-panel` to `true` if you prefer to host the management UI elsewhere; the server will skip downloading `management.html` and `/management.html` will return 404.

You can set the `MANAGEMENT_STATIC_PATH` environment variable to choose the directory where `management.html` is stored.

## Connection storage and plugin resources

The official Management Center stores connection state in browser `localStorage` for the Management Center origin. The API base URL is persisted for reconnection. The management key is persisted only when the user enables password remembering, or when an older stored session is migrated. Stored values use reversible obfuscation, not a cryptographic security boundary.

When the Management Center and CLIProxyAPI are served from the same origin, plugin resource pages loaded from `/v0/resource/plugins/<pluginID>/...` run in that same origin. A trusted plugin resource page can therefore read the same `localStorage` and reuse the stored management key to call `/v0/management/...`.

Treat installing and enabling a plugin with resource pages as trusting that plugin's browser code with the current management session. Plugin resource pages should bundle their own JavaScript and should not load third-party scripts, because any script running on the same origin can read the same stored management context.

If you host the Management Center on a different origin from CLIProxyAPI, browser same-origin policy prevents a plugin resource iframe from reading the Management Center origin's `localStorage`. In that deployment, plugin pages should handle the missing key and ask the user to open the same-origin management page or sign in again.

## Use a custom Web UI

You can point the server to your own GitHub repository for the management panel:

```yaml
remote-management:
  panel-github-repository: "https://github.com/your-org/your-management-ui"
```

- Repository URL form: `https://github.com/<org>/<repo>`; the server automatically converts it to `https://api.github.com/repos/<org>/<repo>/releases/latest`.
- API URL form: set it directly to `https://api.github.com/repos/<org>/<repo>/releases/latest`.
- The updater periodically checks the latest release, looks for an asset named `management.html`, and downloads it to the static directory (default `static/` beside the config file or the path set via `MANAGEMENT_STATIC_PATH`). If the asset includes a `digest` field (`sha256:<hex>` recommended), it will be used for integrity validation.

## How to publish a custom Web UI on GitHub

1. Build your custom panel and produce a single `management.html` (bundle assets into one file if possible).
2. Create a GitHub repository and push your code.
3. Create a release (the updater targets `latest`) and upload assets:
   - Must include **`management.html`**.
   - Strongly recommended: add a `digest` metadata field with `sha256:<file hash>` for checksum verification.
4. Set `remote-management.panel-github-repository` in CLIProxyAPI to the repository URL or the API URL.
5. Restart or hot-reload the config; the server will fetch and replace the management panel automatically.
