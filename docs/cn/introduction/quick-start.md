# 快速开始

## macOS

```bash
brew install cliproxyapi
brew services start cliproxyapi
```

> 使用 Homebrew 安装并通过 `brew services` 运行时，默认配置文件路径是 `$(brew --prefix)/etc/cliproxyapi.conf`（Apple Silicon 常见为 `/opt/homebrew/etc/cliproxyapi.conf`，Intel 常见为 `/usr/local/etc/cliproxyapi.conf`）。
> 如果你希望继续使用 `~/.cli-proxy-api/config.yaml` 作为主配置，可将默认路径软链接到该文件：
> ```bash
> brew services stop cliproxyapi
> mv "$(brew --prefix)/etc/cliproxyapi.conf" "$(brew --prefix)/etc/cliproxyapi.conf.bak"
> ln -s ~/.cli-proxy-api/config.yaml "$(brew --prefix)/etc/cliproxyapi.conf"
> brew services start cliproxyapi
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

```bash
docker run --rm -p 8317:8317 -v /path/to/your/config.yaml:/CLIProxyAPI/config.yaml -v /path/to/your/auth-dir:/root/.cli-proxy-api eceasy/cli-proxy-api:latest
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
