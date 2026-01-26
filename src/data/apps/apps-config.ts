// 保持同步导入以确保配置立即可用
// Vite 的代码分割配置会将应用配置分离到独立的 chunk 中
import { facetimeAppConfig } from './facetime.app-config';
import { finderAppConfig } from './finder.app-config';
import { launchpadAppConfig } from './launchpad.app-config';
import { mailAppConfig } from './mail.app-config';
import { photosAppConfig } from './photos.app-config';
import { safariAppConfig } from './safari.app-config';
import { systemPreferencesAppConfig } from './system-preferences.app-config';
import { talkTo4xAppConfig } from './talk-to-4x.app-config';

export const appsConfig = {
  finder: finderAppConfig,
  safari: safariAppConfig,
  mail: mailAppConfig,
  photos: photosAppConfig,
  facetime: facetimeAppConfig,
  'system-preferences': systemPreferencesAppConfig,
  'talk-to-4x': talkTo4xAppConfig,
  launchpad: launchpadAppConfig,
};
