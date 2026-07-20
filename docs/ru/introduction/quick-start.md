# Быстрый старт

## macOS

```bash
brew install cliproxyapi
brew services start cliproxyapi
```

> При установке через Homebrew и запуске с помощью `brew services` путь к файлу конфигурации по умолчанию — `$(brew --prefix)/etc/cliproxyapi.conf` (обычно `/opt/homebrew/etc/cliproxyapi.conf` для Apple Silicon и `/usr/local/etc/cliproxyapi.conf` для Intel).
> Если вы хотите продолжать использовать `~/.cli-proxy-api/config.yaml` в качестве основного файла конфигурации, настройте путь Homebrew по умолчанию так, чтобы он **указывал** на этот файл. Цель символической ссылки **должна существовать** до запуска службы (висячая ссылка приведёт к немедленной остановке службы):
> ```bash
> brew_conf="$(brew --prefix)/etc/cliproxyapi.conf"
> home_conf="$HOME/.cli-proxy-api/config.yaml"
>
> brew services stop cliproxyapi
> mkdir -p "$HOME/.cli-proxy-api"
>
> # Copy and back up only regular files; do not handle symlinks. A timestamped backup avoids overwriting an existing .bak.
> if [ -f "$brew_conf" ] && [ ! -L "$brew_conf" ]; then
>   if [ -f "$home_conf" ] || cp "$brew_conf" "$home_conf"; then
>     mv "$brew_conf" "${brew_conf}.bak.$(date +%Y%m%d-%H%M%S)"
>   fi
> fi
>
> # Start the service only after the Homebrew path safely points to an existing config file
> if [ ! -f "$home_conf" ]; then
>   echo "Файл конфигурации $home_conf не найден; служба не запущена." >&2
> elif [ -e "$brew_conf" ] && [ ! -L "$brew_conf" ]; then
>   echo "Невозможно безопасно заменить $brew_conf; служба не запущена." >&2
> elif ln -sfn "$home_conf" "$brew_conf"; then
>   brew services start cliproxyapi
> else
>   echo "Не удалось создать символическую ссылку на файл конфигурации; служба не запущена." >&2
> fi
> ```

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

Смонтируйте каталог плагинов в `/CLIProxyAPI/plugins`, чтобы установленные плагины сохранялись после перезапуска контейнера.

```bash
docker run --rm -p 8317:8317 -v /path/to/your/config.yaml:/CLIProxyAPI/config.yaml -v /path/to/your/auth-dir:/root/.cli-proxy-api -v /path/to/your/plugins-dir:/CLIProxyAPI/plugins eceasy/cli-proxy-api:latest
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