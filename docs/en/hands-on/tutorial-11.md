# Zero-Cost Deployment (AIStudio Reverse Proxy)

> **Please note:** The deployment solution in this tutorial needs to be used with `CLIProxyAPI`. Before you begin, please ensure you have a running instance of `CLIProxyAPI`.

Starting from v6.3.x, CLIProxyAPI supports connecting to AI Providers via WebSocket, with AIStudio being the first one supported.

However, this method requires a browser to be always open to run the WebSocket communication program on AIStudioBuild, which can be inconvenient. If you choose to deploy it on a VPS, you will face the issue of high memory requirements for the VPS.

To solve this problem, I spent some time trying various headless browser solutions. Ultimately, I chose to use Docker for deployment on HuggingFace, which takes full advantage of the large memory of HuggingFace's free instances to achieve zero-cost deployment.

### Step 1: Configure the AIStudioBuild Application

You need to configure the WebSocket communication program on AIStudioBuild according to your `CLIProxyAPI` settings: Open the official [sample program](https://aistudio.google.com/apps/drive/1CPW7FpWGsDZzkaYgYOyXQ_6FWgxieLmL), copy it, and then you **must** modify the two places marked in the red box in the image. Specifically, if `wsauth` is set to `true` in `CLIProxyAPI`, you need to set `JWT_TOKEN` to the `api-keys` value intended for authentication in `CLIProxyAPI`. Set `WEBSOCKET_PROXY_URL` to the address of your `CLIProxyAPI`, for example: `wss://mycap.example.com/v1/ws`. After configuring, save it and keep the link to this application for later use.

![](https://img.072899.xyz/2025/11/359a2572d0206c20dba7fe12a136d6e8.png)

When using multiple accounts, you need to perform an additional step: set the application's access permission to `Public`.

![](https://img.072899.xyz/2025/11/69c6395d1a98c38c68bc6c8dd46b3014.png)

**Security Warning:** After setting it to `Public`, please keep your link safe. **Do not** share this link publicly to avoid leaking authorization information.

### Step 2: Prepare AIStudio Cookie

For this step, it is recommended to use your browser's private mode. Log in to https://aistudio.google.com/ and copy the Cookie from the browser's developer tools. The specific location is shown in the image below:

![](https://img.072899.xyz/2025/11/51f860bf363cab01aa4c3fd5181b7f72.png)

### Step 3 (1): Deploy HuggingFace Space

Open https://huggingface.co/spaces/hkfires/AIStudioBuildWS and duplicate the Space. Fill in the `CAMOUFOX_INSTANCE_URL` field with the link to the program you prepared in Step 1, and fill in the `USER_COOKIE_1` field with the Cookie you prepared in Step 2. Then, click "Duplicate Space".

![](https://img.072899.xyz/2025/11/04e84ce3b0f2abe7ae9e717ac8b5aa0b.png)

Wait for HuggingFace to complete the build. When you see logs like the following, the deployment is successful:

![](https://img.072899.xyz/2025/11/e818f38cfb272c1fc10ca97c2ef23c6b.png)

If you have multiple accounts, refer to `USER_COOKIE_1` and add environment variables like `USER_COOKIE_2`, `USER_COOKIE_3`, etc., in the HuggingFace Space settings.

**Important Reminder:** Cookies are sensitive information. Please **be sure to use "Secrets"** (not "Variables") to store them to prevent leakage.

### Step 3 (2): Server Docker Deployment

If you have your own server (VPS), you can also use Docker Compose for deployment.

1.  **Download the Code**
    ```bash
    git clone https://github.com/hkfires/AIStudioBuildWS.git
    cd AIStudioBuildWS
    ```

2.  **Configure Environment Variables**
    Copy `.env.example` to `.env` and fill in the necessary information (`CAMOUFOX_INSTANCE_URL` and `USER_COOKIE_1`, etc.).
    
    You can also place Cookie files in JSON format (any filename) in the `cookies` directory, and the program will automatically read them.
    ```bash
    cp .env.example .env
    nano .env
    ```

3.  **Start the Service**
    ```bash
    docker compose up -d --build
    ```

After a successful deployment, you should see logs similar to the following in `CLIProxyAPI`. At this point, the entire deployment is complete.

![](https://img.072899.xyz/2025/11/e0db39f81a3bbb956cbe9364e656a76f.png)

### Others

Of course, if you don't want to use HuggingFace, the project also supports local deployment: https://github.com/hkfires/AIStudioBuildWS/

### Reference Project

https://github.com/cliouo/aistudio-build-proxy-all