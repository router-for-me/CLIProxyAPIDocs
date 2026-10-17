---
title: Вход Antigravity
feature_ids:
  - auth.antigravity.login
  - cli.server.antigravity-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Вход Antigravity

## 1. Какую задачу решает этот раздел

Здесь описано, как войти учётной записью Antigravity в этот прокси и сохранить токен в каталоге учётных данных.

## 2. Когда применимо и чего здесь нет

Сюда входят только --antigravity-login и соответствующий вход. Пул соединений, чувствительные слова, credits и кэш подписи находятся на странице параметров провайдера Antigravity. Если обратный вызов попадает в работающую основную службу, см. обратные вызовы OAuth.

## 3. Как настроить или вызвать

```bash
cli-proxy-api --antigravity-login
cli-proxy-api --antigravity-login --no-browser
cli-proxy-api --antigravity-login --oauth-callback-port 51121
```

По умолчанию ожидание идёт на локальном порту `51121`. Путь обратного вызова — `/oauth-callback`. Если `--oauth-callback-port` больше 0, используется этот порт. `--no-browser` только печатает адрес и подсказку SSH-туннеля и не открывает браузер. Ожидание — 5 минут. При успехе печатаются путь сохранения, метка учётной записи и `Antigravity authentication successful!`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| Antigravity login | Команда, которая запускает этот вход или импорт. |  | Запускается через --antigravity-login. |
| --antigravity-login | Команда, которая запускает этот вход или импорт. | false | Порт по умолчанию — 51121, путь — /oauth-callback, ожидание — 5 минут. При неудаче только записывается ошибка и происходит возврат. |

## 5. Типичные ошибки и границы

Если порт обратного вызова нельзя слушать или аутентификация не удалась, команда записывает ошибку и возвращает управление. Она не завершается с кодом выхода 13, как Claude или Codex. Это не клиентский ключ API.

## 6. Связанные возможности

Параметры провайдера описаны в разделе [Параметры провайдера Antigravity](/ru/configuration/provider/antigravity). Обратный вызов основной службы — в разделе [Обратные вызовы OAuth](/ru/accounts/oauth-callback). Каталог учётных данных — в разделе [Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth).

## 7. Практический опыт

- [Сопоставьте имя модели клиента с настоящей моделью через псевдоним](/ru/experience/accounts#exp-accounts-alias-client-model)
- [Antigravity скрывает модели, недоступные учётной записи](/ru/experience/accounts#exp-accounts-antigravity-hides-unusable-models)
- [Для учётной записи Google используйте вход Antigravity вместо Gemini CLI](/ru/experience/accounts#exp-accounts-antigravity-instead-of-gemini-cli)
- [Войдите снова после того, как учётные данные Antigravity перестали действовать](/ru/experience/accounts#exp-accounts-antigravity-login-again)
- [Задайте User-Agent на учётных данных Antigravity](/ru/experience/accounts#exp-accounts-antigravity-user-agent)
- [При входе Antigravity продолжайте ждать обратный вызов](/ru/experience/accounts#exp-accounts-antigravity-wait-for-callback)
- [Число потоков обновления 0 всё равно использует значение по умолчанию](/ru/experience/accounts#exp-accounts-refresh-workers-zero)
- [Antigravity Claude идёт через messages](/ru/experience/api#exp-api-antigravity-claude-messages)
- [Изображения Antigravity идут через дополнение чата](/ru/experience/api#exp-api-antigravity-image-chat)
- [Интерфейс подсчёта считает инструменты способом upstream](/ru/experience/api#exp-api-count-tokens-tool-shape)
- [Не ждите, что прокси допишет текст рассуждения, которого нет в каталоге](/ru/experience/api#exp-api-no-synthetic-reasoning)
- [Клиент использует id модели из каталога](/ru/experience/api#exp-api-use-listed-model-id)
- [Объявите уровни мышления в записи модели](/ru/experience/configuration#exp-configuration-declare-thinking-levels)
- [Видимые модели определяются закреплённым каталогом](/ru/experience/introduction#exp-introduction-catalog-is-authoritative)
- [auth_unavailable означает, что нет пригодной учётной записи](/ru/experience/operations#exp-operations-auth-unavailable-means-no-credential)
- [После 429 пропускайте эту модель до времени восстановления](/ru/experience/routing#exp-routing-cooldown-until-reset)
- [Пусть сервер сам завершит вход через прокси](/ru/experience/routing#exp-routing-proxy-for-token-exchange)

