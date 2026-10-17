---
title: Вход Kimi
feature_ids:
  - auth.kimi.login
  - cli.server.kimi-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Вход Kimi

## 1. Какую задачу решает этот раздел

Здесь описан вход Kimi.com по коду устройства.

## 2. Когда применимо и чего здесь нет

Kimi.ai использует другую команду. См. вход Kimi.ai. Ключ API здесь не настраивается.

## 3. Как настроить или вызвать

```bash
cli-proxy-api --kimi-login
cli-proxy-api --kimi-login --no-browser
```

Команда печатает адрес проверки и код пользователя. Без `--no-browser` она пытается открыть браузер. Сохранённый провайдер — `kimi`. Этот процесс не использует `--oauth-callback-port`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| Kimi login | Команда, которая запускает этот вход или импорт. |  | Kimi.com использует --kimi-login. Kimi.ai использует --kimi-ai-login. |
| --kimi-login | Команда, которая запускает этот вход или импорт. | false | Код устройства Kimi.com. Сохраняемый провайдер — kimi. Параметр порта обратного вызова не используется. |

## 5. Типичные ошибки и границы

Если процесс кода устройства не может начаться, он не удаётся. Ошибка содержит `kimi: failed to start device flow`. Если авторизация истекает по времени или отклонена, процесс не удаётся. Ошибка содержит `kimi:`.

## 6. Связанные возможности

Kimi.ai описан в разделе [Вход Kimi.ai](/ru/accounts/kimi-ai).

## 7. Практический опыт

- [Kimi использует вход международного сайта](/ru/experience/accounts#exp-accounts-kimi-international-login)
- [Негодный ключ Kimi следует заменить на OAuth](/ru/experience/accounts#exp-accounts-kimi-oauth-instead-of-broken-key)
- [Kimi responses сохраняет собственные инструменты Kimi](/ru/experience/api#exp-api-kimi-native-responses)
- [Видимые модели определяются закреплённым каталогом](/ru/experience/introduction#exp-introduction-catalog-is-authoritative)
