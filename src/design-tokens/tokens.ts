/**
 * Design Tokens - TypeScript 类型定义和工具函数
 * 
 * 提供类型安全的设计令牌访问和工具函数
 */

// ============================================
// 颜色令牌类型
// ============================================

export type ColorToken =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'background'
  | 'surface'
  | 'text-primary'
  | 'text-secondary'
  | 'text-tertiary'
  | 'border';

export type ColorVariant = 'light' | 'dark';

// ============================================
// 字体令牌类型
// ============================================

export type FontSizeToken =
  | 'xs'
  | 'sm'
  | 'base'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl';

export type FontWeightToken = 'regular' | 'medium' | 'semibold' | 'bold';

export type LineHeightToken = 'tight' | 'normal' | 'relaxed' | 'loose';

export type LetterSpacingToken = 'tight' | 'normal' | 'wide' | 'wider';

// ============================================
// 间距令牌类型
// ============================================

export type SpacingToken =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12';

// ============================================
// 圆角令牌类型
// ============================================

export type RadiusToken =
  | 'none'
  | 'sm'
  | 'md'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | 'full';

// ============================================
// 阴影令牌类型
// ============================================

export type ShadowToken =
  | 'sm'
  | 'base'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | 'dock'
  | 'inner-sm'
  | 'inner-md'
  | 'inner-lg'
  | 'dark-xl'
  | 'dark-2xl';

// ============================================
// 模糊令牌类型
// ============================================

export type BlurToken = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

// ============================================
// 过渡令牌类型
// ============================================

export type TransitionDurationToken = 'fast' | 'base' | 'slow';

export type EasingToken = 'in' | 'out' | 'in-out' | 'apple';

// ============================================
// Z-index 令牌类型
// ============================================

export type ZIndexToken = 'base' | 'window' | 'window-max' | 'dock' | 'modal' | 'tooltip';

// ============================================
// 工具函数
// ============================================

/**
 * 获取 CSS 变量名称
 * @param category 令牌类别
 * @param token 令牌名称
 * @returns CSS 变量名称
 */
export function getCSSVariableName(category: string, token: string): string {
  return `--token-${category}-${token}`;
}

/**
 * 获取间距值的 CSS 变量
 * @param token 间距令牌
 * @returns CSS 变量字符串
 */
export function getSpacingVar(token: SpacingToken): string {
  return `var(--token-spacing-${token})`;
}

/**
 * 获取圆角值的 CSS 变量
 * @param token 圆角令牌
 * @returns CSS 变量字符串
 */
export function getRadiusVar(token: RadiusToken): string {
  return `var(--token-radius-${token})`;
}

/**
 * 获取字体大小的 CSS 变量
 * @param token 字号令牌
 * @returns CSS 变量字符串
 */
export function getFontSizeVar(token: FontSizeToken): string {
  return `var(--token-font-size-${token})`;
}

/**
 * 获取字重的 CSS 变量
 * @param token 字重令牌
 * @returns CSS 变量字符串
 */
export function getFontWeightVar(token: FontWeightToken): string {
  return `var(--token-font-weight-${token})`;
}

/**
 * 获取阴影的 CSS 变量
 * @param token 阴影令牌
 * @returns CSS 变量字符串
 */
export function getShadowVar(token: ShadowToken): string {
  return `var(--token-shadow-${token})`;
}

/**
 * 获取模糊的 CSS 变量
 * @param token 模糊令牌
 * @returns CSS 变量字符串
 */
export function getBlurVar(token: BlurToken): string {
  return `var(--token-blur-${token})`;
}

/**
 * 获取过渡持续时间的 CSS 变量
 * @param token 过渡令牌
 * @returns CSS 变量字符串
 */
export function getTransitionDurationVar(token: TransitionDurationToken): string {
  return `var(--token-transition-duration-${token})`;
}

/**
 * 获取 Z-index 的 CSS 变量
 * @param token Z-index 令牌
 * @returns CSS 变量字符串
 */
export function getZIndexVar(token: ZIndexToken): string {
  return `var(--token-z-index-${token})`;
}
