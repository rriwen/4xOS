import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { existsSync } from 'fs';

export default defineConfig(({ mode }) => {
  // 安全地加载环境变量，即使 .env 文件不存在或无法读取也不会报错
  let env = process.env;
  try {
    // 先检查文件是否存在和可读
    const envFile = '.env';
    const envLocalFile = `.env.${mode}.local`;
    const envModeFile = `.env.${mode}`;
    
    const canReadEnv = existsSync(envFile) || existsSync(envLocalFile) || existsSync(envModeFile);
    
    if (canReadEnv) {
      // 尝试加载环境变量，如果失败则使用 process.env
      env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
    }
  } catch (error) {
    // 如果 loadEnv 失败（例如权限问题或文件不存在），使用 process.env
    // 静默失败，不影响构建
    console.warn('无法加载 .env 文件，使用系统环境变量:', error instanceof Error ? error.message : String(error));
    env = process.env;
  }
  
  return {
    root: process.cwd(),
    base: '/',
    plugins: [react()],
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
      // 启用代码分割和优化
      rollupOptions: {
        output: {
          // 手动代码分割，将第三方库分离
          manualChunks: (id) => {
            // 将 node_modules 中的依赖分离
            if (id.includes('node_modules')) {
              // 将大型库单独打包
              if (id.includes('framer-motion')) {
                return 'framer-motion';
              }
              if (id.includes('jotai')) {
                return 'jotai';
              }
              if (id.includes('react-rnd')) {
                return 'react-rnd';
              }
              if (id.includes('date-fns')) {
                return 'date-fns';
              }
              // 其他第三方库打包到 vendor
              return 'vendor';
            }
            // 将应用配置相关代码分离
            if (id.includes('/data/apps/')) {
              return 'app-configs';
            }
          },
          // 优化 chunk 文件命名
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      // 启用压缩
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production', // 生产环境移除 console
          drop_debugger: true,
        },
      },
      // 资源内联阈值（小于 4kb 的资源内联为 base64）
      assetsInlineLimit: 4096,
      // 启用 CSS 代码分割
      cssCodeSplit: true,
      // 优化 chunk 大小警告阈值
      chunkSizeWarningLimit: 1000,
    },
    // 确保环境变量在构建时可用
    define: {
      'import.meta.env.VITE_DEEPSEEK_API_KEY': JSON.stringify(env.VITE_DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY || ''),
    },
  };
});
