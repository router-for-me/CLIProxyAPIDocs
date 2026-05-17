---
outline: deep
---

# Что такое CLIProxyAPI?

**CLIProxyAPI** — это прокси-сервер, предоставляющий совместимые с OpenAI/Gemini/Claude/Codex/Grok интерфейсы API для CLI.

Вы можете использовать локальный или многоаккаунтный доступ через CLI с клиентами и SDK, совместимыми с OpenAI (включая Responses)/Gemini/Claude.

## Возможности

- Совместимые с OpenAI/Gemini/Claude/Grok эндпоинты API для моделей CLI
- Поддержка Gemini CLI через вход по OAuth
- Поддержка Antigravity через вход по OAuth
- Поддержка OpenAI Codex (модели GPT) через вход по OAuth
- Поддержка Claude Code через вход по OAuth
- Поддержка Grok Build через вход по OAuth
- Потоковые (Streaming) и непотоковые ответы
- Поддержка вызова функций (Function calling) и инструментов (tools)
- Поддержка мультимодального ввода (текст и изображения)
- Использование нескольких аккаунтов с балансировкой нагрузки round-robin (Gemini, OpenAI, Claude и Grok)
- Простые процессы аутентификации CLI (Gemini, OpenAI, Claude и Grok)
- Поддержка Generative Language API Key
- Балансировка нагрузки между несколькими аккаунтами Gemini CLI
- Балансировка нагрузки между несколькими аккаунтами Antigravity
- Балансировка нагрузки между несколькими аккаунтами Claude Code
- Балансировка нагрузки между несколькими аккаунтами OpenAI Codex
- Балансировка нагрузки между несколькими аккаунтами Grok Build
- OpenAI-совместимые upstream-провайдеры через конфигурацию (например, OpenRouter)

## Поддерживаемые модели

- gemini-3-pro-preview
- gemini-3-pro-image-preview
- gemini-2.5-pro
- gemini-2.5-flash
- gemini-2.5-flash-lite
- gemini-2.5-flash-image
- gemini-2.5-flash-image-preview
- gemini-pro-latest
- gemini-flash-latest
- gemini-flash-lite-latest
- gpt-5
- gpt-5-codex
- claude-opus-4-1-20250805
- claude-opus-4-20250514
- claude-sonnet-4-20250514
- claude-sonnet-4-5-20250929
- claude-haiku-4-5-20251001
- claude-3-7-sonnet-20250219
- claude-3-5-haiku-20241022
- deepseek-v3.2
- deepseek-v3.1
- deepseek-r1
- deepseek-v3
- kimi-k2
- glm-4.6
- tstars2.0
- Модели Gemini автоматически переключаются на preview-варианты при необходимости
