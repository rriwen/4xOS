import { ReactNode } from 'react';
import css from './ActionCenterSurface.module.scss';

interface ActionCenterSurfaceProps {
  grid: [[columnStart: number, columnSpan: number], [rowStart: number, rowSpan: number]];
  children: ReactNode;
}

export const ActionCenterSurface = ({ grid, children }: ActionCenterSurfaceProps) => {
  const [[columnStart, columnSpan], [rowStart, rowSpan]] = grid;

  return (
    <section
      className={css.container}
      style={
        {
          '--column-start': columnStart,
          '--column-span': columnSpan,
          '--row-start': rowStart,
          '--row-span': rowSpan,
        } as React.CSSProperties
      }
    >
      {children}
    </section>
  );
};
