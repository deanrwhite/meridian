import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { ORGANIZATIONS, ALL_ENTRIES } from './src/data/briefing';

// GitHub Pages has no SPA rewrites. Emit a copy of index.html for every known route
// (Pages serves /meridian/org/spacex from org/spacex.html with HTTP 200), and
// 404.html as the fallback for anything else.
const spaRoutes = (): Plugin => ({
  name: 'spa-routes',
  apply: 'build',
  closeBundle() {
    const index = resolve('dist/index.html');
    const routes = ['404', 'roster', ...ORGANIZATIONS.map((o) => `org/${o.id}`), ...ALL_ENTRIES.map((e) => `activity/${e.id}`)];
    for (const r of routes) {
      const out = resolve('dist', `${r}.html`);
      mkdirSync(dirname(out), { recursive: true });
      copyFileSync(index, out);
    }
  },
});

// Production builds (and `vite preview`) are served from https://deanrwhite.github.io/meridian/; dev stays at '/'.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/meridian/' : '/',
  plugins: [react(), spaRoutes()],
  server: { host: '0.0.0.0', port: 8080, strictPort: true },
}));
