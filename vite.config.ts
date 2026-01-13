import { resolve } from 'path';
import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';

export default defineConfig({
  root: process.cwd(),
  plugins: [preact()],
  resolve: {
    alias: {
      __: resolve(__dirname, './src'),
    },
  },
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: false,
  },
  build: {
    brotliSize: false,
  },
});
