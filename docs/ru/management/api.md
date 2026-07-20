---
outline: 'deep'
---

# Management API

Базовый путь: `http://localhost:8317/v0/management`

Этот API управляет конфигурацией среды выполнения и файлами аутентификации CLIProxyAPI. Все изменения сохраняются в конфигурационный файл YAML и применяются сервисом через hot‑reloading.

Примечание: Следующие опции не могут быть изменены через API и должны быть заданы в конфигурационном файле (при необходимости перезапустите сервис):
- `remote-management.allow-remote`
- `remote-management.secret-key` (если при запуске обнаружен открытый текст, он автоматически хешируется с помощью bcrypt и записывается обратно в конфигурацию)

## Аутентификация

- Все запросы (включая localhost) должны содержать валидный ключ управления.
- Для удаленного доступа необходимо включить удаленное управление в конфигурации: `remote-management.allow-remote: true`.
- Передайте ключ управления (в виде открытого текста) одним из способов:
    - `Authorization: Bearer <plaintext-key>`
    - `X-Management-Key: <plaintext-key>`

Дополнительные примечания:
- Установка переменной окружения `MANAGEMENT_PASSWORD` регистрирует дополнительный секрет управления в открытом виде и принудительно оставляет удаленное управление включенным, даже если `remote-management.allow-remote` имеет значение false. Значение никогда не сохраняется на диске и должно передаваться через те же заголовки `Authorization`/`X-Management-Key`.
- Когда прокси запускается с помощью `cliproxy run --password <pwd>` или через `WithLocalManagementPassword` в SDK, клиенты localhost (`127.0.0.1`/`::1`) могут предоставлять этот локальный пароль через те же заголовки; он хранится только в памяти и не записывается на диск.
- Маршруты Management API не регистрируются (и возвращают 404) только когда `remote-management.secret-key` пуст, `MANAGEMENT_PASSWORD` не задан и при запуске не был настроен локальный пароль управления.
- Для любого IP клиента (включая localhost) 5 последовательных неудачных попыток аутентификации вызывают временную блокировку (~30 минут), прежде чем будут разрешены дальнейшие попытки.

Если при запуске в конфигурации обнаруживается ключ в открытом виде, он будет автоматически захеширован с помощью bcrypt и перезаписан в файл конфигурации.

## Соглашения о запросах и ответах
- Content-Type: `application/json` (если не указано иное).
- Обновление Boolean/int/string: тело запроса — `{ "value": <type> }`.
- PUT массива: либо необработанный массив (например, `["a","b"]`), либо `{ "items": [ ... ] }`.
- PATCH массива: поддерживает `{ "old": "k1", "new": "k2" }` или `{ "index": 0, "value": "k2" }`.
- PATCH массива объектов: поддерживает сопоставление по индексу или по ключевому полю (указывается для каждого эндпоинта).

## Эндпоинты

### Очередь Usage Telemetry
- Устаревшие агрегированные эндпоинты usage (`/usage`, `/usage/export`, `/usage/import`) больше недоступны. Используйте `GET /usage-queue` для per-request записей очереди.
- Для per-request usage записей в JSON используйте [Redis очередь usage](./redis-usage-queue) (RESP), доступную на том же порту, что и HTTP.
- Используйте `/usage-statistics-enabled` для включения/отключения публикации usage.

- GET `/usage-queue?count=10` — Извлечь из очереди до `count` usage записей
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        'http://localhost:8317/v0/management/usage-queue?count=10'
      ```
    - Ответ:
      ```json
      [
        {
          "timestamp": "2026-05-05T12:00:00Z",
          "latency_ms": 1234,
          "source": "user@example.com",
          "auth_index": "0",
          "tokens": {
            "input_tokens": 10,
            "output_tokens": 20,
            "reasoning_tokens": 0,
            "cached_tokens": 0,
            "total_tokens": 30
          },
          "failed": false,
          "provider": "openai",
          "model": "gpt-5.4",
          "alias": "gpt-5.4",
          "endpoint": "POST /v1/chat/completions",
          "auth_type": "api_key",
          "api_key": "sk-...",
          "request_id": "req_..."
        }
      ]
      ```
    - Примечания:
        - `count` необязателен, значение по умолчанию — `1`; он должен быть положительным целым числом.
        - Ответ всегда является массивом, включая случай `count=1`; пустая очередь возвращает `[]`.
        - Записи, возвращенные этим эндпоинтом, удаляются из очереди.
        - Redis-совместимая очередь usage читает из той же очереди; `LPOP` и `RPOP` также удаляют возвращенные записи.

### Config
- GET `/config` — Получить полный конфиг
- Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/config
      ```
    - Ответ:
      ```json
      {"debug":true,"proxy-url":"","api-keys":["1...5","JS...W"],"quota-exceeded":{"switch-project":true,"switch-preview-model":true},"gemini-api-key":[{"api-key":"AI...01","base-url":"https://generativelanguage.googleapis.com","headers":{"X-Custom-Header":"custom-value"},"proxy-url":"","excluded-models":["gemini-1.5-pro","gemini-1.5-flash"]},{"api-key":"AI...02","proxy-url":"socks5://proxy.example.com:1080","excluded-models":["gemini-pro-vision"]}],"request-log":true,"request-retry":3,"claude-api-key":[{"api-key":"cr...56","base-url":"https://example.com/api","proxy-url":"socks5://proxy.example.com:1080","models":[{"name":"claude-3-5-sonnet-20241022","alias":"claude-sonnet-latest"}],"excluded-models":["claude-3-opus"]},{"api-key":"cr...e3","base-url":"http://example.com:3000/api","proxy-url":""},{"api-key":"sk-...q2","base-url":"https://example.com","proxy-url":""}],"codex-api-key":[{"api-key":"sk...01","base-url":"https://example/v1","proxy-url":"","excluded-models":["gpt-4o-mini"]}],"openai-compatibility":[{"name":"openrouter","base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk...01","proxy-url":""}],"models":[{"name":"moonshotai/kimi-k2:free","alias":"kimi-k2"}]}]}
      ```
```
    - Примечания:
        - Ответ отражает текущую загруженную конфигурацию среды выполнения.
        - Если конфигурация еще не загружена, обработчик возвращает `{}`.

### Latest Version
- GET `/latest-version` — Получить строку версии последнего релиза (без загрузки ассетов)
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/latest-version
      ```
    - Ответ:
      ```json
      { "latest-version": "v1.2.3" }
      ```
    - Примечания:
        - Данные извлекаются из `https://api.github.com/repos/router-for-me/CLIProxyAPI/releases/latest` с `User-Agent: CLIProxyAPI`.
        - Если установлен `proxy-url`, запрос учитывает этот прокси; эндпоинт возвращает только значение версии и не загружает ассеты релиза.

### Debug
- GET `/debug` — Получить текущее состояние отладки
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/debug
- Ответ:
      ```json
      { "debug": false }
      ```
