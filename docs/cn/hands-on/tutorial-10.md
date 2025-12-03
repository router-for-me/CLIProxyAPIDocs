# 零成本部署：Render (Git存储)

在昨天的文章《零成本部署（ClawCloud）》发布后，我接着测试了 Render 平台，发现其免费计划不包含持久化存储。在将此情况反馈给 CLIProxyAPI 的作者后，他连夜更新了版本，新增了通过 Git 进行持久化存储的功能。这样一来，我们便能将配置文件和认证文件保存在 GitHub 的私有仓库中，不需要依赖容器云的持久化存储了。

接下来，本文将一步步地指导你如何在没有持久化存储的容器服务（例如 Render 的免费计划）上部署 CLIProxyAPI。至于通过 EasyCLI 进行 OAuth 认证的部分，与在 ClawCloud 上的部署完全一致，请参阅前一篇文章。

### 一、Github 准备工作

首先，我们需要在 GitHub 上创建一个空的仓库。仓库名称可自定义，但**务必**设为**私有**，否则你添加的 API Key 等敏感信息就会裸奔了

![](https://img.072899.xyz/2025/10/311e26cb4da97cafd7bb3b924440e858.png)

创建仓库后，记下仓库的 URL 地址。接下来我们点击页面右上角的个人头像，进入 **Settings**，然后点击左侧菜单最下方的 **Developer Settings**

![](https://img.072899.xyz/2025/10/a79377c7af3c80ec58ad853d12762b6c.png)

接着，依次点击 **Personal access tokens** -> **Fine-grained tokens**，然后点击右上角的 **Generate new token**

![](https://img.072899.xyz/2025/10/90fa44065df641c7599b8d16e84edf60.png)

如图所示填写 **Token name**（可自定义），根据你的需求选择过期时间（**Expiration**），并在 **Repository access** 中选择 **Only select repositories**，然后选中我们刚刚创建的那个空白仓库

![](https://img.072899.xyz/2025/10/74b5484e44a28293335160a9d42bb190.png)

将页面向下拉动，在 **Permissions** -> **Add permissions** 中找到 **Contents**，添加并将其权限从 `Read-only` 修改为 `Read and write`

![](https://img.072899.xyz/2025/10/825aafe9f3a52fc431a3ec54829777de.png)

确认权限设置无误后，点击页面底部的 **Generate token**

![](https://img.072899.xyz/2025/10/0b5f56df634cea1e3552b8560c7f175a.png)

此时页面上会显示生成的 Token。请注意，**此 Token 仅会显示一次**，页面关闭后将无法查看，请务必复制并妥善保存

![](https://img.072899.xyz/2025/10/a04fc4a6a75cab2222ba28d46e4463e9.png)

至此，GitHub 的准备工作就完成了。

### 二、Render 部署

首先，请确保你已注册 Render 账户。登录后，新建项目并选择 **New Web Service**

![](https://img.072899.xyz/2025/10/0398d8d1483fe65d556727ec23075eaf.png)

在部署方式中选择 **Existing Image**，在 **Image URL** 中输入 `eceasy/cli-proxy-api:latest`，然后点击 **Connect**

![](https://img.072899.xyz/2025/10/4ee784242be93bee942f0eea64d51af5.png)

输入服务名称（**Name**，可自定义），选择区域（**Region**，可根据个人偏好选择），并确保实例类型为 **Free**

![](https://img.072899.xyz/2025/10/90d6fb2b4a5d401d02a917f82396c304.png)

接下来，我们需要添加 4 个环境变量：

- `GITSTORE_GIT_URL`: 你的 GitHub 仓库地址
- `GITSTORE_GIT_USERNAME`: 你的 GitHub 用户名
- `GITSTORE_GIT_TOKEN`: 你刚刚创建的 Personal Access Token
- `MANAGEMENT_PASSWORD`: 用于登录管理界面的密码

输入完成后，点击页面底部的 **Deploy Web Service**

![](https://img.072899.xyz/2025/10/d4b39d6e4f10a19ada98e4af0e505df9.png)

等待部署日志滚动，当状态变为 **Live** 时，并且日志中出现`Available at your primary URL：XXXX`之后，程序就成功启动了

![](https://img.072899.xyz/2025/10/f77a35fa4f805e78fbcff663c6cf5aae.png)

使用 Render 提供的 URL，在其后添加 `/management.html`，即可进入 WebUI。输入你设定的 `MANAGEMENT_PASSWORD` 即可登录

![](https://img.072899.xyz/2025/10/af84a3b0d2cc0197f2b4ecb3497c802e.png)

此时再查看你的 GitHub 仓库，会发现里边已自动生成了两个文件夹

![](https://img.072899.xyz/2025/10/03bbde6090e53ae3362a624badd35319.png)

至此，在 Render 上部署 CLIProxyAPI 的全流程已完成。其他类似的容器云平台也可采用此方法进行部署，大家可自行探索。

### 三、注意事项

1.  CLIProxyAPI 在 v6.2.2 之后才新增了这个功能，如果你想指定镜像版本的话，选择的版本至少为`eceasy/cli-proxy-api:v6.2.2`。
2.  使用此方式部署后，配置文件中的 `remote-management` 部分将不再生效，管理密码以环境变量为准。这意味着，若要修改管理密码，你需要直接修改环境变量 `MANAGEMENT_PASSWORD`。
3.  使用 GitHub 存储配置文件和认证文件，不代表可以在多个容器实例中同时共享和调用，请务必避免这种情况，以免发生冲突。
4.  请注意，当容器正在运行时，直接在 GitHub 仓库中所做的任何手动更改都将是无效的。如确需手动修改，请务必先停止容器服务。
5.  推荐使用 WebUI 或 EasyCLI 来管理配置。使用 EasyCLI 还能进行 OAuth 的远程认证，具体方法可参考本文开头提到的《零成本部署（ClawCloud）》中的相关内容。