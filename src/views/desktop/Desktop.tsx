import { useAtom } from 'jotai';
import { useImmerAtom } from 'jotai-immer';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ContextMenu } from '__/components/Desktop/ContextMenu/ContextMenu';
import { StartupChime } from '__/components/Desktop/StartupChime';
import { WindowsArea } from '__/components/Desktop/Window/WindowsArea';
import {
  activeAppStore,
  globalZIndexCounterStore,
  openAppsStore,
  windowZIndexStore,
} from '__/stores/apps.store';
import { themeAtom } from '__/stores/theme.store';
import css from './Desktop.module.scss';

// 懒加载非关键组件
const TopBar = lazy(() => import('__/components/topbar/TopBar').then(m => ({ default: m.TopBar })));
const Dock = lazy(() => import('__/components/dock/Dock').then(m => ({ default: m.Dock })));

export const Desktop = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [, setOpenApps] = useImmerAtom(openAppsStore);
  const [, setActiveApp] = useAtom(activeAppStore);
  const [, setWindowZIndices] = useAtom(windowZIndexStore);
  const [, setGlobalZIndexCounter] = useAtom(globalZIndexCounterStore);
  const [theme] = useAtom(themeAtom);
  const [wallpaperLoaded, setWallpaperLoaded] = useState(false);

  // 在页面加载时自动打开 "talk to 4x" 应用
  useEffect(() => {
    setOpenApps((apps: Record<string, boolean>) => {
      apps['talk-to-4x'] = true;
      return apps;
    });
    // 为初始窗口设置z-index
    const initialZIndex = 100;
    setGlobalZIndexCounter(initialZIndex);
    setWindowZIndices((prev) => {
      if (!prev['talk-to-4x']) {
        return { ...prev, 'talk-to-4x': initialZIndex };
      }
      return prev;
    });
    setActiveApp('talk-to-4x');
  }, [setOpenApps, setActiveApp, setWindowZIndices, setGlobalZIndexCounter]);

  // 预加载壁纸
  useEffect(() => {
    const wallpaperPath = theme === 'dark' 
      ? '/assets/wallpapers/dark-background.jpg'
      : '/assets/wallpapers/light-background.jpg';
    
    const img = new Image();
    
    img.onload = () => {
      setWallpaperLoaded(true);
      // 确保背景元素存在后再设置背景
      if (backgroundRef.current) {
        backgroundRef.current.style.backgroundImage = `url(${wallpaperPath})`;
        backgroundRef.current.style.opacity = '1';
      }
    };
    
    img.onerror = () => {
      // 即使加载失败也显示，使用 CSS 中的默认背景
      setWallpaperLoaded(true);
      if (backgroundRef.current) {
        backgroundRef.current.style.opacity = '1';
      }
    };
    
    // 开始加载图片
    img.src = wallpaperPath;
    
    // 如果图片已经在缓存中，onload 可能不会触发，检查 complete 属性
    if (img.complete) {
      setWallpaperLoaded(true);
      if (backgroundRef.current) {
        backgroundRef.current.style.backgroundImage = `url(${wallpaperPath})`;
        backgroundRef.current.style.opacity = '1';
      }
    }
  }, [theme]);

  return (
    <div>
      <main ref={outerRef} className={css.main}>
        <ContextMenu outerRef={outerRef as React.RefObject<HTMLDivElement>} />
        <Suspense fallback={null}>
          <TopBar />
        </Suspense>
        <WindowsArea />
        <Suspense fallback={null}>
          <Dock />
        </Suspense>
      </main>

      <StartupChime />

      <div 
        ref={backgroundRef} 
        className={css.backgroundCover} 
        aria-hidden="true"
        style={{ opacity: wallpaperLoaded ? 1 : 0 }}
      />
    </div>
  );
};
