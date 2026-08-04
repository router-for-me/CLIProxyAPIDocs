# PI Agent

Запустите сервер CLIProxyAPI, затем выполните следующую команду, чтобы установить официальный плагин провайдера PI.

```bash
pi install npm:@router-for-me/pi-cliproxyapi-provider
```

Затем войдите в PI, выполните `/login CLIProxyAPI` и укажите Base URL и API Key для входа.

Наконец, выполните в PI команду `/settings`, откройте настройки и установите для `Transport` значение `websocket-cached`.
