import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useImmerAtom } from 'jotai/immer';
import { CloseIcon } from '__/assets/traffic-icons/Close.svg';
import { GreenLightIcon } from '__/assets/traffic-icons/GreenLightIcon';
import { MinimizeIcon } from '__/assets/traffic-icons/Minimize.svg';
import { appsConfig } from '__/data/apps/apps-config';
import {
  activeAppStore,
  AppID,
  minimizedAppsStore,
  openAppsStore,
  windowZIndexStore,
} from '__/stores/apps.store';
import css from './TrafficLights.module.scss';

type TrafficLightProps = {
  appID: AppID;
  onMaximizeClick: () => void;
  onActivate?: () => void;
  class?: string | null;
};

export const TrafficLights = ({
  appID,
  onMaximizeClick,
  onActivate,
  class: className,
}: TrafficLightProps) => {
  const [, setOpenApps] = useImmerAtom(openAppsStore);
  const [activeApp, setActiveApp] = useAtom(activeAppStore);
  const [, setWindowZIndices] = useAtom(windowZIndexStore);
  const [, setMinimizedApps] = useImmerAtom(minimizedAppsStore);

  const closeApp = () => {
    // 关闭窗口时清理 z-index 和最小化状态
    setWindowZIndices((prev) => {
      const newIndices = { ...prev };
      delete newIndices[appID];
      return newIndices;
    });
    setMinimizedApps((prev) => {
      const newMinimized = { ...prev };
      delete newMinimized[appID];
      return newMinimized;
    });
    // 关闭应用
    setOpenApps((openApps) => {
      openApps[appID] = false;
      return openApps;
    });
  };

  const minimizeApp = () => {
    // 最小化窗口
    setMinimizedApps((prev) => {
      prev[appID] = true;
      return prev;
    });
  };

  const greenLightAction = () => {
    if (appsConfig[appID].expandable) {
      // Action not available right now!
    } else {
      onMaximizeClick();
    }
  };

  // 点击 TrafficLights 区域时激活窗口
  const handleContainerClick = (e: React.MouseEvent) => {
    // 如果点击的不是按钮本身，则激活窗口
    const target = e.target as HTMLElement;
    if (target === e.currentTarget || target.closest('button') === null) {
      if (onActivate) {
        onActivate();
      } else {
        setActiveApp(appID);
      }
    }
  };

  const isActive = activeApp === appID;

  return (
    <div
      class={clsx(css.container, !isActive && css.unFocussed, className)}
      onClick={handleContainerClick}
    >
      <button
        class={css.closeLight}
        onClick={(e) => {
          e.stopPropagation();
          closeApp();
        }}
      >
        <CloseIcon />
      </button>
      <button
        class={css.minimizeLight}
        onClick={(e) => {
          e.stopPropagation();
          minimizeApp();
        }}
      >
        <MinimizeIcon />
      </button>
      <button
        class={css.stretchLight}
        onClick={(e) => {
          e.stopPropagation();
          greenLightAction();
        }}
      >
        <GreenLightIcon {...appsConfig[appID]} />
      </button>
    </div>
  );
};
