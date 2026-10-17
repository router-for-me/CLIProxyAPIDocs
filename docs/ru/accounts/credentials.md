---
title: Параллелизм учётных данных и наблюдение в пути
feature_ids:
  - credentials.concurrency.busy-retry-max
  - credentials.concurrency.busy-retry-min
  - credentials.concurrency.cleanup-interval
  - credentials.concurrency.cpa-cancel-bound
  - credentials.concurrency.cpa-heartbeat-timeout
  - credentials.concurrency.lifecycle-config-revision
  - credentials.concurrency.max-limit
  - credentials.concurrency.observation-barrier-revision
  - credentials.concurrency.reclaim-grace
  - credentials.concurrency.release-flush-interval
  - credentials.concurrency.release-max-backoff
  - credentials.in-flight.max-aggregate-groups
  - credentials.in-flight.max-details
  - credentials.in-flight.max-part-bytes
  - credentials.in-flight.max-part-count
  - credentials.in-flight.max-revision-bytes
  - credentials.in-flight.max-string-bytes
  - credentials.in-flight.snapshot-interval
  - credentials.in-flight.staging-retention
  - credentials.in-flight.stale-after
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Параллелизм учётных данных и наблюдение в пути

## 1. Какую задачу решает этот раздел

Здесь описаны аренды параллелизма учётных данных, которые использует Home, и пределы снимка наблюдения в пути.

## 2. Когда применимо и чего здесь нет

Эти ключи нужны жизненному циклу учётных данных Home. Они не выбирают модель и не сохраняют токен OAuth. Пути v8 — `credentials.concurrency` и `credentials.in-flight`. Старые пути — `credential-concurrency` и `credential-in-flight`.

## 3. Как настроить или вызвать

```yaml
credentials:
  concurrency:
    lifecycle-config-revision: 1
    observation-barrier-revision: 0
    cpa-heartbeat-timeout: 3s
    cpa-cancel-bound: 5s
    reclaim-grace: 5s
    cleanup-interval: 5s
    release-flush-interval: 250ms
    release-max-backoff: 2s
    busy-retry-min: 250ms
    busy-retry-max: 1s
    max-limit: 1000000
  in-flight:
    snapshot-interval: 2s
    stale-after: 10s
    max-part-bytes: 262144
    max-part-count: 64
    max-revision-bytes: 16777216
    max-aggregate-groups: 100000
    max-details: 10000
    max-string-bytes: 256
    staging-retention: 1m
```

Времена параллелизма выше — значения, которые `WithDefaults` подставляет, когда поле находится в нулевом значении по умолчанию. Поля в пути заполняет загрузчик до разбора YAML. Столбец «По умолчанию» в таблице по-прежнему является исходным нулевым текстом реестра.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| credentials.concurrency.busy-retry-max | Верхняя граница ожидания повтора, когда учётные данные заняты. | 0s | Нулевой 0 становится 1s. Это должно быть положительное целое число миллисекунд и не меньше busy-retry-min. |
| credentials.concurrency.busy-retry-min | Нижняя граница ожидания повтора, когда учётные данные заняты. | 0s | Нулевой 0 становится 250ms. Это должно быть положительное целое число миллисекунд и не больше busy-retry-max. |
| credentials.concurrency.cleanup-interval | Интервал очистки аренд параллелизма. | 0s | Нулевой 0 становится 5s. Должно быть положительным. |
| credentials.concurrency.cpa-cancel-bound | Предел времени отмены аренды параллелизма на стороне CPA. | 0s | Нулевой 0 становится 5s. Сердцебиение узла плюс reclaim-grace должно быть больше этого плюс cpa-heartbeat-timeout. |
| credentials.concurrency.cpa-heartbeat-timeout | Тайм-аут сердцебиения параллелизма CPA. | 0s | Нулевой 0 становится 3s. Должно быть положительным. |
| credentials.concurrency.lifecycle-config-revision | Номер редакции конфигурации жизненного цикла Home. | 0 | Нулевое значение по умолчанию может быть 0. После записи 0 или отрицательное значение приводит к ошибке загрузки. |
| credentials.concurrency.max-limit | Верхняя граница числа аренд параллелизма. | 0 | Нулевой 0 становится 1000000. Допустимый диапазон — от 1 до 1000000. |
| credentials.concurrency.observation-barrier-revision | Номер редакции барьера наблюдения. | 0 | Не может быть отрицательным. Нулевое значение остаётся 0. |
| credentials.concurrency.reclaim-grace | Льгота перед возвратом аренды. | 0s | Нулевой 0 становится 5s. Должно быть положительным. |
| credentials.concurrency.release-flush-interval | Интервал сброса освобождения. | 0s | Нулевой 0 становится 250ms. Должно быть положительным и не больше release-max-backoff. |
| credentials.concurrency.release-max-backoff | Максимальная задержка сброса освобождения. | 0s | Нулевой 0 становится 2s. Должно быть положительным и не меньше release-flush-interval. |
| credentials.in-flight.max-aggregate-groups | Верхняя граница групп агрегации, которые хранит наблюдение в пути. | 0 | При нулевом значении загрузчик заполняет 100000. Допустимо от 1 до 100000. |
| credentials.in-flight.max-details | Верхняя граница подробностей, которые хранит наблюдение в пути. | 0 | При нулевом значении загрузчик заполняет 10000. Допустимо от 0 до 10000. |
| credentials.in-flight.max-part-bytes | Предел байтов одного фрагмента снимка. | 0 | При нулевом значении загрузчик заполняет 262144. Не может быть меньше 1024. |
| credentials.in-flight.max-part-count | Число фрагментов, допустимое в одной редакции. | 0 | При нулевом значении загрузчик заполняет 64. Допустимо от 1 до 64. |
| credentials.in-flight.max-revision-bytes | Предел байтов одной редакции. | 0 | При нулевом значении загрузчик заполняет 16777216. Должно попадать между max-part-bytes и 16777216 и помещаться в число фрагментов. |
| credentials.in-flight.max-string-bytes | Предел байтов, сохраняемых для одной строки наблюдения. | 0 | При нулевом значении загрузчик заполняет 256. Допустимо от 1 до 256. |
| credentials.in-flight.snapshot-interval | Интервал снимка в пути. | empty string | При нулевом значении загрузчик заполняет 2s. Это должна быть положительная длительность, а stale-after — не меньше трёх таких интервалов. |
| credentials.in-flight.staging-retention | Срок хранения промежуточных данных наблюдения. | empty string | При нулевом значении загрузчик заполняет 1m. Это должна быть положительная длительность. |
| credentials.in-flight.stale-after | Возраст, после которого снимок считается устаревшим. | empty string | При нулевом значении загрузчик заполняет 10s. Должно быть не меньше трёх интервалов снимка. |

## 5. Типичные ошибки и границы

Загрузка конфигурации не удаётся, если конфигурация параллелизма не удовлетворяет положительной длительности, выравниванию по миллисекундам, порядку задержки или диапазону `max-limit`. Если `lifecycle-config-revision` присутствует, он не может быть 0 или отрицательным. Загрузка также не удаётся, если длительность в пути нельзя разобрать, `stale-after` меньше трёх интервалов снимка или ёмкость фрагментов не вмещает размер редакции. Сердцебиение узла плюс reclaim-grace должно быть больше сердцебиения CPA плюс cancel bound, иначе проверка жизненного цикла не удаётся.

## 6. Связанные возможности

Каталог файлов учётных данных описан в разделе [Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth).

## 7. Практический опыт

Пока нет.
