# Zero: Detailed Configuration Explanation

This article provides a detailed explanation of the configuration items in the configuration file of the [CLIProxyAPI project](https://github.com/router-for-me/CLIProxyAPI), for users to refer to when they have questions.

Friendly reminder: The configuration file supports hot reloading. Modifications to the configuration file take effect immediately without restarting the program.

```
# Port number, CLIProxyAPI runs an HTTP server and needs a port number for access
port: 8317

# Remote management configuration, used with EasyCLI or WebUI
remote-management:
  # Switch to enable remote management. If you deploy it on a server,
  # you need to set it to true to use EasyCLI or WebUI to connect to CLIProxyAPI
  # for management.
  # If you only use the API for local management, you can keep it as false.
  allow-remote: false

  # If you want to use EasyCLI or WebUI to manage CLIProxyAPI through the API,
  # you must set a Key.
  # If it is not set, it is considered that the API management function is
  # disabled, and you cannot use EasyCLI or WebUI to connect.
  # If you do not need to use EasyCLI or WebUI for management, you can leave it
  # blank.
  secret-key: ""

  # Switch to integrate WebUI.
  # Set to false, you can open WebUI through
  # http://YOUR_SERVER_IP:8317/management.html
  disable-control-panel: false

# Directory for storing authentication files, used to store authentication files
# for Gemini Web, Claude Code, and Codex.
# The default setting is the .cli-proxy-api folder in your current account
# directory, which is compatible with Windows and Linux environments.
# The program will automatically create this folder when it starts for the first
# time.
# The default in Windows is C:\Users\your_username\.cli-proxy-api
# The default in Linux is /home/your_username/.cli-proxy-api
# If you use a non-default location in a Windows environment, you need to
# modify it in this format "Z:\\CLIProxyAPI\\auths"
auth-dir: "~/.cli-proxy-api"

# Whether to enable Debug information in the log, it is disabled by default.
# You only need to turn it on when the author needs to cooperate in
# troubleshooting.
debug: false

# Hidden configuration, which can record every request and response and save it
# to the logs directory.
# The size of each log may be as high as 10MB+. Please do not enable it if your
# hard disk is not large enough.
request-log: false

# Whether to redirect the log to a log file.
# It is enabled by default, and the log will be saved in the logs folder in the
# program directory.
# If it is turned off, the log will be displayed in the console.
logging-to-file: true

# Switch for usage statistics, enabled by default.
# You need to use the API to view the usage, you can use EasyCLI or WebUI to
# view it.
usage-statistics-enabled: true

# If you want to use a proxy, you need to make the following settings, which
# support socks5/http/https protocols.
# Fill in according to this format "socks5://user:pass@192.168.1.1:1080/"
proxy-url: ""

# The number of times the program automatically retries the request when it
# encounters error codes such as 403, 408, 500, 502, 503, 504.
request-retry: 3

# Processing behavior after the model is restricted.
quota-exceeded:
  # The core configuration of multi-account polling.
  # When set to true, for example, if an account triggers a 429, the program
  # will automatically switch to the next account to re-initiate the request.
  # When set to false, the program will send the 429 error message to the
  # client and end the current request.
  # That is to say, when it is set to true, as long as at least one of the
  # polling accounts is normal, the client will not report an error.
  # When it is set to false, the client needs to retry or abort the operation.
  switch-project: true 

# Hidden configuration, you can turn off the interval time during retries, and
# set it as needed.
# For example, after a model triggers 429, the program will temporarily disable
# it, and each time it is triggered again, the deactivation time will be
# increased, up to a maximum of 30 minutes.
# By default, the model will be skipped during the deactivation period.
# After setting it to true, the request will still be sent to the model every
# time, regardless of whether the model is in the deactivation period, and it
# will no longer be skipped.
disable-cooling: false

# The keys required for various AI clients to access CLIProxyAPI are set here.
# Do not confuse them with the various keys below.
# In layman's terms, the Key here is what CLIProxyAPI needs to set as a
# server.
# The various keys below are what CLIProxyAPI needs as a client to access the
# server.
api-keys:
  - "your-api-key-1"
  - "your-api-key-2"

# AIStudio authentication switch. When set to true, the above api-keys will be
# used to authenticate AIStudio Build APP access.
ws-auth: false

# Gemini API key configuration. Legacy `generative-language-api-key` values are auto-migrated here and removed from the config file on save.
# When base-url is not set, the official endpoint is used for access. When
# base-url is set, a third-party relay can be accessed.
# When accessing through Cloudflare AI Gateway, authentication can be performed
# by setting headers.
# For each Key, you can also set proxy-url to connect through a proxy.
gemini-api-key:
  - api-key: "AIzaSy...01"
    base-url: "https://generativelanguage.googleapis.com"
    headers:
      X-Custom-Header: "custom-value"
    proxy-url: "socks5://proxy.example.com:1080"
  - api-key: "AIzaSy...02"

# Codex's API Key. The key and base-url parameters of Codex provided by
# various relay stations can be filled in here to access.
# For each Key, you can also set proxy-url to connect through a proxy.
codex-api-key:
  - api-key: "sk-atSM..."
    base-url: "https://www.example.com"
    proxy-url: "socks5://proxy.example.com:1080"

# Claude's API Key. When using the official Key, do not fill in base-url. For
# third-party relays, fill in base-url.
# For each Key, you can also set proxy-url to connect through a proxy.
claude-api-key:
  - api-key: "sk-atSM..."
  - api-key: "sk-atSM..."
    base-url: "https://www.example.com"
    proxy-url: "socks5://proxy.example.com:1080"
    models:
      # Model name provided by the relay provider
      - name: "claude-3-5-sonnet-20241022"
        # Model alias, which is the model name actually set in the client
        alias: "claude-sonnet-latest"

# All OpenAI compatible ones can be accessed here, no more explanation.
openai-compatibility:
  - name: "openrouter"
    base-url: "https://openrouter.ai/api/v1"
    # Legacy api-keys are migrated into api-key-entries on load.
    api-key-entries:
      - api-key: "sk-or-v1-...b780"
        proxy-url: "socks5://proxy.example.com:1080"
      - api-key: "sk-or-v1-...b781"
    models:
    	# Model name provided by the OpenAI compatible provider
      - name: "moonshotai/kimi-k2:free"
      	# Model alias, which is the model name actually set in the client
        alias: "kimi-k2"
