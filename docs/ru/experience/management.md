---
title: "Управление"
related_feature_ids:
  - api-keys.codex.priority
  - cli.server.codex-login
  - management.v8.get-credentials
  - management.v8.patch-credentials-fields
  - management.v8.patch-credentials-status
  - management.v8.post-requests-api-call
  - management.v8.post-routing-cooldown-reset
  - oauth.auth-dir.value
  - requests.proxy-url.value
  - route.management-html.get
  - routing.cooldown.disable-cooling
source_issues:
  - 3290
  - 3348
  - 3514
  - 3882
  - 4024
  - 4724
  - 5030
  - 5133
  - 5611
  - 5639
  - 5649
  - 6395
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Управление

## Версия и границы

Практики на этой странице сверены только с конфигурацией, маршрутами или командами, которые ещё есть в закреплённом коммите `911f49cbd49f4fe2516979754a7488a3fd14fe64`. Эта страница не является официальным обещанием поведения. Ключи, cookie, адреса электронной почты, файлы авторизации и тела запросов пользователей сюда не копировались.

## Короткие практики

- <a id="exp-management-reset-cooldown"></a>**Снимайте охлаждение маршрутом управления** (`exp.management.reset-cooldown`). Явление: Квота upstream уже восстановилась, но учётные данные всё ещё пропускаются из-за охлаждения. Действие: Отправьте auth_index этих учётных данных на POST /v8/management/routing/cooldown/reset. PATCH /v8/management/credentials/status меняет только disabled и не снимает охлаждение. Источники issue: [#4724](https://github.com/router-for-me/CLIProxyAPI/issues/4724)、[#5611](https://github.com/router-for-me/CLIProxyAPI/issues/5611)、[#5639](https://github.com/router-for-me/CLIProxyAPI/issues/5639)、[#5649](https://github.com/router-for-me/CLIProxyAPI/issues/5649)。. Официальные страницы: [Операции маршрутизации](/ru/management/v8-routing)、[Охлаждение](/ru/routing/cooldown).
- <a id="exp-management-disable-credential"></a>**Приостанавливайте учётные данные через интерфейс управления** (`exp.management.disable-credential`). Явление: После исчерпания квоты их только пропускает охлаждение, а сам файл продолжает участвовать. Действие: Охлаждение не отключает учётные данные автоматически. Через PATCH /v8/management/credentials/status задайте disabled равным true или false, чтобы приостановить или восстановить их. Источники issue: [#3882](https://github.com/router-for-me/CLIProxyAPI/issues/3882)、[#5133](https://github.com/router-for-me/CLIProxyAPI/issues/5133)。. Официальные страницы: [Учётные данные](/ru/management/v8-credentials)、[Охлаждение](/ru/routing/cooldown).
- <a id="exp-management-api-call-proxy-order"></a>**Проксированный запрос управления всё равно использует глобальный прокси** (`exp.management.api-call-proxy-order`). Явление: Кажется, что вызов со стороны управления всегда идёт напрямую и не использует proxy-url запроса модели. Действие: POST /v8/management/requests/api-call по порядку использует proxy_url тела запроса, прокси учётных данных, затем глобальный requests.proxy-url. Прямое соединение бывает только когда ни один из этих прокси недоступен. Источники issue: [#6395](https://github.com/router-for-me/CLIProxyAPI/issues/6395)。. Официальные страницы: [Проксирование запроса](/ru/management/v8-requests)、[Исходящие запросы](/ru/routing/requests-value).
- <a id="exp-management-disabled-oauth-still-refreshes"></a>**Отключённые учётные данные OAuth всё равно обновляются** (`exp.management.disabled-oauth-still-refreshes`). Явление: После выключения учётных данных токен истекает. Действие: Настоящий файл OAuth после disabled по умолчанию всё ещё обновляется, чтобы не истечь за время паузы. Учётные данные не из OAuth так не обновляются. Источники issue: [#3290](https://github.com/router-for-me/CLIProxyAPI/issues/3290)、[#3514](https://github.com/router-for-me/CLIProxyAPI/issues/3514)。. Официальные страницы: [Вход Codex](/ru/accounts/codex)、[Учётные данные](/ru/management/v8-credentials).
- <a id="exp-management-set-credential-priority"></a>**Задавайте приоритет в поле учётных данных** (`exp.management.set-credential-priority`). Явление: Импортированному JSON нужен более высокий приоритет Plus или Pro. Действие: Измените priority этих учётных данных через PATCH /v8/management/credentials/fields. У нового файла нет отдельного приоритета по умолчанию. Его нужно записать на самих учётных данных. Источники issue: [#3348](https://github.com/router-for-me/CLIProxyAPI/issues/3348)、[#5030](https://github.com/router-for-me/CLIProxyAPI/issues/5030)。. Официальные страницы: [Приоритет учётных данных](/ru/accounts/api-keys-priority)、[Учётные данные](/ru/management/v8-credentials)、[Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth).
- <a id="exp-management-reset-codex-from-panel"></a>**Сбрасывайте учётную запись Codex со страницы управления** (`exp.management.reset-codex-from-panel`). Явление: Нужно сбросить учётную запись Codex, но нашёлся только файл учётных данных. Действие: Сделайте это из интерфейса учётных данных на странице управления. У прокси нет другой отдельной команды сброса. Источники issue: [#4024](https://github.com/router-for-me/CLIProxyAPI/issues/4024)。. Официальные страницы: [Вход Codex](/ru/accounts/codex)、[Прочие конечные точки](/ru/api/openai-other).

## Отдельные страницы

В этой области нет практики, которой нужна отдельная страница.

