# Thinking Budgets via Model Name Suffixes

You can append suffixes to the model name to control thinking budgets and whether thoughts are returned. The proxy strips the suffix before routing upstream and writes the derived settings into the request payload.

## Supported Suffixes

- `-thinking-<number>`: set an explicit thinking budget (provider-native tokens). The value is clamped to the model’s supported range.
- `-thinking-<level>`: use a preset level (still clamped to the model range):

| Level     | Approx. Budget | Purpose                 |
|-----------|----------------|-------------------------|
| `minimal` | 512            | Lowest cost reasoning   |
| `low`     | 1024           | Fast reasoning          |
| `medium`  | 8192           | Default reasoning depth |
| `high`    | 24576          | Deep reasoning          |
| `xhigh`   | 32768          | Extra-deep reasoning    |
| `auto`    | Dynamic (-1)   | Let the provider decide |
| `none`    | 0              | Disable thinking        |

- `-thinking`: alias for `-thinking-medium`.
- `-reasoning`: sets a dynamic budget (`-1`) and forces `include_thoughts=true`.
- `-nothinking`: disables thinking (`0`) and sets `include_thoughts=false`.

> Suffixes are case-insensitive. With `provider://model` forms (e.g., `openrouter://gemini-3-pro-preview-thinking-high`), place the suffix on the model part.

## How It’s Applied

- Works only for models that advertise thinking support; unsupported models simply have the suffix removed without injecting thinking fields.
- Budgets are clamped using registry metadata: values below `min` bump to `min`, values above `max` drop to `max`; `-1` is only accepted when `DynamicAllowed` is true, and `0` is only allowed when `ZeroAllowed` is true.
- Gemini standard/CLI payloads receive `generationConfig.thinkingConfig.thinkingBudget` and `include_thoughts`; suffix values override any same-path fields in the request body.
- OpenAI/Codex/Qwen/iFlow/OpenRouter paths fill reasoning strength when missing: Chat Completions inject `reasoning_effort`, Responses inject `reasoning.effort`. Existing fields are left untouched.
- Models with built-in default thinking (e.g., `gemini-3-pro-preview`) still auto-enable thinking when none is provided; adding a suffix overrides the default.

## Examples

- Dynamic thinking with thoughts included:

```bash
curl -X POST http://localhost:8317/v1beta/models/gemini-2.5-flash-reasoning:generateContent \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "contents": [ { "parts": [ { "text": "Summarize the key points" } ] } ] }'
# The proxy calls upstream models/gemini-2.5-flash with thinkingBudget=-1 and include_thoughts=true.
```

- Explicit budget and no thought output:

```bash
curl -X POST http://localhost:8317/v1/chat/completions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gemini-3-pro-preview-thinking-12000-nothinking",
        "messages": [{ "role": "user", "content": "List three improvements" }]
      }'
# The proxy normalizes the model to gemini-3-pro-preview, writes a clamped thinkingBudget=12000,
# injects include_thoughts=false, and fills reasoning_effort if it was missing.
```

- Level shortcuts:

```bash
# Medium thinking (≈8192):
model=gemini-3-pro-preview-thinking

# Minimal thinking (512):
model=gemini-3-pro-preview-thinking-minimal

# Disable thinking:
model=gemini-3-pro-preview-nothinking
```
