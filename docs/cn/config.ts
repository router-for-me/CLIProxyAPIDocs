import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "CLIProxyAPI",
    description: "Wrap ChatGPT Codex, Claude Code, and other model providers as an OpenAI/Gemini/Claude/Codex compatible API service.",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: '首页', link: '/cn/'},
            {text: '快速开始', link: '/cn/introduction/quick-start'}
        ],

        sidebar: [
            {
                text: '介绍',
                items: [
                    {text: 'CLIProxyAPI是什么？', link: '/cn/introduction/what-is-cliproxyapi'},
                    {text: '快速开始', link: '/cn/introduction/quick-start'},
                    {text: '命令行参数', link: '/cn/introduction/install'},
                    {text: '模型目录', link: '/cn/introduction/models'},
                    {text: 'GitHub', link: 'https://github.com/router-for-me/CLIProxyAPI'}
                ]
            },
            {
                text: '接入 API',
                items: [
                    {text: '客户端密钥', link: '/cn/api/access'},
                    {text: 'OpenAI Chat', link: '/cn/api/openai-chat'},
                    {text: 'Responses', link: '/cn/api/responses'},
                    {text: 'Claude Messages', link: '/cn/api/claude-messages'},
                    {text: 'Gemini', link: '/cn/api/gemini'},
                    {text: '图像、语音与视频', link: '/cn/api/media'},
                    {text: '实时会话', link: '/cn/api/realtime'},
                    {text: '其他入口', link: '/cn/api/openai-other'},
                ]
            },
            {
                text: '账号与上游',
                items: [
                { text: '反重力登录', link: '/cn/accounts/antigravity' },
                { text: 'Claude 登录', link: '/cn/accounts/claude' },
                { text: 'Codex 登录', link: '/cn/accounts/codex' },
                { text: 'Devin 登录', link: '/cn/accounts/devin' },
                { text: 'Kimi 登录', link: '/cn/accounts/kimi' },
                { text: 'Kimi.ai 登录', link: '/cn/accounts/kimi-ai' },
                { text: 'Meta 登录', link: '/cn/accounts/meta' },
                { text: 'Vertex 导入', link: '/cn/accounts/vertex' },
                { text: 'xAI 登录', link: '/cn/accounts/xai' },
                { text: 'OAuth 目录与别名', link: '/cn/accounts/oauth' },
                { text: 'OAuth 回调', link: '/cn/accounts/oauth-callback' },
                { text: '凭证并发', link: '/cn/accounts/credentials' },
                { text: 'Claude 上游行为', link: '/cn/accounts/upstream' },
                { text: '上游 API 密钥', link: '/cn/accounts/api-keys-api' },
                { text: '上游基础地址', link: '/cn/accounts/api-keys-base' },
                { text: '上游模型别名', link: '/cn/accounts/api-keys-models' },
                { text: '模型名前缀', link: '/cn/accounts/api-keys-prefix' },
                { text: '凭证优先级', link: '/cn/accounts/api-keys-priority' },
                { text: '凭证权重', link: '/cn/accounts/api-keys-weight' },
                { text: '按密钥代理', link: '/cn/accounts/api-keys-proxy' },
                { text: '上游请求头', link: '/cn/accounts/api-keys-headers' },
                { text: '按密钥排除模型', link: '/cn/accounts/api-keys-excluded' },
                { text: '冷却与伪装开关', link: '/cn/accounts/api-keys-disable' },
                { text: '重试与请求级错误', link: '/cn/accounts/api-keys-request' },
                { text: 'Claude 伪装', link: '/cn/accounts/api-keys-cloak' },
                { text: 'Claude 指纹', link: '/cn/accounts/api-keys-fingerprint' },
                { text: '实验性 CCH', link: '/cn/accounts/api-keys-experimental' },
                { text: '原生工具搜索', link: '/cn/accounts/api-keys-native' },
                { text: '重建 system 消息', link: '/cn/accounts/api-keys-rebuild' },
                { text: 'WebSocket 传输', link: '/cn/accounts/api-keys-websockets' },
                { text: 'Alpha Search', link: '/cn/accounts/api-keys-alpha' },
                { text: 'Vertex Interactions', link: '/cn/accounts/api-keys-interactions' },
                { text: '停用兼容提供商', link: '/cn/accounts/api-keys-disabled' },
                { text: '兼容提供商名称', link: '/cn/accounts/api-keys-name' },
                { text: 'prompt_cache_key', link: '/cn/accounts/api-keys-support' },
                ],
            },
            {
                text: '配置',
                items: [
                    {text: '基础配置', link: '/cn/configuration/basic'},
                    {text: '配置选项', link: '/cn/configuration/options'},
                    {text: '凭证目录', link: '/cn/configuration/auth-dir'},
                    {text: '热重载', link: '/cn/configuration/hot-reloading'},
                    {
                        text: '存储',
                        items:[
                            {text: 'Git 存储', link: '/cn/configuration/storage/git'},
                            {text: 'PostgreSQL 存储', link: '/cn/configuration/storage/pgsql'},
                            {text: '对象存储', link: '/cn/configuration/storage/s3'},
                        ]
                    },
                    {
                        text: '提供商',
                        items:[
                            {text: '反重力', link: '/cn/configuration/provider/antigravity'},
                            {text: 'Claude Code', link: '/cn/configuration/provider/claude-code'},
                            {text: 'Codex', link: '/cn/configuration/provider/codex'},
                            {text: 'xAI / Grok', link: '/cn/configuration/provider/xai'},
                            {text: 'AI Studio', link: '/cn/configuration/provider/ai-studio'},
                            {text: 'OpenAI 兼容', link: '/cn/configuration/provider/openai-compatibility'},
                            {text: 'Claude Code 兼容', link: '/cn/configuration/provider/claude-code-compatibility'},
                            {text: 'Gemini 兼容', link: '/cn/configuration/provider/gemini-compatibility'},
                            {text: 'Codex 兼容', link: '/cn/configuration/provider/codex-compatibility'},
                        ]
                    },
                    {text: '思考量设置', link: '/cn/configuration/thinking'},
                ]
            },
            {
                text: '管理',
                items: [
                    {text: 'Web UI', link: '/cn/management/webui'},
                    {text: '桌面客户端', link: '/cn/management/gui'},
                    {text: '管理 API v8', link: '/cn/management/apiv8'},
                    {text: '管理 API', link: '/cn/management/api'},
                    {text: 'Redis 用量队列', link: '/cn/management/redis-usage-queue'},
                ]
            },
            {
                text: '代理客户端配置',
                items: [
                    {text: 'Claude Code', link: '/cn/agent-client/claude-code'},
                    {text: 'Codex', link: '/cn/agent-client/codex'},
                    {text: 'Factory Droid', link: '/cn/agent-client/droid'},
                    {text: 'OpenCode', link: '/cn/agent-client/opencode'},
                    {text: 'Grok Build', link: '/cn/agent-client/grok-build'},
                    {text: 'PI', link: '/cn/agent-client/pi'}
                ]
            },
            {
                text: '插件',
                items: [
                    {text: '插件开发', link: '/cn/plugin/development'},
                    {
                        text: '入口能力',
                        items: [
                            {text: '模型注册器', link: '/cn/plugin/model-registrar'},
                            {text: '模型提供方', link: '/cn/plugin/model-provider'},
                            {text: '凭证提供方', link: '/cn/plugin/auth-provider'},
                            {text: '前端认证提供方', link: '/cn/plugin/frontend-auth-provider'},
                            {text: '前端认证独占模式', link: '/cn/plugin/frontend-auth-exclusive'},
                            {text: '调度器', link: '/cn/plugin/scheduler'},
                            {text: '模型路由', link: '/cn/plugin/model-router'},
                            {text: '执行器', link: '/cn/plugin/executor'},
                        ]
                    },
                    {
                        text: '请求处理',
                        items: [
                            {text: '请求转换', link: '/cn/plugin/request-translator'},
                            {text: '请求规整', link: '/cn/plugin/request-normalizer'},
                            {text: '请求拦截', link: '/cn/plugin/request-interceptor'},
                        ]
                    },
                    {
                        text: '响应处理',
                        items: [
                            {text: '响应转换', link: '/cn/plugin/response-translator'},
                            {text: '响应转换前规整', link: '/cn/plugin/response-before-translator'},
                            {text: '响应转换后规整', link: '/cn/plugin/response-after-translator'},
                            {text: '响应拦截', link: '/cn/plugin/response-interceptor'},
                            {text: '流式响应拦截', link: '/cn/plugin/response-stream-interceptor'},
                        ]
                    },
                    {
                        text: '扩展与回调',
                        items: [
                            {text: 'Thinking 处理', link: '/cn/plugin/thinking-applier'},
                            {text: '用量观察', link: '/cn/plugin/usage-plugin'},
                            {text: '命令行扩展', link: '/cn/plugin/command-line-plugin'},
                            {text: 'Management API', link: '/cn/plugin/management-api'},
                            {text: '宿主回调', link: '/cn/plugin/host-callbacks'},
                        ]
                    },
                ]
            },
            {
                text: 'Docker',
                items: [
                    {text: '使用 Docker Compose', link: '/cn/docker/docker'},
                    {text: 'Docker Compose 导读', link: '/cn/docker/docker-compose'},
                ]
            },
            {
                text: '配置案例',
                items: [
                    {text: '零：配置详细解说', link: '/cn/hands-on/tutorial-0'},
                    {text: '叁：NanoBanana实战', link: '/cn/hands-on/tutorial-3'},
                    {text: '肆：中转转发接入篇', link: '/cn/hands-on/tutorial-4'},
                    {text: '伍：Docker服务器部署', link: '/cn/hands-on/tutorial-5'},
                    {text: '陆：新人最爱GUI', link: '/cn/hands-on/tutorial-6'},
                    {text: '云部署（自带存储）', link: '/cn/hands-on/tutorial-7'},
                    {text: '云部署（数据库存储）', link: '/cn/hands-on/tutorial-8'},
                    {text: '云部署（对象存储）', link: '/cn/hands-on/tutorial-9'},
                    {text: '云部署（Git存储）', link: '/cn/hands-on/tutorial-10'},
                    {text: '零成本部署AIStudio反代', link: '/cn/hands-on/tutorial-11'},
                ]
            },

        ],
 
        socialLinks: [
            {icon: 'github', link: 'https://github.com/router-for-me/CLIProxyAPI'}
        ],

        docFooter: {
            prev: '上一页',
            next: '下一页'
        },

        outline: {
            label: '页面导航'
        },

        lastUpdated: {
            text: '最后更新于'
        },

        notFound: {
            title: '页面未找到',
            quote:
                '但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。',
            linkLabel: '前往首页',
            linkText: '带我回首页'
        },

        langMenuLabel: '多语言',
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        skipToContentLabel: '跳转到内容',

        footer: {
            message: '基于 MIT 协议发布',
            copyright: '版权所有 © 2025-至今 Router-For.ME'
        },
    },
})
