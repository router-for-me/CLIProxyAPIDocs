# Опции конфигурации

Значения по умолчанию и доступные поля соответствуют макету v8 в `config.example.yaml`.

Для файла v8 установите `config-version: 8`. Существующие старые файлы и запросы `/v0/management` продолжают работать. Если одновременно заданы поле v8 и его старое написание, побеждает значение v8, включая `false`, `0` и пустые коллекции; старое поле удаляется при загрузке или сохранении. Поля, существующие только в старом макете, остаются на месте до успешной записи конфигурации через `/v8/management`. Одна установка `config-version: 8` или чтение конфигурации файл не мигрирует. Запись управления v8 отклоняет старые имена полей и неизвестные корневые разделы.

Корневое отображение `api-keys` зарезервировано для групп upstream-провайдеров. Клиентские ключи, которые раньше находились в корневом списке `api-keys`, теперь задаются в `access.api-keys`. Эти два значения не могут использовать один ключ YAML.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `config-version` | integer | — | При наличии должно быть `8`. |

## Сервер

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `server.host` | string | `""` | Адрес привязки. Пустое значение слушает все интерфейсы IPv4 и IPv6. Используйте `127.0.0.1` или `localhost` только для локального доступа. |
| `server.port` | integer | `8317` | Порт сервера. `0` и отрицательное значение также возвращаются к `8317`. |
| `server.trusted-proxies` | string[] | `[]` | IP или CIDR, которым разрешено передавать заголовки клиентского IP. Пустой список никому не доверяет. После изменения нужна перезагрузка. |
| `server.tls.enable` | boolean | `false` | Включить HTTPS. |
| `server.tls.cert` / `server.tls.key` | string | `""` | Пути к сертификату TLS и закрытому ключу. |
| `server.commercial-mode` | boolean | `false` | Отключить ресурсоемкое логирование запросов и middleware для снижения потребления памяти. |
| `server.discovery.enabled` | boolean | `false` | Объявлять `_ai-gateway._tcp` через mDNS / DNS-SD. Docker должен использовать host networking: link-local multicast не проходит стандартный мост. |
| `server.discovery.service-name` | string | `""` | Необязательный префикс имени. Объявляется как `CPA-<ShortID>` или `<name>-<ShortID>`. |
| `server.discovery.service-type` | string | `"_ai-gateway._tcp"` | Тип службы DNS-SD. |
| `server.discovery.subtypes` | string[] | chat, responses, messages, generate-content, interactions | Подтипы протоколов API. Каждое значение содержит начальное подчеркивание, например `_responses`. |
| `server.discovery.interfaces.include` / `exclude` | string[] | `[]` | Разрешенные интерфейсы и дополнительные шаблоны исключения. Пустой include автоматически определяет физические интерфейсы. |
| `server.discovery.auth-required` | boolean | `true` | Объявлять, что клиентам нужна аутентификация. |
| `server.discovery.advertise-management` | boolean | `false` | Объявлять доступность управления. |

## Management API

Пустой `secret-key` отключает `/v0/management` и `/v8/management` (404). Доступ с localhost также требует ключ.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `management.allow-remote` | boolean | `false` | Разрешить управление не только с localhost. |
| `management.secret-key` | string | `""` | Ключ управления. Открытый текст хешируется при запуске. |
| `management.disable-control-panel` | boolean | `false` | Отключить встроенные ресурсы и маршруты панели управления. |
| `management.disable-auto-update-panel` | boolean | `false` | Отключить периодические фоновые обновления панели. Отсутствующая панель все равно загружается при первом доступе. |
| `management.base-url` | string | `http://127.0.0.1:<port>` | Базовый URL удаленного управления для `cliproxyapi --tui`. `--management-base-url` его заменяет. |
| `management.panel-github-repository` | string | `"https://github.com/router-for-me/Cli-Proxy-API-Management-Center"` | Репозиторий или URL releases API пакета панели управления. |

## Доступ

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `access.api-keys` | string[] | `[]` | Клиентские ключи, принимаемые этим прокси. Это не ключи upstream-провайдеров. |

## Маршрутизация

`routing.strategy` принимает `round-robin` (по умолчанию), `weighted-round-robin` или `fill-first`. `weightedroundrobin`, `wrr`, `fillfirst` и `ff` являются псевдонимами.

Взвешенный round-robin использует целочисленный `weight` каждой учетной записи. Пропущенное значение равно `1`, максимум — `1,000,000`, а неположительный вес исключает учетную запись, пока действует эта стратегия. Для OAuth или файловых учетных данных поместите числовой `weight` на верхний уровень auth JSON.

