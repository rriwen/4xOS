import clsx from 'clsx';
import { useAtom } from 'jotai';
import { Suspense, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import { AppNexus } from '__/components/apps/AppNexus';
import { appsConfig } from '__/data/apps/apps-config';
import { useWindowZIndex } from '__/hooks/use-window-z-index';
import { useWindowState } from '__/hooks/use-window-state';
import { AppID, minimizedAppsStore } from '__/stores/apps.store';
import { TrafficLights } from './TrafficLights';
import css from './Window.module.scss';

type WindowProps = {
  appID: AppID;
};

class WindowRnd extends Rnd {
  base?: HTMLDivElement;
}

export const Window = ({ appID }: WindowProps) => {
  const [minimizedApps] = useAtom(minimizedAppsStore);
  const containerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<WindowRnd>(null);
  const [isBeingDragged, setIsBeingDragged] = useState(false);

  const { resizable, height, width, trafficLightsStyle, defaultPosition, openMaximized } = appsConfig[appID];
  const isMinimized = minimizedApps[appID] === true;

  // 使用 useWindowZIndex hook 管理 z-index
  const { appZIndex, focusWindow } = useWindowZIndex(appID, windowRef);

  // 使用 useWindowState hook 管理窗口状态
  const {
    windowSize,
    setWindowSize,
    windowPosition,
    setWindowPosition,
    toggleMaximize,
    saveWindowState,
  } = useWindowState({
    appID,
    defaultWidth: width,
    defaultHeight: height,
    defaultPosition,
    openMaximized,
    windowRef,
  });

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
      key={openMaximized ? `${appID}-maximized` : appID}
      onDragStart={() => {
        focusWindow();
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
      <section className={css.container} tabIndex={-1} ref={containerRef} onClick={focusWindow}>
        <div
          style={trafficLightsStyle}
          className={clsx(css.trafficLightsContainer, 'app-window-drag-handle')}
        >
          <TrafficLights appID={appID} onMaximizeClick={toggleMaximize} onActivate={focusWindow} />
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
