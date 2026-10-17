---
title: OpenCode
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# OpenCode

Здесь описано, как направить базовый адрес и ключ доступа встроенного провайдера OpenAI в OpenCode на этот прокси и какие зарегистрированные конечные точки вызывает этот провайдер.

## 1. Какую задачу решает этот раздел

Провайдер `openai` в OpenCode по умолчанию использует совместимые с OpenAI каталог моделей и Chat Completions. После того как `baseURL` и `apiKey` указывают на этот прокси, оба вида запросов входят в зарегистрированные маршруты `/v1`.

## 2. Когда применимо и чего здесь нет

Эта страница меняет только встроенный провайдер `openai` в `~/.config/opencode/opencode.json`. Если файла нет, создайте его. Она не настраивает провайдер Anthropic и не переводит этот провайдер на Responses.

Порядок принятия ключа описан в разделе [Клиентские ключи](/ru/api/access). Модель должна быть ID, который уже есть в текущем каталоге. Дополнительный npm-провайдер здесь не устанавливается.

## 3. Как настроить или вызвать

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "openai": {
      "options": {
        "baseURL": "https://example.invalid/v1",
        "apiKey": "YOUR_API_KEY"
      }
    }
  }
}
```

`baseURL` должен содержать `/v1`. `apiKey` должен быть настроенным клиентским ключом. OpenCode помещает его в `Authorization: Bearer YOUR_API_KEY`.

Этот провайдер вызывает:

| Метод и путь | route ID |
| --- | --- |
| `GET /v1/models` | `route.v1.get-models` |
| `POST /v1/chat/completions` | `route.v1.post-chat-completions` |

Если нет `Anthropic-Version`, `User-Agent` не имеет префикса `claude-cli` и не содержит `grok-shell`, а в строке запроса нет `client_version`, `GET /v1/models` возвращает список OpenAI.

## 4. Подробности

Эти поля принадлежат OpenCode. Это не ключи YAML данного прокси.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| `provider.openai.options.baseURL` | Базовый адрес провайдера OpenAI. |  | Пишите `https://example.invalid/v1`. Клиент дописывает `/models` и `/chat/completions`. |
| `provider.openai.options.apiKey` | Клиентский ключ, отправляемый этому прокси. |  | Значение — `YOUR_API_KEY`. Прокси считает его токеном в `Authorization`. |
| `model` | Необязательный ID модели по умолчанию. |  | Если задан, это должен быть зарегистрированный ID модели. Конкретное имя здесь не указывается. |

`X-Session-Affinity`, отправленный OpenCode, распознаётся как сеанс OpenCode. Это не маршрут. Он только участвует в привязке сеанса.

## 5. Типичные ошибки и границы

Если ключ не передан, ответ — 401 с телом `{"error":"Missing API key"}`. Если ключ не совпадает, ответ — 401 с телом `{"error":"Invalid API key"}`. Когда `access.api-keys` пуст, проверка больше не выполняется. При срабатывании безопасного режима примерных ключей `/v1` возвращает 403.

Если в `baseURL` нет `/v1` или добавлен лишний `/v1`, собранный путь не является зарегистрированным путём из таблицы выше. `POST /v1/chat/completions` возвращает SSE только при логическом JSON `stream: true`. Если нет `messages`, но есть `input` или `instructions`, запрос сначала преобразуется в Chat Completions и затем выполняется.

Эта конфигурация не вызывает `POST /v1/messages` и `POST /v1/responses`.

## 6. Связанные возможности

Ключ описан в разделе [Клиентские ключи](/ru/api/access). Список моделей и Chat Completions — в разделе [OpenAI Chat](/ru/api/openai-chat). Привязка сеанса — в разделе [Стратегия маршрутизации](/ru/routing/strategy).

## 7. Практический опыт

Пока нет.
