---
outline: 'deep'
---

# Management API v8

Базовый путь: `http://localhost:8317/v8/management`

Это API конфигурации и операций для макета v8. Пути конфигурации повторяют дерево YAML v8, описанное в [опциях конфигурации](../configuration/options). Успешная запись конфигурации сохраняет файл, и сервис применяет его через hot reload.

`/v0/management` остается доступным для существующих клиентов, но близок к устареванию. Не создавайте новую функциональность на основе этого API.

## Аутентификация

- Каждый запрос, кроме callback OAuth, должен содержать действительный ключ управления, включая запросы с localhost.
- Удаленный доступ требует `management.allow-remote: true`. Пока запись v8 не мигрировала файл, старое имя `remote-management.allow-remote` продолжает работать.
- Отправьте открытый ключ одним из заголовков:
    - `Authorization: Bearer <plaintext-key>`
    - `X-Management-Key: <plaintext-key>`

Дополнительно:

- `MANAGEMENT_PASSWORD` регистрирует дополнительный секрет управления только в памяти и сохраняет удаленное управление включенным, даже если `allow-remote` равен false. Значение никогда не записывается на диск.
- `cliproxy run --password <pwd>` и SDK `WithLocalManagementPassword` принимают этот пароль только с localhost (`127.0.0.1` или `::1`). Он остается в памяти.
- Маршруты возвращают 404, когда `management.secret-key` пуст, `MANAGEMENT_PASSWORD` не задан и локальный пароль управления не был настроен. Тот же 404 применяется к `/v0/management`.
- Режим Home не предоставляет этот API и также возвращает 404.
- Пять последовательных ошибок аутентификации с одного IP клиента, включая localhost, создают временную блокировку примерно на 30 минут.
- Открытый `management.secret-key` хешируется bcrypt при загрузке или сохранении конфигурации.

## Соглашения запросов и ответов

- Аутентифицированные тела конфигурации и операций используют `Content-Type: application/json`, если endpoint не указывает иное.
- Тело конфигурации v8 является самим значением. Не оборачивайте его в `{ "value": ... }`, `{ "items": ... }` или старое имя поля.
- `GET /config` и `GET /config/<path>` возвращают узел YAML как JSON. Отсутствующий путь возвращает `404` с `{ "error": "not_found" }`.
- `PUT` заменяет выбранный узел. `PATCH` глубоко объединяет объекты и заменяет любой другой вид. `null` сохраняется и не удаляет поле. Для удаления поля используйте `DELETE`.
- Сегменты пути являются ключами отображения YAML. Это не индексы массива. Списки заменяются целиком.
- Успешное изменение конфигурации возвращает `{ "status": "ok", "config-version": 8 }` и выполняет hot reload сохраненного файла.
- `GET` возвращает представление v8, но не переписывает файл. Первый успешный `PUT`, `PATCH` или `DELETE` мигрирует старый файл в `config-version: 8`, удаляет старые написания и сохраняет комментарии. Отклоненная запись файл не мигрирует.
- Записи v8 отклоняют старые имена полей и неизвестные корневые разделы. Карта старых полей находится в [опциях конфигурации](../configuration/options).

Эти поля принадлежат Home. Их изменение возвращает `400` с `{ "error": "read_only_field", "field": "<path>" }`:

- `credentials/concurrency/lifecycle-config-revision`
- `credentials/concurrency/observation-barrier-revision`
- `plugins/auth-revision`

## Конфигурация

Имена полей, значения по умолчанию и правила провайдеров определены в [опциях конфигурации](../configuration/options). Примеры ниже показывают только транспорт.

### Чтение конфигурации

- `GET /config` — полный документ v8.
- `GET /config/<section>/<key>/...` — один вложенный узел.
- `GET /config.yaml` — то же представление v8 в YAML.

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/config
```

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/config/routing/strategy
```

```text
"round-robin"
```

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Accept: application/yaml' \
  http://localhost:8317/v8/management/config.yaml
