# Опции конфигурации

Значения по умолчанию и доступные поля синхронизированы с `config.example.yaml`.

## Основные настройки

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `host` | string | `""` | Адрес привязки; `""` прослушивает все интерфейсы IPv4/IPv6. Используйте `127.0.0.1` или `localhost` только для локального доступа. |
| `port` | integer | `8317` | Порт сервера. |
| `tls.enable` | boolean | `false` | Включить HTTPS. |
| `tls.cert` / `tls.key` | string | `""` | Пути к сертификату TLS и закрытому ключу. |
| `auth-dir` | string | `"~/.cli-proxy-api"` | Директория учетных данных; поддерживается `~`. |
| `api-keys` | string[] | `[]` | API-ключи, принимаемые этим прокси. |
| `debug` | boolean | `false` | Включить отладочное логирование. |
| `request-log` | boolean | `false` | Включить подробное логирование запросов и ответов. |
| `pprof.enable` | boolean | `false` | Включить HTTP-сервер отладки pprof. |
| `pprof.addr` | string | `"127.0.0.1:8316"` | Адрес привязки pprof; оставляйте его локальным. |
| `commercial-mode` | boolean | `false` | Отключить ресурсоемкое логирование запросов и middleware для снижения потребления памяти. |
| `logging-to-file` | boolean | `false` | Записывать ротируемые логи приложения вместо stdout. |
| `logs-max-total-size-mb` | integer | `0` | Ограничение общего размера каталога логов в MB; `0` отключает ограничение. |
| `error-logs-max-files` | integer | `10` | Максимум файлов логов ошибок при отключенном логировании запросов; `0` отключает очистку. |
| `usage-statistics-enabled` | boolean | `false` | Включить агрегацию статистики использования в памяти. |
| `redis-usage-queue-retention-seconds` | integer | `60` | Сколько секунд хранить в памяти элементы очереди использования для Management API; максимум `3600`. |
| `proxy-url` | string | `""` | Глобальный исходящий прокси (`socks5`, `http` или `https`). `proxy-url` учетных данных может иметь значение `direct` или `none`, чтобы обойти его и прокси окружения. |
| `force-model-prefix` | boolean | `false` | При `true` запросы моделей без префикса используют только учетные данные без префикса (кроме случая, когда префикс равен имени модели). |
| `passthrough-headers` | boolean | `false` | Передавать клиентам отфильтрованные заголовки ответа upstream. |
| `request-retry` | integer | `3` | Количество повторов для ответов 403/408/500/502/503/504. |
| `max-retry-credentials` | integer | `0` | Максимум учетных данных для одной неудавшейся попытки; `0` сохраняет прежнее поведение «попробовать все». |
| `max-retry-interval` | integer | `30` | Максимальное ожидание (секунды) охлаждаемой учетной записи перед повтором. |
| `disable-cooling` | boolean | `false` | Глобально отключить планирование cooldown для учетных данных/моделей. |
| `save-cooldown-status` | boolean | `false` | Сохранять состояние cooldown в файлах `.cds` рядом с auth-файлами. |
| `transient-error-cooldown-seconds` | integer | `0` | Cooldown для временных ошибок 408/500/502/503/504; `0` использует прежние 60 секунд, `-1` отключает его. |
| `disable-claude-cloak-mode` | boolean | `false` | Глобально отключить маскировку запросов Claude; отдельная учетная запись может переопределить это. |
| `disable-image-generation` | boolean \| `"chat"` \| `"passthrough"` | `false` | `true` отключает генерацию изображений везде и возвращает 404 для `/v1/images/*`; `"chat"` отключает внедрение только вне image endpoints; `"passthrough"` не меняет клиентский payload вне image endpoints и ведет себя как `"chat"` для image endpoints. |
| `gpt-image-2-base-model` | string | `"gpt-5.4-mini"` | Базовая модель для устаревшего hosted image-generation пути; должна начинаться с `gpt-`. |
| `video-result-auth-cache-ttl` | string | `"3h"` | Время привязки ID видео к учетной записи, создавшей его. |
| `auth-auto-refresh-workers` | integer | `16` | Число workers автообновления OAuth/file auth; значение больше `0` заменяет значение по умолчанию. |
| `ws-auth` | boolean | `true` | Требовать аутентификацию для `/v1/ws`. |
| `nonstream-keepalive-interval` | integer | `0` | Выводить пустые строки каждые N секунд для нестриминговых ответов; `0` отключает. |
| `streaming.keepalive-seconds` | integer | `0` | Интервал SSE keep-alive; ≤ `0` отключает. |
| `streaming.bootstrap-retries` | integer | `0` | Безопасные повторы стриминга до отправки первого байта. |
| `antigravity-signature-cache-enabled` | boolean | `true` | Предпочитать и проверять кешированные подписи thinking blocks; устанавливайте `false` только для bypass mode. |
| `antigravity-signature-bypass-strict` | boolean | `false` | В bypass mode проверять полную protobuf-структуру подписи Claude, а не только базовый формат. |

