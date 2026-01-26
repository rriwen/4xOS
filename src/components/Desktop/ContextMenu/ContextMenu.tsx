import { ReactNode, RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { RovingTabIndexProvider, useFocusEffect, useRovingTabIndex } from 'react-roving-tabindex';
import { contextMenuConfig } from '__/data/menu/context.menu.config';
import { useContextMenu, useFocusOutside } from '__/hooks';
import css from './ContextMenu.module.scss';

type Props = {
  outerRef: RefObject<HTMLDivElement>;
};

export const ContextMenu = ({ outerRef }: Props) => {
  const { xPos, yPos, isMenuVisible, setIsMenuVisible } = useContextMenu(outerRef);

  const containerRef = useRef<HTMLDivElement>();

  const defMenu = contextMenuConfig.default;

  useEffect(() => {
    isMenuVisible && containerRef.current.focus();
  }, [isMenuVisible]);

  useFocusOutside(containerRef, () => isMenuVisible && setIsMenuVisible(false));

  const handleMenuClick = (key: string) => {
    // Menu item click handler
  };

  useEffect(() => {
    if (containerRef.current && isMenuVisible) {
      containerRef.current.style.top = yPos;
      containerRef.current.style.left = xPos;
    }
  }, [isMenuVisible, yPos, xPos]);

  return (
    <>
      {isMenuVisible ? (
        <div
          className={css.contextContainer}
          tabIndex={-1}
          ref={containerRef}
        >
          <RovingTabIndexProvider options={{ direction: 'vertical', loopAround: true }}>
            {Object.keys(defMenu).map((key) => (
              <>
                <ContextMenuButton onClick={() => handleMenuClick(key)}>
                  {defMenu[key].title}
                </ContextMenuButton>
                {(defMenu[key] as any).breakAfter && <div className={css.divider}></div>}
              </>
            ))}
          </RovingTabIndexProvider>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

type ContextMenuButtonProps = {
  children: ReactNode;
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
      className={css.menuItem}
    >
      {children}
    </button>
  );
};
