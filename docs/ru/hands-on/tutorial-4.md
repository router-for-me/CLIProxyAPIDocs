# Four: Интеграция ретрансляции (Relay Forwarding)

В предыдущих статьях мы успешно интегрировали встроенных провайдеров с помощью методов OAuth или Cookie. В этом руководстве мы сделаем следующий шаг и узнаем, как удобно интегрировать различные сервисы AI-ретрансляции в CLIProxyAPI.

Сначала давайте рассмотрим файл конфигурации, который мы использовали ранее:

```yaml
port: 8317

# Пожалуйста, укажите путь к папке в соответствии с вашей ситуацией
auth-dir: "Z:\\CLIProxyAPI\\auths"

request-retry: 3

quota-exceeded:
  switch-project: true
  switch-preview-model: true

api-keys:
  # Пожалуйста, установите Key самостоятельно, он используется для доступа клиента к прокси
  - 'ABC-123456'
```

После первоначальной настройки мы его не меняли. Теперь пришло время расширить этот файл.
Давайте сначала добавим ретрансляционный сервис Claude. Для этого нам сначала нужно получить `base-url` сервиса, который обычно можно найти в официальной документации или руководствах соответствующего поставщика услуг.

В качестве примера возьмем 88code, в его официальном руководстве можно найти следующую информацию:

![](https://img.072899.xyz/2025/09/11c41d79d62c02df1ac5d5998c75d3e5.png)

Из рисунка видно, что `base-url` ретрансляционного сервиса Claude от 88code — `https://www.88code.org/api`.

Добавим поле `claude-api-key` в файл конфигурации:

```yaml
port: 8317
auth-dir: "Z:\\CLIProxyAPI\\auths"
request-retry: 3
quota-exceeded:
  switch-project: true
  switch-preview-model: true
api-keys:
  - 'ABC-123456'

claude-api-key:
  - api-key: '88_XXXXXXXXXXXXXXXXXXXXXXXXX'
    base-url: 'https://www.88code.org/api'
```

Аналогично, 88code также предоставляет сервисы Codex. Мы используем тот же метод, чтобы найти его `base-url`:
![](https://img.072899.xyz/2025/09/28e5ce297bca540e052863860dd9eb2c.png)

Затем добавьте поле `codex-api-key` в файл конфигурации:

```yaml
port: 8317
auth-dir: "Z:\\CLIProxyAPI\\auths"
request-retry: 3
quota-exceeded:
  switch-project: true
  switch-preview-model: true
api-keys:
  - 'ABC-123456'

claude-api-key:
  - api-key: '88_XXXXXXXXXXXXXXXXXXXXXXXXX'
    base-url: 'https://www.88code.org/api'

codex-api-key:
  - api-key: '88_XXXXXXXXXXXXXXXXXXXXXXXXX'
    base-url: 'https://www.88code.org/openai/v1'
```

Для других провайдеров услуг вы также можете добавить их аналогичным образом. Например, у меня есть несколько Codex API Keys от PackyCode, и я добавлю их в конфигурацию вместе:

```yaml
port: 8317
auth-dir: "Z:\\CLIProxyAPI\\auths"
request-retry: 3
quota-exceeded:
  switch-project: true
  switch-preview-model: true
api-keys:
  - 'ABC-123456'

claude-api-key:
  - api-key: '88_XXXXXXXXXXXXXXXXXXXXXXXXX'
    base-url: 'https://www.88code.org/api'
  - api-key: 'sk-4cXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    base-url: 'https://api.packycode.com'
  - api-key: 'sk-HpYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY'
    base-url: 'https://api.packycode.com'

codex-api-key:
  - api-key: '88_XXXXXXXXXXXXXXXXXXXXXXXXX'
    base-url: 'https://www.88code.org/openai/v1'
  - api-key: 'fk-4cXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    base-url: 'https://oai-api.fkclaude.com/v1'
  - api-key: 'sk-amXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    base-url: 'https://codex-api.packycode.com/v1'
  - api-key: 'sk-sTXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    base-url: 'https://codex-api.packycode.com/v1'
```

Обратите внимание, что даже для нескольких `api-key` от одного и того же провайдера услуг и при использовании одного и того же `base-url`, вам необходимо указывать `base-url` отдельно для каждого `api-key`, и его нельзя пропускать.

Кроме того, CLIProxyAPI также поддерживает доступ к любому провайдеру, совместимому с интерфейсом OpenAI, что настраивается через поле `openai-compatibility`. Конкретные шаги здесь повторяться не будут. Вы можете напрямую обратиться к примеру файла конфигурации ниже для настройки:

```yaml
port: 8317
auth-dir: "Z:\\CLIProxyAPI\\auths"
request-retry: 3
quota-exceeded:
  switch-project: true
  switch-preview-model: true
api-keys:
  - 'ABC-123456'

claude-api-key:
  - api-key: '88_XXXXXXXXXXXXXXXXXXXXXXXXX'
    base-url: 'https://www.88code.org/api'

codex-api-key:
  - api-key: '88_XXXXXXXXXXXXXXXXXXXXXXXXX'
    base-url: 'https://www.88code.org/openai/v1'
  - api-key: 'fk-4cXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    base-url: 'https://oai-api.fkclaude.com/v1'
  - api-key: 'sk-amXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    base-url: 'https://codex-api.packycode.com/v1'
  - api-key: 'sk-sTXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    base-url: 'https://codex-api.packycode.com/v1'

openai-compatibility:
  - name: 'openrouter'
    base-url: 'https://openrouter.ai/api/v1'
    api-keys:
      - 'sk-or-v1-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      - 'sk-or-v1-bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
    models:
      - name: 'deepseek/deepseek-chat-v3.1:free'
        alias: 'deepseek-v3.1'
      - name: 'deepseek/deepseek-r1-0528:free'
        alias: 'deepseek-r1-0528'
      - name: 'x-ai/grok-4-fast:free'
        alias: 'grok-4-fast'
  - name: 'groq'
    base-url: 'https://api.groq.com/openai/v1'
    api-keys:
      - 'gsk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    models:
      - name: 'deepseek-r1-distill-llama-70b'
        alias: 'deepseek-r1-70b'
```

Как вы можете видеть, логика конфигурации `openai-compatibility` немного отличается от предыдущей: все `api-key` в рамках одного провайдера используют один и тот же `base-url`.

На данный момент конфигурация завершена. Оставшаяся проверка подключения моделей предоставляется читателям для самостоятельного тестирования.
