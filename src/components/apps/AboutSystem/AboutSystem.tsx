import { useImmerAtom } from 'jotai/immer';
import clsx from 'clsx';
import { openAppsStore } from '__/stores/apps.store';
import css from './AboutSystem.module.scss';

const AboutSystem = () => {
  const [, setOpenApps] = useImmerAtom(openAppsStore);

  const handleClose = () => {
    setOpenApps((apps) => {
      apps['about-system'] = false;
      return apps;
    });
  };

  return (
    <section class={css.container}>
      <header class={clsx('app-window-drag-handle', css.header)} />
      <div class={css.content}>
        <div class={css.topSection}>
          <div class={css.avatarContainer}>
            <div class={css.avatar}>🐶</div>
          </div>
          <div class={css.name}>任文倩</div>
          <div class={css.subtitle}>泗澄, 产品设计师</div>
        </div>

        <div class={css.specsSection}>
          <div class={css.specRow}>
            <span class={css.specLabel}>坐标</span>
            <span class={css.specValue}>浙江杭州</span>
          </div>
          <div class={css.specRow}>
            <span class={css.specLabel}>手机</span>
            <span class={css.specValue}>18362976211</span>
          </div>
          <div class={css.specRow}>
            <span class={css.specLabel}>微信</span>
            <span class={css.specValue}>rriwen</span>
          </div>
          <div class={css.specRow}>
            <span class={css.specLabel}>邮箱</span>
            <span class={css.specValue}>rriwen@gmail.com</span>
          </div>
        </div>

        <div class={css.buttonSection}>
          <button class={css.moreInfoButton} onClick={handleClose}>
            关闭
          </button>
        </div>

        <div class={css.footer}>
          <div class={css.copyright}>© 2025 4xOS. All rights reserved.</div>
        </div>
      </div>
    </section>
  );
};

export default AboutSystem;