## Management API

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `remote-management.allow-remote` | boolean | `false` | Разрешить управление не только с localhost. |
| `remote-management.secret-key` | string | `""` | Ключ управления; открытый текст хешируется при запуске. Пустое значение отключает все маршруты `/v0/management` (404). |
| `remote-management.disable-control-panel` | boolean | `false` | Отключить встроенные ресурсы и маршруты панели управления. |
| `remote-management.disable-auto-update-panel` | boolean | `false` | Отключить периодические фоновые обновления панели; при отсутствии она все равно будет загружена при первом доступе. |
| `remote-management.panel-github-repository` | string | `"https://github.com/router-for-me/Cli-Proxy-API-Management-Center"` | Репозиторий или URL releases API пакета панели управления. |

## Плагины

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `plugins.enabled` | boolean | `false` | Включить доверенные динамические плагины в процессе. |
| `plugins.dir` | string | `"plugins"` | Каталог обнаружения плагинов. |
| `plugins.store-sources` | string[] | `[]` | Дополнительные URL реестров plugin store; официальный реестр включен всегда. |
| `plugins.store-auth[].match` | string | `""` | URL-префикс для правила аутентификации plugin store; для HTTP требуется `allow-insecure: true`. |
| `plugins.store-auth[].apply-to` | string[] | `[]` | Типы аутентифицируемых запросов: `registry`, `metadata`, `artifact`. |
| `plugins.store-auth[].type` | string | `""` | Тип аутентификации: `none`, `bearer`, `basic`, `header` или `github-token`. |
| `plugins.store-auth[].token-env` | string | `""` | Переменная окружения с bearer, GitHub или другим токеном. |
| `plugins.store-auth[].username-env` / `password-env` | string | `""` | Переменные окружения имени пользователя и пароля для basic auth. |
| `plugins.store-auth[].header-name` / `header-value-env` | string | `""` | Имя заголовка и переменная окружения с его значением для `header` auth. |
| `plugins.store-auth[].allow-insecure` | boolean | `false` | Разрешить небезопасную конфигурацию аутентификации, если она поддерживается. |
| `plugins.configs.<plugin-id>.enabled` | boolean | `false` | Включить экземпляр плагина; это не меняет `plugins.enabled`. |
| `plugins.configs.<plugin-id>.priority` | integer | `0` | Приоритет запуска и маршрутизации плагина. |

## Квоты, маршрутизация и Codex

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `quota-exceeded.switch-project` | boolean | `true` | Автоматически переключать проект при исчерпании квоты. |
| `quota-exceeded.switch-preview-model` | boolean | `true` | Автоматически переключаться на preview-модель при исчерпании. |
| `quota-exceeded.antigravity-credits` | boolean | `true` | Последний fallback Claude: после исчерпания всех free-tier auth (429/503) использовать auth с Google One AI credits. |
| `routing.strategy` | string | `"round-robin"` | Стратегия выбора учетных данных: `round-robin` или `fill-first`. |
| `routing.session-affinity` | boolean | `false` | Привязать сессии к учетным данным. ID берется из `metadata.user_id`, `X-Session-ID`, `Session_id`, `X-Client-Request-Id`, `conversation_id` или хэша сообщений; failover остается включенным. |
| `routing.session-affinity-ttl` | string | `"1h"` | TTL привязки сессии к учетным данным. |
| `codex.identity-confuse` | boolean | `false` | При `fill-first` или session affinity переназначать Codex cache и installation IDs для выбранной auth. |

