# Опции конфигурации

Значения по умолчанию соответствуют `config.example.yaml`.

## Основные настройки

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `host` | string | `""` | Адрес привязки; `""` прослушивает все IPv4/IPv6; используйте `127.0.0.1` для ограничения доступа только локальным хостом. |
| `port` | integer | `8317` | Порт сервера. |
| `tls.enable` | boolean | `false` | Включить HTTPS. |
| `tls.cert` | string | `""` | Путь к сертификату TLS. |
| `tls.key` | string | `""` | Путь к приватному ключу TLS. |
| `auth-dir` | string | `"~/.cli-proxy-api"` | Директория хранения учетных данных; поддерживается `~`. |
| `api-keys` | string[] | `[]` | Встроенные API-ключи. |
| `debug` | boolean | `false` | Подробное логирование. |
| `commercial-mode` | boolean | `false` | Отключить ресурсоемкое промежуточное ПО (middleware) для снижения потребления памяти. |
| `logging-to-file` | boolean | `false` | Записывать ротируемые файлы логов вместо stdout. |
| `logs-max-total-size-mb` | integer | `0` | Ограничение размера директории логов; 0 отключает ограничение. |
| `usage-statistics-enabled` | boolean | `false` | Включить агрегацию статистики использования в памяти. |
| `proxy-url` | string | `""` | Глобальный прокси (socks5/http/https). |
| `force-model-prefix` | boolean | `false` | Запросы к моделям без префикса используют только учетные данные без префикса. |
| `request-retry` | integer | `3` | Количество повторных попыток при ошибках 403/408/500/502/503/504. |
| `max-retry-interval` | integer | `30` | Максимальное время ожидания (в секундах) восстановления учетных данных перед повторной попыткой. |
| `disable-image-generation` | boolean \| `"chat"` | `false` | Управляет встроенным инструментом `image_generation`: `true` отключает его везде (и возвращает 404 для `/v1/images/generations` и `/v1/images/edits`); `"chat"` отключает внедрение на endpoints не для изображений, но оставляет images endpoints включенными. |
| `routing.strategy` | string | `"round-robin"` | Стратегия выбора учетных данных при наличии нескольких совпадений: `round-robin` или `fill-first`. |
| `routing.session-affinity` | boolean | `false` | Включить session-sticky маршрутизацию для всех клиентов. Session ID извлекается из `metadata.user_id` (Claude Code), `X-Session-ID`, `Session_id` (Codex), `X-Amp-Thread-Id` (Amp CLI), `X-Client-Request-Id` (PI), `conversation_id` или хэша сообщений. |
| `routing.session-affinity-ttl` | string | `"1h"` | TTL хранения привязок session→auth. |
| `ws-auth` | boolean | `false` | Требовать аутентификацию для `/v1/ws`. |
| `nonstream-keepalive-interval` | integer | `0` | Интервал пустых строк для соединений без SSE (в секундах) для предотвращения таймаута простоя; 0 отключает функцию. |
| `codex-instructions-enabled` | boolean | `false` | Включить внедрение официальных инструкций Codex для запросов к Codex API. |
| `streaming.keepalive-seconds` | integer | `0` | Интервал keep-alive для SSE; ≤0 отключает функцию. |
| `streaming.bootstrap-retries` | integer | `0` | Безопасные повторные попытки до получения первого байта. |

## Management API

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `remote-management.allow-remote` | boolean | `false` | Разрешить доступ к управлению не только с localhost. |
| `remote-management.secret-key` | string | `""` | Ключ управления; открытый текст хешируется при запуске; пустое значение отключает все `/v0/management` (404). |
| `remote-management.disable-control-panel` | boolean | `false` | Отключить встроенные ресурсы/маршруты Web UI управления. |
| `remote-management.panel-github-repository` | string | `"https://github.com/router-for-me/Cli-Proxy-API-Management-Center"` | Репозиторий или API релизов для сборки Web UI управления. |

