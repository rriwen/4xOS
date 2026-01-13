import { AppID } from '__/stores/apps.store';
import { lazy } from 'react';

type AppNexusProps = {
  appID: AppID;
  isBeingDragged: boolean;
};

const Calculator = lazy(() => import('./Calculator/Calculator'));
const Calendar = lazy(() => import('./Calendar/Calendar'));
const AboutSystem = lazy(() => import('./AboutSystem/AboutSystem'));

const PlaceholderApp = lazy(() => import('./Placeholder/Placeholder'));

export const AppNexus = ({ appID, isBeingDragged }: AppNexusProps) => {
  if (appID === 'calculator') return <Calculator />;
  if (appID === 'calendar') return <Calendar />;
  if (appID === 'about-system') return <AboutSystem />;

  return <PlaceholderApp appID={appID} />;
};
