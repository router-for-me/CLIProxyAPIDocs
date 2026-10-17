---
title: Охлаждение и переключатель маскировки Codex
feature_ids:
  - api-keys.claude.disable-cooling
  - api-keys.codex.disable-codex-cloaking
  - api-keys.codex.disable-cooling
  - api-keys.gemini.disable-cooling
  - api-keys.interactions.disable-cooling
  - api-keys.meta.disable-codex-cloaking
  - api-keys.meta.disable-cooling
  - api-keys.openai-compatibility.disable-cooling
  - api-keys.vertex.disable-cooling
  - api-keys.xai.disable-codex-cloaking
  - api-keys.xai.disable-cooling
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Охлаждение и переключатель маскировки Codex

## 1. Какую задачу решает этот раздел

Здесь описано, как одни учётные данные перекрывают глобальное охлаждение и как ключ в форме Codex перекрывает маскировку Codex.

## 2. Когда применимо и чего здесь нет

Глобальное охлаждение на этой странице не описано. Глобальная маскировка Codex — в параметрах провайдера Codex. Переключатель охлаждения провайдера, совместимого с OpenAI, действует на всего провайдера, а не на один ключ.

## 3. Как настроить или вызвать

```yaml
api-keys:
  claude:
    - name: claude-1
      disable-cooling: false
      keys:
        - api-key: "YOUR_API_KEY"
          disable-cooling: false
  codex:
    - name: codex-1
      keys:
        - api-key: "YOUR_API_KEY"
          disable-codex-cloaking: false
```

Можно записать и значение группы, и значение ключа. Непустое значение на ключе перекрывает группу.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.claude.disable-cooling | Перекрывать ли глобальную политику охлаждения. | nil | При пропуске наследуется глобальное охлаждение. true выключает охлаждение аутентификации и модели для этих учётных данных. false явно включает его. |
| api-keys.codex.disable-codex-cloaking | Прекращать ли принудительные официальные заголовки личности Codex. | nil | При пропуске наследуется upstream.codex.disable-codex-cloaking. true выключает маскировку. false явно включает её. |
| api-keys.codex.disable-cooling | Перекрывать ли глобальную политику охлаждения. | nil | При пропуске наследуется глобальное охлаждение. true выключает охлаждение аутентификации и модели для этих учётных данных. false явно включает его. |
| api-keys.gemini.disable-cooling | Перекрывать ли глобальную политику охлаждения. | nil | При пропуске наследуется глобальное охлаждение. true выключает охлаждение аутентификации и модели для этих учётных данных. false явно включает его. |
| api-keys.interactions.disable-cooling | Перекрывать ли глобальную политику охлаждения. | nil | При пропуске наследуется глобальное охлаждение. true выключает охлаждение аутентификации и модели для этих учётных данных. false явно включает его. |
| api-keys.meta.disable-codex-cloaking | Прекращать ли принудительные официальные заголовки личности Codex. | nil | При пропуске наследуется upstream.codex.disable-codex-cloaking. true выключает маскировку. false явно включает её. |
| api-keys.meta.disable-cooling | Перекрывать ли глобальную политику охлаждения. | nil | При пропуске наследуется глобальное охлаждение. true выключает охлаждение аутентификации и модели для этих учётных данных. false явно включает его. |
| api-keys.openai-compatibility.disable-cooling | Перекрывать ли глобальную политику охлаждения. | nil | При пропуске наследуется глобальное охлаждение. true выключает охлаждение аутентификации и модели для этих учётных данных. false явно включает его. |
| api-keys.vertex.disable-cooling | Перекрывать ли глобальную политику охлаждения. | nil | При пропуске наследуется глобальное охлаждение. true выключает охлаждение аутентификации и модели для этих учётных данных. false явно включает его. |
| api-keys.xai.disable-codex-cloaking | Прекращать ли принудительные официальные заголовки личности Codex. | nil | При пропуске наследуется upstream.codex.disable-codex-cloaking. true выключает маскировку. false явно включает её. |
| api-keys.xai.disable-cooling | Перекрывать ли глобальную политику охлаждения. | nil | При пропуске наследуется глобальное охлаждение. true выключает охлаждение аутентификации и модели для этих учётных данных. false явно включает его. |

## 5. Типичные ошибки и границы

Эти поля не отклоняют конфигурацию из-за true или false. Только пропуск означает наследование.

## 6. Связанные возможности

Глобальная маскировка Codex описана в разделе [Параметры провайдера Codex](/ru/configuration/provider/codex).

## 7. Практический опыт

Пока нет.

