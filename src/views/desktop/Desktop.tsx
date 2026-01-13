import { useAtom } from 'jotai';
import { useEffect, useRef } from 'preact/hooks';
import { ContextMenu } from '__/components/Desktop/ContextMenu/ContextMenu';
import { StartupChime } from '__/components/Desktop/StartupChime';
import { WindowsArea } from '__/components/Desktop/Window/WindowsArea';
import { Dock } from '__/components/dock/Dock';
import { TopBar } from '__/components/topbar/TopBar';
import { useTheme } from '__/hooks/use-theme';
import { currentWallpaperAtom } from '__/stores/wallpaper.store';
import css from './Desktop.module.scss';

export const Desktop = () => {
  const outerRef = useRef<HTMLDivElement>();
  const backgroundRef = useRef<HTMLDivElement>();
  const [currentWallpaper] = useAtom(currentWallpaperAtom);
  const [theme] = useTheme();

  useEffect(() => {
    if (backgroundRef.current && currentWallpaper) {
      backgroundRef.current.style.setProperty('--wallpaper-url', `url(${currentWallpaper})`);
    }
  }, [currentWallpaper, theme]);

  return (
    <div>
      <main ref={outerRef} class={css.main}>
        <ContextMenu outerRef={outerRef} />
        <TopBar />
        <WindowsArea />
        <Dock />
      </main>

      <StartupChime />

      <div ref={backgroundRef} class={css.backgroundCover} aria-hidden="true" />
    </div>
  );
};