- PUT/PATCH `/debug` — Установить debug (boolean)
    - Запрос:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":true}' \
        http://localhost:8317/v0/management/debug
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```

### Config YAML
- GET `/config.yaml` — Скачать сохраненный YAML файл как есть
    - Заголовки ответа:
        - `Content-Type: application/yaml; charset=utf-8`
        - `Cache-Control: no-store`
    - Тело ответа: необработанный YAML поток с сохранением комментариев/форматирования.
- PUT `/config.yaml` — Заменить конфигурацию YAML документом
    - Запрос:
      ```bash
      curl -X PUT -H 'Content-Type: application/yaml' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        --data-binary @config.yaml \
        http://localhost:8317/v0/management/config.yaml
      ```
- Ответ:
      ```json
      { "ok": true, "changed": ["config"] }
      ```
    - Примечания:
        - Некорректный YAML возвращает `400` с `{ "error": "invalid_yaml", "message": "..." }`; YAML, который разбирается, но не проходит валидацию конфигурации, возвращает `422` с `{ "error": "invalid_config", "message": "..." }`.
        - Ошибки записи возвращают `500` с `{ "error": "write_failed", "message": "..." }`.

### Логирование в файл
- GET `/logging-to-file` — Проверить, включено ли логирование в файл
    - Ответ:
      ```json
      { "logging-to-file": true }
      ```
- PUT/PATCH `/logging-to-file` — Включить или отключить логирование в файл
    - Запрос:
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":false}' \
        http://localhost:8317/v0/management/logging-to-file
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```

### Файлы логов
- GET `/logs` — Стриминг последних строк логов
    - Параметры запроса:
- `after` (опционально): Unix timestamp; возвращаются только строки новее указанного значения.
    - Ответ:
      ```json
      {
        "lines": ["2024-05-20 12:00:00 info request accepted"],
        "line-count": 125,
        "latest-timestamp": 1716206400
      }
      ```
    - Примечания:
        - Требуется включенное логирование в файл; в противном случае возвращается `{ "error": "logging to file disabled" }` с кодом `400`.
        - Если файл логов еще не существует, ответ содержит пустой массив `lines` и `line-count: 0`.
        - `latest-timestamp` — это наибольший извлеченный timestamp из данной выборки; если timestamp не найден, дублируется значение `after` (или `0`), чтобы клиенты могли передавать его обратно без изменений для инкрементального опроса.
        - `line-count` отражает общее количество просканированных строк (включая те, что были отфильтрованы по `after`) и может использоваться для определения поступления новых данных логов.
- DELETE `/logs` — Удаление ротированных файлов логов и очистка активного лога
    - Ответ:
      ```json
      { "success": true, "message": "Logs cleared successfully", "removed": 3 }
      ```
### Логи ошибок запросов
- GET `/request-error-logs` — Список файлов логов ошибок запросов, когда логирование запросов отключено
    - Ответ:
      ```json
      {
        "files": [
          {
            "name": "error-2024-05-20.log",
            "size": 12345,
            "modified": 1716206400
          }
        ]
      }
      ```
    - Примечания:
        - Когда `request-log` включено, этот эндпоинт всегда возвращает пустой список.
        - Файлы ищутся в той же директории логов и должны начинаться с `error-` и заканчиваться на `.log`.
        - `modified` — это время последнего изменения в формате Unix timestamp.
- GET `/request-error-logs/:name` — Скачать конкретный лог ошибок запроса
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -OJ 'http://localhost:8317/v0/management/request-error-logs/error-2024-05-20.log'
      ```
    - Примечания:
- `name` должен быть безопасным именем файла (без `/` или `\`) и соответствовать существующей записи `error-*.log`; в противном случае сервер вернет ошибку валидации или ошибку "не найдено".
- Обработчик выполняет проверку безопасности, чтобы убедиться, что разрешенный путь остается внутри директории логов перед потоковой передачей файла.

### Переключатель статистики использования
- GET `/usage-statistics-enabled` — Проверить, активен ли сбор телеметрии
    - Ответ:
      ```json
      { "usage-statistics-enabled": true }
      ```
- PUT/PATCH `/usage-statistics-enabled` — Включить или отключить сбор
    - Запрос:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":true}' \
        http://localhost:8317/v0/management/usage-statistics-enabled
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```

### URL прокси-сервера
- GET `/proxy-url` — Получить строку URL прокси
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/proxy-url
      ```
- Ответ:
      ```json
      { "proxy-url": "socks5://user:pass@127.0.0.1:1080/" }
      ```
- PUT/PATCH `/proxy-url` — Установить строку URL прокси
    - Запрос (PUT):
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":"socks5://user:pass@127.0.0.1:1080/"}' \
        http://localhost:8317/v0/management/proxy-url
      ```
    - Запрос (PATCH):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":"http://127.0.0.1:8080"}' \
        http://localhost:8317/v0/management/proxy-url
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```
- DELETE `/proxy-url` — Очистить URL прокси
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE http://localhost:8317/v0/management/proxy-url
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```
### Поведение при превышении квоты
- GET `/quota-exceeded/switch-project`
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/quota-exceeded/switch-project
      ```
    - Ответ:
      ```json
      { "switch-project": true }
      ```
- PUT/PATCH `/quota-exceeded/switch-project` — Логическое значение
    - Запрос:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":false}' \
        http://localhost:8317/v0/management/quota-exceeded/switch-project
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```
- GET `/quota-exceeded/switch-preview-model`
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/quota-exceeded/switch-preview-model
      ```
    - Ответ:
      ```json
      { "switch-preview-model": true }
      ```
- PUT/PATCH `/quota-exceeded/switch-preview-model` — Логическое значение
    - Запрос:
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":true}' \
        http://localhost:8317/v0/management/quota-exceeded/switch-preview-model
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```
- POST `/reset-quota` — Очистить состояние маршрутизации quota/cooldown для учетных данных
    - Запрос:
      ```bash
      curl -X POST -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"auth_index":"<AUTH_INDEX>"}' \
        http://localhost:8317/v0/management/reset-quota
      ```
    - Ответ:
      ```json
      {
        "status": "ok",
        "auth_index": "<AUTH_INDEX>",
        "models": ["gpt-5"]
      }
      ```
    - Примечания:
        - `auth_index` — стабильный runtime идентификатор учетных данных, возвращаемый `GET /auth-files`.
        - Этот эндпоинт не принимает имена файлов аутентификации или auth ID.
        - Он очищает runtime состояние quota/cooldown и сразу возвращает учетные данные в маршрутизацию.

### API Keys (авторизация прокси-сервиса)
Эти эндпоинты обновляют встроенный провайдер `config-api-key` внутри раздела `auth.providers` конфигурации. Устаревшие `api-keys` верхнего уровня синхронизируются автоматически.
- GET `/api-keys` — Возвращает полный список
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/api-keys
      ```
    - Ответ:
      ```json
      { "api-keys": ["k1","k2","k3"] }
      ```
- PUT `/api-keys` — Заменяет полный список
    - Запрос:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '["k1","k2","k3"]' \
        http://localhost:8317/v0/management/api-keys
      ```
