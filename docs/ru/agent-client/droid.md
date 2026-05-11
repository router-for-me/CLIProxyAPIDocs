# Factory / Droid

Сначала запустите CLIProxyAPI, затем отредактируйте `~/.factory/settings.json`.

Для моделей GPT и Codex в Factory используется OpenAI-совместимый путь, поэтому `baseUrl` должен указывать на `/v1` у вашего прокси.

Эта страница описывает текущий формат конфигурации Droid / Factory:

- файл: `~/.factory/settings.json`
- ключ списка моделей: `customModels`
- поля OpenAI-совместимого режима: `baseUrl`, `apiKey`, `provider`

## Минимальная запись модели

```json
{
  "customModels": [
    {
      "model": "gpt-5.4",
      "id": "custom:gpt-5.4",
      "index": 0,
      "baseUrl": "http://127.0.0.1:8317/v1",
      "apiKey": "sk-dummy",
      "displayName": "GPT 5.4",
      "maxOutputTokens": 128000,
      "noImageSupport": false,
      "provider": "openai"
    }
  ]
}
```

## Fast-алиас

Если вам нужен режим GPT-5.4 high fast через CLIProxyAPI, в Factory нужно указывать алиас, а не каноническое имя модели.

Пример:

```json
{
  "customModels": [
    {
      "model": "gpt-5.4-high-fast",
      "id": "custom:gpt-5.4-high-fast",
      "index": 0,
      "baseUrl": "http://127.0.0.1:8317/v1",
      "apiKey": "sk-dummy",
      "displayName": "GPT 5.4 High Fast",
      "maxOutputTokens": 128000,
      "noImageSupport": false,
      "provider": "openai"
    }
  ]
}
```

Этот алиас должен быть настроен в CLIProxyAPI. Обычно делают так:

- `oauth-model-alias.codex`: сопоставляет `gpt-5.4-high-fast` с `gpt-5.4`
- `payload.override`: добавляет `service_tier: "priority"`
- `payload.override`: добавляет `reasoning.effort: "high"`

Сам по себе вызов `/v1` не включает fast mode. Переключателем служит именно алиас.

Если вы используете размещённый CLIProxyAPI, проверьте активность алиаса через аутентифицированный `/v1/models`. Если `gpt-5.4-high-fast` отсутствует в списке моделей, проблема не в harness-конфиге, а в том, что прокси ещё не загрузил этот алиас.

## Значения по умолчанию

Если вы хотите, чтобы Factory использовал этот алиас по умолчанию, направьте эти настройки на ID пользовательской модели:

```json
{
  "sessionDefaultSettings": {
    "model": "custom:gpt-5.4-high-fast",
    "reasoningEffort": "none"
  },
  "missionOrchestratorModel": "custom:gpt-5.4-high-fast",
  "missionOrchestratorReasoningEffort": "none",
  "missionModelSettings": {
    "workerModel": "custom:gpt-5.4-high-fast",
    "workerReasoningEffort": "none",
    "validationWorkerModel": "custom:gpt-5.4-high-fast",
    "validationWorkerReasoningEffort": "none"
  }
}
```

Если прокси-алиас уже добавляет `reasoning.effort: "high"`, оставьте `reasoningEffort` на стороне Factory равным `none`, чтобы не управлять одним и тем же параметром в двух местах.

## Примечания

- Для моделей GPT / Codex через CLIProxyAPI используйте `provider: "openai"`
- Для OpenAI-совместимого пути используйте `baseUrl: "http://127.0.0.1:8317/v1"`
- Если в том же файле вы настраиваете нативные модели Anthropic, у них будет другой `provider` и другой формат `baseUrl`

## Диагностика

- `502` на `POST /v1/responses` для алиаса, при этом обычный `gpt-5.4` работает:
  обычно это значит, что прокси ещё не подхватил конфиг алиаса.
- Алиас не виден в `/v1/models`:
  значит, нужный конфиг не активен на запущенном инстансе.
- Hot reload не заметил изменение конфига:
  если вы удалили `config.yaml` и создали его заново, перезапустите сервер. Для hot reload редактирование файла на месте обычно надёжнее, чем сценарий удалить-и-создать.
