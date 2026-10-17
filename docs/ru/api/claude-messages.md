---
title: Claude Messages
feature_ids:
  - route.v1.post-messages
  - route.v1.post-messages-count-tokens
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Claude Messages

Здесь описаны вызовы Claude Messages и подсчёт токенов в закреплённом коммите.

## 1. Какую задачу решает этот раздел

`POST /v1/messages` принимает JSON, совместимый с Claude, и по `stream` решает, вернуть одно тело JSON или SSE. `POST /v1/messages/count_tokens` тем же видом тела запроса возвращает результат подсчёта и не открывает поток.

## 2. Когда применимо и чего здесь нет

Оба маршрута входят в группу `/v1` и сначала проходят проверку клиентского ключа. Ключ и безопасный режим примерных ключей описаны в разделе [Клиентские ключи](/ru/api/access).

Эта страница не перечисляет модели Claude. `GET /v1/models` с `Anthropic-Version` или User-Agent `claude-cli` описан в разделе [OpenAI Chat](/ru/api/openai-chat). Gemini `countTokens` здесь нет.

Обработчик читает `model` и `stream`. Остальной JSON уходит в последующее выполнение. Этот маршрут здесь не объявляет дополнительных обязательных полей.

## 3. Как настроить или вызвать

Сообщения без потока:

```bash
curl https://example.invalid/v1/messages \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>","stream":false}'
```

Для потокового сообщения задайте `stream` логическим JSON `true`. Ответ использует SSE.

Подсчёт:

```bash
curl https://example.invalid/v1/messages/count_tokens \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>"}'
```

У ответа подсчёта `Content-Type` сначала фиксируется как `application/json`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно. Пустая ячейка означает, что поле — пустая строка.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| route.v1.post-messages | `POST /v1/messages`. |  | Если `stream` отсутствует или равен логическому JSON `false`, возвращается одно тело JSON. Любое другое присутствующее значение `stream` идёт через SSE. |
| route.v1.post-messages-count-tokens | `POST /v1/messages/count_tokens`. |  | Только JSON. `model` в теле запроса выбирает цель выполнения. |

ID модели вида `claude-fable-5-dd-` плюс перевёрнутый фрагмент до маршрутизации восстанавливается в исходное имя модели. Если результат восстановления равен исходному значению, тело запроса не меняется.

## 5. Типичные ошибки и границы

Если прочитать тело запроса не удалось, возвращается статус этой ошибки чтения. Если его нельзя классифицировать, статус — 400. `error.type` тела равен `invalid_request_error`, а `error.message` начинается с `Invalid request:`.

При ошибке выполнения внешний `type` тела ошибки Claude равен `error`. Внутренние `error.type` и `error.message` берутся из ошибки выполнения. Код состояния следует статусу в ошибке выполнения. Если статуса нет, он равен 500. Тело, напрямую возвращённое upstream, записывается с исходным статусом. Тело, распознанное как отсутствующий поток, переписывается в объект ошибки Claude с `error.details.error_code` `thread_not_found`.

Если не потоковый ответ начинается с магического числа gzip, он сначала распаковывается, а затем пишется клиенту. Если распаковка не удалась, всё равно записываются исходные байты.

Потоковый ответ возвращает 500, если нельзя получить HTTP flusher. Отдельный набор кодов потоковых ошибок здесь не задаётся. Ошибки этапа выполнения используют объект ошибки Claude выше.

## 6. Связанные возможности

Клиентский ключ описан в разделе [Клиентские ключи](/ru/api/access). Диалог OpenAI — в разделе [OpenAI Chat](/ru/api/openai-chat).

## 7. Практический опыт

- [Сопоставьте имя модели клиента с настоящей моделью через псевдоним](/ru/experience/accounts#exp-accounts-alias-client-model)
- [Claude Code использует вход Codex, а не исходный токен](/ru/experience/accounts#exp-accounts-codex-login-for-claude-code)
- [Совместимые модели сохраняют подписанное мышление](/ru/experience/accounts#exp-accounts-compat-preserves-signed-thinking)
- [Antigravity Claude идёт через messages](/ru/experience/api#exp-api-antigravity-claude-messages)
- [Claude Code должен вызывать messages](/ru/experience/api#exp-api-claude-code-messages)
- [Интерфейс подсчёта считает инструменты способом upstream](/ru/experience/api#exp-api-count-tokens-tool-shape)
- [DeepSeek требует, чтобы клиент снизил max token](/ru/experience/api#exp-api-deepseek-max-tokens)
- [Перед отправкой в Codex отбросьте неподдерживаемые поля Claude](/ru/experience/api#exp-api-drop-unsupported-claude-fields)
- [Upstream не Claude сообщает использование только в конце сообщения](/ru/experience/api#exp-api-messages-usage-at-end)
- [Усилие Opus берётся из output_config.effort](/ru/experience/api#exp-api-opus-effort-field)
- [Передавайте клиентский ключ при вызове публичного маршрута](/ru/experience/api#exp-api-require-client-key)
- [Обмен с инструментом должен нести id](/ru/experience/api#exp-api-tool-call-ids)
- [Объявите уровни мышления в записи модели](/ru/experience/configuration#exp-configuration-declare-thinking-levels)
- [Выберите уровень мышления суффиксом в скобках](/ru/experience/configuration#exp-configuration-thinking-suffix)
- [Псевдоним плюс переопределение выражают усилие Opus](/ru/experience/routing#exp-routing-alias-and-override-effort)
