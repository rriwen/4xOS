import { useAtom } from 'jotai';
import { lazy } from 'react';
import { useEffect, useRef } from 'react';
import { Suspense } from 'react';
import { appsConfig } from '__/data/apps/apps-config';
import {
  activeAppStore,
  activeAppZIndexStore,
  openAppsStore,
  windowZIndexStore,
} from '__/stores/apps.store';
import css from './WindowsArea.module.scss';

const Window = lazy(() => import('./Window'));

export const WindowsArea = () => {
  const [openApps] = useAtom(openAppsStore);
  const [activeApp] = useAtom(activeAppStore);
  const [activeAppZIndex, setActiveAppZIndex] = useAtom(activeAppZIndexStore);
  const [windowZIndices] = useAtom(windowZIndexStore);

  // Update the active app Z Index here
  // 确保活动窗口的 z-index 高于所有其他窗口
  // 使用 useRef 跟踪上一次的 activeApp，避免在 windowZIndices 变化时重复更新
  const prevActiveAppRef = useRef<typeof activeApp>(activeApp);
  
  useEffect(() => {
    // 只有当活动窗口改变时才更新 z-index
    // 这样可以避免在 windowZIndices 变化时触发循环更新
    if (prevActiveAppRef.current === activeApp) {
      // 活动窗口没有改变，不需要更新
      return;
    }
    
    prevActiveAppRef.current = activeApp;
    
    // 只有当有活动窗口时才更新
    if (!activeApp || !openApps[activeApp]) return;
    
    // 找到当前所有窗口中最高的 z-index
    const windowZIndexValues = Object.values(windowZIndices);
    const maxWindowZIndex = windowZIndexValues.length > 0
      ? Math.max(100, ...windowZIndexValues) // 基础 z-index（从设计令牌）
      : 100;
    
    // 使用函数式更新获取最新的 activeAppZIndex，避免依赖项问题
    setActiveAppZIndex((currentActiveZIndex) => {
      // 活动窗口的 z-index 应该比最高的窗口 z-index 更高
      const newActiveZIndex = maxWindowZIndex + 2;
      // 只有当新的 z-index 确实更高时才更新，避免不必要的状态更新
      if (newActiveZIndex > currentActiveZIndex) {
        return newActiveZIndex;
      }
      return currentActiveZIndex;
    });
  }, [activeApp, setActiveAppZIndex, openApps]); // 移除 windowZIndices 从依赖项，避免循环

  return (
    <section className={css.container}>
      <Suspense fallback={<span></span>}>
        {Object.keys(appsConfig).map(
          (appID) =>
            openApps[appID] &&
            appsConfig[appID].shouldOpenWindow && <Window key={appID} appID={appID} />,
        )}
      </Suspense>
    </section>
  );
};
