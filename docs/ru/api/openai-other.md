---
title: Прочие конечные точки
feature_ids:
  - route.v1.get-models-model
  - route.v1.post-alpha-search
  - route.management-html.get
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Прочие конечные точки

Здесь описаны три публичные точки входа закреплённого коммита, которые ещё не отнесены к другим страницам вызова: одна модель, `/v1/alpha/search` и страница панели управления.

## 1. Какую задачу решает этот раздел

`GET /v1/models/*model` берёт одну запись из того же каталога моделей. `POST /v1/alpha/search` передаёт поисковый запрос Codex выбранным учётным данным Codex. `GET /management.html` возвращает файл панели управления. Он не входит в группу `/v1`.

## 2. Когда применимо и чего здесь нет

Запрос модели и поиск сначала проходят проверку клиентского ключа. Ключ и безопасный режим примерных ключей описаны в разделе [Клиентские ключи](/ru/api/access). `GET /management.html` регистрируется без этой проверки клиентского ключа.

Полный список моделей описан в разделе [OpenAI Chat](/ru/api/openai-chat). `/backend-api/codex/alpha/search` использует тот же обработчик поиска. Описание — в разделе [Responses](/ru/api/responses). Ключ управления, API управления и адрес репозитория панели на этой странице не описаны.

## 3. Как настроить или вызвать

Одна модель. Сегмент пути — `id` записи каталога. Если у записи нет `id`, сравнивается `slug`.

```bash
curl https://example.invalid/v1/models/<已登记的模型 ID> \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Поиск. Читаются необязательные поля JSON `id` и `model`. Если `id` после удаления пробелов непустой, он используется как `X-Session-ID` для выбора учётных данных.

```bash
curl https://example.invalid/v1/alpha/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>"}'
```

Панель управления:

```bash
curl -I https://example.invalid/management.html
```

Если безопасный режим примерных ключей уже включён, открывайте панель, которую ещё можно настроить, через `/management.html?safe-mode=configure`. `GET` или `HEAD` без этого параметра сначала становится страницей предупреждения.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно. Пустая ячейка означает, что поле — пустая строка.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| route.v1.get-models-model | `GET /v1/models/*model`. |  | Весь сегмент после удаления начальной косой черты — искомый ID модели. Формат каталога совпадает с `GET /v1/models`, но обратно записывается только совпавшая запись JSON. |
| route.v1.post-alpha-search | `POST /v1/alpha/search`. |  | Читается не больше 16 MiB. Если тело разбирается как объект JSON, перед пересылкой удаляются `prompt_cache_key` и `prompt_cache_retention`. |
| route.management-html.get | `GET /management.html`. |  | Не проходит через промежуточный слой клиентского ключа. Если файла нет, предпринимается попытка скачать панель. Неудачная загрузка всё равно 404. |

Поиск требует base URL для учётных данных Codex в форме API key и пересылает на `/alpha/search` под этим адресом. Учётные данные OAuth идут в поиск Codex upstream. Если цель маршрутизации модели не `codex`, запрос не отправляется.

## 5. Типичные ошибки и границы

Маршрут одной модели возвращает 502 только когда `json.Unmarshal` всего каталога не удаётся. Тело — `{"error":{"message":"Invalid model catalog","type":"api_error"}}`. Если каталог — допустимый JSON, но нет массива `data` или `models`, либо нет записи, чей `id` или `slug` совпадает с путём, ответ — 404 с телом `{"error":{"message":"Model not found","type":"invalid_request_error","code":"model_not_found"}}`.

Выбор формата списка и статусы ошибок Home совпадают с `GET /v1/models`. См. [OpenAI Chat](/ru/api/openai-chat). Каталог Home или Grok Shell тоже сначала образует список, затем берёт одну запись по `id` или `slug`.

Статусы поиска совпадают с `/backend-api/codex/alpha/search`: недоступный менеджер аутентификации — 503 `Codex auth manager unavailable`; нет учётных данных — 503 `Codex auth unavailable`; у учётных данных API key нет base URL — 503 `Codex Alpha Search API key base URL unavailable`. Если чтение тела запроса не удалось и его нельзя классифицировать, статус — 400, а `error` равен `Failed to read search request`. Если выбор или маршрутизация модели не удались и их нельзя классифицировать, статус — 503. Если запрос upstream или чтение тела upstream не удались и их нельзя классифицировать, статус — 502, а `error` последнего равен `Failed to read Codex search response`. После того как запрос дошёл до upstream, код состояния, тело и `Content-Type` upstream записываются как есть. `Retry-After`, который несёт ошибка выбора, добавляется к ответу.

`GET /management.html` возвращает 404 без тела JSON, когда конфигурация пуста, включён Home или панель управления выключена. Пустой путь панели, либо отсутствующий файл, который нельзя скачать, тоже 404. Другая ошибка при чтении состояния файла возвращает 500. При успехе возвращается содержимое файла. Оно не оборачивается в JSON.

## 6. Связанные возможности

Список моделей описан в разделе [OpenAI Chat](/ru/api/openai-chat). Поиск по псевдониму Codex — в разделе [Responses](/ru/api/responses). Клиентский ключ — в разделе [Клиентские ключи](/ru/api/access). Как пользоваться панелью управления — в разделе [Web UI](/ru/management/webui).

## 7. Практический опыт

- [Сбросьте учётную запись Codex со страницы управления](/ru/experience/management#exp-management-reset-codex-from-panel)
- [Вход в управление использует secret-key](/ru/experience/operations#exp-operations-management-secret)
- [После выключения панели нет хешированного адреса управления](/ru/experience/operations#exp-operations-panel-route-is-html)
- [Сделайте файлы страницы управления загружаемыми](/ru/experience/routing#exp-routing-management-page-download)