```

Примечания:

- Ответы отправляют `Cache-Control: no-store`.
- YAML использует `Content-Type: application/yaml; charset=utf-8`.
- Чтение JSON опускает `username` и `credential` в `oauth.providers.codex.live-media-relay.ice-servers`. Чтение YAML по-прежнему их содержит.
- Если пригодную конфигурацию прочитать нельзя, обработчик возвращает `500` с `{ "error": "read_failed" }` или `{ "error": "invalid_config" }`.

### Замена или объединение конфигурации

- `PUT /config` заменяет весь документ. Тело должно быть объектом JSON.
- `PATCH /config` глубоко объединяет объект JSON с документом.
- `PUT /config/<path>` заменяет этот узел. Тело является исходным значением JSON: объект, массив, строка, число, логическое значение или `null`.
- `PATCH /config/<path>` объединяет, когда и текущий узел, и тело являются объектами; иначе заменяет узел.
- `PUT /config.yaml` заменяет файл документом YAML v8. `Content-Type` может быть `application/yaml`. Для `/config.yaml` нет `PATCH`.

```bash
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"routing":{"retry":{"request-retry":0}},"oauth":{"providers":{"aistudio":{"ws-auth":false}}}}' \
  http://localhost:8317/v8/management/config
```

```bash
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '"direct"' \
  http://localhost:8317/v8/management/config/requests/proxy-url
```

```bash
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '["client-key-1","client-key-2"]' \
  http://localhost:8317/v8/management/config/access/api-keys
```

```bash
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"enabled":true,"priority":10}' \
  http://localhost:8317/v8/management/config/plugins/configs/example-plugin
```

```bash
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/yaml' \
  --data-binary @config.yaml \
  http://localhost:8317/v8/management/config.yaml
```

Ответ:

```json
{ "status": "ok", "config-version": 8 }
```

API-ключи upstream являются списками групп. Заменяйте список провайдера; путь не может выбрать `api-keys/codex/0`.

```bash
curl -X PUT -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '[{"name":"codex-1","base-url":"https://example.invalid","keys":[{"api-key":"sk-example","weight":1}]}]' \
  http://localhost:8317/v8/management/config/api-keys/codex
```

Примечания:

- Старая оболочка, например `{ "value": 0 }`, не является значением v8, и проверка завершается ошибкой.
- Неизвестные разделы, старые имена и значения, не прошедшие разбор конфигурации, отклоняются. Прежний файл остается на месте.
- Повторная запись отредактированного списка ICE-серверов JSON сохраняет TURN `username` и `credential` для записи с теми же `urls`. Явная пустая строка или `null` очищает секрет. Замена YAML не сохраняет пропущенные секреты.
- Запись обновляет существующий файл конфигурации на месте, поэтому файловое монтирование Docker сохраняет тот же inode.
- Изменение `management.secret-key` или `management.allow-remote` возможно. Пустой секрет без запасного пароля заставляет последующие вызовы управления возвращать 404.

### Удаление поля конфигурации

- `DELETE /config/<path>` удаляет поле и убирает ставших пустыми предков-отображений.
- `DELETE /config` отклоняется.

```bash
curl -X DELETE -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/config/requests/proxy-url
```

## Сервер

### Последняя версия

- `GET /server/latest-version` — последний тег релиза GitHub. Ресурсы релиза не загружаются.

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/server/latest-version
```

```json
{ "latest-version": "v1.2.3" }
```

Запрос использует `https://api.github.com/repos/router-for-me/CLIProxyAPI/releases/latest` с `User-Agent: CLIProxyAPI`. Настроенный `requests.proxy-url` учитывается.

## Запросы

### Аутентифицированный вызов upstream

- `POST /requests/api-call` — отправить один исходящий HTTP-запрос, при необходимости с сохраненными учетными данными.

```bash
curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"auth_index":"a1b2","method":"GET","url":"https://api.example.com/v1/ping","header":{"Authorization":"Bearer $TOKEN$"}}' \
  http://localhost:8317/v8/management/requests/api-call
```

```json
{ "status_code": 200, "header": { "Content-Type": ["application/json"] }, "body": "{\"ok\":true}" }
```

Примечания:

- Обязательны `method` и абсолютный `url`. Необязательны строковое отображение `header`, исходная строка `data` и `proxy_url`.
- `auth_index` также принимается как `authIndex` или `AuthIndex`.
- `$TOKEN$` в заголовке заменяется access token или API-ключом выбранных учетных данных.
- Прокси учетных данных имеет приоритет над `proxy_url` запроса и глобальным прокси. Ответ сохраняет статус upstream в `status_code`.
- Так можно вызвать произвольные URL с сохраненными учетными данными. Защитите ключ управления.

