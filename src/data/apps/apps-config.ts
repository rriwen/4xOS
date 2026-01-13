import { aboutSystemAppConfig } from './about-system.app-config';
import { calculatorAppConfig } from './calculator.app-config';
import { calendarAppConfig } from './calendar.app-config';
import { facetimeAppConfig } from './facetime.app-config';
import { finderAppConfig } from './finder.app-config';
import { launchpadAppConfig } from './launchpad.app-config';
import { mailAppConfig } from './mail.app-config';
import { messagesAppConfig } from './messages.app-config';
import { photosAppConfig } from './photos.app-config';
import { safariAppConfig } from './safari.app-config';
import { systemPreferencesAppConfig } from './system-preferences.app-config';

export const appsConfig = {
  calculator: calculatorAppConfig,
  calendar: calendarAppConfig,
  finder: finderAppConfig,
  safari: safariAppConfig,
  messages: messagesAppConfig,
  mail: mailAppConfig,
  photos: photosAppConfig,
  facetime: facetimeAppConfig,
  'system-preferences': systemPreferencesAppConfig,
  'about-system': aboutSystemAppConfig,
};
