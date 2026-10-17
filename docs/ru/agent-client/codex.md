---
title: Codex
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Codex

Здесь описано, как направить базовый адрес провайдера и ключ доступа Codex на этот прокси и какие зарегистрированные конечные точки вызываются при `wire_api = "responses"`.

## 1. Какую задачу решает этот раздел

Codex может отправлять запросы Responses пользовательского провайдера на этот прокси. Ключ доступа по-прежнему является клиентским ключом этого прокси. Каталог моделей, Responses, сжатие и необязательный WebSocket попадают на уже зарегистрированные маршруты.

## 2. Когда применимо и чего здесь нет

Эта страница меняет только собственный `config.toml` Codex и, в режиме API, клиентский ключ в `auth.json`. Она не выполняет вход в Codex upstream и не меняет переключатели каталога в `client.codex`. Эти переключатели описаны в разделе [Каталог клиента Codex](/ru/routing/client).

Здесь не задаются политика подтверждения, песочница, сила рассуждения или конкретное имя модели. Модель должна быть ID, который уже есть в текущем каталоге. Если голос не используется, не настраивайте базовый адрес реального времени.

## 3. Как настроить или вызвать

Оба способа задают базовый адрес провайдера `https://example.invalid/v1` и `wire_api` равным `responses`. Разница только в том, где лежит ключ доступа.

Чтобы передать ключ этого прокси в заголовке и сохранить собственный файл входа Codex:

```toml
model_provider = "cliproxyapi"
model = "<已登记的模型 ID>"

[model_providers.cliproxyapi]
name = "cliproxyapi"
base_url = "https://example.invalid/v1"
wire_api = "responses"
requires_openai_auth = true
http_headers = { "X-Api-Key" = "YOUR_API_KEY" }
```

В этом способе не заменяйте материал входа ChatGPT клиентским ключом. `requires_openai_auth = true` не отправляет `YOUR_API_KEY` на этот прокси автоматически, поэтому нужен `X-Api-Key` выше.

Если вызов идёт ключом API, запишите `~/.codex/auth.json` так:

```json
{
  "OPENAI_API_KEY": "YOUR_API_KEY"
}
```

Соответствующий провайдер больше не добавляет отдельный `X-Api-Key`:

```toml
model_provider = "cliproxyapi"
model = "<已登记的模型 ID>"

[model_providers.cliproxyapi]
name = "cliproxyapi"
base_url = "https://example.invalid/v1"
wire_api = "responses"
requires_openai_auth = true
```

`YOUR_API_KEY` должен полностью совпадать с одним настроенным клиентским ключом. Прокси по очереди смотрит `Authorization`, `X-Goog-Api-Key`, `X-Api-Key` и параметры запроса `key`, `auth_token`. Если одно значение не совпало, проверка продолжается на следующих. Достаточно любого одного совпадения.

Когда `base_url` равен `https://example.invalid/v1`, а `wire_api` равен `responses`, клиент вызывает:

| Метод и путь | route ID |
| --- | --- |
| `GET /v1/models` | `route.v1.get-models` |
| `POST /v1/responses` | `route.v1.post-responses` |
| `GET /v1/responses` | `route.v1.get-responses` |
| `POST /v1/responses/compact` | `route.v1.post-responses-compact` |

Запрос каталога моделей содержит параметр запроса `client_version`. Как только этот ключ присутствует, `GET /v1/models` возвращает клиентский каталог Codex. `GET /v1/responses` используется только когда клиент включает WebSocket, например задавая `supports_websockets` равным `true`.

Если клиент обращается к корневому адресу этого прокси по официальному пути бэкенда Codex, а не к базовому адресу провайдера с `/v1`, те же обработчики зарегистрированы и здесь:

| Метод и путь | route ID |
| --- | --- |
| `POST /backend-api/codex/responses` | `route.backend-api.post-codex-responses` |
| `GET /backend-api/codex/responses` | `route.backend-api.get-codex-responses` |
| `POST /backend-api/codex/responses/compact` | `route.backend-api.post-codex-responses-compact` |

Пользовательская конфигурация провайдера выше эти три маршрута не вызывает. Не записывайте `base_url` одновременно как корень и как `/v1`.

Голос не обязателен. Только если клиенту Codex действительно нужен вызов реального времени, направьте базовые адреса реального времени на тот же префикс `/v1`:

