import { format } from 'date-fns';
import { useState } from 'react';
import { useInterval } from '__/hooks';
import css from './Topbar.module.scss';

export const TopBarTime = () => {
  const [time, setTime] = useState(new Date());

  useInterval(() => setTime(new Date()), 2000);

  return (
    <div className={css.time}>
      {format(time, 'EEE MMM dd')}&nbsp; {format(time, 'h:mm aa')}
    </div>
  );
};
