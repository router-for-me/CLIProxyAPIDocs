# Запуск с помощью Docker Compose

1.  Клонируйте репозиторий и перейдите в директорию:
    ```bash
    git clone https://github.com/router-for-me/CLIProxyAPI.git
    cd CLIProxyAPI
    ```

2.  Подготовьте файл конфигурации:
    Создайте файл `config.yaml`, скопировав пример, и настройте его под свои нужды.
    ```bash
    cp config.example.yaml config.yaml
    ```
    *(Примечание для пользователей Windows: вы можете использовать `copy config.example.yaml config.yaml` в CMD или PowerShell.)*

3.  Запустите сервис:
    -   **Для большинства пользователей (рекомендуется):**
        Выполните следующую команду, чтобы запустить сервис, используя предварительно собранный образ из Docker Hub. Сервис будет запущен в фоновом режиме.
        ```bash
        docker compose up -d
        ```
    -   **Для опытных пользователей:**
        Если вы изменили исходный код и вам нужно собрать новый образ, используйте интерактивные вспомогательные скрипты:
        -   Для Windows (PowerShell):
            ```powershell
            .\docker-build.ps1
            ```
- Для Linux/macOS:
    ```bash
    bash docker-build.sh
    ```
    Скрипт предложит вам выбрать способ запуска приложения:
    - **Вариант 1: Запуск с использованием готового образа (рекомендуется)**: Загружает последний официальный образ из реестра и запускает контейнер. Это самый простой способ начать работу.
    - **Вариант 2: Сборка из исходного кода и запуск (для разработчиков)**: Собирает образ из локального исходного кода, помечает его тегом `cli-proxy-api:local` и затем запускает контейнер. Это полезно, если вы вносите изменения в исходный код.

4. Для аутентификации у провайдеров выполните команду входа внутри контейнера:
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

5.  Чтобы просмотреть логи сервера:
    ```bash
    docker compose logs -f
    ```

6.  Чтобы остановить приложение:
    ```bash
    docker compose down
    ```
