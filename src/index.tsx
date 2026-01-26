import { Provider } from 'jotai';
import { createRoot } from 'react-dom/client';
import './css/global.scss';
import { Desktop } from './views/desktop/Desktop';

// WOWOWOWOW

const root = createRoot(document.getElementById('root')!);
root.render(
  <Provider>
    <Desktop />
  </Provider>
);
