---
title: Run with Docker Compose
feature_ids:
  - mode.docker.compose
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Run with Docker Compose

## 1. What this solves

`docker-compose.yml` at the repository root defines the `cli-proxy-api` service. That file pulls or builds the image, publishes fixed ports, and mounts the configuration, authentication directory, logs, and plugin directory into the container. The container name is `cli-proxy-api`, `pull_policy` is `always`, and `restart` is `unless-stopped`. The file does not override the image command. The command inside the image is `./CLIProxyAPI`.

## 2. Scope and non-goals

Use this when Docker Compose is installed and you are working from the repository root that contains the file. This page does not describe one-off `docker run` commands, individual login flags, or `docker-build.sh` / `docker-build.ps1`.

`env_file: .env` is commented out, so this Compose file does not load `.env` into the container. `${variable:-default}` is still substituted by the environment that runs Compose. The plugin directory is already mounted at `/CLIProxyAPI/plugins`. Do not add that same mount again from an older note.

## 3. How to configure or call it

Start it from the repository root. The file name is the Compose default, so no extra `-f` is required.

```bash
docker compose up -d
```

Stop that Compose project:

```bash
docker compose down
```

The current service definition follows. Build arguments and the commented `env_file` are kept as written:

```yaml
services:
  cli-proxy-api:
    image: ${CLI_PROXY_IMAGE:-eceasy/cli-proxy-api:latest}
    pull_policy: always
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VERSION: ${VERSION:-dev}
        COMMIT: ${COMMIT:-none}
        BUILD_DATE: ${BUILD_DATE:-unknown}
    container_name: cli-proxy-api
    # env_file:
    #   - .env
    environment:
      DEPLOY: ${DEPLOY:-}
    ports:
      - "8317:8317"
      - "8085:8085"
      - "1455:1455"
      - "54545:54545"
      - "51121:51121"
      - "11451:11451"
    volumes:
      - ${CLI_PROXY_CONFIG_PATH:-./config.yaml}:/CLIProxyAPI/config.yaml
      - ${CLI_PROXY_AUTH_PATH:-./auths}:/root/.cli-proxy-api
      - ${CLI_PROXY_LOG_PATH:-./logs}:/CLIProxyAPI/logs
      - ${CLI_PROXY_PLUGIN_PATH:-./plugins}:/CLIProxyAPI/plugins
    restart: unless-stopped
```

`DEPLOY` is passed into the container. The process enters the cloud-deployment wait only when the value is `cloud`. The default empty value does not. This page does not expand on cloud deployment.

## 4. Details

The Default column matches the ledger `defaults` verbatim. The default for `mode.docker.compose` is an empty string, so that cell is left blank. The other defaults are the substitution results written in `docker-compose.yml`.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| mode.docker.compose | Run the service with `docker-compose.yml` at the repository root. |  | Does not override the image command and does not load the commented-out `env_file`. |
| CLI_PROXY_IMAGE | Service image. | eceasy/cli-proxy-api:latest | `pull_policy: always`. It can also be built from the Dockerfile in the current directory, using the `build` block in the file. |
| VERSION | Build argument. | dev | Used only when building the image. |
| COMMIT | Build argument. | none | Used only when building the image. |
| BUILD_DATE | Build argument. | unknown | Used only when building the image. |
| DEPLOY | Environment variable passed into the container. | empty string | The process enters the cloud-deployment wait only when the value is `cloud`. |
| CLI_PROXY_CONFIG_PATH | Host configuration file, mounted at `/CLIProxyAPI/config.yaml`. | ./config.yaml | The path is relative to the repository root. |
| CLI_PROXY_AUTH_PATH | Host authentication directory, mounted at `/root/.cli-proxy-api`. | ./auths | The path is relative to the repository root. |
| CLI_PROXY_LOG_PATH | Host log directory, mounted at `/CLIProxyAPI/logs`. | ./logs | The path is relative to the repository root. |
| CLI_PROXY_PLUGIN_PATH | Host plugin directory, mounted at `/CLIProxyAPI/plugins`. | ./plugins | The file already contains this mount. |
| ports | Ports published on the host. | 8317, 8085, 1455, 54545, 51121, 11451 | Both sides of each mapping use the same port number. This page does not give those ports separate names. |

## 5. Common errors and limits

If a default relative path does not exist on the host, Compose still applies its own mount rules. This file has no extra existence check. The commented-out `env_file` has no effect. An empty `DEPLOY` does not enable the cloud-deployment wait.

This file does not pass `--config`, `--local-model`, or any other command-line flag. Behavior inside the container follows the mounted `/CLIProxyAPI/config.yaml` and the image's default command.

## 6. Related behavior

Command-line flags are covered in [Command-line flags](/introduction/install). Model catalogs are covered in [Model catalogs](/introduction/models).

## 7. Field experience

- [Replace the sample client keys](/experience/api#exp-api-replace-example-client-keys)
- [Mount a real configuration file into the container](/experience/docker#exp-docker-mount-real-config)
- [Prepare the configuration and credential directory before start](/experience/docker#exp-docker-prepare-auth-dir)
- [Keep using the existing storage backends in the container](/experience/docker#exp-docker-same-storage-backends)
- [Make the management page files downloadable](/experience/routing#exp-routing-management-page-download)
- [Let the server complete login through a proxy itself](/experience/routing#exp-routing-proxy-for-token-exchange)
