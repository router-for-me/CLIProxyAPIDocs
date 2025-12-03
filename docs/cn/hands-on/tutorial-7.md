# 零成本部署：ClawCloud (自带存储)

前段时间，我发了一篇文章《伍：Docker服务器部署》，许多网友反馈由于没有VPS，希望我能提供一个在容器云上部署的教程。

实际上，`CLIProxyAPI` 既然支持 Docker 部署，自然也能无缝地在容器云上运行。但若将其直接运行在容器云上，会存在以下两个主要问题：

- **配置文件持久化**：对于程序启动所需的配置文件，容器云往往是通过把配置文件内容映射到特定文件来解决，虽然可以运行，但如果你对配置文件做过修改，一旦容器重启，所有变更都会丢失。这种配置丢失的情况是我们不能接受的。
- **OAuth 认证复杂**：对于需要 OAuth 认证的供应商，在 VPS 的 Docker 环境下，我们可以通过 SSH 隧道将认证回调结果转发到服务器上。而纯容器云环境通常不支持 SSH 隧道，需要通过添加多个端口并在回调时手动修改域名来完成，整个过程非常繁琐。

因此，在 `CLIProxyAPI` 对容器云的部署进行适配更新后，本教程将一步步指导你如何在容器云上完成部署。

本次教程演示使用的容器云平台是 [ClawCloud Run](https://run.claw.cloud/)。在该平台使用注册时长超过180天的 Github 账号登录，即可获得每月5美元的循环额度。我们部署的 `CLIProxyAPI` 每天仅消耗约0.05美元，这个额度绰绰有余。其他容器云平台基本上大同小异，请参考该流程自行部署。

登录 ClawCloud Run 之后，我们点击 **App Launchpad**

![](https://img.072899.xyz/2025/10/080dfe9fd2c214ff9e507bd4d2bd5caa.png)

点击 **Create APP**

![](https://img.072899.xyz/2025/10/d44ca8835fac8cfc6b7a82a3ea4d95c9.png)

首先我们填写基础信息

- **应用名称 (Application Name)**：可自定义，此处填写 `cliproxyapi`
- **镜像名称 (Image Name)**：`eceasy/cli-proxy-api:latest`
- **网络 (Network)**：容器端口修改为 `8317`，同时打开 **Public Access**

![](https://img.072899.xyz/2025/10/1a4941e799911d181d658de450f6e5d7.png)

页面向下拉动，在高级设置中，我们需要填写：

- **启动命令 (Command)**：`/CLIProxyAPI/CLIProxyAPI --config /data/config.yaml`
- **环境变量 (Environment Variables)**：`DEPLOY=cloud`
- **持久化存储 (Local Storage)**：`/data`

![](https://img.072899.xyz/2025/10/3370f4146f19e92087f188dac5184575.png)

环境变量和存储的填写方法参看下图

| ![](https://img.072899.xyz/2025/10/e854143ef56bd6a71a922cad921c08b2.png) | ![](https://img.072899.xyz/2025/10/d966536ab7dd785ffc36355fdb2536cc.png) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |

确认所有信息填写无误后，点击右上角的 **Deploy Application**，应用将开始部署

![](https://img.072899.xyz/2025/10/dc49813c993e84e68af74747332b247b.png)

稍等片刻，应用即可部署成功。当 **Public Address** 状态变为 **Available** 时，其对应的就是我们访问 `CLIProxyAPI` 的网址，请保存备用

![](https://img.072899.xyz/2025/10/6502f6ce1d9a4f63c132966ae9c37064.png)

在等待部署的过程中，我们可以先准备 `config.yaml` 配置文件。本次使用的示例如下，请注意：`remote-management.secret-key` 是远程管理的密钥，而 `api-keys` 是 AI 客户端连接 `CLIProxyAPI` 所使用的密钥，要注意区分

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

当容器状态变为 **Active** 之后

![](https://img.072899.xyz/2025/10/99cce03e91ceb4eca44b8a055d0b874a.png)

我们点击图中的按钮，打开之前添加的 **Local Storage**

![](https://img.072899.xyz/2025/10/6ce689a58a74037594e31f5d8e587af7.png)

点击右上角的 **Upload**，选择刚才准备好的 `config.yaml` 文件并上传

![](https://img.072899.xyz/2025/10/d550a6d94c9a5f02852e2f12091ff2a0.png)

上传完成后，点击 **Restart** 重启容器

![](https://img.072899.xyz/2025/10/e4e4e077371cff0f77d097ccf9b07da6.png)

稍等片刻，待容器状态再次变为 **Active** 后，我们可以看到 **Local Storage** 中已生成了新的文件

![](https://img.072899.xyz/2025/10/877144ceae6bdc3acc180f18e309c9ef.png)

同时，点击 **Logs** 标签页，可以看到如下图所示的日志信息

![](https://img.072899.xyz/2025/10/5da47dbaaace9befc61d18ffcca5298a.png)

![](https://img.072899.xyz/2025/10/af2ed8594a0626ca24dcf3427ff2e103.png)

至此，`CLIProxyAPI` 便成功完成了整个部署流程。

------

**使用 EasyCLI 进行远程 OAuth 认证**

接下来，我们使用官方的另一个项目 [EasyCLI](https://github.com/router-for-me/EasyCLI) 来进行远程 OAuth 添加。

`EasyCLI` 是 `CLIProxyAPI` 的配套项目，提供了一个图形用户界面（GUI）来管理 `CLIProxyAPI`。其最大亮点是支持完整的 OAuth 认证授权流程（不仅是上传授权文件，而是能处理整个授权回调过程），这是 `CLIProxyAPI` 自带的 WebUI 无法做到的。

请前往 [EasyCLI 程序发布页面](https://github.com/router-for-me/EasyCLI/releases) 下载适合你操作系统的版本（作者提供了 Mac、Linux、Windows 版本）。本教程以 Windows x64 版本为例。

打开程序后，选择 **Remote**，输入我们之前记录下的 URL 网址

![](https://img.072899.xyz/2025/10/f1d6dce519e20cae93abaac261f4d269.png)

密码输入 `config.yaml` 中设置的 `remote-management.secret-key`（本例中是 `ABCD-1234`）

依次点击 **Authentication Files** -> **New**

![](https://img.072899.xyz/2025/10/00cbb95dfeab2b8047b8270292fbe2cc.png)

本次我们仍以添加 Gemini CLI 为例进行演示，准备工作可参照《贰：Gemini CLI+Codex实战》

输入 **Project ID**，点击 **Confirm**

![](https://img.072899.xyz/2025/10/994a104817d51e39f811ad190d6190d5.png)

页面中会出现 OAuth 链接，点击 **Open Link**

![](https://img.072899.xyz/2025/10/361f9b6568609e589c959ca572de8955.png)

程序会自动打开浏览器并跳转到 OAuth 链接，同时 `EasyCLI` 自身会进入回调接收状态

![](https://img.072899.xyz/2025/10/a10dab06835d7bc5d15af8cc1ca607ed.png)

在打开的浏览器页面中，我们登录账号并完成授权认证过程

![](https://img.072899.xyz/2025/10/d1dc0fe737eb8b0ce9f348f2f45871f1.png)

完成后，在 **Authentication Files** 列表中就可以看到新生成的配置文件了

![](https://img.072899.xyz/2025/10/d713a77479b41f4035f1bf66b2e538f6.png)

**验证**

我们再用 Cherry Studio 测试一下。如图所示，根据配置文件内容填写 API 密钥和 API 地址

![](https://img.072899.xyz/2025/10/8021ac702f232ded423b186dbcb50a90.png)

成功！

![](https://img.072899.xyz/2025/10/5d0684f8cfecb1bc503f5189822911a3.png)

`EasyCLI` 的其余功能就交给各位自行探索了。实际上，除了 OAuth 认证部分，`EasyCLI` 的其他功能与系统内置的 WebUI 基本一致。你也可以通过访问 `https://你的CLIProxyAPI访问链接/management.html` 来进行其他配置管理（关于 WebUI 的介绍可参考这篇文章《陆：新人最爱GUI》，虽然介绍也相对简短=。=）