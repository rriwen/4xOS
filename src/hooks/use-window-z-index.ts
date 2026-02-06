import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AppID, activeAppStore, globalZIndexCounterStore, minimizedAppsStore, windowZIndexStore } from '__/stores/apps.store';

type WindowRef = {
  base?: HTMLDivElement;
} | null;

/**
 * Hook 用于管理窗口的 z-index
 * 统一处理窗口的 z-index 初始化、激活、更新逻辑
 */
export function useWindowZIndex(appID: AppID, windowRef: React.RefObject<WindowRef>) {
  const [activeApp, setActiveApp] = useAtom(activeAppStore);
  const [windowZIndices, setWindowZIndices] = useAtom(windowZIndexStore);
  const globalZIndexCounter = useAtomValue(globalZIndexCounterStore);
  const [, setGlobalZIndexCounter] = useAtom(globalZIndexCounterStore);
  const [minimizedApps] = useAtom(minimizedAppsStore);
  
  const [appZIndex, setAppZIndex] = useState(100);
  const [forceZIndexUpdate, setForceZIndexUpdate] = useState(0);
  const isMinimized = minimizedApps[appID] === true;

  // 更新 DOM 的 z-index 样式
  const updateDOMZIndex = (zIndex: number) => {
    if (windowRef.current?.base) {
      windowRef.current.base.style.zIndex = `${zIndex}`;
    }
  };

  // 初始化窗口 z-index
  useEffect(() => {
    setWindowZIndices((prev) => {
      if (!prev[appID]) {
        // 新窗口：分配最高的 z-index，确保新窗口总是在最上层
        let newZIndex = 100;
        setGlobalZIndexCounter((current) => {
          // 确保新窗口获得最高的 z-index
          newZIndex = current + 1;
          setAppZIndex(newZIndex);
          // 立即同步更新 DOM 的 z-index
          updateDOMZIndex(newZIndex);
          return newZIndex;
        });
        return { ...prev, [appID]: newZIndex };
      } else {
        // 已有窗口：优先使用预设的更高 z-index
        const savedZIndex = prev[appID];
        if (savedZIndex !== undefined) {
          setAppZIndex(savedZIndex);
          // 立即同步更新 DOM 的 z-index
          updateDOMZIndex(savedZIndex);
          // 如果预设的 z-index 比当前全局计数器高，更新全局计数器
          if (savedZIndex > globalZIndexCounter) {
            setGlobalZIndexCounter(savedZIndex);
          } else {
            // 否则确保计数器至少等于保存的值
            setGlobalZIndexCounter((current) => Math.max(current, savedZIndex));
          }
        }
        return prev;
      }
    });
  }, [appID, setWindowZIndices, setGlobalZIndexCounter, globalZIndexCounter]);

  // 当窗口变为活动窗口时，更新 z-index
  useLayoutEffect(() => {
    if (activeApp === appID || forceZIndexUpdate > 0) {
      setGlobalZIndexCounter((current) => {
        setWindowZIndices((prev) => {
          const currentZIndex = prev[appID] || 0;
          const newZIndex = Math.max(current + 1, currentZIndex + 1);
          setAppZIndex(newZIndex);
          // 立即同步更新 DOM 的 z-index
          updateDOMZIndex(newZIndex);
          return {
            ...prev,
            [appID]: newZIndex,
          };
        });
        return current + 1;
      });
    }
  }, [activeApp, appID, forceZIndexUpdate, setGlobalZIndexCounter, setWindowZIndices]);

  // 监听 windowZIndices 的外部更新（例如通过 assignZIndex），确保窗口组件能够同步更新
  useEffect(() => {
    const currentZIndex = windowZIndices[appID];
    if (currentZIndex !== undefined && currentZIndex !== appZIndex) {
      setAppZIndex(currentZIndex);
      updateDOMZIndex(currentZIndex);
    }
  }, [windowZIndices, appID, appZIndex]);

  // 更新窗口的 z-index 样式 - 使用 useLayoutEffect 确保同步更新
  useLayoutEffect(() => {
    updateDOMZIndex(appZIndex);
  }, [appZIndex]);

  // 当窗口从最小化恢复时，更新 z-index
  useEffect(() => {
    if (!isMinimized && activeApp === appID) {
      setGlobalZIndexCounter((current) => {
        const newZIndex = current + 1;
        setAppZIndex(newZIndex);
        setWindowZIndices((prev) => ({
          ...prev,
          [appID]: newZIndex,
        }));
        // 立即同步更新 DOM 的 z-index
        updateDOMZIndex(newZIndex);
        return newZIndex;
      });
    }
  }, [isMinimized, activeApp, appID, setGlobalZIndexCounter, setWindowZIndices]);

  // 激活窗口并提升 z-index
  const focusWindow = () => {
    // 强制触发更新，即使 activeApp 已经是 appID
    setActiveApp(appID);
    // 使用 state 来强制触发 z-index 更新
    setForceZIndexUpdate((prev) => prev + 1);
    
    // 直接更新 z-index，不依赖 useEffect，确保即使窗口已经是激活状态也能更新
    setGlobalZIndexCounter((current) => {
      setWindowZIndices((prev) => {
        const currentZIndex = prev[appID] || 0;
        const newZIndex = Math.max(current + 1, currentZIndex + 1);
        setAppZIndex(newZIndex);
        // 立即同步更新 DOM 的 z-index，使用多种方法确保更新
        updateDOMZIndex(newZIndex);
        requestAnimationFrame(() => updateDOMZIndex(newZIndex));
        setTimeout(() => updateDOMZIndex(newZIndex), 0);
        return {
          ...prev,
          [appID]: newZIndex,
        };
      });
      return current + 1;
    });
  };

  return {
    appZIndex,
    focusWindow,
  };
}

/**
 * Hook 用于在 DockItem 中分配窗口的 z-index
 * 简化 DockItem 中的 z-index 分配逻辑
 */
export function useAssignWindowZIndex() {
  const [windowZIndices, setWindowZIndices] = useAtom(windowZIndexStore);
  const [globalZIndexCounter, setGlobalZIndexCounter] = useAtom(globalZIndexCounterStore);

  const assignZIndex = (appID: AppID) => {
    const isNewWindow = !windowZIndices[appID];
    // 无论是新窗口还是已存在的窗口，都分配最高的 z-index
    const newZIndex = globalZIndexCounter + 1;
    setGlobalZIndexCounter(newZIndex);
    setWindowZIndices((prev) => ({
      ...prev,
      [appID]: newZIndex,
    }));
    return newZIndex;
  };

  return { assignZIndex };
}