## Маршрутизация

### Сброс cooldown

- `POST /routing/cooldown/reset` — очистить состояние квоты и cooldown для одних учетных данных.

```bash
curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"auth_index":"a1b2"}' \
  http://localhost:8317/v8/management/routing/cooldown/reset
```

```json
{ "status": "ok", "auth_index": "a1b2", "models": ["gpt-5.4"] }
```

Неизвестный `auth_index` возвращает `404` с `{ "error": "auth not found" }`.

### Статические определения моделей

- `GET /routing/model-definitions/:channel` — статические метаданные каталога одного канала.

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/routing/model-definitions/codex
```

Ответ имеет вид `{ "channel": "codex", "models": [ ... ] }`.

Неизвестный канал возвращает `400` с `{ "error": "unknown channel", "channel": "..." }`.

## Наблюдаемость

### Логи приложения

- `GET /observability/logs` — прочитать строки журнала.
- `DELETE /observability/logs` — удалить ротированные журналы и обрезать активный журнал.

Параметры запроса для `GET`:

- `after`: метка Unix. Возвращаются только более новые строки.
- `limit`: максимум строк. При `limit` без `after` возвращаются новейшие строки.
- `cursor`: непрозрачный курсор из предыдущего `next-cursor`.

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  'http://localhost:8317/v8/management/observability/logs?limit=2'
```

```json
{
  "lines": ["2026-05-05 12:00:00 info request accepted"],
  "line-count": 1,
  "latest-timestamp": 1777982400,
  "next-cursor": "<OPAQUE_CURSOR>"
}
```

Примечания:

- Запись журнала в файл должна быть включена через `observability.logs.logging-to-file`. Иначе ответ — `400` с `{ "error": "logging to file disabled" }`.
- Отсутствующий файл журнала возвращает пустые `lines` и `line-count: 0`.
- Верните `next-cursor` как `cursor`. При сбросе ответ содержит `"cursor-reset": true`.
- `DELETE` возвращает `{ "success": true, "message": "Logs cleared successfully", "removed": 3 }`.

### Журналы ошибок запросов

- `GET /observability/logs/errors` — список файлов `error-*.log`.
- `GET /observability/logs/errors/:name` — загрузить один журнал ошибок.
- `GET /observability/logs/requests/:id` — загрузить журнал запроса, имя файла которого заканчивается на `-<id>.log`.

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/observability/logs/errors
```

```json
{ "files": [{ "name": "error-2026-05-05.log", "size": 12345, "modified": 1777982400 }] }
```

Примечания:

- Когда логирование запросов включено, список журналов ошибок пуст.
- `:name` должен быть существующим именем `error-*.log` без разделителей пути.
- `:id` не должен содержать разделители пути.

### Использование

- `GET /observability/usage/queue?count=10` — извлечь до `count` записей использования. `count` по умолчанию равен `1` и должен быть положительным целым. Записи удаляются из очереди в памяти. Пустая очередь возвращает `[]`.
- `GET /observability/usage/api-keys` — корзины успехов и ошибок в памяти для учетных данных API-ключа, сгруппированные по провайдеру и адресуемые ключом `base_url|api_key`.

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  'http://localhost:8317/v8/management/observability/usage/queue?count=10'
```

Локальный вывод использования Redis RESP отключен. Перед ожиданием записей включите `observability.usage.usage-statistics-enabled`.

## Учетные данные

Эти маршруты управляют файлами и состоянием среды выполнения в `oauth.auth-dir`. Они не изменяют группы `api-keys`; для них используйте маршруты конфигурации.

### Список, загрузка и удаление

