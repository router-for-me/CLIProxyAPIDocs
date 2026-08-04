# PI Agent

Start the CLIProxyAPI server, then run the following command to install the official PI provider plugin.

```bash
pi install npm:@router-for-me/pi-cliproxyapi-provider
```

Then enter PI, run `/login CLIProxyAPI`, and log in by providing the Base URL and API key.

Finally, run `/settings` in PI, open the settings, and set `Transport` to `websocket-cached`.
