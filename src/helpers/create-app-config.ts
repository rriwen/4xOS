export type AppConfig = {
  title: string;

  resizable?: boolean;
  expandable?: boolean;
  height?: string | number;
  width?: string | number;

  shouldOpenWindow?: boolean;

  /** The action to do when dock button is clicked */
  externalAction?: (e: unknown) => void;

  /** Break before this app */
  dockBreaksBefore?: boolean;

  trafficLightsStyle?: React.CSSProperties;

  /** Custom default position. If not provided, uses random offset position */
  defaultPosition?: 'center' | { x: number; y: number };

  /** Open window maximized by default */
  openMaximized?: boolean;
};

export const createAppConfig = (et: AppConfig) => ({
  shouldOpenWindow: true,
  dockBreaksBefore: false,

  resizable: true,
  expandable: false,

  trafficLightsStyle: { top: '0.9rem', left: '0.9rem' } as React.CSSProperties,
  width: 600,
  height: 500,
  ...et,
});
