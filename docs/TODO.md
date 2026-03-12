# 项目优化 TODO

> 此文件记录待处理的项目优化项，按优先级排列。

---

## P1 — 代码质量

- [ ] **拆分 `Home.tsx`（480+ 行巨型组件）**
  - 拆为 `HeroSection`、`RecentLogs`、`AboutSection`、`FavoritesSection`
  - 技能数据（skills 数组）抽取到 `constants.ts`
  - Favorites 图片解析逻辑抽取到 `lib/` 工具函数

- [ ] **提取跑马灯卡片组件**
  - Row1 / Row2 卡片结构几乎完全相同
  - 提取为 `MarqueePostCard` 组件

- [ ] **删除注释掉的 Dead Code**
  - `Home.tsx` 中多处大段注释代码
  - `Layout.tsx` 中被注释的底边缘细线

- [ ] **统一 SVG 背景纹理**
  - `Home.tsx`、`ArticleView.tsx`、`TopicDetail.tsx`、`TopicList.tsx` 中重复的 Base64 SVG
  - 定义为全局 Tailwind utility class（如 `bg-p3r-crosshatch`）

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

- [ ] **`react-syntax-highlighter` 按需加载语言**
  - 当前全量加载 Prism 语言定义
  - 改为仅注册 `tsx`、`js`、`css`、`bash` 等常用语言

- [ ] **文章正文按需加载（延后）**
  - 当前 `constants.ts` 同步加载全部 Markdown 内容
  - 文章少时影响不大，增长后需拆分

---

## 小改进

- [ ] `SkewButton` 增加 `-webkit-font-smoothing: antialiased`
- [x] ~~`Home.tsx` hash 滚动重试改用 `requestAnimationFrame`~~ — scroll handler 已优化
- [ ] `scrollToHeading` 800ms 硬编码改用 `scrollend` 事件
- [ ] Favorites 图片的 `alt` 属性优化为更有语义的描述

