# 思考量设置（模型名称后缀）

CLIProxyAPI 支持在模型名称上追加后缀来控制思考预算与思考输出开关。代理会剥离后缀后再路由到上游，并将解析到的配置写入请求体。

## 后缀速查

- `-thinking-<数字>`：显式指定思考预算（单位为提供商原生 token），会按照模型的支持区间自动夹紧。
- `-thinking-<等级>`：使用预设等级，等级映射如下（仍会按模型区间夹紧）：

| 等级        | 约等于预算  | 说明      |
|-----------|--------|---------|
| `minimal` | 512    | 低成本推理   |
| `low`     | 1024   | 快速推理    |
| `medium`  | 8192   | 默认推理量   |
| `high`    | 24576  | 深度推理    |
| `xhigh`   | 32768  | 更高推理量   |
| `auto`    | 动态（-1） | 由上游自动分配 |
| `none`    | 0      | 关闭思考    |

- `-thinking`：等价于 `-thinking-medium`。
- `-reasoning`：设置动态思考（预算 `-1`）并强制 `include_thoughts=true`。
- `-nothinking`：关闭思考（预算 `0`，`include_thoughts=false`）。

> 后缀大小写不敏感；如果使用 `provider://model` 形式（如 `openrouter://gemini-3-pro-preview-thinking-high`），请将后缀放在模型名部分。

## 应用规则

- 仅对注册了思考能力的模型生效；若模型不支持思考，后缀会被移除但不会向上游写入思考字段。
- 预算会按模型注册信息夹紧：低于最小值会提升到最小值，高于最大值会降低到最大值；只有当模型标记 `DynamicAllowed` 时才接受 `-1`，只有 `ZeroAllowed` 为真时才允许 0。
- Gemini 标准/CLI 请求会写入 `generationConfig.thinkingConfig.thinkingBudget` 与 `include_thoughts`，后缀指定的值会覆盖请求体中的同名字段。
- OpenAI/Codex/Qwen/iFlow/OpenRouter 路径会在未设置时补全推理强度：Chat Completions 填充 `reasoning_effort`，Responses 路径填充 `reasoning.effort`；如果请求已显式提供这些字段则不会覆盖。
- 若模型默认自带思考（例如 `gemini-3-pro-preview`），在未显式提供思考配置时仍会按默认启用；添加后缀可覆盖默认行为。

## 使用示例

- 动态思考并输出思考过程：

```bash
curl -X POST http://localhost:8317/v1beta/models/gemini-2.5-flash-reasoning:generateContent \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "contents": [ { "parts": [ { "text": "帮我总结要点" } ] } ] }'
# 代理会请求上游模型 models/gemini-2.5-flash，写入 thinkingBudget=-1、include_thoughts=true
```

- 设定具体思考预算并禁止思考输出：

```bash
curl -X POST http://localhost:8317/v1/chat/completions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gemini-3-pro-preview-thinking-12000-nothinking",
        "messages": [{ "role": "user", "content": "列出三个改进点" }]
      }'
# 代理会将模型名归一为 gemini-3-pro-preview，并把 thinkingBudget=12000（夹紧后）写入请求，
# 同时注入 include_thoughts=false，若未设置 reasoning_effort 则填充对应等级。
```

- 使用等级快捷方式：

```bash
# 中等思考量（约 8192）：
model=gemini-3-pro-preview-thinking

# 极低思考量（512）：
model=gemini-3-pro-preview-thinking-minimal

# 关闭思考：
model=gemini-3-pro-preview-nothinking
```
