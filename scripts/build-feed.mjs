/**
 * build-feed.mjs — 构建时生成 RSS 2.0 Feed
 *
 * 在 `next build` 完成后运行（package.json postbuild 脚本），
 * 将 feed.xml 写入 out/ 目录。
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SITE_URL = 'https://hflin.xyz';
const SITE_TITLE = "HF's Blog";
const SITE_DESCRIPTION = '计算机科学技术分享与实践记录';
const OUTPUT_DIR = path.join(process.cwd(), 'out');

// 转义 XML 特殊字符
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// 收集所有文章
function collectPosts() {
  const posts = [];
  const contentDir = path.join(process.cwd(), 'content');

  // blog posts
  const postsDir = path.join(contentDir, 'posts');
  if (fs.existsSync(postsDir)) {
    for (const file of fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))) {
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');
      const { data } = matter(raw);
      if (!data.title || !data.date) continue;
      posts.push({
        title: String(data.title),
        date: String(data.date),
        excerpt: String(data.excerpt || ''),
        url: `${SITE_URL}/blog/${encodeURIComponent(file.replace('.md', ''))}`,
      });
    }
  }

  // topic posts
  const topicsDir = path.join(contentDir, 'topics');
  if (fs.existsSync(topicsDir)) {
    for (const dir of fs.readdirSync(topicsDir, { withFileTypes: true }).filter(d => d.isDirectory())) {
      const topicSlug = dir.name;
      const topicDir = path.join(topicsDir, topicSlug);
      for (const file of fs.readdirSync(topicDir).filter(f => f.endsWith('.md') && f !== 'index.md')) {
        const raw = fs.readFileSync(path.join(topicDir, file), 'utf-8');
        const { data } = matter(raw);
        if (!data.title || !data.date) continue;
        posts.push({
          title: String(data.title),
          date: String(data.date),
          excerpt: String(data.excerpt || ''),
          url: `${SITE_URL}/topics/${encodeURIComponent(topicSlug)}`,
        });
      }
    }
  }

  // 按日期降序排列
  posts.sort((a, b) => b.date.localeCompare(a.date));
  return posts;
}

function buildRssXml(posts) {
  const items = posts.map(p => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(p.url)}</link>
      <description>${escapeXml(p.excerpt)}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <guid>${escapeXml(p.url)}</guid>
    </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

// Main
const posts = collectPosts();
const xml = buildRssXml(posts);

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

fs.writeFileSync(path.join(OUTPUT_DIR, 'feed.xml'), xml, 'utf-8');
console.log(`✅ Generated feed.xml with ${posts.length} items`);
