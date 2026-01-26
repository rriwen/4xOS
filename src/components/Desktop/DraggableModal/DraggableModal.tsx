import { ReactNode, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import css from './DraggableModal.module.scss';

type DraggableModalProps = {
  /**
   * 弹窗内容
   */
  children: ReactNode;
  
  /**
   * 是否显示弹窗
   */
  isOpen: boolean;
  
  /**
   * 关闭弹窗的回调
   */
  onClose?: () => void;
  
  /**
   * 弹窗标题
   */
  title?: string;
  
  /**
   * 弹窗宽度
   * @default '600px'
   */
  width?: string | number;
  
  /**
   * 弹窗高度
   * @default '400px'
   */
  height?: string | number;
  
  /**
   * 是否显示关闭按钮
   * @default true
   */
  showCloseButton?: boolean;
  
  /**
   * 自定义类名
   */
  className?: string;
  
  /**
   * 是否可调整大小
   * @default false
   */
  resizable?: boolean;
  
  /**
   * 最小宽度
   * @default '300px'
   */
  minWidth?: string | number;
  
  /**
   * 最小高度
   * @default '200px'
   */
  minHeight?: string | number;
};

/**
 * DraggableModal - 可拖拽的弹窗组件
 * 
 * 一个支持拖拽移动的弹窗组件，符合设计令牌系统：
 * - 浅色模式：白色背景
 * - 深色模式：深色背景
 * - 支持拖拽移动
 * - 可选支持调整大小
 * 
 * @example
 * ```tsx
 * <DraggableModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="弹窗标题"
 * >
 *   <p>弹窗内容</p>
 * </DraggableModal>
 * ```
 */
export const DraggableModal = ({
  children,
  isOpen,
  onClose,
  title,
  width = '600px',
  height = '400px',
  showCloseButton = true,
  className,
  resizable = false,
  minWidth = '300px',
  minHeight = '200px',
}: DraggableModalProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // 计算居中位置
  const getInitialPosition = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const modalWidth = typeof width === 'string' ? parseFloat(width) : width;
    const modalHeight = typeof height === 'string' ? parseFloat(height) : height;
    
    return {
      x: (viewportWidth - modalWidth) / 2,
      y: (viewportHeight - modalHeight) / 2,
    };
  };

  return (
    <div className={css.overlay} onClick={onClose}>
      <Rnd
        default={{
          ...getInitialPosition(),
          width,
          height,
        }}
        minWidth={minWidth}
        minHeight={minHeight}
        enableResizing={resizable}
        bounds="window"
        dragHandleClassName="draggable-modal-header"
        onDragStart={() => setIsDragging(true)}
        onDragStop={() => setIsDragging(false)}
        cancel=".draggable-modal-close-button"
      >
        <div
          ref={modalRef}
          className={`${css.modal} ${className || ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 标题栏 - 可拖拽区域 */}
          {(title || showCloseButton) && (
            <div className={`${css.header} draggable-modal-header`}>
              {title && <h2 className={css.title}>{title}</h2>}
              {showCloseButton && onClose && (
                <button
                  className={`${css.closeButton} draggable-modal-close-button`}
                  onClick={onClose}
                  aria-label="关闭"
                >
                  ×
                </button>
              )}
            </div>
          )}

          {/* 内容区域 */}
          <div className={css.content}>{children}</div>
        </div>
      </Rnd>
    </div>
  );
};
