---
title: Сеансы реального времени
feature_ids:
  - route.v1.post-live
  - route.v1.get-live-call-id
  - route.v1.get-realtime
  - route.v1.post-realtime
  - route.v1.post-realtime-calls
  - route.v1.get-realtime-calls-call-id
  - route.v1.post-realtime-client-secrets
  - route.v1.post-realtime-sessions
  - route.v1.post-realtime-transcription-sessions
  - route.v1.get-realtime-translations
  - route.v1.post-realtime-translations
  - route.v1.post-realtime-translations-client-secrets
  - route.v1.post-realtime-calls-call-id-hangup
  - route.v1.post-realtime-calls-call-id-accept
  - route.v1.post-realtime-calls-call-id-reject
  - route.v1.post-realtime-calls-call-id-refer
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Сеансы реального времени

Здесь описаны вызовы Codex в реальном времени, боковой WebSocket, краткоживущие клиентские секреты и возможности реального времени, которые сейчас явно отклоняются, в закреплённом коммите.

## 1. Какую задачу решает этот раздел

`/v1/live` и `/v1/realtime` устанавливают вызов Codex в реальном времени или подключают боковой WebSocket уже установленного вызова. `/v1/realtime/client_secrets` и `/v1/realtime/sessions` выпускают краткоживущий секрет, действительный только внутри этого прокси. У перевода, транскрипции и управления SIP нет соответствующей возможности на текущем OAuth upstream Codex. Вызов сразу возвращает 501.

## 2. Когда применимо и чего здесь нет

`/v1/live` и `/v1/live/:call_id` входят в группу `/v1` и используют обычную проверку клиентского ключа. Тело ошибки — строковый `error`. Остальные маршруты этой страницы в эту группу не входят.

`/v1/realtime`, `/v1/realtime/calls`, `/v1/realtime/calls/:call_id` и два входа перевода сначала распознают краткоживущий секрет в `Authorization: Bearer`, начинающийся с `ek_`. Если это не `ek_`, снова выполняется проверка клиентского ключа, но ошибка упаковывается в объект. Недействительный или истёкший краткоживущий секрет возвращает 401. `error.code` равен `invalid_realtime_client_secret`, `error.type` равен `invalid_request_error`, сообщение — `Realtime client secret is invalid or expired`.

`client_secrets`, `sessions`, транскрипция, `client_secrets` перевода, завершение вызова и три пути SIP используют только формат ошибки реального времени клиентского ключа. Они не принимают `ek_` как замену аутентификации. Сам клиентский ключ описан в разделе [Клиентские ключи](/ru/api/access).

Эти маршруты выбирают учётные данные Codex OAuth. WebSocket Responses `GET /v1/responses` здесь не описывается.

## 3. Как настроить или вызвать

Установить вызов. `POST /v1/live`, `POST /v1/realtime` и `POST /v1/realtime/calls` используют один обработчик. В JSON можно опустить `model`. Тогда учётные данные выбираются как `gpt-live-1-codex`. Можно также передать `multipart/form-data` или SDP, держа краткоживущий секрет.

```bash
curl https://example.invalid/v1/live \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-live-1-codex"}'
```

Боковой WebSocket должен быть обновлением. ID вызова берётся из ответа, установившего вызов, и должен соответствовать `^[A-Za-z0-9_-]{1,128}$`.

```text
GET https://example.invalid/v1/live/<call_id>
GET https://example.invalid/v1/realtime/calls/<call_id>
GET https://example.invalid/v1/realtime?call_id=<call_id>
```

`GET /v1/realtime` без `call_id` — другой WebSocket. Если параметр запроса `model` опущен, сначала обрабатывается как `gpt-realtime`.

Выпустить краткоживущий секрет. Пустое тело допустимо. Если `session` опущена, сеанс записывается как `{"type":"realtime","model":"gpt-realtime"}`.

```bash
curl https://example.invalid/v1/realtime/client_secrets \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"expires_after":{"anchor":"created_at","seconds":600}}'
```

`POST /v1/realtime/sessions` считает всё тело объектом сеанса. Оно не обёрнуто в `session`. При успехе дополнительно возвращаются `client_secret.value` и `client_secret.expires_at`.

Завершить установленный вызов:

```bash
curl -X POST https://example.invalid/v1/realtime/calls/<call_id>/hangup \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно. Пустая ячейка означает, что поле — пустая строка.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| route.v1.post-live | `POST /v1/live`. |  | Обычная проверка ключа. Тело запроса не больше 16 MiB. Модель по умолчанию — `gpt-live-1-codex`. |
| route.v1.get-live-call-id | `GET /v1/live/:call_id`. |  | Боковой WebSocket. Обычная проверка ключа. ID вызова должен соответствовать регулярному выражению выше. |
| route.v1.get-realtime | `GET /v1/realtime`. |  | При наличии `call_id` переходит на боковой канал. Иначе это должно быть обновление WebSocket. Модель запроса по умолчанию — `gpt-realtime`. |
| route.v1.post-realtime | `POST /v1/realtime`. |  | Тот же обработчик, что у `POST /v1/live`, но аутентификация и форма ошибки другие. |
| route.v1.post-realtime-calls | `POST /v1/realtime/calls`. |  | Тоже вызывает обработчик установки вызова. |
| route.v1.get-realtime-calls-call-id | `GET /v1/realtime/calls/:call_id`. |  | Боковой WebSocket с аутентификацией реального времени. |
| route.v1.post-realtime-client-secrets | `POST /v1/realtime/client_secrets`. |  | Тело не больше 64 KiB. Успех возвращает `value`, `expires_at` и `session`. `Cache-Control` равен `no-store`. |
| route.v1.post-realtime-sessions | `POST /v1/realtime/sessions`. |  | Старый вход. Само тело — объект сеанса. Ответ добавляет `client_secret` вне полей сеанса. |
| route.v1.post-realtime-transcription-sessions | `POST /v1/realtime/transcription_sessions`. |  | Всегда возвращает 501. |
| route.v1.get-realtime-translations | `GET /v1/realtime/translations`. |  | Всегда возвращает 501. |
| route.v1.post-realtime-translations | `POST /v1/realtime/translations`. |  | Всегда возвращает 501. |
| route.v1.post-realtime-translations-client-secrets | `POST /v1/realtime/translations/client_secrets`. |  | Всегда возвращает 501. Идёт только стандартная аутентификация реального времени. |
| route.v1.post-realtime-calls-call-id-hangup | `POST /v1/realtime/calls/:call_id/hangup`. |  | Завершает только вызов, который установил этот прокси и который ещё записан локально. |
| route.v1.post-realtime-calls-call-id-accept | `POST /v1/realtime/calls/:call_id/accept`. |  | Всегда возвращает 501. |
| route.v1.post-realtime-calls-call-id-reject | `POST /v1/realtime/calls/:call_id/reject`. |  | Всегда возвращает 501. |
| route.v1.post-realtime-calls-call-id-refer | `POST /v1/realtime/calls/:call_id/refer`. |  | Всегда возвращает 501. |

`gpt-realtime`, имя, начинающееся с `gpt-realtime-`, и имя, содержащее `realtime-preview`, при выборе учётных данных обрабатываются как `gpt-live-1-codex`. Сравнение не зависит от регистра. Другое непустое имя модели сохраняется как есть.

`value` краткоживущего секрета начинается с `ek_`. Если `expires_after` опущено, срок — 10 минут. `anchor` может быть только пустым или `created_at`. `seconds` должно быть от 10 до 7200. Если `type` сеанса опущено, записывается `realtime`, и оно может быть только `realtime`. Если `model` опущена, записывается `gpt-realtime`. В успешном ответе `session.object` равен `realtime.session` и несёт `id` и `expires_at`. У одной выпускающей личности не больше 64 неистёкших секретов. В процессе не больше 1024.

Запрос установки вызова, держащий `ek_`, должен быть SDP, текстовым SDP или JSON. JSON записывается в `session`, сохранённую с этим секретом. На WebSocket модель в секрете и модель запроса после отображения выше должны совпасть.

## 5. Типичные ошибки и границы

Если тело установки вызова больше 16 MiB, ответ — 413, сообщение — `Codex live request body too large`. Если чтение не удалось и его нельзя классифицировать, статус — 400, сообщение начинается с `failed to read Codex live request:`. Если менеджер аутентификации недоступен, ответ — 503, сообщение — `Codex auth manager unavailable`. Если учётные данные не выбраны, ответ — 503, сообщение — `Codex auth unavailable`. Под `/v1/realtime` эти неудачи `writeLiveError` упаковываются в объект. Для 4xx `type` равен `invalid_request_error`. Для 401 `type` равен `authentication_error`. Для других статусов `type` равен `api_error`, а `code` равен `realtime_request_failed`. Под `/v1/live` тело той же неудачи — `{"error":"<сообщение>"}`. Если выбор не удался и его нельзя классифицировать, статус — 503, сообщение — текст ошибки выбора, и добавляется `Retry-After`, который несёт эта ошибка. Форма по-прежнему зависит от пути выше.

Если боковое соединение не является обновлением WebSocket, ответ — 426, устанавливается `Upgrade: websocket`, сообщение — `WebSocket upgrade required`. Если ID вызова не соответствует регулярному выражению, ответ — 400. Сообщение `/v1/live` — `Invalid Codex live call ID`. Боковой канал `/v1/realtime` использует ту же функцию, поэтому сообщение то же, но форма становится объектом, а `code` равен `realtime_request_failed`. Если сеанс уже подключается, ответ — 409, сообщение — `Codex live session already joining`. Если вызова нет локально, ответ — 404, сообщение — `Codex live session not found`.

Если краткоживущий секрет не соответствует вызову, ответ — 403. Сообщение — `Realtime client secret is not valid for this call`, `code` равен `realtime_client_secret_scope_mismatch`. Если личность обычного ключа не совпадает с личностью, создавшей вызов, ответ — 403. Сообщение — `Realtime call belongs to another API principal`, `code` равен `realtime_call_scope_mismatch`. Эти два ответа и на `/v1/live` являются объектами, а не строками.

Если `GET /v1/realtime` не является обновлением WebSocket, ответ — 426. `code` равен `websocket_upgrade_required`, сообщение — `WebSocket upgrade required`. Если модель краткоживущего секрета не совпадает с моделью запроса, ответ — 403. `code` равен `realtime_client_secret_scope_mismatch`, сообщение — `Realtime client secret is not valid for the requested model`. Если менеджер аутентификации или учётные данные Codex недоступны, ответ — 503, `code` равен `codex_auth_unavailable`.

Если тело выпуска секрета больше 64 KiB, ответ — 413. Сообщение по-прежнему `Codex live request body too large`, `code` равен `invalid_request`. Недопустимый JSON `client_secrets` возвращает 400 с сообщением `Invalid Realtime client secret request`. Если сеанс не объект JSON, ответ — 400. Сообщение — `session must be a valid JSON object`, `code` равен `invalid_session`. Если `type` не `realtime`, ответ — 501. `code` равен `realtime_capability_not_supported`, сообщение содержит `Realtime session type is not supported by the Codex OAuth upstream`. Если `expires_after.anchor` не `created_at`, ответ — 400, сообщение — `expires_after.anchor must be created_at`. Если секунды вне диапазона, ответ — 400. Сообщение — `expires_after.seconds must be between 10 and 7200`, `code` равен `invalid_expires_after`. Когда ёмкость исчерпана, ответ — 429, заголовок `Retry-After: 1`, сообщение — `Realtime client secret capacity exhausted`, `type` равен `rate_limit_error`, `code` равен `realtime_client_secret_capacity_exhausted`. Если служба недоступна, ответ — 503, `code` равен `realtime_client_secret_unavailable`.

Если ID завершаемого вызова не соответствует регулярному выражению, ответ — 400. Сообщение — `Invalid Realtime call ID`, `code` равен `invalid_call_id`. Если локального вызова нет, ответ — 404. Сообщение — `Realtime call not found`, `code` равен `realtime_call_not_found`. Несовпадение личности возвращает 403 выше. Если служба недоступна, ответ — 503. Сообщение — `Codex live session service unavailable`, `code` равен `realtime_session_unavailable`. После того как вызов найден, статус завершения и тело upstream записываются из ответа upstream.

Транскрипция возвращает 501. Сообщение — `Realtime transcription-only sessions are not supported by the ChatGPT/Codex OAuth upstream`. Оба входа перевода и `client_secrets` перевода возвращают 501. Сообщение — `Realtime translation sessions are not supported by the ChatGPT/Codex OAuth upstream`. `accept`, `reject` и `refer` возвращают 501. Сообщения — `Realtime SIP accept are not supported by the ChatGPT/Codex OAuth upstream`, `Realtime SIP reject are not supported by the ChatGPT/Codex OAuth upstream` и `Realtime SIP refer are not supported by the ChatGPT/Codex OAuth upstream`. У этих 501 `type` равен `not_supported_error`, `code` равен `realtime_capability_not_supported`.

## 6. Связанные возможности

Клиентский ключ описан в разделе [Клиентские ключи](/ru/api/access). WebSocket Responses — в разделе [Responses](/ru/api/responses).

## 7. Практический опыт

Пока нет.