## Учетные данные провайдеров

Все списки провайдеров по умолчанию `[]`. `priority` по умолчанию `0`; большее значение предпочтительнее. `models.*.display-name` — название в каталоге моделей, а `models.*.force-mapping` переписывает поле модели в upstream-ответе на псевдоним клиента.

### Gemini и Native Interactions

`gemini-api-key[]` и `interactions-api-key[]` имеют одинаковые поля; второй используется только для прямого выполнения `/v1beta/interactions`.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `<provider>.*.api-key` | string | `""` | API-ключ. |
| `<provider>.*.priority` | integer | `0` | Приоритет выбора учетной записи. |
| `<provider>.*.prefix` | string | `""` | Необязательный префикс; вызов как `prefix/model`. |
| `<provider>.*.disable-cooling` | boolean | `false` | Отключить cooldown для этой учетной записи. |
| `<provider>.*.base-url` | string | `"https://generativelanguage.googleapis.com"` | Пользовательский endpoint. |
| `<provider>.*.headers` | object | `{}` | Дополнительные заголовки запросов. |
| `<provider>.*.proxy-url` | string | `""` | Переопределение прокси для ключа. |
| `<provider>.*.models.*.name` / `alias` | string | `""` | Имя upstream-модели и псевдоним клиента. |
| `<provider>.*.models.*.display-name` | string | `""` | Человекочитаемая метка каталога моделей. |
| `<provider>.*.models.*.force-mapping` | boolean | `false` | Возвращать псевдоним в поле модели upstream-ответа. |
| `<provider>.*.excluded-models` | string[] | `[]` | Исключаемые модели; поддерживаются wildcards. |

### Codex и xAI

`codex-api-key[]` и `xai-api-key[]` используют следующие поля; xAI использует native xAI executor.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `<provider>.*.api-key`, `priority`, `prefix`, `disable-cooling`, `headers`, `proxy-url`, `excluded-models` | mixed | — | Те же значения, что и у полей учетных данных Gemini. |
| `<provider>.*.base-url` | string | — | Обязательный пользовательский endpoint; записи с пустым значением отбрасываются. |
| `<provider>.*.websockets` | boolean | `false` | Использовать upstream WebSocket transport Responses API. |
| `<provider>.*.models.*.name` / `alias` / `display-name` / `force-mapping` | mixed | — | Те же поля сопоставления моделей, что выше. |

### Claude

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `claude-api-key.*.api-key`, `priority`, `prefix`, `disable-cooling`, `base-url`, `headers`, `proxy-url`, `excluded-models` | mixed | — | Те же значения, что и у полей учетных данных Gemini. |
| `claude-api-key.*.models.*.name` / `alias` / `display-name` / `force-mapping` | mixed | — | Сопоставление upstream и управление переписыванием модели ответа. |
| `claude-api-key.*.rebuild-mid-system-message` | boolean | `false` | Перемещать сообщения с ролью `system` в top-level поле Claude system. |
| `claude-api-key.*.cloak.mode` | string | `"auto"` | Режим маскировки: `auto` (не Claude Code клиенты), `always` или `never`. |
| `claude-api-key.*.cloak.strict-mode` | boolean | `false` | Удалять system-сообщения пользователя, оставляя только промпт Claude Code. |
| `claude-api-key.*.cloak.sensitive-words` | string[] | `[]` | Слова для обфускации символами нулевой ширины. |
| `claude-api-key.*.cloak.cache-user-id` | boolean | `false` | Повторно использовать кешированный `user_id` для ключа API. |
| `claude-api-key.*.experimental-cch-signing` | boolean | `false` | Подписывать финальное замаскированное тело `/v1/messages` текущим алгоритмом Claude Code CCH. |

