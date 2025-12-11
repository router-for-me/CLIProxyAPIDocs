# 通过模型名括号设置思考量

在模型名称末尾追加 `(值)` 来控制思考预算或推理等级。代理会在路由前移除括号，并将解析结果写入请求。

## 可用取值

- `(数字)`：显式思考预算（提供商原生 token），按模型支持区间夹紧。
- `(等级)`：预设推理等级（不区分大小写）：

| 等级        | 约等于预算                | 说明      |
|-----------|----------------------|---------|
| `minimal` | 512                  | 低成本推理   |
| `low`     | 1024                 | 快速推理    |
| `medium`  | 8192                 | 默认推理深度  |
| `high`    | 24576                | 深度推理    |
| `xhigh`   | 32768                | 更深推理    |
| `auto`    | 动态（允许则为 -1，否则取中点/下限） | 由上游自动分配 |
| `none`    | 0（若不允许 0 则夹紧到最小值）    | 关闭思考    |

- 空括号 `()` 会被忽略。`provider://model` 形式请在模型名后加括号，例如 `openrouter://gemini-3-pro-preview(high)`。

## 应用规则

- 仅对声明支持思考的模型生效；不支持的模型只会移除括号，不注入思考字段。
- Gemini（标准与 CLI）：按夹紧后的值写入 `generationConfig.thinkingConfig.thinkingBudget`（或 `request.generationConfig.thinkingConfig...`），不会改动 `include_thoughts`。自带默认思考的模型（如 `gemini-3-pro-preview`）在缺省情况下仍会自动启用思考，括号中的预算会覆盖默认值。
- Claude API：提供预算/等级时会设置 `thinking.type=enabled` 并填入归一化后的 `thinking.budget_tokens`，必要时提升 `max_tokens`。
- OpenAI/Codex/Qwen/iFlow/OpenRouter：等级/`auto`/`none` 会覆盖 `reasoning_effort`（chat）或 `reasoning.effort`（Responses）；纯数字预算不会为这些协议改写 reasoning_effort。
- 使用离散等级的模型会校验等级，不支持的取值会返回 400。

## 使用示例

- 动态思考预算（Gemini）：

```bash
curl -X POST http://localhost:8317/v1/chat/completions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gemini-3-pro-preview(auto)",
        "messages": [{ "role": "user", "content": "帮我总结要点" }]
      }'
# 归一为 gemini-3-pro-preview，写入 thinkingBudget=-1（若不支持动态则按模型区间夹紧），不修改 include_thoughts。
```

- OpenAI Responses 高等级推理：

```bash
curl -X POST http://localhost:8317/v1/responses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gpt-5.1(high)",
        "input": "列出三个改进点"
      }'
# 路由为 gpt-5.1，并覆盖 reasoning.effort="high"。
```

- 关闭思考（若不允许 0 则会夹紧到最小值）：

```bash
model=claude-sonnet-4.5(none)
# 若模型允许则写入 thinking.budget_tokens=0，否则夹紧到模型最小值。
```
