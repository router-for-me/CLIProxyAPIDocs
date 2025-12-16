# Web UI

Project URL:
[Cli-Proxy-API-Management-Center](https://github.com/router-for-me/Cli-Proxy-API-Management-Center)

An official web-based management center for CLIProxyAPI.

Base path: `http://localhost:8317/management`

Set `remote-management.disable-control-panel` to `true` if you prefer to host the management UI elsewhere; the server will skip downloading `management.html` and `/management.html` will return 404.

You can set the `MANAGEMENT_STATIC_PATH` environment variable to choose the directory where `management.html` is stored.

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
