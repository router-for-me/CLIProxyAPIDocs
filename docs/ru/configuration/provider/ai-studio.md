---
title: Аутентификация WebSocket AI Studio
feature_ids:
  - oauth.providers.aistudio-ws-auth
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Аутентификация WebSocket AI Studio

## 1. Какую задачу решает этот раздел

Решает, требует ли API WebSocket аутентификацию.

## 2. Когда применимо и чего здесь нет

Сторонние приложения AI Studio здесь больше не описываются. Сохраняется только ws-auth из закреплённого кода.

## 3. Как настроить или вызвать

```yaml
oauth:
  providers:
    aistudio:
      ws-auth: true
```

Старый файл всё ещё может записать `ws-auth` в корне. Пример сопоставляет этот переключатель с `/v1/ws`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| oauth.providers.aistudio.ws-auth | oauth.providers.aistudio.ws-auth | false | oauth.providers.aistudio.ws-auth |

## 5. Типичные ошибки и границы

Загрузчик задаёт это значение true до разбора YAML, поэтому пропуск означает, что аутентификация включена. Выключает только явный false. Текст по умолчанию в таблице — это false из реестра. Это нулевое значение поля, а не результат загрузки.

## 6. Связанные возможности

Вход и псевдонимы описаны в разделе [Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth).

## 7. Практический опыт

- [Изображения отправляйте через AI Studio](/ru/experience/accounts#exp-accounts-aistudio-for-images)
- [Страница HTTPS использует wss](/ru/experience/accounts#exp-accounts-aistudio-wss)
- [Изображения Gemini и структурированный вывод идут нативным маршрутом](/ru/experience/api#exp-api-gemini-native-route)
