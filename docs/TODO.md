# 项目优化 TODO

> 此文件记录待处理的项目优化项，按优先级排列。

---

## P1 — 代码质量

- [x] **拆分 `Home.tsx`（480+ 行巨型组件）**
  - 拆为 `HeroSection`、`RecentLogs`、`AboutSection`、`FavoritesSection`
  - 技能数据（skills 数组）抽取到 `constants.ts`
  - Favorites 图片解析逻辑抽取到 `lib/` 工具函数

- [x] **提取跑马灯卡片组件**
  - Row1 / Row2 卡片结构几乎完全相同
  - 提取为 `MarqueePostCard` 组件

- [x] **删除注释掉的 Dead Code** ✅
  - 原 `Home.tsx` 已完全重构拆分为 `HomeClient.tsx` + `components/home/`，旧注释代码已清除
  - `LayoutShell.tsx`（原 `Layout.tsx`）中无注释代码残留

- [x] **统一 SVG 背景纹理**
  - `HeroSection.tsx`、`ArticleView.tsx`、`TopicDetailClient.tsx`、`TopicListClient.tsx` 中重复的 Base64 SVG
  - 定义为全局 Tailwind utility class（如 `bg-p3r-crosshatch`）

- [x] **完善 Markdown 渲染类型与复用**
  - `MarkdownRenderer.tsx` 的 `code` 渲染使用 `any`，补齐 `react-markdown` components 的类型约束
  - 抽出重复的排版样式（标题/列表/引用块等）为小组件或常量，降低维护成本

- [x] **Frontmatter 解析升级**
  - 已从简易正则解析器迁移至 `gray-matter`，支持完整 YAML frontmatter
  - 待办：schema 校验（zod）和 `draft: true` 过滤

- [x] **同步项目文档与实际实现** — 已在 Next.js 迁移后更新 `AGENTS.md`

---

## P1.5 — SEO 补全（🔴 高优先）

> 参考 [cellstack-analysis.md](./cellstack-analysis.md) §4.1 和 [Conversation Analysis.md](./Conversation%20Analysis.md) §P1

- [ ] **JSON-LD 结构化数据**
  - 添加 `src/lib/structured-data.ts`，输出 WebSite / Person / BreadcrumbList / ArticleJsonLd
  - 参考 CellStack `structured-data.ts` 实现

- [ ] **`app/robots.ts` — 动态生成 robots.txt**
  - 使用 Next.js App Router 的 `MetadataRoute.Robots` API

- [ ] **`app/sitemap.ts` — 动态生成 sitemap.xml**
  - 遍历所有 posts + topics 路由，替代旧的 `scripts/generate-sitemap.mjs`

- [ ] **RSS / Atom Feed 生成**
  - 构建时生成 `feed.xml`（RSS 2.0）和/或 `feed.json`（JSON Feed）
  - 参考 CellStack `scripts/build-feed.mjs`

---

## P2 — 工程化

- [ ] **添加 ESLint + Prettier**
  - 推荐 `@eslint/js` + `typescript-eslint`
  - 可选 Husky + lint-staged pre-commit

- [ ] **统一换行符为 LF**
  - 部分文件 CRLF（`LayoutShell.tsx` 等）
  - 添加 `.editorconfig`

- [x] **改善 SEO 标签** — 已迁移至 Next.js `metadata` API（每页静态 + 动态 generateMetadata）

- [ ] **检查 `tsconfig.json` 严格模式**
  - 确保 `strict: true`、`noUncheckedIndexedAccess`

- [ ] **补充 `typecheck` 脚本并接入 CI**
  - `package.json` 添加 `typecheck: tsc --noEmit`
  - GitHub Actions 对 PR / main 做 `pnpm typecheck` + `pnpm build`

- [x] ~~扩展 sitemap / feed 生成~~ — 已拆分至 P1.5 SEO 补全章节

- [ ] **增加 bundle 体积可视化（可选）**
  - 使用 `rollup-plugin-visualizer` 输出 report，定位并持续跟踪大依赖体积

---

## P3 — 性能优化

- [x] **优化 `BackgroundEffect` 噪声动画** ✅
  - ~~噪声动画从 0.3s steps(3) 降频至 4s steps(4)~~
  - ~~去除 noise / moon 层多余的 `will-change: transform`~~

- [x] **scroll handler 节流** ✅
  - ~~`ArticleView.tsx` 的 heading 追踪添加 `requestAnimationFrame` 节流~~

- [x] **顶栏 `backdrop-blur` 降级** ✅
  - ~~`backdrop-blur-xl` → `backdrop-blur-md`，配合背景色不透明度补偿~~

- [x] **跑马灯 GPU 合成提示** ✅
  - ~~两行跑马灯添加 `will-change-transform`~~

- [x] **页面路由级代码分割** — Next.js App Router 自动代码分割

- [ ] **Giscus 评论按需加载**
  - 默认折叠（按钮触发）或滚动到可视区再加载，减少第三方脚本开销

- [ ] **TOC active heading 用 IntersectionObserver**
  - `ArticleView.tsx`：当前仍用 scroll + rAF + `getBoundingClientRect`（第 37-59 行），待改为 IntersectionObserver

- [ ] **`react-syntax-highlighter` 按需加载语言**
  - 当前全量加载 Prism 语言定义
  - 改为仅注册 `tsx`、`js`、`css`、`bash` 等常用语言

- [x] **文章正文按需加载** — Next.js SSG 每页独立构建，无需手动分割

- [ ] **动效支持 `prefers-reduced-motion`**
  - 对跑马灯/背景等高频动画提供降级，兼顾可访问性与低端设备

---

## P4 — 远期改进（借鉴 CellStack）

> 参考 [cellstack-analysis.md](./cellstack-analysis.md) §4.2–4.4 和 §六 路线图

- [ ] **Pagefind 全文搜索（替代 Fuse.js）**
  - 构建后对 `out/` 建倒排索引，运行时纯前端查询
  - 仅需 `postbuild: pagefind --site out`

- [ ] **封面图自动提取**
  - 当 frontmatter 未指定 `coverImage` 时，从正文首个 `![](url)` 自动提取
  - 减少写作时手动填写封面的负担

- [ ] **GitHub 热力图（About 页）**
  - 使用 `react-activity-calendar` 展示 GitHub 提交活跃度
  - 注意 API 稳定性和跨域

- [ ] **动画库升级（GSAP / Framer Motion）**
  - 将部分 CSS 动画升级为更精细的库驱动动画，提升视觉表现力

---

## 小改进

- [ ] `SkewButton` 增加 `-webkit-font-smoothing: antialiased`
- [x] ~~hash 锚点滚动已重构~~ — `HomeClient.tsx` 使用 `setTimeout` 递归重试，scroll handler 节流已使用 rAF
- [ ] `ArticleView.tsx:70` 中 `scrollToHeading` 800ms 硬编码改用 `scrollend` 事件
- [ ] Favorites 图片的 `alt` 属性优化为更有语义的描述
- [ ] 分享复制兜底：`navigator.clipboard` 不可用时给出更友好提示/降级方案
