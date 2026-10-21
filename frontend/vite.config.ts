import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: false,
      injectRegister: false,
      registerType: 'prompt',
      includeAssets: ['manifest.json', 'pwa-192x192.png', 'pwa-512x512.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,json}'],
        navigateFallbackDenylist: [/^\/api(?:\/|$)/],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': 'http://127.0.0.1:3000',
    },
  },
});
