---
title: Импорт сервисного аккаунта Vertex
feature_ids:
  - auth.vertex.login
  - cli.server.vertex-import
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Импорт сервисного аккаунта Vertex

## 1. Какую задачу решает этот раздел

Здесь описано, как импортировать JSON сервисного аккаунта Google Cloud как учётные данные vertex. Это не вход через браузер.

## 2. Когда применимо и чего здесь нет

Ключ API Vertex и base-url находятся на страницах ключей upstream. Эта страница покрывает только --vertex-import и запись входа.

## 3. Как настроить или вызвать

```bash
cli-proxy-api --vertex-import /path/to/service-account.json
cli-proxy-api --vertex-import /path/to/service-account.json --vertex-import-prefix teamA
```

Файл записывается в `oauth.auth-dir`. Сохранённый location — `us-central1`, позже его можно изменить в файле учётных данных. Префикс должен быть одним сегментом и не может содержать `/`. Имя файла — `vertex-<project_id>.json`. С префиксом — `vertex-<prefix>-<project_id>.json`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| Vertex login | Команда, которая запускает этот вход или импорт. |  | Сервисный аккаунт импортируется через --vertex-import. Это не вход через браузер. |
| --vertex-import | Команда, которая запускает этот вход или импорт. | empty string | Нужны путь и project_id. Префикс не может содержать /. Сохранённый location — us-central1. |

## 5. Типичные ошибки и границы

Пустой путь, ошибка чтения файла, недействительный JSON или отсутствие `project_id` только записывают ошибку и возвращают управление. Отсутствие `client_email` — только предупреждение, импорт продолжается. Если префикс содержит `/`, ошибка содержит `prefix must be a single segment`. При успехе печатаются `Vertex credentials imported:` и путь.

## 6. Связанные возможности

Ключ API описан в разделах [Ключи upstream API](/ru/accounts/api-keys-api) и [Базовые URL upstream](/ru/accounts/api-keys-base).

## 7. Практический опыт

Пока нет.
