# Grok Build

Запустите сервер CLIProxyAPI, затем отредактируйте файл `~/.grok/auth.json`.

auth.json:
```json
{
  "xai::api_key": {
    "key": "<your_api_key>",
    "auth_mode": "api_key",
    "create_time": "2026-08-04T12:00:00Z",
    "user_id": "",
    "email": null,
    "coding_data_retention_opt_out": true
  }
}
```

Затем добавьте следующее содержимое в файл `~/.grok/config.toml`:

config.toml:
```toml
[features]
remote_fetch = true

[endpoints]
models_base_url = "http://127.0.0.1:8317/v1"
models_list_url = "http://127.0.0.1:8317/v1/models"
```
