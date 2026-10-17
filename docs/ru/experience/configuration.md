---
title: "Конфигурация"
related_feature_ids:
  - api-keys.claude.models-thinking-levels
  - api-keys.codex.models-thinking-levels
  - api-keys.openai-compatibility.models-max-context-length
  - api-keys.openai-compatibility.models-thinking-levels
  - cli.server.antigravity-login
  - cli.server.codex-login
  - cli.server.config
  - cli.server.xai-login
  - client.codex.optimize-multi-agent-v2
  - models.codex-catalog.value
  - oauth.providers.antigravity-antigravity-credits
  - oauth.settings.max-context-length
  - requests.payload.filter-params
  - route.v1.get-models
  - route.v1.post-chat-completions
  - route.v1.post-messages
  - route.v1.post-responses
source_issues:
  - 255
  - 482
  - 483
  - 496
  - 508
  - 1509
  - 2185
  - 2836
  - 3386
  - 3718
  - 3842
  - 3932
  - 4708
  - 4728
  - 4825
  - 4845
  - 4883
  - 4885
  - 5007
  - 5066
  - 5207
  - 5409
  - 5499
  - 5895
  - 6362
  - 6552
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Конфигурация

## Версия и границы

Практики на этой странице сверены только с конфигурацией, маршрутами или командами, которые ещё есть в закреплённом коммите `911f49cbd49f4fe2516979754a7488a3fd14fe64`. Эта страница не является официальным обещанием поведения. Ключи, cookie, адреса электронной почты, файлы авторизации и тела запросов пользователей сюда не копировались.

## Короткие практики

