# Run with Docker Compose

1.  Clone the repository and navigate into the directory:
    ```bash
    git clone https://github.com/router-for-me/CLIProxyAPI.git
    cd CLIProxyAPI
    ```

2.  Prepare the configuration file:
    Create a `config.yaml` file by copying the example and customize it to your needs.
    ```bash
    cp config.example.yaml config.yaml
    ```
    *(Note for Windows users: You can use `copy config.example.yaml config.yaml` in CMD or PowerShell.)*

3.  Start the service:
    -   **For most users (recommended):**
        Run the following command to start the service using the pre-built image from Docker Hub. The service will run in the background.
        ```bash
        docker compose up -d
        ```
    -   **For advanced users:**
        If you have modified the source code and need to build a new image, use the interactive helper scripts:
        -   For Windows (PowerShell):
            ```powershell
            .\docker-build.ps1
            ```
        -   For Linux/macOS:
            ```bash
            bash docker-build.sh
            ```
        The script will prompt you to choose how to run the application:
        - **Option 1: Run using Pre-built Image (Recommended)**: Pulls the latest official image from the registry and starts the container. This is the easiest way to get started.
        - **Option 2: Build from Source and Run (For Developers)**: Builds the image from the local source code, tags it as `cli-proxy-api:local`, and then starts the container. This is useful if you are making changes to the source code.

4. To authenticate with providers, run the login command inside the container:
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

5.  To view the server logs:
    ```bash
    docker compose logs -f
    ```

6.  To stop the application:
    ```bash
    docker compose down
    ```