- Ответ:
      ```json
      { "status": "ok" }
      ```
- PATCH `/api-keys` — Изменить один элемент (`old/new` или `index/value`)
    - Запрос (через `old/new`):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"old":"k2","new":"k2b"}' \
        http://localhost:8317/v0/management/api-keys
      ```
    - Запрос (через `index/value`):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"index":0,"value":"k1b"}' \
        http://localhost:8317/v0/management/api-keys
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```
- DELETE `/api-keys` — Удалить один (`?value=` или `?index=`)
    - Запрос (через `value`):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/api-keys?value=k1'
      ```
- Запрос (по индексу):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/api-keys?index=0'
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```

- GET `/api-key-usage` — Последние bucket'ы запросов, сгруппированные по провайдеру и API key
    - Ответ:
      ```json
      {
        "openai": {
          "https://openrouter.ai/api/v1|k1": {
            "success": 12,
            "failed": 1,
            "recent_requests": [
              { "time": "12:00-12:10", "success": 3, "failed": 0 },
              { "time": "12:10-12:20", "success": 1, "failed": 1 }
            ]
          }
        }
      }
      ```
    - Примечания:
        - Ключи верхнего уровня — имена провайдеров.
        - Ключ второго уровня — `base_url|api_key` (base URL может быть пустым, например `|k1`).
        - `recent_requests` — список фиксированной длины из 20 bucket'ов (10 минут на bucket, локальная метка `HH:MM-HH:MM`).

### Gemini API Key
- GET `/gemini-api-key`
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/gemini-api-key
      ```
    - Ответ:
      ```json
      {
        "gemini-api-key": [
          {"api-key":"AIzaSy...01","auth-index":"a1b2c3d4e5f67890","base-url":"https://generativelanguage.googleapis.com","headers":{"X-Custom-Header":"custom-value"},"proxy-url":"","excluded-models":["gemini-1.5-pro","gemini-1.5-flash"]},
          {"api-key":"AIzaSy...02","auth-index":"b1c2d3e4f5a67890","proxy-url":"socks5://proxy.example.com:1080","excluded-models":["gemini-pro-vision"]}
        ]
      }
      ```
- PUT `/gemini-api-key`
    - Запрос (в формате массива):
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '[{"api-key":"AIzaSy-1","headers":{"X-Custom-Header":"vendor-value"},"excluded-models":["gemini-1.5-flash"]},{"api-key":"AIzaSy-2","base-url":"https://custom.example.com","excluded-models":["gemini-pro-vision"]}]' \
        http://localhost:8317/v0/management/gemini-api-key
      ```
- Ответ:
      ```json
      { "status": "ok" }
      ```
- PATCH `/gemini-api-key`
    - Запрос (обновление по индексу):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"index":0,"value":{"api-key":"AIzaSy-1","base-url":"https://custom.example.com","headers":{"X-Custom-Header":"custom-value"},"proxy-url":"","excluded-models":["gemini-1.5-pro","gemini-pro-vision"]}}' \
        http://localhost:8317/v0/management/gemini-api-key
      ```
    - Запрос (обновление по совпадению api-key):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"match":"AIzaSy-1","value":{"api-key":"AIzaSy-1","headers":{"X-Custom-Header":"custom-value"},"proxy-url":"socks5://proxy.example.com:1080","excluded-models":["gemini-1.5-pro-latest"]}}' \
        http://localhost:8317/v0/management/gemini-api-key
      ```
- Ответ:
      ```json
      { "status": "ok" }
      ```
- DELETE `/gemini-api-key`
    - Запрос (по api-key):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE \
        'http://localhost:8317/v0/management/gemini-api-key?api-key=AIzaSy-1'
      ```
    - Запрос (по индексу):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE \
        'http://localhost:8317/v0/management/gemini-api-key?index=0'
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```
    - Примечания:
        - `excluded-models` является необязательным; сервер приводит к нижнему регистру, обрезает пробелы, удаляет дубликаты и пустые записи перед сохранением.

### Codex API KEY (массив объектов)
- GET `/codex-api-key` — Список всех
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/codex-api-key
      ```
    - Ответ:
      ```json
      { "codex-api-key": [ { "api-key": "sk-a", "base-url": "https://codex.example.com/v1", "proxy-url": "socks5://proxy.example.com:1080", "headers": { "X-Team": "cli" }, "excluded-models": ["gpt-4o-mini"] } ] }
      ```
- PUT `/codex-api-key` — Заменить список
    - Запрос:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '[{"api-key":"sk-a","base-url":"https://codex.example.com/v1","proxy-url":"socks5://proxy.example.com:1080","headers":{"X-Team":"cli"},"excluded-models":["gpt-4o-mini","gpt-4.1-mini"]},{"api-key":"sk-b","base-url":"https://custom.example.com","proxy-url":"","headers":{"X-Env":"prod"},"excluded-models":["gpt-3.5-turbo"]}]' \
        http://localhost:8317/v0/management/codex-api-key
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```
- PATCH `/codex-api-key` — Изменить один (по `index` или `match`)
    - Запрос (по index):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"index":1,"value":{"api-key":"sk-b2","base-url":"https://c.example.com","proxy-url":"","headers":{"X-Env":"stage"},"excluded-models":["gpt-3.5-turbo-instruct"]}}' \
        http://localhost:8317/v0/management/codex-api-key
      ```
- Запрос (по совпадению):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"match":"sk-a","value":{"api-key":"sk-a","base-url":"https://codex.example.com/v1","proxy-url":"socks5://proxy.example.com:1080","headers":{"X-Team":"cli"},"excluded-models":["gpt-4o-mini","gpt-4.1"]}}' \
        http://localhost:8317/v0/management/codex-api-key
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```
- DELETE `/codex-api-key` — Удалить один (`?api-key=` или `?index=`)
    - Запрос (по api-key):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/codex-api-key?api-key=sk-b2'
      ```
    - Запрос (по индексу):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/codex-api-key?index=0'
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```
- Примечания:
        - `base-url` обязателен; передача пустого `base-url` в PUT/PATCH удаляет запись.
        - `headers` позволяет прикреплять пользовательские HTTP-заголовки для каждого ключа. Пустые ключи/значения удаляются автоматически.
        - `excluded-models` принимает идентификаторы моделей для блокировки у этого провайдера; сервер приводит их к нижнему регистру, удаляет лишние пробелы, исключает дубликаты и отбрасывает пустые записи.

### Request Retry Count
- GET `/request-retry` — Получить целое число
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/request-retry
      ```
    - Ответ:
      ```json
      { "request-retry": 3 }
      ```
- PUT/PATCH `/request-retry` — Установить целое число
    - Запрос:
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":5}' \
        http://localhost:8317/v0/management/request-retry
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```
### Max Retry Interval
- GET `/max-retry-interval` — Получить максимальный интервал повторных попыток в секундах
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/max-retry-interval
      ```
    - Ответ:
      ```json
      { "max-retry-interval": 30 }
      ```
- PUT/PATCH `/max-retry-interval` — Установить максимальный интервал повторных попыток в секундах
    - Запрос:
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":60}' \
        http://localhost:8317/v0/management/max-retry-interval
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```

