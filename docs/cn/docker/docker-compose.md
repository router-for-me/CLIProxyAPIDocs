# 使用 Docker Compose 运行

1.  克隆仓库并进入目录：
    ```bash
    git clone https://github.com/router-for-me/CLIProxyAPI.git
    cd CLIProxyAPI
    ```

2.  准备配置文件：
    通过复制示例文件来创建 `config.yaml` 文件，并根据您的需求进行自定义。
    ```bash
    cp config.example.yaml config.yaml
    ```
    *（Windows 用户请注意：您可以在 CMD 或 PowerShell 中使用 `copy config.example.yaml config.yaml`。）*

3.  启动服务：
    -   **适用于大多数用户（推荐）：**
        运行以下命令，使用 Docker Hub 上的预构建镜像启动服务。服务将在后台运行。
        ```bash
        docker compose up -d
        ```
    -   **适用于进阶用户：**
        如果您修改了源代码并需要构建新镜像，请使用交互式辅助脚本：
        -   对于 Windows (PowerShell):
            ```powershell
            .\docker-build.ps1
            ```
        -   对于 Linux/macOS:
            ```bash
            bash docker-build.sh
            ```
        脚本将提示您选择运行方式：
        - **选项 1：使用预构建的镜像运行 (推荐)**：从镜像仓库拉取最新的官方镜像并启动容器。这是最简单的开始方式。
        - **选项 2：从源码构建并运行 (适用于开发者)**：从本地源代码构建镜像，将其标记为 `cli-proxy-api:local`，然后启动容器。如果您需要修改源代码，此选项很有用。

4. 要在容器内运行登录命令进行身份验证：
    - **OpenAI (Codex)**:
    ```bash
    docker compose exec cli-proxy-api /CLIProxyAPI/CLIProxyAPI -no-browser --codex-login
    ```
    - **Claude**:
    ```bash
    docker compose exec cli-proxy-api /CLIProxyAPI/CLIProxyAPI -no-browser --claude-login
    ```
    - **Antigravity**:
    ```bash
    docker compose exec cli-proxy-api /CLIProxyAPI/CLIProxyAPI -no-browser --antigravity-login
    ```

5.  查看服务器日志：
    ```bash
    docker compose logs -f
    ```

6.  停止应用程序：
    ```bash
    docker compose down
    ```
