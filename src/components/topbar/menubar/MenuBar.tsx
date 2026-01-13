import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useRef } from 'preact/hooks';
import { useFocusOutside, useOutsideClick } from '__/hooks';
import { activeMenuStore, menuBarMenusStore } from '__/stores/menubar.store';
import { Menu } from './Menu';
import css from './MenuBar.module.scss';

export const MenuBar = () => {
  const [currentAppMenus] = useAtom(menuBarMenusStore);
  const [activeMenu, setActiveMenu] = useAtom(activeMenuStore);

  const parentRef = useRef<HTMLDivElement>();

  /** Close when document focus isn't in any menubar */
  useFocusOutside(parentRef, () => setActiveMenu(''));

  /** Close when clicked outside */
  useOutsideClick(parentRef, () => setActiveMenu(''));

  return (
    <div class={css.container} ref={parentRef}>
      {Object.keys(currentAppMenus).map((menuID) => (
        <div key={menuID}>
          <span class={css.menuItemWrapper}>
            <button
              onClick={() => setActiveMenu(menuID)}
              onMouseOver={() => activeMenu && setActiveMenu(menuID)}
              onFocus={() => setActiveMenu(menuID)}
              class={clsx({
                [css.menuButton]: true,
                [css.defaultMenu]: menuID === 'default',
                [css.appleIconButton]: menuID === 'apple',
              })}
              style={{ '--scale': activeMenu === menuID ? 1 : 0 } as React.CSSProperties}
            >
              {menuID === 'apple' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 1024 1024" fill="currentColor">
                  <path d="M896 276.16c-5.44-121.92-134.08-184-384-184S134.08 153.92 128 276.16L32 732.16c0 131.84 160 200 480 200S992 864 992 732.16z m-128 424a80 80 0 0 1-160 0h-192a80 80 0 1 1-128-64 80 80 0 1 1 128-64h192a80 80 0 1 1 128 64 79.68 79.68 0 0 1 32 64z m-256-377.6c-141.44 0-256-34.56-256-76.8s114.56-76.8 256-76.8 256 34.24 256 76.8-114.56 76.8-256 76.8z" />
                </svg>
              ) : (
                currentAppMenus[menuID].title
              )}
            </button>
          </span>
          <div
            class={css.menuParent}
            data-visible={activeMenu === menuID ? 'true' : 'false'}
          >
            <Menu menu={currentAppMenus[menuID].menu} />
          </div>
        </div>
      ))}
    </div>
  );
};
