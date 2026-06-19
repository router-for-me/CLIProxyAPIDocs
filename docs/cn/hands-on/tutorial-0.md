# 零：配置详细解说

这篇文章是对[CLIProxyAPI项目](https://github.com/router-for-me/CLIProxyAPI)配置文件中各配置项的详细解读，供程序使用者有疑问时参阅

温馨提示：配置文件支持热重载，修改配置文件是即时生效的，不需要重启程序。

```
# 端口号，CLIProxyAPI运行了个HTTP服务器，需要端口号来进行访问
port: 8317

# 远程管理配置，配合EasyCLI或者WebUI来使用
remote-management:
  # 启用远程管理的开关，如果你部署在服务器上
  # 那么需要设置为true，才能使用EasyCLI或者WebUI连接到CLIProxyAPI进行管理
  # 如果只是本地使用API进行管理的，可以保持false不动
  allow-remote: false

  # 如果想使用EasyCLI或者WebUI通过API对CLIProxyAPI进行管理，必须设置Key
  # 如果不设置，视同关闭了API管理功能，就无法使用EasyCLI或者WebUI进行连接了
  # 如果你不需要使用EasyCLI或者WebUI进行管理，可以留空
  secret-key: ""

  # 是否集成WebUI的开关
  # 设置为false，可以通过http://YOUR_SERVER_IP:8317/management.html打开WebUI
  disable-control-panel: false

# 认证文件存放目录，用于存放 Gemini Web、Claude Code、Codex 的认证文件
# 默认设置，是在你当前账户目录下的.cli-proxy-api文件夹，适配Windows和Linux环境
# 程序首次启动时会自动创建该文件夹
# Windows下默认为C:\Users\你的用户名\.cli-proxy-api
# Linux下默认为/home/你的用户名/.cli-proxy-api
# 如果在Windows环境下使用非默认位置，需要参照这样的格式修改填写"Z:\\CLIProxyAPI\\auths"
auth-dir: "~/.cli-proxy-api"

# 是否在日志中启用Debug信息，默认不启用，需要作者配合排错的时候打开就行
debug: false

# 隐藏配置，可以记录每一个请求和响应，并保存到logs目录下
# 每条日志体积可能会高达10MB+，硬盘不够大请不要开启
request-log: false

# 是否将日志重定向到日志文件中
# 默认启用，日志会保存在程序目录下的logs文件夹中
# 如果关闭的话，会在控制台显示日志
logging-to-file: true

# 开关使用统计，默认启用
# 需要使用API来查看使用量，可以用EeasyCLI或者WebUI来查看
usage-statistics-enabled: true

# 如果你要使用代理，那么需要进行以下的设置，支持socks5/http/https协议
# 按照这样的格式"socks5://user:pass@192.168.1.1:1080/"填写
proxy-url: ""

# 当请求碰到403, 408, 500, 502, 503, 504这些错误码的时候，程序自动重试请求的次数
request-retry: 3

# 模型受到限制之后的处理行为
quota-exceeded:
  # 多账号轮询的核心配置
  # 设置为true时，例如一个账号触发了429，程序会自动切换到下一个账号重新发起请求
  # 设置为false时，程序会把429的错误信息发给客户端，结束当前请求
  # 也就是说，当设置为true时，只要轮询的账号里至少有一个号是正常的，客户端这里就不会报错
  # 而设置false时，则需要客户端来进行重试或中止操作
  switch-project: true 

# 隐藏配置，可以关闭重试时的间隔时间，根据需要进行设置
# 例如某模型触发429后，程序会暂时停用它，且每次再触发都会增加停用时间，最多延长到30分钟
# 默认情况下，停用期内会跳过该模型
# 设置true后，无论该模型是否处于停用期，仍会每次都向该模型发起请求，不再跳过
disable-cooling: false

# 各种AI客户端访问CLIProxyAPI所需要填写的Key，就在这里设置，和后边的各种Key不要弄混淆了
# 通俗点讲，这里的Key是CLIProxyAPI作为服务器所需要设置的
# 后边的各种Key是CLIProxyAPI作为客户端去访问服务器所需要的
api-keys:
  - "your-api-key-1"
  - "your-api-key-2"

# AIStudio的鉴权开关，设置为true，会使用上述的api-keys对AIStudio Build APP接入进行鉴权
ws-auth: false

# Gemini 的官方 API Key 设置项。旧的 generative-language-api-key 会在加载时自动迁移为此字段并从配置文件移除。
# 不设置base-url时，使用官方端点接入；设置了base-url，可以接入第三方中转。
# 使用Cloudflare AI Gateway接入时，可以通过设置headers进行鉴权。
# 针对每个Key，还能够设置proxy-url，通过代理进行连接。
gemini-api-key:
  - api-key: "AIzaSy...01"
    base-url: "https://generativelanguage.googleapis.com"
    headers:
      X-Custom-Header: "custom-value"
    proxy-url: "socks5://proxy.example.com:1080"
  - api-key: "AIzaSy...02"

# Codex的API Key，各种中转站提供的Codex的key和base-url参数，填在这里就可以接入了
# 针对每个Key，还能够设置proxy-url，通过代理进行连接
codex-api-key:
  - api-key: "sk-atSM..."
    base-url: "https://www.example.com"
    proxy-url: "socks5://proxy.example.com:1080"

# Claude的API Key，使用官方Key的时候，不要填base-url，使用第三方中转的，填base-url
# 针对每个Key，还能够设置proxy-url，通过代理进行连接
claude-api-key:
  - api-key: "sk-atSM..."
  - api-key: "sk-atSM..."
    base-url: "https://www.example.com"
    proxy-url: "socks5://proxy.example.com:1080"
    models:
      # 中转商提供的模型名称
      - name: "claude-3-5-sonnet-20241022"
        # 模型别名，是在客户端中实际设置的模型名
        alias: "claude-sonnet-latest"

# 各种OpenAI兼容的都可以在这里接入，不多解释了
openai-compatibility:
  - name: "openrouter"
    base-url: "https://openrouter.ai/api/v1"
    # 旧字段 api-keys 会在加载时自动迁移为 api-key-entries。
    api-key-entries:
      - api-key: "sk-or-v1-...b780"
        proxy-url: "socks5://proxy.example.com:1080"
      - api-key: "sk-or-v1-...b781"
    models:
    	# OpenAI兼容供应商提供的模型名称
      - name: "moonshotai/kimi-k2:free"
      	# 模型别名，是在客户端中实际设置的模型名
        alias: "kimi-k2"
```
