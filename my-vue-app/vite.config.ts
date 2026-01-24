import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [vue(),tailwindcss()],
    server: {
        port: 3000,
        proxy: {
            // Proxy API requests to local dev server (if running)
            // For production, these will be handled by Vercel
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
