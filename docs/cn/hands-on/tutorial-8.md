# 零成本部署：HuggingFace (数据库存储)

在《没有VPS？》系列的前几篇文章中，我们分别探讨了如何利用本地卷 (ClawCloud)、GitHub (Render) 及对象存储桶 (Railway) 为 CLIProxyAPI 实现配置与认证信息的持久化。本文将聚焦于如何通过 PostgreSQL 数据库达成同样的目标。此外，考虑到 HuggingFace 的容器部署机制与常规平台有所不同，且有朋友希望了解其部署流程，本文将一并进行详细说明。

本教程将以 Railway 提供的 PostgreSQL 服务为例，使用其他数据库提供商的流程也大同小异，大家可自行探索。

### 一、准备 PostgreSQL 数据库

首先，登录你的 Railway 账号，在工作空间中创建一个新实例，选择 **Database** -> **Add PostgreSQL**

![](https://img.072899.xyz/2025/10/dab21cb1671989f6781eed1eba03c985.png)

![](https://img.072899.xyz/2025/10/9580732f1e15d365db8a3dd07442b3fd.png)

等待实例创建完成后，点击进入数据库管理页面，点击 **Database** 选项卡下的 **Connect**

![](https://img.072899.xyz/2025/10/f177a3cc1cb30146d9b16475179fd5f0.png)

请复制并保存 **Public Network** 选项卡下的 **Connection URL**，后续步骤将会用到

![](https://img.072899.xyz/2025/10/107a359a8a490b18a325779432a71582.png)

### 二、在 HuggingFace 上部署

首先，请访问我预先建立好的 [CLIProxyAPI 项目模板](https://huggingface.co/spaces/hkfires/CLIProxyAPI)，然后如下图所示，点击下拉菜单中的 **Duplicate this Space** 来复制项目

![](https://img.072899.xyz/2025/10/0febf3a57ae4f8384dfff6d6e38614ce.png)

在配置页面中，请按以下说明操作：
* 修改 **Space name**（如果这是你的第一个项目，则无需修改）
* 将 **Visibility** 设置为 **Public**，以确保服务部署后能够远程访问
* 在 `MANAGEMENT_PASSWORD` 中填入你计划用于 WebUI 的管理密码
* 在 `PGSTORE_DSN` 中粘贴先前复制的数据库连接 URL

全部信息填写完毕后，点击 **Duplicate Space**

> **补充说明**：`MANAGEMENT_STATIC_PATH` 与 `PGSTORE_LOCAL_PATH` 这两个环境变量之所以需要设置为 `/tmp`，是因为 HuggingFace 的安全机制将容器的根目录设置为只读权限。通过这两个变量，我们可以将数据库缓存文件和管理页面静态资源的路径指向可写的 `/tmp` 目录，从而确保程序正常运行。

![](https://img.072899.xyz/2025/10/a4b88ee81e6eefd0721b301c9bc4f5e8.png)

稍等片刻，当你在日志中看到类似下方的信息时，即表示部署已顺利完成

![](https://img.072899.xyz/2025/10/98550ed355e70b9776498558bd6c599a.png)

此时，你便可以通过 `https://<你的HuggingFace用户名>-<项目名称>.hf.space/management.html` 访问 WebUI。例如，我的访问地址是 `https://hkfires-cliproxyapi.hf.space/management.html`。输入你先前在环境变量中设定的管理密码即可成功登录

![](https://img.072899.xyz/2025/10/e8fa8144c51bfc6125a8cb218cf528dd.png)

至此，整个部署流程便已完成。关于后续的使用方法，你可以参考《零成本部署（ClawCloud）》教程中的 **“使用 EasyCLI 进行远程 OAuth 认证”** 部分。
