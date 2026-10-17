---
title: Разработка плагинов
feature_ids: []
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: true
translation_pending: false
---

# Разработка плагинов

Интерфейсы разделены по `sdk/pluginapi` и `sdk/pluginabi` закреплённого коммита. Эта страница больше не регистрирует возможности и не повторяет параметры и возвращаемые значения методов.

`ABIVersion` равен 1. Текущий JSON-контракт `SchemaVersion` равен 6. Плагин регистрируется через `plugin.register`. Если он уже зарегистрирован, последующая конфигурация идёт через `plugin.reconfigure`. `Name`, `Version`, `Author` и `GitHubRepository` в `result.metadata` не могут быть пустыми, и должна быть включена хотя бы одна возможность, иначе регистрация недействительна. Отключение и выход соответствуют `plugin.quiesce` и `plugin.shutdown`. Каталог загрузки и переключатель включения описаны в разделе [Загрузка плагинов и магазин](/ru/operations/plugins).

- [Регистратор моделей](/ru/plugin/model-registrar), [Провайдер моделей](/ru/plugin/model-provider), [Провайдер учётных данных](/ru/plugin/auth-provider), [Провайдер фронтенд-аутентификации](/ru/plugin/frontend-auth-provider), [Исключительный режим фронтенд-аутентификации](/ru/plugin/frontend-auth-exclusive), [Планировщик](/ru/plugin/scheduler), [Маршрутизатор моделей](/ru/plugin/model-router), [Исполнитель](/ru/plugin/executor)
- [Преобразование запроса](/ru/plugin/request-translator), [Приведение запроса](/ru/plugin/request-normalizer), [Перехват запроса](/ru/plugin/request-interceptor), [Жизненный цикл запроса](/ru/plugin/request-lifecycle)
- [Преобразование ответа](/ru/plugin/response-translator), [Приведение ответа](/ru/plugin/response-normalizer), [Указатель до преобразования ответа](/ru/plugin/response-before-translator), [Указатель после преобразования ответа](/ru/plugin/response-after-translator), [Перехват ответа](/ru/plugin/response-interceptor), [Перехват потокового ответа](/ru/plugin/response-stream-interceptor), [Наблюдатель ответа WebSocket](/ru/plugin/websocket-observer)
- [Обработка thinking](/ru/plugin/thinking-applier), [Наблюдатель использования](/ru/plugin/usage-plugin), [Расширение командной строки](/ru/plugin/command-line-plugin), [Management API](/ru/plugin/management-api), [Провайдер квоты](/ru/plugin/quota-provider), [HTTP-клиент хоста](/ru/plugin/host-callbacks)