## Квоты и маршрутизация

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `quota-exceeded.switch-project` | boolean | `true` | Автоматическое переключение проекта при исчерпании квоты. |
| `quota-exceeded.switch-preview-model` | boolean | `true` | Автоматическое переключение на preview-модель при исчерпании квоты. |
| `quota-exceeded.antigravity-credits` | boolean | `true` | Credits-fallback для Claude: когда все free-tier учетные данные исчерпаны (429/503), оркестратор повторяет запрос через auth с доступными Google One AI credits. |

## Учетные данные провайдеров (массивы; по умолчанию `[]`)

### Gemini

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `gemini-api-key.*.api-key` | string | `""` | API-ключ. |
| `gemini-api-key.*.prefix` | string | `""` | Необязательный префикс; вызов как `prefix/model`. |
| `gemini-api-key.*.base-url` | string | `"https://generativelanguage.googleapis.com"` | Пользовательский endpoint. |
| `gemini-api-key.*.headers` | object | `{}` | Дополнительные заголовки для этого endpoint. |
| `gemini-api-key.*.proxy-url` | string | `""` | Переопределение прокси для конкретного ключа. |
| `gemini-api-key.*.models.*.name` | string | `""` | Имя исходной модели (upstream). |
| `gemini-api-key.*.models.*.alias` | string | `""` | Псевдоним клиента. |
| `gemini-api-key.*.excluded-models` | string[] | `[]` | Модели для исключения (поддерживаются wildcards). |

### Codex

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `codex-api-key.*.api-key` | строка | `""` | API-ключ. |
| `codex-api-key.*.prefix` | строка | `""` | Необязательный префикс. |
| `codex-api-key.*.base-url` | строка | `""` | Пользовательский эндпоинт Codex. |
| `codex-api-key.*.headers` | объект | `{}` | Дополнительные заголовки. |
| `codex-api-key.*.proxy-url` | строка | `""` | Переопределение прокси для конкретного ключа. |
| `codex-api-key.*.models.*.name` | строка | `""` | Имя исходной модели. |
| `codex-api-key.*.models.*.alias` | строка | `""` | Псевдоним для клиента. |
| `codex-api-key.*.excluded-models` | строка[] | `[]` | Модели для исключения (подстановочные знаки). |

### Claude

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `claude-api-key.*.api-key` | строка | `""` | API-ключ. |
| `claude-api-key.*.prefix` | строка | `""` | Необязательный префикс. |
| `claude-api-key.*.base-url` | строка | `""` | Пользовательский эндпоинт Claude. |
| `claude-api-key.*.headers` | объект | `{}` | Дополнительные заголовки. |
| `claude-api-key.*.proxy-url` | строка | `""` | Переопределение прокси для конкретного ключа. |
| `claude-api-key.*.models.*.name` | string | `""` | Имя модели апстрима. |
| `claude-api-key.*.models.*.alias` | string | `""` | Псевдоним клиента. |
| `claude-api-key.*.excluded-models` | string[] | `[]` | Модели для исключения (подстановочные знаки). |
| `claude-api-key.*.cloak.mode` | string | `"auto"` | Режим маскировки: `auto` (только для приложений, отличных от Claude Code), `always`, `never`. |
| `claude-api-key.*.cloak.strict-mode` | boolean | `false` | `true` удаляет системные сообщения пользователя, оставляя только промпт Claude Code. |
| `claude-api-key.*.cloak.sensitive-words` | string[] | `[]` | Слова для обфускации с помощью символов нулевой ширины. |

### Совместимость с OpenAI

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `openai-compatibility.*.name` | string | `""` | Имя провайдера (используется в UA и т. д.). |
| `openai-compatibility.*.prefix` | string | `""` | Необязательный префикс. |
| `openai-compatibility.*.disabled` | boolean | `false` | Отключить провайдера без удаления из конфигурации; маршрутизация/выбор ключа пропускают его. |
| `openai-compatibility.*.base-url` | string | `""` | Базовый URL провайдера. |
| `openai-compatibility.*.headers` | object | `{}` | Дополнительные заголовки. |
| `openai-compatibility.*.api-key-entries.*.api-key` | string | `""` | API-ключ. |
| `openai-compatibility.*.api-key-entries.*.proxy-url` | string | `""` | Переопределение прокси для конкретного ключа. |
| `openai-compatibility.*.models.*.name` | string | `""` | Имя вышестоящей модели. |
| `openai-compatibility.*.models.*.alias` | string | `""` | Псевдоним клиента. |

