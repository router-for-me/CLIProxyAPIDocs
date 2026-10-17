# 肆：中转转发接入篇

把一个 OpenAI 兼容中转，或 Claude、Codex 的上游 API，接到本代理后面，再用客户端密钥调用本代理。

## 场景

你已经有中转服务的基础地址和上游密钥。文档中的地址写成 `https://example.invalid`，上游密钥和客户端密钥都写成 `YOUR_API_KEY`。不要把服务商控制台里的真实密钥写进仓库。

## 步骤

1. 先区分两种密钥。客户端调用本代理，见[客户端密钥](/cn/api/access)。发给上游的密钥，见[上游 API 密钥](/cn/accounts/api-keys-api)。
2. 基础地址属于整组，不属于单把密钥。见[上游基础地址](/cn/accounts/api-keys-base)。OpenAI 兼容提供商没有内置官方地址，必须按该页填写。
3. 给 OpenAI 兼容上游一个名称。见[OpenAI 兼容提供商名称](/cn/accounts/api-keys-name)。
4. 需要把客户端看到的模型名映射到中转的模型名时，见[上游模型别名](/cn/accounts/api-keys-models)。只暴露一部分模型时，见[模型名前缀](/cn/accounts/api-keys-prefix)和[按密钥排除模型](/cn/accounts/api-keys-excluded)。
5. 多把密钥要分优先级或权重时，见[凭证优先级](/cn/accounts/api-keys-priority)和[凭证权重](/cn/accounts/api-keys-weight)。某一把密钥单独走代理时，见[按密钥代理](/cn/accounts/api-keys-proxy)。
6. 停用整组、附加请求头、重试和单密钥冷却不要在本页展开。分别见[停用 OpenAI 兼容提供商](/cn/accounts/api-keys-disabled)、[上游额外请求头](/cn/accounts/api-keys-headers)、[重试与请求级错误](/cn/accounts/api-keys-request)、[冷却与 Codex 伪装开关](/cn/accounts/api-keys-disable)。
7. Claude 若还要改上游行为，见[Claude 上游行为](/cn/accounts/upstream)，不要和 API 密钥页混写。
8. 配置写完后，用客户端密钥调用已登记路由。对话补全见 [OpenAI Chat](/cn/api/openai-chat)，Responses 见 [Responses](/cn/api/responses)，Claude 见 [Claude Messages](/cn/api/claude-messages)。
9. 多个上游同时可用时的选择顺序见[路由策略](/cn/routing/strategy)。
10. 智能体只改自己的提供方地址和本代理的客户端密钥。见 [Codex](/cn/agent-client/codex)、[Claude Code](/cn/agent-client/claude-code)、[OpenCode](/cn/agent-client/opencode)、[Factory Droid](/cn/agent-client/droid)、[PI](/cn/agent-client/pi)、[Grok Build](/cn/agent-client/grok-build)。

## 不要在本页完成的事

不粘贴某一家中转的真实地址、截图或完整配置。字段形状以步骤里的功能页为准。
