---
outline: 'deep'
---

# Model Provider Capability

The model provider capability provides static models and dynamically discovers models for a specific credential record. It is a better fit than a model registrar for OAuth, file credentials, or plugins that need to access upstream model lists.

## Capability Field

```json
{
  "capabilities": {
    "model_provider": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `ModelProvider`, `StaticModelRequest`, `AuthModelRequest`, `ModelResponse`
- `sdk/pluginabi/types.go`: `model.static`, `model.for_auth`
- `internal/pluginhost/adapters.go`: `RegisterModels`, `ModelsForAuth`

Example references:

- `examples/plugin/model/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodModelStatic`, `MethodModelForAuth`

## Methods

| Method | Purpose |
| --- | --- |
| `model.static` | Returns static model lists that do not depend on a specific credential. |
| `model.for_auth` | Returns model lists for a credential record and may also return credential updates. |

## Static Model Request

`model.static` receives `StaticModelRequest`:

```json
{
  "Plugin": {},
  "Host": {
    "AuthDir": "~/.cli-proxy-api",
    "ProxyURL": "",
    "ForceModelPrefix": false
  }
}
```

## Discovering Models By Credential

`model.for_auth` receives `AuthModelRequest`:

```json
{
  "AuthID": "auth-1",
  "AuthProvider": "plugin-example",
  "StorageJSON": "base64-json",
  "Metadata": {},
  "Attributes": {},
  "Host": {}
}
```

If the plugin needs to call an upstream model API, use the `host.http.*` bridge associated with the host HTTP client in the request so proxy settings, transport policy, and request logging remain managed by the host.

## Response

Both `model.static` and `model.for_auth` return `ModelResponse`:

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
  ],
  "AuthUpdate": {}
}
```

`AuthUpdate` can update credential data during model discovery, such as account information, project ID, or the next refresh time returned by upstream.

## Relationship With Executors

If the plugin also declares the [executor capability](./executor), `executor_model_scope` controls the registration path for the model provider:

- `static`: only registers static models.
- `oauth`: only handles models discovered by credential.
- `both` or an empty value: supports both model types.

## Development Notes

- `model.for_auth` should only handle credential providers it recognizes.
- If `Provider` is empty, the host tries to use the provider of the current credential.
- Returning an error from dynamic discovery makes the host treat discovery for that credential as handled but failed.

