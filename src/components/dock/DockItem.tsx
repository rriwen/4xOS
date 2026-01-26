import useRaf from '@rooks/use-raf';
import { motion, MotionValue, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useAtom } from 'jotai';
import { useImmerAtom } from 'jotai-immer';
import { RefObject } from 'react';
import { useRef, useState } from 'react';
import { AppConfig } from '__/helpers/create-app-config';
import {
  activeAppStore,
  AppID,
  globalZIndexCounterStore,
  minimizedAppsStore,
  openAppsStore,
  windowZIndexStore,
} from '__/stores/apps.store';
import css from './DockItem.module.scss';

type DockItemProps = AppConfig & {
  mouseX: MotionValue<number | null>;
  appID: AppID;
  isOpen: boolean;
  index: number;
};

export function DockItem({
  title,
  externalAction,
  mouseX,
  appID,
  isOpen,
  shouldOpenWindow,
}: DockItemProps) {
  const [, setOpenApps] = useImmerAtom(openAppsStore);
  const [, setActiveApp] = useAtom(activeAppStore);
  const [, setMinimizedApps] = useImmerAtom(minimizedAppsStore);
  const [windowZIndices, setWindowZIndices] = useAtom(windowZIndexStore);
  const [globalZIndexCounter, setGlobalZIndexCounter] = useAtom(globalZIndexCounterStore);
  const [animateObj, setAnimateObj] = useState({ translateY: '0%' });

  const imgRef = useRef<HTMLImageElement>();

  const { width } = useDockHoverAnimation(mouseX, imgRef);

  function openApp(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (!shouldOpenWindow) return void externalAction?.(e);

    // 触发点击动画：先向上移动，然后回到原位
    setAnimateObj({ translateY: '-39.2%' });
    setTimeout(() => {
      setAnimateObj({ translateY: '0%' });
    }, 100);

    // 如果窗口已经打开但被最小化，则恢复它
    setMinimizedApps((minimized) => {
      if (minimized[appID]) {
        minimized[appID] = false;
      }
      return minimized;
    });

    // 打开应用
    setOpenApps((apps) => {
      apps[appID] = true;
      return apps;
    });

    // 为新窗口分配最高的z-index
    const isNewWindow = !windowZIndices[appID];
    if (isNewWindow) {
      // 获取下一个最高的z-index
      const newZIndex = globalZIndexCounter + 1;
      setGlobalZIndexCounter(newZIndex);
      setWindowZIndices((prev) => ({
        ...prev,
        [appID]: newZIndex,
      }));
    } else {
      // 如果是已存在的窗口，也给它分配最高的z-index
      const newZIndex = globalZIndexCounter + 1;
      setGlobalZIndexCounter(newZIndex);
      setWindowZIndices((prev) => ({
        ...prev,
        [appID]: newZIndex,
      }));
    }

    // 激活应用
    setActiveApp(appID);
  }

  return (
    <button className={css.dockItemButton} aria-label={`Launch ${title}`} onClick={openApp}>
      <p className={css.tooltip}>{title}</p>
      <motion.span
        initial={false}
        animate={animateObj}
        transition={{ type: 'spring', duration: 0.7 }}
        transformTemplate={({ translateY }) => `translateY(${translateY})`}
      >
        <motion.img
          ref={imgRef}
          src={`/assets/app-icons/${appID}/256.webp`}
          draggable={false}
          style={{ width, willChange: 'width' }}
          alt={`${title} app icon`}
        />
      </motion.span>
      <div className={css.dot} style={{ '--opacity': +isOpen } as React.CSSProperties} />
    </button>
  );
}

const baseWidth = 57.6;
const distanceLimit = baseWidth * 6;
const beyondTheDistanceLimit = distanceLimit + 1;
const distanceInput = [
  -distanceLimit,
  -distanceLimit / 1.25,
  -distanceLimit / 2,
  0,
  distanceLimit / 2,
  distanceLimit / 1.25,
  distanceLimit,
];
const widthOutput = [
  baseWidth,
  baseWidth * 1.1,
  baseWidth * 1.414,
  baseWidth * 2,
  baseWidth * 1.414,
  baseWidth * 1.1,
  baseWidth,
];

const useDockHoverAnimation = (
  mouseX: MotionValue<number | null>,
  ref: RefObject<HTMLImageElement>,
) => {
  const distance = useMotionValue(beyondTheDistanceLimit);

  const widthPX: MotionValue<number> = useSpring(
    useTransform(distance, distanceInput, widthOutput),
    {
      stiffness: 1300,
      damping: 82,
    },
  );

  const width = useTransform(widthPX, (width) => `${width / 16}rem`);

  useRaf(() => {
    const el = ref.current;
    const mouseXVal = mouseX.get();
    if (el && mouseXVal !== null) {
      const rect = el.getBoundingClientRect();

      const imgCenterX = rect.left + rect.width / 2;

      // difference between the x coordinate value of the mouse pointer
      // and the img center x coordinate value
      const distanceDelta = mouseXVal - imgCenterX;
      distance.set(distanceDelta);
      return;
    }

    distance.set(beyondTheDistanceLimit);
  }, true);

  return { width };
};
