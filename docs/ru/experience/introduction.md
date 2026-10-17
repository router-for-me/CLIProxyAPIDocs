---
title: "Введение"
related_feature_ids:
  - cli.server.antigravity-login
  - cli.server.claude-login
  - cli.server.codex-login
  - cli.server.config
  - cli.server.kimi-login
  - cli.server.local-model
  - models.catalog.value
  - models.codex-catalog.value
  - route.v1.get-models
source_issues:
  - 917
  - 1577
  - 1964
  - 2064
  - 2139
  - 2216
  - 2806
  - 2938
  - 2980
  - 2994
  - 3135
  - 3647
  - 3803
  - 4195
  - 4476
  - 4494
  - 5554
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Введение

## Версия и границы

Практики на этой странице сверены только с конфигурацией, маршрутами или командами, которые ещё есть в закреплённом коммите `911f49cbd49f4fe2516979754a7488a3fd14fe64`. Эта страница не является официальным обещанием поведения. Ключи, cookie, адреса электронной почты, файлы авторизации и тела запросов пользователей сюда не копировались.

## Короткие практики

- <a id="exp-introduction-start-with-config-or-login"></a>**Перед запуском дайте конфигурацию или вход** (`exp.introduction.start-with-config-or-login`). Явление: У процесса нет ни файла конфигурации, ни учётных данных. Действие: Укажите --config на файл конфигурации или сначала выполните вход провайдера, например --claude-login, и только потом запускайте службу. Источники issue: [#917](https://github.com/router-for-me/CLIProxyAPI/issues/917)。. Официальные страницы: [Вход Claude](/ru/accounts/claude)、[Параметры командной строки](/ru/introduction/install).
- <a id="exp-introduction-catalog-is-authoritative"></a>**Видимые модели определяются закреплённым каталогом** (`exp.introduction.catalog-is-authoritative`). Явление: Клиент не видит какую-то модель Codex или Kimi либо всё ещё запрашивает удалённый id. Действие: Ориентируйтесь на каталог моделей и тип учётной записи закреплённой версии. Имени, которого нет в каталоге, не добавляют, и id, удалённый upstream, не сохраняют. После обновления до версии, где эта запись каталога есть, войдите снова или перезапустите процесс, чтобы завершить удалённое обновление моделей. Не используйте длину контекста, указанную в issue. Источники issue: [#1577](https://github.com/router-for-me/CLIProxyAPI/issues/1577)、[#2139](https://github.com/router-for-me/CLIProxyAPI/issues/2139)、[#2216](https://github.com/router-for-me/CLIProxyAPI/issues/2216)、[#2806](https://github.com/router-for-me/CLIProxyAPI/issues/2806)、[#2938](https://github.com/router-for-me/CLIProxyAPI/issues/2938)、[#2980](https://github.com/router-for-me/CLIProxyAPI/issues/2980)、[#2994](https://github.com/router-for-me/CLIProxyAPI/issues/2994)、[#3647](https://github.com/router-for-me/CLIProxyAPI/issues/3647)、[#3803](https://github.com/router-for-me/CLIProxyAPI/issues/3803)、[#4195](https://github.com/router-for-me/CLIProxyAPI/issues/4195)、[#4476](https://github.com/router-for-me/CLIProxyAPI/issues/4476)、[#4494](https://github.com/router-for-me/CLIProxyAPI/issues/4494)。. Официальные страницы: [Вход Antigravity](/ru/accounts/antigravity)、[Вход Codex](/ru/accounts/codex)、[Вход Kimi](/ru/accounts/kimi)、[Каталоги моделей](/ru/introduction/models)、[OpenAI Chat](/ru/api/openai-chat).
- <a id="exp-introduction-copy-example-config"></a>**Используйте файл примера как начало конфигурации** (`exp.introduction.copy-example-config`). Явление: В пакете выпуска нет готового config.yaml, или нужно сбросить состояние управления. Действие: Скопируйте config.example.yaml этой версии в config.yaml и затем запускайте. Homebrew точно так же правит конфигурацию после установки и задаёт secret-key. Источники issue: [#1964](https://github.com/router-for-me/CLIProxyAPI/issues/1964)、[#2064](https://github.com/router-for-me/CLIProxyAPI/issues/2064)、[#3135](https://github.com/router-for-me/CLIProxyAPI/issues/3135)。. Официальные страницы: [Параметры командной строки](/ru/introduction/install).
- <a id="exp-introduction-local-model-catalog"></a>**Переключатель локальных моделей пропускает удалённое обновление** (`exp.introduction.local-model-catalog`). Явление: Не нужно при запуске загружать удалённый список моделей. Действие: --local-model использует встроенный каталог и пропускает удалённое обновление. Если у поля каталога уже есть содержимое, по-прежнему действует это поле. Источники issue: [#5554](https://github.com/router-for-me/CLIProxyAPI/issues/5554)。. Официальные страницы: [Параметры командной строки](/ru/introduction/install)、[Каталоги моделей](/ru/introduction/models).

## Отдельные страницы

В этой области нет практики, которой нужна отдельная страница.

