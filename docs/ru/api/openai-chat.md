---
title: OpenAI Chat
feature_ids:
  - route.v1.get-models
  - route.v1.post-chat-completions
  - route.v1.post-completions
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# OpenAI Chat

Здесь описаны OpenAI Chat Completions, Completions и список моделей по умолчанию в закреплённом коммите.

## 1. Какую задачу решает этот раздел

Эти три маршрута позволяют вызывающему через JSON, совместимый с OpenAI, перечислить модели, начать дополнение чата или начать старое текстовое дополнение. Все они висят на группе `/v1`.

## 2. Когда применимо и чего здесь нет

Все три маршрута сначала проходят проверку клиентского ключа. Как записывать ключ и безопасный режим примерных ключей, описано в разделе [Клиентские ключи](/ru/api/access). При срабатывании безопасного режима запрос возвращает 403 до входа в обработчик этой страницы.

Запрос одной модели здесь не описывается. `GET /v1/models/*model` находится в разделе [Прочие конечные точки](/ru/api/openai-other). Claude Messages, Gemini и Responses здесь нет.

`model` должна быть моделью, которую текущий процесс может маршрутизировать. Новые имена моделей здесь не добавляются.

## 3. Как настроить или вызвать

Список моделей:

```bash
curl https://example.invalid/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Дополнение чата. SSE возвращает только `stream`, равный логическому JSON `true`. Пропуск или другое значение возвращает одно тело JSON.

```bash
curl https://example.invalid/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>","stream":false}'
```

Старое дополнение точно так же считает потоковым только логический JSON `true` у `stream`. Если `prompt` — пустая строка, пользовательский текст для выполнения — `Complete this:`.

```bash
curl https://example.invalid/v1/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>","prompt":"Continue.","stream":false}'
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно. Пустая ячейка означает, что поле — пустая строка.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| route.v1.get-models | `GET /v1/models`, возвращает сейчас видимые модели. |  | Выбор формата — в разделе 5. Обычный список OpenAI сохраняет только `id`, `object`, `created` и `owned_by`. Внешний объект — `{"object":"list","data":[...]}`. |
| route.v1.post-chat-completions | `POST /v1/chat/completions`. |  | Логический JSON `stream: true` идёт через SSE, иначе возвращается одно тело JSON. Если нет `messages`, но есть `input` или `instructions`, тело Responses сначала преобразуется в Chat Completions и затем выполняется. |
| route.v1.post-completions | `POST /v1/completions`. |  | Логический JSON `stream: true` идёт через SSE. Пустой `prompt` становится пользовательским текстом `Complete this:`. У не потокового ответа `object` равен `text_completion`. |

`POST /v1/completions` переносит в выполнение уже присутствующие в запросе `model`, `max_tokens`, `temperature`, `top_p`, `frequency_penalty`, `presence_penalty`, `stop`, `stream`, `logprobs`, `top_logprobs` и `echo`. Поля, которых нет, этот маршрут не дополняет.

## 5. Типичные ошибки и границы

Если прочитать тело запроса не удалось, оба `POST` возвращают статус этой ошибки чтения. Если его нельзя классифицировать, статус — 400. `error.type` тела равен `invalid_request_error`, а `error.message` начинается с `Invalid request:`.

`GET /v1/models` выбирает формат каталога по запросу:

- Если `User-Agent` содержит `grok-shell`, возвращается каталог Grok Shell. Сравнение не зависит от регистра.
- Если в строке запроса есть ключ `client_version`, даже с пустым значением, возвращается клиентский каталог Codex. Ошибка кодирования возвращает 500. `error.type` равен `server_error`, сообщение начинается с `Failed to encode model list:`.
- Если запрос несёт `Anthropic-Version` или `User-Agent` начинается с `claude-cli`, возвращается список моделей Claude.
- В остальных случаях возвращается список OpenAI выше.

