---
title: Параметры провайдера Antigravity
feature_ids:
  - oauth.providers.antigravity-antigravity-credits
  - oauth.providers.antigravity-connection-pool-enabled
  - oauth.providers.antigravity-connection-pool-idle-conn-timeout
  - oauth.providers.antigravity-connection-pool-max-idle-conns-per-host
  - oauth.providers.antigravity-sensitive-words
  - oauth.providers.antigravity-signature-bypass-strict
  - oauth.providers.antigravity-signature-cache-enabled
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Параметры провайдера Antigravity

## 1. Какую задачу решает этот раздел

Описывает credits, пул соединений, чувствительные слова и кэш подписи thinking, общие для учётных данных Antigravity OAuth.

## 2. Когда применимо и чего здесь нет

Команда входа на этой странице не описана. Эти параметры не действуют на группу ключей API.

## 3. Как настроить или вызвать

```yaml
oauth:
  providers:
    antigravity:
      antigravity-credits: false
      sensitive-words:
        - "API"
      connection-pool:
        enabled: false
        idle-conn-timeout: "30s"
        max-idle-conns-per-host: 2
      signature-cache-enabled: true
      signature-bypass-strict: false
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| oauth.providers.antigravity.antigravity-credits | После исчерпания бесплатного уровня переходить ли на учётные данные с Google One AI credits. | false | Действует только на модели Claude. Только после того как все учётные данные бесплатного уровня исчерпаны из-за 429 или 503, в качестве последнего отката используются учётные данные, у которых ещё есть credits. false или пропуск этого отката не делают. |
| oauth.providers.antigravity.connection-pool.enabled | oauth.providers.antigravity.connection-pool.enabled | Defaults to false (short-lived connection mode). | oauth.providers.antigravity.connection-pool.enabled |
| oauth.providers.antigravity.connection-pool.idle-conn-timeout | oauth.providers.antigravity.connection-pool.idle-conn-timeout | Defaults to "30s". | oauth.providers.antigravity.connection-pool.idle-conn-timeout |
| oauth.providers.antigravity.connection-pool.max-idle-conns-per-host | oauth.providers.antigravity.connection-pool.max-idle-conns-per-host | Defaults to 2. | oauth.providers.antigravity.connection-pool.max-idle-conns-per-host |
| oauth.providers.antigravity.sensitive-words | oauth.providers.antigravity.sensitive-words | nil | Перечисленные слова в соответствующей подсказке разбиваются символами нулевой ширины. При пропуске не обрабатываются. |
| oauth.providers.antigravity.signature-bypass-strict | oauth.providers.antigravity.signature-bypass-strict | nil | oauth.providers.antigravity.signature-bypass-strict |
| oauth.providers.antigravity.signature-cache-enabled | oauth.providers.antigravity.signature-cache-enabled | When true (default), cached signatures are preferred and validated. | oauth.providers.antigravity.signature-cache-enabled |

## 5. Типичные ошибки и границы

Пул соединений включается только когда enabled равен true. Если idle-conn-timeout нельзя разобрать, пишется предупреждение и используется 30s. Выше 210s обрезается до 210s. Меньше или равно 0 переходит на короткое соединение. Если max-idle-conns-per-host больше 100, обрезается до 100. Меньше 0 переходит на короткое соединение. Если кэш подписи опущен, он равен true. signature-bypass-strict действует только после выключения кэша. Когда antigravity-credits равен true, учётные данные, у которых ещё есть Google One AI credits, используются только после того, как все учётные данные бесплатного уровня для моделей Claude исчерпаны из-за 429 или 503. false или пропуск этого отката не делают.

## 6. Связанные возможности

Вход описан в разделе [Вход Antigravity](/ru/accounts/antigravity).

## 7. Практический опыт

- [Перед переключением квоты сначала используйте откат на credits](/ru/experience/configuration#exp-configuration-antigravity-credits)
