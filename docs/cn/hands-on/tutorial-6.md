# 陆：新人最爱GUI

用管理密钥连上已有的管理界面或终端界面。界面本身的说明留在对应页面，不在本页重写。

## 场景

代理已经按[使用 Docker Compose](/cn/docker/docker)或本机二进制运行。你要打开管理面板、桌面客户端或终端界面。

## 步骤

1. 先让管理路由能够注册：设置管理密钥，并决定是否允许非本机访问、是否提供控制面板。全部见[管理端设置](/cn/operations/management-settings)。密钥使用 `YOUR_API_KEY`。
2. 面板从哪个仓库下载、何时更新，也只看同一页。页面操作见 [Web UI](/cn/management/webui)，不要把按钮说明抄回本页。
3. 桌面客户端的安装和账号接入见[桌面客户端](/cn/management/gui)。本页不重复它的 OAuth 或 API 接入步骤。
4. 更想留在终端里时，见[终端界面](/cn/operations/tui)。远程管理地址仍以管理端设置为准。
5. 连上之后，改配置走[管理 API v8](/cn/management/apiv8)，凭证走[管理凭证](/cn/management/v8-credentials)，OAuth 会话走[管理 OAuth](/cn/management/v8-oauth)。
6. `/v0/management` 已停止维护，不要按旧教程调用。见[管理 API](/cn/management/api)。

## 不要在本页完成的事

不在这里写管理请求示例，也不把面板仓库地址改成教程专有的值。
