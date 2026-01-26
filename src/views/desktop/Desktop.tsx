import { useAtom } from 'jotai';
import { useImmerAtom } from 'jotai/immer';
import { useEffect, useRef, useState } from 'preact/hooks';
import { ContextMenu } from '__/components/Desktop/ContextMenu/ContextMenu';
import { StartupChime } from '__/components/Desktop/StartupChime';
import { WindowsArea } from '__/components/Desktop/Window/WindowsArea';
import { Dock } from '__/components/dock/Dock';
import { TopBar } from '__/components/topbar/TopBar';
import { activeAppStore, openAppsStore } from '__/stores/apps.store';
import { themeAtom } from '__/stores/theme.store';
import css from './Desktop.module.scss';

export const Desktop = () => {
  const outerRef = useRef<HTMLDivElement>();
  const backgroundRef = useRef<HTMLDivElement>();
  const [, setOpenApps] = useImmerAtom(openAppsStore);
  const [, setActiveApp] = useAtom(activeAppStore);
  const [theme] = useAtom(themeAtom);
  const [wallpaperLoaded, setWallpaperLoaded] = useState(false);

  // 在页面加载时自动打开 "talk to 4x" 应用
  useEffect(() => {
    setOpenApps((apps) => {
      apps['talk-to-4x'] = true;
      return apps;
    });
    setActiveApp('talk-to-4x');
  }, []);

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
      <main ref={outerRef} class={css.main}>
        <ContextMenu outerRef={outerRef} />
        <TopBar />
        <WindowsArea />
        <Dock />
      </main>

      <StartupChime />

      <div 
        ref={backgroundRef} 
        class={css.backgroundCover} 
        aria-hidden="true"
        style={{ opacity: wallpaperLoaded ? 1 : 0 }}
      />
    </div>
  );
};