```toml
experimental_realtime_webrtc_call_base_url = "https://example.invalid/v1"
experimental_realtime_ws_base_url = "https://example.invalid/v1"
```

Установка вызова тогда использует `POST /v1/realtime` (`route.v1.post-realtime`), `POST /v1/realtime/calls` (`route.v1.post-realtime-calls`), `GET /v1/realtime` (`route.v1.get-realtime`) и `GET /v1/realtime/calls/:call_id` (`route.v1.get-realtime-calls-call-id`). Краткоживущий ключ — это `POST /v1/realtime/client_secrets` (`route.v1.post-realtime-client-secrets`). Маршруты перевода, транскрипции и SIP сейчас возвращают 501. Не считайте их рабочими шагами.

## 4. Подробности

Эти поля принадлежат Codex. Это не ключи YAML данного прокси.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| `model_providers.cliproxyapi.base_url` | Базовый адрес провайдера Responses. |  | На этой странице пишется `https://example.invalid/v1`. Клиент дописывает `/responses`, `/responses/compact` и `/models`. |
| `wire_api` | Протокол провайдера. |  | Здесь записывается только `responses`. Не меняйте его на дополнение чата, иначе маршруты Responses из таблицы выше не вызываются. |
| `X-Api-Key` в `http_headers` | Клиентский ключ, передаваемый в заголовке. |  | Значение — `YOUR_API_KEY`. Если он присутствует вместе с `Authorization`, достаточно любого одного настроенного ключа. |
| `OPENAI_API_KEY` | Клиентский ключ, который Codex в режиме API помещает в `Authorization`. |  | Записывайте его в `auth.json` только в режиме API. Значение по-прежнему `YOUR_API_KEY`, а не ключ upstream. |
| `requires_openai_auth` | Читает ли Codex собственный `auth.json`. |  | `true` не заменяет ключ этого прокси. В режиме заголовка нужно ещё добавить `X-Api-Key`. |
| `supports_websockets` | Обновлять ли WebSocket Responses. |  | Задавайте `true` только когда это нужно. Это соответствует `GET /v1/responses`. |
| `experimental_realtime_webrtc_call_base_url` | Базовый адрес WebRTC реального времени. |  | Не задавайте, если голос не используется. При задании используйте `https://example.invalid/v1`. |
| `experimental_realtime_ws_base_url` | Базовый адрес WebSocket реального времени. |  | То же, что в предыдущей строке. Не направляйте его на незарегистрированный путь. |

Когда присутствует параметр запроса `client_version`, `GET /v1/models` использует клиентский каталог Codex. При включённом Home используется каталог Codex режима Home. `Session-Id` распознаётся как сеанс Codex. Это не маршрут.

## 5. Типичные ошибки и границы

Если ни один принимаемый ключ не передан, ответ — 401 с телом `{"error":"Missing API key"}`. Если ни одно кандидатное значение не совпало, ответ — 401 с телом `{"error":"Invalid API key"}`. Один только вход ChatGPT без `X-Api-Key` или `OPENAI_API_KEY` попадает в один из этих двух ответов 401. Когда `access.api-keys` пуст, клиентский ключ больше не проверяется.

При срабатывании безопасного режима примерных ключей и `/v1`, и `/backend-api/codex` до входа в обработчик возвращают 403 и устанавливают `X-CPA-SAFE-MODE: example-api-key`.

`POST /v1/responses` возвращает SSE только при логическом JSON `stream: true`. `POST /v1/responses/compact` при логическом JSON `stream: true` возвращает 400 с текстом `Streaming not supported for compact responses`. `GET /v1/responses` должен быть обновлением WebSocket. Неудачное обновление не начинает сеанс. Объекты ошибок реального времени и 501 описаны в разделе [Сеансы реального времени](/ru/api/realtime).

## 6. Связанные возможности

Ключ описан в разделе [Клиентские ключи](/ru/api/access). Responses и псевдонимы `/backend-api/codex` — в разделе [Responses](/ru/api/responses). Формат каталога — в разделе [OpenAI Chat](/ru/api/openai-chat). Вызовы реального времени — в разделе [Сеансы реального времени](/ru/api/realtime). Переключатели `apply_patch` и нескольких агентов в каталоге — в разделе [Каталог клиента Codex](/ru/routing/client). Привязка сеанса — в разделе [Стратегия маршрутизации](/ru/routing/strategy).

## 7. Практический опыт

Пока нет.
