# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在本仓库工作时提供指导。

## 开发命令

- `pnpm install` - 安装依赖
- `pnpm dev` - 启动开发服务器（端口 3000）
- `pnpm build` - 生产环境构建
- `pnpm preview` - 本地预览生产构建

## 架构总览

这是一个**女神异闻录3重置版（Persona 3 Reload）主题博客**，基于 React 19、Vite 和 TypeScript 构建。设计美学的核心特征：

- **斜切变形 UI 元素**：使用 `transform: skewX(-12deg)` - 尤其是导航按钮和日期指示器
- **高对比度配色**：深海军蓝 (#0055FF)、亮青色 (#00FFFF)、纯白、深色 (#0a0a1a)
- **拟真界面设计（Diegetic UI）** - 界面元素风格化为游戏系统菜单
- **基于 Hash 的路由**：使用 `react-router-dom` 的 HashRouter 以兼容静态部署（GitHub Pages）

## 关键架构决策

### 路由系统
使用 `HashRouter` 而非 `BrowserRouter`，以兼容 GitHub Pages。路由定义在 `App.tsx`，包含回退至 `/` 的处理。

### 样式方案
**无 CSS 文件或 Tailwind 配置文件** - Tailwind CSS 通过 CDN 在 `index.html` 中加载，所有自定义配置（颜色、字体、动画）直接嵌入 HTML 的 `<script>` 标签中。配色 tokens：
- `p3blue`: #0055FF
- `p3cyan`: #00FFFF
- `p3dark`: #0a0a1a
- `p3white`: #F0F0F0

字体使用 Google Fonts：**Anton**（展示用）和 **Roboto Condensed**（正文）。

### 内容管理
博客文章以 **Markdown 文件**形式存储在 `content/posts/` 目录，通过 Vite 的 `import.meta.glob` 动态加载到 `constants.ts` 中的 `BLOG_POSTS` 数组。每篇文章包含：
- `id`：URL slug（由文件名生成）
- `title`、`date`、`category`（'TECH' | 'LIFE' | 'MEMO'）
- `excerpt`：列表视图摘要
- `content`：Markdown 内容字符串，通过 `react-markdown` 渲染
- `coverImage`：可选封面图 URL

### 组件结构

**Layout** (`components/Layout.tsx`)：包裹所有路由，包含：
- 固定头部，带斜切日期指示器（左上角）
- 斜切导航按钮（右上角）
- 面包屑路径指示当前路由
- 浮动底部状态栏

**Pages** (`pages/`)：Home、BlogList、BlogPost、About - 通过 Layout 中的 `<Outlet />` 渲染

**UI 组件** (`components/ui/`)：
- `SkewButton`：带标志性 -12deg 斜切变换的导航链接
- `BackgroundEffect`：固定背景，包含月亮图案和反射线
- `MarkdownRenderer`：自定义样式的 `react-markdown`，带 P3R 主题组件
- `HamburgerMenu`：移动端响应式菜单

### 模块解析
使用 **ESM imports via importmap**（在 `index.html` 中），指向 `esm.sh` CDN，而非 npm 安装的模块。`@/*` 路径别名解析至项目根目录。

### 项目结构特点
- **源代码位于项目根目录**（非 `src/` 目录）
- 主入口：`index.tsx`
- 类型定义：`types.ts`
- 博客加载逻辑：`lib/blog-loader.ts`

## 修改代码库时

### 添加博客文章
在 `content/posts/` 目录创建新的 Markdown 文件。每篇文章需要 YAML frontmatter：

```markdown
---
title: "文章标题"
date: "2024.12.29"
category: "TECH"
coverImage: "https://..."  # 可选
excerpt: "用于列表视图的简短摘要"
---

# 文章标题

Markdown 格式的文章内容...
```

文件名将成为 URL slug（例如 `my-post.md` → `/#/blog/my-post`）。

### 其他修改
- **样式修改**：在 `index.html` 中修改 Tailwind 配置，或使用现有配色 tokens（p3blue、p3cyan、p3dark、p3white）
- **斜切变换**：标志性的 -12deg 斜切应用于容器；文本使用 `skew-x-12` 反向斜切以保持可读性
- **Markdown 渲染**：在 `MarkdownRenderer.tsx` 中自定义组件以匹配拟真 UI 美学

### 部署
项目配置为通过 GitHub Actions 自动部署至 GitHub Pages。推送至 `main` 分支即可触发自动部署。
