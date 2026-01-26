import clsx from 'clsx';
import { useAtom } from 'jotai';
import { RefObject } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Suspense } from 'react';
import { Rnd } from 'react-rnd';
import { AppNexus } from '__/components/apps/AppNexus';
import { appsConfig } from '__/data/apps/apps-config';
import { randint } from '__/helpers/random';
import {
  activeAppStore,
  activeAppZIndexStore,
  AppID,
  minimizedAppsStore,
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
  const [activeAppZIndex] = useAtom(activeAppZIndexStore);
  const [activeApp, setActiveApp] = useAtom(activeAppStore);
  const [windowZIndices, setWindowZIndices] = useAtom(windowZIndexStore);
  const [minimizedApps] = useAtom(minimizedAppsStore);

  const containerRef = useRef<HTMLDivElement>();

  // 基础 z-index 从设计令牌获取（100）
  const [appZIndex, setAppZIndex] = useState(100);
  const [isBeingDragged, setIsBeingDragged] = useState(false);
  
  // 使用 ref 跟踪是否已初始化，避免重复初始化
  const initializedRef = useRef(false);

  const randX = useMemo(() => randint(-600, 600), []);
  const randY = useMemo(() => randint(-100, 100), []);

  const windowRef = useRef<WindowRnd>();
  const maximizeApp = useMaximizeWindow(windowRef);

  // 初始化窗口 z-index（仅在窗口首次挂载时）
  useEffect(() => {
    if (initializedRef.current) return; // 已经初始化过，跳过
    
    // 使用函数式更新确保获取最新的 windowZIndices 状态
    setWindowZIndices((prev: Partial<Record<AppID, number>>) => {
      // 如果还没有为这个窗口分配 z-index，则分配一个新的
      if (!prev[appID]) {
        // 计算新的基础 z-index：找到当前所有打开窗口中最高的 z-index，然后加 1
        const values = Object.values(prev).filter((v): v is number => typeof v === 'number');
        const maxZIndex = values.length > 0 ? Math.max(100, ...values) : 100;
        const newZIndex = maxZIndex + 1;
        setAppZIndex(newZIndex);
        initializedRef.current = true;
        return { ...prev, [appID]: newZIndex };
      } else {
        // 如果已经有 z-index，使用它（窗口重新打开的情况）
        const existingZIndex = prev[appID];
        if (existingZIndex !== undefined) {
          setAppZIndex(existingZIndex);
        }
        initializedRef.current = true;
        return prev; // 不改变状态，避免触发其他 effect
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appID]); // 只在 appID 变化时执行

  // 当窗口变为活动窗口时，更新 z-index
  useEffect(() => {
    // 等待初始化完成
    if (!initializedRef.current) return;
    
    if (activeApp === appID) {
      // 活动窗口使用最高的 z-index
      // 只有当 z-index 实际需要改变时才更新
      if (appZIndex !== activeAppZIndex) {
        setAppZIndex(activeAppZIndex);
        // 只有当存储的值不同时才更新，避免不必要的状态更新
        setWindowZIndices((prev: Partial<Record<AppID, number>>) => {
          if (prev[appID] !== activeAppZIndex) {
            return { ...prev, [appID]: activeAppZIndex };
          }
          return prev; // 不改变状态，避免触发其他 effect
        });
      }
    } else {
      // 非活动窗口：从存储中恢复之前的 z-index
      // 使用函数式更新获取最新的 windowZIndices，但不更新状态
      setWindowZIndices((prev: Partial<Record<AppID, number>>) => {
        const storedZIndex = prev[appID];
        // 只有当存储的 z-index 存在且与当前不同时才更新本地状态
        if (storedZIndex && storedZIndex !== activeAppZIndex && storedZIndex !== appZIndex) {
          setAppZIndex(storedZIndex);
        }
        return prev; // 不改变状态，避免触发其他 effect
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeApp, activeAppZIndex, appID, appZIndex]); // 添加 appZIndex 以便比较

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const { resizable, height, width, trafficLightsStyle, expandable, defaultPosition, openMaximized } = appsConfig[appID];

  // 如果配置了打开时最大化，在窗口挂载后自动最大化
  const maximizedOnMountRef = useRef(false);
  useEffect(() => {
    if (openMaximized && !maximizedOnMountRef.current && windowRef.current?.base) {
      maximizedOnMountRef.current = true;
      // 延迟执行，确保窗口已经完全渲染
      setTimeout(() => {
        maximizeApp();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openMaximized, maximizeApp]);

  const focusCurrentApp = () => {
    setActiveApp(appID);
  };

  const isMinimized = minimizedApps[appID] === true;

  useEffect(() => {
    if (windowRef.current?.base) {
      windowRef.current.base.style.zIndex = `${appZIndex}`;
      // 如果窗口被最小化，隐藏窗口
      if (isMinimized) {
        windowRef.current.base.style.display = 'none';
      } else {
        windowRef.current.base.style.display = '';
      }
    }
  }, [appZIndex, isMinimized]);

  // 如果窗口被最小化，不渲染内容
  if (isMinimized) {
    return null;
  }

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
      return {
        x: ((3 / 2) * document.body.clientWidth + randX) / 2,
        y: (100 + randY) / 2,
      };
    }
  }, [defaultPosition, width, height, randX, randY]);

  return (
    <Rnd
      ref={windowRef}
      default={{
        height,
        width,
        x: getDefaultPosition.x,
        y: getDefaultPosition.y,
      }}
      enableResizing={resizable}
      dragHandleClassName="app-window-drag-handle"
      bounds="parent"
      minWidth="300"
      minHeight="300"
      onDragStart={() => {
        // 拖拽开始时立即激活窗口，确保窗口置顶
        focusCurrentApp();
        setIsBeingDragged(true);
      }}
      onDragStop={() => {
        setIsBeingDragged(false);
      }}
    >
      <section className={css.container} tabIndex={-1} ref={containerRef} onClick={focusCurrentApp}>
        <div
          style={trafficLightsStyle}
          className={clsx(css.trafficLightsContainer, 'app-window-drag-handle')}
        >
          <TrafficLights appID={appID} onMaximizeClick={maximizeApp} onActivate={focusCurrentApp} />
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

/**
 * Extract the x and y from the transform style of the base element using Regex
 * Why using this hacking method:
 * react-rnd uses transform and translate to shift window around instead of top
 * and left and it does not provide the access to x and y values from ref
 * @param transformStyle The transform style string. e.g. translate(1123.75px, 7px)
 * @returns The window position. e.g. { x: 1123.75, y: 7 }
 */
function extractPositionFromTransformStyle(transformStyle: string): WindowPosition {
  const matched = transformStyle.matchAll(/[0-9.]+/g);
  try {
    return { x: Number(matched.next().value[0]), y: Number(matched.next().value[0]) };
  } catch {
    return { x: 0, y: 0 };
  }
}

const useMaximizeWindow = (windowRef: RefObject<WindowRnd>) => {
  const originalSizeRef = useRef<WindowSize>({ height: 0, width: 0 });
  const originalPositionRef = useRef<WindowPosition>({
    x: 0,
    y: 0,
  });
  const transitionClearanceRef = useRef<number>();

  return () => {
    if (!windowRef?.current?.resizableElement?.current || !windowRef?.current?.base) {
      return;
    }

    // Get desktop height and width
    const dockElementHeight = document.getElementById('dock')?.clientHeight ?? 0;
    const topBarElementHeight = document.getElementById('top-bar')?.clientHeight ?? 0;
    const desktopHeight = document.body.clientHeight - dockElementHeight - topBarElementHeight;
    const deskTopWidth = document.body.clientWidth;

    // Get current height and width
    const { clientWidth: windowWidth, clientHeight: windowHeight } =
      windowRef.current.resizableElement.current;

    // Get current left and top position
    const { x: windowLeft, y: windowTop } = extractPositionFromTransformStyle(
      windowRef.current.base.style.transform,
    );

    // Only when maximizing (not dragging or resizing), should it have transition
    windowRef.current.base.style.transition =
      'height 0.3s ease, width 0.3s ease, transform 0.3s ease';

    // Prevent removing transition styles when multiple times of maximizing action takes place in a short period
    clearTimeout(transitionClearanceRef.current);

    // Transition style gets cleared after 0.5 second as transition only lasts 0.5 second
    transitionClearanceRef.current = setTimeout(() => {
      if (windowRef.current?.base) {
        windowRef.current.base.style.transition = '';
      }
      transitionClearanceRef.current = 0;
    }, 300);

    // When it's already maximized, revert the window to the previous size
    if (windowWidth === deskTopWidth && windowHeight === desktopHeight) {
      windowRef.current.updateSize(originalSizeRef.current);
      windowRef.current.updatePosition(originalPositionRef.current);
    }
    // Maximize the window to the size of the desktop
    else {
      originalSizeRef.current = { width: windowWidth, height: windowHeight };
      originalPositionRef.current = { x: windowLeft, y: windowTop };

      windowRef.current.updateSize({
        height: desktopHeight,
        width: deskTopWidth,
      });

      windowRef.current.updatePosition({
        x: document.body.clientWidth / 2,
        y: 0,
      });
    }
  };
};

export default Window;
