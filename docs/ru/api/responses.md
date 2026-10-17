---
title: Responses
feature_ids:
  - route.v1.post-responses
  - route.v1.get-responses
  - route.v1.post-responses-compact
  - route.backend-api.post-codex-responses
  - route.backend-api.get-codex-responses
  - route.backend-api.post-codex-responses-compact
  - route.backend-api.post-codex-alpha-search
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Responses

Здесь описаны OpenAI Responses, сжатие и псевдонимы `/backend-api/codex`, которые Codex CLI может вызывать напрямую, в закреплённом коммите.

## 1. Какую задачу решает этот раздел

`/v1/responses` принимает JSON Responses. Когда `stream` равен логическому JSON `true`, ответ — SSE. Иначе это одно тело JSON. Соответствующий `GET` обновляет соединение до WebSocket. `/responses/compact` принимает только не потоковое сжатие. Одноимённые пути под `/backend-api/codex` вызывают те же обработчики. Под этим префиксом есть ещё Codex Alpha Search.

## 2. Когда применимо и чего здесь нет

Эти маршруты относятся к группам `/v1` и `/backend-api/codex`. Оба сначала проходят проверку клиентского ключа. Ключ и безопасный режим примерных ключей описаны в разделе [Клиентские ключи](/ru/api/access).

`/v1/alpha/search` на этой странице нет. Он в разделе [Прочие конечные точки](/ru/api/openai-other), но использует тот же обработчик поиска. Chat Completions здесь нет. Тело Chat Completions без `messages`, но с `input` или `instructions`, сначала преобразуется в Chat Completions. Это поведение раздела [OpenAI Chat](/ru/api/openai-chat).

Преобразование протокола upstream здесь не описывается. Вызывающий передаёт JSON Responses либо JSON, который читает обработчик поиска.

## 3. Как настроить или вызвать

Responses без потока. Замена `/v1` на хосте на `/backend-api/codex` вызывает тот же обработчик.

```bash
curl https://example.invalid/v1/responses \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>","stream":false}'
```

Потоковый запрос задаёт `stream` логическим JSON `true`. Ответ — SSE.

Сжатие не может быть потоковым:

```bash
curl https://example.invalid/v1/responses/compact \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>"}'
```

WebSocket использует `GET /v1/responses` или `GET /backend-api/codex/responses` и заголовки обновления WebSocket. Текстовые сообщения используют JSON. Обработчик распознаёт сообщения, у которых `type` равен `response.create`, `response.append` или `response.interrupt`.

Codex Alpha Search:

```bash
curl https://example.invalid/backend-api/codex/alpha/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>"}'
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно. Пустая ячейка означает, что поле — пустая строка.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| route.v1.post-responses | `POST /v1/responses`. |  | Логический JSON `stream: true` идёт через SSE, иначе возвращается одно тело JSON. Используется `model` из тела запроса. |
| route.v1.get-responses | `GET /v1/responses`. |  | Обновляется до WebSocket. Обновитель разрешает любой Origin. |
| route.v1.post-responses-compact | `POST /v1/responses/compact`. |  | Логический JSON `stream: true` отклоняется сразу. Если `stream` присутствует, но не является этим логическим значением, поле сначала удаляется, затем выполнение идёт как не потоковое. |
| route.backend-api.post-codex-responses | `POST /backend-api/codex/responses`. |  | Тот же обработчик, что у `POST /v1/responses`. |
| route.backend-api.get-codex-responses | `GET /backend-api/codex/responses`. |  | Тот же обработчик WebSocket, что у `GET /v1/responses`. |
| route.backend-api.post-codex-responses-compact | `POST /backend-api/codex/responses/compact`. |  | Тот же обработчик, что у `POST /v1/responses/compact`. |
| route.backend-api.post-codex-alpha-search | `POST /backend-api/codex/alpha/search`. |  | Читается не больше 16 MiB. `id` и `model` в объекте JSON участвуют в выборе. Если `id` непустой, он записывается как `X-Session-ID` для выбора. |

Если поисковый запрос разбирается как объект JSON, перед пересылкой удаляются `prompt_cache_key` и `prompt_cache_retention`. Если разбор не удался, сохраняются исходные байты. Учётные данные Codex в форме API key должны иметь base URL. Путь пересылки — `/alpha/search` под этим адресом. Учётные данные OAuth идут в поиск Codex upstream. Если маршрутизация модели указывает цель на провайдера, отличного от `codex`, запрос не отправляется.

`response.interrupt` на WebSocket передаётся текущему сокету upstream и сам по себе не открывает новый ход. `response.create` и `response.append` — запросы Responses на том же соединении. Если upstream требует перейти на HTTP-повтор, соединение заканчивается кодом закрытия 1012 с причиной `upstream requires HTTP replay`.

## 5. Типичные ошибки и границы

Если любой `POST` Responses или сжатие не смогли прочитать тело запроса, возвращается статус этой ошибки чтения. Если его нельзя классифицировать, статус — 400. `error.type` равен `invalid_request_error`, сообщение начинается с `Invalid request:`.

Сжатие возвращает 400, когда `stream` равен логическому JSON `true`. Сообщение — `Streaming not supported for compact responses`, `error.type` равен `invalid_request_error`.

Потоковые Responses возвращают 500, если нельзя получить HTTP flusher. `error.type` равен `server_error`. Если обновление WebSocket не удалось, обработчик не продолжает сеанс. Ошибку записывает обновитель.

Поиск возвращает 503, когда менеджер аутентификации недоступен. `error` тела равен `Codex auth manager unavailable`. Если учётные данные не выбраны, ответ — 503, `error` равен `Codex auth unavailable`. Если у учётных данных API key нет base URL, ответ — 503, `error` равен `Codex Alpha Search API key base URL unavailable`. Если цель маршрутизации модели не поддерживается, возвращается статус этой ошибки. Если его нельзя классифицировать, статус — 503, а `error` тела — текст ошибки маршрутизации. Неудачный выбор тоже возвращает свой статус. Если его нельзя классифицировать, статус — 503, и `Retry-After` добавляется как есть. Если чтение тела запроса не удалось и его нельзя классифицировать, статус — 400, `error` равен `Failed to read search request`. Если запрос upstream не удался и его нельзя классифицировать, статус — 502. Если чтение тела upstream не удалось и его нельзя классифицировать, статус — 502, `error` равен `Failed to read Codex search response`. После того как запрос дошёл до upstream, код состояния и тело записываются так, как их прислал upstream. Если upstream дал `Content-Type`, он тоже записывается.

## 6. Связанные возможности

`/v1/alpha/search` того же обработчика поиска описан в разделе [Прочие конечные точки](/ru/api/openai-other). Клиентский ключ — в разделе [Клиентские ключи](/ru/api/access). WebSocket реального времени — в разделе [Сеансы реального времени](/ru/api/realtime).

## 7. Практический опыт

- [Antigravity скрывает модели, недоступные учётной записи](/ru/experience/accounts#exp-accounts-antigravity-hides-unusable-models)
- [Upstream responses записывается в ключ API Codex](/ru/experience/accounts#exp-accounts-codex-api-key-base-url)
- [Клиент Codex должен совпадать со значением User-Agent по умолчанию](/ru/experience/accounts#exp-accounts-codex-client-user-agent)
- [Встроенные изображения используют OAuth Codex](/ru/experience/accounts#exp-accounts-codex-oauth-for-images)
- [Codex может использовать WebSocket клиента или WebSocket прокси](/ru/experience/accounts#exp-accounts-codex-websocket-or-http)
- [Базовый адрес, совместимый с OpenAI, включает сегмент версии](/ru/experience/accounts#exp-accounts-openai-base-url-v1)
- [Клиент Codex вызывает маршрут responses](/ru/experience/api#exp-api-call-responses)
- [Сжатию нужна модель сжатия от upstream](/ru/experience/api#exp-api-compaction-needs-model)
- [Прекратите внедрять инструмент изображений](/ru/experience/api#exp-api-disable-image-tool-injection)
- [Модели изображений идут по протоколу Gemini](/ru/experience/api#exp-api-gemini-for-images)
- [Kimi responses сохраняет собственные инструменты Kimi](/ru/experience/api#exp-api-kimi-native-responses)
- [Сводка рассуждения появляется только когда запрос её требует](/ru/experience/api#exp-api-reasoning-summary-vs-effort)
- [Передавайте клиентский ключ при вызове публичного маршрута](/ru/experience/api#exp-api-require-client-key)
- [responses использует instructions вместо system](/ru/experience/api#exp-api-responses-instructions)
- [Поток responses не использует DONE как конец](/ru/experience/api#exp-api-responses-stream-shape)
- [Выберите уровень мышления суффиксом в скобках](/ru/experience/configuration#exp-configuration-thinking-suffix)
- [Фильтром payload уберите поля, которые отклоняет upstream](/ru/experience/routing#exp-routing-filter-rejected-fields)
- [responses чередуется по общему ключу кэша](/ru/experience/routing#exp-routing-responses-cache-key)
- [Включите привязку сеанса, чтобы сохранить зашифрованное рассуждение](/ru/experience/routing#exp-routing-session-affinity)
