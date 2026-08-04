# PI Agent

启动 CLIProxyAPI 服务器，然后执行以下命令安装官方PI供应商插件。

```bash
pi install npm:@router-for-me/pi-cliproxyapi-provider
```

然后在进入PI，在PI中执行 `/login CLIProxyAPI` 登录，填入Base URL及API Key。

最后在PI的中执行 `/settings`，进入设置将 `Transport` 设置为 `websocket-cached`。