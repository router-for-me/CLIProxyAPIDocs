# 快速开始

## macOS

```bash
brew install cliproxyapi
brew services start cliproxyapi
```

> 使用 Homebrew 安装并通过 `brew services` 运行时，默认配置文件路径是 `$(brew --prefix)/etc/cliproxyapi.conf`（Apple Silicon 常见为 `/opt/homebrew/etc/cliproxyapi.conf`，Intel 常见为 `/usr/local/etc/cliproxyapi.conf`）。
> 如果你希望继续使用 `~/.cli-proxy-api/config.yaml` 作为主配置，请让 Homebrew 默认路径**指向**该文件。软链目标**必须先存在**再启动服务（悬空软链会导致服务立刻退出）：
> ```bash
> brew services stop cliproxyapi
> mkdir -p ~/.cli-proxy-api
> # 仅在家目录配置不存在时复制（不覆盖已有文件）
> if [ ! -f ~/.cli-proxy-api/config.yaml ]; then
>   cp "$(brew --prefix)/etc/cliproxyapi.conf" ~/.cli-proxy-api/config.yaml
> fi
> mv "$(brew --prefix)/etc/cliproxyapi.conf" "$(brew --prefix)/etc/cliproxyapi.conf.bak"
> # Homebrew 路径 -> 家目录配置（不要反了）
> ln -sfn ~/.cli-proxy-api/config.yaml "$(brew --prefix)/etc/cliproxyapi.conf"
> # 真正的守卫：仅当软链目标存在时才启动
> test -f ~/.cli-proxy-api/config.yaml && brew services start cliproxyapi
> ```

## Linux

### 一键安装脚本

```bash
curl -fsSL https://raw.githubusercontent.com/router-for-me/cliproxyapi-installer/refs/heads/master/cliproxyapi-installer | bash
```

感谢 [brokechubb](https://github.com/brokechubb) 开发的 Linux 安装器！

### Arch Linux (AUR)

如果你是 Arch Linux 用户，可以直接从 AUR 安装：

```bash
# 使用 yay
yay -S cli-proxy-api-bin

# 使用 paru
paru -S cli-proxy-api-bin
```

安装完成后，你可以通过 systemd 管理服务：

```bash
# 启动服务
systemctl --user start cli-proxy-api

# 设置开机自启
systemctl --user enable cli-proxy-api
```

> ⚠️ **注意**：
> 服务启动前需要配置文件。你可以通过复制示例配置文件来创建它：
> ```bash
> mkdir -p ~/.cli-proxy-api
> cp /usr/share/doc/cli-proxy-api-bin/config.example.yaml ~/.cli-proxy-api/config.yaml
> ```

## Windows

你可以在 [这里](https://github.com/router-for-me/CLIProxyAPI/releases) 下载最新版本并直接运行。

或者

你可以在 [这里](https://github.com/router-for-me/EasyCLI/releases) 下载我们的桌面图形程序并直接运行。

## Docker

请将插件目录挂载到 `/CLIProxyAPI/plugins`，否则通过插件商店安装的插件在容器重启后会丢失。

```bash
docker run --rm -p 8317:8317 -v /path/to/your/config.yaml:/CLIProxyAPI/config.yaml -v /path/to/your/auth-dir:/root/.cli-proxy-api -v /path/to/your/plugins-dir:/CLIProxyAPI/plugins eceasy/cli-proxy-api:latest
```

## 源码编译

1. 克隆仓库:
   ```bash
   git clone https://github.com/router-for-me/CLIProxyAPI.git
   cd CLIProxyAPI
   ```

2. 构建程序:

   Linux, macOS:
   ```bash
   go build -o cli-proxy-api ./cmd/server
   ```
   Windows:
   ```bash
   go build -o cli-proxy-api.exe ./cmd/server
   ```
