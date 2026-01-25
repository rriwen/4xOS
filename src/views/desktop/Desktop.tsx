import { useAtom } from 'jotai';
import { useImmerAtom } from 'jotai/immer';
import { useEffect, useRef } from 'preact/hooks';
import { ContextMenu } from '__/components/Desktop/ContextMenu/ContextMenu';
import { StartupChime } from '__/components/Desktop/StartupChime';
import { WindowsArea } from '__/components/Desktop/Window/WindowsArea';
import { Dock } from '__/components/dock/Dock';
import { TopBar } from '__/components/topbar/TopBar';
import { activeAppStore, openAppsStore } from '__/stores/apps.store';
import css from './Desktop.module.scss';

export const Desktop = () => {
  const outerRef = useRef<HTMLDivElement>();
  const backgroundRef = useRef<HTMLDivElement>();
  const [, setOpenApps] = useImmerAtom(openAppsStore);
  const [, setActiveApp] = useAtom(activeAppStore);

  // 在页面加载时自动打开 "talk to 4x" 应用
  useEffect(() => {
    setOpenApps((apps) => {
      apps['talk-to-4x'] = true;
      return apps;
    });
    setActiveApp('talk-to-4x');
  }, []);

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
