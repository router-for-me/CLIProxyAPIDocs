---
title: Management API v8
feature_ids:
  - management.v8.delete-config-path
  - management.v8.get-config
  - management.v8.get-config-path
  - management.v8.get-config-yaml
  - management.v8.patch-config
  - management.v8.patch-config-path
  - management.v8.put-config
  - management.v8.put-config-path
  - management.v8.put-config-yaml
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Management API v8

## 1. Какую задачу решает этот раздел

Через `/v8/management` читать или менять уже сохранённое дерево конфигурации v8. Путь совпадает с ключами YAML. Успешное изменение записывается в файл и перезагружается на лету.

## 2. Когда применимо и чего здесь нет

Здесь только чтение и запись конфигурации. Учётные данные, OAuth, журналы, плагины, операции маршрутизации, запрос версии и проксирование запроса — на других страницах этого каталога. `/v0/management` больше не сопровождается. См. [Management API](/ru/management/api). Смысл полей — на функциональных страницах. Вся конфигурация здесь не повторяется.

Режим Home возвращает 404. Ответ тоже 404, когда `management.secret-key`, `MANAGEMENT_PASSWORD` и локальный пароль пусты.

## 3. Как настроить или вызвать

Базовый адрес — `https://example.invalid`. Кроме отдельно описанного обратного вызова OAuth, каждый запрос должен нести ключ управления:

```http
GET /v8/management/config HTTP/1.1
Host: example.invalid
Authorization: Bearer YOUR_API_KEY
```

Открытый ключ можно также поместить в `X-Management-Key`. Вызов не с локальной машины дополнительно требует `management.allow-remote: true`, если не задан `MANAGEMENT_PASSWORD`.

| Метод и путь | Назначение |
| --- | --- |
| GET /v8/management/config | Возвращает представление v8 всей конфигурации как JSON. |
| PUT /v8/management/config | Заменяет всю конфигурацию объектом JSON. |
| PATCH /v8/management/config | Глубоко сливает объект JSON со всей конфигурацией. |
| GET /v8/management/config.yaml | Возвращает нормализованное тело YAML с типом `application/yaml`. |
| PUT /v8/management/config.yaml | Заменяет всю конфигурацию телом YAML. |
| GET /v8/management/config/\<path\> | Возвращает этот узел YAML как JSON. |
| PUT /v8/management/config/\<path\> | Заменяет этот узел. |
| PATCH /v8/management/config/\<path\> | Объект глубоко сливается. Другой тип заменяется напрямую. |
| DELETE /v8/management/config/\<path\> | Удаляет этот узел. |

Сегмент пути — ключ отображения YAML, а не индекс массива. Список заменяется целиком. Тело запроса и есть значение. Не оборачивайте его снова в старые `value` или `items`. Успешная запись возвращает `{"status":"ok","config-version":8}`.

Необязательный заголовок `If-Match` сравнивается с сильным ETag текущего содержимого файла. Без этого заголовка запись безусловна. Значение `*` совпадает с любой текущей версией. Несовпадение возвращает 412 с ошибкой `precondition_failed` и текущим ETag.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно. У этих маршрутов нет отдельного значения конфигурации по умолчанию.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| DELETE /v8/management/config/\*path | Удаляет выбранный узел конфигурации. |  | Корень удалить нельзя: 400 `cannot_delete_config`. Пути нет: 404 `not_found`. |
| GET /v8/management/config | Читает JSON-представление всей конфигурации. |  | Диск не переписывается. Ответ несёт `Cache-Control: no-store` и ETag. Ошибка чтения — 500 `read_failed`. |
| GET /v8/management/config/\*path | Читает один узел YAML как JSON. |  | Пути нет: 404 `not_found`. Если родитель не отображение или сегмент пуст, запись даёт 400 `invalid_path`, а отсутствующее чтение — 404. |
| GET /v8/management/config.yaml | Читает нормализованные байты YAML. |  | Успех — не JSON. Сам GET не переводит старый файл в v8. |
| PATCH /v8/management/config | Глубоко сливает корневой объект. |  | Корень должен быть объектом JSON, иначе 400 `config_must_be_object`. `null` сохраняется и не удаляет поле. |
| PATCH /v8/management/config/\*path | Сливает или заменяет выбранный узел. |  | Тело не в JSON, кроме конечной точки YAML, даёт 400 `invalid_json`. Неразбираемое тело даёт 400 `invalid_body`. |
| PUT /v8/management/config | Заменяет всю конфигурацию. |  | Ошибка проверки — 400 `invalid_config`. Если разбор прошёл, а байты конфигурации всё ещё недействительны, возможен 422 `invalid_config`. |
| PUT /v8/management/config/\*path | Заменяет выбранный узел. |  | Ещё не существующие промежуточные ключи отображения создаются. После успеха сохранённый файл перезагружается на лету. |
| PUT /v8/management/config.yaml | Заменяет всю конфигурацию телом YAML. |  | Как и запись JSON, принимает необязательный `If-Match`. Ошибка записи — 500 `write_failed`. |

## 5. Типичные ошибки и границы

Три поля ниже принадлежат Home. Если запись их меняет, ответ — 400 с ошибкой `read_only_field`, а `field` — соответствующий путь:

- `credentials/concurrency/lifecycle-config-revision`
- `credentials/concurrency/observation-barrier-revision`
- `plugins/auth-revision`

Чтение JSON убирает из ответа `username` и `credential` сервера ICE реального времени и может добавить в представление `api-keys` runtime auth index. При записи эти index снимаются и не сохраняются как конфигурация. Чтение YAML возвращает нормализованные байты и не применяет это удаление полей JSON. Запись без `If-Match` перекрывает то, что только что сохранил кто-то другой. Слабый ETag или неверно оформленная метка не совпадают.

## 6. Связанные возможности

Ключ и переключатель удалённого доступа описаны в разделе [Параметры управления](/ru/operations/management-settings). Файлы учётных данных — в разделе [Учётные данные](/ru/management/v8-credentials).

## 7. Практический опыт

Пока нет.
