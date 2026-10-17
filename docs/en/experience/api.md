---
title: "API access"
related_feature_ids:
  - access.api-keys.value
  - api-keys.claude.models-thinking-levels
  - api-keys.codex.base-url
  - api-keys.gemini.models-thinking-levels
  - api-keys.openai-compatibility.base-url
  - api-keys.openai-compatibility.models-name
  - api-keys.openai-compatibility.models-thinking-levels
  - cli.server.antigravity-login
  - cli.server.claude-login
  - cli.server.codex-login
  - cli.server.config
  - cli.server.kimi-login
  - mode.docker.compose
  - models.codex-catalog.value
  - multimedia.disable-image-generation.value
  - multimedia.gpt-image-2-base-model.value
  - oauth.auth-dir.value
  - oauth.providers.aistudio-ws-auth
  - observability.logs.request-log
  - requests.payload.override-params
  - route.v1.get-models
  - route.v1.post-chat-completions
  - route.v1.post-images-generations
  - route.v1.post-messages
  - route.v1.post-messages-count-tokens
  - route.v1.post-responses
  - route.v1.post-responses-compact
  - route.v1beta.post-models-action
source_issues:
  - 13
  - 22
  - 37
  - 73
  - 158
  - 181
  - 203
  - 228
  - 269
  - 308
  - 313
  - 335
  - 391
  - 573
  - 599
  - 637
  - 712
  - 740
  - 741
  - 751
  - 978
  - 1009
  - 1012
  - 1083
  - 1173
  - 1199
  - 1240
  - 1365
  - 1401
  - 1468
  - 1476
  - 1540
  - 1692
  - 1700
  - 1913
  - 1918
  - 1961
  - 2406
  - 2459
  - 2714
  - 2753
  - 2764
  - 2986
  - 3006
  - 3012
  - 3352
  - 3365
  - 3376
  - 3443
  - 3531
  - 3628
  - 3697
  - 3738
  - 3814
  - 3816
  - 3907
  - 4092
  - 4169
  - 4172
  - 4440
  - 4594
  - 4783
  - 4933
  - 4937
  - 4963
  - 4969
  - 4987
  - 5021
  - 5028
  - 5253
  - 5301
  - 5624
  - 5647
  - 5656
  - 5711
  - 6396
  - 6623
  - 6663
  - 6674
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# API access

## Scope and limits

The practices on this page are checked only against configuration, routes, or commands that still exist in pinned commit `911f49cbd49f4fe2516979754a7488a3fd14fe64`. This page is not an official behavior promise. Keys, cookies, email addresses, authorization files, and user request bodies were not copied in.

## Short practices

