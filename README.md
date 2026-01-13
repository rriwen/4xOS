# 4xOS - macOS Web 体验

这是一个开源项目，旨在使用标准的 Web 技术（HTML、CSS 和 JavaScript）在 Web 上复刻 macOS 的桌面体验。

## 项目简介

4xOS 是一个基于 Web 的 macOS 桌面环境模拟器，提供了类似 macOS Monterey/Big Sur 的桌面体验。项目使用现代前端技术栈构建，可以在任何现代浏览器中运行。

## 技术栈

- **框架**: Preact（轻量级 React 替代方案，提供更好的运行时性能）
- **构建工具**: Vite（超快的开发体验）
- **组件库**: 无依赖，完全自定义
- **样式方案**: SCSS 和 CSS Modules

## 功能特性

- 🖥️ 完整的 macOS 桌面环境模拟
- 🎨 精美的 UI 设计，高度还原 macOS 界面
- 📱 响应式设计，适配不同屏幕尺寸
- 🎯 流畅的动画和交互体验
- 🌓 支持深色/浅色主题切换
- 🖼️ 多种壁纸选择
- 📦 多个内置应用（计算器、日历、系统设置等）

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm start
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run serve
```

## 项目结构

```
4xOS-main/
├── src/              # 源代码目录
│   ├── components/   # React/Preact 组件
│   ├── stores/       # 状态管理
│   ├── hooks/        # 自定义 Hooks
│   ├── data/         # 数据配置
│   └── css/          # 全局样式
├── public/           # 静态资源
│   └── assets/       # 图标、壁纸等资源
└── portfolio/        # 作品集子项目
```


