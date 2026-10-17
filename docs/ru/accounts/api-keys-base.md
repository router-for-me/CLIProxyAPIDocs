---
title: Базовые URL upstream
feature_ids:
  - api-keys.claude.base-url
  - api-keys.codex.base-url
  - api-keys.gemini.base-url
  - api-keys.interactions.base-url
  - api-keys.meta.base-url
  - api-keys.openai-compatibility.base-url
  - api-keys.vertex.base-url
  - api-keys.xai.base-url
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Базовые URL upstream

## 1. Какую задачу решает этот раздел

Здесь описан base-url каждой группы upstream. Он принадлежит группе, а не одному ключу внутри группы.

## 2. Когда применимо и чего здесь нет

Конечные точки помимо официальных адресов не выдумываются. Ключ API Codex или xAI не может перейти на официальную конечную точку простым пропуском base-url: записи с пустым адресом отбрасываются при загрузке. Пустые значения остальных провайдеров — в подробностях. У провайдера, совместимого с OpenAI, встроенного официального адреса тоже нет.

## 3. Как настроить или вызвать

```yaml
api-keys:
  gemini:
    - name: gemini-1
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
  vertex:
    - name: vertex-1
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.claude.base-url | Базовый адрес upstream этой группы или провайдера. | If empty, the default Claude API URL will be used. | Пустое значение использует https://api.anthropic.com. Адрес принадлежит группе. Запись его в один ключ приводит к ошибке загрузки. |
| api-keys.codex.base-url | Базовый адрес upstream этой группы или провайдера. | If empty, the default Codex API URL will be used. | Если после удаления начальных и конечных пробелов он всё ещё пуст, SanitizeCodexKeys отбрасывает запись. Официальный адрес в исполнителе не применяется к удалённой конфигурации. Адрес принадлежит группе и не может быть записан на одном ключе. |
| api-keys.gemini.base-url | Базовый адрес upstream этой группы или провайдера. | empty string | Пустое значение использует https://generativelanguage.googleapis.com. |
| api-keys.interactions.base-url | Базовый адрес upstream этой группы или провайдера. | empty string | Пустое значение использует https://generativelanguage.googleapis.com. Эти ключи используются только для прямого /v1beta/interactions. |
| api-keys.meta.base-url | Базовый адрес upstream этой группы или провайдера. | If empty, the default Codex API URL will be used. | Пустое значение использует https://api.meta.ai/v1. Адрес принадлежит группе. |
| api-keys.openai-compatibility.base-url | Базовый адрес upstream этой группы или провайдера. | empty string | При упорядочивании запись с пустым базовым адресом удаляется и не участвует в маршрутизации. |
| api-keys.vertex.base-url | Базовый адрес upstream этой группы или провайдера. | empty string | При пропуске используется Google Vertex. Если значение уже содержит /publishers/, оно считается полным префиксом ресурса, и добавляется только /{model}:{action}. Иначе при отсутствии вставляется /v1, затем добавляется /publishers/google/models. Уже имеющиеся /v1 или /v1beta1 не повторяются. |
| api-keys.xai.base-url | Базовый адрес upstream этой группы или провайдера. | If empty, the default Codex API URL will be used. | Если после удаления начальных и конечных пробелов он всё ещё пуст, SanitizeXAIKeys отбрасывает запись. Официальный адрес в исполнителе не применяется к удалённой конфигурации. Адрес принадлежит группе и не может быть записан на одном ключе. |

## 5. Типичные ошибки и границы

Если провайдер, не совместимый с OpenAI, записывает base-url внутри записи `keys`, загрузка не удаётся. Если base-url записи Codex или xAI после удаления пробелов по краям всё ещё пуст, вся запись отбрасывается при загрузке. Официальный адрес в исполнителе больше не применяется к этим удалённым конфигурациям. Пустой base-url провайдера, совместимого с OpenAI, тоже удаляется при упорядочивании и не участвует в маршрутизации. Значение Vertex, содержащее `/publishers/`, считается полным префиксом ресурса.

## 6. Связанные возможности

Ключ описан в разделе [Ключи upstream API](/ru/accounts/api-keys-api).

## 7. Практический опыт

- [Не добавляйте ещё одну косую черту после сегмента версии базового адреса](/ru/experience/accounts#exp-accounts-base-url-no-extra-slash)
- [Базовый адрес Claude не должен повторять /v1](/ru/experience/accounts#exp-accounts-claude-base-url-host-only)
- [Upstream responses записывается в ключ API Codex](/ru/experience/accounts#exp-accounts-codex-api-key-base-url)
- [Совместимому провайдеру нужны и базовый адрес, и псевдоним](/ru/experience/accounts#exp-accounts-compat-base-and-alias)
- [У пользовательского адреса Gemini две записи](/ru/experience/accounts#exp-accounts-gemini-custom-base-url)
- [Совместимому вызову Kimi нужен User-Agent](/ru/experience/accounts#exp-accounts-kimi-user-agent)
- [Базовый адрес, совместимый с OpenAI, включает сегмент версии](/ru/experience/accounts#exp-accounts-openai-base-url-v1)
- [Подключайте третью сторону через раздел, совместимый с OpenAI](/ru/experience/accounts#exp-accounts-openai-compatible-provider)
- [Смените учётные данные Vertex, которые upstream признал нарушающими правила](/ru/experience/accounts#exp-accounts-rotate-vertex-key)
- [При 403 xAI перейдите на ключ API](/ru/experience/accounts#exp-accounts-xai-api-key-fallback)
- [Клиент Codex вызывает маршрут responses](/ru/experience/api#exp-api-call-responses)
- [Совместимые учётные данные всегда вызывают дополнение чата](/ru/experience/api#exp-api-compat-always-chat)
- [DeepSeek требует, чтобы клиент снизил max token](/ru/experience/api#exp-api-deepseek-max-tokens)
- [Сторонний DeepSeek не заполняет поля мышления OpenAI](/ru/experience/api#exp-api-deepseek-no-openai-thinking)
- [Вызовы изображений записываются на базовую модель чата](/ru/experience/api#exp-api-image-base-model)
- [Upstream не Claude сообщает использование только в конце сообщения](/ru/experience/api#exp-api-messages-usage-at-end)
- [Фильтром payload уберите поля, которые отклоняет upstream](/ru/experience/routing#exp-routing-filter-rejected-fields)
- [Маркер keep-alive — не ответ JSON](/ru/experience/routing#exp-routing-keepalive-is-not-json)
- [Добавьте extra_body правилом переопределения](/ru/experience/routing#exp-routing-override-extra-body)
- [Переопределение payload всё ещё действует после суффикса мышления](/ru/experience/routing#exp-routing-override-is-final)
