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

- [ ] **删除注释掉的 Dead Code**
  - `Home.tsx` 中多处大段注释代码
  - `Layout.tsx` 中被注释的底边缘细线

- [x] **统一 SVG 背景纹理**
  - `Home.tsx`、`ArticleView.tsx`、`TopicDetail.tsx`、`TopicList.tsx` 中重复的 Base64 SVG
  - 定义为全局 Tailwind utility class（如 `bg-p3r-crosshatch`）

- [x] **完善 Markdown 渲染类型与复用**
  - `MarkdownRenderer.tsx` 的 `code` 渲染使用 `any`，补齐 `react-markdown` components 的类型约束
  - 抽出重复的排版样式（标题/列表/引用块等）为小组件或常量，降低维护成本

- [ ] **Frontmatter 校验与日期规范化**
  - `lib/blog-loader.ts`：对必填字段做 schema 校验（可用 zod），并支持 `draft: true`（构建时过滤）
  - 将 `date` 解析为标准格式（ISO / Date），避免仅靠字符串排序导致的隐性问题

- [x] **同步项目文档与实际实现**
  - `AGENTS.md` 中路由/Router 描述与 `App.tsx` 的 `BrowserRouter` 保持一致

---

## P2 — 工程化

- [ ] **添加 ESLint + Prettier**
  - 推荐 `@eslint/js` + `typescript-eslint`
  - 可选 Husky + lint-staged pre-commit

- [ ] **统一换行符为 LF**
  - 部分文件 CRLF（`tailwind.config.js`、`index.css`）
  - 添加 `.editorconfig`

- [x] **改善 SEO 标签** ✅
  - ~~已实现 `useSEO` hook 动态设置每页 title / description~~
  - ~~已切换 `BrowserRouter`、添加 `robots.txt` / `sitemap.xml`~~

- [ ] **检查 `tsconfig.json` 严格模式**
  - 确保 `strict: true`、`noUncheckedIndexedAccess`

- [ ] **补充 `typecheck` 脚本并接入 CI**
  - `package.json` 添加 `typecheck: tsc --noEmit`
  - GitHub Actions 对 PR / main 做 `pnpm typecheck` + `pnpm build`

- [ ] **扩展 sitemap / feed 生成**
  - `scripts/generate-sitemap.mjs` 增加 Topics 路由（`/topics`、`/topics/:topicSlug`、`/topics/:topicSlug/:postSlug`）
  - 增加 RSS/Atom（或 `feed.json`）输出，方便订阅与聚合

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

- [ ] **页面路由级代码分割**
  - `App.tsx` 对 `pages/*` 做 `React.lazy` + `Suspense`，减小首屏 JS 体积

- [ ] **Giscus 评论按需加载**
  - 默认折叠（按钮触发）或滚动到可视区再加载，减少第三方脚本开销

- [ ] **TOC active heading 用 IntersectionObserver**
  - `ArticleView.tsx`：用 IO 追踪 headings，替代 scroll 中每帧 `getBoundingClientRect` 扫描

- [ ] **`react-syntax-highlighter` 按需加载语言**
  - 当前全量加载 Prism 语言定义
  - 改为仅注册 `tsx`、`js`、`css`、`bash` 等常用语言

- [ ] **文章正文按需加载（延后）**
  - 当前 `constants.ts` 同步加载全部 Markdown 内容
  - 文章少时影响不大，增长后需拆分

- [ ] **动效支持 `prefers-reduced-motion`**
  - 对跑马灯/背景等高频动画提供降级，兼顾可访问性与低端设备

---

## 小改进

- [ ] `SkewButton` 增加 `-webkit-font-smoothing: antialiased`
- [x] ~~`Home.tsx` hash 滚动重试改用 `requestAnimationFrame`~~ — scroll handler 已优化
- [ ] `scrollToHeading` 800ms 硬编码改用 `scrollend` 事件
- [ ] Favorites 图片的 `alt` 属性优化为更有语义的描述
- [ ] 分享复制兜底：`navigator.clipboard` 不可用时给出更友好提示/降级方案