### Совместимость с OpenAI

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `openai-compatibility.*.name`, `priority`, `prefix`, `base-url`, `headers` | mixed | — | Идентификатор провайдера, приоритет, необязательный префикс, endpoint и заголовки. |
| `openai-compatibility.*.disabled` / `disable-cooling` | boolean | `false` | Отключить провайдера или его cooldown scheduling. |
| `openai-compatibility.*.api-key-entries.*.api-key` / `proxy-url` | string | `""` | API-ключ провайдера и необязательный прокси для ключа. |
| `openai-compatibility.*.models.*.name` / `alias` / `display-name` / `force-mapping` | mixed | — | Сопоставление upstream и переписывание модели ответа. |
| `openai-compatibility.*.models.*.image` | boolean | `false` | Разрешить модель для `/v1/images/generations` и `/v1/images/edits`. |
| `openai-compatibility.*.models.*.input-modalities` / `output-modalities` | string[] | `[]` | Заявленные возможности ввода/вывода, например `text` и `image`. |
| `openai-compatibility.*.models.*.thinking.levels` | string[] | `["low", "medium", "high"]` | Поддерживаемые уровни reasoning effort. |

### Vertex-совместимые API-ключи

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `vertex-api-key.*.api-key`, `priority`, `prefix`, `base-url`, `headers`, `proxy-url`, `excluded-models` | mixed | — | Настройки Vertex-совместимых учетных данных и маршрутизации. |
| `vertex-api-key.*.models.*.name` / `alias` / `display-name` / `force-mapping` | mixed | — | Сопоставление upstream и переписывание модели ответа. |

## OAuth Model Controls и заголовки по умолчанию

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `oauth-model-alias` | object | `{}` | Псевдонимы моделей по OAuth-каналу: `vertex`, `aistudio`, `antigravity`, `claude`, `codex`, `kimi`, `xai` или ключ OAuth plugin provider. |
| `oauth-model-alias.*.*.name` / `alias` | string | `""` | ID upstream-модели и видимой клиенту модели. |
| `oauth-model-alias.*.*.fork` | boolean | `false` | Сохранить upstream-модель и дополнительно показать псевдоним. |
| `oauth-model-alias.*.*.display-name` | string | `""` | Метка каталога для псевдонима. |
| `oauth-model-alias.*.*.force-mapping` | boolean | `false` | Возвращать клиентский псевдоним в поле модели upstream-ответа. |
| `oauth-excluded-models` | object | `{}` | Исключаемые OAuth-модели по каналу; поддерживаются wildcards. |
| `claude-header-defaults.user-agent`, `package-version`, `runtime-version`, `timeout` | string | `""` | Заголовки Claude OAuth по умолчанию, если клиент их не прислал. |
| `claude-header-defaults.os` / `arch` | string | `""` | По умолчанию определяются средой выполнения; при стабилизации device profile используются как зафиксированная базовая платформа. |
| `claude-header-defaults.stabilize-device-profile` | boolean | `false` | Зафиксировать OS/архитектуру для каждой auth на настроенной базовой линии. |
| `codex-header-defaults.user-agent` / `beta-features` | string | `""` | Заголовки Codex OAuth по умолчанию; `beta-features` применяется только к WebSocket-запросам. |

## Правила Payload

`payload.default`, `default-raw`, `override`, `override-raw` и `filter` — массивы правил. `default*` записывает только отсутствующие значения, `override*` записывает всегда, `filter` удаляет пути; значения `*-raw` должны быть валидным JSON.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `payload.<rule>[].models[].name` | string | `""` | Подходящее имя модели; поддерживаются wildcards. |
| `payload.<rule>[].models[].protocol` | string | `""` | Целевой протокол: `openai`, `responses`, `gemini`, `claude`, `codex` или `antigravity`. |
| `payload.<rule>[].models[].from-protocol` | string | `""` | Ограничить исходный протокол: `openai`, `responses`, `gemini` или `claude`. |
| `payload.<rule>[].models[].headers` | object | `{}` | Необходимые паттерны заголовков; значения поддерживают wildcard `*`. |
| `payload.<rule>[].models[].match` / `not-match` | object[] | `[]` | Условия JSON path, которые должны равняться или не равняться настроенным значениям. |
| `payload.<rule>[].models[].exist` / `not-exist` | string[] | `[]` | JSON paths, которые должны существовать и быть не null, либо отсутствовать/null. |
| `payload.default[].params` / `payload.override[].params` | object | `{}` | JSON path → значение. |
| `payload.default-raw[].params` / `payload.override-raw[].params` | object | `{}` | JSON path → raw JSON значение. |
| `payload.filter[].params` | string[] | `[]` | JSON paths для удаления. |
