# Factory / Droid

Start CLIProxyAPI first, then edit `~/.factory/settings.json`.

Factory uses the OpenAI-compatible path for GPT and Codex-family models, so the base URL should point to your proxy's `/v1` endpoint.

This page applies to the current Droid / Factory harness configuration format:

- file: `~/.factory/settings.json`
- model list key: `customModels`
- OpenAI-compatible fields: `baseUrl`, `apiKey`, `provider`

## Minimal model entry

```json
{
  "customModels": [
    {
      "model": "gpt-5.4",
      "id": "custom:gpt-5.4",
      "index": 0,
      "baseUrl": "http://127.0.0.1:8317/v1",
      "apiKey": "sk-dummy",
      "displayName": "GPT 5.4",
      "maxOutputTokens": 128000,
      "noImageSupport": false,
      "provider": "openai"
    }
  ]
}
```

## Fast alias

If you want GPT-5.4 high fast mode through CLIProxyAPI, point Factory at the alias, not the canonical model.

Example:

```json
{
  "customModels": [
    {
      "model": "gpt-5.4-high-fast",
      "id": "custom:gpt-5.4-high-fast",
      "index": 0,
      "baseUrl": "http://127.0.0.1:8317/v1",
      "apiKey": "sk-dummy",
      "displayName": "GPT 5.4 High Fast",
      "maxOutputTokens": 128000,
      "noImageSupport": false,
      "provider": "openai"
    }
  ]
}
```

That alias must exist in CLIProxyAPI config. The usual setup is:

- `oauth-model-alias.codex`: map `gpt-5.4-high-fast` to `gpt-5.4`
- `payload.override`: inject `service_tier: "priority"`
- `payload.override`: inject `reasoning.effort: "high"`

Using `/v1` alone does not activate fast mode. The alias is the switch.

If you use a hosted CLIProxyAPI instance, confirm the alias is active by checking the authenticated `/v1/models` output. If `gpt-5.4-high-fast` is missing from the model list, the harness config is fine but the proxy has not loaded the alias yet.

## Defaults

If you want Factory to use the alias by default, point these settings at the custom model ID:

```json
{
  "sessionDefaultSettings": {
    "model": "custom:gpt-5.4-high-fast",
    "reasoningEffort": "none"
  },
  "missionOrchestratorModel": "custom:gpt-5.4-high-fast",
  "missionOrchestratorReasoningEffort": "none",
  "missionModelSettings": {
    "workerModel": "custom:gpt-5.4-high-fast",
    "workerReasoningEffort": "none",
    "validationWorkerModel": "custom:gpt-5.4-high-fast",
    "validationWorkerReasoningEffort": "none"
  }
}
```

Keep the Factory-side reasoning fields at `none` when the proxy alias already injects `reasoning.effort: "high"`. That avoids two layers trying to control the same request.

## Notes

- Use `provider: "openai"` for GPT/Codex-family models routed through CLIProxyAPI.
- Use `baseUrl: "http://127.0.0.1:8317/v1"` for the OpenAI-compatible path.
- If you need Anthropic-native models in the same file, those use a different provider and base URL shape.

## Troubleshooting

- `502` on `POST /v1/responses` for the alias while canonical `gpt-5.4` still works:
  the proxy usually has not loaded the alias config yet.
- Alias missing from `/v1/models`:
  the proxy config is not active on the running instance.
- Hot reload did not pick up a config change:
  if you replaced `config.yaml` by deleting it and writing a new file, restart the server. In-place edits are more reliable for config hot reload than remove-and-recreate workflows.
