# Web UI

URL проекта:
[Cli-Proxy-API-Management-Center](https://github.com/router-for-me/Cli-Proxy-API-Management-Center)

Официальный веб-центр управления для CLIProxyAPI.

Базовый путь: `http://localhost:8317/management.html`

Установите `remote-management.disable-control-panel` в значение `true`, если вы предпочитаете размещать Web UI управления в другом месте; сервер пропустит загрузку `management.html`, и `/management.html` будет возвращать 404.

Вы можете установить переменную окружения `MANAGEMENT_STATIC_PATH`, чтобы выбрать директорию, в которой хранится `management.html`.

## Хранение подключения и ресурсы плагинов

Официальный Management Center хранит состояние подключения в браузерном `localStorage` для origin Management Center. Base URL API сохраняется для повторного подключения. Management key сохраняется только когда пользователь включает запоминание пароля или когда мигрируется старая сохранённая сессия. Значения в хранилище используют обратимую обфускацию, а не криптографическую границу безопасности.

Если Management Center и CLIProxyAPI обслуживаются с одного origin, ресурсные страницы плагинов из `/v0/resource/plugins/<pluginID>/...` выполняются в том же origin. Доверенная ресурсная страница плагина может читать тот же `localStorage` и использовать сохранённый management key для вызовов `/v0/management/...`.

Установку и включение плагина с resource pages следует считать доверием браузерному коду этого плагина для текущей management-сессии. Resource pages плагинов должны включать собственный JavaScript в комплект и не должны загружать сторонние скрипты, потому что любой скрипт в том же origin может читать тот же сохранённый management-контекст.

Если Management Center размещён на другом origin, чем CLIProxyAPI, браузерная same-origin policy не даст iframe resource page прочитать `localStorage` origin Management Center. В такой схеме страницы плагина должны обрабатывать отсутствие ключа и просить пользователя открыть same-origin management page или войти снова.

## Использование кастомного Web UI

Вы можете указать серверу на ваш собственный GitHub-репозиторий для панели управления:

```yaml
remote-management:
  panel-github-repository: "https://github.com/your-org/your-management-ui"
```

- Формат URL репозитория: `https://github.com/<org>/<repo>`; сервер автоматически преобразует его в `https://api.github.com/repos/<org>/<repo>/releases/latest`.
- Формат API URL: установите его напрямую как `https://api.github.com/repos/<org>/<repo>/releases/latest`.
- Обновлятор периодически проверяет последний релиз, ищет ассет с именем `management.html` и скачивает его в статическую директорию (по умолчанию `static/` рядом с файлом конфигурации или путь, заданный через `MANAGEMENT_STATIC_PATH`). Если ассет содержит поле `digest` (рекомендуется `sha256:<hex>`), оно будет использовано для проверки целостности.

## Как опубликовать кастомный Web UI на GitHub

1. Соберите вашу кастомную панель и создайте один файл `management.html` (по возможности объедините все ресурсы в один файл).
2. Создайте репозиторий GitHub и отправьте туда ваш код.
3. Создайте релиз (обновлятор ориентируется на `latest`) и загрузите ассеты:
   - Должен включать **`management.html`**.
   - Настоятельно рекомендуется: добавьте поле метаданных `digest` с `sha256:<file hash>` для проверки контрольной суммы.
4. Установите `remote-management.panel-github-repository` в CLIProxyAPI на URL репозитория или API URL.
5. Перезапустите или выполните hot-reload конфигурации; сервер автоматически загрузит и заменит панель управления.
