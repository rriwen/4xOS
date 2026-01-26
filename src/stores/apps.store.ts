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
 * Global z-index counter
 * Each new window or activated window gets the next highest z-index
 */
export const globalZIndexCounterStore = atom(100);

/**
 * Store to track z-index for each window
 * Each window gets a base z-index, new/active window gets the highest
 */
export const windowZIndexStore = atom<Partial<Record<AppID, number>>>({});

/**
 * Maximum zIndex for the active app (deprecated, kept for compatibility)
 * @deprecated Use globalZIndexCounterStore instead
 */
export const activeAppZIndexStore = atom(98);

/**
 * Store to track minimized state for each window
 * true = minimized, false/undefined = not minimized
 */
export const minimizedAppsStore = atom<Partial<Record<AppID, boolean>>>({});

/**
 * Store to track window position and size for each window
 * Used to restore window position and size after minimizing
 */
export type WindowState = {
  x: number;
  y: number;
  width: number | string;
  height: number | string;
};

export const windowStateStore = atom<Partial<Record<AppID, WindowState>>>({});