- `GET /credentials` — список файлов учетных данных и записей среды выполнения.
- `POST /credentials` — загрузить одни учетные данные `.json` полем multipart `file` или исходным телом JSON с `?name=<file.json>`.
- `DELETE /credentials?name=<file.json>` — удалить одни учетные данные на диске и отключить их в среде выполнения.
- `DELETE /credentials?all=true` — удалить все учетные данные `.json` на диске. Ответ: `{ "status": "ok", "deleted": 3 }`.
- `GET /credentials/download?name=<file.json>` — загрузить одни учетные данные с диска.
- `GET /credentials/models?name=<file-or-id>` — определения моделей одних учетных данных: `{ "models": [ ... ] }`.

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  http://localhost:8317/v8/management/credentials
```

```json
{
  "files": [
    {
      "id": "claude-user@example.com",
      "auth_index": "a1b2c3d4e5f67890",
      "name": "claude-user@example.com.json",
      "provider": "claude",
      "status": "ready",
      "disabled": false,
      "unavailable": false,
      "runtime_only": false,
      "source": "file"
    }
  ]
}
```

Примечания:

- Записи сортируются по `name`. `runtime_only: true` означает, что учетные данные существуют только в памяти; такие записи нельзя загрузить или удалить здесь.
- Для загрузки требуется основной auth manager. Если он недоступен, ответ — `503` с `{ "error": "core auth manager unavailable" }`.
- Имена загружаемых файлов должны заканчиваться на `.json`. Успешная загрузка регистрируется немедленно и возвращает `{ "status": "ok" }`.

### Статус, поля и обновление

- `PATCH /credentials/status` — `{ "name": "<file-or-id>", "disabled": true }`. Записи API-ключа отключаются через конфигурацию исключенных моделей. Виртуальный дочерний элемент плагина нельзя изменить отдельно.
- `PATCH /credentials/fields` — `{ "name": "<file-or-id>", ...fields }`. Точечные пути обновляют вложенные метаданные, например `headers.X-Team`. Объект `headers` объединяется с существующими заголовками; пустое значение удаляет заголовок.
- `POST /credentials/refresh` — обновить файловые учетные данные OAuth.

```bash
curl -X PATCH -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"name":"codex-user.json","disabled":true}' \
  http://localhost:8317/v8/management/credentials/status
```

## OAuth

### Начало входа

- `GET /oauth/auth-url?provider=<provider>` — начать вход провайдера и вернуть URL браузера.

Провайдеры: `claude`, `codex`, `antigravity`, `kimi`, `kimi-ai`, `xai`, `devin`, `meta` и провайдер OAuth, зарегистрированный плагином.

```bash
curl -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  'http://localhost:8317/v8/management/oauth/auth-url?provider=claude&is_webui=true'
```

```json
{ "status": "ok", "url": "https://...", "state": "anth-1716206400" }
```

Примечания:

- Отсутствие `provider` возвращает `400` с `{ "error": "provider is required" }`. Неизвестный провайдер возвращает `404` с `{ "error": "provider_not_found" }`, если плагин его не обрабатывает.
- `is_webui=true` повторно использует переадресатор callback интерфейса управления для поддерживающих его провайдеров.
- Провайдеры кода устройства также могут вернуть `flow`, `user_code` и `expires_in`.

### Опрос и отмена

- `GET /oauth/status?state=<state>` — `wait` во время ожидания, `ok` после успеха или `error` со строкой `error`. Завершенные состояния ненадолго сохраняются, чтобы клиент мог увидеть `ok`.
- `DELETE /oauth/session?state=<state>` — отменить ожидающий сеанс. Ответ: `{ "status": "ok", "cancelled": true }`. Отмененный процесс не сохраняет учетные данные.

### Импорт

- `POST /oauth/import?provider=vertex` — импортировать JSON-файл сервисного аккаунта Google. Поддерживаемый провайдер — `vertex`.

```bash
curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -F 'file=@/path/to/service-account.json' \
  -F 'location=us-central1' \
  'http://localhost:8317/v8/management/oauth/import?provider=vertex'
