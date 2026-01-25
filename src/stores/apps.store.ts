import { atom } from 'jotai';
import { appsConfig } from '__/data/apps/apps-config';

export type AppID = keyof typeof appsConfig;

/** Which apps are currently open */
export const openAppsStore = atom<Record<AppID, boolean>>({
  finder: false,
  safari: false,
  mail: false,
  photos: false,
  facetime: false,
  'system-preferences': false,
  'talk-to-4x': false,
});

/** Which app is currently focused */
export const activeAppStore = atom<AppID>('finder');

/**
 * Maximum zIndex for the active app
 * Initialize with base window z-index (100) minus increment (2)
 * So first window gets z-index 100, active window gets higher
 */
export const activeAppZIndexStore = atom(98);

/**
 * Store to track z-index for each window
 * Each window gets a base z-index, active window gets the highest
 */
export const windowZIndexStore = atom<Record<AppID, number>>({});

/**
 * Store to track minimized state for each window
 * true = minimized, false/undefined = not minimized
 */
export const minimizedAppsStore = atom<Record<AppID, boolean>>({});
