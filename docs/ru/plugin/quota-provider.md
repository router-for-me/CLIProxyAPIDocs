---
title: Провайдер квоты
feature_ids:
  - plugin.quota-provider.identifier
  - plugin.quota-provider.describe-quota
  - plugin.quota-provider.fetch-quota
  - plugin.quota-provider.reset-quota
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Провайдер квоты

`QuotaProvider` отдаёт стороне управления квоту, баланс и сведения о счетах учётных данных.

## 1. Какую задачу решает этот раздел

Плагин объявляет, какие provider он поддерживает и можно ли сбросить квоту, затем по одним учётным данным возвращает нормализованную квоту или, если это поддерживается, выполняет сброс.

## 2. Когда применимо и чего здесь нет

Вход и обновление он не выполняет. Это [Провайдер учётных данных](/ru/plugin/auth-provider). Поток использования — не снимок квоты. См. [Наблюдение за использованием](/ru/plugin/usage-plugin).

Когда `SupportsReset` из `DescribeQuota` равен false, вызывающей стороне не следует рассчитывать, что `ResetQuota` изменит квоту.

## 3. Как настроить или вызвать

Задайте `capabilities.quota_provider` равным true.

```go
Identifier() string
DescribeQuota(context.Context, QuotaDescribeRequest) (QuotaDescribeResponse, error)
FetchQuota(context.Context, QuotaFetchRequest) (QuotaFetchResponse, error)
ResetQuota(context.Context, QuotaResetRequest) (QuotaResetResponse, error)
```

Имена методов ABI — `quota.identifier`, `quota.describe`, `quota.fetch` и `quota.reset`. Поле результата идентификатора — `identifier`.

Поля на стороне запроса с тегом `json` используют змеиные имена. Теги на стороне ответа в основном верблюжьи. Десериализация также принимает змеиные имена, записанные ниже.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.quota-provider.identifier | `Identifier`, ABI `quota.identifier`. |  | Возвращает ключ provider, который обрабатывает этот провайдер. Ошибка или пустое значение считаются пустой строкой. |
| plugin.quota-provider.describe-quota | `DescribeQuota`, ABI `quota.describe`. |  | Параметр `QuotaDescribeRequest`. |
| plugin.quota-provider.fetch-quota | `FetchQuota`, ABI `quota.fetch`. |  | Параметр `QuotaFetchRequest`. |
| plugin.quota-provider.reset-quota | `ResetQuota`, ABI `quota.reset`. |  | Параметр `QuotaResetRequest`. |
| QuotaDescribeRequest.Plugin | Метаданные плагина. |  | Имя JSON `plugin`. |
| QuotaDescribeResponse.SupportedProviders | Поддерживаемые ключи provider. |  | Имя JSON `supported_providers`. |
| QuotaDescribeResponse.DisplayName | Отображаемое имя. |  | Имя JSON `display_name`. |
| QuotaDescribeResponse.SupportsReset | Поддерживается ли сброс. |  | Имя JSON `supports_reset`. |
| QuotaFetchRequest.AuthIndex | Индекс учётных данных. |  | Имя JSON `auth_index`. У запроса сброса то же имя. |
| QuotaFetchRequest.AuthID | ID учётных данных. |  | Имя JSON `auth_id`. |
| QuotaFetchRequest.Provider | Provider учётных данных. |  | Имя JSON `provider`. |
| QuotaFetchRequest.StorageJSON | Сохранённые данные плагина. |  | Имя JSON `storage_json`, base64. |
| QuotaFetchRequest.Metadata | Метаданные, которые хост может менять. |  | Имя JSON `metadata`. |
| QuotaFetchRequest.Attributes | Неизменяемые атрибуты. |  | Имя JSON `attributes`. |
| QuotaFetchRequest.Host | Сводка конфигурации хоста. |  | Имя JSON `host`. |
| QuotaFetchRequest.HTTPClient | HTTP-клиент хоста. |  | JSON игнорирует. |
| QuotaFetchResponse.Subscription | Сведения о тарифе. |  | Имя JSON у `Plan` — `plan`. `TierName` принимает `tierName` или `tier_name`. `TierID` принимает `tierId` или `tier_id`. |
| QuotaFetchResponse.Summary | Числовая сводка учётной записи. |  | Имя JSON `summary`. Элементы — `QuotaMetric`. |
| QuotaFetchResponse.ServerTimeOffsetMs | Смещение времени сервера в миллисекундах. |  | Принимает `serverTimeOffsetMs` или `server_time_offset_ms`. |
| QuotaFetchResponse.Groups | Группы квоты. |  | Имя JSON `groups`. |
| QuotaGroup.DisplayName | Имя группы. |  | `displayName` или `display_name`. |
| QuotaGroup.Buckets | Окна внутри группы. |  | Имя JSON `buckets`. |
| QuotaBucket.Window | Имя окна. |  | Имя JSON `window`. |
| QuotaBucket.RemainingFraction | Оставшаяся доля. |  | `remainingFraction` или `remaining_fraction`. |
| QuotaBucket.ResetTime | Текст времени сброса. |  | `resetTime` или `reset_time`. |
| QuotaBucket.Description | Описание. |  | Имя JSON `description`. |
| QuotaMetric.Key | Ключ показателя. |  | Имя JSON `key`. |
| QuotaMetric.Label | Отображаемая метка. |  | Имя JSON `label`. |
| QuotaMetric.Value | Числовое значение. |  | Имя JSON `value`, `float64`. |
| QuotaMetric.Unit | Единица. |  | Имя JSON `unit`. |
| QuotaMetric.Format | Формат отображения. |  | `number` или `currency`. |
| QuotaMetric.Currency | Код валюты. |  | ISO 4217, когда `Format` равен `currency`. |
| QuotaResetRequest | Контекст учётных данных при сбросе. |  | Поля те же, что у `QuotaFetchRequest`, включая `HTTPClient`, который JSON игнорирует. |
| QuotaResetResponse.Success | Успешен ли сброс. |  | Имя JSON `success`. |
| QuotaResetResponse.Message | Описание результата. |  | Имя JSON `message`. |

## 5. Типичные ошибки и границы

Когда любой из трёх методов с `error` завершается ошибкой, ABI `ok` равен false. Если `http_status` опущен или равен 0, он считается HTTP 500.

`QuotaResetResponse.Success` равный false — это результат предметной области. Он отличается от возврата ошибки методом. Когда верблюжье и змеиное имена присутствуют вместе, уже имеющееся верблюжье значение важнее. Змеиное имя заполняет поле только если верблюжье пусто. `RemainingFraction` берёт `remainingFraction`, если оно появилось первым, иначе `remaining_fraction`.

## 6. Связанные возможности

Материал учётных данных описан в разделе [Провайдер учётных данных](/ru/plugin/auth-provider). Счётчики токенов после завершения запроса — в разделе [Наблюдение за использованием](/ru/plugin/usage-plugin).

## 7. Практический опыт

Пока нет.

