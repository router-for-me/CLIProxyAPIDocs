import { defineConfig } from 'vitepress'
import cnConfig from '../cn/config'

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'CLIProxyAPI',
	description:
		'Wrap ChatGPT Codex, Claude Code, and other model providers as an OpenAI/Gemini/Claude/Codex compatible API service.',
	rewrites: {
		'en/:rest*': ':rest*',
	},

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
					{ text: 'Command-line flags', link: '/introduction/install' },
					{ text: 'Model catalogs', link: '/introduction/models' },
					{
						text: 'GitHub',
						link: 'https://github.com/router-for-me/CLIProxyAPI',
					},
				],
			},
			{
				text: 'API',
				items: [
					{ text: 'Client API keys', link: '/api/access' },
					{ text: 'OpenAI Chat', link: '/api/openai-chat' },
					{ text: 'Responses', link: '/api/responses' },
					{ text: 'Claude Messages', link: '/api/claude-messages' },
					{ text: 'Gemini', link: '/api/gemini' },
					{ text: 'Images, speech, and video', link: '/api/media' },
					{ text: 'Realtime sessions', link: '/api/realtime' },
					{ text: 'Other endpoints', link: '/api/openai-other' },
				],
			},
			{
			    text: 'Accounts and upstreams',
			    items: [
			    { text: 'Antigravity login', link: '/accounts/antigravity' },
			    { text: 'Claude login', link: '/accounts/claude' },
			    { text: 'Codex login', link: '/accounts/codex' },
			    { text: 'Devin login', link: '/accounts/devin' },
			    { text: 'Kimi login', link: '/accounts/kimi' },
			    { text: 'Kimi.ai login', link: '/accounts/kimi-ai' },
			    { text: 'Meta login', link: '/accounts/meta' },
			    { text: 'Vertex import', link: '/accounts/vertex' },
			    { text: 'xAI login', link: '/accounts/xai' },
			    { text: 'OAuth directory and aliases', link: '/accounts/oauth' },
			    { text: 'OAuth callbacks', link: '/accounts/oauth-callback' },
			    { text: 'Credential concurrency', link: '/accounts/credentials' },
			    { text: 'Claude upstream behavior', link: '/accounts/upstream' },
			    { text: 'Upstream API keys', link: '/accounts/api-keys-api' },
			    { text: 'Upstream base URLs', link: '/accounts/api-keys-base' },
			    { text: 'Upstream model aliases', link: '/accounts/api-keys-models' },
			    { text: 'Model prefixes', link: '/accounts/api-keys-prefix' },
			    { text: 'Credential priority', link: '/accounts/api-keys-priority' },
			    { text: 'Credential weight', link: '/accounts/api-keys-weight' },
			    { text: 'Per-key proxy', link: '/accounts/api-keys-proxy' },
			    { text: 'Upstream headers', link: '/accounts/api-keys-headers' },
			    { text: 'Per-key excluded models', link: '/accounts/api-keys-excluded' },
			    { text: 'Cooling and cloak switches', link: '/accounts/api-keys-disable' },
			    { text: 'Retry and scoped errors', link: '/accounts/api-keys-request' },
			    { text: 'Claude cloaking', link: '/accounts/api-keys-cloak' },
			    { text: 'Claude fingerprint', link: '/accounts/api-keys-fingerprint' },
			    { text: 'Experimental CCH', link: '/accounts/api-keys-experimental' },
			    { text: 'Native tool search', link: '/accounts/api-keys-native' },
			    { text: 'Rebuild system messages', link: '/accounts/api-keys-rebuild' },
			    { text: 'WebSocket transport', link: '/accounts/api-keys-websockets' },
			    { text: 'Alpha Search', link: '/accounts/api-keys-alpha' },
			    { text: 'Vertex Interactions', link: '/accounts/api-keys-interactions' },
			    { text: 'Disable a compatible provider', link: '/accounts/api-keys-disabled' },
			    { text: 'Compatible provider name', link: '/accounts/api-keys-name' },
			    { text: 'prompt_cache_key', link: '/accounts/api-keys-support' },
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
								text: 'Antigravity',
								link: '/configuration/provider/antigravity',
							},
							{
								text: 'Claude Code',
								link: '/configuration/provider/claude-code',
							},
							{ text: 'Codex', link: '/configuration/provider/codex' },
							{ text: 'xAI / Grok', link: '/configuration/provider/xai' },
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
					{ text: 'Management API v8', link: '/management/apiv8' },
					{ text: 'Management API', link: '/management/api' },
					{
						text: 'Redis Usage Queue',
						link: '/management/redis-usage-queue',
					},
				],
			},
			{
				text: 'Agent Client Configuration',
				items: [
					{ text: 'Claude Code', link: '/agent-client/claude-code' },
					{ text: 'Codex', link: '/agent-client/codex' },
					{ text: 'Factory Droid', link: '/agent-client/droid' },
					{ text: 'OpenCode', link: '/agent-client/opencode' },
					{text: 'Grok Build', link: '/agent-client/grok-build'},
					{text: 'PI', link: '/agent-client/pi'}
				],
			},
			{
				text: 'Plugins',
				items: [
					{ text: 'Plugin Development', link: '/plugin/development' },
					{
						text: 'Entry Capabilities',
						items: [
							{ text: 'Model Registrar', link: '/plugin/model-registrar' },
							{ text: 'Model Provider', link: '/plugin/model-provider' },
							{ text: 'Credential Provider', link: '/plugin/auth-provider' },
							{
								text: 'Frontend Authentication Provider',
								link: '/plugin/frontend-auth-provider',
							},
							{
								text: 'Frontend Authentication Exclusive Mode',
								link: '/plugin/frontend-auth-exclusive',
							},
							{ text: 'Scheduler', link: '/plugin/scheduler' },
							{ text: 'Model Router', link: '/plugin/model-router' },
							{ text: 'Executor', link: '/plugin/executor' },
						],
					},
					{
						text: 'Request Processing',
						items: [
							{ text: 'Request Translator', link: '/plugin/request-translator' },
							{ text: 'Request Normalizer', link: '/plugin/request-normalizer' },
							{ text: 'Request Interceptor', link: '/plugin/request-interceptor' },
						],
					},
					{
						text: 'Response Processing',
						items: [
							{ text: 'Response Translator', link: '/plugin/response-translator' },
							{
								text: 'Response Pre-Translation Normalizer',
								link: '/plugin/response-before-translator',
							},
							{
								text: 'Response Post-Translation Normalizer',
								link: '/plugin/response-after-translator',
							},
							{ text: 'Response Interceptor', link: '/plugin/response-interceptor' },
							{
								text: 'Streaming Response Interceptor',
								link: '/plugin/response-stream-interceptor',
							},
						],
					},
					{
						text: 'Extensions And Callbacks',
						items: [
							{ text: 'Thinking Applier', link: '/plugin/thinking-applier' },
							{ text: 'Usage Observer', link: '/plugin/usage-plugin' },
							{
								text: 'Command Line Extension',
								link: '/plugin/command-line-plugin',
							},
							{ text: 'Management API', link: '/plugin/management-api' },
							{ text: 'Host Callbacks', link: '/plugin/host-callbacks' },
						],
					},
				],
			},
			{
				text: 'Docker',
				items: [
					{ text: 'Docker Compose', link: '/docker/docker' },
					{ text: 'Docker Compose guide', link: '/docker/docker-compose' },
				],
			},
			{
				text: 'Hands-on Tutorials',
				items: [
					{
						text: 'Zero: Detailed Configuration Explanation',
						link: '/hands-on/tutorial-0',
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
			themeConfig: cnConfig.themeConfig,
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
							{ text: 'Параметры командной строки', link: '/ru/introduction/install' },
							{ text: 'Каталоги моделей', link: '/ru/introduction/models' },
							{
								text: 'GitHub',
								link: 'https://github.com/router-for-me/CLIProxyAPI',
							},
						],
					},
					{
						text: 'API',
						items: [
							{ text: 'Клиентские ключи', link: '/ru/api/access' },
							{ text: 'OpenAI Chat', link: '/ru/api/openai-chat' },
							{ text: 'Responses', link: '/ru/api/responses' },
							{ text: 'Claude Messages', link: '/ru/api/claude-messages' },
							{ text: 'Gemini', link: '/ru/api/gemini' },
							{ text: 'Изображения, речь и видео', link: '/ru/api/media' },
							{ text: 'Сеансы реального времени', link: '/ru/api/realtime' },
							{ text: 'Прочие конечные точки', link: '/ru/api/openai-other' },
						],
					},
					{
					    text: 'Учётные записи и upstream',
					    items: [
					    { text: 'Вход Antigravity', link: '/ru/accounts/antigravity' },
					    { text: 'Вход Claude', link: '/ru/accounts/claude' },
					    { text: 'Вход Codex', link: '/ru/accounts/codex' },
					    { text: 'Вход Devin', link: '/ru/accounts/devin' },
					    { text: 'Вход Kimi', link: '/ru/accounts/kimi' },
					    { text: 'Вход Kimi.ai', link: '/ru/accounts/kimi-ai' },
					    { text: 'Вход Meta', link: '/ru/accounts/meta' },
					    { text: 'Импорт Vertex', link: '/ru/accounts/vertex' },
					    { text: 'Вход xAI', link: '/ru/accounts/xai' },
					    { text: 'Каталог и псевдонимы OAuth', link: '/ru/accounts/oauth' },
					    { text: 'Обратные вызовы OAuth', link: '/ru/accounts/oauth-callback' },
					    { text: 'Параллелизм учётных данных', link: '/ru/accounts/credentials' },
					    { text: 'Поведение Claude upstream', link: '/ru/accounts/upstream' },
					    { text: 'Ключи upstream API', link: '/ru/accounts/api-keys-api' },
					    { text: 'Базовые URL upstream', link: '/ru/accounts/api-keys-base' },
					    { text: 'Псевдонимы моделей upstream', link: '/ru/accounts/api-keys-models' },
					    { text: 'Префиксы моделей', link: '/ru/accounts/api-keys-prefix' },
					    { text: 'Приоритет учётных данных', link: '/ru/accounts/api-keys-priority' },
					    { text: 'Вес учётных данных', link: '/ru/accounts/api-keys-weight' },
					    { text: 'Прокси ключа', link: '/ru/accounts/api-keys-proxy' },
					    { text: 'Заголовки upstream', link: '/ru/accounts/api-keys-headers' },
					    { text: 'Исключённые модели ключа', link: '/ru/accounts/api-keys-excluded' },
					    { text: 'Охлаждение и маскировка', link: '/ru/accounts/api-keys-disable' },
					    { text: 'Повторы и ошибки запроса', link: '/ru/accounts/api-keys-request' },
					    { text: 'Маскировка Claude', link: '/ru/accounts/api-keys-cloak' },
					    { text: 'Отпечаток Claude', link: '/ru/accounts/api-keys-fingerprint' },
					    { text: 'Экспериментальный CCH', link: '/ru/accounts/api-keys-experimental' },
					    { text: 'Нативный поиск инструментов', link: '/ru/accounts/api-keys-native' },
					    { text: 'Перестройка system', link: '/ru/accounts/api-keys-rebuild' },
					    { text: 'Транспорт WebSocket', link: '/ru/accounts/api-keys-websockets' },
					    { text: 'Alpha Search', link: '/ru/accounts/api-keys-alpha' },
					    { text: 'Vertex Interactions', link: '/ru/accounts/api-keys-interactions' },
					    { text: 'Отключение совместимого провайдера', link: '/ru/accounts/api-keys-disabled' },
					    { text: 'Имя совместимого провайдера', link: '/ru/accounts/api-keys-name' },
					    { text: 'prompt_cache_key', link: '/ru/accounts/api-keys-support' },
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
										text: 'Antigravity',
										link: '/ru/configuration/provider/antigravity',
									},
									{
										text: 'Claude Code',
										link: '/ru/configuration/provider/claude-code',
									},
									{ text: 'Codex', link: '/ru/configuration/provider/codex' },
									{ text: 'xAI / Grok', link: '/ru/configuration/provider/xai' },
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
							{ text: 'Management API v8', link: '/ru/management/apiv8' },
							{ text: 'Management API', link: '/ru/management/api' },
							{
								text: 'Redis Usage Queue',
								link: '/ru/management/redis-usage-queue',
							},
						],
					},
					{
						text: 'Конфигурация клиентов агентов',
						items: [
							{ text: 'Claude Code', link: '/ru/agent-client/claude-code' },
							{ text: 'Codex', link: '/ru/agent-client/codex' },
							{ text: 'Factory Droid', link: '/ru/agent-client/droid' },
							{ text: 'OpenCode', link: '/ru/agent-client/opencode' },
							{ text: 'Grok Build', link: '/ru/agent-client/grok-build' },
							{ text: 'PI', link: '/ru/agent-client/pi' }
						],
					},
					{
						text: 'Плагины',
						items: [
							{ text: 'Разработка плагинов', link: '/ru/plugin/development' },
							{
								text: 'Входные возможности',
								items: [
									{
										text: 'Регистратор моделей',
										link: '/ru/plugin/model-registrar',
									},
									{
										text: 'Провайдер моделей',
										link: '/ru/plugin/model-provider',
									},
									{
										text: 'Провайдер учётных данных',
										link: '/ru/plugin/auth-provider',
									},
									{
										text: 'Провайдер фронтенд-аутентификации',
										link: '/ru/plugin/frontend-auth-provider',
									},
									{
										text: 'Эксклюзивный режим фронтенд-аутентификации',
										link: '/ru/plugin/frontend-auth-exclusive',
									},
									{ text: 'Планировщик', link: '/ru/plugin/scheduler' },
									{
										text: 'Маршрутизатор моделей',
										link: '/ru/plugin/model-router',
									},
									{ text: 'Исполнитель', link: '/ru/plugin/executor' },
								],
							},
							{
								text: 'Обработка запросов',
								items: [
									{
										text: 'Преобразование запросов',
										link: '/ru/plugin/request-translator',
									},
									{
										text: 'Нормализация запросов',
										link: '/ru/plugin/request-normalizer',
									},
									{
										text: 'Перехват запросов',
										link: '/ru/plugin/request-interceptor',
									},
								],
							},
							{
								text: 'Обработка ответов',
								items: [
									{
										text: 'Преобразование ответов',
										link: '/ru/plugin/response-translator',
									},
									{
										text: 'Нормализация ответа перед преобразованием',
										link: '/ru/plugin/response-before-translator',
									},
									{
										text: 'Нормализация ответа после преобразования',
										link: '/ru/plugin/response-after-translator',
									},
									{
										text: 'Перехват ответов',
										link: '/ru/plugin/response-interceptor',
									},
									{
										text: 'Перехват стриминговых ответов',
										link: '/ru/plugin/response-stream-interceptor',
									},
								],
							},
							{
								text: 'Расширения и callback',
								items: [
									{ text: 'Thinking applier', link: '/ru/plugin/thinking-applier' },
									{
										text: 'Наблюдение за использованием',
										link: '/ru/plugin/usage-plugin',
									},
									{
										text: 'Расширение командной строки',
										link: '/ru/plugin/command-line-plugin',
									},
									{ text: 'Management API', link: '/ru/plugin/management-api' },
									{ text: 'Callback хоста', link: '/ru/plugin/host-callbacks' },
								],
							},
						],
					},
					{
						text: 'Docker',
						items: [
							{ text: 'Docker Compose', link: '/ru/docker/docker' },
							{
								text: 'Обзор Docker Compose',
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
