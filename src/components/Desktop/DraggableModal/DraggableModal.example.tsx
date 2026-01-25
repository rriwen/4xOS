/**
 * DraggableModal 组件使用示例
 */

import { useState } from 'preact/hooks';
import { DraggableModal } from './DraggableModal';

// 示例 1: 基础使用
export const BasicExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>打开弹窗</button>
      
      <DraggableModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="基础弹窗"
      >
        <p>这是一个可拖拽的弹窗。</p>
        <p>点击标题栏可以拖拽移动弹窗位置。</p>
        <p>点击遮罩层或关闭按钮可以关闭弹窗。</p>
      </DraggableModal>
    </>
  );
};

// 示例 2: 自定义尺寸
export const CustomSizeExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>打开大弹窗</button>
      
      <DraggableModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="自定义尺寸弹窗"
        width="800px"
        height="600px"
      >
        <div>
          <h3>这是一个更大的弹窗</h3>
          <p>宽度：800px</p>
          <p>高度：600px</p>
        </div>
      </DraggableModal>
    </>
  );
};

// 示例 3: 可调整大小
export const ResizableExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>打开可调整大小的弹窗</button>
      
      <DraggableModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="可调整大小的弹窗"
        resizable={true}
        minWidth="400px"
        minHeight="300px"
      >
        <p>这个弹窗可以拖拽移动，也可以调整大小。</p>
        <p>拖拽右下角可以调整弹窗尺寸。</p>
      </DraggableModal>
    </>
  );
};

// 示例 4: 无标题栏
export const NoTitleExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>打开无标题弹窗</button>
      
      <DraggableModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showCloseButton={false}
      >
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>无标题栏弹窗</h2>
          <p>这个弹窗没有标题栏，但仍然可以通过点击遮罩层关闭。</p>
          <button onClick={() => setIsOpen(false)}>关闭</button>
        </div>
      </DraggableModal>
    </>
  );
};

// 示例 5: 复杂内容
export const ComplexContentExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>打开复杂内容弹窗</button>
      
      <DraggableModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="复杂内容弹窗"
        width="700px"
        height="500px"
      >
        <div>
          <h3>弹窗内容</h3>
          <p>这是一个包含复杂内容的弹窗。</p>
          
          <div style={{ marginTop: '1rem' }}>
            <label>
              <input type="checkbox" /> 选项 1
            </label>
            <br />
            <label>
              <input type="checkbox" /> 选项 2
            </label>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <button>确认</button>
            <button style={{ marginLeft: '0.5rem' }}>取消</button>
          </div>
        </div>
      </DraggableModal>
    </>
  );
};
