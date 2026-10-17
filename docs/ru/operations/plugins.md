---
title: Загрузка плагинов и магазин
feature_ids:
  - plugins.auth-revision.value
  - plugins.configs.enabled
  - plugins.configs.priority
  - plugins.dir.value
  - plugins.enabled.value
  - plugins.store-auth.allow-insecure
  - plugins.store-auth.apply-to
  - plugins.store-auth.header-name
  - plugins.store-auth.header-value-env
  - plugins.store-auth.match
  - plugins.store-auth.password-env
  - plugins.store-auth.token-env
  - plugins.store-auth.type
  - plugins.store-auth.username-env
  - plugins.store-sources.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Загрузка плагинов и магазин

## 1. Какую задачу решает этот раздел

Решает, загружаются ли динамические плагины, из какого каталога они обнаруживаются, включён ли каждый экземпляр и в каком порядке запускается, а также можно ли добавить сторонние магазины плагинов и правила аутентификации этих магазинов.

## 2. Когда применимо и чего здесь нет

Это конфигурация хоста, а не интерфейс, который должен реализовать автор плагина. Описание интерфейсов остаётся на страницах разработки плагинов. Маршруты управления для списка, установки и квоты описаны в разделе [Плагины](/ru/management/v8-plugins). `plugins.auth-revision` ведёт Home, и его нельзя менять как обычную настройку.

## 3. Как настроить или вызвать

```yaml
plugins:
  enabled: false
  dir: "plugins"
  configs:
    example:
      enabled: true
      priority: 1
```

При добавлении магазина и аутентификации используйте адрес `https://example.invalid`. Секреты кладите в переменные окружения. В конфигурации записываются только имена переменных. Типы в примере — `bearer`, `basic`, `header` и `github-token`.

```yaml
plugins:
  store-sources:
    - "https://example.invalid/cliproxy-plugins/registry.json"
  store-auth:
    - match: "https://example.invalid/bearer/"
      apply-to: ["registry", "artifact"]
      type: "bearer"
      token-env: "CLIPROXY_PLUGIN_STORE_TOKEN"
      allow-insecure: false
    - match: "https://example.invalid/basic/"
      apply-to: ["registry", "artifact"]
      type: "basic"
      username-env: "CLIPROXY_PLUGIN_STORE_USER"
      password-env: "CLIPROXY_PLUGIN_STORE_PASSWORD"
      allow-insecure: false
    - match: "https://example.invalid/header/"
      apply-to: ["registry", "artifact"]
      type: "header"
      header-name: "X-Plugin-Token"
      header-value-env: "CLIPROXY_PLUGIN_STORE_HEADER_TOKEN"
      allow-insecure: false
    - match: "https://example.invalid/repos/example/"
      apply-to: ["registry", "artifact"]
      type: "github-token"
      token-env: "CLIPROXY_PLUGIN_GITHUB_TOKEN"
      allow-insecure: false
```

Встроенный официальный магазин всегда включён. `store-sources` только добавляет.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugins.auth-revision | Меняется, когда меняются учётные данные плагинов, которыми управляет Home. | 0 | Если Management API v8 меняет это поле, ответ — 400 с ошибкой `read_only_field`. |
| plugins.configs.enabled | Включён ли этот экземпляр плагина. | nil | При разборе YAML nil нормализуется в false. enabled экземпляра сам не включает глобальный `plugins.enabled`. |
| plugins.configs.priority | Порядок запуска и маршрутизации плагина. | 0 | Целое. Если не записано, равно 0. |
| plugins.dir | Каталог обнаружения плагинов. | empty string | Пустая строка нормализуется в `plugins`. Значение, начинающееся с `~`, раскрывается в домашний каталог пользователя. Если `plugins.enabled` равен true и каталог нельзя разрешить, загрузка конфигурации не удаётся. |
| plugins.enabled | Загружать ли динамические плагины. | false | При false они не загружаются как включённые. |
| plugins.store-auth.allow-insecure | Может ли совпавший URL магазина использовать http. | false | URL http принимается только когда match и apply-to какого-то правила попадают в этот URL и это поле равно true. Иначе ошибка — insecure plugin store url requires matching allow-insecure auth rule. |
| plugins.store-auth.apply-to | К каким видам запросов относится эта аутентификация. | nil | Разрешены `registry`, `metadata` и `artifact`. Другие значения на разобранной аутентификации не принимаются. Пустой список не добавляет вид. |
| plugins.store-auth.header-name | Имя заголовка для типа `header`. | empty string | Не может быть пустым и не может содержать возврат каретки, перевод строки или двоеточие. |
| plugins.store-auth.header-value-env | Имя переменной окружения, в которой лежит значение заголовка. | empty string | Если значение переменной пусто, эта аутентификация заголовка считается не настроенной. Значение не может содержать CR или LF. |
| plugins.store-auth.match | Префикс для сопоставления URL магазина. | empty string | Пустой match при нормализации отбрасывается. Это должен быть URL https с хостом, без сведений о пользователе, запроса и фрагмента. |
| plugins.store-auth.password-env | Имя переменной окружения с паролем для типа `basic`. | empty string | Должно быть непустым одновременно с переменной имени пользователя. |
| plugins.store-auth.token-env | Имя переменной окружения с токеном для `bearer` или `github-token`. | empty string | Если значение переменной пусто, аутентификация этого типа не действует. Токен в манифест плагина не записывается. |
| plugins.store-auth.type | Тип аутентификации. | empty string | Пустой тип нормализуется в `none`. Можно использовать `none`, `bearer`, `basic`, `header` и `github-token`. Другой тип сообщается как unsupported. |
| plugins.store-auth.username-env | Имя переменной окружения с именем пользователя для типа `basic`. | empty string | Должно быть непустым одновременно с переменной пароля. |
| plugins.store-sources | Сторонние реестры магазинов, добавляемые сверх встроенного официального источника. | nil | Недействительный источник заставляет список магазина управления вернуть 500 `plugin_store_source_invalid`. |

## 5. Типичные ошибки и границы

URL магазина не может содержать встроенные имя пользователя и пароль и не может нести чувствительные параметры запроса. Если `match` не https или содержит запрос, фрагмент либо сведения о пользователе, разобранное правило недействительно. Адрес магазина `http`, который не попал в правило с `allow-insecure: true`, отклоняется. Когда глобальный `enabled` равен false, экземпляр с `configs.example.enabled: true` всё равно не является эффективно включённым. Запись v8, меняющая `auth-revision`, отклоняется, и файл из-за неё не сохраняется.

## 6. Связанные возможности

Установка и квота описаны в разделе [Плагины](/ru/management/v8-plugins). Синхронизация Home — в разделе [CLIProxyAPI Home](/ru/operations/home).

## 7. Практический опыт

Пока нет.
