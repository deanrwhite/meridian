import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

// GitHub Pages SPA fallback: serve index.html for unknown deep links.
const spa404 = (): Plugin => ({
  name: 'spa-404',
  apply: 'build',
  closeBundle() { copyFileSync(resolve('dist/index.html'), resolve('dist/404.html')); },
});

// Production builds are served from https://deanrwhite.github.io/meridian/; dev stays at '/'.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/meridian/' : '/',
  plugins: [react(), spa404()],
  server: { host: '0.0.0.0', port: 8080, strictPort: true },
}));
