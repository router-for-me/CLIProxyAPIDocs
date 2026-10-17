---
title: Параметры провайдера Codex
feature_ids:
  - oauth.providers.codex-header-defaults-beta-features
  - oauth.providers.codex-header-defaults-user-agent
  - oauth.providers.codex-live-media-relay-disable-private-remote-ips
  - oauth.providers.codex-live-media-relay-enabled
  - oauth.providers.codex-live-media-relay-ice-servers-credential
  - oauth.providers.codex-live-media-relay-ice-servers-urls
  - oauth.providers.codex-live-media-relay-ice-servers-username
  - oauth.providers.codex-live-media-relay-max-sessions
  - oauth.providers.codex-live-media-relay-public-ip
  - oauth.providers.codex-live-media-relay-udp-port-max
  - oauth.providers.codex-live-media-relay-udp-port-min
  - oauth.providers.codex-signin-with-chatgpt-identifier
  - upstream.codex.disable-codex-cloaking
  - upstream.codex.model-level-cooling
  - upstream.codex.orphan-delegation-compatibility
  - upstream.codex.response-steering
  - upstream.codex.stream-bootstrap-buffering
  - upstream.codex.stream-bootstrap-timeout
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Параметры провайдера Codex

## 1. Какую задачу решает этот раздел

Описывает маскировку, буфер потока, медиа-реле, заголовки запроса и идентификатор Sign in with ChatGPT, общие для OAuth Codex и файловых учётных данных.

## 2. Когда применимо и чего здесь нет

websockets, alpha-search и disable-codex-cloaking ключа API на этой странице не описаны. Команда входа здесь не описана.

## 3. Как настроить или вызвать

