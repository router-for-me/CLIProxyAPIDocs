# 零成本部署：Railway (对象存储)

继《没有VPS？》系列前两篇文章之后，我又尝试了一些容器云。恰逢 CLIProxyAPI 程序增加了对 S3 存储桶的支持，因此本文将介绍一种全新的组合：使用 Railway 容器服务并搭配 ClawCloud S3 存储桶进行部署。

在开始之前，请确保你已拥有 [ClawCloud](https://run.claw.cloud/) 和 [Railway](https://railway.com/) 的账号。

### 一、创建 ClawCloud 存储桶

登录 ClawCloud 后，点击进入 **Object Storage**

![](https://img.072899.xyz/2025/10/8350104852042e43ba4c3dad25fd0004.png)

接着，点击 **Create bucket**

![](https://img.072899.xyz/2025/10/9f5953f5a406a21d2ff914cfa01638c9.png)

输入一个自定义的存储桶名称（名称要求小写），然后点击右上角的 **Create**

![](https://img.072899.xyz/2025/10/39db7fd3e8ca4a57c46191be889e0f15.png)

至此，存储桶便已创建完成。接下来，我们需要记录以下 4 个关键参数：存储桶全名（图中红框所示）、Access Key、Secret Key 以及 External 地址

![](https://img.072899.xyz/2025/10/ef6c22c9cc50eee9152e4c95454786dd.png)

![](https://img.072899.xyz/2025/10/a3931df797a65db7afecf18cb66e66ce.png)

这 4 个参数将分别用于设置环境变量。此外，我们还需额外设定一个 `MANAGEMENT_PASSWORD`（用于登录 WebUI 的密码）。请将这些信息整理为以下格式并妥善保存：

```
OBJECTSTORE_ENDPOINT=External值
OBJECTSTORE_ACCESS_KEY=Access Key值
OBJECTSTORE_SECRET_KEY=Secret Key值
OBJECTSTORE_BUCKET=存储桶全称
MANAGEMENT_PASSWORD=访问WebUI的密码
```

### 二、Railway 手动部署

在 Railway 的项目仪表盘中，点击 **Create**，选择 **Docker image**

![](https://img.072899.xyz/2025/10/f9dfb05a9991e5a228fa18629168588c.png)

输入 `eceasy/cli-proxy-api:latest` 后按回车键。稍等片刻，工作区内便会出现一个新的容器

![](https://img.072899.xyz/2025/10/dec39863e684dd39f63acd1ebbe401e9.png)

点击这个新创建的容器，在右侧面板中选择 **Variables** -> **Raw Editor**

![](https://img.072899.xyz/2025/10/d3d5d5b5144d2016ff4d8ddf8953a819.png)

将我们先前准备好的环境变量粘贴进去，然后点击 **Update Variables**

![](https://img.072899.xyz/2025/10/accaf8ea92a57371cf1d1994be59cd9f.png)

点击 **Deploy** 按钮开始部署

![](https://img.072899.xyz/2025/10/6889a73eb138f8e1dca7ab0fb4b79b21.png)

等待部署完成（出现 "Deployment successful" 提示）后，点击进入 **Settings** 标签页

![](https://img.072899.xyz/2025/10/a1059beca1671b505b4909c36ae51f68.png)

在 **Public Networking** 部分，点击 **Generate Domain**

![](https://img.072899.xyz/2025/10/e3d3efbcc34db844c81ee1eefda48e22.png)

将端口号设置为 `8317`，然后点击 **Generate Domain**

![](https://img.072899.xyz/2025/10/6ddb5ee7884c2c239b02edca10ca2668.png)

此时，Railway 会为你生成一个公开访问地址，通过该地址即可访问 CLIProxyAPI 的 WebUI 界面了，能够打开网页，就算部署成功了

![](https://img.072899.xyz/2025/10/d216af36328e62147889108799278561.png)

### 三、Railway 模板部署

此外，Railway 也支持通过模板一键部署。你可以直接点击下方按钮开始（注：此链接包含AFF）

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/0uGPyR?referralCode=JC4tEx&utm_medium=integration&utm_source=template&utm_campaign=generic)

若使用模板部署，请注意，在部署完成后需要确认服务端口是否为 `8317`。不是的话需要自己手动修改，具体修改步骤如下图所示：

![](https://img.072899.xyz/2025/10/e741f1f62e4726a16e75b1264ad4438e.png)

![](https://img.072899.xyz/2025/10/ba2c7d7bac37b3bcdd3aebb220c6fb0b.png)

![](https://img.072899.xyz/2025/10/39b49aea18026f80834bf0ee22d405a3.png)

至此，全部部署流程均已完成。后续使用方法可参照《零成本部署（ClawCloud）》教程中的 **“使用 EasyCLI 进行远程 OAuth 认证”** 部分。

**补充说明**：除了 ClawCloud，任何兼容 S3 API 的对象存储服务（如 Cloudflare R2）理论上都可以作为替代方案。
