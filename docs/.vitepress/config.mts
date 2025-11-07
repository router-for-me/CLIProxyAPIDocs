import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "CLIProxyAPI",
    description: "Wrap Gemini CLI, ChatGPT Codex, Claude Code, Qwen Code, iFlow as an OpenAI/Gemini/Claude/Codex compatible API service, allowing you to enjoy the free Gemini 2.5 Pro, GPT 5, Claude, Qwen model through API",
    rewrites: {
        'en/:rest*': ':rest*'
    },
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: 'Home', link: '/'},
            {text: 'Quick Start', link: '/introduction/quick-start'}
        ],

        sidebar: [
            {
                text: 'Introduction',
                items: [
                    {text: 'What is CLIProxyAPI?', link: '/introduction/what-is-cliproxyapi'},
                    {text: 'Quick Start', link: '/introduction/quick-start'},
                    {text: 'GitHub', link: 'https://github.com/router-for-me/CLIProxyAPI'}
                ]
            },
            {
                text: 'Configuration',
                items: [
                    {text: 'Basic Configuration', link: '/configuration/basic'},
                    {text: 'Configuration Options', link: '/configuration/options'},
                    {text: 'Authentication Directory', link: '/configuration/auth-dir'},
                    {text: 'Hot Reloading', link: '/configuration/hot-reloading'},
                    {
                        text: 'Storage',
                        items:[
                            {text: 'Git Storage', link: '/configuration/storage/git'},
                            {text: 'PostgreSQL Storage', link: '/configuration/storage/pgsql'},
                            {text: 'Object Storage', link: '/configuration/storage/s3'},
                        ]
                    },
                    {
                        text: 'Providers',
                        items:[
                            {text: 'Gemini CLI', link: '/configuration/provider/gemini-cli'},
                            {text: 'Claude Code', link: '/configuration/provider/claude-code'},
                            {text: 'Codex', link: '/configuration/provider/codex'},
                            {text: 'Qwen Code', link: '/configuration/provider/qwen-code'},
                            {text: 'iFlow', link: '/configuration/provider/iflow'},
                            {text: 'AI Studio', link: '/configuration/provider/ai-studio'},
                            {text: 'OpenAI Compatibility', link: '/configuration/provider/openai-compatibility'},
                            {text: 'Claude Code Compatibility', link: '/configuration/provider/claude-code-compatibility'},
                            {text: 'Gemini Compatibility', link: '/configuration/provider/gemini-compatibility'},
                            {text: 'Codex Compatibility', link: '/configuration/provider/codex-compatibility'},
                        ]
                    },
                ]
            },
            {
                text: 'Management',
                items: [
                    {text: 'Web UI', link: '/management/webui'},
                    {text: 'Desktop GUI', link: '/management/gui'},
                    {text: 'Management API', link: '/management/api'},
                ]
            },
            {
                text: 'Agent Client Configuration',
                items: [
                    {text: 'Claude Code', link: '/agent-client/claude-code'},
                    {text: 'Codex', link: '/agent-client/codex'},
                    {text: 'Gemini CLI', link: '/agent-client/gemini-cli'},
                    {text: 'Factory Droid', link: '/agent-client/droid'}
                ]
            },
            {
                text: 'Docker',
                items: [
                    {text: 'Run with Docker', link: '/docker/docker'},
                    {text: 'Run with Docker Compose', link: '/docker/docker-compose'},
                ]
            },
            {
                text: 'Hands-on Tutorials',
                items: [
                    {text: 'Zero: Detailed Configuration Explanation', link: '/hands-on/tutorial-0'},
                    {text: 'One: Project Introduction + Qwen Hands-on', link: '/hands-on/tutorial-1'},
                    {text: 'Two: Gemini CLI + Codex Hands-on', link: '/hands-on/tutorial-2'},
                    {text: 'Three: NanoBanana Hands-on', link: '/hands-on/tutorial-3'},
                    {text: 'Four: Relay Forwarding Integration', link: '/hands-on/tutorial-4'},
                    {text: 'Five: Docker Server Deployment', link: '/hands-on/tutorial-5'},
                    {text: 'Six: The Beginner\'s Favorite GUI', link: '/hands-on/tutorial-6'},
                    {text: 'Zero-Cost Deployment (ClawCloud)', link: '/hands-on/tutorial-7'},
                    {text: 'Zero-Cost Deployment (HuggingFace)', link: '/hands-on/tutorial-8'},
                    {text: 'Zero-Cost Deployment (Railway)', link: '/hands-on/tutorial-9'},
                    {text: 'Zero-Cost Deployment (Render)', link: '/hands-on/tutorial-10'},
                    {text: 'Zero-Cost Deployment (AIStudio Reverse Proxy)', link: '/hands-on/tutorial-11'},
                ]
            },
        ],

        socialLinks: [
            {icon: 'github', link: 'https://github.com/router-for-me/CLIProxyAPI'}
        ],


        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2025-present Router-For.ME'
        },
    },
    locales: {
        root: {
            label: 'English',
            lang: 'en-US',
            link: '/'
        },
        cn: {
            label: '简体中文',
            lang: 'zh-Hans',
            link: '/cn'
        }
    }
})