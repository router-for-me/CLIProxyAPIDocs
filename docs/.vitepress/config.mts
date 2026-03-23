import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'CLIProxyAPI',
	description:
		'Wrap Gemini CLI, ChatGPT Codex, Claude Code, Qwen Code, iFlow as an OpenAI/Gemini/Claude/Codex compatible API service, allowing you to enjoy the free Gemini 2.5 Pro, GPT 5, Claude, Qwen model through API',
	rewrites: {
		'en/:rest*': ':rest*',
	},
	// ─── Shared sidebar builder ──────────────────────────────────────────────
	sidebar: [
		{
			text: 'Introduction',
			items: [
				{ text: 'What is CLIProxyAPI?', link: '/introduction/what-is-cliproxyapi' },
				{ text: 'Quick Start', link: '/introduction/quick-start' },
				{ text: 'GitHub', link: 'https://github.com/router-for-me/CLIProxyAPI' }
			]
		},
		{
			text: 'Configuration',
			items: [
				{ text: 'Basic Configuration', link: '/configuration/basic' },
				{ text: 'Configuration Options', link: '/configuration/options' },
				{ text: 'Authentication Directory', link: '/configuration/auth-dir' },
				{ text: 'Hot Reloading', link: '/configuration/hot-reloading' },
				{
					text: 'Storage',
					items: [
						{ text: 'Git Storage', link: '/configuration/storage/git' },
						{ text: 'PostgreSQL Storage', link: '/configuration/storage/pgsql' },
						{ text: 'Object Storage', link: '/configuration/storage/s3' },
					]
				},
				{
					text: 'Providers',
					items: [
						{ text: 'Gemini CLI', link: '/configuration/provider/gemini-cli' },
						{ text: 'Antigravity', link: '/configuration/provider/antigravity' },
						{ text: 'Claude Code', link: '/configuration/provider/claude-code' },
						{ text: 'Codex', link: '/configuration/provider/codex' },
						{ text: 'Qwen Code', link: '/configuration/provider/qwen-code' },
						{ text: 'iFlow', link: '/configuration/provider/iflow' },
						{ text: 'AI Studio', link: '/configuration/provider/ai-studio' },
						{ text: 'OpenAI Compatibility', link: '/configuration/provider/openai-compatibility' },
						{ text: 'Claude Code Compatibility', link: '/configuration/provider/claude-code-compatibility' },
						{ text: 'Gemini Compatibility', link: '/configuration/provider/gemini-compatibility' },
						{ text: 'Codex Compatibility', link: '/configuration/provider/codex-compatibility' },
					]
				},
				{ text: 'Thinking Budgets', link: '/configuration/thinking' },
			]
		},
		{
			text: 'Management',
			items: [
				{ text: 'Web UI', link: '/management/webui' },
				{ text: 'Desktop GUI', link: '/management/gui' },
				{ text: 'Management API', link: '/management/api' },
			]
		},
		{
			text: 'Agent Client Configuration',
			items: [
				{ text: 'Claude Code', link: '/agent-client/claude-code' },
				{ text: 'Codex', link: '/agent-client/codex' },
				{ text: 'Gemini CLI', link: '/agent-client/gemini-cli' },
				{ text: 'Factory Droid', link: '/agent-client/droid' },
				{ text: 'Amp CLI', link: '/agent-client/amp-cli' },
				{ text: 'OpenCode', link: '/agent-client/opencode' }
			]
		},
		{
			text: 'Docker',
			items: [
				{ text: 'Run with Docker', link: '/docker/docker' },
				{ text: 'Run with Docker Compose', link: '/docker/docker-compose' },
			]
		},
		{
			text: 'Hands-on Tutorials',
			items: [
				{ text: 'Zero: Detailed Configuration Explanation', link: '/hands-on/tutorial-0' },
				{ text: 'One: Project Introduction + Qwen Hands-on', link: '/hands-on/tutorial-1' },
				{ text: 'Two: Gemini CLI + Codex Hands-on', link: '/hands-on/tutorial-2' },
				{ text: 'Three: NanoBanana Hands-on', link: '/hands-on/tutorial-3' },
				{ text: 'Four: Relay Forwarding Integration', link: '/hands-on/tutorial-4' },
				{ text: 'Five: Docker Server Deployment', link: '/hands-on/tutorial-5' },
				{ text: 'Six: The Beginner\'s Favorite GUI', link: '/hands-on/tutorial-6' },
				{ text: 'Cloud Deployment (Built-in Storage)', link: '/hands-on/tutorial-7' },
				{ text: 'Cloud Deployment (Database Storage)', link: '/hands-on/tutorial-8' },
				{ text: 'Cloud Deployment (Object Storage)', link: '/hands-on/tutorial-9' },
				{ text: 'Cloud Deployment (Git Storage)', link: '/hands-on/tutorial-10' },
				{ text: 'Zero-Cost Deployment (AIStudio Reverse Proxy)', link: '/hands-on/tutorial-11' },
				{ text: 'AmpCode Usage Guide', link: '/hands-on/tutorial-12' },
			]
		},
	],


	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Quick Start', link: '/introduction/quick-start' },
		],

		sidebar: [
			{
				text: 'Introduction',
				items: [
					{
						text: 'What is CLIProxyAPI?',
						link: '/introduction/what-is-cliproxyapi',
					},
					{ text: 'Quick Start', link: '/introduction/quick-start' },
					{
						text: 'GitHub',
						link: 'https://github.com/router-for-me/CLIProxyAPI',
					},
				],
			},
			{
				text: 'Configuration',
				items: [
					{ text: 'Basic Configuration', link: '/configuration/basic' },
					{ text: 'Configuration Options', link: '/configuration/options' },
					{ text: 'Authentication Directory', link: '/configuration/auth-dir' },
					{ text: 'Hot Reloading', link: '/configuration/hot-reloading' },
					{
						text: 'Storage',
						items: [
							{ text: 'Git Storage', link: '/configuration/storage/git' },
							{
								text: 'PostgreSQL Storage',
								link: '/configuration/storage/pgsql',
							},
							{ text: 'Object Storage', link: '/configuration/storage/s3' },
						],
					},
					{
						text: 'Providers',
						items: [
							{
								text: 'Gemini CLI',
								link: '/configuration/provider/gemini-cli',
							},
							{
								text: 'Antigravity',
								link: '/configuration/provider/antigravity',
							},
							{
								text: 'Claude Code',
								link: '/configuration/provider/claude-code',
							},
							{ text: 'Codex', link: '/configuration/provider/codex' },
							{ text: 'Qwen Code', link: '/configuration/provider/qwen-code' },
							{ text: 'iFlow', link: '/configuration/provider/iflow' },
							{ text: 'AI Studio', link: '/configuration/provider/ai-studio' },
							{
								text: 'OpenAI Compatibility',
								link: '/configuration/provider/openai-compatibility',
							},
							{
								text: 'Claude Code Compatibility',
								link: '/configuration/provider/claude-code-compatibility',
							},
							{
								text: 'Gemini Compatibility',
								link: '/configuration/provider/gemini-compatibility',
							},
							{
								text: 'Codex Compatibility',
								link: '/configuration/provider/codex-compatibility',
							},
						],
					},
					{ text: 'Thinking Budgets', link: '/configuration/thinking' },
				],
			},
			{
				text: 'Management',
				items: [
					{ text: 'Web UI', link: '/management/webui' },
					{ text: 'Desktop GUI', link: '/management/gui' },
					{ text: 'Management API', link: '/management/api' },
				],
			},
			{
				text: 'Agent Client Configuration',
				items: [
					{ text: 'Claude Code', link: '/agent-client/claude-code' },
					{ text: 'Codex', link: '/agent-client/codex' },
					{ text: 'Gemini CLI', link: '/agent-client/gemini-cli' },
					{ text: 'Factory Droid', link: '/agent-client/droid' },
					{ text: 'Amp CLI', link: '/agent-client/amp-cli' },
				],
			},
			{
				text: 'Docker',
				items: [
					{ text: 'Run with Docker', link: '/docker/docker' },
					{ text: 'Run with Docker Compose', link: '/docker/docker-compose' },
				],
			},
			{
				text: 'Hands-on Tutorials',
				items: [
					{
						text: 'Zero: Detailed Configuration Explanation',
						link: '/hands-on/tutorial-0',
					},
					{
						text: 'One: Project Introduction + Qwen Hands-on',
						link: '/hands-on/tutorial-1',
					},
					{
						text: 'Two: Gemini CLI + Codex Hands-on',
						link: '/hands-on/tutorial-2',
					},
					{ text: 'Three: NanoBanana Hands-on', link: '/hands-on/tutorial-3' },
					{
						text: 'Four: Relay Forwarding Integration',
						link: '/hands-on/tutorial-4',
					},
					{
						text: 'Five: Docker Server Deployment',
						link: '/hands-on/tutorial-5',
					},
					{
						text: "Six: The Beginner's Favorite GUI",
						link: '/hands-on/tutorial-6',
					},
					{
						text: 'Cloud Deployment (Built-in Storage)',
						link: '/hands-on/tutorial-7',
					},
					{
						text: 'Cloud Deployment (Database Storage)',
						link: '/hands-on/tutorial-8',
					},
					{
						text: 'Cloud Deployment (Object Storage)',
						link: '/hands-on/tutorial-9',
					},
					{
						text: 'Cloud Deployment (Git Storage)',
						link: '/hands-on/tutorial-10',
					},
					{
						text: 'Zero-Cost Deployment (AIStudio Reverse Proxy)',
						link: '/hands-on/tutorial-11',
					},
					{ text: 'AmpCode Usage Guide', link: '/hands-on/tutorial-12' },
				],
			},
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/router-for-me/CLIProxyAPI' },
		],

		footer: {
			message: 'Released under the MIT License.',
			copyright: 'Copyright © 2025-present Router-For.ME',
		},
	},
	locales: {
		root: {
			label: 'English',
			lang: 'en-US',
			link: '/',
		},
		cn: {
			label: '简体中文',
			lang: 'zh-Hans',
			link: '/cn',
		},
		ru: {
			label: 'Русский',
			lang: 'ru-RU',
			link: '/ru',
			themeConfig: {
				nav: [
					{ text: 'Главная', link: '/ru/' },
					{ text: 'Быстрый старт', link: '/ru/introduction/quick-start' },
				],
				sidebar: [
					{
						text: 'Введение',
						items: [
							{
								text: 'Что такое CLIProxyAPI?',
								link: '/ru/introduction/what-is-cliproxyapi',
							},
							{ text: 'Быстрый старт', link: '/ru/introduction/quick-start' },
							{
								text: 'GitHub',
								link: 'https://github.com/router-for-me/CLIProxyAPI',
							},
						],
					},
					{
						text: 'Конфигурация',
						items: [
							{ text: 'Базовая конфигурация', link: '/ru/configuration/basic' },
							{ text: 'Опции конфигурации', link: '/ru/configuration/options' },
							{
								text: 'Директория аутентификации',
								link: '/ru/configuration/auth-dir',
							},
							{
								text: 'Hot Reloading',
								link: '/ru/configuration/hot-reloading',
							},
							{
								text: 'Хранилище',
								items: [
									{
										text: 'Хранилище Git',
										link: '/ru/configuration/storage/git',
									},
									{
										text: 'Хранилище PostgreSQL',
										link: '/ru/configuration/storage/pgsql',
									},
									{
										text: 'Объектное хранилище',
										link: '/ru/configuration/storage/s3',
									},
								],
							},
							{
								text: 'Провайдеры',
								items: [
									{
										text: 'Gemini CLI',
										link: '/ru/configuration/provider/gemini-cli',
									},
									{
										text: 'Antigravity',
										link: '/ru/configuration/provider/antigravity',
									},
									{
										text: 'Claude Code',
										link: '/ru/configuration/provider/claude-code',
									},
									{ text: 'Codex', link: '/ru/configuration/provider/codex' },
									{
										text: 'Qwen Code',
										link: '/ru/configuration/provider/qwen-code',
									},
									{ text: 'iFlow', link: '/ru/configuration/provider/iflow' },
									{
										text: 'AI Studio',
										link: '/ru/configuration/provider/ai-studio',
									},
									{
										text: 'Совместимость с OpenAI',
										link: '/ru/configuration/provider/openai-compatibility',
									},
									{
										text: 'Совместимость с Claude Code',
										link: '/ru/configuration/provider/claude-code-compatibility',
									},
									{
										text: 'Совместимость с Gemini',
										link: '/ru/configuration/provider/gemini-compatibility',
									},
									{
										text: 'Совместимость с Codex',
										link: '/ru/configuration/provider/codex-compatibility',
									},
								],
							},
							{ text: 'Thinking Budgets', link: '/ru/configuration/thinking' },
						],
					},
					{
						text: 'Управление',
						items: [
							{ text: 'Web UI', link: '/ru/management/webui' },
							{ text: 'Desktop GUI', link: '/ru/management/gui' },
							{ text: 'Management API', link: '/ru/management/api' },
						],
					},
					{
						text: 'Конфигурация клиентов агентов',
						items: [
							{ text: 'Claude Code', link: '/ru/agent-client/claude-code' },
							{ text: 'Codex', link: '/ru/agent-client/codex' },
							{ text: 'Gemini CLI', link: '/ru/agent-client/gemini-cli' },
							{ text: 'Factory Droid', link: '/ru/agent-client/droid' },
							{ text: 'Amp CLI', link: '/ru/agent-client/amp-cli' },
						],
					},
					{
						text: 'Docker',
						items: [
							{ text: 'Запуск с Docker', link: '/ru/docker/docker' },
							{
								text: 'Запуск с Docker Compose',
								link: '/ru/docker/docker-compose',
							},
						],
					},
					{
						text: 'Практические руководства',
						items: [
							{
								text: 'Zero: Подробное объяснение конфигурации',
								link: '/ru/hands-on/tutorial-0',
							},
							{
								text: 'One: Введение в проект + практика с Qwen',
								link: '/ru/hands-on/tutorial-1',
							},
							{
								text: 'Two: Gemini CLI + практика с Codex',
								link: '/ru/hands-on/tutorial-2',
							},
							{
								text: 'Three: Практика с NanoBanana',
								link: '/ru/hands-on/tutorial-3',
							},
							{
								text: 'Four: Интеграция Relay Forwarding',
								link: '/ru/hands-on/tutorial-4',
							},
							{
								text: 'Five: Развёртывание сервера Docker',
								link: '/ru/hands-on/tutorial-5',
							},
							{
								text: 'Six: Любимый GUI для новичков',
								link: '/ru/hands-on/tutorial-6',
							},
							{
								text: 'Облачное развёртывание (встроенное хранилище)',
								link: '/ru/hands-on/tutorial-7',
							},
							{
								text: 'Облачное развёртывание (база данных)',
								link: '/ru/hands-on/tutorial-8',
							},
							{
								text: 'Облачное развёртывание (объектное хранилище)',
								link: '/ru/hands-on/tutorial-9',
							},
							{
								text: 'Облачное развёртывание (Git хранилище)',
								link: '/ru/hands-on/tutorial-10',
							},
							{
								text: 'Бесплатное развёртывание (AIStudio Reverse Proxy)',
								link: '/ru/hands-on/tutorial-11',
							},
							{
								text: 'Руководство по использованию AmpCode',
								link: '/ru/hands-on/tutorial-12',
							},
						],
					},
				],
				docFooter: {
					prev: 'Предыдущая страница',
					next: 'Следующая страница',
				},
				outline: {
					label: 'На этой странице',
				},
				langMenuLabel: 'Язык',
				returnToTopLabel: 'Вернуться наверх',
				sidebarMenuLabel: 'Меню',
				darkModeSwitchLabel: 'Тема',
				lightModeSwitchTitle: 'Светлая тема',
				darkModeSwitchTitle: 'Тёмная тема',
				footer: {
					message: 'Лицензия MIT.',
					copyright: 'Copyright © 2025-настоящее время Router-For.ME',
				},
			},
		},
	},
})
