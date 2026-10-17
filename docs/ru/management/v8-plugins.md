---
title: Плагины
feature_ids:
  - management.v8.delete-plugins-id
  - management.v8.delete-plugins-id-quota
  - management.v8.get-plugins
  - management.v8.get-plugins-id-quota
  - management.v8.get-plugins-store
  - management.v8.post-plugins-id-quota
  - management.v8.post-plugins-store-id-install
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Плагины

## 1. Какую задачу решает этот раздел

Перечислить обнаруженные и настроенные плагины, удалить локальный плагин и его конфигурацию, просмотреть магазин и установить плагин, а также прочитать или сбросить квоту, которую плагин даёт своим учётным данным.

## 2. Когда применимо и чего здесь нет

Эти маршруты требуют ключ управления. Загружаются ли плагины, каталог и аутентификация магазина описаны в разделе [Загрузка плагинов и магазин](/ru/operations/plugins). Интерфейс плагина здесь не реализуется. Квота имеет смысл только для плагина, объявившего возможность квоты.

## 3. Как настроить или вызвать

Базовый адрес — `https://example.invalid`. Заголовок — `Authorization: Bearer YOUR_API_KEY`.

| Метод и путь | Назначение |
| --- | --- |
| GET /v8/management/plugins | Перечисляет каталог, конфигурацию и зарегистрированные плагины. |
| DELETE /v8/management/plugins/:id | Удаляет файл локального плагина и сохранённую конфигурацию. |
| GET /v8/management/plugins/store | Загружает каталог магазина и состояние локальной установки. |
| POST /v8/management/plugins/store/:id/install | Устанавливает этот плагин из магазина. |
| GET /v8/management/plugins/:id/quota | Читает квоту плагина для учётных данных. |
| POST /v8/management/plugins/:id/quota | Просит плагин заново получить квоту. |
| DELETE /v8/management/plugins/:id/quota | Просит плагин сбросить квоту и сбрасывает состояние квоты на стороне маршрутизации. |

`auth_index` квоты можно передать параметром запроса `auth_index` или `authIndex`. POST и DELETE также принимают в JSON `auth_index`, `authIndex` или `AuthIndex`. Установка принимает параметры запроса `version` и `source`. Если в теле тоже есть `version`, после нормализации значения должны совпасть.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| DELETE /v8/management/plugins/:id | Удаляет локальный плагин и запись конфигурации. |  | Не найден — 404 `plugin_not_found`. Каталог нельзя разрешить — 500 `plugin_directory_invalid`. При успехе `status` равен `deleted`. |
| DELETE /v8/management/plugins/:id/quota | Сбрасывает квоту плагина. |  | Нет `auth_index` — 400. Учётные данные не существуют — 404 `auth not found`. У плагина нет поставщика квоты — 404 `quota provider not found for plugin`. Плагин отклонил вызов — 502. |
| GET /v8/management/plugins | Возвращает список плагинов. |  | Успешное тело содержит `plugins_enabled`, `plugins_dir` и `plugins`. `effective_enabled` экземпляра равен true только когда глобально включено, экземпляр включён и зарегистрирован. |
| GET /v8/management/plugins/:id/quota | Читает квоту. |  | Auth index в параметрах запроса обязателен, иначе 400 `auth_index is required`. Ошибка получения — 502. |
| GET /v8/management/plugins/store | Перечисляет записи магазина. |  | Недействительная конфигурация источника — 500 `plugin_store_source_invalid`. Если плагинов нет и источник ошибочен, ответ — 502 `plugin_store_registry_failed`. Частичный сбой источника всё равно возвращает `source_errors`. |
| POST /v8/management/plugins/:id/quota | Заново получает квоту для учётных данных из тела. |  | Недействительное тело — 400 `invalid request body`. Остальные ошибки совпадают с GET. |
| POST /v8/management/plugins/store/:id/install | Устанавливает плагин из магазина. |  | Конфликт `version` в запросе и в теле — 400 `invalid_request`. `source` может указать источник. |

## 5. Типичные ошибки и границы

Недопустимый ID плагина возвращает 400 с ошибкой `invalid_plugin_id`. Список магазина не запрашивает последний выпуск для записи, которая не установлена или чей источник не может обновить установленный плагин. Установка использует собственную операционную систему и архитектуру процесса. Если сброс плагина успешен, а сброс на стороне маршрутизации нет, ответ — 500, и ошибка начинается с `failed to reset routing quota`. Когда глобальный `plugins.enabled` равен false, эффективное включение в списке тоже false.

## 6. Связанные возможности

Ключи конфигурации описаны в разделе [Загрузка плагинов и магазин](/ru/operations/plugins). Файлы учётных данных — в разделе [Учётные данные](/ru/management/v8-credentials).

## 7. Практический опыт

Пока нет.
