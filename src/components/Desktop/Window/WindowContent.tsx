import { ComponentChildren } from 'preact';
import css from './WindowContent.module.scss';

type WindowContentProps = {
  /**
   * 窗口内容
   */
  children: ComponentChildren;
  
  /**
   * 自定义类名
   */
  className?: string;
  
  /**
   * 是否显示内边距
   * @default true
   */
  padding?: boolean;
};

/**
 * WindowContent - 窗口内容组件
 * 
 * 一个符合设计令牌系统的窗口内容组件，支持明暗主题自动切换：
 * - 浅色模式：白色背景
 * - 深色模式：深色背景
 * 
 * @example
 * ```tsx
 * <WindowContent>
 *   <h1>窗口标题</h1>
 *   <p>窗口内容</p>
 * </WindowContent>
 * ```
 */
export const WindowContent = ({ 
  children, 
  className,
  padding = true 
}: WindowContentProps) => {
  return (
    <div 
      class={`${css.windowContent} ${className || ''}`}
      style={!padding ? { padding: 0 } : undefined}
    >
      {children}
    </div>
  );
};
