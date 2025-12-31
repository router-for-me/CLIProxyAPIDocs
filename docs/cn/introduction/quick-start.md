# 快速开始

## macOS

```bash
brew install cliproxyapi
brew services start cliproxyapi
```

## Linux

### 一键安装脚本

```bash
curl -fsSL https://raw.githubusercontent.com/brokechubb/cliproxyapi-installer/refs/heads/master/cliproxyapi-installer | bash
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
> 默认配置文件路径为 `~/.cli-proxy-api/config.yaml`。
> 你需要手动创建此文件或将示例配置复制到该位置，否则服务无法正常启动。
> 示例配置通常位于 `/usr/share/doc/cli-proxy-api-bin/config.example.yaml`。

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
