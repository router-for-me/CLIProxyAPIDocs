# xAI / Grok (вход по OAuth)

CLIProxyAPI поддерживает аккаунты Grok Build через xAI OAuth. После входа аккаунт доступен как provider `xai` и по умолчанию использует базовый URL xAI API `https://api.x.ai/v1`.

## Вход

```bash
./cli-proxy-api --xai-login
```

Опции: добавьте `--no-browser`, чтобы вывести URL для входа вместо открытия браузера. По умолчанию локальный OAuth callback слушает `127.0.0.1:56121/callback`.

Если порт callback по умолчанию недоступен, укажите другой порт:

```bash
./cli-proxy-api --xai-login --oauth-callback-port <port>
```

В удаленной среде или среде без браузера следуйте инструкциям SSH tunnel, которые выводит команда. Если CLI попросит вручную вставить callback token, вставьте только сам token, а не полный callback URL.

## Поддерживаемые API

- Текстовые модели маршрутизируются в xAI Responses API и могут вызываться через OpenAI-совместимые endpoints, например `/v1/responses` и `/v1/chat/completions`.
- Запросы изображений используют `/v1/images/generations` и `/v1/images/edits` с моделями `grok-imagine-image` или `grok-imagine-image-quality`.
- Запросы видео используют `/v1/videos`, `/v1/videos/generations`, `/v1/videos/edits`, `/v1/videos/extensions` и `/v1/videos/{request_id}` с моделью `grok-imagine-video`.

Для моделей изображений и видео xAI можно использовать имя модели напрямую или с префиксом `xai/`, `x-ai/` либо `grok/`.

## Управление моделями

Используйте канал `xai` в `oauth-model-alias`, чтобы показать клиентам другое имя модели:

```yaml
oauth-model-alias:
  xai:
    - name: "grok-4.3"
      alias: "grok-latest"
```

Используйте тот же канал в `oauth-excluded-models`, чтобы скрыть модели из списка и маршрутизации:

```yaml
oauth-excluded-models:
  xai:
    - "grok-3-mini"
```

## Примечания к запросам

CLIProxyAPI нормализует xAI Responses requests перед отправкой upstream. Неподдерживаемые поля продолжения/кэша удаляются, определения tools адаптируются для совместимости с xAI, а настройки reasoning сохраняются только для моделей Grok, которые поддерживают reasoning effort.
