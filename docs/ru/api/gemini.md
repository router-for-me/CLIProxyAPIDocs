---
title: Gemini
feature_ids:
  - route.v1beta.get-models
  - route.v1beta.get-models-action
  - route.v1beta.post-models-action
  - route.v1beta.post-interactions
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Gemini

Здесь описаны совместимые с Gemini маршруты закреплённого коммита: список моделей, запрос одной модели, вызовы `models/*action` и Interactions.

## 1. Какую задачу решает этот раздел

Эти маршруты висят на группе `/v1beta`. Вызывающий может перечислить модели в форме Gemini, прочитать одну из них, запустить генерацию или подсчёт по `имя-модели:имя-метода` либо отправить в `/v1beta/interactions` запрос, содержащий только `model` или только `agent`.

## 2. Когда применимо и чего здесь нет

Все четыре маршрута сначала проходят проверку клиентского ключа. Ключ и безопасный режим примерных ключей описаны в разделе [Клиентские ключи](/ru/api/access).

Здесь не описываются OpenAI `/v1/models` и Claude Messages. `agent` в Interactions всегда идёт к провайдеру Interactions. Обычный запрос `model` этот провайдер не принуждает.

`POST /v1beta/models/*action` входит только в три метода: `generateContent`, `streamGenerateContent` и `countTokens`. Другие имена методов этими тремя ветками не обрабатываются.

## 3. Как настроить или вызвать

Список моделей и одна модель. Путь одной модели пишется после `models/`. Имя может быть с префиксом `models/` или без него.

```bash
curl https://example.invalid/v1beta/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

```bash
curl https://example.invalid/v1beta/models/<已登记的模型 ID> \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Генерация, потоковая генерация и подсчёт. Путь должен быть одним сегментом модели, одним двоеточием и одним именем метода.

```bash
curl https://example.invalid/v1beta/models/<已登记的模型 ID>:generateContent \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

```bash
curl "https://example.invalid/v1beta/models/<已登记的模型 ID>:streamGenerateContent?alt=sse" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

```bash
curl https://example.invalid/v1beta/models/<已登记的模型 ID>:countTokens \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Interactions. Непустым может быть ровно одно из `model` и `agent`. Если `stream` присутствует, это должно быть логическое JSON.

```bash
curl https://example.invalid/v1beta/interactions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>","stream":false}'
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно. Пустая ячейка означает, что поле — пустая строка.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| route.v1beta.get-models | `GET /v1beta/models`. |  | Тело — `{"models":[...]}`. Уже существующему имени без префикса `models/` этот префикс добавляется в ответе. Пустые `displayName` и `description` заполняются именем. Если нет `supportedGenerationMethods`, записывается `["generateContent"]`. |
| route.v1beta.get-models-action | `GET /v1beta/models/*action`. |  | После удаления начальной косой черты сопоставление идёт по имени модели или по `models/` плюс имя модели. При попадании имя дополняется до объекта с префиксом `models/`. |
| route.v1beta.post-models-action | `POST /v1beta/models/*action`. |  | После удаления начальной косой черты путь должен делиться ровно на `имя-модели:имя-метода`. Обрабатываются только `generateContent`, `streamGenerateContent` и `countTokens`. |
| route.v1beta.post-interactions | `POST /v1beta/interactions`. |  | JSON должен быть допустимым. Ровно одно из `model` и `agent` непусто. `stream` по умолчанию false. Если присутствует, это должно быть логическое значение. |

`streamGenerateContent` читает параметр запроса `alt`, а если его нет — `$alt`. Если значение равно `sse` или нет ни того ни другого, ответ пишется как SSE, перед блоком стоит `data: `. Другие значения `alt` пишутся исходным блоком, без этой рамки SSE.

Если `model` в Interactions начинается с `models/`, этот префикс снимается перед выполнением. Когда `agent` непустой, имя модели для выбора учётных данных — `gemini-2.5-flash`, а провайдер принудительно Interactions. Значение, которое вызывающий записал в `agent`, не меняется.

## 5. Типичные ошибки и границы

Если `*action` у `GET` или `POST` не может связать путь, ответ — 400. `error.type` равен `invalid_request_error`, сообщение начинается с `Invalid request:`.

Ненайденная одна модель возвращает 404. `error.message` равен `Not Found`, `error.type` равен `not_found`.

Если путь `POST` не состоит ровно из двух сегментов, разделённых одним двоеточием, ответ — 404. `error.type` равен `invalid_request_error`, сообщение — путь запроса плюс ` not found.`. Если имя метода не `generateContent`, `streamGenerateContent` или `countTokens`, обработчик не пишет ответ.

Если `POST` не смог прочитать тело запроса и исходное тело существует, возвращается статус этой ошибки чтения. Если его нельзя классифицировать, статус — 400, а `error.type` равен `invalid_request_error`.

`streamGenerateContent` возвращает 500, если нельзя получить HTTP flusher. `error.message` равен `Streaming not supported`, `error.type` равен `server_error`.

Недопустимый JSON Interactions возвращает 400 с сообщением `invalid JSON body`. Если `model` и `agent` одновременно пусты или одновременно непусты, ответ — 400 с сообщением `request requires exactly one of model or agent`. Если `stream` не логическое значение, ответ — 400 с сообщением `stream must be a boolean`. У этих тел `error.type` равен `invalid_request_error`. `stream: true` идёт через SSE. Если flusher получить нельзя, ответ тоже 500 `Streaming not supported`.

При включённом Home список и одна модель берут каталог из Home. Недоступный центр управления возвращает 503. `error.message` равен `home control center unavailable`, `error.type` равен `server_error`. Неудачное получение каталога возвращает 502. Если Home помечает аутентификацию как неудачную, `error.type` равен `authentication_error`. Ненайденная одна модель Home по-прежнему 404 `Not Found`.

## 6. Связанные возможности

Клиентский ключ описан в разделе [Клиентские ключи](/ru/api/access). Список моделей OpenAI — в разделе [OpenAI Chat](/ru/api/openai-chat).

## 7. Практический опыт

- [Модели изображений идут по протоколу Gemini](/ru/experience/api#exp-api-gemini-for-images)
- [Изображения Gemini и структурированный вывод идут нативным маршрутом](/ru/experience/api#exp-api-gemini-native-route)
- [Пересылайте мышление AI Studio по полю upstream](/ru/experience/api#exp-api-gemini-thinking-field)
