# 对话分析：博客优化建议

## 对话核心内容

你向对方（hflin.xyz / [cellstack](https://github.com/minorcell/cellstack)）询问博客加速方案。对方的回复要点如下：

### 对方观点摘要

| # | 要点 | 说明 |
|---|------|------|
| 1 | **网络层** | 部署在国外 + Cloudflare 加速，但根本瓶颈不在这里 |
| 2 | **SSG vs SPA** | 对方使用 Next.js 的 SSG（Static Site Generation），构建时就把所有页面生成为纯 HTML；你的博客是 SPA，首次加载需要下载 JS → 执行 → 渲染，速度天然慢一拍 |
| 3 | **程序性能** | 加载策略（懒加载/分包）和运行时性能（耗时操作）都会影响体验 |
| 4 | **SEO 问题** | SPA 对爬虫不友好，搜索引擎难以索引内容。对方**强烈推荐**博客类站点用 Next.js 而非 SPA |
| 5 | **你的速度其实还行** | 对方说用梯子访问你的站秒开，没什么大问题 |

---

## 技术栈对比

| 对比项 | 你的博客 (p3r-inspired-blog) | 对方博客 (cellstack) |
|--------|---------------------------|---------------------|
| **框架** | Next.js 15 (App Router, SSG) | Next.js 16 (SSG, `output: 'export'`) |
| **渲染模式** | SSG（静态站点生成） | SSG（静态站点生成） |
| **搜索** | Fuse.js（内存模糊搜索） | Pagefind（构建时全文索引） |
| **SEO** | Next.js `metadata` API + `generateMetadata` | `seo.ts` + `structured-data.ts`（JSON-LD） + `robots.ts` + `sitemap.ts` |
| **RSS** | 无 | `build-feed.mjs`（RSS/Atom/JSON Feed） |
| **动画** | CSS + 原生 JS | GSAP + Framer Motion + Three.js |
| **代码格式化** | 无 | Prettier + ESLint |
| **样式** | Tailwind CSS 4 | Tailwind CSS 4 + shadcn/ui |
| **Markdown** | react-markdown | streamdown（流式渲染） |

---

## 你的博客需要做什么

按对话中提到的问题，对照你已有的 `TODO.md`，梳理出**核心待办**：

### 🔴 P0 — 架构层（对话核心建议）

> [!IMPORTANT]
> 对方最核心的建议是：**博客类站点应该用 SSG，不要用纯 SPA。**

- [x] **已迁移到 Next.js 15 (App Router, SSG)** ✅
  - 优势：SEO 友好、首屏秒开（纯 HTML）、搜索引擎可索引
  - 迁移已完成，无需再考虑架构切换

### 🟡 P1 — SEO 补全（对话明确提到）

对方指出 SPA 对爬虫/搜索引擎不友好，即使你已经做了 `useSEO` hook，纯 CSR 的 HTML 里还是空壳。

- [ ] **添加 JSON-LD 结构化数据**（参考 cellstack 的 `structured-data.ts`）
  - WebSite、Person、BreadcrumbList、ArticleJsonLd
- [ ] **生成 RSS/Atom Feed**（参考 cellstack 的 `build-feed.mjs`）
  - 便于搜索引擎发现内容、用户订阅

> 你的 `TODO.md` 中已有相关条目（P2 工程化 → "扩展 sitemap / feed 生成"），但建议**提升优先级**。

### 🟢 P2 — 性能优化（对话提到的加载策略）

你的 `TODO.md` 中已经列出了大部分条目，重点关注这几项：

| TODO 条目 | 与对话的关联 |
|-----------|-------------|
| 页面路由级代码分割（`React.lazy`） | 对方说"加载策略"直接影响性能 |
| `react-syntax-highlighter` 按需加载 | 减小首屏 JS 体积 |
| Giscus 评论按需加载 | 减少第三方脚本开销 |
| 文章正文按需加载 | 对方说"耗时操作"会拖慢体验 |

### 📋 P3 — 工程化（对方已有、你缺失的）

- [ ] **添加 Prettier 格式化**（对方有 `.prettierrc`，你还没有）
- [ ] **Pagefind 全文搜索**（可选，对方用了，体验比 Fuse.js 好很多）

---

## 总结

对话的结论可以浓缩为一句话：

> **你的站速度其实没什么问题，但 SPA 架构在 SEO 上天然吃亏。长远来看应该考虑 SSG 迁移，短期内先补齐 RSS Feed、结构化数据、代码分割这些低成本优化。**
