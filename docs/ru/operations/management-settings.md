---
title: Параметры управления
feature_ids:
  - management.allow-remote.value
  - management.base-url.value
  - management.disable-auto-update-panel.value
  - management.disable-control-panel.value
  - management.panel-github-repository.value
  - management.secret-key.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Параметры управления

## 1. Какую задачу решает этот раздел

Решает, открыт ли API управления нелокальным вызывающим, каким ключом он аутентифицируется, откуда скачивается панель управления и к какому адресу управления подключается терминальный интерфейс, когда он работает как клиент.

## 2. Когда применимо и чего здесь нет

Эти ключи принадлежат `management`. Они не описывают каждый маршрут `/v8/management`. Маршруты — в разделе [Management API v8](/ru/management/apiv8). `/v0/management` больше не сопровождается. См. [Management API](/ru/management/api). Режим Home не открывает API управления.

## 3. Как настроить или вызвать

```yaml
management:
  allow-remote: false
  secret-key: ""
  disable-control-panel: false
  panel-github-repository: "https://github.com/router-for-me/Cli-Proxy-API-Management-Center"
```

В примере эти два пункта тоже закомментированы. Если их не записать, действуют defaults из раздела 4:

```yaml
management:
  # disable-auto-update-panel: false
  # base-url: "https://example.invalid"
```

Для ключа используйте заполнитель `YOUR_API_KEY`. Открытый текст при загрузке хешируется bcrypt и записывается обратно в конфигурацию. Запросы по-прежнему отправляют открытый текст.

При вызове интерфейса управления, включая запрос с localhost, отправьте ключ одним из способов:

- `Authorization: Bearer YOUR_API_KEY`
- `X-Management-Key: YOUR_API_KEY`

Если `Authorization` — это не `Bearer` плюс ключ, значение всего заголовка считается ключом.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| management.allow-remote | Разрешён ли доступ к API управления не с localhost. | false | При false нелокальный вызывающий получает 403 с ошибкой `remote management disabled`. Локальному вызывающему ключ всё равно нужен. Непустая переменная окружения `MANAGEMENT_PASSWORD` принудительно разрешает удалённый доступ, и это значение существует только в памяти. |
| management.base-url | Базовый адрес удалённого API управления для клиентского режима TUI. | empty string | Командная строка `--management-base-url` важнее. Если оба пусты, используется `http://127.0.0.1:` плюс порт. Порт — положительный `server.port`, иначе 8317. |
| management.disable-auto-update-panel | Выключать ли периодическое фоновое обновление ресурсов панели управления. | When false (the default), the background updater remains enabled; when true, the panel is only downloaded on first access if missing. | При true скачивание происходит только при первом обращении, если локально файла нет, и дальше автоматического обновления нет. |
| management.disable-control-panel | При true встроенный интерфейс управления не отдаётся и не синхронизируется. | false | Не меняет регистрацию самих маршрутов API управления. |
| management.panel-github-repository | Репозиторий GitHub, из которого берутся ресурсы панели управления. | empty string | Принимается URL репозитория или адрес releases API. Если при загрузке он пуст, подставляется `https://github.com/router-for-me/Cli-Proxy-API-Management-Center`. |
| management.secret-key | Ключ управления. Это может быть открытый текст или хеш bcrypt. | empty string | Открытый текст хешируется и записывается обратно при загрузке или сохранении. Если он, `MANAGEMENT_PASSWORD` и локальный пароль запуска пусты, маршруты управления не регистрируются, а `/v0/management` и `/v8/management` возвращают 404. |

## 5. Типичные ошибки и границы

После 5 подряд неудачных аутентификаций с одного IP клиента, включая localhost, клиент блокируется примерно на 30 минут со статусом 403. Нет ключа — 401 `missing management key`. Неверный ключ — 401 `invalid management key`. В режиме Home всегда 404, даже если ключ записан. Локальный пароль из `--password` или созданный автономным режимом TUI принимает только запросы с `127.0.0.1` или `::1` и в конфигурацию не записывается.

## 6. Связанные возможности

Терминальный клиент описан в разделе [Терминальный интерфейс](/ru/operations/tui). Чтение и запись конфигурации — в разделе [Management API v8](/ru/management/apiv8). Страница панели остаётся [Web UI](/ru/management/webui).

## 7. Практический опыт

- [Вход в управление использует secret-key](/ru/experience/operations#exp-operations-management-secret)
- [После выключения панели нет хешированного адреса управления](/ru/experience/operations#exp-operations-panel-route-is-html)
- [Сделайте файлы страницы управления загружаемыми](/ru/experience/routing#exp-routing-management-page-download)
