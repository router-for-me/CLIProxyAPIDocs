---
title: "Three: NanoBanana Hands-on"
translation_pending: false
---

# Three: NanoBanana Hands-on

The goal is to complete one image or Gemini generation through this proxy, using an image model that is already registered in the catalog. This page does not add model names and does not collect cookies.

## Scenario

You want a client to call image capability through CLIProxyAPI. The current program has no Gemini Web cookie login flag. Do not run a login command that does not exist, and do not paste a browser cookie into the configuration.

## Steps

1. In [Model catalogs](/introduction/models), confirm that the ID you will call comes from the current catalog. This page does not define NanoBanana as a fixed ID.
2. Prepare a key for the client. See [Client API keys](/api/access). Use `YOUR_API_KEY` in the request.
3. For OpenAI-compatible image generation or editing, call only the routes and allowed model names in [Images, speech, and video](/api/media).
4. For Gemini `generateContent`, call only the path in [Gemini](/api/gemini). The sample host is `https://example.invalid`. Do not write another endpoint table on this page.
5. When the upstream is a Gemini API key, the key is in [Upstream API keys](/accounts/api-keys-api) and the address is in [Upstream base URLs](/accounts/api-keys-base). Aliases are in [Upstream model aliases](/accounts/api-keys-models).
6. When the model needs a thinking level, change only [Model thinking](/configuration/thinking-models).
7. When the same model has multiple credentials, the selection order is in [Routing strategy](/routing/strategy). Temporary skipping after a failure is in [Cooldown](/routing/cooldown).

## What not to finish on this page

Do not save a browser cookie here, do not write UI steps for a third-party client, and do not repeat the request-body fields of the image routes.
