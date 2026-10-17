---
title: Обнаружение в локальной сети
feature_ids:
  - server.discovery.advertise-management
  - server.discovery.auth-required
  - server.discovery.enabled
  - server.discovery.interfaces-exclude
  - server.discovery.interfaces-include
  - server.discovery.service-name
  - server.discovery.service-type
  - server.discovery.subtypes
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Обнаружение в локальной сети

## 1. Какую задачу решает этот раздел

Объявляет этот экземпляр в локальной сети через mDNS / DNS-SD, чтобы клиенты в той же сети могли найти адрес шлюза, требуется ли аутентификация и сообщается ли в объявлении доступность интерфейса управления.

## 2. Когда применимо и чего здесь нет

Объявление есть только когда `server.discovery.enabled` равен true. Оно не заменяет клиентский ключ и не открывает удалённое управление. Стандартный мост Docker не пропускает канальный multicast `224.0.0.251`. Чтобы объявлять в физической локальной сети, контейнеру нужна сеть host. Адрес прослушивания описан в разделе [Прослушивание и процесс](/ru/operations/server).

## 3. Как настроить или вызвать

В примере конфигурации обнаружение по умолчанию выключено. Остальные пункты даны комментариями:

```yaml
server:
  discovery:
    enabled: false
    # service-name: ""
    # service-type: "_ai-gateway._tcp"
    # subtypes:
    #   - "_chat-completions"
    #   - "_responses"
    #   - "_messages"
    #   - "_generate-content"
    #   - "_interactions"
    # interfaces:
    #   include: []
    #   exclude: []
    # auth-required: true
    # advertise-management: false
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| server.discovery.advertise-management | Сообщать ли в объявлении, что интерфейс управления доступен. | AdvertiseManagement explicitly controls whether management endpoints are exposed (default: false). | Влияет только на запись TXT и само по себе не регистрирует маршруты управления. |
| server.discovery.auth-required | Сообщает клиентам, нужна ли аутентификация для вызова. | AuthRequired indicates whether authentication is required for client calls (default: true). | При пропуске объявляется true. Явный false записывается в TXT. Промежуточный слой аутентификации самого API не меняется. |
| server.discovery.enabled | Делать ли объявление mDNS в локальной сети. | Enabled toggles mDNS service advertising on the local network (default: false). | При false объявления нет. |
| server.discovery.interfaces.exclude | Дополнительные шаблоны исключения интерфейсов. | nil | Фильтруется вместе с include. Если годного физического интерфейса не осталось, объявление отклоняется и не откатывается ко всем интерфейсам. |
| server.discovery.interfaces.include | Белый список интерфейсов. | nil | Пустой список автоматически определяет физические интерфейсы. |
| server.discovery.service-name | Необязательный префикс имени экземпляра. | When empty, defaults to CPA-&lt;ShortID&gt;. | Пустое имя объявляется как `CPA-&lt;ShortID&gt;`. Пользовательское имя объявляется как `&lt;name&gt;-&lt;ShortID&gt;`. |
| server.discovery.service-type | Тип службы DNS-SD. | ServiceType is the DNS-SD service type (default: _ai-gateway._tcp). | Пустое значение использует `_ai-gateway._tcp`. Непустое значение должно соответствовать формату типа службы, иначе сборка спецификации обнаружения не удаётся. |
| server.discovery.subtypes | Подтипы протоколов API для объявления. | nil | При пропуске или пустом списке используются `_chat-completions`, `_responses`, `_messages`, `_generate-content` и `_interactions`. Если после очистки не осталось ни одного, сохраняется только `_chat-completions`. |

## 5. Типичные ошибки и границы

Если адрес привязки — `localhost` или другой адрес обратной петли, объявление в локальной сети отклоняется. Адрес привязки, который не является IP, тоже отклоняется. Если порт не в диапазоне от 1 до 65535, спецификация обнаружения недействительна. Если нет годного физического интерфейса или ни один интерфейс не владеет этим адресом привязки, объявления нет. Недопустимый формат `service-type` приводит к ошибке. Эти ошибки не означают, что HTTP-порт не поднялся.

## 6. Связанные возможности

Хост привязки описан в разделе [Прослушивание и процесс](/ru/operations/server). Отметка HTTPS берётся из раздела [TLS](/ru/operations/tls). Можно ли реально вызвать интерфейс управления, описано в разделе [Параметры управления](/ru/operations/management-settings).

## 7. Практический опыт

Пока нет.