### Vertex

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `vertex-api-key.*.api-key` | string | `""` | Значение `x-goog-api-key`. |
| `vertex-api-key.*.prefix` | string | `""` | Необязательный префикс. |
| `vertex-api-key.*.base-url` | string | `""` | Vertex-совместимая конечная точка. |
| `vertex-api-key.*.proxy-url` | string | `""` | Переопределение прокси для конкретного ключа. |
| `vertex-api-key.*.headers` | object | `{}` | Дополнительные заголовки. |
| `vertex-api-key.*.models.*.name` | string | `""` | Имя вышестоящей модели. |
| `vertex-api-key.*.models.*.alias` | string | `""` | Псевдоним клиента. |

## Интеграция с Amp (`ampcode`)

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `ampcode.upstream-url` | string | `""` | Upstream URL для OAuth/управления Amp CLI. |
| `ampcode.upstream-api-key` | string | `""` | Переопределение API-ключа для upstream Amp. |
| `ampcode.upstream-api-keys[].upstream-api-key` | string | `""` | Upstream-ключ для сопоставленных клиентов. |
| `ampcode.upstream-api-keys[].api-keys` | string[] | `[]` | Ключи клиентов, направляемые на этот upstream-ключ. |
| `ampcode.restrict-management-to-localhost` | boolean | `false` | Ограничить маршруты управления Amp только для localhost. |
| `ampcode.force-model-mappings` | boolean | `false` | Принудительное сопоставление моделей перед проверкой локальных API-ключей. |
| `ampcode.model-mappings[].from` | string | `""` | Модель, запрошенная Amp. |
| `ampcode.model-mappings[].to` | string | `""` | Локальная доступная модель для маршрутизации. |

## Управление моделями OAuth
| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `oauth-model-alias` | object | `{}` | Переименование моделей для каждого канала (gemini-cli, vertex, aistudio, antigravity, claude, codex). |
| `oauth-model-alias.*.*.fork` | boolean | `false` | Если `true`, сохраняет оригинал и добавляет псевдоним как дополнительную модель. |
| `oauth-excluded-models` | object | `{}` | Исключение моделей для каждого канала; поддерживаются wildcards. |

## Правила Payload

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `payload.default[].models[].name` | string | `""` | Соответствующее имя модели (поддерживаются wildcards). |
| `payload.default[].models[].protocol` | string | `""` | Ограничение по протоколу: `openai`/`gemini`/`claude`/`codex`/`antigravity`. |
| `payload.default[].params` | object | `{}` | JSON path → значение, применяемое при отсутствии. |
| `payload.default-raw[].models[].name` | string | `""` | Соответствующее имя модели (wildcards). |
| `payload.default-raw[].models[].protocol` | string | `""` | Ограничение по protocol. |
| `payload.default-raw[].params` | object | `{}` | JSON path → необработанное JSON-значение, применяемое при отсутствии (должно быть валидным JSON). |
| `payload.override[].models[].name` | string | `""` | Соответствующее имя модели (wildcards). |
| `payload.override[].models[].protocol` | string | `""` | Ограничение по protocol. |
| `payload.override[].params` | object | `{}` | JSON path → значение всегда перезаписывается. |
| `payload.override-raw[].models[].name` | string | `""` | Соответствующее имя модели (wildcards). |
| `payload.override-raw[].models[].protocol` | string | `""` | Ограничение по protocol. |
| `payload.override-raw[].params` | object | `{}` | JSON path → необработанное JSON-значение, которое всегда перезаписывается (должно быть валидным JSON). |
| `payload.filter[].models[].name` | string | `""` | Соответствующее имя модели (wildcards). |
| `payload.filter[].models[].protocol` | string | `""` | Ограничение по protocol. |
| `payload.filter[].params` | string[] | `[]` | JSON-пути для удаления из payload. |