```yaml
oauth:
  providers:
    codex:
      signin-with-chatgpt-identifier: "CLIProxyAPI"
      header-defaults:
        user-agent: ""
        beta-features: ""
      live-media-relay:
        enabled: false
        max-sessions: 0
        disable-private-remote-ips: false
        public-ip: ""
        udp-port-min: 0
        udp-port-max: 0
upstream:
  codex:
    disable-codex-cloaking: false
    model-level-cooling: false
    orphan-delegation-compatibility: false
    response-steering: false
    stream-bootstrap-buffering: false
    stream-bootstrap-timeout: "0"
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| oauth.providers.codex.header-defaults.beta-features | oauth.providers.codex.header-defaults.beta-features | empty string | Добавляется только к WebSocket OAuth Codex. Не действует на HTTP и не действует на api-keys.codex. |
| oauth.providers.codex.header-defaults.user-agent | oauth.providers.codex.header-defaults.user-agent | empty string | Добавляется только к OAuth Codex или файловым учётным данным, которые не отправили этот заголовок, и для HTTP, и для WebSocket. Не действует на api-keys.codex. |
| oauth.providers.codex.live-media-relay.disable-private-remote-ips | oauth.providers.codex.live-media-relay.disable-private-remote-ips | false | true отклоняет частные, петлевые, канально-локальные и неуказанные адреса. Не может присутствовать вместе со старым ключом allow-private-remote-ips. |
| oauth.providers.codex.live-media-relay.enabled | oauth.providers.codex.live-media-relay.enabled | false | При true этот процесс завершает и ретранслирует WebRTC, нужен входящий UDP. false сохраняет прямое соединение. |
| oauth.providers.codex.live-media-relay.ice-servers.credential | oauth.providers.codex.live-media-relay.ice-servers.credential | empty string | YAML принимает. Интерфейс конфигурации JSON его не возвращает. |
| oauth.providers.codex.live-media-relay.ice-servers.urls | oauth.providers.codex.live-media-relay.ice-servers.urls | nil | Обязательно после включения. Схема может быть только stun, stuns, turn или turns. |
| oauth.providers.codex.live-media-relay.ice-servers.username | oauth.providers.codex.live-media-relay.ice-servers.username | empty string | YAML принимает. Интерфейс конфигурации JSON его не возвращает. |
| oauth.providers.codex.live-media-relay.max-sessions | oauth.providers.codex.live-media-relay.max-sessions | 0 | 0 или пропуск считаются 32. После включения отрицательное значение приводит к ошибке загрузки. |
| oauth.providers.codex.live-media-relay.public-ip | oauth.providers.codex.live-media-relay.public-ip | empty string | Пустое значение ничего дополнительно не объявляет. После включения непустое значение, которое не является IP, приводит к ошибке загрузки. |
| oauth.providers.codex.live-media-relay.udp-port-max | oauth.providers.codex.live-media-relay.udp-port-max | 0 | Не может быть меньше udp-port-min. Если заполнен только один конец, включённое реле не загружается. |
| oauth.providers.codex.live-media-relay.udp-port-min | oauth.providers.codex.live-media-relay.udp-port-min | 0 | Должно задаваться вместе с udp-port-max. После включения диапазон должен иметь не меньше двух портов на сеанс. |
| oauth.providers.codex.signin-with-chatgpt-identifier | oauth.providers.codex.signin-with-chatgpt-identifier | Defaults to "CLIProxyAPI". | Пустое или опущенное значение использует CLIProxyAPI. Используется и для agent_name_hint, и для префикса User-Agent. |
| upstream.codex.disable-codex-cloaking | Прекращать ли принудительные официальные заголовки личности Codex. | false | При true официальные заголовки личности Codex больше не принуждаются, и для HTTP/SSE, и для WebSocket. |
| upstream.codex.model-level-cooling | Действует ли охлаждение квоты только на текущую модель. | false | При true охлаждение usage_limit_reached ограничивается текущей моделью. |
| upstream.codex.orphan-delegation-compatibility | Включена ли совместимость вывода осиротевшего делегирования. | false | При true вывод осиротевшего делегирования с X-Openai-Subagent: collab_spawn преобразуется для совместимости. |
| upstream.codex.response-steering | Включён ли полнодуплексный WebSocket Codex. | Default is false. | При true включается полнодуплексный WebSocket, и вся жизнь привязана к одной модели upstream, учётной записи и сокету. |
| upstream.codex.stream-bootstrap-buffering | Удерживать ли кадры потока до начала генерации. | Default is false. | При true сначала удерживаются рукопожатие, сердцебиение и всё ещё пустые кадры added до начала генерации. Предел — 48 кадров и 1MB, а не время настенных часов. Только перегрузка и ограничение частоты намеренно меняют учётные данные. |
| upstream.codex.stream-bootstrap-timeout | Самое долгое время удержания заголовков ответа. | Defaults to "0" (unlimited time, relying purely on the 48-frame and 1MB byte bounds). | 0, 0s, none, unlimited, disabled, off, never или неразбираемое значение означают неограниченное время. После положительной длительности поток отпускается. |

## 5. Типичные ошибки и границы

Когда enabled медиа-реле равен false, остальные поля не проверяются. После включения отрицательный max-sessions, public-ip не IP, заполнен только один конец UDP, диапазон меньше двух портов на сеанс или схема ICE URL не stun, stuns, turn, turns — всё это приводит к ошибке загрузки конфигурации. allow-private-remote-ips устарел и не может присутствовать вместе с disable-private-remote-ips. stream-bootstrap-timeout принимает длительность или чистое число секунд. 0, 0s, none, unlimited, disabled, off, never и неразбираемая строка означают неограниченное время. Пустой идентификатор Sign in with ChatGPT использует CLIProxyAPI.

## 6. Связанные возможности

Вход описан в разделе [Вход Codex](/ru/accounts/codex). WebSocket уровня ключа — в разделе [Транспорт WebSocket Responses](/ru/accounts/api-keys-websockets).

## 7. Практический опыт

- [Клиент Codex должен совпадать со значением User-Agent по умолчанию](/ru/experience/accounts#exp-accounts-codex-client-user-agent)
- [При 503 одновременно проверьте маскировку Codex и User-Agent](/ru/experience/accounts#exp-accounts-codex-cloak-and-user-agent)
