# 前端界面开发规则文件

## 📋 概述

本文档定义了项目的前端界面开发规则，确保所有组件按照设计规范实现，并完整支持深色和浅色模式。所有开发者必须严格遵循本规则文件中的要求。

## 📚 相关文档

- [组件开发指南](./COMPONENT_GUIDE.md) - 组件开发详细指南
- [设计令牌文档](./src/design-tokens/README.md) - 设计令牌系统完整说明
- [设计令牌定义](./src/design-tokens/tokens.scss) - 所有设计令牌值
- [主题系统](./src/css/theme.scss) - 主题切换实现

---

## 1. 设计规范遵循规则

### 1.1 强制使用设计令牌系统

**规则：禁止硬编码任何样式值**

所有样式值必须使用设计令牌系统，包括但不限于：
- 颜色值（禁止使用 `#000000`、`rgb()`、`rgba()` 等）
- 间距值（禁止使用 `8px`、`16px` 等）
- 字体大小（禁止使用 `14px`、`16px` 等）
- 圆角值（禁止使用 `8px`、`12px` 等）
- 阴影值（禁止自定义阴影）
- 过渡动画（禁止自定义过渡时间）

#### ✅ 正确示例

```scss
@import '../../design-tokens/tokens';

.my-component {
  padding: $spacing-4 $spacing-6;  // ✅ 使用设计令牌
  margin: $spacing-8;
  
  background-color: hsla(var(--app-color-light-hsl), $opacity-30);
  color: var(--app-color-light-contrast);
  
  border-radius: var(--token-radius-base);
  box-shadow: var(--token-shadow-md);
  
  font-size: var(--token-font-size-base);
  font-weight: var(--token-font-weight-medium);
  
  transition: $transition-colors;
}
```

#### ❌ 错误示例

```scss
.my-component {
  padding: 8px 16px;  // ❌ 硬编码像素值
  margin: 24px;
  
  background-color: rgba(255, 255, 255, 0.3);  // ❌ 硬编码颜色值
  color: #000000;
  
  border-radius: 8px;  // ❌ 硬编码圆角
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);  // ❌ 硬编码阴影
  
  font-size: 14px;  // ❌ 硬编码字体大小
  font-weight: 500;
  
  transition: background-color 200ms ease-in-out;  // ❌ 硬编码过渡
}
```

### 1.2 遵循 4px/8px 网格系统

**规则：所有间距必须符合 4px/8px 网格系统**

间距系统基于 4px 和 8px 的倍数，确保视觉对齐和一致性。

#### 可用间距令牌

```scss
$spacing-0: 0;        // 0px
$spacing-1: 0.125rem; // 2px
$spacing-2: 0.25rem;  // 4px
$spacing-3: 0.375rem; // 6px
$spacing-4: 0.5rem;   // 8px
$spacing-5: 0.75rem;  // 12px
$spacing-6: 1rem;     // 16px
$spacing-7: 1.25rem;  // 20px
$spacing-8: 1.5rem;   // 24px
$spacing-9: 2rem;     // 32px
$spacing-10: 2.5rem;  // 40px
$spacing-11: 3rem;    // 48px
$spacing-12: 4rem;    // 64px
```

#### ✅ 正确示例

```scss
.card {
  padding: $spacing-6;        // ✅ 16px (4px 的倍数)
  margin: $spacing-4 $spacing-8;  // ✅ 8px 24px
  gap: $spacing-2;            // ✅ 4px
}
```

#### ❌ 错误示例

```scss
.card {
  padding: 15px;      // ❌ 不符合网格系统
  margin: 7px 13px;   // ❌ 不符合网格系统
  gap: 3px;           // ❌ 不符合网格系统
}
```

### 1.3 使用语义化颜色命名

**规则：使用语义化颜色变量，而非具体颜色值**

颜色系统提供了语义化的命名，确保主题切换时颜色正确适配。

#### 颜色变量说明

**浅色模式：**
- `--app-color-light` - 背景色（白色）
- `--app-color-light-contrast` - 对比色（黑色文本）
- `--app-color-dark` - 文本色（黑色）
- `--app-color-dark-contrast` - 对比背景（白色）

**深色模式：**
- `--app-color-light` - 背景色（黑色）
- `--app-color-light-contrast` - 对比色（白色文本）
- `--app-color-dark` - 文本色（白色）
- `--app-color-dark-contrast` - 对比背景（黑色）

#### ✅ 正确示例