При включённом Home `client_version` использует клиентский каталог Codex режима Home, а остальные списки — каталог моделей Home. Недоступный центр управления возвращает 503. `error.type` равен `server_error`, `error.message` равен `home control center unavailable`. Неудачное получение каталога из Home возвращает 502. `error.type` равен `server_error`. Если Home помечает результат как ошибку аутентификации, статус следует этому результату, а `error.type` равен `authentication_error`.

Когда требуется одна модель, 502 возвращается только при неудачном `json.Unmarshal` всего каталога. Тело — `{"error":{"message":"Invalid model catalog","type":"api_error"}}`. Если каталог — допустимый JSON, но нет массива `data` или `models`, ответ — 404 с телом `{"error":{"message":"Model not found","type":"invalid_request_error","code":"model_not_found"}}`. Путь списка на этой странице в эту ветку не идёт. Он напрямую записывает каталог.

## 6. Связанные возможности

Одна модель описана в разделе [Прочие конечные точки](/ru/api/openai-other). Клиентский ключ — в разделе [Клиентские ключи](/ru/api/access). Responses — в разделе [Responses](/ru/api/responses).

## 7. Практический опыт

- [Сопоставьте имя модели клиента с настоящей моделью через псевдоним](/ru/experience/accounts#exp-accounts-alias-client-model)
- [Исключите модель на одной учётной записи](/ru/experience/accounts#exp-accounts-exclude-model)
- [Совместимая модель появляется в списке только после записи в конфигурацию](/ru/experience/accounts#exp-accounts-list-compat-models)
- [Изображения Antigravity идут через дополнение чата](/ru/experience/api#exp-api-antigravity-image-chat)
- [Не переводите через дополнение чата, если протокол upstream можно вызвать напрямую](/ru/experience/api#exp-api-avoid-chat-translation)
- [Поток дополнения чата заканчивается DONE](/ru/experience/api#exp-api-chat-done-marker)
- [Модель диалога с изображением всё равно идёт через дополнение чата](/ru/experience/api#exp-api-chat-image-model)
- [Дополнение чата отдаёт мышление потоком только при переданном reasoning effort](/ru/experience/api#exp-api-chat-reasoning-effort)
- [Совместимые учётные данные всегда вызывают дополнение чата](/ru/experience/api#exp-api-compat-always-chat)
- [Опустите top_p, когда Copilot идёт через /v1](/ru/experience/api#exp-api-copilot-chat-sampling)
- [Сторонний DeepSeek не заполняет поля мышления OpenAI](/ru/experience/api#exp-api-deepseek-no-openai-thinking)
- [Аудио Gemini идёт через дополнение чата](/ru/experience/api#exp-api-gemini-audio-chat)
- [Не ждите, что прокси допишет текст рассуждения, которого нет в каталоге](/ru/experience/api#exp-api-no-synthetic-reasoning)
- [Сводка рассуждения появляется только когда запрос её требует](/ru/experience/api#exp-api-reasoning-summary-vs-effort)
- [Передавайте клиентский ключ при вызове публичного маршрута](/ru/experience/api#exp-api-require-client-key)
- [Перезапустите после удаления учётных данных, чтобы обновился список моделей](/ru/experience/api#exp-api-restart-after-auth-removal)
- [Клиент использует id модели из каталога](/ru/experience/api#exp-api-use-listed-model-id)
- [Не отправляйте уровень мышления, который модель отклоняет](/ru/experience/configuration#exp-configuration-reject-minimal-effort)
- [Выберите уровень мышления суффиксом в скобках](/ru/experience/configuration#exp-configuration-thinking-suffix)
- [Видимые модели определяются закреплённым каталогом](/ru/experience/introduction#exp-introduction-catalog-is-authoritative)
- [Выключите охлаждение, чтобы учётные данные оставались выбираемыми](/ru/experience/routing#exp-routing-disable-cooling)
- [gpt-image-2 вызывается через дополнение чата после переопределения](/ru/experience/routing#exp-routing-gpt-image-override)
