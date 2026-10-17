---
title: Вход xAI
feature_ids:
  - auth.xai.login
  - cli.server.xai-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Вход xAI

## 1. Какую задачу решает этот раздел

Здесь описан вход xAI по коду устройства. Текущий вход — это не локальный порт обратного вызова браузера.

## 2. Когда применимо и чего здесь нет

Ключ API сюда не входит, как и внедрение x_search. `127.0.0.1:56121/callback` из старой документации не является текущим поведением этой команды.

## 3. Как настроить или вызвать

```bash
cli-proxy-api --xai-login
cli-proxy-api --xai-login --no-browser
```

Команда запрашивает у xAI код устройства, печатает адрес проверки и код пользователя и открывает браузер, если не задан `--no-browser`. Ожидание берётся из секунд истечения, которые вернул xAI. При успехе печатается `xAI authentication successful`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| Xai login | Команда, которая запускает этот вход или импорт. |  | Запускается через --xai-login. |
| --xai-login | Команда, которая запускает этот вход или импорт. | false | Процесс кода устройства. Не использует --oauth-callback-port. Ожидание берётся из секунд истечения, которые вернул xAI. |

## 5. Типичные ошибки и границы

Процесс не удаётся, если в ответе кода устройства нет device_code, user_code или адреса проверки. Истечение, отказ или отмена контекста завершают вход. `--oauth-callback-port` этот процесс не меняет.

## 6. Связанные возможности

Инструмент поиска описан в разделе [Инструмент поиска xAI](/ru/configuration/provider/xai). Ключ — в разделе [Ключи upstream API](/ru/accounts/api-keys-api).

## 7. Практический опыт

- [При 403 xAI перейдите на ключ API](/ru/experience/accounts#exp-accounts-xai-api-key-fallback)
- [Войдите в xAI кодом устройства](/ru/experience/accounts#exp-accounts-xai-device-login)
- [Включите переключатель совместимости нескольких агентов](/ru/experience/configuration#exp-configuration-optimize-multi-agent)
- [Фильтром payload уберите поля, которые отклоняет upstream](/ru/experience/routing#exp-routing-filter-rejected-fields)
- [Исправьте субагента Grok переопределением payload](/ru/experience/routing#exp-routing-override-grok-subagent)
