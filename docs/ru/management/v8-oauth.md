---
title: OAuth
feature_ids:
  - management.v8.delete-oauth-session
  - management.v8.get-oauth-auth-url
  - management.v8.get-oauth-callback
  - management.v8.get-oauth-status
  - management.v8.post-oauth-callback
  - management.v8.post-oauth-import
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# OAuth

## 1. Какую задачу решает этот раздел

Через API управления начать вход провайдера, передать обратный вызов, запросить или отменить сеанс, а также импортировать поддерживаемые учётные данные.

## 2. Когда применимо и чего здесь нет

Начало входа, запрос состояния, отмена сеанса и импорт требуют ключ управления. `GET` и `POST /v8/management/oauth/callback` не проходят через промежуточный слой ключа управления, но всё ещё ограничены тем, включён ли интерфейс управления: режим Home или невключённые маршруты управления возвращают 404. Добавление и удаление уже сохранённых файлов описано в разделе [Учётные данные](/ru/management/v8-credentials).

## 3. Как настроить или вызвать

Базовый адрес — `https://example.invalid`. Запросы, которым нужен ключ, используют `Authorization: Bearer YOUR_API_KEY`.

| Метод и путь | Назначение |
| --- | --- |
| GET /v8/management/oauth/auth-url?provider= | Начинает вход провайдера и возвращает URL авторизации или сведения о коде устройства. |
| GET /v8/management/oauth/status?state= | Запрашивает сеанс. Если `state` опущен, возвращается только `{"status":"ok"}`. |
| DELETE /v8/management/oauth/session?state= | Отменяет ожидающий сеанс этого state. |
| POST /v8/management/oauth/import?provider= | Импортирует учётные данные. Встроенная передача сейчас принимает только `vertex`. |
| GET /v8/management/oauth/callback | Принимает обратный вызов провайдера из параметров запроса. |
| POST /v8/management/oauth/callback | Принимает обратный вызов в JSON. |

Значение запроса `provider` перед сопоставлением переводится в нижний регистр. Начало входа принимает `claude`, `codex`, `antigravity`, `kimi`, `kimi-ai`, `xai`, `devin` и `meta`. Если ни одно не совпало и зарегистрированный плагин умеет обработать провайдера, запрос передаётся плагину. Иначе ответ — 404 `provider_not_found`.

Поля JSON обратного вызова POST: `provider`, `redirect_url`, `code`, `state`, `error`. `state`, `code`, `error` или `error_description` внутри `redirect_url` заполняют соответствующее поле, если оно пустое.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| DELETE /v8/management/oauth/session | Отменяет ожидающий сеанс OAuth. |  | Нет `state` — 400 `missing state`. Недопустимый state — 400 `invalid state`. Успех возвращает `status: ok` и логическое `cancelled`. |
| GET /v8/management/oauth/auth-url | Начинает вход по `provider`. |  | Если provider не задан, ответ — 400 `provider is required`. Если он неизвестен и плагин его не обрабатывает, ответ — 404 `provider_not_found`. |
| GET /v8/management/oauth/callback | Завершает обратный вызов параметрами запроса. |  | Ключ управления не требуется. `state` обязателен. Нужен хотя бы один из `code` и `error`. |
| GET /v8/management/oauth/status | Читает состояние сеанса. |  | Недопустимый state — 400 `invalid state`. Если state неизвестен или истёк, HTTP всё равно 200, а `status` в теле — `error`. При завершении `status` равен `ok`. Пока ожидается — `wait`. |
| POST /v8/management/oauth/callback | Завершает обратный вызов из JSON. |  | Если тело нельзя связать, ответ — 400 `invalid body`. Если `redirect_url` нельзя разобрать, ответ — 400 `invalid redirect_url`. |
| POST /v8/management/oauth/import | Импортирует по `provider`. |  | Если provider не задан, ответ — 400 `provider is required`. Если это не `vertex`, ответ — 404 `provider_not_found`. |

## 5. Типичные ошибки и границы

State в обратном вызове должен всё ещё быть ожидающим сеансом. Неизвестный или истёкший даёт 404 `unknown or expired state`. Уже завершённый даёт 409 `oauth flow is already completed`. Провайдер, не совпадающий с сеансом, даёт 400 `provider does not match state`. Если у сеанса уже есть состояние ошибки, ответ — 409, а `error` в теле — это состояние. Неподдерживаемая строка провайдера даёт 400 `unsupported provider`. Отмена допустимого, но несуществующего state всё равно возвращает 200, но `cancelled` равен false.

## 6. Связанные возможности

Загрузка уже существующего JSON описана в разделе [Учётные данные](/ru/management/v8-credentials). Ключ — в разделе [Параметры управления](/ru/operations/management-settings).

## 7. Практический опыт

Пока нет.
