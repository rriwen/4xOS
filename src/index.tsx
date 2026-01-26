import { Provider } from 'jotai';
import { render } from 'preact';
import { Analytics } from '@vercel/analytics/react';
import './css/global.scss';
import { Desktop } from './views/desktop/Desktop';

// WOWOWOWOW

render(
  <Provider>
    <Desktop />
    <Analytics />
  </Provider>,
  document.getElementById('root')!,
);
