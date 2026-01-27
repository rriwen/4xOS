/**
 * 窗口相关的工具函数
 */

export type DesktopDimensions = {
  width: number;
  height: number;
  dockHeight: number;
  topBarHeight: number;
};

export type WindowPosition = {
  x: number;
  y: number;
};

/**
 * 获取桌面可用区域的尺寸
 * 计算时会考虑 dock 和 top-bar 的高度
 */
export function getDesktopDimensions(): DesktopDimensions {
  const dockElement = document.getElementById('dock');
  const topBarElement = document.getElementById('top-bar');
  
  const dockHeight = dockElement?.clientHeight ?? 0;
  const topBarHeight = topBarElement?.clientHeight ?? 0;
  const width = document.body.clientWidth;
  const height = document.body.clientHeight - dockHeight - topBarHeight;
  
  return {
    width,
    height,
    dockHeight,
    topBarHeight,
  };
}

/**
 * 计算窗口的默认位置
 * @param defaultPosition 配置的默认位置（'center' | { x: number, y: number } | undefined）
 * @param windowWidth 窗口宽度
 * @param windowHeight 窗口高度
 * @param randint 随机数生成函数（用于随机位置）
 */
export function getDefaultWindowPosition(
  defaultPosition: 'center' | { x: number; y: number } | undefined,
  windowWidth: number,
  windowHeight: number,
  randint: (lower: number, upper: number) => number,
): WindowPosition {
  if (defaultPosition === 'center') {
    const { width, height, topBarHeight } = getDesktopDimensions();
    return {
      x: (width - windowWidth) / 2,
      y: (height - windowHeight) / 2 + topBarHeight,
    };
  } else if (defaultPosition && typeof defaultPosition === 'object') {
    return defaultPosition;
  } else {
    // 默认随机位置
    const { width } = getDesktopDimensions();
    const randX = randint(-600, 600);
    const randY = randint(-100, 100);
    return {
      x: ((3 / 2) * width + randX) / 2,
      y: (100 + randY) / 2,
    };
  }
}
