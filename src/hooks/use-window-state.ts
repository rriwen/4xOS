import { useAtom } from 'jotai';
import { useImmerAtom } from 'jotai-immer';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getDesktopDimensions, getDefaultWindowPosition, WindowPosition } from '__/helpers/window-utils';
import { randint } from '__/helpers/random';
import { AppID, minimizedAppsStore, windowStateStore } from '__/stores/apps.store';

export type WindowSize = {
  width: string | number;
  height: string | number;
};

type WindowRnd = {
  base?: HTMLDivElement | null;
  resizableElement?: {
    current?: HTMLElement | null;
  } | null;
} | null;

type UseWindowStateOptions = {
  appID: AppID;
  defaultWidth: string | number;
  defaultHeight: string | number;
  defaultPosition: 'center' | { x: number; y: number } | undefined;
  openMaximized?: boolean;
  windowRef: React.RefObject<WindowRnd>;
};

/**
 * Hook 用于管理窗口状态（大小、位置、最大化）
 * 统一处理窗口的初始化、最大化、恢复、状态保存逻辑
 */
export function useWindowState({
  appID,
  defaultWidth,
  defaultHeight,
  defaultPosition,
  openMaximized,
  windowRef,
}: UseWindowStateOptions) {
  const [windowStates, setWindowStates] = useImmerAtom(windowStateStore);
  const [minimizedApps] = useAtom(minimizedAppsStore);
  
  const isMaximizedRef = useRef(false);
  const originalSizeRef = useRef<WindowSize | null>(null);
  const originalPositionRef = useRef<WindowPosition | null>(null);
  const hasTriedAutoMaximizeRef = useRef(false);
  
  const savedState = windowStates[appID];
  const isMinimized = minimizedApps[appID] === true;

  // 初始化窗口大小
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (openMaximized) {
      const { width, height } = getDesktopDimensions();
      return { width, height };
    }
    return savedState ? { width: savedState.width, height: savedState.height } : { width: defaultWidth, height: defaultHeight };
  });

  // 初始化窗口位置
  // 如果配置了 openMaximized，需要计算相对于 WindowsArea 的位置
  // WindowsArea 有 left: -50vw 的偏移，所以窗口位置需要加上这个偏移量才能居中
  const [windowPosition, setWindowPosition] = useState<WindowPosition>(() => {
    if (openMaximized) {
      // WindowsArea 的 left 偏移是 -50vw，即 -50% 的视口宽度
      // 窗口要居中，需要位置为视口宽度的 50%
      const viewportWidth = window.innerWidth || document.body.clientWidth;
      return { x: viewportWidth * 0.5, y: 0 };
    }
    if (savedState) {
      return { x: savedState.x, y: savedState.y };
    }
    const windowWidth = typeof defaultWidth === 'number' ? defaultWidth : parseInt(String(defaultWidth), 10);
    const windowHeight = typeof defaultHeight === 'number' ? defaultHeight : parseInt(String(defaultHeight), 10);
    return getDefaultWindowPosition(defaultPosition, windowWidth, windowHeight, randint);
  });

  // 计算相对于 WindowsArea 的居中位置
  // WindowsArea 有 left: -50vw 的偏移，所以窗口位置需要是视口宽度的 50% 才能居中
  const getMaximizedPosition = (): WindowPosition => {
    const viewportWidth = window.innerWidth || document.body.clientWidth;
    // WindowsArea 向左偏移了 50vw，所以窗口要居中需要向右偏移 50vw
    // 但这是相对于 WindowsArea 的，所以 x 应该是 50vw（视口宽度的 50%）
    return { x: viewportWidth * 0.5, y: 0 };
  };

  // 如果配置了 openMaximized，在初始化时设置最大化标志并确保位置正确
  // 使用 useLayoutEffect 确保在 DOM 更新前就设置好位置
  useLayoutEffect(() => {
    if (openMaximized) {
      isMaximizedRef.current = true;
      // 强制清除保存的状态
      setWindowStates((prev) => {
        if (prev[appID]) {
          delete prev[appID];
        }
        return prev;
      });
      // 设置相对于 WindowsArea 的居中位置
      setWindowPosition(getMaximizedPosition());
    }
  }, [openMaximized, appID, setWindowStates]);
  

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

    const { width: desktopWidth, height: desktopHeight } = getDesktopDimensions();
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
      // 计算相对于 WindowsArea 的居中位置
      const viewportWidth = window.innerWidth || document.body.clientWidth;
      const maximizedPosition = { x: viewportWidth * 0.5, y: 0 };

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
    if (openMaximized && !isMinimized && !hasTriedAutoMaximizeRef.current) {
      hasTriedAutoMaximizeRef.current = true;
      
      const checkAndMaximize = () => {
        // 再次检查条件
        if (isMinimized) {
          return;
        }
        
        if (windowRef.current?.base && windowRef.current?.resizableElement?.current) {
          const base = windowRef.current.base;
          const resizableElement = windowRef.current.resizableElement.current;
          if (base.offsetWidth > 0 && base.offsetHeight > 0 && resizableElement.offsetWidth > 0 && resizableElement.offsetHeight > 0) {
            // 检查窗口是否已经是最大化状态
            const { width: desktopWidth, height: desktopHeight } = getDesktopDimensions();
            const tolerance = 1;
            const currentWidth = base.offsetWidth;
            const currentHeight = base.offsetHeight;
            const transform = base.style.transform;
            const match = transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
            const currentY = match ? parseFloat(match[2]) : windowPosition.y;
            
            const isAlreadyMaximized = 
              Math.abs(currentWidth - desktopWidth) <= tolerance && 
              Math.abs(currentHeight - desktopHeight) <= tolerance &&
              Math.abs(currentY - 0) <= tolerance;
            
            if (isAlreadyMaximized) {
              // 窗口已经是最大化状态，只需要设置标志
              isMaximizedRef.current = true;
            } else if (!isMaximizedRef.current) {
              // 窗口还没有最大化，调用 toggleMaximize
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  if (!isMaximizedRef.current && !isMinimized && windowRef.current?.base && windowRef.current?.resizableElement?.current) {
                    toggleMaximize();
                  }
                });
              });
            }
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
      setTimeout(checkAndMaximize, 400);
    }
  }, [openMaximized, isMinimized, appID, windowPosition]);

  return {
    windowSize,
    setWindowSize,
    windowPosition,
    setWindowPosition,
    toggleMaximize,
    saveWindowState,
  };
}
