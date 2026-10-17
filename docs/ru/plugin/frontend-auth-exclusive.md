---
title: Исключительный режим фронтенд-аутентификации
feature_ids: []
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: true
translation_pending: false
---

# Исключительный режим фронтенд-аутентификации

`FrontendAuthProviderExclusive` — это логическое значение регистрации, а не отдельный метод интерфейса, поэтому у этой страницы нет ID возможности.

Оно появляется вместе с `frontend_auth_provider` в `capabilities` вызова `plugin.register`. Ключ JSON — `frontend_auth_provider_exclusive`. По описанию `sdk/pluginapi.Capabilities`, когда оно true и выбран этот провайдер фронтенд-аутентификации, он становится единственным действующим провайдером аутентификации запроса. Методы по-прежнему `Identifier` и `Authenticate` из раздела [Провайдер фронтенд-аутентификации](/ru/plugin/frontend-auth-provider).
