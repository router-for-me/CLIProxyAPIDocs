# 伍：Docker服务器部署

在之前的系列文章中，我们介绍了如何在本地电脑上使用 CLIProxyAPI。本文将更进一步，讲解如何在服务器上通过 Docker 完成部署。

### **一、 环境准备**

在开始之前，请确保你拥有一台可用的 VPS（虚拟专用服务器）。本文将以 **Debian 13** 系统为例进行演示。

同时，请确保你的服务器上已经安装了 **Git** 和 **Docker**。

如果尚未安装，可以通过以下命令进行安装：

**1. 安装 Git**
```bash
apt update && apt install git -y
```

**2. 安装 Docker** 

可以使用官方提供的一键脚本进行安装：

```bash
bash <(curl -fsSL [https://get.docker.com](https://get.docker.com))
```

### **二、 部署 CLIProxyAPI**

准备工作就绪后，请依次执行以下命令来克隆项目并初始化配置。

```bash
git clone https://github.com/router-for-me/CLIProxyAPI.git
cd CLIProxyAPI
cp config.example.yaml config.yaml
```

![](https://img.072899.xyz/2025/09/60714b62a0f5b3ea896ab5461ecec150.png)

此时，我们可以打开 `config.yaml` 文件进行编辑。本教程将采用以下最小化配置作为示例：

```yaml
port: 8317

# 文件夹位置请根据你的实际情况填写
auth-dir: "~/.cli-proxy-api"

request-retry: 3

quota-exceeded:
  switch-project: true
  switch-preview-model: true

api-keys:
# Key 请自行设置，用于客户端访问代理
- "ABC-123456"
```

> **请注意：** 当使用 Docker 部署时，建议保持 `auth-dir` 的默认设置，无需修改。

编辑完 `config.yaml` 文件后，我们执行以下命令来执行 Docker 容器构建脚本。

```bash
bash docker-build.sh
```

脚本会提供两个选项：

![](https://img.072899.xyz/2025/09/f0f543ef4004f3f81c029f442b54c8bc.png)

- **选项 1：** 直接使用 Docker Hub 上的预构建镜像运行 (`docker compose up -d`)，速度快。
- **选项 2：** 在服务器本地编译镜像然后再运行，适合需要自定义修改的场景。

在本教程中，我们选择**选项 1**，以快速启动服务，稍待片刻，服务便成功启动了。

![](https://img.072899.xyz/2025/09/44609a9a0746c138f570202bd2825366.png)

### **三、 查看日志**

尽管脚本提示使用 `docker compose logs -f` 查看日志，但由于程序默认会将日志重定向到文件，因此**实时查看日志**需要使用以下命令：

```bash
tail -f ./logs/main.log
```

### **四、 添加 OAuth 认证**

现在程序已经在正常运行了。如果需要添加中转 Key，只需按照之前文章介绍的方法编辑配置文件即可，这一次，我们重点讲解如何通过 OAuth 添加授权认证文件。

#### **步骤一：在服务器端生成认证链接**

以添加 **Codex** 为例，请在项目根目录下执行以下命令：

```bash
docker compose exec cli-proxy-api /CLIProxyAPI/CLIProxyAPI -no-browser --codex-login
```

程序会生成一段用于建立 SSH 隧道的命令，请复制箭头处 `ssh` 开头的整段命令。

![](https://img.072899.xyz/2025/09/42f152ef068cea1df603b29934b6e814.png)

#### **步骤二：在本地建立 SSH 隧道**

在**你自己电脑**的终端或命令行工具中，粘贴刚才复制的命令。

![](https://img.072899.xyz/2025/09/1c27a2d2e3bc1ad823a040a50cb8e143.png)

> **特别注意：** 需要将命令中 `-p` 参数后的端口号（示例中的 `22`）替换为你 VPS 的**实际 SSH 端口**。

回车后输入服务器的 SSH 登录密码。成功连接后，请保持此终端窗口不要关闭，然后回到刚才操作服务器的终端上。

![](https://img.072899.xyz/2025/09/e25d23bc9b129cc9bbc6f4e1a674fed5.png)

#### **步骤三：通过浏览器完成授权**

复制服务器终端上箭头指向的链接

![](https://img.072899.xyz/2025/09/5ddcbc39551201f61b906703034af3d8.png)

在你本地电脑的浏览器中打开这个链接，用你的 ChatGPT 账号登录并授权

![](https://img.072899.xyz/2025/09/a4ed389a080bce529c47bda6f3129189.png)

授权成功后，会看到如下画面：

![](https://img.072899.xyz/2025/09/507c93b6fc900eae5c6c5b486b399561.png)

同时，服务器的终端上也会显示认证文件已成功保存

![](https://img.072899.xyz/2025/09/a34bb04a63f7f75f687a2a626035dccd.png)

至此，Codex 的认证就全部完成了。对于 Claude 和反重力等其他需要 OAuth 授权的服务，操作流程类似。

### **五、 原理总结**

最后，我们来总结一下这个远程 OAuth 认证流程的原理：

Claude、Codex 和反重力的 OAuth 认证都需要一个“回调”（Callback）过程来接收授权令牌。由于安全限制，服务商的回调地址通常强制设置为 `localhost`。

当我们在 Docker 容器中执行授权命令时，容器内没有浏览器环境，我们必须在本地电脑上打开授权网页。但授权成功后，浏览器会尝试访问 `localhost`，这只会访问到我们自己的电脑，而无法将令牌传递给远在服务器上的程序。

**SSH 隧道（SSH Tunnel）** 的作用就是搭建一座桥梁：它将我们本地电脑的某个端口（例如 `1455`）上的所有网络请求，通过加密的 SSH 连接，转发到服务器的同一端口上。这样，当浏览器访问本地的 `http://localhost:1455` 时，请求实际上被转发给了服务器上正在监听 `1455` 端口的 CLIProxyAPI 程序，从而巧妙地完成了远程认证。

作为 SSH Tunnel 的替代方案，你也可以在浏览器跳转到 `localhost` 回调链接时，手动将其中的 `localhost` 替换为你服务器的 IP 或域名。不过，请注意，这种方法需要你正确配置服务器的防火墙或反向代理，以确保回调请求能够被正确接收，否则可能会认证失败。

### **六、 客户端使用**

完成以上配置后，在客户端使用时，只需将请求的端点（Endpoint）地址指向你服务器的 `IP:端口`（例如 `http://YOUR_SERVER_IP:8317`）即可，其余操作与本地使用完全相同。

至此，你已经掌握了在服务器上通过 Docker 部署 CLIProxyAPI 的完整流程，快去享受 AI 带来的便利吧！