Уже установленная привязка сессии важнее приоритета учетных данных. Приоритет по-прежнему выбирает холодные привязки, запросы без сессии и повторную привязку после failover.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `routing.strategy` | string | `"round-robin"` | Стратегия выбора учетных данных. |
| `routing.session-affinity` | boolean | `false` | Привязать сессии к учетным данным. Сначала используются явные заголовки сессий Claude Code, Codex, OpenCode и pi, затем `prompt_cache_key`, ID разговоров Responses, старые ID тела, execution или производная идентичность сессии и хеш первого сообщения. Failover остается включенным. |
| `routing.session-affinity-ttl` | string | `"1h"` | TTL привязки сессии к учетным данным. Значение меньше одной секунды повышается до одной секунды. |
| `routing.session-affinity-subagents` | boolean | `true` | Дочерние сессии со ссылкой на родителя повторно используют учетные данные родителя для Claude, Codex, Antigravity и Gemini. `false` распределяет их fallback-селектором. Игнорируется при выключенной session affinity. |
| `routing.force-model-prefix` | boolean | `false` | Запросы моделей без префикса используют только учетные данные без префикса, кроме случая, когда префикс равен имени модели. |
| `routing.retry.request-retry` | integer | `3` | Дополнительные раунды учетных данных после раунда 0. Раунд `r` допускает только учетные данные, чье эффективное значение не меньше `r`. Применяется к HTTP 403, 408, 429, 500, 502, 503 и 504. |
| `routing.retry.max-retry-credentials` | integer | `0` | Число различных учетных данных в каждом раунде после фильтрации раунда. `0` пробует все подходящие. Пропущенные из-за предела учетные данные все равно стареют вместе с глобальным раундом. |
| `routing.retry.max-retry-interval` | integer | `30` | Максимальное ожидание cooldown между раундами в секундах. `0` или меньше означает не ждать. Это не отключает failover внутри раунда или немедленные раунды. |
| `routing.cooldown.disable-cooling` | boolean | `false` | Глобально отключить cooldown учетных данных и моделей. Присутствующее значение учетной записи или провайдера его заменяет. |
| `routing.cooldown.save-cooldown-status` | boolean | `false` | Сохранять состояние cooldown в файлах `.cds` рядом с auth-файлами. |
| `routing.cooldown.transient-error-cooldown-seconds` | integer | `0` | Cooldown для временных ошибок 408, 500, 502, 503, 504 и 520-526. `0` использует прежние 60 секунд. `-1` отключает его. |

Для `request-retry` отдельной учетной записи явное неотрицательное значение побеждает, `0` допускает только раунд 0, а пропущенное или отрицательное значение наследует `routing.retry.request-retry`.

## Запросы

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `requests.proxy-url` | string | `""` | Глобальный исходящий прокси (`socks5`, `http` или `https`). |
| `requests.passthrough-headers` | boolean | `false` | Передавать клиентам отфильтрованные заголовки ответа upstream. |
| `requests.nonstream-keepalive-interval` | integer | `0` | Выводить пустые строки каждые N секунд для нестриминговых ответов. `0` отключает. |
| `requests.streaming.keepalive-seconds` | integer | `0` | Интервал SSE keep-alive. Значения `<= 0` отключают его. |
| `requests.streaming.bootstrap-retries` | integer | `0` | Безопасные повторы стриминга до отправки первого байта. |

`proxy-url` отдельной записи принимает `direct` или `none`, чтобы обойти и этот прокси, и прокси окружения. Значения заголовков, начинающиеся с `$`, копируют соответствующий заголовок клиентского запроса и опускаются, если клиент его не отправил.

