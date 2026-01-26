import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import { useImmerAtom } from 'jotai-immer';
import { RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Suspense } from 'react';
import { Rnd } from 'react-rnd';
import { AppNexus } from '__/components/apps/AppNexus';
import { appsConfig } from '__/data/apps/apps-config';
import { randint } from '__/helpers/random';
import {
  activeAppStore,
  AppID,
  globalZIndexCounterStore,
  minimizedAppsStore,
  WindowState,
  windowStateStore,
  windowZIndexStore,
} from '__/stores/apps.store';
import { TrafficLights } from './TrafficLights';
import css from './Window.module.scss';

type WindowProps = {
  appID: AppID;
};

type WindowSize = {
  width: string | number;
  height: string | number;
};

type WindowPosition = {
  x: number;
  y: number;
};

class WindowRnd extends Rnd {
  base?: HTMLDivElement;
}

export const Window = ({ appID }: WindowProps) => {
  const [activeApp, setActiveApp] = useAtom(activeAppStore);
  const [windowZIndices, setWindowZIndices] = useAtom(windowZIndexStore);
  const globalZIndexCounter = useAtomValue(globalZIndexCounterStore);
  const [, setGlobalZIndexCounter] = useAtom(globalZIndexCounterStore);
  const [minimizedApps] = useAtom(minimizedAppsStore);
  const [windowStates, setWindowStates] = useImmerAtom(windowStateStore);

  const containerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<WindowRnd>(null);
  const isMaximizedRef = useRef(false);
  const originalSizeRef = useRef<WindowSize | null>(null);
  const originalPositionRef = useRef<WindowPosition | null>(null);
  const hasTriedAutoMaximizeRef = useRef(false);

  const { resizable, height, width, trafficLightsStyle, defaultPosition, openMaximized } = appsConfig[appID];

  // 计算默认位置
  const getDefaultPosition = useMemo(() => {
    if (defaultPosition === 'center') {
      const dockElementHeight = document.getElementById('dock')?.clientHeight ?? 0;
      const topBarElementHeight = document.getElementById('top-bar')?.clientHeight ?? 0;
      const availableHeight = document.body.clientHeight - dockElementHeight - topBarElementHeight;
      const windowWidth = typeof width === 'number' ? width : parseInt(String(width), 10);
      const windowHeight = typeof height === 'number' ? height : parseInt(String(height), 10);
      
      return {
        x: (document.body.clientWidth - windowWidth) / 2,
        y: (availableHeight - windowHeight) / 2 + topBarElementHeight,
      };
    } else if (defaultPosition && typeof defaultPosition === 'object') {
      return defaultPosition;
    } else {
      // 默认随机位置
      const randX = randint(-600, 600);
      const randY = randint(-100, 100);
      return {
        x: ((3 / 2) * document.body.clientWidth + randX) / 2,
        y: (100 + randY) / 2,
      };
    }
  }, [defaultPosition, width, height]);

  // 获取保存的窗口状态，如果没有则使用默认值
  const savedState = windowStates[appID];
  
  // 如果配置了 openMaximized，初始大小使用最大化大小，但位置先居中（最大化时会自动移动到 0,0）
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (openMaximized) {
      // 如果配置了 openMaximized，初始化为最大化大小
      const dockElementHeight = document.getElementById('dock')?.clientHeight ?? 0;
      const topBarElementHeight = document.getElementById('top-bar')?.clientHeight ?? 0;
      const desktopHeight = document.body.clientHeight - dockElementHeight - topBarElementHeight;
      const desktopWidth = document.body.clientWidth;
      return { width: desktopWidth, height: desktopHeight };
    }
    return savedState ? { width: savedState.width, height: savedState.height } : { width, height };
  });
  
  const [windowPosition, setWindowPosition] = useState<WindowPosition>(() => {
    // 即使配置了 openMaximized，初始位置也使用 defaultPosition（通常是 center）
    // 最大化时会自动移动到 (0, 0)
    return savedState ? { x: savedState.x, y: savedState.y } : getDefaultPosition;
  });
  const [appZIndex, setAppZIndex] = useState(100);
  const [isBeingDragged, setIsBeingDragged] = useState(false);
  const [forceZIndexUpdate, setForceZIndexUpdate] = useState(0); // 用于强制触发 z-index 更新
  const isMinimized = minimizedApps[appID] === true;
  
  // 如果配置了 openMaximized，在初始化时设置最大化标志
  useEffect(() => {
    if (openMaximized) {
      isMaximizedRef.current = true;
    }
  }, [openMaximized]);

  // 初始化窗口z-index
  useEffect(() => {
    setWindowZIndices((prev) => {
      if (!prev[appID]) {
        // 新窗口：分配新的z-index
        let newZIndex = 100;
        setGlobalZIndexCounter((current) => {
          newZIndex = current + 1;
          setAppZIndex(newZIndex);
          return newZIndex;
        });
        return { ...prev, [appID]: newZIndex };
      } else {
        // 已有窗口：优先使用预设的更高 z-index
        const savedZIndex = prev[appID];
        if (savedZIndex !== undefined) {
          setAppZIndex(savedZIndex);
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

  // 当窗口变为活动窗口时，更新z-index
  // 也监听 forceZIndexUpdate 的变化，确保 focusCurrentApp 总是能触发更新
  useLayoutEffect(() => {
    if (activeApp === appID || forceZIndexUpdate > 0) {
      setGlobalZIndexCounter((current) => {
        // 使用嵌套回调避免闭包问题
        setWindowZIndices((prev) => {
          const currentZIndex = prev[appID] || 0;
          const newZIndex = Math.max(current + 1, currentZIndex + 1);
          setAppZIndex(newZIndex);
          // 立即同步更新 DOM 的 z-index
          const updateDOM = () => {
            if (windowRef.current?.base) {
              windowRef.current.base.style.zIndex = `${newZIndex}`;
            }
          };
          updateDOM();
          requestAnimationFrame(updateDOM);
          return {
            ...prev,
            [appID]: newZIndex,
          };
        });
        return current + 1;
      });
    }
  }, [activeApp, appID, forceZIndexUpdate, setGlobalZIndexCounter, setWindowZIndices]);

  // 更新窗口的z-index样式 - 使用 useLayoutEffect 确保同步更新
  useLayoutEffect(() => {
    if (windowRef.current?.base) {
      windowRef.current.base.style.zIndex = `${appZIndex}`;
    }
  }, [appZIndex]);
  
  // 额外的 useEffect 作为备用，确保 DOM 更新
  useEffect(() => {
    const updateZIndex = () => {
      if (windowRef.current?.base) {
        windowRef.current.base.style.zIndex = `${appZIndex}`;
      }
    };
    updateZIndex();
    // 使用 requestAnimationFrame 确保在下一帧也更新
    requestAnimationFrame(updateZIndex);
  }, [appZIndex]);

  // 保存窗口状态
  const saveWindowState = (newSize: WindowSize, newPosition: WindowPosition) => {
    setWindowStates((prev) => {
      prev[appID] = {
        x: newPosition.x,
        y: newPosition.y,
        width: newSize.width,
        height: newSize.height,
      };
      return prev;
    });
  };

  // 最大化/恢复窗口
  const toggleMaximize = () => {
    if (!windowRef.current?.resizableElement?.current || !windowRef.current?.base) {
      return;
    }

    const dockElementHeight = document.getElementById('dock')?.clientHeight ?? 0;
    const topBarElementHeight = document.getElementById('top-bar')?.clientHeight ?? 0;
    const desktopHeight = document.body.clientHeight - dockElementHeight - topBarElementHeight;
    const desktopWidth = document.body.clientWidth;

    const { clientWidth: currentWidth, clientHeight: currentHeight } =
      windowRef.current.resizableElement.current;

    // 提取当前位置
    const transform = windowRef.current.base.style.transform;
    const match = transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
    const currentX = match ? parseFloat(match[1]) : windowPosition.x;
    const currentY = match ? parseFloat(match[2]) : windowPosition.y;

    // 添加过渡动画
    windowRef.current.base.style.transition = 'height 0.3s ease, width 0.3s ease, transform 0.3s ease';

    // 判断是否已最大化
    const tolerance = 1;
    const isMaximized = 
      Math.abs(currentWidth - desktopWidth) <= tolerance && 
      Math.abs(currentHeight - desktopHeight) <= tolerance &&
      Math.abs(currentY - 0) <= tolerance;

    if (isMaximized) {
      // 恢复窗口
      if (originalSizeRef.current && originalPositionRef.current) {
        setWindowSize(originalSizeRef.current);
        setWindowPosition(originalPositionRef.current);
        saveWindowState(originalSizeRef.current, originalPositionRef.current);
        isMaximizedRef.current = false;
      }
    } else {
      // 最大化窗口
      originalSizeRef.current = { width: currentWidth, height: currentHeight };
      originalPositionRef.current = { x: currentX, y: currentY };

      const maximizedSize = {
        height: desktopHeight,
        width: desktopWidth,
      };
      const maximizedPosition = { x: 0, y: 0 };

      setWindowSize(maximizedSize);
      setWindowPosition(maximizedPosition);
      saveWindowState(maximizedSize, maximizedPosition);
      isMaximizedRef.current = true;
    }

    // 清除过渡动画
    setTimeout(() => {
      if (windowRef.current?.base) {
        windowRef.current.base.style.transition = '';
      }
    }, 300);
  };

  // 如果配置了打开时最大化，在窗口挂载后或从最小化恢复时自动最大化
  useEffect(() => {
    // 当窗口从最小化恢复时，重置尝试标志
    if (isMinimized) {
      hasTriedAutoMaximizeRef.current = false;
      return;
    }
    
    // 检查是否需要自动最大化
    // 当窗口打开或激活时，如果配置了 openMaximized 且窗口未最大化，则自动最大化
    if (openMaximized && !isMinimized && !isMaximizedRef.current && !hasTriedAutoMaximizeRef.current) {
      hasTriedAutoMaximizeRef.current = true;
      
      const checkAndMaximize = () => {
        // 再次检查条件
        if (isMaximizedRef.current || isMinimized) {
          return;
        }
        
        if (windowRef.current?.base && windowRef.current?.resizableElement?.current) {
          const base = windowRef.current.base;
          const resizableElement = windowRef.current.resizableElement.current;
          if (base.offsetWidth > 0 && base.offsetHeight > 0 && resizableElement.offsetWidth > 0 && resizableElement.offsetHeight > 0) {
            // 确保窗口已经渲染完成，使用双重 requestAnimationFrame 确保在下一帧执行
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                if (!isMaximizedRef.current && !isMinimized && windowRef.current?.base && windowRef.current?.resizableElement?.current) {
                  toggleMaximize();
                }
              });
            });
          } else {
            // 如果窗口还没有尺寸，再等一会儿
            setTimeout(checkAndMaximize, 50);
          }
        } else {
          // 如果窗口还没有挂载，再等一会儿
          setTimeout(checkAndMaximize, 50);
        }
      };
      // 初始延迟，确保窗口已经渲染
      setTimeout(checkAndMaximize, 500);
    }
  }, [openMaximized, isMinimized, activeApp, appID]);

  // 激活窗口并提升z-index
  const focusCurrentApp = () => {
    // 强制触发更新，即使 activeApp 已经是 appID
    setActiveApp(appID);
    // 使用 state 来强制触发 z-index 更新
    setForceZIndexUpdate((prev) => prev + 1);
    
    // 直接更新 z-index，不依赖 useEffect，确保即使窗口已经是激活状态也能更新
    // 使用嵌套回调避免闭包问题，并立即更新 DOM
    setGlobalZIndexCounter((current) => {
      setWindowZIndices((prev) => {
        const currentZIndex = prev[appID] || 0;
        const newZIndex = Math.max(current + 1, currentZIndex + 1);
        setAppZIndex(newZIndex);
        // 立即同步更新 DOM 的 z-index，使用多种方法确保更新
        const updateDOM = () => {
          if (windowRef.current?.base) {
            windowRef.current.base.style.zIndex = `${newZIndex}`;
          }
        };
        // 立即尝试更新
        updateDOM();
        // 使用 requestAnimationFrame 确保在下一帧也更新
        requestAnimationFrame(updateDOM);
        // 使用 setTimeout 作为最后的备用
        setTimeout(updateDOM, 0);
        return {
          ...prev,
          [appID]: newZIndex,
        };
      });
      return current + 1;
    });
  };

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
        if (windowRef.current?.base) {
          windowRef.current.base.style.zIndex = `${newZIndex}`;
        }
        return newZIndex;
      });
    }
  }, [isMinimized, activeApp, appID, setGlobalZIndexCounter, setWindowZIndices]);

  // 如果窗口被最小化，不渲染内容
  if (isMinimized) {
    return null;
  }

  return (
    <Rnd
      ref={windowRef}
      size={windowSize}
      position={windowPosition}
      enableResizing={resizable}
      dragHandleClassName="app-window-drag-handle"
      bounds="parent"
      minWidth="300"
      minHeight="300"
      data-app-id={appID}
      style={{ zIndex: appZIndex }}
      onDragStart={() => {
        focusCurrentApp();
        setIsBeingDragged(true);
      }}
      onDragStop={(e, d) => {
        setIsBeingDragged(false);
        const newPosition = { x: d.x, y: d.y };
        setWindowPosition(newPosition);
        saveWindowState(windowSize, newPosition);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const newSize = {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        };
        const newPosition = { x: position.x, y: position.y };
        setWindowSize(newSize);
        setWindowPosition(newPosition);
        saveWindowState(newSize, newPosition);
      }}
    >
      <section className={css.container} tabIndex={-1} ref={containerRef} onClick={focusCurrentApp}>
        <div
          style={trafficLightsStyle}
          className={clsx(css.trafficLightsContainer, 'app-window-drag-handle')}
        >
          <TrafficLights appID={appID} onMaximizeClick={toggleMaximize} onActivate={focusCurrentApp} />
        </div>
        <div className={clsx(css.titleBar, 'app-window-drag-handle')}>
          <span className={css.title}>{appsConfig[appID].title}</span>
        </div>
        <Suspense fallback={<span></span>}>
          <AppNexus appID={appID} isBeingDragged={isBeingDragged} />
        </Suspense>
      </section>
    </Rnd>
  );
};

export default Window;
