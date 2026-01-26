import { RefObject } from 'react';
import { useEffect, useCallback, useState } from 'react';

export const useContextMenu = <T extends HTMLElement>(outerRef: RefObject<T>) => {
  const [xPos, setXPos] = useState('0px');
  const [yPos, setYPos] = useState('0px');

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault();

    if (!outerRef.current?.contains(event.target as HTMLElement)) return setIsMenuVisible(false);

    // 使用 fixed 定位，直接使用视口坐标
    let x = event.clientX;
    let y = event.clientY;

    // Open to other side if rest of space is too small
    const menuWidth = 250;
    const menuHeight = 300;
    if (window.innerWidth - x < menuWidth) x -= menuWidth;
    if (window.innerHeight - y < menuHeight) y -= menuHeight;

    setXPos(`${x}px`);
    setYPos(`${y}px`);

    setIsMenuVisible(true);

    return;
  }, []);

  const handleClick = () => setIsMenuVisible(false);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return { xPos, yPos, isMenuVisible, setIsMenuVisible };
};
