import { atomWithStorage } from 'jotai/utils';

export type Theme = 'light' | 'dark';

export const themeAtom = atomWithStorage<Theme>(
  'theme:type',
  'dark', // 默认暗色模式，避免首次加载时的闪烁
);
