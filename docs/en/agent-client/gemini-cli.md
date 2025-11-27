# Gemini CLI

Start CLIProxyAPI server, and choose one of the following configurations depending on your authentication method.

## Login with Google (OAuth)

Set the `CODE_ASSIST_ENDPOINT` environment variable to the URL of the CLI Proxy API server.

```bash
export CODE_ASSIST_ENDPOINT="http://127.0.0.1:8317"
```

The server will relay the `loadCodeAssist`, `onboardUser`, and `countTokens` requests. And automatically load balance the text generation requests between the multiple accounts.

> [!NOTE]  
> This feature only allows local access because there is currently no way to authenticate the requests.   
> 127.0.0.1 is hardcoded for load balancing.

## Use Gemini API Key

Configure the Gemini API base URL and API key:

```bash
export GOOGLE_GEMINI_BASE_URL="http://127.0.0.1:8317"
export GEMINI_API_KEY="sk-dummy"
```

> [!NOTE]  
> Unlike OAuth mode, this mode allows CLIProxyAPI to be configured as any IP address or domain.