### Request Log
- GET `/request-log` — Получить логическое значение (boolean)
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/request-log
      ```
    - Ответ:
      ```json
      { "request-log": false }
      ```
- PUT/PATCH `/request-log` — Установить логическое значение
    - Запрос:
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":true}' \
        http://localhost:8317/v0/management/request-log
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```

### WebSocket Authentication (`ws-auth`)
- GET `/ws-auth` — Проверить, требует ли WebSocket-шлюз аутентификацию
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/ws-auth
      ```
    - Ответ:
      ```json
      { "ws-auth": true }
      ```
- PUT/PATCH `/ws-auth` — Включить или отключить аутентификацию для эндпоинтов `/ws/*`
    - Запрос:
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"value":false}' \
        http://localhost:8317/v0/management/ws-auth
      ```
```
    - Ответ:
      ```json
      { "status": "ok" }
      ```
    - Примечания:
        - При переключении с `false` → `true` сервер завершает все существующие WebSocket-сессии, чтобы при повторном подключении требовались валидные учетные данные API.
        - Отключение аутентификации оставляет текущие сессии нетронутыми, но будущие подключения будут пропускать auth middleware до тех пор, пока она не будет включена снова.

### Claude API KEY (массив объектов)
- GET `/claude-api-key` — Список всех
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/claude-api-key
      ```
    - Ответ:
      ```json
      { "claude-api-key": [ { "api-key": "sk-a", "base-url": "https://example.com/api", "proxy-url": "socks5://proxy.example.com:1080", "headers": { "X-Workspace": "team-a" }, "excluded-models": ["claude-3-opus"] } ] }
      ```
- PUT `/claude-api-key` — Заменить список
    - Запрос:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '[{"api-key":"sk-a","proxy-url":"socks5://proxy.example.com:1080","headers":{"X-Workspace":"team-a"},"excluded-models":["claude-3-opus"]},{"api-key":"sk-b","base-url":"https://c.example.com","proxy-url":"","headers":{"X-Env":"prod"},"excluded-models":["claude-3-sonnet","claude-3-5-haiku"]}]' \
        http://localhost:8317/v0/management/claude-api-key
      ```
- Ответ:
      ```json
      { "status": "ok" }
      ```
- PATCH `/claude-api-key` — Изменить один (по `index` или `match`)
    - Запрос (по index):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
          -d '{"index":1,"value":{"api-key":"sk-b2","base-url":"https://c.example.com","proxy-url":"","headers":{"X-Env":"stage"},"excluded-models":["claude-3.7-sonnet"]}}' \
          http://localhost:8317/v0/management/claude-api-key
        ```
    - Запрос (по match):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
          -d '{"match":"sk-a","value":{"api-key":"sk-a","base-url":"","proxy-url":"socks5://proxy.example.com:1080","headers":{"X-Workspace":"team-a"},"excluded-models":["claude-3-opus","claude-3.5-sonnet"]}}' \
          http://localhost:8317/v0/management/claude-api-key
        ```
- Ответ:
      ```json
      { "status": "ok" }
      ```
- DELETE `/claude-api-key` — Удалить один (`?api-key=` или `?index=`)
    - Запрос (по api-key):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/claude-api-key?api-key=sk-b2'
      ```
    - Запрос (по индексу):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/claude-api-key?index=0'
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```
    - Примечания:
        - `headers` необязателен; пустые пары удаляются автоматически. Чтобы удалить заголовок, просто не указывайте его в данных обновления.
        - `excluded-models` позволяет блокировать определенные модели Claude для ключа; сервер приводит к нижнему регистру, обрезает пробелы, удаляет дубликаты и пустые записи.

### OpenAI Compatibility Providers (массив объектов)
- GET `/openai-compatibility` — Список всех
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/openai-compatibility
      ```
    - Ответ:
      ```json
      {
        "openai-compatibility": [
          {
            "name": "openrouter",
            "disabled": false,
            "base-url": "https://openrouter.ai/api/v1",
            "api-key-entries": [
              { "api-key": "sk", "proxy-url": "", "auth-index": "a1b2c3d4e5f67890" }
            ],
            "models": [],
            "headers": { "X-Provider": "openrouter" }
          }
        ]
      }
      ```
- PUT `/openai-compatibility` — Заменить список
    - Запрос:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '[{"name":"openrouter","base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk","proxy-url":""}],"models":[{"name":"m","alias":"a"}],"headers":{"X-Provider":"openrouter"}}]' \
        http://localhost:8317/v0/management/openai-compatibility
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```
- PATCH `/openai-compatibility` — Изменить один элемент (по `index` или `name`)
    - Запрос (по имени):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"name":"openrouter","value":{"name":"openrouter","disabled":false,"base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk","proxy-url":""}],"models":[],"headers":{"X-Provider":"openrouter"}}}' \
        http://localhost:8317/v0/management/openai-compatibility
      ```
- Запрос (по индексу):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"index":0,"value":{"name":"openrouter","disabled":false,"base-url":"https://openrouter.ai/api/v1","api-key-entries":[{"api-key":"sk","proxy-url":""}],"models":[],"headers":{"X-Provider":"openrouter"}}}' \
        http://localhost:8317/v0/management/openai-compatibility
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```

    - Примечания:
        - Устаревший ввод `api-keys` по-прежнему принимается; ключи автоматически переносятся в `api-key-entries`, поэтому устаревшее поле со временем будет оставаться пустым в ответах.
        - `disabled: true` отключает провайдера без удаления из конфигурации; маршрутизация/выбор ключа пропускают его.
        - `headers` позволяет определять HTTP-заголовки для всего провайдера; пустые ключи/значения отбрасываются.
        - Провайдеры без `base-url` удаляются. Отправка PATCH с `base-url`, установленным в пустую строку, удаляет этого провайдера.
- DELETE `/openai-compatibility` — Удалить (`?name=` или `?index=`)
- Запрос (по имени):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/openai-compatibility?name=openrouter'
      ```
    - Запрос (по индексу):
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/openai-compatibility?index=0'
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```

### OAuth Excluded Models
Настройте блоки моделей для отдельных провайдеров для OAuth-провайдеров. Ключи — это идентификаторы провайдеров, значения — массивы строк с именами моделей для исключения.

- GET `/oauth-excluded-models` — Получить текущую карту
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/oauth-excluded-models
      ```
    - Ответ:
      ```json
      {
        "oauth-excluded-models": {
          "openai": ["gpt-4.1-mini"],
          "claude": ["claude-3-5-haiku-20241022"]
        }
      }
      ```
- PUT `/oauth-excluded-models` — Заменить карту целиком
    - Запрос:
      ```bash
      curl -X PUT -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"openai":["gpt-4.1-mini"],"claude":["claude-3-5-haiku-20241022"]}' \
        http://localhost:8317/v0/management/oauth-excluded-models
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```
    - Примечания:
        - Тело запроса также может быть обернуто в `{ "items": { ... } }`; в обоих случаях пустые имена моделей удаляются.
- PATCH `/oauth-excluded-models` — Обновить (upsert) или удалить запись для одного provider
    - Запрос (upsert):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"provider":"claude","models":["claude-3-5-haiku-20241022"]}' \
        http://localhost:8317/v0/management/oauth-excluded-models
      ```
- Запрос (удаление провайдера путем отправки пустого списка моделей):
      ```bash
      curl -X PATCH -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d '{"provider":"claude","models":[]}' \
        http://localhost:8317/v0/management/oauth-excluded-models
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```
    - Примечания:
        - `provider` нормализуется к нижнему регистру. Отправка пустого списка `models` удаляет этого провайдера; если провайдер не существует, возвращается `404`.
- DELETE `/oauth-excluded-models` — Удалить все модели для провайдера
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -X DELETE 'http://localhost:8317/v0/management/oauth-excluded-models?provider=claude'
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```

### Auth File Management

Управление JSON-файлами токенов в `auth-dir`: просмотр списка, скачивание, загрузка, удаление.
- GET `/auth-files` — Список
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/auth-files
      ```
    - Ответ (когда доступен runtime auth manager):
      ```json
      {
        "files": [
          {
            "id": "claude-user@example.com",
            "auth_index": "a1b2c3d4e5f67890",
            "name": "claude-user@example.com.json",
            "provider": "claude",
            "label": "Claude Prod",
            "status": "ready",
            "status_message": "ok",
            "disabled": false,
            "unavailable": false,
            "runtime_only": false,
            "source": "file",
            "path": "/abs/path/auths/claude-user@example.com.json",
            "size": 2345,
            "modtime": "2025-08-30T12:34:56Z",
            "success": 12,
            "failed": 1,
            "recent_requests": [
              { "time": "12:00-12:10", "success": 3, "failed": 0 },
              { "time": "12:10-12:20", "success": 1, "failed": 1 }
            ],
            "email": "user@example.com",
            "account_type": "anthropic",
            "account": "workspace-1",
            "created_at": "2025-08-30T12:00:00Z",
            "updated_at": "2025-08-31T01:23:45Z",
            "last_refresh": "2025-08-31T01:23:45Z"
          }
        ]
      }
      ```
- Примечания:
    - Записи сортируются без учета регистра по `name`. `status`, `status_message`, `disabled` и `unavailable` дублируют состояние runtime auth manager, чтобы вы могли видеть, исправны ли учетные данные.
    - `runtime_only: true` указывает на то, что учетные данные существуют только в памяти (например, бэкенды Git/Postgres/ObjectStore); `source` меняется на `memory`. Когда файл `.json` существует на диске, `source=file`, и ответ включает `path`/`size`/`modtime`.
    - `auth_index` — стабильный runtime идентификатор учетных данных (полезен для `/api-call` и корреляции запросов).
    - `success`/`failed` — накопительные счетчики (в памяти).
    - `recent_requests` — список фиксированной длины из 20 bucket'ов (10 минут на bucket, локальная метка `HH:MM-HH:MM`).
    - `email`, `account_type`, `account` и `last_refresh` извлекаются из метаданных JSON (таких ключей, как `last_refresh`, `lastRefreshedAt`, `last_refreshed_at` и т. д.).
    - Если runtime auth manager недоступен, обработчик переходит к сканированию `auth-dir`, возвращая только `name`, `size`, `modtime`, `type` и `email`.
    - Записи `runtime_only` нельзя скачать или удалить через эндпоинты файлов — их необходимо отозвать у вышестоящего провайдера или через другой API.
- GET `/auth-files/download?name=<file.json>` — Скачивание одного файла
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -OJ 'http://localhost:8317/v0/management/auth-files/download?name=acc1.json'
      ```
    - Примечания:
        - `name` должен быть именем файла `.json`. Только записи с `source=file` имеют соответствующий файл для экспорта; учетные данные `runtime_only` нельзя скачать.

- POST `/auth-files` — Загрузка
    - Запрос (multipart):
      ```bash
      curl -X POST -F 'file=@/path/to/acc1.json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/auth-files
      ```
    - Запрос (raw JSON):
      ```bash
      curl -X POST -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -d @/path/to/acc1.json \
        'http://localhost:8317/v0/management/auth-files?name=acc1.json'
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```
- Примечания:
    - Основной auth manager должен быть активен; в противном случае API возвращает `503` с `{ "error": "core auth manager unavailable" }`.
    - Как при multipart, так и при загрузке необработанного JSON необходимо использовать имена файлов, заканчивающиеся на `.json`; в случае успеха учетные данные немедленно регистрируются в runtime auth manager.

- DELETE `/auth-files?name=<file.json>` — Удаление одного файла
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/auth-files?name=acc1.json'
      ```
    - Ответ:
      ```json
      { "status": "ok" }
      ```
    - Примечания:
        - Удаляются только файлы `.json` на диске; после успешного удаления runtime manager получает команду отключить соответствующие учетные данные. Записи `runtime_only` не затрагиваются.

- DELETE `/auth-files?all=true` — Удаление всех файлов `.json` в `auth-dir`
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -X DELETE 'http://localhost:8317/v0/management/auth-files?all=true'
      ```
- Ответ:
      ```json
      { "status": "ok", "deleted": 3 }
      ```
    - Примечания:
        - Учитываются и удаляются только файлы на диске; каждое успешное удаление также инициирует вызов отключения в runtime менеджере аутентификации. Записи, находящиеся исключительно в памяти, остаются нетронутыми.

### Импорт учетных данных Vertex
Дублирует функционал помощника CLI `vertex-import` и сохраняет JSON сервисного аккаунта Google как файлы `vertex-<project>.json` внутри `auth-dir`.

- POST `/vertex/import` — Загрузка ключа сервисного аккаунта Vertex
    - Запрос (multipart):
      ```bash
      curl -X POST \
        -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        -F 'file=@/path/to/my-project-sa.json' \
        -F 'location=us-central1' \
        http://localhost:8317/v0/management/vertex/import
      ```
    - Ответ:
      ```json
      {
        "status": "ok",
        "auth-file": "/abs/path/auths/vertex-my-project.json",
        "project_id": "my-project",
        "email": "svc@my-project.iam.gserviceaccount.com",
        "location": "us-central1"
      }
      ```
- Примечания:
    - Загрузки должны отправляться как `multipart/form-data` с использованием поля `file`. Полезная нагрузка валидируется, а `private_key` нормализуется; некорректный JSON или отсутствие `project_id` возвращает ошибку `400`.
    - Необязательное поле формы (или запроса) `location` переопределяет регион по умолчанию `us-central1`, записанный в метаданных учетных данных.
    - Обработчик сохраняет учетные данные через то же хранилище токенов, что и другие загрузки аутентификации; сбои возвращают `500` с `{ "error": "save_failed", ... }`.

### URL-адреса Login/OAuth

Эти эндпоинты инициируют процессы входа провайдера и возвращают URL для открытия в браузере. Токены сохраняются в `auths/` после завершения процесса.

Для Anthropic, Codex и Antigravity вы можете добавить `?is_webui=true`, чтобы повторно использовать встроенный пересыльщик обратного вызова при запуске из управления Web UI.

- GET `/anthropic-auth-url` — Запуск входа Anthropic (Claude)
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/anthropic-auth-url
      ```
- Ответ:
      ```json
      { "status": "ok", "url": "https://...", "state": "anth-1716206400" }
      ```
    - Примечания:
        - Добавьте `?is_webui=true` при вызове из встроенного Web UI, чтобы повторно использовать локальный сервис обратного вызова.

- GET `/codex-auth-url` — Запуск входа в Codex
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/codex-auth-url
      ```
    - Ответ:
      ```json
      { "status": "ok", "url": "https://...", "state": "codex-1716206400" }
      ```

- GET `/antigravity-auth-url` — Запуск входа в Antigravity
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        http://localhost:8317/v0/management/antigravity-auth-url
      ```
    - Ответ:
      ```json
      { "status": "ok", "url": "https://...", "state": "ant-1716206400" }
      ```
    - Примечания:
        - Добавьте `?is_webui=true` при запуске из встроенного Web UI, чтобы сервер запустил временный локальный перенаправитель обратного вызова (callback forwarder) на порту `51121` и повторно использовал основной HTTP-порт для финального перенаправления.

- GET `/get-auth-status?state=<state>` — Опрос статуса процесса OAuth
    - Запрос:
      ```bash
      curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
        'http://localhost:8317/v0/management/get-auth-status?state=<STATE_FROM_AUTH_URL>'
      ```
    - Примеры ответов:
      ```json
      { "status": "wait" }
      ```
      ```json
      { "status": "ok" }
```json
      { "status": "error", "error": "Authentication failed" }
      ```
    - Примечания:
        - Параметр запроса `state` должен соответствовать значению, возвращенному эндпоинтом login. Как только поток достигает `status: "ok"` или `status: "error"`, сервер удаляет state; последующие опросы получают `{ "status": "ok" }` для сигнализации о завершении.
        - `status: "wait"` указывает на то, что поток все еще ожидает callback или обмен токенами — продолжайте опрос по мере необходимости.

### Плагины

- GET `/plugins` — Список обнаруженных, настроенных и зарегистрированных плагинов. Ответ содержит `plugins_enabled`, `plugins_dir` и состояние каждого плагина: `id`, `path`, `configured`, `registered`, `enabled`, `effective_enabled`, OAuth-поддержку, метаданные, поля конфигурации и меню.
- GET `/plugins/:id/config` — Возвращает сохраненный объект `plugins.configs.<id>`; для плагина без сохраненной конфигурации возвращается `{}`.
- PUT `/plugins/:id/config` — Полностью заменяет объект конфигурации.
- PATCH `/plugins/:id/config` — Выполняет неглубокое слияние; поле со значением `null` удаляет поле верхнего уровня.
- PATCH `/plugins/:id/enabled` — Изменяет только флаг включения. Запрос: `{ "enabled": true }`.
- DELETE `/plugins/:id` — Удаляет локальный файл и сохраненную конфигурацию. Для загруженного плагина, который нельзя выгрузить, возвращается `409` с `restart_required: true`.
- GET `/plugin-store` — Список плагинов из настроенных источников магазина, включая ошибки источников, состояние установки, источник установленного плагина и наличие обновления.
- POST `/plugin-store/:id/install` — Загружает или обновляет плагин, включает его в конфигурации и возвращает путь и версию. При одинаковых ID укажите источник через `?source=<source-id>`; `version` можно передать в query или в теле (`{ "version": "1.2.3" }`).

ID плагина должен соответствовать правилам хоста. Установка из магазина может загрузить исполняемые артефакты; используйте только доверенные источники.

### Дополнительные настройки среды выполнения и логи

Все PUT/PATCH-эндпоинты этого раздела используют `{ "value": ... }` и возвращают `{ "status": "ok" }`.

- GET/PUT/PATCH `/logs-max-total-size-mb` — Максимальный суммарный размер логов в MiB; отрицательное значение сохраняется как `0`.
- GET/PUT/PATCH `/error-logs-max-files` — Количество сохраняемых файлов логов ошибок запросов; отрицательное значение заменяется на `10`.
- GET/PUT/PATCH `/force-model-prefix` — Логический переключатель принудительного использования настроенных префиксов моделей.
- GET/PUT/PATCH `/routing/strategy` — Стратегия выбора учетных данных: `round-robin` (также `roundrobin`/`rr`) или `fill-first` (также `fillfirst`/`ff`). GET возвращает `{ "strategy": "..." }`.
- GET `/logs` также поддерживает `limit` и непрозрачный `cursor`. При `limit` без `after` возвращаются последние строки; передайте `next-cursor` как `cursor` для инкрементального чтения. При сбросе курсора ответ содержит `cursor-reset: true`.
- GET `/request-log-by-id/:id` — Скачивает лог запроса, имя которого заканчивается на `-<id>.log`. ID не должен содержать разделителей пути.

### Дополнительные коллекции API Key провайдеров

`/interactions-api-key`, `/xai-api-key` и `/vertex-api-key` поддерживают GET, PUT, PATCH и DELETE. GET возвращает объект с ключом, равным имени эндпоинта, и runtime `auth-index`, когда это применимо. PUT принимает массив или `{ "items": [ ... ] }`; PATCH использует `{ "index": 0, "value": { ... } }` или `{ "match": "<api-key>", "value": { ... } }`; DELETE принимает `?index=` или `?api-key=` (для повторяющегося ключа добавьте `&base-url=`).

- `/interactions-api-key` настраивает Google Interactions API key. Поля записи: `api-key`, `priority`, `prefix`, `base-url`, `proxy-url`, `models`, `headers`, `excluded-models`, `disable-cooling`.
- `/xai-api-key` настраивает нативные xAI API key. Используется структура Codex key, также поддерживаются `priority`, `websockets` и `disable-cooling`; для сохраняемых записей нужен `base-url`, а пустой `base-url` в PATCH удаляет запись.
- `/vertex-api-key` настраивает Vertex-совместимые API key. PUT требует `api-key`; необязательны `priority`, `prefix`, `base-url`, `proxy-url`, `headers`, `models`, `excluded-models`. Модели используют `name`, `alias`, необязательные `display-name` и `force-mapping`. Пустой `api-key` или `base-url` в PATCH удаляет запись.

### OAuth-псевдонимы моделей

- GET `/oauth-model-alias` — Возвращает `{ "oauth-model-alias": { "<channel>": [ ... ] } }`.
- PUT `/oauth-model-alias` — Полностью заменяет карту channel-to-alias; тело можно обернуть в `{ "items": { ... } }`.
- PATCH `/oauth-model-alias` — Заменяет один channel: `{ "channel": "codex", "aliases": [{ "name": "upstream", "alias": "client-name", "fork": false, "display-name": "Client Name", "force-mapping": true }] }`. `provider` принимается вместо `channel`; пустой список удаляет существующий channel.
- DELETE `/oauth-model-alias?channel=codex` — Удаляет один channel; в query также допустимо имя `provider`.

### Расширения управления файлами аутентификации

- GET `/auth-files/models?name=<name-or-auth-id>` — Возвращает поддерживаемые учетными данными модели: `{ "models": [...] }`.
- GET `/model-definitions/:channel` — Возвращает статические метаданные каталога: `{ "channel": "...", "models": [...] }`; неизвестный channel возвращает `400`. Без обязательного сегмента пути `:channel` маршрут не совпадает и возвращает `404`.
- PATCH `/auth-files/status` — Включает или отключает запись: `{ "name": "<file-name-or-id>", "disabled": true }`. Настроенные API key отключаются через `excluded-models`; виртуальные дочерние учетные записи плагинов нельзя менять независимо.
- PATCH `/auth-files/fields` — Обновляет метаданные по имени файла или auth ID. Передайте `name` и хотя бы одно поле; точечные пути обновляют вложенные значения, например `{ "name": "acc.json", "project_id": "my-project", "headers.X-Team": "prod" }`. Объект `headers` объединяется с существующими заголовками, а пустое значение удаляет заголовок.

### Исходящие вызовы с учетными данными

- POST `/api-call` — Выполняет исходящий HTTP-запрос и при необходимости использует учетные данные из `auth_index` (также принимаются `authIndex` и `AuthIndex`). Поля: `method`, абсолютный `url`, необязательная строковая карта `header` и необязательный raw-строковый `data`.
- Используйте `$TOKEN$` в заголовке для подстановки access token или API key выбранных учетных данных. Прокси конкретных учетных данных имеет приоритет над глобальным `proxy-url`; иначе используется прямое подключение. Ответ: `{ "status_code": 200, "header": { ... }, "body": "..." }`, а статус upstream сохраняется в `status_code`.

Этот эндпоинт может выполнять произвольные исходящие запросы с настроенными учетными данными. Строго ограничьте доступ к ключу управления.

### Дополнительные OAuth-потоки и callback

- GET `/kimi-auth-url` и GET `/xai-auth-url` запускают device-code потоки. Оба возвращают `status`, `url`, `state`, `flow: "device"` и при необходимости `user_code`/`expires_in`.
- DELETE `/oauth-session?state=<state>` отменяет ожидающий OAuth-сеанс: `{ "status": "ok", "cancelled": true|false }`. Отмененный поток не сохраняет учетные данные.
- GET/POST `/oauth-callback` принимает OAuth callback вне группы маршрутов с аутентификацией. GET использует `provider`, `state`, `code`, `error`/`error_description`; POST принимает `{ "provider", "redirect_url", "code", "state", "error" }`. `redirect_url` может передать query callback. Callback принимается только для валидного ожидающего state с совпадающим provider.
- `GET /get-auth-status?state=...` возвращает `wait` для ожидающего сеанса, `ok` после завершения и `error` при сбое, отмене, истечении или неизвестном state. Завершенные state короткое время сохраняются, чтобы клиент мог получить `ok`.

### Примеры новых эндпоинтов

Во всех примерах ниже, кроме неаутентифицированных примеров `/oauth-callback`, требуется `Authorization: Bearer <MANAGEMENT_KEY>`.

#### Плагины

- Список локальных плагинов:
  ```bash
  curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
    http://localhost:8317/v0/management/plugins
  ```
  ```json
  {
    "plugins_enabled": true,
    "plugins_dir": "/abs/path/plugins",
    "plugins": [{
      "id": "example-plugin", "path": "/abs/path/plugins/example-plugin.so",
      "configured": true, "registered": true, "enabled": true,
      "effective_enabled": true, "supports_oauth": false,
      "oauth_provider": "", "logo": "", "config_fields": [], "menus": [],
      "metadata": { "name": "Example", "version": "1.0.0", "author": "Example", "github_repository": "", "logo": "", "config_fields": [] }
    }]
  }
  ```
- Чтение, замена, patch, включение и удаление конфигурации плагина:
  ```bash
  curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
    http://localhost:8317/v0/management/plugins/example-plugin/config
  # {"enabled":true,"priority":10,"endpoint":"https://plugin.example.com"}

  curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' \
    -d '{"enabled":true,"priority":10,"endpoint":"https://plugin.example.com"}' \
    http://localhost:8317/v0/management/plugins/example-plugin/config
  # {"status":"ok"}

  curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' \
    -d '{"priority":20,"endpoint":null}' \
    http://localhost:8317/v0/management/plugins/example-plugin/config
  # {"status":"ok"}

  curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' \
    -d '{"enabled":false}' http://localhost:8317/v0/management/plugins/example-plugin/enabled
  # {"status":"ok"}
  ```
  ```bash
  curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
    http://localhost:8317/v0/management/plugins/example-plugin
  ```
  ```json
  { "status": "deleted", "id": "example-plugin", "path": "/abs/path/plugins/example-plugin.so", "file_deleted": true, "configured_removed": true, "restart_required": false }
  ```
- Список и установка из магазина плагинов:
  ```bash
  curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/plugin-store
  ```
  ```json
  { "plugins_enabled": true, "plugins_dir": "/abs/path/plugins", "sources": [{"id":"official","name":"Official","url":"https://example.com/registry.json"}], "plugins": [{"store_id":"official/example-plugin","source_id":"official","source_name":"Official","source_url":"https://example.com/registry.json","id":"example-plugin","name":"Example","description":"Example plugin","author":"Example","version":"1.2.3","repository":"example/example-plugin","install_type":"github-release","auth_required":false,"auth_configured":true,"installed":false,"installed_version":"","path":"","configured":false,"registered":false,"enabled":false,"effective_enabled":false,"update_available":false}] }
  ```
  ```bash
  curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' \
    -d '{"version":"1.2.3"}' 'http://localhost:8317/v0/management/plugin-store/example-plugin/install?source=official'
  ```
  ```json
  { "status": "installed", "source_id": "official", "source_name": "Official", "source_url": "https://example.com/registry.json", "id": "example-plugin", "version": "1.2.3", "install_type": "github-release", "path": "/abs/path/plugins/example-plugin.so", "plugins_enabled": true, "restart_required": false }
  ```

#### Настройки среды выполнения и логи

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/logs-max-total-size-mb
# {"logs-max-total-size-mb":512}
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"value":20}' http://localhost:8317/v0/management/error-logs-max-files
# {"status":"ok"}
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"value":true}' http://localhost:8317/v0/management/force-model-prefix
# {"status":"ok"}
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"value":"fill-first"}' http://localhost:8317/v0/management/routing/strategy
# {"status":"ok"}
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/logs?limit=2'
```
```json
{ "lines": ["2026-05-05 12:00:00 info request accepted"], "line-count": 1, "latest-timestamp": 1777982400, "next-cursor": "<OPAQUE_CURSOR>" }
```
```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/logs?cursor=<OPAQUE_CURSOR>&limit=100'
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' -OJ http://localhost:8317/v0/management/request-log-by-id/req_123
```

#### Коллекции API Key провайдеров

Следующие примеры показывают все методы коллекций. Подставьте эндпоинт и структуру key нужного провайдера.

```bash
# Interactions: GET, PUT, PATCH, DELETE
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/interactions-api-key
# {"interactions-api-key":[{"api-key":"AIza...","auth-index":"a1b2","base-url":"https://generativelanguage.googleapis.com","excluded-models":[]}]}
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '[{"api-key":"AIza...","priority":10,"prefix":"team/","base-url":"https://generativelanguage.googleapis.com","proxy-url":"","models":[],"headers":{"X-Team":"prod"},"excluded-models":["gemini-2.0-flash"],"disable-cooling":true}]' http://localhost:8317/v0/management/interactions-api-key
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"index":0,"value":{"proxy-url":"socks5://127.0.0.1:1080"}}' http://localhost:8317/v0/management/interactions-api-key
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/interactions-api-key?api-key=AIza...&base-url=https%3A%2F%2Fgenerativelanguage.googleapis.com'
# Каждое изменение возвращает: {"status":"ok"}

# xAI: GET, PUT, PATCH, DELETE
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/xai-api-key
# {"xai-api-key":[{"api-key":"xai...","auth-index":"c3d4","base-url":"https://api.x.ai/v1","websockets":true}]}
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '[{"api-key":"xai...","priority":10,"prefix":"xai/","base-url":"https://api.x.ai/v1","websockets":true,"proxy-url":"","models":[{"name":"grok-3","alias":"grok"}],"headers":{},"excluded-models":[],"disable-cooling":false}]' http://localhost:8317/v0/management/xai-api-key
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"match":"xai...","value":{"websockets":false}}' http://localhost:8317/v0/management/xai-api-key
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/xai-api-key?index=0'
# Каждое изменение возвращает: {"status":"ok"}

# Vertex-совместимый: GET, PUT, PATCH, DELETE
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/vertex-api-key
# {"vertex-api-key":[{"api-key":"vertex...","auth-index":"e5f6","base-url":"https://vertex.example.com"}]}
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '[{"api-key":"vertex...","priority":10,"prefix":"vertex/","base-url":"https://vertex.example.com","proxy-url":"","headers":{},"models":[{"name":"gemini-2.5-pro","alias":"vertex-gemini","display-name":"Vertex Gemini","force-mapping":true}],"excluded-models":[]}]' http://localhost:8317/v0/management/vertex-api-key
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"match":"vertex...","value":{"headers":{"X-Team":"prod"}}}' http://localhost:8317/v0/management/vertex-api-key
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/vertex-api-key?index=0'
# Каждое изменение возвращает: {"status":"ok"}
```

#### OAuth-псевдонимы, файлы аутентификации и исходящие вызовы

```bash
# OAuth-псевдонимы моделей: GET, PUT, PATCH, DELETE
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/oauth-model-alias
# {"oauth-model-alias":{"codex":[{"name":"gpt-5","alias":"gpt-5-fast","fork":true,"display-name":"GPT-5 Fast","force-mapping":true}]}}
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"codex":[{"name":"gpt-5","alias":"gpt-5-fast","fork":true,"display-name":"GPT-5 Fast","force-mapping":true}]}' http://localhost:8317/v0/management/oauth-model-alias
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"channel":"codex","aliases":[{"name":"gpt-5","alias":"gpt-5-fast"}]}' http://localhost:8317/v0/management/oauth-model-alias
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/oauth-model-alias?channel=codex'
# Каждое изменение возвращает: {"status":"ok"}

# Модели учетных данных, статические определения, статус и метаданные
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/auth-files/models?name=codex-user.json'
# {"models":[{"id":"gpt-5","display_name":"GPT-5","type":"model","owned_by":"openai"}]}
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/model-definitions/codex
# {"channel":"codex","models":[...]}
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"name":"codex-user.json","disabled":true}' http://localhost:8317/v0/management/auth-files/status
# {"status":"ok","disabled":true}
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"name":"codex-user.json","project_id":"my-project","headers.X-Team":"prod"}' http://localhost:8317/v0/management/auth-files/fields
# {"status":"ok"}

# Исходящий запрос с учетными данными
curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' -H 'Content-Type: application/json' -d '{"auth_index":"a1b2","method":"GET","url":"https://api.example.com/v1/ping","header":{"Authorization":"Bearer $TOKEN$"}}' http://localhost:8317/v0/management/api-call
# {"status_code":200,"header":{"Content-Type":["application/json"]},"body":"{\"ok\":true}"}
```

#### Device OAuth и callback

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/kimi-auth-url
# {"status":"ok","url":"https://...","state":"kmi-...","flow":"device","user_code":"ABCD-EFGH","expires_in":900}
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' http://localhost:8317/v0/management/xai-auth-url
# {"status":"ok","url":"https://...","state":"xai-...","flow":"device","user_code":"ABCD-EFGH","expires_in":1800}
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/get-auth-status?state=xai-...'
# {"status":"wait"}
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' 'http://localhost:8317/v0/management/oauth-session?state=xai-...'
# {"status":"ok","cancelled":true}

# Callback-маршруты не используют middleware ключа управления; их защищает проверка state.
curl 'http://localhost:8317/v0/management/oauth-callback?provider=codex&state=codex-...&code=AUTHORIZATION_CODE'
# {"status":"ok"}
curl -X POST -H 'Content-Type: application/json' -d '{"provider":"codex","state":"codex-...","code":"AUTHORIZATION_CODE"}' http://localhost:8317/v0/management/oauth-callback
# {"status":"ok"}
```

## Ответы об ошибках

Общий формат ошибок:
- 400 Bad Request: `{ "error": "invalid body" }`
- 401 Unauthorized: `{ "error": "missing management key" }` или `{ "error": "invalid management key" }`
- 403 Forbidden: `{ "error": "remote management disabled" }`
- 404 Not Found: `{ "error": "item not found" }` или `{ "error": "file not found" }`
- 422 Unprocessable Entity: `{ "error": "invalid_config", "message": "..." }`
- 500 Internal Server Error: `{ "error": "failed to save config: ..." }`
- 503 Service Unavailable: `{ "error": "core auth manager unavailable" }`

## Примечания

- Изменения записываются обратно в YAML-файл конфигурации и обновляются через hot-reloading с помощью file watcher и клиентов.
- remote-management.allow-remote и remote-management.secret-key не могут быть изменены через API; настройте их в файле конфигурации.
