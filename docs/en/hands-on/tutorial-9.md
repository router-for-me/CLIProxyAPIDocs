# Zero-Cost Deployment: Railway (Object Storage)

Following the first two articles in the "No VPS?" series, I have tried some other container clouds. Coinciding with the addition of S3 bucket support to the CLIProxyAPI program, this article will introduce a new combination: using the Railway container service and deploying with a ClawCloud S3 bucket.

Before you start, please make sure you have accounts for [ClawCloud](https://run.claw.cloud/) and [Railway](https://railway.com/).

### 1. Create a ClawCloud bucket

After logging in to ClawCloud, click to enter **Object Storage**

![](https://img.072899.xyz/2025/10/8350104852042e43ba4c3dad25fd0004.png)

Next, click **Create bucket**

![](https://img.072899.xyz/2025/10/9f5953f5a406a21d2ff914cfa01638c9.png)

Enter a custom bucket name (the name must be in lowercase), and then click **Create** in the upper right corner

![](https://img.072899.xyz/2025/10/39db7fd3e8ca4a57c46191be889e0f15.png)

At this point, the bucket has been created. Next, we need to record the following 4 key parameters: the full name of the bucket (shown in the red box in the figure), Access Key, Secret Key, and External address

![](https://img.072899.xyz/2025/10/ef6c22c9cc50eee9152e4c95454786dd.png)

![](https://img.072899.xyz/2025/10/a3931df797a65db7afecf18cb66e66ce.png)

These 4 parameters will be used to set environment variables respectively. In addition, we also need to set an additional `MANAGEMENT_PASSWORD` (the password for logging in to the WebUI). Please organize this information in the following format and save it properly:

```
OBJECTSTORE_ENDPOINT=External value
OBJECTSTORE_ACCESS_KEY=Access Key value
OBJECTSTORE_SECRET_KEY=Secret Key value
OBJECTSTORE_BUCKET=Full bucket name
MANAGEMENT_PASSWORD=Password to access WebUI
```

### 2. Manual deployment on Railway

In the Railway project dashboard, click **Create**, and select **Docker image**

![](https://img.072899.xyz/2025/10/f9dfb05a9991e5a228fa18629168588c.png)

Enter `eceasy/cli-proxy-api:latest` and press Enter. After a while, a new container will appear in the workspace

![](https://img.072899.xyz/2025/10/dec39863e684dd39f63acd1ebbe401e9.png)

Click this newly created container, and select **Variables** -> **Raw Editor** in the right panel

![](https://img.072899.xyz/2025/10/d3d5d5b5144d2016ff4d8ddf8953a819.png)

Paste the environment variables we prepared earlier, and then click **Update Variables**

![](https://img.072899.xyz/2025/10/accaf8ea92a57371cf1d1994be59cd9f.png)

Click the **Deploy** button to start deployment

![](https://img.072899.xyz/2025/10/6889a73eb138f8e1dca7ab0fb4b79b21.png)

After waiting for the deployment to complete (the "Deployment successful" prompt appears), click to enter the **Settings** tab

![](https://img.072899.xyz/2025/10/a1059beca1671b505b4909c36ae51f68.png)

In the **Public Networking** section, click **Generate Domain**

![](https://img.072899.xyz/2025/10/e3d3efbcc34db844c81ee1eefda48e22.png)

Set the port number to `8317`, and then click **Generate Domain**

![](https://img.072899.xyz/2025/10/6ddb5ee7884c2c239b02edca10ca2668.png)

At this time, Railway will generate a public access address for you. You can access the WebUI interface of CLIProxyAPI through this address. If you can open the web page, the deployment is successful.

![](https://img.072899.xyz/2025/10/d216af36328e62147889108799278561.png)

### 3. Railway template deployment

In addition, Railway also supports one-click deployment through templates. You can directly click the button below to start (note: this link contains AFF)

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/0uGPyR?referralCode=JC4tEx&utm_medium=integration&utm_source=template&utm_campaign=generic)

If you use template deployment, please note that you need to confirm whether the service port is `8317` after the deployment is complete. If not, you need to modify it manually. The specific modification steps are as follows:

![](https://img.072899.xyz/2025/10/e741f1f62e4726a16e75b1264ad4438e.png)

![](https://img.072899.xyz/2025/10/ba2c7d7bac37b3bcdd3aebb220c6fb0b.png)

![](https://img.072899.xyz/2025/10/39b49aea18026f80834bf0ee22d405a3.png)

So far, all deployment processes have been completed. For subsequent usage, you can refer to the **"Use EasyCLI for remote OAuth authentication"** section in the "Zero-Cost Deployment (ClawCloud)" tutorial.

**Additional note**: In addition to ClawCloud, any object storage service compatible with the S3 API (such as Cloudflare R2) can theoretically be used as an alternative.