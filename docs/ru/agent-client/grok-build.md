---
title: Grok Build
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Grok Build

Здесь описано, как направить адрес каталога моделей и ключ доступа Grok Build на этот прокси и какие зарегистрированные конечные точки он вызывает.

## 1. Какую задачу решает этот раздел

Grok Build задаёт адрес списка моделей и базовый адрес API в собственной конфигурации. После указания на этот прокси запрос каталога отвечает `GET /v1/models` каталогом Grok Shell. У каждой записи каталога `api_backend` равен `responses`, а последующий диалог идёт маршрутом Responses.

## 2. Когда применимо и чего здесь нет

Эта страница меняет только ключ API в `~/.grok/auth.json` и конечные точки в `~/.grok/config.toml`. Она не выполняет вход в xAI upstream и не меняет учётные данные `api-keys.xai` или `oauth` этого прокси.

Пользователь, почта и срок хранения в файле учётной записи не являются клиентским ключом. Здесь они не записываются. Модель должна быть ID, который уже есть в каталоге Grok Shell. Ключ описан в разделе [Клиентские ключи](/ru/api/access).

## 3. Как настроить или вызвать

`~/.grok/auth.json`:

```json
{
  "xai::api_key": {
    "key": "YOUR_API_KEY",
    "auth_mode": "api_key"
  }
}
```

`~/.grok/config.toml`:

```toml
[features]
remote_fetch = true

[endpoints]
models_base_url = "https://example.invalid/v1"
models_list_url = "https://example.invalid/v1/models"
```

`YOUR_API_KEY` должен быть настроенным клиентским ключом. Прокси принимает `Authorization: Bearer YOUR_API_KEY` и `X-Api-Key: YOUR_API_KEY`.

При `remote_fetch = true` клиент загружает каталог по `models_list_url`, затем отправляет запросы Responses на `models_base_url`:

| Метод и путь | route ID |
| --- | --- |
| `GET /v1/models` | `route.v1.get-models` |
| `POST /v1/responses` | `route.v1.post-responses` |

Если `User-Agent` содержит `grok-shell`, `GET /v1/models` возвращает каталог Grok Shell, а не список OpenAI. Этот каталог записывает `api_backend` каждой модели как `responses`, поэтому базовый адрес диалога — `https://example.invalid/v1`, а путь — `/responses`.

## 4. Подробности

Эти поля принадлежат Grok Build. Это не ключи YAML данного прокси.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| `xai::api_key.key` | Клиентский ключ, отправляемый этому прокси. |  | Значение — `YOUR_API_KEY`. `auth_mode` использует `api_key`. |
| `features.remote_fetch` | Загружать ли удалённый каталог по настроенному адресу. |  | `models_list_url` запрашивается только при значении `true`. |
| `endpoints.models_list_url` | Полный URL каталога моделей. |  | Должен быть `https://example.invalid/v1/models`, что соответствует `route.v1.get-models`. |
| `endpoints.models_base_url` | Базовый адрес Responses. |  | Пишите `https://example.invalid/v1`. Клиент дописывает `/responses`, что соответствует `route.v1.post-responses`. |

Сравнение `grok-shell` не зависит от регистра и выполняется раньше параметра запроса `client_version`. Если `User-Agent` содержит `grok-shell`, `GET /v1/models` всё равно возвращает каталог Grok Shell, даже когда в запросе есть `client_version`, и `api_backend` каждой модели по-прежнему `responses`. Только если запрос не является Grok Shell, наличие `client_version` переключает ответ на клиентский каталог Codex.

## 5. Типичные ошибки и границы

Если ключ не передан, ответ — 401 с телом `{"error":"Missing API key"}`. Если ключ не совпадает, ответ — 401 с телом `{"error":"Invalid API key"}`. Когда `access.api-keys` пуст, проверка больше не выполняется. При срабатывании безопасного режима примерных ключей эти два пути `/v1` возвращают 403.

Если `models_list_url` не равен `/v1/models`, он не попадает в `route.v1.get-models`. Если `models_base_url` содержит лишний `/v1` или не содержит `/v1`, диалог не попадает в `POST /v1/responses`.

Если `User-Agent` не содержит `grok-shell`, тот же `GET /v1/models` не возвращает каталог Grok Shell. `POST /v1/responses` возвращает SSE только при логическом JSON `stream: true`. Конфигурация этой страницы не вызывает `GET /v1/responses` и не вызывает псевдонимы под `/backend-api/codex`.

## 6. Связанные возможности

Ключ описан в разделе [Клиентские ключи](/ru/api/access). Выбор формата каталога — в разделе [OpenAI Chat](/ru/api/openai-chat). Статус и тела Responses — в разделе [Responses](/ru/api/responses).

## 7. Практический опыт

Пока нет.
