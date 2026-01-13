import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';
import { themeAtom } from '__/stores/theme.store';

export type WallpaperType = 'builtin' | 'custom';

export interface CustomWallpaper {
  id: string;
  name: string;
  data: string; // base64 or blob URL
  uploadTime: number;
  size: number;
}

export interface WallpaperState {
  type: WallpaperType;
  value: string; // 内置墙纸的文件名或自定义墙纸的 ID
}

// 默认墙纸
const DEFAULT_LIGHT_WALLPAPER = '37-2.jpg';
const DEFAULT_DARK_WALLPAPER = '37-1.jpg';

// 存储用户选择的墙纸（light 和 dark 主题分别存储）
export const lightWallpaperAtom = atomWithStorage<WallpaperState>(
  'wallpaper:light',
  { type: 'builtin', value: DEFAULT_LIGHT_WALLPAPER }
);

export const darkWallpaperAtom = atomWithStorage<WallpaperState>(
  'wallpaper:dark',
  { type: 'builtin', value: DEFAULT_DARK_WALLPAPER }
);

// 存储用户上传的自定义墙纸列表
export const customWallpapersAtom = atomWithStorage<CustomWallpaper[]>(
  'wallpaper:custom',
  []
);

// 根据主题获取当前墙纸的 atom
export const currentWallpaperAtom = atom(
  (get) => {
    const theme = get(themeAtom);
    const wallpaperState = theme === 'dark' ? get(darkWallpaperAtom) : get(lightWallpaperAtom);
    const customWallpapers = get(customWallpapersAtom);

    if (wallpaperState.type === 'custom') {
      const customWallpaper = customWallpapers.find((w) => w.id === wallpaperState.value);
      return customWallpaper ? customWallpaper.data : `/assets/wallpapers/${theme === 'dark' ? DEFAULT_DARK_WALLPAPER : DEFAULT_LIGHT_WALLPAPER}`;
    }

    return `/assets/wallpapers/${wallpaperState.value}`;
  }
);

// 添加自定义墙纸
export const addCustomWallpaperAtom = atom(
  null,
  (get, set, wallpaper: Omit<CustomWallpaper, 'id' | 'uploadTime'>): void => {
    const customWallpapers = get(customWallpapersAtom);
    const newWallpaper: CustomWallpaper = {
      ...wallpaper,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uploadTime: Date.now(),
    };
    set(customWallpapersAtom, [...customWallpapers, newWallpaper]);
  }
);

// 删除自定义墙纸
export const removeCustomWallpaperAtom = atom(
  null,
  (get, set, id: string): void => {
    const customWallpapers = get(customWallpapersAtom);
    const updated = customWallpapers.filter((w) => w.id !== id);
    set(customWallpapersAtom, updated);

    // 如果删除的墙纸是当前使用的，恢复为默认墙纸
    const lightWallpaper = get(lightWallpaperAtom);
    const darkWallpaper = get(darkWallpaperAtom);

    if (lightWallpaper.type === 'custom' && lightWallpaper.value === id) {
      set(lightWallpaperAtom, { type: 'builtin', value: DEFAULT_LIGHT_WALLPAPER });
    }

    if (darkWallpaper.type === 'custom' && darkWallpaper.value === id) {
      set(darkWallpaperAtom, { type: 'builtin', value: DEFAULT_DARK_WALLPAPER });
    }
  }
);

