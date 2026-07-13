# Quick Start

## macOS

```bash
brew install cliproxyapi
brew services start cliproxyapi
```

> When installed via Homebrew and run with `brew services`, the default config path is `$(brew --prefix)/etc/cliproxyapi.conf` (typically `/opt/homebrew/etc/cliproxyapi.conf` on Apple Silicon and `/usr/local/etc/cliproxyapi.conf` on Intel Macs).
> If you want to keep using `~/.cli-proxy-api/config.yaml` as your main config, make the Homebrew path a symlink **to** that file. The symlink target **must exist** before you start the service (a dangling symlink makes the service exit immediately):
> ```bash
> brew_conf="$(brew --prefix)/etc/cliproxyapi.conf"
> home_conf="$HOME/.cli-proxy-api/config.yaml"
>
> brew services stop cliproxyapi
> mkdir -p "$HOME/.cli-proxy-api"
>
> # Copy and back up only a regular file; leave symlinks alone.
> # Timestamped backup avoids clobbering an existing .bak.
> if [ -f "$brew_conf" ] && [ ! -L "$brew_conf" ]; then
>   if [ -f "$home_conf" ] || cp "$brew_conf" "$home_conf"; then
>     mv "$brew_conf" "${brew_conf}.bak.$(date +%Y%m%d-%H%M%S)"
>   fi
> fi
>
> # Start only after the Homebrew path safely points to an existing config.
> if [ ! -f "$home_conf" ]; then
>   echo "No config file found at $home_conf; service was not started." >&2
> elif [ -e "$brew_conf" ] && [ ! -L "$brew_conf" ]; then
>   echo "Could not safely replace $brew_conf; service was not started." >&2
> elif ln -sfn "$home_conf" "$brew_conf"; then
>   brew services start cliproxyapi
> else
>   echo "Could not create the config symlink; service was not started." >&2
> fi
> ```

## Linux

### One-Click Installer Script

```bash
curl -fsSL https://raw.githubusercontent.com/router-for-me/cliproxyapi-installer/refs/heads/master/cliproxyapi-installer | bash
```

Thanks to [brokechubb](https://github.com/brokechubb) for building the Linux installer!

### Arch Linux (AUR)

If you are an Arch Linux user, you can install directly from the AUR:

```bash
# Using yay
yay -S cli-proxy-api-bin

# Using paru
paru -S cli-proxy-api-bin
```

After installation, you can manage the service via systemd:

```bash
# Start the service
systemctl --user start cli-proxy-api

# Enable auto-start on boot
systemctl --user enable cli-proxy-api
```

> ⚠️ **Note**:
> A configuration file is required before starting the service. You can create it by copying the example configuration:
> ```bash
> mkdir -p ~/.cli-proxy-api
> cp /usr/share/doc/cli-proxy-api-bin/config.example.yaml ~/.cli-proxy-api/config.yaml
> ```

## Windows

You can download the latest release from [here](https://github.com/router-for-me/CLIProxyAPI/releases) and run it directly.

Or

You can download our desktop GUI app from [here](https://github.com/router-for-me/EasyCLI/releases) and run it directly.

## Docker

Mount your plugins directory to `/CLIProxyAPI/plugins` so plugin installations persist across container restarts.

```bash
docker run --rm -p 8317:8317 -v /path/to/your/config.yaml:/CLIProxyAPI/config.yaml -v /path/to/your/auth-dir:/root/.cli-proxy-api -v /path/to/your/plugins-dir:/CLIProxyAPI/plugins eceasy/cli-proxy-api:latest
```

## Building from Source

1. Clone the repository:
   ```bash
   git clone https://github.com/router-for-me/CLIProxyAPI.git
   cd CLIProxyAPI
   ```

2. Build the application:

   Linux, macOS:
   ```bash
   go build -o cli-proxy-api ./cmd/server
   ```
   Windows:
   ```bash
   go build -o cli-proxy-api.exe ./cmd/server
   ```
