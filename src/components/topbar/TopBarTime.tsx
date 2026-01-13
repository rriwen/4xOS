import { format } from 'date-fns';
import { useState } from 'preact/hooks';
import { useInterval } from '__/hooks';
import css from './Topbar.module.scss';

export const TopBarTime = () => {
  const [time, setTime] = useState(new Date());

  useInterval(() => setTime(new Date()), 2000);

  return (
    <div class={css.time}>
      {format(time, 'EEE MMM dd')}&nbsp; {format(time, 'h:mm aa')}
    </div>
  );
};
