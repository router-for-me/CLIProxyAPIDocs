---
title: Операции маршрутизации
feature_ids:
  - management.v8.get-routing-model-definitions-channel
  - management.v8.post-routing-cooldown-reset
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Операции маршрутизации

## 1. Какую задачу решает этот раздел

Запросить статические определения моделей канала или очистить состояние квоты и охлаждения маршрутизации на одной учётной записи.

## 2. Когда применимо и чего здесь нет

Оба маршрута требуют ключ управления. Они не меняют конфигурацию `routing`. Стратегия и длительность охлаждения по-прежнему задаются страницами конфигурации маршрутизации. Очищается работающее состояние охлаждения, а не файл учётных данных.

## 3. Как настроить или вызвать

Базовый адрес — `https://example.invalid`. Заголовок — `Authorization: Bearer YOUR_API_KEY`.

Чтение определений моделей. `:channel` можно передать и параметром запроса `channel`. Параметр запроса читается только когда путь пуст.

```http
GET /v8/management/routing/model-definitions/codex HTTP/1.1
Host: example.invalid
Authorization: Bearer YOUR_API_KEY
```

Очистка охлаждения:

```http
POST /v8/management/routing/cooldown/reset HTTP/1.1
Host: example.invalid
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{"auth_index":"AUTH_INDEX"}
```

`AUTH_INDEX` берётся из auth index в списке учётных данных. Это не имя модели.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| GET /v8/management/routing/model-definitions/:channel | Возвращает статический список моделей этого канала. |  | Канал обязателен, иначе 400 `channel is required`. Неизвестный канал — 400 `unknown channel`. Известные каналы: `claude`, `gemini`, `gemini-interactions`, `vertex`, `aistudio`, `codex`, `kimi`, `kimi-ai`, `kimi.ai`, `kimi.com`, `antigravity`, `xai`, `x-ai`, `grok`, `devin`, `meta`, `muse`. Ответ содержит `channel` в нижнем регистре и `models`. |
| POST /v8/management/routing/cooldown/reset | По `auth_index` очищает состояние квоты и охлаждения маршрутизации. |  | Недействительное тело — 400 `invalid request body`. Пустой `auth_index` — 400 `auth_index is required`. Учётные данные не найдены — 404 `auth not found`. Если менеджер недоступен, ответ — 503. Успех возвращает `status`, `auth_index` и `models`. |

## 5. Типичные ошибки и границы

Сравнение канала не зависит от регистра, но неизвестный псевдоним не угадывается как другой провайдер. `kimi` и `kimi-ai` используют один набор статических моделей. `xai` и `grok`, а также `meta` и `muse`, тоже попарно общие. Сброс не создаёт учётные данные. Если сброс внутри завершается ошибкой, ответ — 500, а ошибка начинается с `failed to reset quota`.

## 6. Связанные возможности

Список учётных данных описан в разделе [Учётные данные](/ru/management/v8-credentials). Стратегия выбора на этой странице не меняется.

## 7. Практический опыт

- [Очистите охлаждение маршрутом управления](/ru/experience/management#exp-management-reset-cooldown)
