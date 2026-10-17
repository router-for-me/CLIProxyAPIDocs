---
title: "Docker"
related_feature_ids:
  - cli.server.config
  - mode.docker.compose
  - oauth.auth-dir.value
source_issues:
  - 32
  - 305
  - 403
  - 2009
  - 2450
  - 2682
  - 2950
  - 3272
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Docker

## Версия и границы

Практики на этой странице сверены только с конфигурацией, маршрутами или командами, которые ещё есть в закреплённом коммите `911f49cbd49f4fe2516979754a7488a3fd14fe64`. Эта страница не является официальным обещанием поведения. Ключи, cookie, адреса электронной почты, файлы авторизации и тела запросов пользователей сюда не копировались.

## Короткие практики

- <a id="exp-docker-mount-real-config"></a>**Монтируйте в контейнер настоящий файл конфигурации** (`exp.docker.mount-real-config`). Явление: После запуска контейнер принимает config.yaml за каталог и завершается. Действие: Сначала положите на хост config.yaml, скопированный из примера, затем смонтируйте его в контейнер как файл. Не монтируйте путь, которого ещё нет. Источники issue: [#32](https://github.com/router-for-me/CLIProxyAPI/issues/32)、[#2009](https://github.com/router-for-me/CLIProxyAPI/issues/2009)、[#2450](https://github.com/router-for-me/CLIProxyAPI/issues/2450)、[#2682](https://github.com/router-for-me/CLIProxyAPI/issues/2682)、[#2950](https://github.com/router-for-me/CLIProxyAPI/issues/2950)。. Официальные страницы: [Параметры командной строки](/ru/introduction/install)、[Запуск через Docker Compose](/ru/docker/docker).
- <a id="exp-docker-prepare-auth-dir"></a>**Перед запуском подготовьте каталоги конфигурации и учётных данных** (`exp.docker.prepare-auth-dir`). Явление: Compose не запускается, потому что каталога нет или в конфигурации нет auth-dir. Действие: Перед запуском создайте монтируемые каталоги конфигурации и учётных данных и задайте oauth.auth-dir в config.yaml. Источники issue: [#305](https://github.com/router-for-me/CLIProxyAPI/issues/305)、[#3272](https://github.com/router-for-me/CLIProxyAPI/issues/3272)。. Официальные страницы: [Запуск через Docker Compose](/ru/docker/docker)、[Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth).
- <a id="exp-docker-same-storage-backends"></a>**Контейнер продолжает использовать уже существующие способы хранения** (`exp.docker.same-storage-backends`). Явление: На платформе вроде Zeabur кажется, что нужен ещё один набор переключателей хранения. Действие: Контейнер по-прежнему использует уже поддерживаемые локальный каталог, Git, базу данных или объектное хранилище. Не ищите ключ хранения, особый для платформы. Источники issue: [#403](https://github.com/router-for-me/CLIProxyAPI/issues/403)。. Официальные страницы: [Запуск через Docker Compose](/ru/docker/docker).

## Отдельные страницы

В этой области нет практики, которой нужна отдельная страница.

