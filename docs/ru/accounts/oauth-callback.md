---
title: Обратные вызовы OAuth
feature_ids:
  - route.anthropic.get-callback
  - route.antigravity.get-callback
  - route.callback.get
  - route.codex.get-callback
  - route.devin.get-callback
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Обратные вызовы OAuth

## 1. Какую задачу решает этот раздел

Основная служба может принять обратный вызов уже начатого сеанса OAuth и передать кратковременные code и state ожидающему входу.

## 2. Когда применимо и чего здесь нет

Эти маршруты не проверяют клиентский ключ API. Порт, который сама слушает локальная команда входа, — другой путь. Эта страница применяется только когда обратный вызов попадает в основную службу.

## 3. Как настроить или вызвать

Когда браузер перенаправляется на работающий прокси, используйте пути ниже. Параметры запроса — `code`, `state`, а также `error` или `error_description`.

```text
GET /anthropic/callback
GET /codex/callback
GET /antigravity/callback
GET /callback
GET /devin/callback
```

Адрес использует корень вашего прокси, например `https://example.invalid/anthropic/callback`. Anthropic, Codex и Antigravity записывают результат в соответствующий ожидающий сеанс в каталоге учётных данных, когда `state` непустой. Два пути Devin используют один обработчик.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| GET /anthropic/callback | Обратный вызов OAuth на порту основной службы. |  | Когда state непустой, он записывается в ожидающий сеанс anthropic. Всегда возвращает HTTP 200 HTML. |
| GET /antigravity/callback | Обратный вызов OAuth на порту основной службы. |  | Когда state непустой, он записывается в ожидающий сеанс antigravity. Всегда возвращает HTTP 200 HTML. |
| GET /callback | Обратный вызов OAuth на порту основной службы. |  | Если нет и code, и error, ответ — 400 code or error is required. Неудачная запись возвращает 400 invalid or expired OAuth callback. |
| GET /codex/callback | Обратный вызов OAuth на порту основной службы. |  | Когда state непустой, он записывается в ожидающий сеанс codex. Всегда возвращает HTTP 200 HTML. |
| GET /devin/callback | Обратный вызов OAuth на порту основной службы. |  | Использует тот же обработчик, что GET /callback. |

## 5. Типичные ошибки и границы

Первые три возвращают HTTP 200 и HTML даже без state. Devin возвращает 400, когда отсутствуют и `code`, и `error`. Тело — `{"error":"code or error is required"}`. Недействительный или истёкший сеанс возвращает 400. Тело — `{"error":"invalid or expired OAuth callback"}`. Ответ Devin несёт `Cache-Control: no-store`.

## 6. Связанные возможности

Начало входа описано в разделах [Вход Claude](/ru/accounts/claude), [Вход Codex](/ru/accounts/codex), [Вход Antigravity](/ru/accounts/antigravity) и [Вход Devin](/ru/accounts/devin).

## 7. Практический опыт

Пока нет.
