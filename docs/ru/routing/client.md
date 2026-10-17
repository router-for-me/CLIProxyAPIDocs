---
title: Каталог клиента Codex
feature_ids:
  - client.codex.enable-apply-patch
  - client.codex.optimize-multi-agent-v2
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Каталог клиента Codex

## 1. Какую задачу решает этот раздел

Когда клиент Codex запрашивает каталог моделей, прокси может дополнительно объявить свободный `apply_patch` и переписать официальные запросы Codex multi-agent v2. Оба переключателя действуют на маршрутизацию OAuth и ключей API.

## 2. Когда применимо и чего здесь нет

Они находятся в `client.codex`, а не в `oauth.providers.codex` и не на одном ключе API. Старый путь провайдера `optimize-multi-agent-v2` переносится сюда. Если канонический путь присутствует, он побеждает. Явный false тоже побеждает. Маскировка Codex upstream, управление WebSocket и медиа-реле здесь не меняются.

## 3. Как настроить или вызвать

```yaml
client:
  codex:
    enable-apply-patch: false
    optimize-multi-agent-v2: false
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| client.codex.enable-apply-patch | Объявлять ли свободный apply_patch в клиентском каталоге Codex. | Default false clears the capability regardless of template metadata. | false снимает эту возможность из метаданных шаблона и оставляет только модели, которые нативно объявляют свободный apply_patch. При true нешаблонные и мостовые модели, которые поддерживает каждый исполнитель маршрутизации, тоже объявляют freeform. |
| client.codex.optimize-multi-agent-v2 | Оптимизировать ли официальные запросы Codex multi-agent v2. | Default false leaves the client's multi-agent behavior unchanged. | false не меняет поведение нескольких агентов у клиента. При true обновляются подробности модели spawn_agent, снимается шифрование параметров сообщения, нормализуется зашифрованный agent_message для Codex, а agent_message в протоколе upstream, который не является Codex, превращается в обычное сообщение пользователя. Действует только на Codex Desktop, codex-tui и codex_cli_rs. |

## 5. Типичные ошибки и границы

Оба ключа логические. false — действительная конфигурация, а не пропуск. Если `optimize-multi-agent-v2` записан только на старом пути провайдера, а `client.codex` уже задал значение, старый путь его не перекрывает.

## 6. Связанные возможности

Выбор учётных данных описан в разделе [Стратегия маршрутизации](/ru/routing/strategy). Переписывание итогового JSON по модели — в разделах [Правила payload по умолчанию](/ru/routing/requests-default), [Правила переопределения payload](/ru/routing/requests-override) и [Правила фильтрации payload](/ru/routing/requests-filter).

## 7. Практический опыт

- [Включите переключатель совместимости нескольких агентов](/ru/experience/configuration#exp-configuration-optimize-multi-agent)
