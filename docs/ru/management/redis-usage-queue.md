---
outline: 'deep'
---

# Redis очередь usage (RESP)

CLIProxyAPI предоставляет минимальный Redis RESP интерфейс на том же TCP-порту, что и HTTP API (по умолчанию `8317`). Он предназначен для получения **последних usage-записей по запросам** в формате JSON, чтобы внешние сборщики могли забирать статистику без парсинга логов.

## Доступность

- RESP интерфейс доступен только когда **включён Management** (то же условие, что и для `/v0/management`). Если Management выключен, RESP соединения закрываются сразу.
- Используется тот же listener, что и для HTTP/HTTPS. Если включён TLS для API сервера, RESP работает через тот же TLS listener.

## Аутентификация

- Используйте **Management key** (тот же секрет, что и для `/v0/management`).
- Поддерживаемые формы:
  - `AUTH <password>`
  - `AUTH <username> <password>` (username игнорируется; только для совместимости)
- Политика IP-ban общая с Management API: **5 подряд неудач** приводят к временному бану.

## Включение публикации usage

Очередь получает записи только если включена публикация usage:

- В конфиге: установите `usage-statistics-enabled: true` и перезапустите/выполните hot-reload
- Или через Management API: `PUT /usage-statistics-enabled` с `{ "value": true }`

## Команды

Это **не** полноценный Redis. Реализованы только:

- `AUTH`
- `LPOP <key> [count]`
- `RPOP <key> [count]`
- `SUBSCRIBE usage`

Примечания:

- Аргумент `<key>` сейчас игнорируется. Используйте `queue` для читаемости.
- Без `count` `LPOP`/`RPOP` возвращают один Bulk String (JSON) или `nil`, если очередь пуста.
- С `count` возвращается массив Bulk String; пустой массив при пустой очереди.
- Записи хранятся в памяти в течение `redis-usage-queue-retention-seconds` (в секундах, по умолчанию `60`, максимум `3600`). Опрашивайте часто, если важна минимизация потерь.
- `SUBSCRIBE usage` использует Redis pub/sub framing. Пока есть хотя бы один подписанный клиент, новые usage-записи рассылаются всем подписанным клиентам и не сохраняются в FIFO-очереди. Такие записи нельзя позже получить через `LPOP`/`RPOP` или endpoint Management usage queue.
- Если подписанных клиентов нет, новые usage-записи продолжают попадать в FIFO-очередь как раньше.
- В режиме подписки поддерживаются `PING`, `UNSUBSCRIBE` и `QUIT` для базового управления соединением.

## Примеры

С `redis-cli`:

```bash
# получить 1 элемент (печатает JSON)
redis-cli -h 127.0.0.1 -p 8317 -a "<MANAGEMENT_KEY>" --no-auth-warning --raw LPOP queue

# получить до 50 элементов
redis-cli -h 127.0.0.1 -p 8317 -a "<MANAGEMENT_KEY>" --no-auth-warning --raw RPOP queue 50

# подписаться на live usage-записи
redis-cli -h 127.0.0.1 -p 8317 -a "<MANAGEMENT_KEY>" --no-auth-warning --raw SUBSCRIBE usage
```

## Схема payload

Каждый элемент очереди — JSON объект со следующими полями:

- `timestamp` (строка времени RFC 3339)
- `latency_ms` (целое число)
- `source` (строка)
- `auth_index` (строка)
- `tokens`:
  - `input_tokens` (целое число)
  - `output_tokens` (целое число)
  - `reasoning_tokens` (целое число)
  - `cached_tokens` (целое число)
  - `total_tokens` (целое число)
- `failed` (boolean)
- `provider` (строка)
- `model` (строка, фактическое имя модели для выполнения)
- `alias` (строка, имя модели, запрошенное клиентом)
- `endpoint` (строка, например `POST /v1/chat/completions`)
- `auth_type` (строка)
- `api_key` (строка)
- `request_id` (строка)

Пример:

```json
{
  "timestamp": "2026-04-25T00:00:00Z",
  "latency_ms": 1500,
  "source": "user@example.com",
  "auth_index": "0",
  "tokens": {
    "input_tokens": 10,
    "output_tokens": 20,
    "reasoning_tokens": 0,
    "cached_tokens": 0,
    "total_tokens": 30
  },
  "failed": false,
  "provider": "openai",
  "model": "gpt-5.4",
  "alias": "client-gpt",
  "endpoint": "POST /v1/chat/completions",
  "auth_type": "apikey",
  "api_key": "test-key",
  "request_id": "ctx-request-id"
}
```
