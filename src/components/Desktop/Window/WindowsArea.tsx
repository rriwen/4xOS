import { useAtom, useAtomValue } from 'jotai';
import { lazy } from 'react';
import { useEffect, useRef } from 'react';
import { Suspense } from 'react';
import { appsConfig } from '__/data/apps/apps-config';
import {
  activeAppStore,
  openAppsStore,
  windowZIndexStore,
} from '__/stores/apps.store';
import css from './WindowsArea.module.scss';

const Window = lazy(() => import('./Window'));

export const WindowsArea = () => {
  const [openApps] = useAtom(openAppsStore);

  return (
    <section className={css.container}>
      <Suspense fallback={<span></span>}>
        {Object.keys(appsConfig).map(
          (appID) =>
            openApps[appID] &&
            appsConfig[appID].shouldOpenWindow && <Window key={appID} appID={appID} />,
        )}
      </Suspense>
    </section>
  );
};
