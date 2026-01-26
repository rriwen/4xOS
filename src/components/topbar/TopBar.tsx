import { ActionCenterToggle } from './ActionCenter/ActionCenterToggle';
import { MenuBar } from './menubar/MenuBar';
import css from './Topbar.module.scss';
import { TopBarTime } from './TopBarTime';

export const TopBar = () => {
  return (
    <header id="top-bar" className={css.header}>
      <MenuBar />

      <span className={css.spacer} />

      <ActionCenterToggle />

      <button>
        <TopBarTime />
      </button>
    </header>
  );
};