```scss
.component {
  // 背景色：浅色模式为白色，深色模式为黑色
  background-color: hsla(var(--app-color-light-hsl), $opacity-30);
  
  // 文本色：浅色模式为黑色，深色模式为白色
  color: var(--app-color-light-contrast);
  
  // 边框色：使用语义化边框颜色
  border-color: hsla(var(--token-color-border-hsl), $opacity-50);
}
```

#### ❌ 错误示例

```scss
.component {
  background-color: rgba(255, 255, 255, 0.3);  // ❌ 硬编码，不支持主题切换
  color: #000000;  // ❌ 硬编码，不支持主题切换
  border-color: #e0e0e0;  // ❌ 硬编码，不支持主题切换
}
```

### 1.4 遵循苹果 Human Interface Guidelines

**规则：保持与 macOS 设计语言的一致性**

- 使用 SF Pro 字体系统（通过系统字体栈实现）
- 遵循 macOS 的视觉层次和间距规范
- 使用苹果风格的缓动函数（`$ease-apple`）
- 保持与原生 macOS 应用一致的交互反馈

---

## 2. 组件开发规范

### 2.1 样式文件结构

**规则：所有组件样式必须使用 SCSS 模块化**

#### 文件命名规范

- 组件样式文件：`ComponentName.module.scss`
- 必须与组件文件在同一目录
- 使用 kebab-case 命名类名

#### ✅ 正确示例

```
src/components/
  └── MyComponent/
      ├── MyComponent.tsx
      └── MyComponent.module.scss
```

```scss
// MyComponent.module.scss
@import '../../design-tokens/tokens';

.container {
  // 组件样式
}

.title {
  // 子元素样式
}
```

### 2.2 导入设计令牌

**规则：每个样式文件必须首先导入设计令牌**

#### ✅ 正确示例

```scss
@import '../../design-tokens/tokens';

.my-component {
  // 使用设计令牌
}
```

#### ❌ 错误示例

```scss
// ❌ 缺少设计令牌导入
.my-component {
  padding: 8px;  // 无法使用 $spacing-4
}
```

### 2.3 组件必须支持主题切换

**规则：所有组件必须同时支持深色和浅色模式**

组件必须通过 `:global(body.dark) &` 选择器实现深色模式支持。

#### ✅ 正确示例

```scss
@import '../../design-tokens/tokens';

.card {
  // 浅色模式样式（默认）
  background-color: hsla(var(--app-color-light-hsl), $opacity-30);
  color: var(--app-color-light-contrast);
  box-shadow: var(--token-shadow-md);
  
  // 深色模式样式
  :global(body.dark) & {
    background-color: hsla(var(--app-color-dark-hsl), $opacity-30);
    box-shadow: var(--token-shadow-inner-md),
      var(--token-shadow-dark-xl);
  }
}
```

#### ❌ 错误示例

```scss
// ❌ 只支持浅色模式
.card {
  background-color: rgba(255, 255, 255, 0.3);
  color: #000000;
}
```

### 2.4 使用预定义的过渡动画

**规则：使用设计令牌中定义的过渡动画组合**

#### 可用过渡组合

```scss
$transition-all: all $transition-base $ease-in-out;
$transition-colors: background-color $transition-base $ease-in-out,
  color $transition-base $ease-in-out,
  border-color $transition-base $ease-in-out;
$transition-transform: transform $transition-base $ease-apple;
$transition-opacity: opacity $transition-fast $ease-out;
```

#### ✅ 正确示例

```scss
.button {
  transition: $transition-colors;  // ✅ 使用预定义过渡
  
  &:hover {
    background-color: hsla(var(--app-color-primary-hsl), $opacity-90);
  }
}
```

#### ❌ 错误示例

```scss
.button {
  transition: background-color 200ms ease-in-out;  // ❌ 硬编码过渡
}
```

---

## 3. 深色/浅色模式支持规范

### 3.1 颜色使用规范

**规则：所有颜色必须使用 HSL 格式和 CSS 变量**

#### HSL 格式的优势

- 支持透明度控制（通过 `hsla()`）
- 主题切换时自动适配
- 保持颜色一致性

#### ✅ 正确示例

```scss
.component {
  // 背景色：使用 HSL + 透明度
  background-color: hsla(var(--app-color-light-hsl), $opacity-30);
  
  // 文本色：使用语义化变量
  color: var(--app-color-light-contrast);
  
  // 边框色：使用 HSL + 透明度
  border: $border-width-base solid hsla(var(--token-color-border-hsl), $opacity-50);
}
```

#### ❌ 错误示例

```scss
.component {
  background-color: rgba(255, 255, 255, 0.3);  // ❌ 不支持主题切换
  color: #000000;  // ❌ 不支持主题切换
  border: 1px solid #e0e0e0;  // ❌ 不支持主题切换
}
```