- <a id="exp-api-require-client-key"></a>**Send a client key when calling a public route** (`exp.api.require-client-key`). Symptom: The client receives Missing API key or Invalid API key, or /v1 does not check identity at all. Action: Configure the client key in access.api-keys and send one of those keys in the request. Do not send the upstream key. When the list is empty, public routes do not check a client key. Claude Code uses the proxy root path as its base URL. A Codex account also runs --codex-login. Source issues: [#13](https://github.com/router-for-me/CLIProxyAPI/issues/13)、[#22](https://github.com/router-for-me/CLIProxyAPI/issues/22)、[#37](https://github.com/router-for-me/CLIProxyAPI/issues/37)、[#181](https://github.com/router-for-me/CLIProxyAPI/issues/181)、[#228](https://github.com/router-for-me/CLIProxyAPI/issues/228)、[#573](https://github.com/router-for-me/CLIProxyAPI/issues/573)、[#637](https://github.com/router-for-me/CLIProxyAPI/issues/637)、[#2406](https://github.com/router-for-me/CLIProxyAPI/issues/2406)、[#2459](https://github.com/router-for-me/CLIProxyAPI/issues/2459)、[#2714](https://github.com/router-for-me/CLIProxyAPI/issues/2714)、[#3006](https://github.com/router-for-me/CLIProxyAPI/issues/3006)、[#3443](https://github.com/router-for-me/CLIProxyAPI/issues/3443)、[#3628](https://github.com/router-for-me/CLIProxyAPI/issues/3628)。. Official pages: [Client API keys](/api/access)、[Claude login](/accounts/claude)、[Codex login](/accounts/codex)、[Command-line flags](/introduction/install)、[OAuth directory, aliases, and exclusions](/accounts/oauth)、[Logs and usage](/operations/observability)、[OpenAI Chat](/api/openai-chat)、[Claude Messages](/api/claude-messages)、[Responses](/api/responses).
- <a id="exp-api-replace-example-client-keys"></a>**Replace the example client keys** (`exp.api.replace-example-client-keys`). Symptom: A public service still uses a placeholder such as your-api-key-1 from the example configuration. Action: Replace those example values with your own access.api-keys and make the process read the changed configuration. Example safety mode rejects public access that still contains your-api-key-1, your-api-key-2, or your-api-key-3. Source issues: [#751](https://github.com/router-for-me/CLIProxyAPI/issues/751)、[#3376](https://github.com/router-for-me/CLIProxyAPI/issues/3376)、[#3814](https://github.com/router-for-me/CLIProxyAPI/issues/3814)、[#4963](https://github.com/router-for-me/CLIProxyAPI/issues/4963)、[#4987](https://github.com/router-for-me/CLIProxyAPI/issues/4987)。. Official pages: [Client API keys](/api/access)、[Run with Docker Compose](/docker/docker).
- <a id="exp-api-call-responses"></a>**A Codex client calls the responses route** (`exp.api.call-responses`). Symptom: The Codex client uses chat completions, or it requests /responses, which does not exist. Action: Call POST /v1/responses. Chat completions carry fields Codex does not accept. Codex quick chat is the client's own interface. The proxy only provides this route. Source issues: [#1401](https://github.com/router-for-me/CLIProxyAPI/issues/1401)、[#1692](https://github.com/router-for-me/CLIProxyAPI/issues/1692)、[#1913](https://github.com/router-for-me/CLIProxyAPI/issues/1913)、[#2764](https://github.com/router-for-me/CLIProxyAPI/issues/2764)、[#2986](https://github.com/router-for-me/CLIProxyAPI/issues/2986)、[#3697](https://github.com/router-for-me/CLIProxyAPI/issues/3697)、[#5711](https://github.com/router-for-me/CLIProxyAPI/issues/5711)。. Official pages: [Upstream base URLs](/accounts/api-keys-base)、[Codex login](/accounts/codex)、[Responses](/api/responses).
- <a id="exp-api-gemini-native-route"></a>**Gemini images and structured output use the native route** (`exp.api.gemini-native-route`). Symptom: Gemini images or structured output on the OpenAI-compatible path are empty, or an earlier turn is repeated. Action: Use generateContent on /v1beta instead. Structured output puts the response schema in that request body. Do not switch to POST /v1/images/generations. When the Gemini CLI image model is no longer available, use this route after AI Studio or Antigravity login. Source issues: [#203](https://github.com/router-for-me/CLIProxyAPI/issues/203)、[#313](https://github.com/router-for-me/CLIProxyAPI/issues/313)、[#335](https://github.com/router-for-me/CLIProxyAPI/issues/335)、[#1012](https://github.com/router-for-me/CLIProxyAPI/issues/1012)、[#1476](https://github.com/router-for-me/CLIProxyAPI/issues/1476)、[#1918](https://github.com/router-for-me/CLIProxyAPI/issues/1918)。. Official pages: [AI Studio WebSocket authentication](/configuration/provider/ai-studio)、[Gemini](/api/gemini).
- <a id="exp-api-gemini-audio-chat"></a>**Gemini audio uses chat completions** (`exp.api.gemini-audio-chat`). Symptom: The client needs to hand Gemini audio to this proxy. Action: Call POST /v1/chat/completions and put the audio in a file content part. Source issues: [#73](https://github.com/router-for-me/CLIProxyAPI/issues/73)。. Official pages: [OpenAI Chat](/api/openai-chat).
- <a id="exp-api-copilot-chat-sampling"></a>**Omit top_p when Copilot uses /v1** (`exp.api.copilot-chat-sampling`). Symptom: Copilot's OpenAI-compatible client needs to reach Gemini. Action: Point the client at /v1. Use 0 for temperature, and do not send top_p at the same time. Source issues: [#158](https://github.com/router-for-me/CLIProxyAPI/issues/158)。. Official pages: [OpenAI Chat](/api/openai-chat).
- <a id="exp-api-gemini-thinking-field"></a>**Forward AI Studio thinking by the upstream field** (`exp.api.gemini-thinking-field`). Symptom: AI Studio thinking does not take effect the way the client expected. Action: On generateContent at /v1beta, forward the caller's thinking settings. The field must be the one upstream accepts. Source issues: [#269](https://github.com/router-for-me/CLIProxyAPI/issues/269)。. Official pages: [Model thinking](/configuration/thinking-models)、[Gemini](/api/gemini).
- <a id="exp-api-chat-reasoning-effort"></a>**Chat completions stream thinking only when reasoning effort is sent** (`exp.api.chat-reasoning-effort`). Symptom: Gemini thinking text does not appear in the chat-completions stream. Action: The request must include reasoning effort before thinking text is streamed with chat completions. Source issues: [#308](https://github.com/router-for-me/CLIProxyAPI/issues/308)。. Official pages: [Model thinking](/configuration/thinking-models)、[OpenAI Chat](/api/openai-chat).
- <a id="exp-api-use-listed-model-id"></a>**The client uses a model id from the catalog** (`exp.api.use-listed-model-id`). Symptom: The client still requests an old preview name, or guesses an id that is not in the catalog. Action: From a client that already points at this proxy, call an id that still exists in the catalog, for example gemini-3-pro-preview. Do not keep using an old Antigravity id that has already been replaced. Source issues: [#391](https://github.com/router-for-me/CLIProxyAPI/issues/391)、[#3365](https://github.com/router-for-me/CLIProxyAPI/issues/3365)。. Official pages: [Antigravity login](/accounts/antigravity)、[OpenAI Chat](/api/openai-chat).
- <a id="exp-api-deepseek-max-tokens"></a>**DeepSeek needs the client to lower max tokens** (`exp.api.deepseek-max-tokens`). Symptom: Claude Code fails when it calls DeepSeek through the OpenAI-compatible section. Action: Lower the client's max token value into the range that upstream accepts. The same openai-compatibility configuration works inside that range. Source issues: [#599](https://github.com/router-for-me/CLIProxyAPI/issues/599)。. Official pages: [Upstream base URLs](/accounts/api-keys-base)、[Claude Messages](/api/claude-messages).
- <a id="exp-api-count-tokens-tool-shape"></a>**The count endpoint counts tools the upstream way** (`exp.api.count-tokens-tool-shape`). Symptom: Claude Code /context shows very few tool tokens, or it compacts too early. Action: This is how Google count-tokens counts. A tool may be counted as one token. The call uses the existing count route. The proxy is not shrinking the context. Source issues: [#712](https://github.com/router-for-me/CLIProxyAPI/issues/712)、[#741](https://github.com/router-for-me/CLIProxyAPI/issues/741)。. Official pages: [Antigravity login](/accounts/antigravity)、[Claude Messages](/api/claude-messages).
- <a id="exp-api-claude-code-messages"></a>**Claude Code must call messages** (`exp.api.claude-code-messages`). Symptom: Claude Code's token status stays at zero. Action: The client must call /v1/messages. When it points at chat completions, Claude Code does not count by the messages protocol. Source issues: [#740](https://github.com/router-for-me/CLIProxyAPI/issues/740)。. Official pages: [Claude Messages](/api/claude-messages).
- <a id="exp-api-antigravity-image-chat"></a>**Antigravity images use chat completions** (`exp.api.antigravity-image-chat`). Symptom: The model list for a Gemini CLI credential has no image model. Action: Image calls use the credential from --antigravity-login and go through the chat-completions route. Source issues: [#978](https://github.com/router-for-me/CLIProxyAPI/issues/978)。. Official pages: [Antigravity login](/accounts/antigravity)、[OpenAI Chat](/api/openai-chat).
- <a id="exp-api-tool-call-ids"></a>**A tool round trip must carry the id** (`exp.api.tool-call-ids`). Symptom: A gemini-claude tool turn fails on the next call. Action: Both functionCall and functionResponse must carry the same id. Source issues: [#1009](https://github.com/router-for-me/CLIProxyAPI/issues/1009)。. Official pages: [Claude Messages](/api/claude-messages).
- <a id="exp-api-gemini-for-images"></a>**Image models use the Gemini protocol** (`exp.api.gemini-for-images`). Symptom: There is no chat image output on the responses path. Action: Call image models with the Gemini protocol. Do not expect responses to have an official mapping. Source issues: [#1083](https://github.com/router-for-me/CLIProxyAPI/issues/1083)。. Official pages: [Responses](/api/responses)、[Gemini](/api/gemini).
- <a id="exp-api-antigravity-claude-messages"></a>**Antigravity Claude uses messages** (`exp.api.antigravity-claude-messages`). Symptom: The OpenAI-compatible route dropped Antigravity Claude tool calls. Action: Have OpenCode call the Anthropic messages route. The model name uses an id such as claude-opus-4-6-thinking, without a gemini- prefix. Do not mix the same conversation into a native Anthropic call, or the thinking budget will not apply. When no display mode is selected, an empty thinking block is the expected result. Source issues: [#1173](https://github.com/router-for-me/CLIProxyAPI/issues/1173)、[#1199](https://github.com/router-for-me/CLIProxyAPI/issues/1199)、[#1468](https://github.com/router-for-me/CLIProxyAPI/issues/1468)、[#5253](https://github.com/router-for-me/CLIProxyAPI/issues/5253)。. Official pages: [Antigravity login](/accounts/antigravity)、[Claude Messages](/api/claude-messages).
- <a id="exp-api-restart-after-auth-removal"></a>**Restart after deleting a credential before the model list updates** (`exp.api.restart-after-auth-removal`). Symptom: A credential already deleted from the directory still appears in GET /v1/models. Action: After deleting the file in auth-dir, restart the process. Only then does the model list drop it. Source issues: [#1240](https://github.com/router-for-me/CLIProxyAPI/issues/1240)。. Official pages: [OAuth directory, aliases, and exclusions](/accounts/oauth)、[OpenAI Chat](/api/openai-chat).
- <a id="exp-api-messages-usage-at-end"></a>**A non-Claude upstream reports usage only at the end of messages** (`exp.api.messages-usage-at-end`). Symptom: input_tokens in message_start of a messages stream is zero. Action: Only a Claude upstream fills input tokens in message_start. An OpenAI-compatible chat upstream has no initial usage object. Usage is given at the end. When upstream omits usage, history is also zero. Source issues: [#1365](https://github.com/router-for-me/CLIProxyAPI/issues/1365)、[#1700](https://github.com/router-for-me/CLIProxyAPI/issues/1700)、[#2753](https://github.com/router-for-me/CLIProxyAPI/issues/2753)。. Official pages: [Upstream base URLs](/accounts/api-keys-base)、[Logs and usage](/operations/observability)、[Claude Messages](/api/claude-messages).
- <a id="exp-api-opus-effort-field"></a>**Opus effort comes from output_config.effort** (`exp.api.opus-effort-field`). Symptom: You want a separate thinking model for Claude Opus 4.6. Action: The messages route already reads output_config.effort. Use that field instead of inventing another model id. Source issues: [#1540](https://github.com/router-for-me/CLIProxyAPI/issues/1540)。. Official pages: [Model thinking](/configuration/thinking-models)、[Claude Messages](/api/claude-messages).
- <a id="exp-api-avoid-chat-translation"></a>**Do not translate through chat completions when the client can speak the upstream protocol** (`exp.api.avoid-chat-translation`). Symptom: Chat completions use a lot of CPU. Action: Upgrade to the pinned version and have the client use the upstream's own protocol. Protocol translation costs more CPU than a direct connection. Source issues: [#1961](https://github.com/router-for-me/CLIProxyAPI/issues/1961)。. Official pages: [OpenAI Chat](/api/openai-chat).
- <a id="exp-api-image-base-model"></a>**Image calls are recorded on the base chat model** (`exp.api.image-base-model`). Symptom: gpt-image-2 usage is not recorded under the image model name. Action: Image generation is a tool on the base chat model. The record uses the configured base model. A transparent background is represented by the background field on the image route. The proxy does not translate portrait video sizes. Source issues: [#3012](https://github.com/router-for-me/CLIProxyAPI/issues/3012)、[#3907](https://github.com/router-for-me/CLIProxyAPI/issues/3907)、[#4937](https://github.com/router-for-me/CLIProxyAPI/issues/4937)。. Official pages: [Upstream base URLs](/accounts/api-keys-base)、[Images, speech, and video](/api/media).
- <a id="exp-api-responses-stream-shape"></a>**A responses stream does not use DONE as the end** (`exp.api.responses-stream-shape`). Symptom: The client waits for a DONE marker on responses, or it sees HTTP 200 before the first event. Action: The responses protocol does not send DONE. The stream may return 200 before the first event because the proxy does not wait for that interval. If another OpenAI stream carries DONE, it must be last. Later chunks are moved in front of it. Source issues: [#3352](https://github.com/router-for-me/CLIProxyAPI/issues/3352)、[#4594](https://github.com/router-for-me/CLIProxyAPI/issues/4594)、[#4783](https://github.com/router-for-me/CLIProxyAPI/issues/4783)。. Official pages: [Responses](/api/responses).
- <a id="exp-api-disable-image-tool-injection"></a>**Stop injecting the image tool** (`exp.api.disable-image-tool-injection`). Symptom: Mixed free and paid Codex credentials break prompt caching, or gpt-5.5 cannot be used. Action: Use multimedia.disable-image-generation to stop injecting image_generation. true also turns off the image route. To stop only the injection, use chat or passthrough as described on the feature page. Source issues: [#3531](https://github.com/router-for-me/CLIProxyAPI/issues/3531)、[#4172](https://github.com/router-for-me/CLIProxyAPI/issues/4172)、[#4440](https://github.com/router-for-me/CLIProxyAPI/issues/4440)。. Official pages: [Codex login](/accounts/codex)、[Model catalogs](/introduction/models)、[Images, speech, and video](/api/media)、[Responses](/api/responses).
- <a id="exp-api-deepseek-no-openai-thinking"></a>**A third-party DeepSeek does not fill OpenAI thinking fields** (`exp.api.deepseek-no-openai-thinking`). Symptom: OpenAI-style thinking fields do not appear in chat completions. Action: An OpenAI-compatible DeepSeek credential does not fill that field on behalf of the caller. Whether thinking is on follows that model entry. A chat-style override rule does not match reasoning.effort on responses. Source issues: [#3738](https://github.com/router-for-me/CLIProxyAPI/issues/3738)、[#4933](https://github.com/router-for-me/CLIProxyAPI/issues/4933)。. Official pages: [Upstream base URLs](/accounts/api-keys-base)、[Model thinking](/configuration/thinking-models)、[Override payload rules](/routing/requests-override)、[OpenAI Chat](/api/openai-chat).
- <a id="exp-api-compaction-needs-model"></a>**Compaction needs the upstream to provide the compaction model** (`exp.api.compaction-needs-model`). Symptom: Codex compaction fails. Action: The model used for compaction must be in the upstream catalog. Compaction cannot run when the OpenAI-compatible catalog does not have that model. Source issues: [#3816](https://github.com/router-for-me/CLIProxyAPI/issues/3816)。. Official pages: [Upstream model aliases](/accounts/api-keys-models)、[Responses](/api/responses).
- <a id="exp-api-responses-instructions"></a>**responses uses instructions instead of system** (`exp.api.responses-instructions`). Symptom: A system role in the request is rejected. Action: The responses protocol has no system role. Put the instructions in instructions. Explicit web search sources and namespaced custom tool calls are kept as they are. Source issues: [#4092](https://github.com/router-for-me/CLIProxyAPI/issues/4092)、[#5021](https://github.com/router-for-me/CLIProxyAPI/issues/5021)、[#6623](https://github.com/router-for-me/CLIProxyAPI/issues/6623)。. Official pages: [Codex login](/accounts/codex)、[Responses](/api/responses).
- <a id="exp-api-no-synthetic-reasoning"></a>**Do not expect the proxy to invent thinking text when the catalog does not return it** (`exp.api.no-synthetic-reasoning`). Symptom: Claude Code cannot see reasoning blocks for gpt-5.6. Action: When the model catalog does not provide thinking text, the proxy does not write any in just to display it. Gemini reasoning text is also forwarded as upstream sent it. Source issues: [#4169](https://github.com/router-for-me/CLIProxyAPI/issues/4169)、[#6663](https://github.com/router-for-me/CLIProxyAPI/issues/6663)。. Official pages: [Antigravity login](/accounts/antigravity)、[Codex login](/accounts/codex)、[Model catalogs](/introduction/models)、[OpenAI Chat](/api/openai-chat).
- <a id="exp-api-reasoning-summary-vs-effort"></a>**A reasoning summary appears only when the request asks for it** (`exp.api.reasoning-summary-vs-effort`). Symptom: responses does not carry a reasoning summary, but chat completions does. Action: responses includes reasoning only when the request asks for a summary. Chat completions infer it from reasoning effort. Source issues: [#4969](https://github.com/router-for-me/CLIProxyAPI/issues/4969)。. Official pages: [OpenAI Chat](/api/openai-chat)、[Responses](/api/responses).
- <a id="exp-api-chat-done-marker"></a>**A chat-completions stream ends with DONE** (`exp.api.chat-done-marker`). Symptom: The client treats a stream without DONE as closed early. Action: An OpenAI chat-completions stream must end with DONE. Without that marker it is treated as already closed. Source issues: [#5028](https://github.com/router-for-me/CLIProxyAPI/issues/5028)。. Official pages: [OpenAI Chat](/api/openai-chat).
- <a id="exp-api-drop-unsupported-claude-fields"></a>**Drop Claude fields Codex does not support before sending** (`exp.api.drop-unsupported-claude-fields`). Symptom: Claude fields make the Codex request fail. Action: Fields Codex does not accept, such as stop sequences, are removed so delivery can continue. Source issues: [#5301](https://github.com/router-for-me/CLIProxyAPI/issues/5301)。. Official pages: [Codex login](/accounts/codex)、[Claude Messages](/api/claude-messages).
- <a id="exp-api-chat-image-model"></a>**An image conversation model still uses chat completions** (`exp.api.chat-image-model`). Symptom: gemini-3.1-flash-image is sent to a separate image route. Action: Treat it as an ordinary chat image model and call chat completions, not another image route. Source issues: [#5624](https://github.com/router-for-me/CLIProxyAPI/issues/5624)。. Official pages: [OpenAI Chat](/api/openai-chat).
- <a id="exp-api-kimi-native-responses"></a>**Kimi responses keeps Kimi's own tools** (`exp.api.kimi-native-responses`). Symptom: Codex tool types are rewritten on Kimi responses. Action: responses after Kimi login is forwarded to Kimi's own endpoint. Codex-only tools and tool_search are not rewritten into another type. Source issues: [#5647](https://github.com/router-for-me/CLIProxyAPI/issues/5647)、[#5656](https://github.com/router-for-me/CLIProxyAPI/issues/5656)。. Official pages: [Kimi login](/accounts/kimi)、[Responses](/api/responses).
- <a id="exp-api-one-client-key-endpoint"></a>**Client keys share one proxy entry** (`exp.api.one-client-key-endpoint`). Symptom: You want to split the proxy into several entries by project. Action: The pinned version has no per-project entry. Keys in access.api-keys share the same set of public routes. Source issues: [#6396](https://github.com/router-for-me/CLIProxyAPI/issues/6396)。. Official pages: [Client API keys](/api/access).
- <a id="exp-api-compat-always-chat"></a>**A compatible credential always calls chat completions** (`exp.api.compat-always-chat`). Symptom: An OpenAI-compatible credential does not use responses. Action: This kind of credential always calls the upstream chat-completions endpoint. A responses upstream must be configured on the Codex API key instead. Source issues: [#6674](https://github.com/router-for-me/CLIProxyAPI/issues/6674)。. Official pages: [Upstream base URLs](/accounts/api-keys-base)、[OpenAI Chat](/api/openai-chat).

## Standalone pages

This area has no practice that needs its own page.

