---
outline: 'deep'
---

# Model Registrar Capability

The model registrar capability registers static model metadata provided by a plugin into the CLIProxyAPI model registry. It is suitable for plugins with a fixed model set that do not need dynamic credential-based discovery.

## Capability Field

Declare this in the registration result of `plugin.register` or `plugin.reconfigure`:

```json
{
  "capabilities": {
    "model_registrar": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `ModelRegistrar`, `ModelRegistrationRequest`, `ModelRegistrationResponse`, `ModelInfo`
- `sdk/pluginabi/types.go`: `model.register`
- `internal/pluginhost/adapters.go`: `RegisterModels`, `callModelRegistrar`

Example reference:

- `examples/plugin/simple/go/main.go`: `MethodModelRegister`

## Call Timing

After the host loads or reconfigures a plugin, it calls `model.register` during the model registration phase. Returned models enter the model list and routing match flow.

If the same plugin also declares the [executor capability](./executor), these models are associated with that plugin executor. Without an executor, the host registers them as normal plugin-provided model clients.

## Request

The `model.register` request maps to `ModelRegistrationRequest`:

```json
{
  "Plugin": {
    "Name": "example",
    "Version": "0.1.0",
    "Author": "router-for-me"
  }
}
```

`Plugin` is the current plugin metadata and lets the plugin decide which models to return for its own version or configuration.

## Response

Return `ModelRegistrationResponse`:

```json
{
  "Provider": "plugin-example",
  "Models": [
    {
      "ID": "plugin-example-model",
      "Object": "model",
      "OwnedBy": "plugin-example",
      "DisplayName": "Plugin Example Model",
      "SupportedGenerationMethods": ["chat"],
      "ContextLength": 8192,
      "MaxCompletionTokens": 1024,
      "UserDefined": true
    }
  ]
}
```

Key points:

- `Provider` must be a stable provider identifier.
- `Models` must be the complete model set, not a delta.
- `ID` is the model name used by client requests.
- `Thinking` can declare the thinking range supported by the model for thinking configuration validation and later [Thinking applier capability](./thinking-applier).

## Development Notes

- Do not return an empty `Provider` or empty model ID; the host skips invalid models.
- A model registrar only handles static models. Use the [model provider capability](./model-provider) when models must be discovered dynamically per OAuth or file credential.
- If the model should only be handled by a plugin executor, also declare the executor capability and set an appropriate `executor_model_scope`.

