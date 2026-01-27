import { Provider } from 'jotai';
import { createRoot } from 'react-dom/client';
import './css/global.scss';
import { Desktop } from './views/desktop/Desktop';

// 错误处理：确保即使应用初始化失败也能显示内容
const showRootElement = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.style.opacity = '1';
  }
};

window.addEventListener('error', (event) => {
  console.error('全局错误:', event.error);
  showRootElement();
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的 Promise 拒绝:', event.reason);
  showRootElement();
});

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('找不到 root 元素');
  }

  const root = createRoot(rootElement);
  root.render(
    <Provider>
      <Desktop />
    </Provider>
  );

  // 确保在 React 渲染后显示内容
  setTimeout(() => {
    rootElement.style.opacity = '1';
  }, 100);
} catch (error) {
  console.error('应用初始化失败:', error);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: system-ui, sans-serif;">
        <h1>应用加载失败</h1>
        <p>请刷新页面重试。如果问题持续存在，请联系支持。</p>
        <p style="color: #666; font-size: 12px;">错误信息: ${error instanceof Error ? error.message : String(error)}</p>
      </div>
    `;
    rootElement.style.opacity = '1';
  }
}
