# 叁：NanoBanana实战

目标是用目录里已经登记的图像模型，经本代理完成一次图像或 Gemini 生成。本页不新增模型名，也不收集 Cookie。

## 场景

你希望客户端通过 CLIProxyAPI 调用图像能力。当前程序没有 Gemini Web Cookie 登录参数。不要执行不存在的登录命令，也不要把浏览器 Cookie 贴进配置。

## 步骤

1. 在[模型目录](/cn/introduction/models)确认要调用的 ID 来自当前目录。本页不把 NanoBanana 定义成某个固定 ID。
2. 给客户端准备密钥。见[客户端密钥](/cn/api/access)。请求里使用 `YOUR_API_KEY`。
3. 走 OpenAI 兼容的图像生成或编辑时，只按[图像、语音与视频](/cn/api/media)里的路由和允许的模型名调用。
4. 走 Gemini `generateContent` 时，只按 [Gemini](/cn/api/gemini) 的路径调用。示例主机使用 `https://example.invalid`，不要在本页另写端点表。
5. 上游是 Gemini API 密钥时，密钥见[上游 API 密钥](/cn/accounts/api-keys-api)，地址见[上游基础地址](/cn/accounts/api-keys-base)。别名见[上游模型别名](/cn/accounts/api-keys-models)。
6. 模型需要思考档位时，只改[模型思考能力](/cn/configuration/thinking-models)。
7. 同一模型有多份凭证时，选择顺序见[路由策略](/cn/routing/strategy)，失败后的暂时跳过见[冷却](/cn/routing/cooldown)。

## 不要在本页完成的事

不在这里保存浏览器 Cookie，不写第三方客户端的界面步骤，也不重复图像路由的请求体字段。
