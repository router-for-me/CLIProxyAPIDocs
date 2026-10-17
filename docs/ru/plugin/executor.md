---
title: Исполнитель
feature_ids:
  - plugin.provider-executor.identifier
  - plugin.provider-executor.execute
  - plugin.provider-executor.execute-stream
  - plugin.provider-executor.count-tokens
  - plugin.provider-executor.http-request
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Исполнитель

`ProviderExecutor` отправляет запрос в upstream или локальный бэкенд и предоставляет поток, подсчёт и исходный HTTP.

## 1. Какую задачу решает этот раздел

После того как хост выбрал учётные данные и протокол, плагин выполняет непотоковое выполнение, потоковое выполнение, подсчёт токенов или один собственный HTTP-запрос исполнителя.

## 2. Когда применимо и чего здесь нет

Все пять методов принадлежат этому одному интерфейсу. Преобразование протокола — не обязанность исполнителя. См. страницы запроса и ответа. HTTP upstream должен использовать `HTTPClient` из параметров, а не обходить хост из плагина. См. [Callback хоста](/ru/plugin/host-callbacks).

Исполнитель должен объявить хотя бы один входной формат и один выходной. Пустой `executor_model_scope` считается `both`. Нераспознанное значение тоже считается `both`. `both` одновременно покрывает статические модели и модели учётных данных OAuth. `static` — только статические модели не OAuth. `oauth` — только модели учётных данных OAuth.

Имена форматов сначала нормализуются по псевдонимам: `chat-completions`, `chat_completions`, `openai-chat-completions` и `openai_chat_completions` — все это `openai`. `responses`, `openai-responses` и `openai_responses` — все это `openai-response`. `anthropic` — это `claude`. Пустая строка и `none` отбрасываются. Остальные имена используются после обрезки крайних пробелов. Публичные форматы в `sdk/translator` также включают `gemini`, `codex`, `antigravity` и `interactions`.

## 3. Как настроить или вызвать

