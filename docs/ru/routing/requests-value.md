---
title: Исходящие запросы
feature_ids:
  - requests.nonstream-keepalive-interval.value
  - requests.passthrough-headers.value
  - requests.proxy-url.value
  - requests.tls-handshake-timeout-seconds.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Исходящие запросы

## 1. Какую задачу решает этот раздел

Здесь задаются общий прокси всех запросов upstream, пересылка заголовков ответа, keep-alive пустой строкой для не потокового ответа и предел рукопожатия TLS встроенного клиента uTLS.

## 2. Когда применимо и чего здесь нет

Адрес прокси — глобальное значение. `proxy-url` на одних учётных данных перекрывает его отдельно. `direct` и `none` принадлежат только таким записям. Они одновременно обходят и это глобальное значение, и прокси окружения и не могут быть глобальной записью этого поля. Предел рукопожатия охватывает только рукопожатие TLS на общем клиенте uTLS. Он не ограничивает набор номера, CONNECT прокси, вывод или уже установленный длинный поток.

## 3. Как настроить или вызвать

```yaml
requests:
  proxy-url: ""
  tls-handshake-timeout-seconds: 0
  passthrough-headers: false
  nonstream-keepalive-interval: 0
```

Если нужен глобальный прокси, схема только `socks5`, `socks5h`, `http` или `https`, например `socks5://example.invalid:1080`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| requests.nonstream-keepalive-interval | Интервал в секундах вывода пустых строк не потокового ответа. | 0 | Меньше или равно 0 выключает. Единица — секунды, вывод — пустая строка. |
| requests.passthrough-headers | Пересылать ли клиенту отфильтрованные заголовки ответа upstream. | Default is false (disabled). | false не пересылает их обычному клиенту. Перед пересылкой удаляются поэтапные заголовки, Set-Cookie, Content-Length, Content-Encoding, CORS под управлением CPA и X-Cpa-Trace-Id, заголовки, указанные Connection, а также префиксы x-litellm-, helicone-, x-portkey-, cf-aig-, x-kong- и x-bt-. Внутреннее выполнение хоста плагина даже при false всё равно получает отфильтрованные заголовки. |
| requests.proxy-url | Глобальный адрес исходящего прокси. | empty string | Пустая строка не задаёт глобальный прокси. Действительны только socks5, socks5h, http и https. Отсутствие схемы или хоста либо другая схема недействительны. direct и none не являются глобальными значениями этого поля. |
| requests.tls-handshake-timeout-seconds | Верхний предел рукопожатия TLS общего клиента uTLS в секундах. | The default 0 disables the bound (previous behavior); negative values are treated as 0, and values beyond the representable duration range saturate. | Действует только на транспорт Anthropic uTLS Claude Code и транспорт Chrome ChatGPT/Codex uTLS, не на стандартный запасной транспорт. Отсчёт начинается после возврата TCP или соединения прокси. После успешного рукопожатия ограничение снимается. 0 выключает. Отрицательное значение считается 0. Значение за пределами представимой длительности насыщается до максимальной длительности. |

## 5. Типичные ошибки и границы

Если у глобального `proxy-url` нет схемы или хоста либо используется неподдерживаемая схема, настройка прокси недействительна, и транспорт откатывается к RoundTripper в контексте. `passthrough-headers: false` ошибкой не является. При пределе рукопожатия 0 верхняя граница не задаётся. Если сторона принимает соединение, но не завершает ClientHello, этот путь uTLS всё ещё может ждать бесконечно.

## 6. Связанные возможности

Потоковый keep-alive описан в разделах [Потоковый keep-alive](/ru/routing/requests-keepalive), [Повтор до первого байта](/ru/routing/requests-bootstrap) и [Keep-alive до первого токена](/ru/routing/requests-send). Прокси ключа — в разделе [Прокси ключа](/ru/accounts/api-keys-proxy).

## 7. Практический опыт

- [При искажённом ответе сначала проверьте прокси на ключе](/ru/experience/accounts#exp-accounts-trace-key-proxy)
- [Проксированный запрос управления всё равно использует глобальный прокси](/ru/experience/management#exp-management-api-call-proxy-order)
- [Сделайте файлы страницы управления загружаемыми](/ru/experience/routing#exp-routing-management-page-download)
- [Назначьте прокси одним учётным данным](/ru/experience/routing#exp-routing-per-credential-proxy)
- [Пусть сервер сам завершит вход через прокси](/ru/experience/routing#exp-routing-proxy-for-token-exchange)
