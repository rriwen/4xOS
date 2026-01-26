import { useMotionValue } from 'framer-motion';
import { useAtom } from 'jotai';
import { RovingTabIndexProvider } from 'react-roving-tabindex';
import { appsConfig } from '__/data/apps/apps-config';
import { openAppsStore } from '__/stores/apps.store';
import css from './Dock.module.scss';
import { DockItem } from './DockItem';

// 定义要在 Dock 中显示的应用
const dockAppIDs: Array<keyof typeof appsConfig> = [
  'finder',
  'safari',
  'talk-to-4x',
  'mail',
  'system-preferences',
];

export const Dock = () => {
  const [openApps] = useAtom(openAppsStore);

  const mouseX = useMotionValue<number | null>(null);

  // Hi
  return (
    <section id="dock" className={css.container}>
      <div
        className={css.dockEl}
        onMouseMove={(event) => mouseX.set(event.nativeEvent.x)}
        onMouseLeave={() => mouseX.set(null)}
      >
        <RovingTabIndexProvider options={{ direction: 'horizontal' }}>
          {dockAppIDs.map((appID, i) => (
            <div>
              {appsConfig[appID].dockBreaksBefore && (
                <div className={css.divider} key={`${appID}-divider`} aria-hidden="true" />
              )}
              <DockItem
                index={i}
                key={appID}
                mouseX={mouseX}
                appID={appID}
                isOpen={openApps[appID]}
                {...appsConfig[appID]}
              />
            </div>
          ))}
        </RovingTabIndexProvider>
      </div>
    </section>
  );
};
