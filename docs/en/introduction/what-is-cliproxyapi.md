---
outline: deep
---

# What is CLIProxyAPI?

**CLIProxyAPI** is a proxy server that provides OpenAI/Gemini/Claude/Codex/Grok compatible API interfaces for CLI.

You can use local or multi-account CLI access with OpenAI(include Responses)/Gemini/Claude-compatible clients and SDKs.

## Features

- OpenAI/Gemini/Claude/Grok compatible API endpoints for CLI models
- Gemini CLI support via OAuth login
- Antigravity support via OAuth login
- OpenAI Codex support (GPT models) via OAuth login
- Claude Code support via OAuth login
- Grok Build support via OAuth login
- Streaming and non-streaming responses
- Function calling/tools support
- Multimodal input support (text and images)
- Multiple accounts with round-robin load balancing (Gemini, OpenAI, Claude and Grok)
- Simple CLI authentication flows (Gemini, OpenAI, Claude and Grok)
- Generative Language API Key support
- Gemini CLI multi-account load balancing
- Antigravity multi-account load balancing
- Claude Code multi-account load balancing
- OpenAI Codex multi-account load balancing
- Grok Build multi-account load balancing
- OpenAI-compatible upstream providers via config (e.g., OpenRouter)

## Supported Models

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
- Gemini models auto-switch to preview variants when needed
