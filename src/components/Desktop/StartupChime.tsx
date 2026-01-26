import clsx from 'clsx';
import { useEffect, useState } from 'react';
import css from './StartupChime.module.scss';

export const StartupChime = () => {
  const [hiddenSplashScreen, setHiddenSplashScreen] = useState(import.meta.env.DEV);

  useEffect(() => {
    // 基于实际加载状态隐藏启动画面，而不是固定延迟
    const hideSplash = () => {
      setHiddenSplashScreen(true);
    };

    // 如果页面已经加载完成，立即隐藏
    if (document.readyState === 'complete') {
      // 使用 requestIdleCallback 在浏览器空闲时隐藏，提供更流畅的体验
      if ('requestIdleCallback' in window) {
        requestIdleCallback(hideSplash, { timeout: 500 });
      } else {
        setTimeout(hideSplash, 100);
      }
      return;
    }

    // 监听页面加载完成
    const handleLoad = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(hideSplash, { timeout: 500 });
      } else {
        setTimeout(hideSplash, 100);
      }
    };

    // 监听 DOM 内容加载完成（更快）
    const handleDOMContentLoaded = () => {
      // DOM 加载完成后，等待一小段时间确保关键资源已加载
      setTimeout(() => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(hideSplash, { timeout: 300 });
        } else {
          setTimeout(hideSplash, 200);
        }
      }, 200);
    };

    // 如果 DOM 已经加载完成，直接处理
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      handleDOMContentLoaded();
    } else {
      window.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
      window.addEventListener('load', handleLoad);
    }

    // 最大延迟时间：如果 1.5 秒后仍未隐藏，强制隐藏（防止卡住）
    const maxDelayTimeout = setTimeout(hideSplash, 1500);

    return () => {
      window.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
      window.removeEventListener('load', handleLoad);
      clearTimeout(maxDelayTimeout);
    };
  }, []);

  return (
    <>
      <div
        className={clsx({
          [css.splashScreen]: true,
          [css.hidden]: hiddenSplashScreen,
        })}
        hidden={hiddenSplashScreen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 1024 1024" fill="white">
          <path d="M896 276.16c-5.44-121.92-134.08-184-384-184S134.08 153.92 128 276.16L32 732.16c0 131.84 160 200 480 200S992 864 992 732.16z m-128 424a80 80 0 0 1-160 0h-192a80 80 0 1 1-128-64 80 80 0 1 1 128-64h192a80 80 0 1 1 128 64 79.68 79.68 0 0 1 32 64z m-256-377.6c-141.44 0-256-34.56-256-76.8s114.56-76.8 256-76.8 256 34.24 256 76.8-114.56 76.8-256 76.8z" />
        </svg>
      </div>
      {/* 延迟加载启动音效，不阻塞页面渲染 */}
      {hiddenSplashScreen && import.meta.env.PROD && (
        <audio 
          hidden 
          autoPlay 
          src="/assets/sounds/mac-startup-sound.mp3"
          onLoadStart={() => {
            // 音效加载完成后播放
          }}
        />
      )}
    </>
  );
};