```

```json
{
  "status": "ok",
  "auth-file": "/abs/path/auths/vertex-my-project.json",
  "project_id": "my-project",
  "email": "svc@my-project.iam.gserviceaccount.com",
  "location": "us-central1"
}
```

Загрузка выполняется как `multipart/form-data` в поле `file`. `location` необязателен и по умолчанию равен `us-central1`.

### Callback

`GET /oauth/callback` и `POST /oauth/callback` находятся вне middleware ключа управления. Они принимают callback только для ожидающего состояния, провайдер которого совпадает с сеансом.

- `GET` читает `provider`, `state`, `code`, а также `error` или `error_description`.
- `POST` принимает `{ "provider", "redirect_url", "code", "state", "error" }`. `redirect_url` может содержать query callback.

```bash
curl 'http://localhost:8317/v8/management/oauth/callback?provider=codex&state=codex-...&code=AUTHORIZATION_CODE'
```

```json
{ "status": "ok" }
```

## Плагины

Включение плагина и принадлежащие ему параметры являются конфигурацией, а не отдельными маршрутами:

- `GET /config/plugins` читает раздел плагинов.
- `PUT` или `PATCH /config/plugins/configs/<plugin-id>` заменяет или объединяет один объект плагина.
- `PUT /config/plugins/configs/<plugin-id>/enabled` с `true` или `false` меняет только этот флаг. Это не меняет `plugins.enabled`.

### Обнаружение и магазин

- `GET /plugins` — обнаруженные, настроенные и зарегистрированные плагины, включая `plugins_enabled`, `plugins_dir`, а также id, путь, состояние включения, метаданные, поля конфигурации и меню каждого плагина.
- `DELETE /plugins/:id` — удалить локальный файл плагина и его сохраненную конфигурацию. Плагин, который нельзя выгрузить, возвращает `409` и может установить `restart_required: true`.
- `GET /plugins/store` — каталог магазина, ошибки источников, состояние установки и доступность обновления.
- `POST /plugins/store/:id/install` — загрузить или обновить один плагин и включить его. Используйте `?source=<source-id>` при совпадении ID. `version` может быть параметром запроса или `{ "version": "1.2.3" }`.

```bash
curl -X POST -H 'Authorization: Bearer <MANAGEMENT_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"version":"1.2.3"}' \
  'http://localhost:8317/v8/management/plugins/store/example-plugin/install?source=official'
```

```json
{
  "status": "installed",
  "source_id": "official",
  "id": "example-plugin",
  "version": "1.2.3",
  "path": "/abs/path/plugins/example-plugin.so",
  "restart_required": false
}
```

Установка из магазина может загружать исполняемые артефакты. Доверяйте источникам магазина перед их включением.

### Квота плагина

- `GET /plugins/:id/quota?auth_index=<auth-index>`
- `POST /plugins/:id/quota` с `{ "auth_index": "<auth-index>" }`
- `DELETE /plugins/:id/quota?auth_index=<auth-index>`

`authIndex` принимается как псевдоним. Отсутствующий провайдер квоты возвращает `404`. Ошибки провайдера возвращают `502`. v8 не регистрирует устаревший псевдоним `/quota/reset`.

## Ответы об ошибках

Обработчики конфигурации и операций используют собственные строки ошибок. Распространенные результаты:

- `400`: `{ "error": "invalid_json" }`, `{ "error": "invalid_body" }`, `{ "error": "invalid_path" }`, `{ "error": "config_must_be_object" }`, `{ "error": "cannot_delete_config" }` или `{ "error": "invalid_config", "message": "..." }`
- `400`: `{ "error": "read_only_field", "field": "plugins/auth-revision" }`
- `401`: `{ "error": "missing management key" }` или `{ "error": "invalid management key" }`
- `403`: `{ "error": "remote management disabled" }`
- `404`: `{ "error": "not_found" }`, `{ "error": "provider_not_found" }` или `{ "error": "auth not found" }`
- `409`: плагин нельзя выгрузить или требуется перезапуск
- `422`: `{ "error": "invalid_config", "message": "..." }`, когда документ разбирается, но не проходит проверку конфигурации
- `500`: `{ "error": "write_failed", "message": "..." }` или `{ "error": "read_failed" }`
- `502`: ошибка провайдера квоты
- `503`: `{ "error": "core auth manager unavailable" }`

Пустой секрет управления без запасного пароля возвращает `404` до выполнения этих обработчиков.

## Примечания

- Новые клиенты должны отправлять только пути v8. После миграции файла устаревшее обновление `/v0/management` все еще изменяет действующее значение, но это не контракт для новой разработки.
- У `quota-exceeded.switch-project` и `quota-exceeded.switch-preview-model` нет имен v8. Не добавляйте функции, которые от них зависят.
- Параметры провайдера OAuth в `oauth.providers` не применяются к группам `api-keys`. Храните эти учетные данные в полях группы и ключа, описанных для API-ключей upstream.
