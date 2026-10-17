---
title: "Zero-Cost Deployment (AIStudio Reverse Proxy)"
translation_pending: false
---

# Zero-Cost Deployment (AIStudio Reverse Proxy)

Configure only the AI Studio WebSocket authentication that exists in the current program, then call the registered Gemini routes. Do not deploy a third-party cookie reverse proxy on this page.

## Scenario

The old tutorial asked you to put a browser cookie into an external site. The feature page already states that third-party AI Studio applications are no longer described. This page therefore no longer keeps those steps.

## Steps

1. Whether WebSocket authentication is required is changed only in [AI Studio WebSocket authentication](/configuration/provider/ai-studio). The difference between omitting it and turning it off explicitly follows that page.
2. When the client calls this proxy, use `YOUR_API_KEY` from [Client API keys](/api/access).
3. The Gemini model list and generation calls are in [Gemini](/api/gemini).
4. Do not treat a Codex realtime session as AI Studio. The realtime route is in [Realtime sessions](/api/realtime).
5. If the upstream is a Gemini API key, the key and address are in [Upstream API keys](/accounts/api-keys-api) and [Upstream base URLs](/accounts/api-keys-base).
6. The model ID must come from [Model catalogs](/introduction/models). Do not register a new name on this page.

## What not to finish on this page

Do not collect or paste cookies, and do not give deployment steps for an external website.
