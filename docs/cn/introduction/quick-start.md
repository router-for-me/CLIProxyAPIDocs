# 快速开始

## macOS

```bash
brew install cliproxyapi
brew services start cliproxyapi
```

> 使用 Homebrew 安装并通过 `brew services` 运行时，默认配置文件路径是 `$(brew --prefix)/etc/cliproxyapi.conf`（Apple Silicon 常见为 `/opt/homebrew/etc/cliproxyapi.conf`，Intel 常见为 `/usr/local/etc/cliproxyapi.conf`）。
> 如果你希望继续使用 `~/.cli-proxy-api/config.yaml` 作为主配置，请让 Homebrew 默认路径**指向**该文件。软链目标**必须先存在**再启动服务（悬空软链会导致服务立刻退出）：
> ```bash
> brew_conf="$(brew --prefix)/etc/cliproxyapi.conf"
> home_conf="$HOME/.cli-proxy-api/config.yaml"
>
> brew services stop cliproxyapi
> mkdir -p "$HOME/.cli-proxy-api"
>
> # 仅复制和备份普通文件；不要操作软链。带时间戳备份，避免覆盖已有 .bak。
> if [ -f "$brew_conf" ] && [ ! -L "$brew_conf" ]; then
>   if [ -f "$home_conf" ] || cp "$brew_conf" "$home_conf"; then
>     mv "$brew_conf" "${brew_conf}.bak.$(date +%Y%m%d-%H%M%S)"
>   fi
> fi
>
> # 仅在 Homebrew 路径安全指向现有配置后启动服务
> if [ ! -f "$home_conf" ]; then
>   echo "未找到配置文件 $home_conf；服务未启动。" >&2
> elif [ -e "$brew_conf" ] && [ ! -L "$brew_conf" ]; then
>   echo "无法安全替换 $brew_conf；服务未启动。" >&2
> elif ln -sfn "$home_conf" "$brew_conf"; then
>   brew services start cliproxyapi
> else
>   echo "无法创建配置软链；服务未启动。" >&2
> fi
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