Задайте `capabilities.executor` равным true и запишите область и форматы.

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-executor",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-executor"
    },
    "capabilities": {
      "executor": true,
      "executor_model_scope": "both",
      "executor_input_formats": ["openai"],
      "executor_output_formats": ["openai"]
    }
  }
}
```

```go
Identifier() string
Execute(context.Context, ExecutorRequest) (ExecutorResponse, error)
ExecuteStream(context.Context, ExecutorRequest) (ExecutorStreamResponse, error)
CountTokens(context.Context, ExecutorRequest) (ExecutorResponse, error)
HttpRequest(context.Context, ExecutorHTTPRequest) (ExecutorHTTPResponse, error)
```

Имена методов ABI — `executor.identifier`, `executor.execute`, `executor.execute_stream`, `executor.count_tokens` и `executor.http_request`. Поле результата идентификатора — `identifier`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.provider-executor.identifier | `Identifier`, ABI `executor.identifier`. |  | Без параметров. Возвращает строку. Ошибка или пустое значение считаются пустой строкой. |
| plugin.provider-executor.execute | `Execute`, ABI `executor.execute`. |  | Параметр `ExecutorRequest`, возврат `ExecutorResponse`. |
| plugin.provider-executor.execute-stream | `ExecuteStream`, ABI `executor.execute_stream`. |  | Параметр `ExecutorRequest`, возврат `ExecutorStreamResponse`. |
| plugin.provider-executor.count-tokens | `CountTokens`, ABI `executor.count_tokens`. |  | Параметр `ExecutorRequest`, возврат `ExecutorResponse`. |
| plugin.provider-executor.http-request | `HttpRequest`, ABI `executor.http_request`. |  | Параметр `ExecutorHTTPRequest`, возврат `ExecutorHTTPResponse`. |
| ExecutorRequest.AuthID | ID выбранных учётных данных. |  | Строка. |
| ExecutorRequest.AuthProvider | Провайдер учётных данных. |  | Строка. |
| ExecutorRequest.Model | Запрошенная модель. |  | Строка. |
| ExecutorRequest.Format | Целевой формат протокола. |  | Должен попадать в объявленные форматы. |
| ExecutorRequest.Stream | Потоковый ли запрос. |  | Логическое значение. |
| ExecutorRequest.Alt | Запасной маршрут или суффикс режима. |  | Строка. |
| ExecutorRequest.Headers | Заголовки, переданные исполнителю. |  | `http.Header`. |
| ExecutorRequest.Query | Параметры запроса. |  | `url.Values`. |
| ExecutorRequest.OriginalRequest | Исходное тело клиента. |  | `[]byte`. |
| ExecutorRequest.SourceFormat | Исходный протокол клиента. |  | Строка. |
| ExecutorRequest.Payload | Уже преобразованный payload провайдера. |  | `[]byte`. |
| ExecutorRequest.Metadata | Мешок расширений. |  | `map[string]any`. |
| ExecutorRequest.StorageJSON | Хранилище плагина для этих учётных данных. |  | `[]byte`. |
| ExecutorRequest.AuthMetadata | Метаданные учётных данных, которые хост может менять. |  | `map[string]any`. |
| ExecutorRequest.AuthAttributes | Неизменяемые атрибуты. |  | `map[string]string`. |
| ExecutorRequest.HTTPClient | HTTP-клиент хоста. |  | JSON игнорирует. |
| ExecutorResponse.Payload | Исходное тело ответа. |  | `[]byte`. |
| ExecutorResponse.Headers | Заголовки ответа для пересылки или проверки. |  | `http.Header`. |
| ExecutorResponse.Metadata | Данные расширения исполнителя. |  | `map[string]any`. |
| ExecutorStreamResponse.Headers | Заголовки ответа, имеющиеся до начала блоков. |  | `http.Header`. |
| ExecutorStreamResponse.Chunks | Потоковые блоки, пока канал не закрыт. |  | Элементы — `ExecutorStreamChunk`. |
| ExecutorStreamChunk.Payload | Один блок исходных байтов. |  | `[]byte`. |
| ExecutorStreamChunk.Err | Ошибка, приложенная к этому блоку. |  | `error`. |
| ExecutorHTTPRequest.AuthID | ID выбранных учётных данных. |  | Строка. |
| ExecutorHTTPRequest.AuthProvider | Провайдер учётных данных. |  | Строка. |
| ExecutorHTTPRequest.Method | Метод HTTP. |  | Строка. |
| ExecutorHTTPRequest.URL | Абсолютный адрес upstream. |  | Строка. |
| ExecutorHTTPRequest.Headers | Заголовки запроса. |  | `http.Header`. |
| ExecutorHTTPRequest.Body | Исходное тело. |  | `[]byte`. |
| ExecutorHTTPRequest.StorageJSON | Хранилище учётных данных плагина. |  | `[]byte`. |
| ExecutorHTTPRequest.Metadata | Метаданные, которые хост может менять. |  | `map[string]any`. |
| ExecutorHTTPRequest.Attributes | Неизменяемые атрибуты. |  | `map[string]string`. |
| ExecutorHTTPRequest.HTTPClient | HTTP-клиент хоста. |  | JSON игнорирует. |
| ExecutorHTTPResponse.StatusCode | Код состояния upstream. |  | Целое число. |
| ExecutorHTTPResponse.Headers | Заголовки ответа upstream. |  | `http.Header`. |
| ExecutorHTTPResponse.Body | Исходное тело ответа. |  | `[]byte`. |

## 5. Типичные ошибки и границы

Если не осталось ни одного входного формата, ошибка — `plugin executor <identifier> declares no input formats`. Если формат запроса не входит в объявленные, ошибка — `plugin executor <identifier> does not support input format "<format>"`. Выходным форматам соответствуют `declares no output formats` и `does not support output format`.

Когда метод возвращает `error`, опущенный или равный 0 ABI `http_status` считается HTTP 500. `HTTPClient` не входит в JSON.

## 6. Связанные возможности

Отправка запроса в этот исполнитель описана в разделе [Маршрутизатор моделей](/ru/plugin/model-router). Исходящий HTTP — в разделе [Callback хоста](/ru/plugin/host-callbacks).

## 7. Практический опыт

Пока нет.

