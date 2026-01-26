import clsx from 'clsx';
import { FC } from 'react';
import css from './TopBarIconButton.module.scss';

export const TopBarIconButton: FC<JSX.IntrinsicElements['button']> = (props) => (
  <button {...props} className={clsx(css.button, props.className)} />
);
