import { ComponentChildren, RefObject } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { RovingTabIndexProvider, useFocusEffect, useRovingTabIndex } from 'react-roving-tabindex';
import { contextMenuConfig } from '__/data/menu/context.menu.config';
import { useContextMenu, useFocusOutside } from '__/hooks';
import { WallpaperPicker } from '__/components/Desktop/WallpaperPicker/WallpaperPicker';
import css from './ContextMenu.module.scss';

type Props = {
  outerRef: RefObject<HTMLDivElement>;
};

export const ContextMenu = ({ outerRef }: Props) => {
  const { xPos, yPos, isMenuVisible, setIsMenuVisible } = useContextMenu(outerRef);
  const [isWallpaperPickerOpen, setIsWallpaperPickerOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>();

  const defMenu = contextMenuConfig.default;

  useEffect(() => {
    isMenuVisible && containerRef.current.focus();
  }, [isMenuVisible]);

  useFocusOutside(containerRef, () => isMenuVisible && setIsMenuVisible(false));

  const handleMenuClick = (key: string) => {
    if (key === 'change-desktop-bg') {
      setIsMenuVisible(false);
      setIsWallpaperPickerOpen(true);
    }
  };

  useEffect(() => {
    if (containerRef.current && isMenuVisible) {
      containerRef.current.style.setProperty('--menu-top', `${yPos}px`);
      containerRef.current.style.setProperty('--menu-left', `${xPos}px`);
    }
  }, [isMenuVisible, yPos, xPos]);

  return (
    <>
      {isMenuVisible ? (
        <div
          class={css.contextContainer}
          tabIndex={-1}
          ref={containerRef}
        >
          <RovingTabIndexProvider options={{ direction: 'vertical', loopAround: true }}>
            {Object.keys(defMenu).map((key) => (
              <>
                <ContextMenuButton onClick={() => handleMenuClick(key)}>
                  {defMenu[key].title}
                </ContextMenuButton>
                {(defMenu[key] as any).breakAfter && <div class={css.divider}></div>}
              </>
            ))}
          </RovingTabIndexProvider>
        </div>
      ) : (
        <></>
      )}
      <WallpaperPicker
        isOpen={isWallpaperPickerOpen}
        onClose={() => setIsWallpaperPickerOpen(false)}
      />
    </>
  );
};

type ContextMenuButtonProps = {
  children: ComponentChildren;
  onClick?: () => void;
};

const ContextMenuButton = ({ children, onClick }: ContextMenuButtonProps) => {
  const ref = useRef<HTMLButtonElement>();

  const [tabIndex, focused, handleKeyDown, handleRovingClick] = useRovingTabIndex(ref, false);

  useFocusEffect(focused, ref);

  const handleClick = () => {
    handleRovingClick();
    onClick?.();
  };

  return (
    <button
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      tabIndex={tabIndex}
      ref={ref}
      class={css.menuItem}
    >
      {children}
    </button>
  );
};
