# Web UI

Project URL:
[Cli-Proxy-API-Management-Center](https://github.com/router-for-me/Cli-Proxy-API-Management-Center)

An official web-based management center for CLIProxyAPI.

Base path: `http://localhost:8317/management`

Set `remote-management.disable-control-panel` to `true` if you prefer to host the management UI elsewhere; the server will skip downloading `management.html` and `/management.html` will return 404.

You can set the `MANAGEMENT_STATIC_PATH` environment variable to choose the directory where `management.html` is stored.
