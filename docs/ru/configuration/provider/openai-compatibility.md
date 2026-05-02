# Провайдеры, совместимые с OpenAI

Настройте вышестоящие OpenAI-совместимые провайдеры (например, OpenRouter) через `openai-compatibility`.

- `name`: идентификатор провайдера, используемый внутри системы
- `disabled`: опциональный флаг для отключения провайдера без удаления из конфигурации
- `base-url`: базовый URL провайдера
- `api-key-entries`: список записей API-ключей с опциональной конфигурацией прокси для каждого ключа (рекомендуется и сохраняется)
- `models`: список сопоставлений имени модели вышестоящего провайдера `name` с локальным псевдонимом `alias`

> Совместимость: устаревшие `api-keys` переносятся в `api-key-entries` при загрузке и удаляются при сохранении конфигурации; в дальнейшем используйте `api-key-entries`.

Пример с поддержкой прокси для каждого ключа:

```yaml
openai-compatibility:
  - name: "openrouter"
    disabled: false
    base-url: "https://openrouter.ai/api/v1"
    api-key-entries:
      - api-key: "sk-or-v1-...b780"
        proxy-url: "socks5://proxy.example.com:1080"
      - api-key: "sk-or-v1-...b781"
    models:
      - name: "moonshotai/kimi-k2:free"
        alias: "kimi-k2"
```

Использование:
Вызывайте endpoint OpenAI `/v1/chat/completions`, установив `model` в значение алиаса (например, `kimi-k2`). Proxy автоматически перенаправляет запрос к настроенному `provider`/`model`.