- <a id="exp-configuration-declare-thinking-levels"></a>**Объявите уровни мышления в записи модели** (`exp.configuration.declare-thinking-levels`). Явление: У сторонней модели нет xhigh, ultra или max, либо значение усилия зажимается. Действие: Запишите разрешённые уровни в thinking.levels этой модели. Если список не записан, у модели, совместимой с OpenAI, есть только low, medium и high. Источники issue: [#3932](https://github.com/router-for-me/CLIProxyAPI/issues/3932)、[#4708](https://github.com/router-for-me/CLIProxyAPI/issues/4708)、[#4825](https://github.com/router-for-me/CLIProxyAPI/issues/4825)、[#4845](https://github.com/router-for-me/CLIProxyAPI/issues/4845)、[#4883](https://github.com/router-for-me/CLIProxyAPI/issues/4883)、[#4885](https://github.com/router-for-me/CLIProxyAPI/issues/4885)、[#5409](https://github.com/router-for-me/CLIProxyAPI/issues/5409)、[#5499](https://github.com/router-for-me/CLIProxyAPI/issues/5499)。. Официальные страницы: [Мышление моделей](/ru/configuration/thinking-models)、[Вход Antigravity](/ru/accounts/antigravity)、[Claude Messages](/ru/api/claude-messages).
- <a id="exp-configuration-thinking-suffix"></a>**Выберите уровень мышления суффиксом в скобках** (`exp.configuration.thinking-suffix`). Явление: Клиент хочет указать уровень мышления, но в списке моделей нет отдельной модели мышления. Действие: Добавьте суффикс в скобках после имени модели, например (high) или числовой бюджет, который модель принимает. Суффикс важнее параметров мышления в теле запроса. GET /v1/models эти уровни не перечисляет. Не придумывайте id модели мышления через дефис. Источники issue: [#482](https://github.com/router-for-me/CLIProxyAPI/issues/482)、[#483](https://github.com/router-for-me/CLIProxyAPI/issues/483)、[#508](https://github.com/router-for-me/CLIProxyAPI/issues/508)、[#1509](https://github.com/router-for-me/CLIProxyAPI/issues/1509)。. Официальные страницы: [Мышление моделей](/ru/configuration/thinking-models)、[OpenAI Chat](/ru/api/openai-chat)、[Claude Messages](/ru/api/claude-messages)、[Responses](/ru/api/responses).
- <a id="exp-configuration-git-storage-env"></a>**Включайте хранение Git переменными окружения** (`exp.configuration.git-storage-env`). Явление: Установка не в Docker тоже должна сохранять конфигурацию и учётные данные в Git. Действие: Достаточно задать GITSTORE_GIT_URL. Это не ограничено Docker. GITSTORE_LOCAL_PATH, GITSTORE_GIT_USERNAME, GITSTORE_GIT_TOKEN и GITSTORE_GIT_BRANCH задавайте только когда они нужны. Источники issue: [#3386](https://github.com/router-for-me/CLIProxyAPI/issues/3386)。. Официальные страницы: [Параметры командной строки](/ru/introduction/install).
- <a id="exp-configuration-storage-is-not-live-sync"></a>**Git и объектное хранилище — не живая синхронизация нескольких машин** (`exp.configuration.storage-is-not-live-sync`). Явление: Несколько серверов делят Git или объектное хранилище, и результат входа ожидается на другой машине сразу. Действие: Оба бэкенда отправляют изменения после локального изменения учётных данных. Это не живая синхронизация нескольких машин. Другой сервер не видит новые учётные данные в тот же момент, когда вход завершился. Источники issue: [#255](https://github.com/router-for-me/CLIProxyAPI/issues/255)。. Официальные страницы: [Параметры командной строки](/ru/introduction/install).
- <a id="exp-configuration-unknown-keys-on-migrate"></a>**При переносе неизвестные ключи становятся комментариями** (`exp.configuration.unknown-keys-on-migrate`). Явление: В разделе провайдера записаны дополнительные ключи, и ожидается, что среда выполнения их прочитает. Действие: При переносе на v8 нераспознанные ключи собираются в комментарии и игнорируются. Если в файле, который уже v8, появляется неизвестный раздел, загрузка его отклоняет, а не считает действующим примечанием. Источники issue: [#3718](https://github.com/router-for-me/CLIProxyAPI/issues/3718)。. Официальные страницы: [Параметры командной строки](/ru/introduction/install).
- <a id="exp-configuration-reject-minimal-effort"></a>**Не отправляйте уровень мышления, который модель отклоняет** (`exp.configuration.reject-minimal-effort`). Явление: gpt-5.2 отклоняет reasoning effort minimal. Действие: Отправляйте только уровень, который принимает thinking.levels этой модели. Не отправляйте minimal. Источники issue: [#496](https://github.com/router-for-me/CLIProxyAPI/issues/496)。. Официальные страницы: [Мышление моделей](/ru/configuration/thinking-models)、[OpenAI Chat](/ru/api/openai-chat).
- <a id="exp-configuration-levels-or-filter"></a>**Фильтруйте поле, если уровень не разрешён** (`exp.configuration.levels-or-filter`). Явление: Claude Code отправил xhigh модели NVIDIA. Действие: Разрешённые уровни записываются в thinking.levels этой модели. Если объявить их нельзя, уберите поле через payload.filter. Источники issue: [#2185](https://github.com/router-for-me/CLIProxyAPI/issues/2185)。. Официальные страницы: [Мышление моделей](/ru/configuration/thinking-models)、[Правила фильтрации payload](/ru/routing/requests-filter).
- <a id="exp-configuration-antigravity-credits"></a>**Откат на баллы идёт до переключения квоты** (`exp.configuration.antigravity-credits`). Явление: Порядок баллов Antigravity и переключения квоты неясен. Действие: Откат на баллы управляется конфигурацией провайдера и происходит до переключения квоты. Источники issue: [#2836](https://github.com/router-for-me/CLIProxyAPI/issues/2836)。. Официальные страницы: [Параметры провайдера Antigravity](/ru/configuration/provider/antigravity).
- <a id="exp-configuration-levels-before-filter"></a>**Уровень мышления нельзя объявить фильтрацией** (`exp.configuration.levels-before-filter`). Явление: Нужно через payload.filter убрать неподдерживаемый уровень мышления. Действие: Поддерживаемые уровни записываются в thinking.levels записи модели. Фильтрация выполняется слишком поздно и не заменяет это объявление. Источники issue: [#3842](https://github.com/router-for-me/CLIProxyAPI/issues/3842)。. Официальные страницы: [Мышление моделей](/ru/configuration/thinking-models)、[Правила фильтрации payload](/ru/routing/requests-filter).
- <a id="exp-configuration-advertise-context-length"></a>**Меняйте объявляемое окно через max-context-length** (`exp.configuration.advertise-context-length`). Явление: Сторонней модели или модели OAuth нужно снаружи показать другую длину контекста. Действие: Задайте max-context-length на модели или в oauth.settings. Не добавляйте поле каталога и не переносите число окна, указанное в issue. Источники issue: [#4728](https://github.com/router-for-me/CLIProxyAPI/issues/4728)、[#5066](https://github.com/router-for-me/CLIProxyAPI/issues/5066)、[#5895](https://github.com/router-for-me/CLIProxyAPI/issues/5895)、[#6362](https://github.com/router-for-me/CLIProxyAPI/issues/6362)、[#6552](https://github.com/router-for-me/CLIProxyAPI/issues/6552)。. Официальные страницы: [Псевдонимы моделей upstream](/ru/accounts/api-keys-models)、[Каталоги моделей](/ru/introduction/models)、[Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth).
- <a id="exp-configuration-optimize-multi-agent"></a>**Включите переключатель совместимости нескольких агентов** (`exp.configuration.optimize-multi-agent`). Явление: spawn_agent у Codex сообщает зарезервированное имя, или Grok отклоняет субагента Codex. Действие: Задайте client.codex.optimize-multi-agent-v2 равным true. Значение false по умолчанию не меняет поведение клиента. Не используйте другие незарегистрированные переключатели, упомянутые в issue. Источники issue: [#5007](https://github.com/router-for-me/CLIProxyAPI/issues/5007)、[#5207](https://github.com/router-for-me/CLIProxyAPI/issues/5207)。. Официальные страницы: [Вход Codex](/ru/accounts/codex)、[Вход xAI](/ru/accounts/xai)、[Каталог клиента Codex](/ru/routing/client).

## Отдельные страницы

В этой области нет практики, которой нужна отдельная страница.

