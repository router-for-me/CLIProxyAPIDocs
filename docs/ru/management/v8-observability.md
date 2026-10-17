---
title: Наблюдаемость
feature_ids:
  - management.v8.delete-observability-logs
  - management.v8.get-observability-logs
  - management.v8.get-observability-logs-errors
  - management.v8.get-observability-logs-errors-name
  - management.v8.get-observability-logs-requests-id
  - management.v8.get-observability-usage-api-keys
  - management.v8.get-observability-usage-queue
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Наблюдаемость

## 1. Какую задачу решает этот раздел

Через API управления читать или очищать журналы приложения, перечислять или скачивать журналы ошибочных запросов, получать журнал запроса по ID и забирать очередь использования из памяти и счётчики использования ключей API.

## 2. Когда применимо и чего здесь нет

Все эти маршруты требуют ключ управления. Пишутся ли файлы, записываются ли запросы и как долго хранится использование, решает раздел [Журналы и использование](/ru/operations/observability). Эти ключи конфигурации здесь не меняются. Конфигурацию меняйте через [Management API v8](/ru/management/apiv8).

## 3. Как настроить или вызвать

Базовый адрес — `https://example.invalid`. Заголовок — `Authorization: Bearer YOUR_API_KEY`.

| Метод и путь | Назначение |
| --- | --- |
| GET /v8/management/observability/logs | Читает строки журнала приложения. |
| DELETE /v8/management/observability/logs | Удаляет прокрученные журналы и обрезает текущий журнал. |
| GET /v8/management/observability/logs/errors | Перечисляет журналы ошибочных запросов. |
| GET /v8/management/observability/logs/errors/:name | Скачивает указанный файл журнала ошибок. |
| GET /v8/management/observability/logs/requests/:id | Скачивает подходящий журнал запроса по ID запроса. |
| GET /v8/management/observability/usage/api-keys | Возвращает хранящиеся в памяти счётчики успехов, неудач и недавних запросов каждого ключа API. |
| GET /v8/management/observability/usage/queue | Забирает самые старые записи очереди использования. |

Для журнала приложения есть параметры запроса `cursor`, `limit` и `after`. Пропуск `limit` означает отсутствие обрезки по числу. Если он задан, это должно быть целое больше 0. `after`, которое не является положительным целым, считается 0 и отдельно не сообщается как ошибка. Пропуск `count` у очереди использования означает 1. Если он задан, это должно быть положительное целое.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| DELETE /v8/management/observability/logs | Очищает файлы журнала приложения. |  | Если `logging-to-file` равен false, ответ — 400 `logging to file disabled`. Каталога нет — 404 `log directory not found`. Успешное тело содержит `success: true` и `removed`. |
| GET /v8/management/observability/logs | Читает журнал приложения. |  | Тоже требует `logging-to-file` равным true. Недопустимый `limit` даёт 400 `invalid limit`. |
| GET /v8/management/observability/logs/errors | Перечисляет `error-*.log`. |  | Если `request-log` равен true, возвращается пустой `files`, а не ошибка. Отсутствующий каталог тоже даёт пустой список. |
| GET /v8/management/observability/logs/errors/:name | Скачивает один журнал ошибок. |  | Имя должно начинаться с `error-`, заканчиваться на `.log` и не содержать косую черту. Иначе это считается ненайденным или 400 `invalid log file name`. |
| GET /v8/management/observability/logs/requests/:id | Сопоставляет файл журнала по суффиксу ID запроса. |  | Нет ID — 400 `missing request ID`. Есть косая черта — 400 `invalid request ID`. Нет подходящего файла — 404. |
| GET /v8/management/observability/usage/api-keys | Сводит использование учётных данных `api_key`. |  | Если менеджер учётных данных недоступен, ответ — 503. Ключ — провайдер, а под ним использование собирается по `base_url\|api_key`. |
| GET /v8/management/observability/usage/queue | Извлекает самые старые записи использования. |  | Если `count` не положительное целое, ответ — 400 `count must be a positive integer`. Ответ — массив JSON. |

## 5. Типичные ошибки и границы

Если объект конфигурации недоступен, маршруты журналов возвращают 503 `configuration unavailable`. Если каталог журналов не настроен, ответ — 500 `log directory not configured`. `DELETE` только удаляет прокрученные журналы и обрезает файл текущего активного журнала. Другие посторонние файлы в каталоге не удаляются. Когда статистика использования выключена, в очереди нет новых данных. Использование ключей API считает только учётные данные вида `api_key` с непустым ключом.

## 6. Связанные возможности

Переключатели и срок хранения описаны в разделе [Журналы и использование](/ru/operations/observability).

## 7. Практический опыт

- [Использование остаётся только в памяти](/ru/experience/operations#exp-operations-usage-stays-in-memory)
