---
outline: deep
---

# What is CLIProxyAPI?

**CLIProxyAPI** is a proxy server that provides OpenAI/Gemini/Claude/Codex compatible API interfaces for CLI.

You can use local or multi-account CLI access with OpenAI(include Responses)/Gemini/Claude-compatible clients and SDKs.

## Features

- OpenAI/Gemini/Claude compatible API endpoints for CLI models
- OpenAI Codex support (GPT models) via OAuth login
- Claude Code support via OAuth login
- Qwen Code support via OAuth login
- iFlow support via OAuth login
- Streaming and non-streaming responses
- Function calling/tools support
- Multimodal input support (text and images)
- Multiple accounts with round-robin load balancing (Gemini, OpenAI, Claude, Qwen and iFlow)
- Simple CLI authentication flows (Gemini, OpenAI, Claude, Qwen and iFlow)
- Generative Language API Key support
- Gemini CLI multi-account load balancing
- Claude Code multi-account load balancing
- Qwen Code multi-account load balancing
- iFlow multi-account load balancing
- OpenAI Codex multi-account load balancing
- OpenAI-compatible upstream providers via config (e.g., OpenRouter)

## Supported Models

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
- qwen3-coder-plus
- qwen3-coder-flash
- qwen3-max
- qwen3-vl-plus
- deepseek-v3.2
- deepseek-v3.1
- deepseek-r1
- deepseek-v3
- kimi-k2
- glm-4.6
- tstars2.0
- And other iFlow-supported models
- Gemini models auto-switch to preview variants when needed
