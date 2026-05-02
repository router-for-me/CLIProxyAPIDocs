# Базовая конфигурация

## Файл конфигурации

По умолчанию сервер считывает YAML-файл конфигурации (`config.yaml`) из корня проекта. Используйте `--config`, чтобы указать другой файл:

```bash
./cli-proxy-api --config /path/to/your/config.yaml
```

### Пример конфигурации

```yaml
# Хост/интерфейс сервера для привязки. По умолчанию пусто ("") для привязки ко всем интерфейсам (IPv4 + IPv6).
# Используйте "127.0.0.1" или "localhost", чтобы ограничить доступ только локальной машиной.
host: ''

# Порт сервера
port: 8317

# Настройки TLS для HTTPS. Если включено, сервер ожидает соединений с использованием предоставленного сертификата и ключа.
tls:
  enable: false
  cert: ''
  key: ''

# Настройки Management API
remote-management:
  # Разрешить ли удаленный (не через localhost) доступ к управлению.
  # Если false, только localhost может получить доступ к эндпоинтам управления (ключ по-прежнему требуется).
  allow-remote: false

  # Ключ управления. Если здесь указано текстовое значение, оно будет хешировано при запуске.
  # Все запросы управления (даже с localhost) требуют этот ключ.
  # Оставьте пустым, чтобы полностью отключить Management API (404 для всех маршрутов /v0/management).
  secret-key: ''

  # Если true, отключает загрузку ресурсов встроенной панели управления и соответствующий HTTP-маршрут.
  disable-control-panel: false

  # Репозиторий GitHub для панели управления. Принимает URL репозитория или URL API релизов.
  panel-github-repository: 'https://github.com/router-for-me/Cli-Proxy-API-Management-Center'

# Директория аутентификации (поддерживает ~ для домашней директории)
auth-dir: '~/.cli-proxy-api'

# API-ключи для аутентификации
api-keys:
  - 'your-api-key-1'
  - 'your-api-key-2'
  - 'your-api-key-3'

# Включить логирование отладки
debug: false

# Если true, отключает ресурсоемкие функции HTTP middleware для снижения потребления памяти на запрос при высокой нагрузке.
commercial-mode: false

# Если true, записывает логи приложения в ротируемые файлы вместо stdout
logging-to-file: false

# Максимальный общий размер (МБ) лог-файлов в директории логов. При превышении самые старые файлы
# удаляются до достижения лимита. Установите 0, чтобы отключить.
logs-max-total-size-mb: 0

# Если false, отключает агрегацию статистики использования в памяти
usage-statistics-enabled: false

# URL прокси. Поддерживает протоколы socks5/http/https. Пример: socks5://user:pass@192.168.1.1:1080/
proxy-url: ''

# Если true, запросы к моделям без префикса используют только учетные данные без префикса (за исключением случаев, когда префикс совпадает с именем модели).
force-model-prefix: false

# Количество повторных попыток запроса. Повторы будут происходить, если HTTP-код ответа: 403, 408, 500, 502, 503 или 504.
request-retry: 3

# Максимальное время ожидания в секундах для «остывших» учетных данных перед повторной попыткой.
max-retry-interval: 30

# disable-image-generation поддерживает: false (по умолчанию), true или "chat".
# - true: отключает image_generation везде (и возвращает 404 для /v1/images/generations и /v1/images/edits).
# - "chat": отключает внедрение image_generation на endpoints не для изображений, но оставляет /v1/images/generations и /v1/images/edits включенными.
disable-image-generation: false

# Поведение при превышении квоты
quota-exceeded:
  switch-project: true # Автоматически переключаться на другой проект при превышении квоты
  switch-preview-model: true # Автоматически переключаться на preview-модель при превышении квоты
  antigravity-credits: true # Credits-fallback для Claude: когда все free-tier учетные данные исчерпаны (429/503), выполнить последнюю попытку через auth с Google One AI credits

# Стратегия маршрутизации для выбора учетных данных при наличии нескольких совпадений.
routing:
  strategy: 'round-robin' # round-robin (по умолчанию), fill-first
  # Включить универсальную session-sticky маршрутизацию для всех клиентов.
  # Session ID извлекается из: metadata.user_id (формат сессии Claude Code),
  # X-Session-ID, Session_id (Codex), X-Amp-Thread-Id (Amp CLI),
  # X-Client-Request-Id (PI), conversation_id или хэша первых сообщений.
  # Автоматический failover всегда включен, когда привязанный auth становится недоступен.
  session-affinity: false # по умолчанию: false
  # Как долго хранятся привязки session→auth. По умолчанию: 1h
  session-affinity-ttl: '1h'

# Если true, включает аутентификацию для WebSocket API (/v1/ws).
ws-auth: false

# Если > 0, отправляет пустые строки каждые N секунд для не-потоковых ответов для предотвращения таймаутов простоя.
nonstream-keepalive-interval: 0

# Если true, включает вставку официальных инструкций Codex для запросов к Codex API.
# Если false (по умолчанию), CodexInstructionsForModel возвращается немедленно без изменений.
codex-instructions-enabled: false

# Поведение потоковой передачи (SSE keep-alive + безопасные повторы при запуске).
streaming:
  keepalive-seconds: 15 # По умолчанию: 0 (отключено). <= 0 отключает keep-alive.
  bootstrap-retries: 1 # По умолчанию: 0 (отключено). Повторы до отправки первого байта.

# API-ключи Gemini
gemini-api-key:
  - api-key: 'AIzaSy...01'
    prefix: 'test' # опционально: требует вызовов вида "test/gemini-3-pro-preview" для использования этих учетных данных
    base-url: 'https://generativelanguage.googleapis.com'
    headers:
      X-Custom-Header: 'custom-value'
    proxy-url: 'socks5://proxy.example.com:1080'
    models:
      - name: 'gemini-2.5-flash' # имя модели в upstream
        alias: 'gemini-flash' # клиентский алиас, сопоставленный с upstream-моделью
    excluded-models:
      - 'gemini-2.5-pro' # исключить конкретные модели этого провайдера (точное совпадение)
      - 'gemini-2.5-*' # сопоставление по префиксу с подстановочным знаком (например, gemini-2.5-flash, gemini-2.5-pro)
      - '*-preview' # сопоставление по суффиксу с подстановочным знаком (например, gemini-3-pro-preview)
      - '*flash*' # сопоставление по подстроке с подстановочным знаком (например, gemini-2.5-flash-lite)
  - api-key: 'AIzaSy...02'

# API-ключи Codex
codex-api-key:
  - api-key: 'sk-atSM...'
    prefix: 'test' # опционально: требует вызовов вида "test/gpt-5-codex" для использования этих учетных данных
    base-url: 'https://www.example.com' # использовать кастомный эндпоинт Codex API
    headers:
      X-Custom-Header: 'custom-value'
    proxy-url: 'socks5://proxy.example.com:1080' # опционально: переопределение прокси для конкретного ключа
    models:
      - name: 'gpt-5-codex' # имя модели в upstream
        alias: 'codex-latest' # клиентский алиас, сопоставленный с upstream-моделью
    excluded-models:
      - 'gpt-5.1' # исключить конкретные модели (точное совпадение)
      - 'gpt-5-*' # сопоставление по префиксу с подстановочным знаком (например, gpt-5-medium, gpt-5-codex)
      - '*-mini' # сопоставление по суффиксу с подстановочным знаком (например, gpt-5-codex-mini)
      - '*codex*' # сопоставление по подстроке с подстановочным знаком (например, gpt-5-codex-low)

# API-ключи Claude
claude-api-key:
  - api-key: 'sk-atSM...' # используйте официальный API-ключ Claude, указывать base-url не нужно
  - api-key: 'sk-atSM...'
    prefix: 'test' # опционально: требует вызовов вида "test/claude-sonnet-latest" для использования этих учетных данных
    base-url: 'https://www.example.com' # использовать кастомный эндпоинт Claude API
    headers:
      X-Custom-Header: 'custom-value'
    proxy-url: 'socks5://proxy.example.com:1080' # опционально: переопределение прокси для конкретного ключа
    models:
      - name: 'claude-3-5-sonnet-20241022' # имя модели в upstream
        alias: 'claude-sonnet-latest' # клиентский алиас, сопоставленный с upstream-моделью
    excluded-models:
      - 'claude-opus-4-5-20251101' # исключить конкретные модели (точное совпадение)
      - 'claude-3-*' # сопоставление по префиксу с подстановочным знаком (например, claude-3-7-sonnet-20250219)
      - '*-thinking' # сопоставление по суффиксу с подстановочным знаком (например, claude-opus-4-5-thinking)
      - '*haiku*' # сопоставление по подстроке с подстановочным знаком (например, claude-3-5-haiku-20241022)
    cloak: # опционально: маскировка запросов для клиентов, отличных от Claude Code
      mode:
        'auto' # "auto" (по умолчанию): маскировка только когда клиент не Claude Code
        # "always": всегда применять маскировку
        # "never": никогда не применять маскировку
      strict-mode:
        false # false (по умолчанию): добавлять промпт Claude Code в начало системных сообщений пользователя
        # true: удалять все системные сообщения пользователя, оставлять только промпт Claude Code
      sensitive-words: # опционально: слова для обфускации символами нулевой ширины
        - 'API'
        - 'proxy'

# Провайдеры, совместимые с OpenAI
openai-compatibility:
  - name: 'openrouter' # Имя провайдера; будет использоваться в user agent и других местах.
    disabled: false # опционально: установите true, чтобы отключить провайдера без удаления
    prefix: 'test' # опционально: требует вызовов вида "test/kimi-k2" для использования учетных данных этого провайдера
    base-url: 'https://openrouter.ai/api/v1' # Базовый URL провайдера.
    headers:
      X-Custom-Header: 'custom-value'
    api-key-entries:
      - api-key: 'sk-or-v1-...b780'
        proxy-url: 'socks5://proxy.example.com:1080' # опционально: переопределение прокси для
```
