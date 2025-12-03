# Zero-Cost Deployment: ClawCloud (Built-in Storage)

Some time ago, I published an article "Five: Docker Server Deployment". Many netizens reported that they did not have a VPS and hoped that I could provide a tutorial on deploying on a container cloud.

In fact, since `CLIProxyAPI` supports Docker deployment, it can naturally run seamlessly on the container cloud. However, if it is run directly on the container cloud, there will be the following two main problems:

- **Configuration file persistence**: For the configuration file required for program startup, the container cloud often solves it by mapping the configuration file content to a specific file. Although it can run, if you have modified the configuration file, once the container restarts, all changes will be lost. This loss of configuration is unacceptable to us.
- **Complex OAuth authentication**: For providers that require OAuth authentication, in the Docker environment of a VPS, we can forward the authentication callback results to the server through an SSH tunnel. However, a pure container cloud environment usually does not support SSH tunnels, and it needs to be completed by adding multiple ports and manually modifying the domain name during callback, which is a very tedious process.

Therefore, after `CLIProxyAPI` is updated to adapt to the deployment of the container cloud, this tutorial will guide you step by step on how to complete the deployment on the container cloud.

The container cloud platform used in this tutorial is [ClawCloud Run](https://run.claw.cloud/). Log in to the platform with a Github account that has been registered for more than 180 days to get a monthly recurring credit of $5. The `CLIProxyAPI` we deployed only consumes about $0.05 per day, which is more than enough. Other container cloud platforms are basically the same, please refer to this process for your own deployment.

After logging in to ClawCloud Run, we click **App Launchpad**

![](https://img.072899.xyz/2025/10/080dfe9fd2c214ff9e507bd4d2bd5caa.png)

Click **Create APP**

![](https://img.072899.xyz/2025/10/d44ca8835fac8cfc6b7a82a3ea4d95c9.png)

First, we fill in the basic information

- **Application Name**: Customizable, here fill in `cliproxyapi`
- **Image Name**: `eceasy/cli-proxy-api:latest`
- **Network**: Change the container port to `8317`, and open **Public Access** at the same time

![](https://img.072899.xyz/2025/10/1a4941e799911d181d658de450f6e5d7.png)

Scroll down the page, in the advanced settings, we need to fill in:

- **Command**: `/CLIProxyAPI/CLIProxyAPI --config /data/config.yaml`
- **Environment Variables**: `DEPLOY=cloud`
- **Local Storage**: `/data`

![](https://img.072899.xyz/2025/10/3370f4146f19e92087f188dac5184575.png)

See the figure below for how to fill in environment variables and storage

| ![](https://img.072899.xyz/2025/10/e854143ef56bd6a71a922cad921c08b2.png) | ![](https://img.072899.xyz/2025/10/d966536ab7dd785ffc36355fdb2536cc.png) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |

After confirming that all information is filled in correctly, click **Deploy Application** in the upper right corner, and the application will start to deploy

![](https://img.072899.xyz/2025/10/dc49813c993e84e68af74747332b247b.png)

Wait a moment, and the application can be deployed successfully. When the **Public Address** status becomes **Available**, the corresponding URL is the one we use to access `CLIProxyAPI`. Please save it for later use.

![](https://img.072899.xyz/2025/10/6502f6ce1d9a4f63c132966ae9c37064.png)

While waiting for the deployment, we can prepare the `config.yaml` configuration file first. The example used this time is as follows. Please note: `remote-management.secret-key` is the key for remote management, and `api-keys` is the key used by the AI client to connect to `CLIProxyAPI`. Be careful to distinguish them.

```yaml
port: 8317
remote-management:
  allow-remote: true
  secret-key: "ABCD-1234"
  disable-control-panel: false
auth-dir: "/data/auths"
debug: false
logging-to-file: false
usage-statistics-enabled: false
request-retry: 3
quota-exceeded:
   switch-project: true
   switch-preview-model: true
api-keys:
  - "EFGH-5678"
```

When the container status becomes **Active**

![](https://img.072899.xyz/2025/10/99cce03e91ceb4eca44b8a055d0b874a.png)

We click the button in the figure to open the previously added **Local Storage**

![](https://img.072899.xyz/2025/10/6ce689a58a74037594e31f5d8e587af7.png)

Click **Upload** in the upper right corner, select the `config.yaml` file you just prepared and upload it

![](https://img.072899.xyz/2025/10/d550a6d94c9a5f02852e2f12091ff2a0.png)

After the upload is complete, click **Restart** to restart the container

![](https://img.072899.xyz/2025/10/e4e4e077371cff0f77d097ccf9b07da6.png)

Wait a moment, after the container status becomes **Active** again, we can see that a new file has been generated in **Local Storage**

![](https://img.072899.xyz/2025/10/877144ceae6bdc3acc180f18e309c9ef.png)

At the same time, click the **Logs** tab, you can see the log information as shown in the figure below

![](https://img.072899.xyz/2025/10/5da47dbaaace9befc61d18ffcca5298a.png)

![](https://img.072899.xyz/2025/10/af2ed8594a0626ca24dcf3427ff2e103.png)

So far, `CLIProxyAPI` has successfully completed the entire deployment process.

------

**Use EasyCLI for remote OAuth authentication**

Next, we use another official project [EasyCLI](https://github.com/router-for-me/EasyCLI) to perform remote OAuth addition.

`EasyCLI` is a supporting project of `CLIProxyAPI`, which provides a graphical user interface (GUI) to manage `CLIProxyAPI`. Its biggest highlight is that it supports the complete OAuth authentication and authorization process (not just uploading authorization files, but also handling the entire authorization callback process), which is something that `CLIProxyAPI`'s own WebUI cannot do.

Please go to the [EasyCLI program release page](https://github.com/router-for-me/EasyCLI/releases) to download the version suitable for your operating system (the author provides Mac, Linux, and Windows versions). This tutorial takes the Windows x64 version as an example.

After opening the program, select **Remote** and enter the URL we recorded before

![](https://img.072899.xyz/2025/10/f1d6dce519e20cae93abaac261f4d269.png)

Enter the `remote-management.secret-key` set in `config.yaml` for the password (in this example, it is `ABCD-1234`)

Click **Authentication Files** -> **New** in order

![](https://img.072899.xyz/2025/10/00cbb95dfeab2b8047b8270292fbe2cc.png)

This time we will still use adding Gemini CLI as an example for demonstration. For preparations, please refer to "Two: Gemini CLI + Codex Hands-on"

Enter **Project ID**, click **Confirm**

![](https://img.072899.xyz/2025/10/994a104817d51e39f811ad190d6190d5.png)

The OAuth link will appear on the page, click **Open Link**

![](https://img.072899.xyz/2025/10/361f9b6568609e589c959ca572de8955.png)

The program will automatically open the browser and jump to the OAuth link, and `EasyCLI` itself will enter the callback receiving state

![](https://img.072899.xyz/2025/10/a10dab06835d7bc5d15af8cc1ca607ed.png)

In the opened browser page, we log in to the account and complete the authorization and authentication process

![](https://img.072899.xyz/2025/10/d1dc0fe737eb8b0ce9f348f2f45871f1.png)

After completion, you can see the newly generated configuration file in the **Authentication Files** list

![](https://img.072899.xyz/2025/10/d713a77479b41f4035f1bf66b2e538f6.png)

**Verification**

Let's test it with Cherry Studio again. As shown in the figure, fill in the API key and API address according to the configuration file content

![](https://img.072899.xyz/2025/10/8021ac702f232ded423b186dbcb50a90.png)

Success!

![](https://img.072899.xyz/2025/10/5d0684f8cfecb1bc503f5189822911a3.png)

The rest of the functions of `EasyCLI` are left for you to explore. In fact, except for the OAuth authentication part, the other functions of `EasyCLI` are basically the same as the system's built-in WebUI. You can also perform other configuration management by visiting `https://your-CLIProxyAPI-access-link/management.html` (for an introduction to WebUI, please refer to this article "Six: The Beginner's Favorite GUI", although the introduction is also relatively short =.=)