# 零成本部署AIStudio反代

只配置当前程序里的 AI Studio WebSocket 认证，然后按已登记的 Gemini 路由调用。不要在本页部署第三方 Cookie 反代。

## 场景

旧教程要求把浏览器 Cookie 放进外部站点。功能页已经写明不再介绍第三方 AI Studio 应用。本页因此不再保留那些步骤。

## 步骤

1. 是否要求 WebSocket 认证，只改 [AI Studio WebSocket 认证](/cn/configuration/provider/ai-studio)。省略和显式关闭的差别以该页为准。
2. 客户端调用本代理时使用[客户端密钥](/cn/api/access)中的 `YOUR_API_KEY`。
3. Gemini 的模型列表和生成调用见 [Gemini](/cn/api/gemini)。
4. 不要把 Codex 的实时会话当成 AI Studio。实时路由见[实时会话](/cn/api/realtime)。
5. 若上游是 Gemini API 密钥，密钥和地址见[上游 API 密钥](/cn/accounts/api-keys-api)与[上游基础地址](/cn/accounts/api-keys-base)。
6. 模型 ID 必须来自[模型目录](/cn/introduction/models)，不要在本页登记新名字。

## 不要在本页完成的事

不收集、不粘贴 Cookie，不给出外部网站的部署步骤。
