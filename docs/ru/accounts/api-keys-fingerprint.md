---
title: Отпечаток Claude
feature_ids:
  - api-keys.claude.fingerprint-profile
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Отпечаток Claude

## 1. Какую задачу решает этот раздел

Решает, использует ли один ключ API Claude на запросах Messages собственный отпечаток вызывающего или отпечаток Claude Code CLI.

## 2. Когда применимо и чего здесь нет

Он не превращает ключ API в токен OAuth и не включает обновление или семантику отмены OAuth. count_tokens по-прежнему сохраняет нативную форму модели, сообщений и инструментов.

## 3. Как настроить или вызвать

```yaml
api-keys:
  claude:
    - name: cli-compatible-gateway
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
          fingerprint-profile: "claude-code-cli"
```

Пропуск или пустая строка сохраняют отпечаток вызывающего. `oauth-cli` — старое написание `claude-code-cli`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.claude.fingerprint-profile | Отпечаток запроса, который использует этот ключ API Claude. | Empty/default keeps the caller request fingerprint and headers, including first-party api.anthropic.com API keys. | api-keys.claude.fingerprint-profile |

## 5. Типичные ошибки и границы

Другая строка не приводит к ошибке обычной загрузки конфигурации. Во время запроса она считается пустым отпечатком. Запись через API управления отклоняет нераспознанное значение. Ошибка содержит `unsupported fingerprint-profile`. CCH отправляется только на api.anthropic.com и Vertex. Другой шлюз не несёт cch, даже если выбран отпечаток CLI.

## 6. Связанные возможности

Маскировка описана в разделе [Маскировка запросов Claude](/ru/accounts/api-keys-cloak). Глобальная базовая линия отпечатка — в разделе [Поведение Claude upstream](/ru/accounts/upstream).

## 7. Практический опыт

Пока нет.
