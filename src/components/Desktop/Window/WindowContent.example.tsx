/**
 * WindowContent 组件使用示例
 * 
 * 这个文件展示了如何使用 WindowContent 组件
 */

import { WindowContent } from './WindowContent';

// 示例 1: 基础使用
export const BasicExample = () => {
  return (
    <WindowContent>
      <h1>窗口标题</h1>
      <p>这是窗口内容区域，会自动适配明暗主题。</p>
      <p>浅色模式：白色背景</p>
      <p>深色模式：深色背景</p>
    </WindowContent>
  );
};

// 示例 2: 自定义类名
export const CustomClassNameExample = () => {
  return (
    <WindowContent className="my-custom-window">
      <div>自定义样式的窗口内容</div>
    </WindowContent>
  );
};

// 示例 3: 无内边距
export const NoPaddingExample = () => {
  return (
    <WindowContent padding={false}>
      <div style={{ padding: '1rem' }}>
        这个窗口内容没有默认内边距，需要手动设置
      </div>
    </WindowContent>
  );
};

// 示例 4: 在现有 Window 组件中使用
export const InWindowExample = () => {
  return (
    <div style={{ width: '600px', height: '400px' }}>
      <WindowContent>
        <h2>窗口标题</h2>
        <p>这个 WindowContent 组件可以在现有的 Window 组件中使用。</p>
        <p>它会自动适配主题，提供正确的背景色和文本颜色。</p>
      </WindowContent>
    </div>
  );
};
