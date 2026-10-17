---
title: Вход Claude
feature_ids:
  - auth.claude.login
  - cli.server.claude-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Вход Claude

## 1. Какую задачу решает этот раздел

Здесь описано, как войти в Claude через браузерный OAuth и записать токен в каталог учётных данных.

## 2. Когда применимо и чего здесь нет

Сюда входит только --claude-login. Ключи API, маскировка, отпечаток и CCH на этой странице не описаны. Вход Kimi тоже не здесь.

## 3. Как настроить или вызвать

```bash
cli-proxy-api --claude-login
cli-proxy-api --claude-login --no-browser
cli-proxy-api --claude-login --oauth-callback-port 54545
```

По умолчанию слушается `54545`. `--no-browser` печатает адрес авторизации и не открывает браузер. Ожидание обратного вызова — 5 минут. При успехе печатаются путь сохранения и `Claude authentication successful!`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| Claude login | Команда, которая запускает этот вход или импорт. |  | Запускается через --claude-login. Токен записывается в oauth.auth-dir. |
| --claude-login | Команда, которая запускает этот вход или импорт. | false | Порт по умолчанию — 54545, ожидание — 5 минут. Если порт занят, код выхода — 13. |

## 5. Типичные ошибки и границы

Если порт уже занят, процесс завершается с кодом выхода 13. Тип ошибки — `port_in_use`. Другие ошибки аутентификации печатают `Claude authentication failed:` и не обязательно завершают процесс.

## 6. Связанные возможности

Ключ и маскировка описаны в разделах [Ключи upstream API](/ru/accounts/api-keys-api) и [Маскировка запросов Claude](/ru/accounts/api-keys-cloak). Обратный вызов основной службы — в разделе [Обратные вызовы OAuth](/ru/accounts/oauth-callback).

## 7. Практический опыт

- [Выключите маскировку Claude, если она не нужна](/ru/experience/accounts#exp-accounts-claude-cloak-off)
- [Используйте ручной вход, если браузера нет](/ru/experience/accounts#exp-accounts-claude-manual-login)
- [Передавайте клиентский ключ при вызове публичного маршрута](/ru/experience/api#exp-api-require-client-key)
- [До запуска укажите конфигурацию или выполните вход](/ru/experience/introduction#exp-introduction-start-with-config-or-login)
- [auth_unavailable означает, что нет пригодной учётной записи](/ru/experience/operations#exp-operations-auth-unavailable-means-no-credential)
- [Пусть сервер сам завершит вход через прокси](/ru/experience/routing#exp-routing-proxy-for-token-exchange)
