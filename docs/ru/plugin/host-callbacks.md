---
outline: 'deep'
---

# Callback хоста

Callback хоста — это механизм, по которому плагин вызывает возможности хоста CLIProxyAPI. Это не поле возможности плагина, но он важен для executor, Management API, учётных данных и плагинов с ресурсными страницами.

## Список методов

Исходный код:

- `sdk/pluginabi/types.go`: все имена методов `host.*`
- `sdk/pluginapi/types.go`: структуры запросов и ответов для HTTP, выполнения моделей и файлов учётных данных
- `internal/pluginhost/host_callbacks.go`: реализация callback хоста

Примеры:

- `examples/plugin/host-callback/go/main.go`
- `examples/plugin/host-callback-auth-files/go/main.go`
- `examples/plugin/host-model-callback/go/main.go`

## HTTP callback

| Метод | Назначение |
| --- | --- |
| `host.http.do` | Выполняет обычный HTTP-запрос через хост. |
| `host.http.do_stream` | Выполняет стриминговый HTTP-запрос через хост. |
| `host.http.stream_read` | Читает HTTP-поток, удерживаемый хостом. |
| `host.http.stream_close` | Закрывает HTTP-поток, удерживаемый хостом. |

Плагинам следует предпочитать эти методы для внешних HTTP-сервисов, чтобы proxy, транспортная политика и логирование запросов оставались под управлением хоста.

## Callback выполнения моделей

| Метод | Назначение |
| --- | --- |
| `host.model.execute` | Запускает нестриминговый запрос модели. |
| `host.model.execute_stream` | Запускает стриминговый запрос модели и возвращает `stream_id`. |
| `host.model.stream_read` | Читает chunk потока модели. |
| `host.model.stream_close` | Закрывает поток модели. |

Основные поля запроса:

```json
{
  "entry_protocol": "openai",
  "exit_protocol": "openai",
  "model": "gpt-5.5",
  "stream": false,
  "body": "base64-request-body",
  "headers": {},
  "query": {},
  "alt": ""
}
```

## host_callback_id

Когда плагин вызывает `host.model.*` из контекста, вызванного хостом, например `management.handle`, он должен переслать `host_callback_id` из запроса.

Хост использует этот ID, чтобы определить плагин-источник callback. При вложенном выполнении модели он пропускает собственные request, response и stream interceptor этого плагина, чтобы избежать рекурсии. Другие включённые плагины всё ещё могут обработать вложенный запрос.

## Callback файлов учётных данных

| Метод | Назначение |
| --- | --- |
| `host.auth.list` | Перечисляет записи учётных данных хоста. |
| `host.auth.get` | Читает физический JSON учётных данных по auth index. |
| `host.auth.get_runtime` | Читает runtime-информацию об учётных данных по auth index. |
| `host.auth.save` | Записывает JSON учётных данных и обновляет runtime-запись. |

`examples/plugin/host-callback-auth-files` показывает вызов этих методов из ресурсной страницы.

## Мост потоков и логирование

| Метод | Назначение |
| --- | --- |
| `host.stream.emit` | Позволяет executor plugin отправить стриминговый chunk хосту. |
| `host.stream.close` | Позволяет executor plugin закрыть поток. |
| `host.log` | Пишет через логгер хоста. |

## Замечания по разработке

- После использования streaming callback явно вызывайте соответствующий close-метод.
- Не используйте callback хоста для обхода собственных границ безопасности плагина; плагин всё равно является доверенным кодом внутри процесса.
- Не пишите в логи JSON учётных данных, token или тела пользовательских запросов.
- Если можно переиспользовать путь выполнения модели хоста, предпочитайте `host.model.*` и не копируйте учётные данные хоста в плагин.

