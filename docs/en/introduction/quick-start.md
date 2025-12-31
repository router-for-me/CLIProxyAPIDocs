# Quick Start

## macOS

```bash
brew install cliproxyapi
brew services start cliproxyapi
```

## Linux

### One-Click Installer Script

```bash
curl -fsSL https://raw.githubusercontent.com/brokechubb/cliproxyapi-installer/refs/heads/master/cliproxyapi-installer | bash
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
> The default configuration file path is `~/.cli-proxy-api/config.yaml`.
> You need to manually create this file or copy the example configuration to this location, otherwise the service will not start properly.
> The example configuration can be found at `/usr/share/doc/cli-proxy-api-bin/config.example.yaml`.

## Windows

You can download the latest release from [here](https://github.com/router-for-me/CLIProxyAPI/releases) and run it directly.

Or

You can download our desktop GUI app from [here](https://github.com/router-for-me/EasyCLI/releases) and run it directly.

## Docker

```bash
docker run --rm -p 8317:8317 -v /path/to/your/config.yaml:/CLIProxyAPI/config.yaml -v /path/to/your/auth-dir:/root/.cli-proxy-api eceasy/cli-proxy-api:latest
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
