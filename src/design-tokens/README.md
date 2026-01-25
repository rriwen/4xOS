# 设计令牌系统 (Design Tokens)

本目录包含项目的完整设计令牌系统，参考苹果 Human Interface Guidelines 设计规范。

## 📚 目录

- [概述](#概述)
- [使用方式](#使用方式)
- [令牌分类](#令牌分类)
- [命名规范](#命名规范)
- [最佳实践](#最佳实践)

## 概述

设计令牌是设计系统的原子单位，定义了所有视觉样式的基础值。使用设计令牌可以：

- ✅ 确保设计一致性
- ✅ 简化主题切换（明暗模式）
- ✅ 提高开发效率
- ✅ 便于维护和更新

## 使用方式

### 在 SCSS 中使用

```scss
// 导入设计令牌
@import '../design-tokens/tokens';

.my-component {
  // 使用间距令牌
  padding: $spacing-4 $spacing-6;
  margin-bottom: $spacing-8;
  
  // 使用颜色令牌
  background-color: $color-background-light;
  color: $color-text-primary-light;
  
  // 使用圆角令牌
  border-radius: $radius-base;
  
  // 使用阴影令牌
  box-shadow: $shadow-md;
  
  // 使用字体令牌
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  
  // 使用过渡动画
  transition: $transition-all;
}
```

### 在 CSS 变量中使用

设计令牌会自动转换为 CSS 变量，可以在任何 CSS 文件中使用：

```css
.my-component {
  padding: var(--token-spacing-4) var(--token-spacing-6);
  border-radius: var(--token-radius-base);
  font-size: var(--token-font-size-base);
}
```

### 在 TypeScript 中使用

```typescript
import { getSpacingVar, getRadiusVar } from '../design-tokens/tokens';

const style = {
  padding: getSpacingVar('4'),
  borderRadius: getRadiusVar('base'),
};
```

## 令牌分类

### 颜色系统 (Color System)

#### 基础颜色
- `$color-primary` - 主色
- `$color-primary-contrast` - 主色对比色

#### 语义颜色
- `$color-success` - 成功
- `$color-warning` - 警告
- `$color-error` - 错误
- `$color-info` - 信息

#### 中性色（浅色主题）
- `$color-background-light` - 背景色
- `$color-surface-light` - 表面色
- `$color-text-primary-light` - 主要文本
- `$color-text-secondary-light` - 次要文本
- `$color-text-tertiary-light` - 三级文本
- `$color-border-light` - 边框色

#### 中性色（深色主题）
- `$color-background-dark` - 背景色
- `$color-surface-dark` - 表面色
- `$color-text-primary-dark` - 主要文本
- `$color-text-secondary-dark` - 次要文本
- `$color-text-tertiary-dark` - 三级文本
- `$color-border-dark` - 边框色

### 字体系统 (Typography)

#### 字号
- `$font-size-xs` - 11px
- `$font-size-sm` - 12px
- `$font-size-base` - 14px
- `$font-size-md` - 15px
- `$font-size-lg` - 16px
- `$font-size-xl` - 18px
- `$font-size-2xl` - 20px
- `$font-size-3xl` - 24px
- `$font-size-4xl` - 28px
- `$font-size-5xl` - 32px
- `$font-size-6xl` - 48px

#### 字重
- `$font-weight-regular` - 400
- `$font-weight-medium` - 500
- `$font-weight-semibold` - 600
- `$font-weight-bold` - 700

#### 行高
- `$line-height-tight` - 1.2
- `$line-height-normal` - 1.4
- `$line-height-relaxed` - 1.6
- `$line-height-loose` - 1.8

#### 字间距
- `$letter-spacing-tight` - -0.01em
- `$letter-spacing-normal` - 0
- `$letter-spacing-wide` - 0.3px
- `$letter-spacing-wider` - 0.4px

### 间距系统 (Spacing)

基于 4px/8px 网格系统：

- `$spacing-0` - 0
- `$spacing-1` - 2px
- `$spacing-2` - 4px
- `$spacing-3` - 6px
- `$spacing-4` - 8px
- `$spacing-5` - 12px
- `$spacing-6` - 16px
- `$spacing-7` - 20px
- `$spacing-8` - 24px
- `$spacing-9` - 32px
- `$spacing-10` - 40px
- `$spacing-11` - 48px
- `$spacing-12` - 64px

### 圆角系统 (Border Radius)

- `$radius-none` - 0
- `$radius-sm` - 4px（按钮、标签）
- `$radius-md` - 6px
- `$radius-base` - 8px（卡片、输入框）
- `$radius-lg` - 12px（模态框、面板）
- `$radius-xl` - 16px（大容器）
- `$radius-2xl` - 19.2px（Dock）
- `$radius-full` - 50%（圆形）

### 阴影系统 (Shadows)

#### 层级1 - 轻微阴影
- `$shadow-sm` - 悬浮元素
- `$shadow-base` - 基础阴影

#### 层级2 - 中等阴影
- `$shadow-md` - 卡片
- `$shadow-lg` - 较大卡片

#### 层级3 - 深度阴影
- `$shadow-xl` - 模态框
- `$shadow-2xl` - 深度模态框
- `$shadow-3xl` - 最深阴影

#### 特殊阴影
- `$shadow-dock` - Dock 专用阴影
- `$shadow-inner-sm/md/lg` - 内阴影（深色模式边框）
- `$shadow-dark-xl/2xl` - 深色模式阴影

### 模糊效果 (Blur)

- `$blur-none` - 0
- `$blur-sm` - 5px（工具提示）
- `$blur-md` - 10px（Dock、菜单栏）
- `$blur-lg` - 12px（TopBar）
- `$blur-xl` - 15px（ContextMenu）
- `$blur-2xl` - 20px（模态框背景）
- `$blur-3xl` - 30px（深度模糊）

### 过渡动画 (Transitions)

#### 持续时间
- `$transition-fast` - 150ms（微交互）
- `$transition-base` - 200ms（默认）
- `$transition-slow` - 300ms（复杂动画）

#### 缓动函数
- `$ease-in` - ease-in
- `$ease-out` - ease-out
- `$ease-in-out` - ease-in-out
- `$ease-apple` - cubic-bezier(0.16, 1, 0.3, 1)（苹果风格）

#### 常用组合
- `$transition-all` - 所有属性过渡
- `$transition-colors` - 颜色过渡
- `$transition-transform` - 变换过渡
- `$transition-opacity` - 透明度过渡

### Z-index 层级 (Z-Index)

- `$z-index-base` - 0
- `$z-index-window` - 100
- `$z-index-window-max` - 1000
- `$z-index-dock` - 9900
- `$z-index-modal` - 999999
- `$z-index-tooltip` - 9999999

## 命名规范

### SCSS 变量命名

格式：`$category-name-variant`

示例：
- `$color-primary` - 颜色-主色
- `$font-size-base` - 字体-字号-基础
- `$spacing-4` - 间距-4
- `$radius-lg` - 圆角-大
- `$shadow-md` - 阴影-中
- `$transition-base` - 过渡-基础

### CSS 变量命名

格式：`--token-category-name`

示例：
- `--token-color-primary`
- `--token-font-size-base`
- `--token-spacing-4`

## 最佳实践

### ✅ 应该做的

1. **始终使用设计令牌**
   ```scss
   // ✅ 正确
   padding: $spacing-4;
   
   // ❌ 错误
   padding: 8px;
   ```

2. **使用语义化颜色**
   ```scss
   // ✅ 正确
   color: $color-text-primary-light;
   
   // ❌ 错误
   color: #000000;
   ```

3. **使用预定义的过渡组合**
   ```scss
   // ✅ 正确
   transition: $transition-colors;
   
   // ❌ 错误
   transition: background-color 200ms ease-in-out;
   ```

4. **遵循间距系统**
   ```scss
   // ✅ 正确
   margin: $spacing-4 $spacing-6;
   
   // ❌ 错误
   margin: 7px 13px;
   ```

### ❌ 不应该做的

1. **不要硬编码样式值**
   - 禁止直接使用像素值、颜色值等
   - 必须使用设计令牌

2. **不要创建新的令牌值**
   - 如果现有令牌不满足需求，先讨论是否需要添加新令牌
   - 不要随意创建临时值

3. **不要混用不同的令牌系统**
   - 统一使用本设计令牌系统
   - 不要引入其他设计系统的值

## 主题切换

设计令牌系统支持明暗主题自动切换。在 `theme.scss` 中，会根据 `body.dark` 类自动应用不同的颜色值。

## 更新日志

- 2024 - 初始版本，参考苹果 Human Interface Guidelines 创建完整设计令牌系统

## 相关资源

- [苹果 Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Design Tokens 最佳实践](https://www.uisdc.com/design-token)
