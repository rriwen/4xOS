import { Provider } from 'jotai';
import { render } from 'preact';
import { inject } from '@vercel/analytics';
import './css/global.scss';
import { Desktop } from './views/desktop/Desktop';

// WOWOWOWOW

// Initialize Vercel Web Analytics
inject();

render(
  <Provider>
    <Desktop />
  </Provider>,
  document.getElementById('root')!,
);
