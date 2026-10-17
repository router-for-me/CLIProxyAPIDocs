---
title: PI
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# PI

Здесь описано, как официальным провайдером PI передать базовый адрес и ключ доступа в CLIProxyAPI и какие зарегистрированные конечные точки вызывает этот провайдер.

## 1. Какую задачу решает этот раздел

`@router-for-me/pi-cliproxyapi-provider` читает каталог моделей с этого прокси и отправляет запросы вывода на псевдоним Codex Responses. Базовый адрес — корневой адрес этого прокси, ключ доступа — клиентский ключ. Когда транспорт равен `websocket-cached`, продолжение идёт через зарегистрированный WebSocket.

## 2. Когда применимо и чего здесь нет

Сначала установите этот провайдер, затем войдите в PI. Здесь не настраиваются Fast и пауза запроса и не меняются переключатели каталога `client.codex`. Эти переключатели описаны в разделе [Каталог клиента Codex](/ru/routing/client).

Для входа используйте корневой адрес `https://example.invalid`. Не считайте `/v1` или `/backend-api` базовым адресом, который нужно вводить вручную. Провайдер нормализует их сам. Ключ описан в разделе [Клиентские ключи](/ru/api/access).

## 3. Как настроить или вызвать

Установка:

```bash
pi install npm:@router-for-me/pi-cliproxyapi-provider
```

В PI выполните `/login CLIProxyAPI` или `/login cliproxyapi` и введите:

- Базовый адрес: `https://example.invalid`
- Ключ доступа: `YOUR_API_KEY`

Затем выполните `/settings` и задайте `Transport` равным `websocket-cached`.

Без интерактивного входа можно записать `~/.pi/agent/cliproxyapi.json`:

```json
{
  "baseUrl": "https://example.invalid",
  "apiKey": "YOUR_API_KEY"
}
```

Переменные окружения `CLIPROXYAPI_BASE_URL` и `CLIPROXYAPI_API_KEY` важнее этого файла. При загрузке каталога провайдер отправляет `Authorization: Bearer YOUR_API_KEY`.

Провайдер нормализует корневой адрес в два фиксированных адреса. Каталог моделей — `https://example.invalid/v1/models?client_version=pi`, база вывода — `https://example.invalid/backend-api/`. Поэтому он вызывает:

| Метод и путь | route ID |
| --- | --- |
| `GET /v1/models` | `route.v1.get-models` |
| `POST /backend-api/codex/responses` | `route.backend-api.post-codex-responses` |
| `GET /backend-api/codex/responses` | `route.backend-api.get-codex-responses` |
| `POST /backend-api/codex/responses/compact` | `route.backend-api.post-codex-responses-compact` |

Если во входе уже есть `/v1` или `/backend-api`, вывод всё равно нормализуется к тому же `/backend-api/`, а каталог остаётся `/v1/models?client_version=pi` на корневом адресе. `websocket-cached` использует WebSocket `GET /backend-api/codex/responses`. Диалог по HTTP использует `POST` того же пути. Сжатие использует `POST /backend-api/codex/responses/compact`. После сжатия провайдер закрывает WebSocket, повторно использованный этим сеансом.

## 4. Подробности

Эти поля принадлежат провайдеру PI. Это не ключи YAML данного прокси.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| `baseUrl` | Корневой адрес этого прокси. | Если не заданы ни переменная окружения, ни файл конфигурации, провайдер использует собственное значение корневого адреса по умолчанию. Пример на этой странице записывает `https://example.invalid`. | Предпочтительнее корневой адрес. Значение с `/v1` или `/backend-api` тоже нормализуется и не переносит URL каталога. |
| `apiKey` | Клиентский ключ, отправляемый этому прокси. |  | Обязателен, если его ещё не дали `/login` или `CLIPROXYAPI_API_KEY`. Значение — `YOUR_API_KEY`, оно помещается в `Authorization: Bearer`. |
| `CLIPROXYAPI_BASE_URL` | Переменная окружения, перекрывающая `baseUrl`. |  | Если непуста, важнее файла конфигурации и адреса, сохранённого при входе. |
| `CLIPROXYAPI_API_KEY` | Переменная окружения, перекрывающая `apiKey`. |  | Если непуста, важнее файла конфигурации и ключа, сохранённого при входе. |
| `Transport` | Транспорт PI. |  | На этой странице задаётся `websocket-cached`, что соответствует `GET /backend-api/codex/responses`. |

Как только в строке запроса появляется ключ `client_version`, `GET /v1/models` возвращает клиентский каталог Codex. Значение, которое отправляет провайдер, — `pi`. `X-Slot-Session-Id` распознаётся как сеанс PI. Это не маршрут.

Проверка входа требует только HTTP 200 от запроса каталога. Пустой список моделей всё равно считается успешным входом. Ответ не 200 или сетевая ошибка требуют заново ввести базовый адрес и ключ.

## 5. Типичные ошибки и границы

Если запрос каталога не содержит `Authorization: Bearer YOUR_API_KEY` и другого настроенного ключа нет, ответ — 401 с телом `{"error":"Missing API key"}`. Если значение не совпадает, ответ — 401 с телом `{"error":"Invalid API key"}`. Провайдер считает ответ не 200 неудачным входом.

При срабатывании безопасного режима примерных ключей и `/v1`, и `/backend-api/codex` до входа в обработчик возвращают 403 и устанавливают `X-CPA-SAFE-MODE: example-api-key`. Вход поэтому не удаётся.

`POST /backend-api/codex/responses` и `POST /v1/responses` используют один обработчик: SSE возвращается только при логическом JSON `stream: true`. `POST /backend-api/codex/responses/compact` при логическом JSON `stream: true` возвращает 400. `GET /backend-api/codex/responses` должен завершить обновление WebSocket. Неудачное обновление не начинает сеанс. Когда `access.api-keys` пуст, эти маршруты больше не требуют клиентский ключ, но провайдер всё равно отправляет `Authorization`.

## 6. Связанные возможности

Ключ описан в разделе [Клиентские ключи](/ru/api/access). Обработка этих четырёх маршрутов описана в разделах [Responses](/ru/api/responses) и [OpenAI Chat](/ru/api/openai-chat). Переключатели каталога Codex — в разделе [Каталог клиента Codex](/ru/routing/client). Привязка сеанса — в разделе [Стратегия маршрутизации](/ru/routing/strategy).

## 7. Практический опыт

Пока нет.
