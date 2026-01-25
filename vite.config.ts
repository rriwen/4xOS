import { resolve } from 'path';
import preact from '@preact/preset-vite';
import { defineConfig, loadEnv } from 'vite';
import { existsSync } from 'fs';

export default defineConfig(({ mode }) => {
  // 安全地加载环境变量，即使 .env 文件不存在也不会报错
  let env = {};
  try {
    // 只有在 .env 文件存在时才尝试加载
    if (existsSync('.env') || existsSync('.env.local')) {
      env = loadEnv(mode, process.cwd(), '');
    } else {
      // 如果文件不存在，从 process.env 中读取（Vercel 等平台会设置这些）
      env = process.env;
    }
  } catch (error) {
    // 如果加载失败，使用 process.env
    console.warn('无法加载 .env 文件，使用 process.env:', error.message);
    env = process.env;
  }
  
  return {
    root: process.cwd(),
    plugins: [preact()],
    resolve: {
      alias: {
        __: resolve(__dirname, './src'),
      },
    },
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: false,
    },
    build: {
      brotliSize: false,
    },
    // 确保环境变量在构建时可用
    define: {
      'import.meta.env.VITE_DEEPSEEK_API_KEY': JSON.stringify(env.VITE_DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY || ''),
    },
  };
});
