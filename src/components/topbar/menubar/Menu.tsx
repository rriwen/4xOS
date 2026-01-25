import { useAtom } from 'jotai';
import { useImmerAtom } from 'jotai/immer';
import clsx from 'clsx';
import { useRef } from 'preact/hooks';
import { RovingTabIndexProvider, useFocusEffect, useRovingTabIndex } from 'react-roving-tabindex';
import { activeAppStore, openAppsStore } from '__/stores/apps.store';
import { activeMenuStore } from '__/stores/menubar.store';
import css from './Menu.module.scss';

type MenuProps = {
  menu: any;
};

export const Menu = ({ menu }: MenuProps) => {
  const [, setOpenApps] = useImmerAtom(openAppsStore);
  const [, setActiveApp] = useAtom(activeAppStore);
  const [, setActiveMenu] = useAtom(activeMenuStore);

  const handleMenuItemClick = (key: string) => {
    // Close menu after item click
    setActiveMenu('');
  };

  return (
    <div class={css.container} tabIndex={-1}>
      <RovingTabIndexProvider options={{ direction: 'vertical', loopAround: true }}>
        {Object.keys<string>(menu).map((key) => (
          <div key={key}>
            <MenuItemButton
              class={clsx(css.menuItem, menu[key].disabled && css.disabled)}
              disabled={menu[key].disabled}
              onClick={() => handleMenuItemClick(key)}
            >
              {menu[key].title}
            </MenuItemButton>
            {menu[key].breakAfter && <div class={css.divider} />}
          </div>
        ))}
      </RovingTabIndexProvider>
    </div>
  );
};

type MenuItemButtonProps = {
  children: any;
  disabled?: boolean;
  onClick?: () => void;
  class?: string;
};

const MenuItemButton = ({ children, disabled = false, onClick, class: className, ...props }: MenuItemButtonProps) => {
  const ref = useRef<HTMLButtonElement>();

  const [tabIndex, focused, handleKeyDown, handleRovingClick] = useRovingTabIndex(ref, disabled);

  useFocusEffect(focused, ref);

  const handleClick = (e: any) => {
    handleRovingClick();
    onClick?.();
  };

  return (
    <button
      tabIndex={tabIndex}
      ref={ref}
      onKeyDown={handleKeyDown}
      onClick={handleClick as any}
      class={className}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