### 3.2 深色模式实现方式

**规则：使用 `:global(body.dark) &` 选择器实现深色模式**

#### 实现模式

```scss
.component {
  // 1. 定义浅色模式样式（默认）
  background-color: hsla(var(--app-color-light-hsl), $opacity-30);
  color: var(--app-color-light-contrast);
  
  // 2. 使用 :global(body.dark) & 覆盖深色模式样式
  :global(body.dark) & {
    background-color: hsla(var(--app-color-dark-hsl), $opacity-30);
    color: var(--app-color-dark-contrast);
  }
}
```

#### ✅ 完整示例

```scss
@import '../../design-tokens/tokens';

.modal {
  // 浅色模式
  background-color: hsla(var(--app-color-light-hsl), $opacity-90);
  backdrop-filter: blur($blur-3xl);
  color: var(--app-color-light-contrast);
  box-shadow: var(--token-shadow-xl);
  border-radius: var(--token-radius-lg);
  
  // 深色模式
  :global(body.dark) & {
    background-color: hsla(var(--app-color-dark-hsl), $opacity-90);
    // 深色模式使用内阴影 + 外阴影组合
    box-shadow: var(--token-shadow-inner-md),
      var(--token-shadow-dark-xl);
  }
}
```

### 3.3 阴影在深色模式下的处理

**规则：深色模式需要使用特殊阴影组合**

深色模式下，为了保持视觉层次，通常需要组合使用内阴影和外阴影。

#### ✅ 正确示例

```scss
.card {
  // 浅色模式：使用标准阴影
  box-shadow: var(--token-shadow-md);
  
  // 深色模式：使用内阴影 + 深色外阴影
  :global(body.dark) & {
    box-shadow: var(--token-shadow-inner-md),
      var(--token-shadow-dark-xl);
  }
}
```

#### 可用阴影令牌

**浅色模式：**
- `--token-shadow-sm` - 轻微阴影
- `--token-shadow-md` - 中等阴影
- `--token-shadow-lg` - 较大阴影
- `--token-shadow-xl` - 深度阴影

**深色模式专用：**
- `--token-shadow-inner-md` - 内阴影（边框效果）
- `--token-shadow-dark-xl` - 深色外阴影
- `--token-shadow-dark-2xl` - 更深的外阴影

### 3.4 文本颜色使用规范

**规则：使用语义化文本颜色变量**

#### 文本颜色层级

```scss
// 主要文本
color: var(--token-color-text-primary);

// 次要文本
color: var(--token-color-text-secondary);

// 三级文本（提示、占位符等）
color: var(--token-color-text-tertiary);
```

#### ✅ 正确示例

```scss
.card {
  .title {
    color: var(--token-color-text-primary);  // ✅ 主要文本
  }
  
  .description {
    color: var(--token-color-text-secondary);  // ✅ 次要文本
  }
  
  .hint {
    color: var(--token-color-text-tertiary);  // ✅ 三级文本
  }
}
```

### 3.5 背景和表面颜色

**规则：区分背景色和表面色**

- `--token-color-background` - 页面背景色
- `--token-color-surface` - 表面元素背景色（卡片、面板等）

#### ✅ 正确示例

```scss
.page {
  background-color: var(--token-color-background);  // ✅ 页面背景
}

.card {
  background-color: var(--token-color-surface);  // ✅ 卡片表面
}
```

---

## 4. 界面还原要求

### 4.1 严格按照设计稿实现

**规则：视觉样式必须与设计稿保持一致**

- 尺寸、间距、颜色必须精确匹配
- 字体大小、字重、行高必须符合设计规范
- 圆角、阴影效果必须一致
- 交互状态（hover、active、focus）必须实现

### 4.2 保持 macOS 设计语言一致性

**规则：遵循 macOS 视觉设计语言**

#### 关键要素

1. **模糊效果（Backdrop Filter）**
   ```scss
   // Dock、菜单栏等使用模糊效果
   backdrop-filter: blur($blur-md);
   ```

2. **圆角规范**
   ```scss
   // 卡片、输入框
   border-radius: var(--token-radius-base);  // 8px
   
   // 模态框、面板
   border-radius: var(--token-radius-lg);  // 12px
   
   // Dock
   border-radius: var(--token-radius-2xl);  // 19.2px
   ```

3. **阴影层次**
   - 轻微元素：`--token-shadow-sm`
   - 卡片：`--token-shadow-md`
   - 模态框：`--token-shadow-xl`

4. **过渡动画**
   - 使用苹果风格缓动：`$ease-apple`
   - 默认过渡时间：`$transition-base` (200ms)

### 4.3 交互反馈要求

