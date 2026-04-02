# macOS 本地启动器

本文总结了一套适合在 macOS 上本地运行 CLIProxyAPI 的方案，目标包括：

- 使用固定且可写的真实运行目录
- 在 `/Applications` 放一个薄 `.app` 启动器
- 服务就绪后自动打开内置 Web UI
- 将更新流程与启动流程分离

核心目标是把运行状态、更新流程和 app 包本身解耦。

## 推荐目录结构

建议把真实运行目录放在 `.app` 之外，例如：

```text
~/CLIProxyAPI/
  bin/
  auths/
  logs/
  temp/
  config.yaml
```

推荐职责划分：

- `config.yaml`：本地运行配置
- `auths/`：OAuth 和 provider 认证文件
- `logs/`：运行日志
- `bin/`：构建产物和本地辅助脚本
- `temp/`：PID、浏览器 profile、临时控制文件

这样可以避免把会变化的运行文件塞进 `.app` 包里。

## 让 `.app` 成为薄启动器

macOS 下的 `.app` 更适合做“薄启动器”，而不是第二份独立安装。

推荐模式：

1. 把真实 CLIProxyAPI checkout 放在稳定可写目录，例如 `~/CLIProxyAPI`
2. 把一个小 `.app` 包放在 `/Applications`
3. 让 `.app` 只负责调用真实项目目录里的脚本

这样可以避免在 `.app` 里内嵌一份会逐渐过期的服务端二进制。

## 启动流程

一套稳健的启动流程通常是：

1. 先检查 CLIProxyAPI 是否已经运行
2. 如果未运行，则以脱离当前 shell 的方式启动本地二进制
3. 等待 `http://127.0.0.1:8317/` 返回成功
4. 等待 `http://127.0.0.1:8317/management.html` 可以访问
5. 打开 Web UI

CLIProxyAPI 的内置管理面板入口是：

```text
http://127.0.0.1:8317/management.html
```

不要把 `/` 当成管理面板入口。根路径只是轻量级状态页。

## 关闭流程

如果启动器还需要一键关闭，建议保持对称：

1. 通过 PID 文件或专用状态脚本停止本地 CLIProxyAPI 进程
2. 只关闭属于 CLIProxyAPI 的 Web UI 窗口

不要误关用户日常浏览器里的其他标签页或窗口。

## 用专属浏览器 Profile 打开 Web UI

如果你希望“关闭 Web UI”足够可靠，就不要把管理面板随意开在用户现有浏览器标签页里。

更稳的方式是使用专属 profile 或 app-style window。

### Chrome 或 Chromium

```bash
open -na "Google Chrome" --args \
  --user-data-dir="$HOME/CLIProxyAPI/temp/webui-browser-profile" \
  --app="http://127.0.0.1:8317/management.html"
```

如果后续还需要“只关闭这个 Web UI 窗口”，这通常是最稳的方案。

### Firefox

```bash
open -na "Firefox" --args \
  --profile "$HOME/CLIProxyAPI/temp/webui-firefox-profile" \
  --new-window "http://127.0.0.1:8317/management.html"
```

这个方案同样可以隔离 profile，只是没有 Chrome 的 `--app` 模式那么像独立桌面应用。

### Safari

Safari 可以直接打开这个地址：

```bash
open -a "Safari" "http://127.0.0.1:8317/management.html"
```

但 Safari 没有一个与“专属 profile + app 风格窗口”完全等价的命令行方案。

如果你需要非常确定的“只打开这个窗口”和“只关闭这个窗口”，通常更推荐 Chrome 系浏览器或 Firefox。如果你更偏好 Safari，建议查看 Safari 和 macOS 自动化文档，确认当前支持的方式。

## 让更新流程独立于启动流程

不建议让 `.app` 自己负责自动更新仓库。

更稳的方式是把更新放在独立的终端工作流里，例如：

- `up`
- `git pull`
- 本地重建脚本

这样更新动作更显式，也更容易排障。

## 与 Gemini CLI 的配合

如果你在 macOS 上把 Gemini CLI 与 CLIProxyAPI 配合使用，这套方案可以和 [Gemini CLI](/cn/agent-client/gemini-cli) 的配置一起工作。

常见分工是：

- `.app`：负责启动和关闭本地服务与 Web UI
- 终端命令：负责更新 checkout 和重建二进制
- `gemini`：负责把客户端指向本地 CLIProxyAPI 入口
