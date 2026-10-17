---
title: Вход Codex
feature_ids:
  - auth.codex.login
  - cli.server.codex-device-login
  - cli.server.codex-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Вход Codex

## 1. Какую задачу решает этот раздел

Здесь описаны два входа Codex: обратный вызов браузера и код устройства.

## 2. Когда применимо и чего здесь нет

Сюда не входят ключи API, WebSocket, Alpha Search, а также буфер потока и медиа-реле на уровне провайдера.

## 3. Как настроить или вызвать

```bash
cli-proxy-api --codex-login
cli-proxy-api --codex-login --no-browser
cli-proxy-api --codex-device-login
```

Вход через браузер по умолчанию слушает `1455`. Путь обратного вызова — `/auth/callback`, ожидание — 5 минут. Вход по коду устройства печатает `https://auth.openai.com/codex/device` и код устройства. Если не задан `--no-browser`, он пытается открыть этот адрес. Процесс кода устройства не ждёт локальный порт OAuth. Максимальное ожидание — 15 минут.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| Codex login | Команда, которая запускает этот вход или импорт. |  | Браузерный процесс использует --codex-login. Код устройства использует --codex-device-login. |
| --codex-device-login | Команда, которая запускает этот вход или импорт. | false | Печатает адрес устройства и код устройства, ждёт не больше 15 минут и не слушает порт OAuth. |
| --codex-login | Команда, которая запускает этот вход или импорт. | false | Порт по умолчанию — 1455, путь — /auth/callback, ожидание — 5 минут. Если порт занят, код выхода — 13. |

## 5. Типичные ошибки и границы

Вход через браузер завершается с кодом выхода 13, если порт занят. Если в ответе кода устройства нет обязательных полей, процесс не удаётся. Ошибки — `codex device flow did not return required fields` или `codex device flow token response missing required fields`.

## 6. Связанные возможности

Параметры провайдера описаны в разделе [Параметры провайдера Codex](/ru/configuration/provider/codex). Ключ — в разделе [Ключи upstream API](/ru/accounts/api-keys-api).

## 7. Практический опыт

- [Файл учётных данных Codex не может содержать комментарии](/ru/experience/accounts#exp-accounts-codex-auth-file-shape)
- [После успешного обратного вызова Codex вернитесь в терминал для подтверждения](/ru/experience/accounts#exp-accounts-codex-callback-enter)
- [Клиент Codex должен совпадать со значением User-Agent по умолчанию](/ru/experience/accounts#exp-accounts-codex-client-user-agent)
- [Настольное приложение указывает на прокси своим способом](/ru/experience/accounts#exp-accounts-codex-desktop-proxy)
- [Оставьте две рабочие области для одной учётной записи Codex](/ru/experience/accounts#exp-accounts-codex-keep-workspaces)
- [Войдите в Codex снова после смены плана или токена](/ru/experience/accounts#exp-accounts-codex-login-again)
- [Claude Code использует вход Codex, а не исходный токен](/ru/experience/accounts#exp-accounts-codex-login-for-claude-code)
- [Встроенные изображения используют OAuth Codex](/ru/experience/accounts#exp-accounts-codex-oauth-for-images)
- [Повышенная безопасность учётной записи заставляет Codex обновляться чаще](/ru/experience/accounts#exp-accounts-codex-refresh-security)
- [Исключите модель на одной учётной записи](/ru/experience/accounts#exp-accounts-exclude-model)
- [Клиент Codex вызывает маршрут responses](/ru/experience/api#exp-api-call-responses)
- [Прекратите внедрять инструмент изображений](/ru/experience/api#exp-api-disable-image-tool-injection)
- [Перед отправкой в Codex отбросьте неподдерживаемые поля Claude](/ru/experience/api#exp-api-drop-unsupported-claude-fields)
- [Не ждите, что прокси допишет текст рассуждения, которого нет в каталоге](/ru/experience/api#exp-api-no-synthetic-reasoning)
- [Передавайте клиентский ключ при вызове публичного маршрута](/ru/experience/api#exp-api-require-client-key)
- [responses использует instructions вместо system](/ru/experience/api#exp-api-responses-instructions)
- [Включите переключатель совместимости нескольких агентов](/ru/experience/configuration#exp-configuration-optimize-multi-agent)
- [Видимые модели определяются закреплённым каталогом](/ru/experience/introduction#exp-introduction-catalog-is-authoritative)
- [Отключённые учётные данные OAuth всё равно обновляются](/ru/experience/management#exp-management-disabled-oauth-still-refreshes)
- [Сбросьте учётную запись Codex со страницы управления](/ru/experience/management#exp-management-reset-codex-from-panel)
- [auth_unavailable означает, что нет пригодной учётной записи](/ru/experience/operations#exp-operations-auth-unavailable-means-no-credential)
- [После 429 пропускайте эту модель до времени восстановления](/ru/experience/routing#exp-routing-cooldown-until-reset)
- [Выключите охлаждение, чтобы учётные данные оставались выбираемыми](/ru/experience/routing#exp-routing-disable-cooling)
- [Пусть сервер сам завершит вход через прокси](/ru/experience/routing#exp-routing-proxy-for-token-exchange)
- [responses чередуется по общему ключу кэша](/ru/experience/routing#exp-routing-responses-cache-key)
- [Одноимённые модели используют одну стратегию маршрутизации](/ru/experience/routing#exp-routing-same-model-name)