**规则：所有交互元素必须提供视觉反馈**

#### 必须实现的交互状态

1. **Hover 状态**
   ```scss
   .button {
     transition: $transition-colors;
     
     &:hover {
       opacity: $opacity-90;
       // 或
       background-color: hsla(var(--app-color-primary-hsl), $opacity-90);
     }
   }
   ```

2. **Active 状态**
   ```scss
   .button {
     &:active {
       transform: translateY(1px);  // 轻微按下效果
       opacity: $opacity-80;
     }
   }
   ```

3. **Focus 状态（可访问性）**
   ```scss
   .input {
     &:focus {
       outline: $border-width-base solid var(--app-color-primary);
       outline-offset: $spacing-1;
     }
   }
   ```

4. **Disabled 状态**
   ```scss
   .button {
     &:disabled {
       opacity: $opacity-50;
       cursor: not-allowed;
     }
   }
   ```

### 4.4 响应式布局适配

**规则：确保在不同屏幕尺寸下正常显示**

- 使用相对单位（rem、em、%）而非固定像素
- 使用 Flexbox 或 Grid 布局
- 考虑移动端适配（如需要）

---

## 5. 代码检查清单

### 5.1 设计令牌使用检查

在提交代码前，请确认：

- [ ] 所有样式值都使用设计令牌
- [ ] 无硬编码的像素值、颜色值
- [ ] 无硬编码的字体大小、字重
- [ ] 无硬编码的圆角、阴影值
- [ ] 无硬编码的过渡动画时间

### 5.2 主题模式支持检查

在提交代码前，请确认：

- [ ] 所有颜色使用 HSL 格式和 CSS 变量
- [ ] 实现了深色模式样式（`:global(body.dark) &`）
- [ ] 背景色在深色模式下正确显示
- [ ] 文本颜色在深色模式下有足够对比度
- [ ] 阴影在深色模式下使用正确的组合
- [ ] 在浅色和深色模式下都测试过组件

### 5.3 组件开发检查

在提交代码前，请确认：

- [ ] 样式文件导入了设计令牌
- [ ] 使用 SCSS 模块化（.module.scss）
- [ ] 类名使用 kebab-case
- [ ] 使用了预定义的过渡动画
- [ ] 实现了所有必要的交互状态（hover、active、focus、disabled）

### 5.4 界面还原检查

在提交代码前，请确认：

- [ ] 视觉样式与设计稿一致
- [ ] 间距、尺寸精确匹配
- [ ] 颜色、字体符合设计规范
- [ ] 圆角、阴影效果一致
- [ ] 交互反馈符合预期
- [ ] 保持了 macOS 设计语言一致性

### 5.5 可访问性检查

在提交代码前，请确认：

- [ ] 文本颜色对比度符合 WCAG AA 标准
- [ ] 交互元素有 focus 状态
- [ ] 使用语义化 HTML 标签
- [ ] 提供适当的 ARIA 属性（如需要）
- [ ] 键盘导航支持（如需要）

### 5.6 性能优化检查

在提交代码前，请确认：

- [ ] 避免不必要的重绘和重排
- [ ] 使用 `transform` 和 `opacity` 进行动画（GPU 加速）
- [ ] 合理使用 `backdrop-filter`（性能考虑）
- [ ] 避免过深的嵌套选择器

---

## 6. 常见问题解答

### Q1: 如果设计令牌中没有我需要的值怎么办？

**A:** 首先检查是否有类似的令牌可以使用。如果确实需要新值，请：
1. 在团队中讨论是否需要添加新令牌
2. 如果同意，在 `src/design-tokens/tokens.scss` 中添加新令牌
3. 更新相关文档

**禁止**：不要创建临时值或硬编码。

### Q2: 如何判断应该使用哪个间距值？

**A:** 遵循 4px/8px 网格系统：
- 小间距：`$spacing-1` (2px)、`$spacing-2` (4px)
- 中间距：`$spacing-4` (8px)、`$spacing-6` (16px)
- 大间距：`$spacing-8` (24px)、`$spacing-12` (64px)

参考现有组件的间距使用模式。

### Q3: 深色模式下颜色不显示怎么办？

**A:** 检查以下几点：
1. 是否使用了 HSL 格式和 CSS 变量
2. 是否正确实现了 `:global(body.dark) &` 选择器
3. 是否使用了正确的颜色变量（`--app-color-light` vs `--app-color-dark`）
4. 在浏览器开发者工具中检查 CSS 变量是否正确应用

### Q4: 什么时候使用 `backdrop-filter`？

