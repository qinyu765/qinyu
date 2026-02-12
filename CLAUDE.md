# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 开发命令

- `pnpm install` — 安装依赖（preinstall hook 强制使用 pnpm）
- `pnpm dev` — 启动开发服务器（端口 3000）
- `pnpm build` — 生产构建（Vite → `dist/`）
- `pnpm preview` — 本地预览生产构建

未配置测试框架或 linter。

## 架构

Persona 3 Reload 主题博客，基于 React 19 + Vite + TypeScript。源码直接位于项目根目录（无 `src/`）。

**入口链路：** `index.html` → `index.tsx` → `App.tsx`（HashRouter）→ `Layout.tsx`（共享外壳）→ 各页面组件通过 `<Outlet />` 渲染

**路由**（定义在 `App.tsx`）：
- `/` → Home、`/blog` → BlogList、`/blog/:id` → BlogPost、`/about` → About
- `*` → 重定向至 `/`

使用 `HashRouter`（非 `BrowserRouter`）以兼容 GitHub Pages 静态部署。

### 模块解析

运行时依赖通过 `index.html` 中的 **ESM importmap** 从 `esm.sh` CDN 加载，不走 `node_modules`。`@/*` 路径别名指向项目根目录（`vite.config.ts` 和 `tsconfig.json` 中均有配置）。

### 样式体系

**无独立 CSS 文件，无 Tailwind 配置文件。** Tailwind CSS 通过 CDN 在 `index.html` 中加载，所有自定义主题配置（颜色、字体、动画）内联在 `<script>` 块中。

配色 tokens：
- `p3blue`: #1269CC（主色）
- `p3cyan`: #51EEFC（强调色）
- `p3dark`: #0D1B2A（背景色）
- `p3mid`: #6D9AC7（弱化文字）
- `p3white`: #F0F0F0（正文色）

字体：**Anton** + Noto Sans SC（展示用）、**Roboto Condensed** + Noto Sans SC（正文）。

标志性视觉模式：容器施加 `-skew-x-12`，内部文字用 `skew-x-12` 反向抵消以保持可读性。

### 博客内容系统

文章以 Markdown 文件存放于 `content/posts/`，构建时由 `lib/blog-loader.ts` 通过 `import.meta.glob` 加载。文件名即 URL slug（`my-post.md` → `/#/blog/my-post`）。

必需的 frontmatter（简易正则解析器，非完整 YAML —— 不支持嵌套值或数组）：
```yaml
---
title: "文章标题"
date: "2024.12.29"
category: "TECH"       # TECH | LIFE | MEMO
excerpt: "摘要文字"
coverImage: "https://..."  # 可选
---
```

文章按日期降序排列。`BLOG_POSTS` 数组从 `constants.ts` 导出，导航项 `NAV_ITEMS` 同理。

### 组件结构

- **Layout**（`components/Layout.tsx`）：固定顶栏（logo + 导航）、滚动隐藏行为、面包屑、底部状态条
- **Pages**（`pages/`）：Home、BlogList、BlogPost、About
- **UI**（`components/ui/`）：SkewButton（斜切导航按钮）、BackgroundEffect（固定背景：月亮 + 水波纹）、HamburgerMenu（移动端导航）、Logo、MarkdownRenderer（P3R 主题的 react-markdown）

### 部署

推送至 `main` 分支后，GitHub Actions 自动部署至 GitHub Pages（`.github/workflows/deploy.yml`）。
