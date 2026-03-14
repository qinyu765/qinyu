# CLAUDE.md

本文件为 Claude Code 提供项目上下文。完整的项目架构文档请参阅 `AGENTS.md`。

## 快速参考

- **技术栈：** Next.js 15 (App Router, SSG) + React 19 + TypeScript + Tailwind CSS 4
- **包管理器：** pnpm（`preinstall` hook 强制）
- **开发服务器：** `pnpm dev` → `http://localhost:3000/`（用户终端已持续运行，**不要**自行启动新的 dev server）
- **构建：** `pnpm build` → `out/`（SSG 静态导出）
- **未配置**测试框架或 linter

## 关键约定

- 源码位于 `src/` 目录，路径别名 `@/` → `src/`
- 使用 Next.js App Router（文件系统路由），SSG 静态导出
- 博客文章存放于 `content/posts/`，文件名即 URL slug
- 系列专题存放于 `content/topics/{topicSlug}/`
- 配色系统：`p3blue` / `p3cyan` / `p3dark` / `p3mid` / `p3white` / `p3red` / `p3black`
- 标志性视觉：容器 `-skew-x-12` + 文字 `skew-x-12` 反向抵消
- 新代码注释使用中文

## 详细文档

所有架构细节（路由、组件、样式体系、内容系统、类型定义等）请查看 [`AGENTS.md`](./AGENTS.md)。
