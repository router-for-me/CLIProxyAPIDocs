import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "CLIProxyAPI",
    description: "Wrap Gemini CLI, ChatGPT Codex, Claude Code, Qwen Code, iFlow as an OpenAI/Gemini/Claude/Codex compatible API service, allowing you to enjoy the free Gemini 2.5 Pro, GPT 5, Claude, Qwen model through API",
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
                    {text: 'GitHub', link: 'https://github.com/router-for-me/CLIProxyAPI'}
                ]
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
                            {text: 'Gemini CLI', link: '/cn/configuration/provider/gemini-cli'},
                            {text: '反重力', link: '/cn/configuration/provider/antigravity'},
                            {text: 'Claude Code', link: '/cn/configuration/provider/claude-code'},
                            {text: 'Codex', link: '/cn/configuration/provider/codex'},
                            {text: 'Qwen Code', link: '/cn/configuration/provider/qwen-code'},
                            {text: 'iFlow', link: '/cn/configuration/provider/iflow'},
                            {text: 'AI Studio', link: '/cn/configuration/provider/ai-studio'},
                            {text: 'OpenAI 兼容', link: '/cn/configuration/provider/openai-compatibility'},
                            {text: 'Claude Code 兼容', link: '/cn/configuration/provider/claude-code-compatibility'},
                            {text: 'Gemini 兼容', link: '/cn/configuration/provider/gemini-compatibility'},
                            {text: 'Codex 兼容', link: '/cn/configuration/provider/codex-compatibility'},
                        ]
                    },
                ]
            },
            {
                text: '管理',
                items: [
                    {text: 'Web UI', link: '/cn/management/webui'},
                    {text: '桌面客户端', link: '/cn/management/gui'},
                    {text: '管理 API', link: '/cn/management/api'},
                ]
            },
            {
                text: '代理客户端配置',
                items: [
                    {text: 'Claude Code', link: '/cn/agent-client/claude-code'},
                    {text: 'Codex', link: '/cn/agent-client/codex'},
                    {text: 'Gemini CLI', link: '/cn/agent-client/gemini-cli'},
                    {text: 'Factory Droid', link: '/cn/agent-client/droid'},
                    {text: 'Amp CLI', link: '/cn/agent-client/amp-cli'}
                ]
            },
            {
                text: 'Docker',
                items: [
                    {text: '使用 Docker', link: '/cn/docker/docker'},
                    {text: '使用 Docker Compose', link: '/cn/docker/docker-compose'},
                ]
            },
            {
                text: '配置案例',
                items: [
                    {text: '零：配置详细解说', link: '/cn/hands-on/tutorial-0'},
                    {text: '壹：项目介绍+Qwen实战', link: '/cn/hands-on/tutorial-1'},
                    {text: '贰：Gemini CLI+Codex实战', link: '/cn/hands-on/tutorial-2'},
                    {text: '叁：NanoBanana实战', link: '/cn/hands-on/tutorial-3'},
                    {text: '肆：中转转发接入篇', link: '/cn/hands-on/tutorial-4'},
                    {text: '伍：Docker服务器部署', link: '/cn/hands-on/tutorial-5'},
                    {text: '陆：新人最爱GUI', link: '/cn/hands-on/tutorial-6'},
                    {text: '零成本部署（ClawCloud）', link: '/cn/hands-on/tutorial-7'},
                    {text: '零成本部署（HuggingFace）', link: '/cn/hands-on/tutorial-8'},
                    {text: '零成本部署（Railway）', link: '/cn/hands-on/tutorial-9'},
                    {text: '零成本部署（Render）', link: '/cn/hands-on/tutorial-10'},
                    {text: '零成本部署（AIStudio反代）', link: '/cn/hands-on/tutorial-11'},
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