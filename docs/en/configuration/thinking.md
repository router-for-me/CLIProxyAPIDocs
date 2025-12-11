# Thinking Budgets via Model Name Parentheses

Append `(value)` to the model name to control the thinking budget or reasoning effort. The proxy strips the parentheses before routing and applies the derived settings to the request.

## Accepted Values

- `(number)`: explicit thinking budget (provider-native tokens); clamped to the model’s supported range.
- `(level)`: preset reasoning effort (case-insensitive):

| Level     | Approx. Budget                             | Purpose                 |
|-----------|--------------------------------------------|-------------------------|
| `minimal` | 512                                        | Lowest cost reasoning   |
| `low`     | 1024                                       | Fast reasoning          |
| `medium`  | 8192                                       | Default reasoning depth |
| `high`    | 24576                                      | Deep reasoning          |
| `xhigh`   | 32768                                      | Extra-deep reasoning    |
| `auto`    | Dynamic (-1 when allowed, else mid/min)    | Let the provider choose |
| `none`    | 0 (clamped to min when zero is disallowed) | Disable thinking        |

- Empty `()` is ignored. For `provider://model` forms, place the parentheses after the model (e.g., `openrouter://gemini-3-pro-preview(high)`).

## How It’s Applied

- Only models that advertise thinking keep these settings; unsupported models simply drop the suffix without injecting thinking fields.
- Gemini (standard & CLI): writes `generationConfig.thinkingConfig.thinkingBudget` (or `request.generationConfig.thinkingConfig...` for CLI) after clamping. `include_thoughts` is left unchanged. Models with default thinking (e.g., `gemini-3-pro-preview`) still auto-enable thinking when missing; the parentheses budget overrides the default.
- Claude API: when a budget/level is provided, sets `thinking.type=enabled` with normalized `thinking.budget_tokens` and bumps `max_tokens` if needed.
- OpenAI/Codex/Qwen/iFlow/OpenRouter: reasoning levels/`auto`/`none` overwrite `reasoning_effort` (chat) or `reasoning.effort` (Responses). Numeric budgets do not change reasoning_effort for these protocols.
- Level-based models enforce their supported effort levels; unsupported values return HTTP 400.

## Examples

- Dynamic budget with Gemini:

```bash
curl -X POST http://localhost:8317/v1/chat/completions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gemini-3-pro-preview(auto)",
        "messages": [{ "role": "user", "content": "Summarize the key points" }]
      }'
# Normalizes to gemini-3-pro-preview and sets thinkingBudget=-1 (clamped if dynamic is not allowed); include_thoughts stays unchanged.
```

- High reasoning effort for Responses:

```bash
curl -X POST http://localhost:8317/v1/responses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gpt-5.1(high)",
        "input": "List three improvements"
      }'
# Routes as gpt-5.1 and overwrites reasoning.effort="high".
```

- Disable thinking (clamped when zero is not allowed):

```bash
model=claude-sonnet-4.5(none)
# Sets thinking.budget_tokens to 0 when allowed; otherwise clamps to the model minimum.
```
