import { resolve } from 'path';
import preact from '@preact/preset-vite';
import { defineConfig, loadEnv } from 'vite';
import { existsSync } from 'fs';

export default defineConfig(({ mode }) => {
  // 安全地加载环境变量，即使 .env 文件不存在或无法读取也不会报错
  let env = process.env;
  try {
    // 只有在 .env 文件存在时才尝试加载
    if (existsSync('.env') || existsSync('.env.local')) {
      try {
        env = loadEnv(mode, process.cwd(), '');
      } catch (loadError) {
        // 如果 loadEnv 失败（例如权限问题），使用 process.env
        console.warn('无法加载 .env 文件，使用 process.env');
        env = process.env;
      }
    }
  } catch (error) {
    // 如果检查文件存在性失败，使用 process.env
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