Правила payload находятся в `requests.payload`. См. [Правила Payload](#правила-payload).

## Мультимедиа

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `multimedia.disable-image-generation` | boolean \| `"chat"` \| `"passthrough"` | `false` | `true` отключает генерацию изображений и возвращает 404 для `/v1/images/*`. `"chat"` отключает внедрение только вне image endpoints. `"passthrough"` не меняет клиентский payload вне image endpoints и ведет себя как `"chat"` на image endpoints. |
| `multimedia.gpt-image-2-base-model` | string | `"gpt-5.4-mini"` | Базовая модель устаревшего hosted image-generation пути. Должна начинаться с `gpt-`. Недопустимое значение заменяется значением по умолчанию. |
| `multimedia.video-result-auth-cache-ttl` | string | `"3h"` | Как долго ID видео из `/openai/v1/videos` и создания видео xAI остаются привязаны к создавшей их учетной записи. |

## Наблюдаемость

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `observability.logs.debug` | boolean | `false` | Включить отладочное логирование. |
| `observability.logs.request-log` | boolean | `false` | Записывать запросы и ответы прокси. Запросы управления исключаются. |
| `observability.logs.logging-to-file` | boolean | `false` | Записывать ротируемые логи приложения вместо stdout. |
| `observability.logs.logs-max-total-size-mb` | integer | `0` | Ограничение общего размера каталога логов в MB. `0` отключает ограничение. |
| `observability.logs.error-logs-max-files` | integer | `10` | Число файлов логов ошибок при отключенном логировании запросов. `0` отключает очистку. |
| `observability.usage.usage-statistics-enabled` | boolean | `false` | Включить агрегацию статистики использования в памяти. |
| `observability.usage.redis-usage-queue-retention-seconds` | integer | `60` | Сколько секунд хранить в памяти элементы очереди использования для Management API. Максимум `3600`. Локальный вывод использования Redis RESP отключен. |
| `observability.pprof.enable` | boolean | `false` | Включить HTTP-сервер отладки pprof. |
| `observability.pprof.addr` | string | `"127.0.0.1:8316"` | Адрес привязки pprof. Оставляйте его локальным. |

## Плагины

Доверенные динамические плагины в процессе по умолчанию выключены. `plugins.configs.<plugin-id>.enabled` не меняет `plugins.enabled`. `plugins.auth-revision` — метаданные, принадлежащие Home, а не обычная настройка.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `plugins.enabled` | boolean | `false` | Включить динамические плагины. |
| `plugins.dir` | string | `"plugins"` | Каталог обнаружения плагинов. |
| `plugins.store-sources` | string[] | `[]` | Дополнительные URL реестров plugin store. Официальный реестр включен всегда. |
| `plugins.store-auth[].match` | string | `""` | URL-префикс одного правила аутентификации. Для HTTP требуется `allow-insecure: true`. |
| `plugins.store-auth[].apply-to` | string[] | `[]` | Виды запросов: `registry`, `metadata` и/или `artifact`. |
| `plugins.store-auth[].type` | string | `""` | `none`, `bearer`, `basic`, `header` или `github-token`. |
| `plugins.store-auth[].token-env` | string | `""` | Переменная окружения с bearer, GitHub или другим токеном. |
| `plugins.store-auth[].username-env` / `password-env` | string | `""` | Переменные окружения для basic auth. |
| `plugins.store-auth[].header-name` / `header-value-env` | string | `""` | Имя заголовка и переменная окружения с его значением. |
| `plugins.store-auth[].allow-insecure` | boolean | `false` | Разрешить небезопасную конфигурацию аутентификации, если она поддерживается. |
| `plugins.configs.<plugin-id>.enabled` | boolean | `false` | Включить экземпляр плагина. |
| `plugins.configs.<plugin-id>.priority` | integer | `0` | Приоритет запуска и маршрутизации плагина. |

Остальные ключи экземпляра плагина сохраняются для этого плагина.

## OAuth и файловые учетные данные

Параметры `oauth.providers` применяются к учетным данным OAuth и файлов. Они не применяются к группам `api-keys`. Материал токенов остается в хранилище учетных данных.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `oauth.auth-dir` | string | `"~/.cli-proxy-api"` | Каталог учетных данных. Поддерживается `~`. |
| `oauth.auth-auto-refresh-workers` | integer | `16` | Число workers обновления OAuth и file auth. Значение `<= 0` сохраняет значение по умолчанию. |
| `oauth.model-alias` | object | `{}` | Псевдонимы моделей по каналу: `vertex`, `aistudio`, `antigravity`, `claude`, `codex`, `kimi`, `xai`, `meta` или ключ OAuth plugin provider. Не применяется к группам `api-keys`. |
| `oauth.model-alias.*.*.name` / `alias` | string | `""` | ID upstream-модели и видимый клиенту ID. Одно имя можно повторить с разными псевдонимами. |
| `oauth.model-alias.*.*.fork` | boolean | `false` | Сохранить upstream-модель и дополнительно показать псевдоним. |
| `oauth.model-alias.*.*.display-name` | string | `""` | Метка каталога для псевдонима. |
| `oauth.model-alias.*.*.force-mapping` | boolean | `false` | Возвращать видимый клиенту псевдоним в поле модели upstream-ответа. |
| `oauth.excluded-models` | object | `{}` | Исключаемые модели по тем же каналам. Поддерживаются wildcards. |
| `oauth.request-scoped-errors` | object | `{}` | Пользовательские правила ошибок upstream по каналу. |
| `oauth.request-scoped-errors.*.[].status` | integer | — | Сопоставляемый HTTP-статус. |
| `oauth.request-scoped-errors.*.[].match` | string[] | `[]` | Подстроки тела. Сопоставление чувствительно к регистру. |
| `oauth.request-scoped-errors.*.[].match-regexr` | string[] | `[]` | Регулярные выражения для тела. |
| `oauth.request-scoped-errors.*.[].action` | string | — | `stop`, `stop-and-cooldown`, `continue` или `continue-and-cooldown`. |

Правило request scope игнорируется, если у него нет статуса и хотя бы одного шаблона `match` или `match-regexr`.

Массив `model_aliases` в auth JSON действует только для этой учетной записи и заменяет глобальный псевдоним с тем же видимым клиенту именем. Устаревший `model-aliases` нормализуется при загрузке.

### AI Studio

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `oauth.providers.aistudio.ws-auth` | boolean | `true` | Требовать аутентификацию для `/v1/ws`. |

### Codex

Эти поля не применяются к `api-keys.codex`. Маскировка API-ключа задается через `keys[].disable-codex-cloaking`.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `oauth.providers.codex.response-steering` | boolean | `false` | Экспериментальное полнодуплексное Responses WebSocket steering. Один socket остается на одном аккаунте и модели, а принятый ввод не воспроизводится повторно. |
| `oauth.providers.codex.identity-confuse` | boolean | `false` | При `fill-first` или session affinity переназначать Codex `prompt_cache_key` и installation identity для выбранной auth. |
| `oauth.providers.codex.disable-codex-cloaking` | boolean | `false` | Не принуждать официальные заголовки Codex User-Agent и Originator в запросах HTTP, SSE или WebSocket. |
| `oauth.providers.codex.stream-bootstrap-buffering` | boolean | `false` | Удерживать handshake, heartbeat и пустые кадры `*.added` до первого сгенерированного события, чтобы отказы перегрузки или rate limit внутри потока могли выполнить failover до фиксации заголовков ответа. Предел — 48 кадров и 1 MiB, а не время. |
| `oauth.providers.codex.stream-bootstrap-timeout` | string | `"0"` | Необязательный предел времени, например `"20s"`. `0`, `0s`, `none`, `unlimited`, `disabled`, `off` и `never` означают отсутствие предела. Это не прерывает upstream-соединение. |
| `oauth.providers.codex.optimize-multi-agent-v2` | boolean | `false` | Оптимизировать запросы multi-agent v2 для Codex Desktop, `codex-tui` и `codex_cli_rs`. Не применяется к учетным данным API-ключа. |
| `oauth.providers.codex.orphan-delegation-compatibility` | boolean | `false` | Преобразовывать осиротевшие элементы `function_call_output` из `codex_app/create_thread` и `codex_app/send_message_to_thread` в сообщения пользователя, когда `X-Openai-Subagent` равен `collab_spawn`. |
| `oauth.providers.codex.model-level-cooling` | boolean | `false` | Ограничивать cooldown Codex `usage_limit_reached` запрошенной моделью. |
| `oauth.providers.codex.header-defaults.user-agent` | string | `""` | Запасной User-Agent для HTTP и WebSocket OAuth-запросов, если клиент его не прислал. |
| `oauth.providers.codex.header-defaults.beta-features` | string | `""` | Запасные beta features только для WebSocket OAuth-запросов. |
| `oauth.providers.codex.live-media-relay.enabled` | boolean | `false` | Ретранслировать аудио Codex Live WebRTC и трафик DataChannel в этом процессе. Требуется входящая доступность UDP. |
| `oauth.providers.codex.live-media-relay.max-sessions` | integer | `32` | Максимум одновременных медиасессий. `0` означает 32. |
| `oauth.providers.codex.live-media-relay.disable-private-remote-ips` | boolean | `false` | Отклонять downstream SDP candidates, указывающие на частные, loopback, link-local или неопределенные IP. |
| `oauth.providers.codex.live-media-relay.public-ip` | string | `""` | Публичный адрес, объявляемый за 1:1 NAT. |
| `oauth.providers.codex.live-media-relay.udp-port-min` / `udp-port-max` | integer | `0` | Необязательный диапазон UDP. Задайте оба значения и не меньше двух портов на сессию. |
| `oauth.providers.codex.live-media-relay.ice-servers[].urls` | string[] | `[]` | URL STUN или TURN. |
| `oauth.providers.codex.live-media-relay.ice-servers[].username` / `credential` | string | `""` | Учетные данные TURN. JSON config API их никогда не возвращает. |

При прокси `http`, `https`, `socks5` или `socks5h` медиаканал в сторону OpenAI принудительно идет через аутентифицированный ICE-TCP и не возвращается к UDP или прямому соединению. Канал в сторону Codex Desktop остается прямым. Старое имя `allow-private-remote-ips` является инверсией `disable-private-remote-ips` и переписывается только при миграции или сохранении v8.

### Claude

`disable-claude-cloak-mode` влияет только на учетные данные OAuth. API-ключи используют `api-keys.claude[].keys[].cloak`.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `oauth.providers.claude.model-level-cooling` | boolean | `false` | Ограничивать cooldown квоты запрошенной моделью, а не всей учетной записью. |
| `oauth.providers.claude.disable-claude-cloak-mode` | boolean | `false` | Передавать исходный system prompt без изменений. `cloak_mode` учетной записи может его заменить. `false` сохраняет поведение `auto` для каждого клиента. |
| `oauth.providers.claude.claude-code.disable-cloaking-model-list` | boolean | `false` | Возвращать исходные ID моделей в ответах списка моделей Anthropic вместо замаскированных ID. |
| `oauth.providers.claude.header-defaults.user-agent` | string | `""` | Измеренная базовая линия Claude Code CLI для неподтвержденного клиента или клиента вне настроенной линии major/minor. |
| `oauth.providers.claude.header-defaults.package-version` / `runtime-version` | string | `""` | Версии пакета и runtime в этой базовой линии. |
| `oauth.providers.claude.header-defaults.os` / `arch` | string | `""` | По умолчанию определяются средой выполнения, если стабилизация device profile их не фиксирует. |
| `oauth.providers.claude.header-defaults.timeout` | string | `""` | Запасной заголовок timeout. |
| `oauth.providers.claude.header-defaults.timezone` | string | `""` | Запасной часовой пояс IANA для замаскированного `currentDate`. `timezone` в JSON учетной записи имеет приоритет. |
| `oauth.providers.claude.header-defaults.stabilize-device-profile` | boolean | `false` | Зафиксировать ОС и архитектуру на этой базовой линии для каждой auth. |

### Antigravity, xAI и Devin

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `oauth.providers.antigravity.antigravity-credits` | boolean | `true` | Последний fallback Claude: после исчерпания free-tier auth (429/503) повторить запрос с auth, у которой есть Google One AI credits. |
| `oauth.providers.antigravity.signature-cache-enabled` | boolean | `true` | Предпочитать и проверять кешированные подписи thinking blocks. `false` включает bypass mode. |
| `oauth.providers.antigravity.signature-bypass-strict` | boolean | `false` | В bypass mode проверять полную protobuf-подпись Claude, а не только базовый формат. |
| `oauth.providers.antigravity.sensitive-words` | string[] | `[]` | Слова для обфускации символами нулевой ширины в system instructions. |
| `oauth.providers.antigravity.connection-pool.enabled` | boolean | `false` | Включить пул upstream HTTP-соединений. |
| `oauth.providers.antigravity.connection-pool.idle-conn-timeout` | string | `"30s"` | Тайм-аут простоя keep-alive, не более 210 секунд. |
| `oauth.providers.antigravity.connection-pool.max-idle-conns-per-host` | integer | `2` | Максимум простаивающих соединений на хост для одной учетной записи. |
| `oauth.providers.xai.inject-x-search` | boolean | `false` | Внедрять собственный инструмент `x_search`, если запрос его не объявляет, включая `tool_choice.allowed_tools`, когда это применимо. |
| `oauth.providers.devin.sensitive-words` | string[] | `[]` | Слова для обфускации символами нулевой ширины в system instructions и prompts Devin. |

## Upstream API-ключи

`api-keys.<provider>` — список групп. У каждой группы есть `name`, один `base-url`, общие параметры и список `keys`. Для другого endpoint добавьте другую группу. `base-url` принадлежит группе, а не ключу.

Общие поля группы: `priority`, `prefix`, `proxy-url`, `headers`, `models`, `excluded-models`, `disable-cooling`, `request-retry` и `request-scoped-errors`. Отсутствующее или равное `null` поле ключа наследует значение группы, а затем runtime fallback. Явные `false`, `0`, пустые строки и пустые коллекции заменяют наследование, если поле это поддерживает. Замена map или list заменяет унаследованное значение целиком. `weight` принадлежит каждому ключу. Пустой `proxy-url` ключа возвращается к `requests.proxy-url`.

`priority` по умолчанию равен `0`; большее значение предпочтительнее. Пропущенный `weight` равен `1`.

### Общие поля

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `api-keys.<provider>[].name` | string | — | Имя группы. |
| `api-keys.<provider>[].base-url` | string | зависит от провайдера | Endpoint, общий для всех ключей группы. |
| `api-keys.<provider>[].priority` | integer | `0` | Приоритет выбора. |
| `api-keys.<provider>[].prefix` | string | `""` | Необязательный префикс модели. Клиенты вызывают `prefix/model`. |
| `api-keys.<provider>[].disable-cooling` | boolean | наследование | При наличии заменяет `routing.cooldown.disable-cooling`. |
| `api-keys.<provider>[].request-retry` | integer | наследование | Переопределение повторов для группы. См. повторы маршрутизации выше. |
| `api-keys.<provider>[].request-scoped-errors[]` | object[] | `[]` | Те же поля `status`, `match`, `match-regexr` и `action`, что у `oauth.request-scoped-errors`. Правилу нужны статус и хотя бы один шаблон. Vertex это поле не поддерживает. |
| `api-keys.<provider>[].headers` | object | `{}` | Дополнительные заголовки запросов. |
| `api-keys.<provider>[].proxy-url` | string | `""` | Переопределение прокси группы. |
| `api-keys.<provider>[].excluded-models` | string[] | `[]` | Исключаемые модели. Поддерживаются `*`, префикс, суффикс и подстрока. |
| `api-keys.<provider>[].keys[].api-key` | string | `""` | API-ключ upstream. |
| `api-keys.<provider>[].keys[].weight` | integer | `1` | Доля weighted round-robin. Максимум `1,000,000`. Неположительное значение исключает ключ, пока действует эта стратегия. |
| `api-keys.<provider>[].models[].name` / `alias` | string | `""` | Имя upstream-модели и псевдоним клиента. |
| `api-keys.<provider>[].models[].display-name` | string | `""` | Метка каталога. |
| `api-keys.<provider>[].models[].max-context-length` | integer | `0` | Заменить окно контекста, объявляемое клиентам Codex. Vertex не использует. |
| `api-keys.<provider>[].models[].force-mapping` | boolean | `false` | Переписывать поле модели upstream-ответа на псевдоним. |
| `api-keys.<provider>[].models[].is-compat` | boolean | `false` | Сохранять thinking blocks с пустыми подписями для совместимых upstream. Codex использует это для переносимого преобразования multi-agent `agent_message`, когда также включен `optimize-multi-agent-v2`. Vertex не использует. |
| `api-keys.<provider>[].models[].thinking.levels` | string[] | зависит от провайдера | Дискретные уровни reasoning. |
| `api-keys.<provider>[].models[].thinking.min` / `max` | integer | — | Диапазон бюджета, если модель использует бюджет, а не уровни. |
| `api-keys.<provider>[].models[].thinking.zero-allowed` / `dynamic-allowed` | boolean | `false` | Разрешить бюджет `0` или динамический бюджет `-1`. |

Те же поля ключа могут заменять общие поля группы. Ключ не должен повторять `base-url`.

### Gemini и Interactions

`api-keys.gemini` и `api-keys.interactions` используют общие поля. Ключи Interactions используются только для прямого выполнения `/v1beta/interactions`. Ключи Gemini по-прежнему обслуживают `generateContent`, когда клиент входит через interactions API.

Базовый URL по умолчанию — `https://generativelanguage.googleapis.com`. Запись с пустыми API-ключом и базовым URL удаляется, повторяющиеся записи Gemini также удаляются.

### Vertex

`api-keys.vertex` использует общие поля, кроме `request-scoped-errors`, `max-context-length` и `is-compat`. `base-url` необязателен и при пропуске возвращается к Google Vertex. API-ключ отправляется как `x-goog-api-key`. Записи без API-ключа удаляются. Сопоставлению модели нужны и `name`, и `alias`.

### Codex

`api-keys.codex` использует общие поля. Группа без `base-url` отбрасывается. Параметры OAuth-провайдера Codex здесь не применяются.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `api-keys.codex[].keys[].websockets` | boolean | `false` | Использовать upstream WebSocket transport Responses API. |
| `api-keys.codex[].keys[].alpha-search` | boolean | `false` | Разрешить этому ключу обслуживать `/v1/alpha/search` по адресу `base-url` + `/alpha/search`. |
| `api-keys.codex[].keys[].disable-codex-cloaking` | boolean | `false` | `true` отключает маскировку этого ключа. Пропуск не наследует `oauth.providers.codex.disable-codex-cloaking`. |
| `api-keys.codex[].models[].support-configuration-update` | boolean | `false` | Включить `configuration_update` для этой модели API-ключа. |

### Claude

`api-keys.claude` использует общие поля. `base-url` может быть пустым для официального Claude API. Маскировка OAuth и заголовки по умолчанию к этим ключам не применяются.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `api-keys.claude[].keys[].rebuild-mid-system-message` | boolean | `false` | Перемещать сообщения с ролью `system` в top-level поле Claude system. |
| `api-keys.claude[].keys[].cloak.mode` | string | `"auto"` | `auto` маскирует неподтвержденных клиентов, `always` маскирует каждого неподтвержденного клиента, `never` отключает маскировку. Подтвержденный native Claude Code остается passthrough. |
| `api-keys.claude[].keys[].cloak.strict-mode` | boolean | `false` | `true` удаляет prompts вызывающей стороны и оставляет только блоки биллинга и идентичности Claude Code. |
| `api-keys.claude[].keys[].cloak.sensitive-words` | string[] | `[]` | Слова для обфускации символами нулевой ширины. |
| `api-keys.claude[].keys[].cloak.cache-user-id` | boolean | `false` | Повторно использовать кешированный `user_id` для этого API-ключа. |
| `api-keys.claude[].keys[].fingerprint-profile` | string | `""` | Пустое значение сохраняет отпечаток вызывающей стороны. `claude-code-cli` выбирает форму Messages Claude Code CLI. `oauth-cli` — устаревший псевдоним. |
| `api-keys.claude[].keys[].experimental-cch-signing` | boolean | `false` | Устаревшее поле совместимости. CCH создается автоматически для настоящего Claude OAuth, а для профилей `claude-code-cli` только на `api.anthropic.com`. |

Делегированные файлы OAuth используют `fingerprint_profile` в auth JSON. Устаревший `fingerprint-profile` нормализуется при загрузке. `count_tokens` сохраняет собственную форму model, messages и tools. Подпись CCH следует собственному ограничению: только `api.anthropic.com` и Vertex.

### xAI

`api-keys.xai` использует собственный executor xAI и общие поля. Группа без `base-url` отбрасывается. Обычный endpoint — `https://api.x.ai/v1`.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `api-keys.xai[].keys[].websockets` | boolean | `false` | Использовать upstream WebSocket transport xAI для downstream WebSocket-запросов. |

`alpha-search` для ключей xAI принудительно выключен.

### Meta

`api-keys.meta` использует собственный executor Meta. Пустой `base-url` становится `https://api.meta.ai/v1`. Записи с пустым API-ключом или ключом, начинающимся с `dca:`, удаляются; токены DCA принадлежат хранилищу OAuth.

### Совместимость с OpenAI

`api-keys.openai-compatibility` оставляет параметры провайдера в группе. Его записи `keys` являются только записями API-ключей и заменяют устаревшее поле `api-key-entries`. Группа без `base-url` отбрасывается.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `api-keys.openai-compatibility[].name` | string | `""` | Идентификатор провайдера, в том числе для user agent. |
| `api-keys.openai-compatibility[].disabled` | boolean | `false` | Отключить провайдера, не удаляя его. |
| `api-keys.openai-compatibility[].support-prompt-cache-key` | boolean | `false` | Выводить `prompt_cache_key` для запросов из всех входных протоколов. |
| `api-keys.openai-compatibility[].keys[].api-key` / `proxy-url` / `weight` | mixed | — | Ключ, необязательный прокси и вес weighted round-robin. |
| `api-keys.openai-compatibility[].models[].image` | boolean | `false` | Разрешить модель для `/v1/images/generations` и `/v1/images/edits`. Это не объявляет вход изображений chat или responses. |
| `api-keys.openai-compatibility[].models[].input-modalities` / `output-modalities` | string[] | `[]` | Заявленные возможности ввода или вывода, например `text` и `image`. |
| `api-keys.openai-compatibility[].models[].use-max-completion-tokens` | boolean | `false` | Отправлять `max_completion_tokens` вместо `max_tokens`. |
| `api-keys.openai-compatibility[].models[].thinking.levels` | string[] | `["low", "medium", "high"]` | Используется, когда `thinking` пропущен. Необъявленные более высокие уровни, такие как `max` или `xhigh`, ограничиваются до `high`. |

Повтор одного псевдонима создает внутренний пул upstream. Клиент видит один псевдоним. Запросы распределяются round-robin по этим именам upstream и продолжаются со следующим именем, если выбранный upstream завершился ошибкой до создания вывода.

## Правила Payload

`requests.payload.default`, `default-raw`, `override`, `override-raw` и `filter` — массивы правил. `default*` записывает только отсутствующие значения, `override*` записывает всегда, а `filter` удаляет пути. Значения `*-raw` должны быть допустимым JSON и вставляются как raw JSON.

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `requests.payload.<rule>[].models[].name` | string | `""` | Имя модели или wildcard. |
| `requests.payload.<rule>[].models[].protocol` | string | `""` | Целевой протокол: `openai`, `gemini`, `claude`, `codex` или `antigravity`. |
| `requests.payload.<rule>[].models[].from-protocol` | string | `""` | Исходный протокол: `openai`, `responses`, `gemini` или `claude`. `openai-response`, `openai-responses` и `response` нормализуются в `responses`. |
| `requests.payload.<rule>[].models[].headers` | object | `{}` | Обязательные шаблоны заголовков запроса. Значения поддерживают `*`. |
| `requests.payload.<rule>[].models[].match` / `not-match` | object[] | `[]` | Условия JSON path, которые должны равняться или не равняться заданным значениям. |
| `requests.payload.<rule>[].models[].exist` / `not-exist` | string[] | `[]` | JSON paths, которые должны существовать и быть не null либо отсутствовать или быть null. |
| `requests.payload.default[].params` / `override[].params` | object | `{}` | JSON path к значению. |
| `requests.payload.default-raw[].params` / `override-raw[].params` | object | `{}` | JSON path к raw JSON. |
| `requests.payload.filter[].params` | string[] | `[]` | JSON paths для удаления. |

## Старый макет

Старые файлы работают до успешной записи v8. Чтобы снова использовать старое поле в смешанном файле, сначала удалите соответствующее поле v8.

| Старое поле | v8 |
| --- | --- |
| `host`, `port`, `trusted-proxies`, `tls`, `commercial-mode`, `discovery` | `server.*` |
| `remote-management` | `management` |
| список строк `api-keys` | `access.api-keys` |
| `credential-concurrency`, `credential-in-flight` | `credentials.concurrency`, `credentials.in-flight` |
| `force-model-prefix` | `routing.force-model-prefix` |
| `request-retry`, `max-retry-credentials`, `max-retry-interval` | `routing.retry.*` |
| `disable-cooling`, `save-cooldown-status`, `transient-error-cooldown-seconds` | `routing.cooldown.*` |
| `proxy-url`, `passthrough-headers`, `nonstream-keepalive-interval`, `streaming`, `payload` | `requests.*` |
| `auth-dir`, `auth-auto-refresh-workers` | `oauth.auth-dir`, `oauth.auth-auto-refresh-workers` |
| `oauth-model-alias`, `oauth-excluded-models`, `oauth-request-scoped-errors` | `oauth.model-alias`, `oauth.excluded-models`, `oauth.request-scoped-errors` |
| `ws-auth` | `oauth.providers.aistudio.ws-auth` |
| `codex`, `codex-header-defaults` | `oauth.providers.codex`, включая `header-defaults` |
| `claude`, `claude-code`, `disable-claude-cloak-mode`, `claude-header-defaults` | `oauth.providers.claude` |
| `antigravity`, `antigravity-signature-cache-enabled`, `antigravity-signature-bypass-strict` | `oauth.providers.antigravity` |
| `quota-exceeded.antigravity-credits` | `oauth.providers.antigravity.antigravity-credits` |
| `xai`, `devin` | `oauth.providers.xai`, `oauth.providers.devin` |
| `disable-image-generation`, `gpt-image-2-base-model`, `video-result-auth-cache-ttl` | `multimedia.*` |
| `debug`, `logging-to-file`, `logs-max-total-size-mb`, `error-logs-max-files`, `request-log` | `observability.logs.*` |
| `usage-statistics-enabled`, `redis-usage-queue-retention-seconds` | `observability.usage.*` |
| `pprof` | `observability.pprof` |
| `gemini-api-key`, `interactions-api-key`, `vertex-api-key`, `codex-api-key`, `claude-api-key`, `xai-api-key`, `meta-api-key` | группы `api-keys.<provider>` со списком `keys` |
| `openai-compatibility` и `api-key-entries` | `api-keys.openai-compatibility` и `keys` |

`credentials.concurrency` и `credentials.in-flight` — контракты, управляемые Home. В режиме Home побеждает синтезированная конфигурация Home, а локальные значения игнорируются.

У `quota-exceeded.switch-project` и `quota-exceeded.switch-preview-model` нет аналога v8. Они остаются доступными для чтения и изменения в старых файлах и через `/v0/management`, но исключены из шаблона v8.
