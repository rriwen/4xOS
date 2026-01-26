import { ReactNode, useEffect, useRef } from 'react';
import css from './ActionCenterShell.module.scss';

type MenuShellProps = {
  children: ReactNode;
};

export const ActionCenterShell = ({ children }: MenuShellProps) => {
  const ref = useRef<HTMLElement>();

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <section className={css.container} ref={ref} tabIndex={-1}>
      {children}
    </section>
  );
};
