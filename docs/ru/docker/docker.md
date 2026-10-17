---
title: Запуск через Docker Compose
feature_ids:
  - mode.docker.compose
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Запуск через Docker Compose

## 1. Какую задачу решает этот раздел

Файл `docker-compose.yml` в корне репозитория описывает сервис `cli-proxy-api`. Им можно скачать или собрать образ, опубликовать фиксированные порты и смонтировать в контейнер конфигурацию, каталог аутентификации, журналы и каталог плагинов. Имя контейнера — `cli-proxy-api`, `pull_policy` равен `always`, `restart` равен `unless-stopped`. Файл не подменяет команду образа. Команда внутри образа — `./CLIProxyAPI`.

## 2. Когда применимо и чего здесь нет

Страница рассчитана на установленный Docker Compose и работу из корня репозитория, где лежит этот файл. Здесь не описаны разовый `docker run`, отдельные параметры входа и скрипты `docker-build.sh` или `docker-build.ps1`.

Строка `env_file: .env` закомментирована, поэтому этот Compose-файл не загружает `.env` в контейнер. Подстановка `${переменная:-значение}` по-прежнему выполняется окружением, из которого запускают Compose. Каталог плагинов уже смонтирован в `/CLIProxyAPI/plugins`. Не добавляйте то же монтирование ещё раз по старой инструкции.

## 3. Как настроить или вызвать

Запускайте из корня репозитория. Имя файла — имя Compose по умолчанию, отдельный `-f` не нужен.

```bash
docker compose up -d
```

Остановить этот проект Compose:

```bash
docker compose down
```

Ниже текущее определение сервиса. Аргументы сборки и закомментированный `env_file` сохранены как в файле:

```yaml
services:
  cli-proxy-api:
    image: ${CLI_PROXY_IMAGE:-eceasy/cli-proxy-api:latest}
    pull_policy: always
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VERSION: ${VERSION:-dev}
        COMMIT: ${COMMIT:-none}
        BUILD_DATE: ${BUILD_DATE:-unknown}
    container_name: cli-proxy-api
    # env_file:
    #   - .env
    environment:
      DEPLOY: ${DEPLOY:-}
    ports:
      - "8317:8317"
      - "8085:8085"
      - "1455:1455"
      - "54545:54545"
      - "51121:51121"
      - "11451:11451"
    volumes:
      - ${CLI_PROXY_CONFIG_PATH:-./config.yaml}:/CLIProxyAPI/config.yaml
      - ${CLI_PROXY_AUTH_PATH:-./auths}:/root/.cli-proxy-api
      - ${CLI_PROXY_LOG_PATH:-./logs}:/CLIProxyAPI/logs
      - ${CLI_PROXY_PLUGIN_PATH:-./plugins}:/CLIProxyAPI/plugins
    restart: unless-stopped
```

`DEPLOY` передаётся в контейнер. Процесс входит в ожидание облачного развёртывания только если значение равно `cloud`. Пустое значение по умолчанию этого не делает. Облачное развёртывание здесь не разбирается.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно. У `mode.docker.compose` значение по умолчанию — пустая строка, поэтому ячейка оставлена пустой. Остальные значения — результаты подстановки, записанные в `docker-compose.yml`.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| mode.docker.compose | Запуск сервиса через `docker-compose.yml` в корне репозитория. |  | Не подменяет команду образа и не загружает закомментированный `env_file`. |
| CLI_PROXY_IMAGE | Образ сервиса. | eceasy/cli-proxy-api:latest | `pull_policy: always`. Образ также можно собрать из Dockerfile текущего каталога по блоку `build` в файле. |
| VERSION | Аргумент сборки. | dev | Используется только при сборке образа. |
| COMMIT | Аргумент сборки. | none | Используется только при сборке образа. |
| BUILD_DATE | Аргумент сборки. | unknown | Используется только при сборке образа. |
| DEPLOY | Переменная окружения, передаваемая в контейнер. | пустая строка | Процесс входит в ожидание облачного развёртывания только при значении `cloud`. |
| CLI_PROXY_CONFIG_PATH | Файл конфигурации на хосте, монтируется в `/CLIProxyAPI/config.yaml`. | ./config.yaml | Путь относительно корня репозитория. |
| CLI_PROXY_AUTH_PATH | Каталог аутентификации на хосте, монтируется в `/root/.cli-proxy-api`. | ./auths | Путь относительно корня репозитория. |
| CLI_PROXY_LOG_PATH | Каталог журналов на хосте, монтируется в `/CLIProxyAPI/logs`. | ./logs | Путь относительно корня репозитория. |
| CLI_PROXY_PLUGIN_PATH | Каталог плагинов на хосте, монтируется в `/CLIProxyAPI/plugins`. | ./plugins | Это монтирование уже есть в файле. |
| ports | Порты, публикуемые на хосте. | 8317, 8085, 1455, 54545, 51121, 11451 | В каждом сопоставлении номера портов совпадают. Отдельных имён этим портам страница не даёт. |

## 5. Типичные ошибки и границы

Если относительный путь по умолчанию отсутствует на хосте, Compose всё равно применяет собственные правила монтирования. Дополнительной проверки существования в файле нет. Закомментированный `env_file` не действует. Пустой `DEPLOY` не включает ожидание облачного развёртывания.

Файл не передаёт `--config`, `--local-model` и другие параметры командной строки. Поведение в контейнере определяется смонтированным `/CLIProxyAPI/config.yaml` и командой образа по умолчанию.

## 6. Связанные возможности

Параметры командной строки описаны в разделе [Параметры командной строки](/ru/introduction/install). Каталоги моделей — в разделе [Каталоги моделей](/ru/introduction/models).

## 7. Практический опыт

- [Замените примеры клиентских ключей](/ru/experience/api#exp-api-replace-example-client-keys)
- [Смонтируйте в контейнер настоящий файл конфигурации](/ru/experience/docker#exp-docker-mount-real-config)
- [Подготовьте конфигурацию и каталог учётных данных до запуска](/ru/experience/docker#exp-docker-prepare-auth-dir)
- [В контейнере продолжайте использовать текущие хранилища](/ru/experience/docker#exp-docker-same-storage-backends)
- [Сделайте файлы страницы управления загружаемыми](/ru/experience/routing#exp-routing-management-page-download)
- [Пусть сервер сам завершит вход через прокси](/ru/experience/routing#exp-routing-proxy-for-token-exchange)
