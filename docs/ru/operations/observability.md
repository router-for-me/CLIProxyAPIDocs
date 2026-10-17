---
title: Журналы и использование
feature_ids:
  - observability.logs.debug
  - observability.logs.error-logs-max-files
  - observability.logs.logging-to-file
  - observability.logs.logs-max-total-size-mb
  - observability.logs.request-log
  - observability.pprof.addr
  - observability.pprof.enable
  - observability.usage.redis-usage-queue-retention-seconds
  - observability.usage.usage-statistics-enabled
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Журналы и использование

## 1. Какую задачу решает этот раздел

Решает, идут ли журналы приложения в стандартный вывод или в прокручиваемые файлы, записываются ли запросы прокси, как очищаются журналы ошибок и каталог журналов, сводится ли использование в памяти и открывается ли отдельный отладочный порт pprof.

## 2. Когда применимо и чего здесь нет

Эти ключи принадлежат `observability`. Маршруты API управления, которые читают журналы и очередь использования, описаны в разделе [Наблюдаемость](/ru/management/v8-observability). `commercial-mode` выключает дорогие журналы запросов. См. [Прослушивание и процесс](/ru/operations/server). Ключ доступа здесь не настраивается.

## 3. Как настроить или вызвать

```yaml
observability:
  logs:
    debug: false
    logging-to-file: false
    logs-max-total-size-mb: 0
    error-logs-max-files: 10
    request-log: false
  usage:
    usage-statistics-enabled: false
    redis-usage-queue-retention-seconds: 60
  pprof:
    enable: false
    addr: "127.0.0.1:8316"
```

В примере pprof находится на локальном `127.0.0.1:8316`. Не открывайте его на публичном адресе.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| observability.logs.debug | Включает или выключает журналы уровня отладки и другие отладочные возможности. | false | После загрузки уровень журнала задаётся этим значением. |
| observability.logs.error-logs-max-files | Сколько файлов журнала ошибок хранить, когда журнал запросов выключен. | Default is 10. | Сверх этого самые старые журналы ошибок удаляются. 0 выключает очистку. Отрицательное значение при загрузке возвращается к 10. |
| observability.logs.logging-to-file | Писать журналы приложения в прокручиваемые файлы или в стандартный вывод. | false | true пишет прокручиваемые файлы. API управления требует true, прежде чем читать журналы приложения. |
| observability.logs.logs-max-total-size-mb | Предел суммарного размера файлов журнала в каталоге журналов, в МБ. | 0 | Сверх предела самые старые журналы удаляются, пока сумма не вернётся под предел. 0 выключает эту очистку. Отрицательное значение при загрузке становится 0. |
| observability.logs.request-log | Записывать ли подробные журналы запросов прокси. | false | Запросы управления в этот журнал не пишутся. Когда `commercial-mode` равен true, промежуточный слой журнала запросов не вешается. |
| observability.pprof.addr | host:port HTTP-сервера pprof. | empty string | Пустое значение при загрузке и во время работы использует `127.0.0.1:8316`. |
| observability.pprof.enable | Запускать ли отладочный HTTP-сервер pprof. | false | При false он не слушает. Смена на true или смена адреса перезапускает этот отладочный сервер. |
| observability.usage.redis-usage-queue-retention-seconds | Сколько секунд запись очереди использования хранится в памяти для API управления. | Default: 60. | Максимум 3600. Меньше или равно 0 загружается как 60. Больше 3600 зажимается до 3600 и пишется предупреждение. Вывод использования Redis RESP отключается только в режиме Home. |
| observability.usage.usage-statistics-enabled | Сводить ли использование в памяти. | false | При false данные использования отбрасываются. Режим Home принудительно ставит true. |

## 5. Типичные ошибки и границы

Когда `logging-to-file` равен false, управленческий `GET /v8/management/observability/logs` возвращает 400 с ошибкой `logging to file disabled`. Когда `request-log` равен true, интерфейс списка журналов ошибок возвращает пустой `files`. Пустой адрес pprof не остаётся пустой строкой. Процесс слушает `127.0.0.1:8316`. Срок хранения больше 3600 секунд не отклоняет запуск. Значение только зажимается.

## 6. Связанные возможности

Чтение очереди и файлов журнала описано в разделе [Наблюдаемость](/ru/management/v8-observability). Коммерческий режим — в разделе [Прослушивание и процесс](/ru/operations/server).

## 7. Практический опыт

- [Upstream не Claude сообщает использование только в конце сообщения](/ru/experience/api#exp-api-messages-usage-at-end)
- [Передавайте клиентский ключ при вызове публичного маршрута](/ru/experience/api#exp-api-require-client-key)
- [auth_unavailable означает, что нет пригодной учётной записи](/ru/experience/operations#exp-operations-auth-unavailable-means-no-credential)
- [Ограничьте общий размер журналов запросов](/ru/experience/operations#exp-operations-cap-request-logs)
- [Выключите журнал запросов, чтобы остановить поток](/ru/experience/operations#exp-operations-disable-request-log)
- [После отключения клиента итогового использования нет](/ru/experience/operations#exp-operations-disconnect-drops-usage)
- [Журналы пишутся в доступный для записи каталог logs](/ru/experience/operations#exp-operations-log-directory)
- [Выключите дорогие журналы, чтобы снизить память](/ru/experience/operations#exp-operations-reduce-memory)
- [Смотрите исходный текст в журнале запросов](/ru/experience/operations#exp-operations-request-log-text)
- [Использование остаётся только в памяти](/ru/experience/operations#exp-operations-usage-stays-in-memory)
