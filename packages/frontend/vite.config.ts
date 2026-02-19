import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    process.env.ANALYZE === 'true' &&
      visualizer({ open: true, gzipSize: true, filename: 'bundle-analysis.html' }),
  ].filter(Boolean),
  server: {
    port: 5173,
    proxy: {
      // Proxy /api/* requests to the Fastify backend during development.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