**A:** 以下场景使用模糊效果：
- Dock：`blur($blur-md)` (10px)
- 菜单栏：`blur($blur-md)` (10px)
- TopBar：`blur($blur-lg)` (12px)
- ContextMenu：`blur($blur-xl)` (15px)
- 模态框背景：`blur($blur-3xl)` (30px)

注意：`backdrop-filter` 有性能开销，不要过度使用。

### Q5: 如何实现渐变背景？

**A:** 使用设计令牌中的颜色变量：

```scss
.gradient {
  background: linear-gradient(
    to bottom,
    hsla(var(--app-color-light-hsl), $opacity-90),
    hsla(var(--app-color-light-hsl), $opacity-70)
  );
  
  :global(body.dark) & {
    background: linear-gradient(
      to bottom,
      hsla(var(--app-color-dark-hsl), $opacity-90),
      hsla(var(--app-color-dark-hsl), $opacity-70)
    );
  }
}
```

---

## 7. 最佳实践示例

### 7.1 完整组件示例

```scss
@import '../../design-tokens/tokens';

.card {
  // 布局
  padding: $spacing-6;
  margin: $spacing-4;
  
  // 外观 - 浅色模式
  background-color: hsla(var(--app-color-light-hsl), $opacity-30);
  backdrop-filter: blur($blur-md);
  border-radius: var(--token-radius-base);
  box-shadow: var(--token-shadow-md);
  
  // 文本
  color: var(--app-color-light-contrast);
  font-size: var(--token-font-size-base);
  font-weight: var(--token-font-weight-medium);
  line-height: var(--token-line-height-normal);
  
  // 过渡
  transition: $transition-all;
  
  // 交互状态
  &:hover {
    box-shadow: var(--token-shadow-lg);
    transform: translateY(-2px);
  }
  
  // 深色模式
  :global(body.dark) & {
    background-color: hsla(var(--app-color-dark-hsl), $opacity-30);
    box-shadow: var(--token-shadow-inner-md),
      var(--token-shadow-dark-xl);
  }
}

.title {
  font-size: var(--token-font-size-xl);
  font-weight: var(--token-font-weight-semibold);
  color: var(--token-color-text-primary);
  margin-bottom: $spacing-4;
}

.content {
  font-size: var(--token-font-size-base);
  color: var(--token-color-text-secondary);
  line-height: var(--token-line-height-relaxed);
}
```

### 7.2 按钮组件示例

```scss
@import '../../design-tokens/tokens';

.button {
  // 布局
  padding: $spacing-4 $spacing-6;
  
  // 外观
  background-color: var(--app-color-primary);
  color: var(--app-color-primary-contrast);
  border: none;
  border-radius: var(--token-radius-base);
  
  // 文本
  font-size: var(--token-font-size-base);
  font-weight: var(--token-font-weight-medium);
  letter-spacing: var(--token-letter-spacing-normal);
  
  // 交互
  cursor: pointer;
  transition: $transition-colors;
  
  // 状态
  &:hover {
    opacity: $opacity-90;
  }
  
  &:active {
    transform: translateY(1px);
    opacity: $opacity-80;
  }
  
  &:focus {
    outline: $border-width-base solid var(--app-color-primary);
    outline-offset: $spacing-1;
  }
  
  &:disabled {
    opacity: $opacity-50;
    cursor: not-allowed;
  }
}
```

### 7.3 模态框组件示例

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
  
  // 浅色模式
  background-color: hsla(var(--app-color-light-hsl), $opacity-90);
  backdrop-filter: blur($blur-3xl);
  border-radius: var(--token-radius-lg);
  box-shadow: var(--token-shadow-xl);
  
  // 深色模式
  :global(body.dark) & {
    background-color: hsla(var(--app-color-dark-hsl), $opacity-90);
    box-shadow: var(--token-shadow-inner-md),
      var(--token-shadow-dark-xl);
  }
}
```

---

## 8. 违规处理

### 8.1 代码审查

所有代码提交必须经过审查，审查重点包括：
- 设计令牌使用情况
- 主题模式支持情况
- 界面还原度
- 代码质量

### 8.2 常见违规

以下情况将被要求修改：
- 硬编码样式值
- 缺少深色模式支持
- 未使用设计令牌
- 不符合设计规范
- 缺少必要的交互状态

---

## 9. 更新日志

- **2024-XX-XX** - 初始版本，创建前端开发规则文件

---

## 10. 联系与反馈

如有疑问或建议，请：
1. 查看相关文档（组件开发指南、设计令牌文档）
2. 在团队中讨论
3. 提交 Issue 或 Pull Request

---

**记住：遵循这些规则可以确保代码质量、设计一致性和可维护性。让我们一起构建优秀的界面！**
