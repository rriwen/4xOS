import { createAppConfig } from '__/helpers/create-app-config';

export const safariAppConfig = createAppConfig({
  title: 'Safari with me',
  resizable: true,
  width: 960,
  defaultPosition: 'center',
  openMaximized: true,
});
