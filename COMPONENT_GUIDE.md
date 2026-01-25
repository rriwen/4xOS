# 组件开发指南

本文档说明如何在项目中使用设计令牌系统开发新组件。

## 快速开始

### 1. 导入设计令牌

在组件的 SCSS 文件中，首先导入设计令牌：

```scss
@import '../../design-tokens/tokens';

.my-component {
  // 使用设计令牌
}
```

### 2. 使用设计令牌

#### 间距

```scss
.my-component {
  padding: $spacing-4 $spacing-6;  // 8px 16px
  margin: $spacing-8;              // 24px
  gap: $spacing-2;                 // 4px
}
```

#### 颜色

```scss
.my-component {
  // 使用语义化颜色
  background-color: hsla(var(--app-color-light-hsl), $opacity-30);
  color: var(--app-color-light-contrast);
  
  // 深色模式自动适配
  :global(body.dark) & {
    background-color: hsla(var(--app-color-dark-hsl), $opacity-30);
  }
}
```

#### 字体

```scss
.my-component {
  font-size: var(--token-font-size-base);      // 14px
  font-weight: var(--token-font-weight-medium); // 500
  letter-spacing: var(--token-letter-spacing-wide);
  line-height: var(--token-line-height-normal);
}
```

#### 圆角

```scss
.my-component {
  border-radius: var(--token-radius-base);  // 8px - 卡片、输入框
  border-radius: var(--token-radius-lg);    // 12px - 模态框
  border-radius: var(--token-radius-full);  // 50% - 圆形
}
```

#### 阴影

```scss
.my-component {
  box-shadow: var(--token-shadow-md);  // 中等阴影
  box-shadow: var(--token-shadow-xl);  // 深度阴影
  
  // 深色模式
  :global(body.dark) & {
    box-shadow: var(--token-shadow-inner-md),
      var(--token-shadow-dark-xl);
  }
}
```

#### 模糊效果

```scss
.my-component {
  backdrop-filter: blur($blur-md);   // 10px - Dock、菜单栏
  backdrop-filter: blur($blur-xl);   // 15px - ContextMenu
  backdrop-filter: blur($blur-3xl);  // 30px - 模态框背景
}
```

#### 过渡动画

```scss
.my-component {
  transition: $transition-all;           // 所有属性
  transition: $transition-colors;         // 颜色过渡
  transition: $transition-transform;     // 变换过渡
  transition: $transition-opacity;       // 透明度过渡
}
```

#### Z-index

```scss
.my-component {
  z-index: var(--token-z-index-window);   // 100
  z-index: var(--token-z-index-dock);     // 9900
  z-index: var(--token-z-index-modal);    // 999999
  z-index: var(--token-z-index-tooltip); // 9999999
}
```

## 组件开发规范

### ✅ 应该做的

1. **始终使用设计令牌**
   - 所有间距、颜色、字体、圆角等必须使用设计令牌
   - 禁止硬编码像素值、颜色值

2. **使用语义化颜色**
   ```scss
   // ✅ 正确
   color: var(--app-color-light-contrast);
   background-color: hsla(var(--app-color-light-hsl), $opacity-30);
   
   // ❌ 错误
   color: #000000;
   background-color: rgba(255, 255, 255, 0.3);
   ```

3. **遵循间距系统**
   ```scss
   // ✅ 正确
   padding: $spacing-4 $spacing-6;
   
   // ❌ 错误
   padding: 7px 13px;
   ```

4. **使用预定义的过渡**
   ```scss
   // ✅ 正确
   transition: $transition-colors;
   
   // ❌ 错误
   transition: background-color 200ms ease-in-out;
   ```

5. **支持深色模式**
   ```scss
   .my-component {
     background-color: hsla(var(--app-color-light-hsl), $opacity-30);
     
     :global(body.dark) & {
       background-color: hsla(var(--app-color-dark-hsl), $opacity-30);
     }
   }
   ```

### ❌ 不应该做的

1. **不要硬编码样式值**
   ```scss
   // ❌ 错误
   padding: 8px;
   border-radius: 12px;
   font-size: 14px;
   color: #333333;
   ```

2. **不要创建新的令牌值**
   - 如果现有令牌不满足需求，先讨论是否需要添加新令牌
   - 不要随意创建临时值

3. **不要混用不同的设计系统**
   - 统一使用本设计令牌系统
   - 不要引入其他设计系统的值

## 组件示例

### 基础卡片组件

```scss
@import '../../design-tokens/tokens';

.card {
  padding: $spacing-6;
  margin: $spacing-4;
  
  background-color: hsla(var(--app-color-light-hsl), $opacity-30);
  backdrop-filter: blur($blur-md);
  
  border-radius: var(--token-radius-base);
  box-shadow: var(--token-shadow-md);
  
  transition: $transition-all;
  
  :global(body.dark) & {
    background-color: hsla(var(--app-color-dark-hsl), $opacity-30);
    box-shadow: var(--token-shadow-inner-md),
      var(--token-shadow-dark-xl);
  }
  
  &:hover {
    box-shadow: var(--token-shadow-lg);
  }
}

.title {
  font-size: var(--token-font-size-xl);
  font-weight: var(--token-font-weight-semibold);
  color: var(--app-color-light-contrast);
  margin-bottom: $spacing-4;
}

.content {
  font-size: var(--token-font-size-base);
  color: hsla(var(--app-color-dark-hsl), $opacity-70);
  line-height: var(--token-line-height-relaxed);
}
```

### 按钮组件

```scss
@import '../../design-tokens/tokens';

.button {
  padding: $spacing-4 $spacing-6;
  
  background-color: var(--app-color-primary);
  color: var(--app-color-primary-contrast);
  
  border-radius: var(--token-radius-base);
  border: none;
  
  font-size: var(--token-font-size-base);
  font-weight: var(--token-font-weight-medium);
  letter-spacing: var(--token-letter-spacing-normal);
  
  cursor: pointer;
  transition: $transition-colors;
  
  &:hover {
    opacity: $opacity-90;
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: $opacity-50;
    cursor: not-allowed;
  }
}
```

### 模态框组件

```scss
@import '../../design-tokens/tokens';

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--token-z-index-modal);
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  background-color: rgba(0, 0, 0, $opacity-40);
  backdrop-filter: blur($blur-md);
}

.modal {
  position: relative;
  width: 90vw;
  max-width: 600px;
  
  padding: $spacing-8;
  
  background-color: hsla(var(--app-color-light-hsl), $opacity-90);
  backdrop-filter: blur($blur-3xl);
  
  border-radius: var(--token-radius-lg);
  box-shadow: var(--token-shadow-xl);
  
  :global(body.dark) & {
    background-color: hsla(var(--app-color-dark-hsl), $opacity-90);
    box-shadow: var(--token-shadow-inner-md),
      var(--token-shadow-dark-xl);
  }
}
```

## 检查清单

在提交新组件之前，请确保：

- [ ] 所有样式值都使用设计令牌
- [ ] 无硬编码的像素值、颜色值
- [ ] 支持深色模式
- [ ] 使用了合适的过渡动画
- [ ] 遵循了间距系统（4px/8px 网格）
- [ ] 使用了语义化的颜色命名
- [ ] 圆角、阴影等使用了预定义的值

## 相关资源

- [设计令牌文档](./src/design-tokens/README.md)
- [苹果 Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
