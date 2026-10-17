---
title: Factory Droid
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Factory Droid

Здесь описано, как задать базовый адрес и ключ доступа в пользовательской модели Factory Droid и какую зарегистрированную конечную точку вызывает каждый `provider`.

## 1. Какую задачу решает этот раздел

Droid выбирает форму запроса по `provider`. После того как базовый адрес указывает на этот прокси, а `apiKey` задан клиентским ключом, модели Anthropic идут через Messages, модели OpenAI Responses — через Responses, остальные модели, совместимые с OpenAI, — через Chat Completions. Все три пути — зарегистрированные маршруты.

## 2. Когда применимо и чего здесь нет

Текущий файл — `customModels` в `~/.factory/settings.json`. Старый `~/.factory/config.json` эта страница не сопровождает.

Здесь не настраивается Bedrock, не задаются ограничения организации и не регистрируется новое имя модели для этого прокси. `model` должен быть ID, который уже есть в текущем каталоге. Порядок принятия ключа описан в разделе [Клиентские ключи](/ru/api/access).

## 3. Как настроить или вызвать

В `customModels` запишите по одной записи на протокол. Каждый `apiKey` — это `YOUR_API_KEY`.

```json
{
  "customModels": [
    {
      "model": "<已登记的模型 ID>",
      "baseUrl": "https://example.invalid",
      "apiKey": "YOUR_API_KEY",
      "provider": "anthropic"
    },
    {
      "model": "<已登记的模型 ID>",
      "baseUrl": "https://example.invalid/v1",
      "apiKey": "YOUR_API_KEY",
      "provider": "openai"
    },
    {
      "model": "<已登记的模型 ID>",
      "baseUrl": "https://example.invalid/v1",
      "apiKey": "YOUR_API_KEY",
      "provider": "generic-chat-completion-api"
    }
  ]
}
```

`provider` определяет путь, который дописывает клиент:

| provider | Базовый адрес | Метод и путь | route ID |
| --- | --- | --- | --- |
| `anthropic` | `https://example.invalid` | `POST /v1/messages` | `route.v1.post-messages` |
| `openai` | `https://example.invalid/v1` | `POST /v1/responses` | `route.v1.post-responses` |
| `generic-chat-completion-api` | `https://example.invalid/v1` | `POST /v1/chat/completions` | `route.v1.post-chat-completions` |

Базовый адрес `anthropic` не должен содержать `/v1`. Не используйте `openai` для вызова Chat Completions. Для такой модели используйте `generic-chat-completion-api`.

`anthropic` по умолчанию помещает `apiKey` в `X-Api-Key`. Если шлюз требует `Authorization: Bearer`, добавьте к этой записи `"authMode": "bearer"`. Прокси принимает оба заголовка. `openai` и `generic-chat-completion-api` используют `Authorization: Bearer YOUR_API_KEY`.

## 4. Подробности

Эти поля принадлежат `customModels` Droid. Это не ключи YAML данного прокси.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| `model` | ID модели в теле запроса. |  | Это должен быть ID, который прокси сейчас может маршрутизировать. Новые имена моделей здесь не добавляются. |
| `baseUrl` | Базовый адрес API этой записи модели. |  | `anthropic` использует корень `https://example.invalid`. Два других используют `https://example.invalid/v1`. |
| `apiKey` | Клиентский ключ, отправляемый этому прокси. |  | Значение — `YOUR_API_KEY`. Его можно опустить, но если у прокси ключи всё ещё настроены, пропуск даёт 401. |
| `provider` | Выбирает форму запроса. |  | Используйте только три значения из таблицы выше. `openai` — это Responses, а не Chat Completions. |
| `authMode` | В каком заголовке лежит ключ для `anthropic`. |  | При пропуске или значении `provider-default` используется `X-Api-Key`. `bearer` использует `Authorization: Bearer`. Это относится только к `anthropic`, который не является Bedrock. |

`GET /v1/models` (`route.v1.get-models`) не является обязательным вызовом для этих трёх пользовательских моделей. ID пользовательской модели берётся из поля `model`.

## 5. Типичные ошибки и границы

Если ключ не передан, ответ — 401 с телом `{"error":"Missing API key"}`. Если ключа нет в `access.api-keys`, ответ — 401 с телом `{"error":"Invalid API key"}`. Когда список пуст, проверка больше не выполняется.

Если базовый адрес `anthropic` записан как `https://example.invalid/v1`, клиент ещё раз дописывает `/v1/messages`, и результат не является зарегистрированным `POST /v1/messages`. Если у `openai` в базовом адресе нет `/v1`, запрос также не попадает в `POST /v1/responses`.

`POST /v1/messages` считает отсутствующий `stream` или логический JSON `false` одним телом JSON. `POST /v1/responses` возвращает SSE только при логическом JSON `stream: true`. `POST /v1/chat/completions` точно так же считает потоковым только логический JSON `true`. Если нет `messages`, но есть `input` или `instructions`, запрос сначала преобразуется в Chat Completions.

При срабатывании безопасного режима примерных ключей эти пути `/v1` до входа в обработчик возвращают 403.

## 6. Связанные возможности

Ключ описан в разделе [Клиентские ключи](/ru/api/access). Messages — в разделе [Claude Messages](/ru/api/claude-messages). Responses — в разделе [Responses](/ru/api/responses). Chat Completions — в разделе [OpenAI Chat](/ru/api/openai-chat).

## 7. Практический опыт

Пока нет.
