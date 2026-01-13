import clsx from 'clsx';
import { useState } from 'preact/hooks';
import { useTimeout } from '__/hooks';
import css from './StartupChime.module.scss';

export const StartupChime = () => {
  const [hiddenSplashScreen, setHiddenSplashScreen] = useState(false);

  useTimeout(() => {
    setHiddenSplashScreen(true);
  }, 3000);

  return (
    <>
      <div
        class={clsx({
          [css.splashScreen]: true,
          [css.hidden]: hiddenSplashScreen || import.meta.env.DEV
        })}
        hidden={hiddenSplashScreen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 1024 1024" fill="white">
          <path d="M896 276.16c-5.44-121.92-134.08-184-384-184S134.08 153.92 128 276.16L32 732.16c0 131.84 160 200 480 200S992 864 992 732.16z m-128 424a80 80 0 0 1-160 0h-192a80 80 0 1 1-128-64 80 80 0 1 1 128-64h192a80 80 0 1 1 128 64 79.68 79.68 0 0 1 32 64z m-256-377.6c-141.44 0-256-34.56-256-76.8s114.56-76.8 256-76.8 256 34.24 256 76.8-114.56 76.8-256 76.8z" />
        </svg>
      </div>
      <audio hidden autoPlay={import.meta.env.PROD} src="/assets/sounds/mac-startup-sound.mp3" />
    </>
  );
};
