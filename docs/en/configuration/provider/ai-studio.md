# AI Studio Instructions

You can use this service as a backend for [this AI Studio App](https://aistudio.google.com/apps/drive/1CPW7FpWGsDZzkaYgYOyXQ_6FWgxieLmL). Follow the steps below to configure it:

1.  **Start the CLIProxyAPI Service**: Ensure your CLIProxyAPI instance is running, either locally or remotely.
2.  **Access the AI Studio App**: Log in to your Google account in your browser, then open the following link:
    - [https://aistudio.google.com/apps/drive/1CPW7FpWGsDZzkaYgYOyXQ_6FWgxieLmL](https://aistudio.google.com/apps/drive/1CPW7FpWGsDZzkaYgYOyXQ_6FWgxieLmL)
  
**Note**: If you are using the Brave browser, you may need to disable its shields feature as it can block the WebSocket connection. This issue can also occur with other ad-blockers.

## Connection Configuration

By default, the AI Studio App attempts to connect to a local CLIProxyAPI instance at `ws://127.0.0.1:8317`.

-   **Connecting to a Remote Service**:
    If you need to connect to a remotely deployed CLIProxyAPI, modify the `config.ts` file in the AI Studio App to update the `WEBSOCKET_PROXY_URL` value.
    -   Use the `wss://` protocol if your remote service has SSL enabled.
    -   Use the `ws://` protocol if SSL is not enabled.

## Authentication Configuration

By default, WebSocket connections to CLIProxyAPI do not require authentication.

-   **Enable Authentication on the CLIProxyAPI Server**:
    In your `config.yaml` file, set `ws_auth` to `true`.
-   **Configure Authentication on the AI Studio Client**:
    In the `config.ts` file of the AI Studio App, set the `JWT_TOKEN` value to your authentication token.
