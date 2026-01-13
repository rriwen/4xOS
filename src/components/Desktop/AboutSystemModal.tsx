import { useEffect, useRef } from 'preact/hooks';
import { useOutsideClick } from '__/hooks';
import css from './AboutSystemModal.module.scss';

type AboutSystemModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AboutSystemModal = ({ isOpen, onClose }: AboutSystemModalProps) => {
  const modalRef = useRef<HTMLDivElement>();

  useOutsideClick(modalRef, () => {
    if (isOpen) onClose();
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div class={css.overlay}>
      <div class={css.modal} ref={modalRef}>
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
            <button class={css.moreInfoButton} onClick={onClose}>
              关闭
            </button>
          </div>

          <div class={css.footer}>
            <div class={css.copyright}>© 2025 4xOS. All rights reserved.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

