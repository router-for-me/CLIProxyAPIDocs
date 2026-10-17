import { defineConfig } from "vitepress";

export default defineConfig({
    themeConfig: {
        sidebar: [
            { text: 'Server', link: '/operations/server' },
        ],
    },
    locales: {
        ru: {
            themeConfig: {
                sidebar: [
                    { text: 'Server', link: '/ru/operations/server' },
                ],
            },
        },
    },
});
