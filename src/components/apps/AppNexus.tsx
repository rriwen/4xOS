import { AppID } from '__/stores/apps.store';
import { lazy } from 'react';

type AppNexusProps = {
  appID: AppID;
  isBeingDragged: boolean;
};

const TalkTo4x = lazy(() => import('./TalkTo4x/TalkTo4x'));
const Safari = lazy(() => import('./Safari/Safari'));

const PlaceholderApp = lazy(() => import('./Placeholder/Placeholder'));

export const AppNexus = ({ appID, isBeingDragged }: AppNexusProps) => {
  if (appID === 'talk-to-4x') return <TalkTo4x />;
  if (appID === 'safari') return <Safari />;

  return <PlaceholderApp appID={appID} />;
};
