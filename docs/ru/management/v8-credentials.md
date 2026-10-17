---
title: Учётные данные
feature_ids:
  - management.v8.delete-credentials
  - management.v8.get-credentials
  - management.v8.get-credentials-download
  - management.v8.get-credentials-models
  - management.v8.patch-credentials-fields
  - management.v8.patch-credentials-status
  - management.v8.post-credentials
  - management.v8.post-credentials-refresh
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Учётные данные

## 1. Какую задачу решает этот раздел

Через API управления перечислять, загружать, скачивать, удалять и обновлять сохранённые учётные данные, а также менять состояние отключения или поля одной учётной записи.

## 2. Когда применимо и чего здесь нет

Все пути находятся под `/v8/management` и требуют ключ управления. Правила аутентификации описаны в разделе [Management API v8](/ru/management/apiv8). Вход OAuth здесь не начинается. Вход описан в разделе [OAuth](/ru/management/v8-oauth). Охлаждение маршрутизации здесь не сбрасывается. Это раздел [Операции маршрутизации](/ru/management/v8-routing).

## 3. Как настроить или вызвать

Базовый адрес — `https://example.invalid`. Заголовок — `Authorization: Bearer YOUR_API_KEY`.

| Метод и путь | Назначение |
| --- | --- |
| GET /v8/management/credentials | Перечисляет существующие учётные данные. |
| POST /v8/management/credentials | Загружает одну или несколько учётных записей JSON. |
| DELETE /v8/management/credentials | Удаляет по имени или, при явном запросе, все учётные данные JSON. |
| GET /v8/management/credentials/models | Запрашивает модели, видимые клиенту для одних учётных данных. |
| GET /v8/management/credentials/download | Скачивает JSON по имени файла. |
| PATCH /v8/management/credentials/status | Задаёт, отключены ли они. |
| PATCH /v8/management/credentials/fields | Меняет поля этих учётных данных. |
| POST /v8/management/credentials/refresh | Принудительно обновляет одни или все учётные данные. |

При перечислении можно передать параметры запроса `name` и `auth_index`. Разбиение на страницы начинается только если есть `page` или `page_size`. `page` по умолчанию равен 1, `page_size` — 50. Оба должны быть положительными целыми. Ответ со страницами дополнительно содержит `total`, `page`, `page_size` и `has_more`. Без страниц возвращаются `observed_at` и `files`.

Загрузка может использовать файл multipart либо имя файла с окончанием `.json` в параметре `name` и исходный JSON. Чтобы удалить всё, параметр запроса `all` равен `true`, `1` или `*`. Иначе используйте повторяющиеся параметры `name` либо `name`, `names` или массив строк в теле JSON.

Обновление принимает параметры запроса `all=true`, `name` и `auth_index` либо тело JSON `{"name":"...","auth_index":"...","all":false}`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| DELETE /v8/management/credentials | Удаляет файлы учётных данных. |  | Если основной менеджер учётных данных недоступен, ответ — 503. Если допустимое имя не задано, ответ — 400 `invalid name`. Частичный сбой — 207, тело содержит `status: partial`. |
| GET /v8/management/credentials | Перечисляет учётные данные. |  | Если `page` не положительное целое, ответ — 400 `page must be a positive integer`. `page_size` тоже должен быть положительным целым. |
| GET /v8/management/credentials/download | Скачивает один файл учётных данных JSON. |  | `name` должен быть только именем файла и заканчиваться на `.json`, иначе 400. Файла нет — 404 `file not found`. |
| GET /v8/management/credentials/models | Возвращает список моделей этих учётных данных. |  | Параметр запроса `name` обязателен, иначе 400 `name is required`. Ответ — `{"models":[...]}`. |
| PATCH /v8/management/credentials/fields | Обновляет учётные данные по полям. |  | JSON должен содержать `name`. Учётные данные не найдены — 404 `auth file not found`. Виртуальные учётные данные, развёрнутые плагином, возвращают 409. `weight` должен быть целым и не может быть записан вложенным полем. |
| PATCH /v8/management/credentials/status | Задаёт `disabled`. |  | Телу нужны `name` и логическое `disabled`. Можно передать `auth_index`. Нет `disabled` — 400 `disabled is required`. |
| POST /v8/management/credentials | Записывает загруженные учётные данные. |  | Имя файла не JSON даёт 400 `file must be .json`. Multipart без файла даёт 400 `no files uploaded`. Частичный сбой нескольких файлов — 207. |
| POST /v8/management/credentials/refresh | Принудительно обновляет учётные данные. |  | Если нет `name` и не запрошены все, ответ — 400 `name or all=true is required`. Не найдено — 404 `auth file not found`. Успешное обновление всех возвращает `ok` и `results`. |

## 5. Типичные ошибки и границы

Если основной менеджер учётных данных недоступен, загрузка, удаление, смена состояния, смена полей и обновление возвращают 503 `core auth manager unavailable`. Перечисление при отсутствии менеджера читает диск. Имя скачивания с компонентом пути считается `invalid name`. Если учётные данные ключа API в конфигурации отключены, используются исключённые модели конфигурации, а `via` в ответе равен `config:excluded-models`. Состояние виртуальных учётных данных плагина можно менять только по имени исходного файла. Развёрнутые проектные учётные данные по отдельности менять нельзя.

## 6. Связанные возможности

Вход и импорт описаны в разделе [OAuth](/ru/management/v8-oauth). Сброс охлаждения — в разделе [Операции маршрутизации](/ru/management/v8-routing).

## 7. Практический опыт

- [Приостановите учётные данные через интерфейс управления](/ru/experience/management#exp-management-disable-credential)
- [Отключённые учётные данные OAuth всё равно обновляются](/ru/experience/management#exp-management-disabled-oauth-still-refreshes)
- [Задайте приоритет в поле учётных данных](/ru/experience/management#exp-management-set-credential-priority)
- [fill-first возвращается к прежней учётной записи после восстановления квоты](/ru/experience/routing#exp-routing-fill-first-recovers)
