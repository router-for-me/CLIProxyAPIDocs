# Быстрый старт

## macOS

```bash
brew install cliproxyapi
brew services start cliproxyapi
```

## Linux

### Скрипт установки в один клик

```bash
curl -fsSL https://raw.githubusercontent.com/router-for-me/cliproxyapi-installer/refs/heads/master/cliproxyapi-installer | bash
```

Спасибо [brokechubb](https://github.com/brokechubb) за создание установщика для Linux!

### Arch Linux (AUR)

Если вы пользователь Arch Linux, вы можете установить пакет напрямую из AUR:

```bash
# Использование yay
yay -S cli-proxy-api-bin

# Использование paru
paru -S cli-proxy-api-bin
```

После установки вы можете управлять службой через systemd:

```bash
# Запуск службы
systemctl --user start cli-proxy-api

# Включение автозапуска при загрузке
systemctl --user enable cli-proxy-api
```

> ⚠️ **Примечание**:
> Перед запуском службы требуется файл конфигурации. Вы можете создать его, скопировав пример конфигурации:
> ```bash
> mkdir -p ~/.cli-proxy-api
> cp /usr/share/doc/cli-proxy-api-bin/config.example.yaml ~/.cli-proxy-api/config.yaml
> ```

## Windows

Вы можете скачать последний релиз [отсюда](https://github.com/router-for-me/CLIProxyAPI/releases) и запустить его напрямую.

Или

Вы можете скачать наше приложение Desktop GUI [отсюда](https://github.com/router-for-me/EasyCLI/releases) и запустить его напрямую.

## Docker

```bash
docker run --rm -p 8317:8317 -v /path/to/your/config.yaml:/CLIProxyAPI/config.yaml -v /path/to/your/auth-dir:/root/.cli-proxy-api eceasy/cli-proxy-api:latest
```

## Сборка из исходного кода

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/router-for-me/CLIProxyAPI.git
   cd CLIProxyAPI
   ```

2. Соберите приложение:

   Linux, macOS:
   ```bash
   go build -o cli-proxy-api ./cmd/server
   ```
   Windows:
   ```bash
   go build -o cli-proxy-api.exe ./cmd/server
   ```