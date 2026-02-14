import { BlogPost, Topic, TopicMeta, TopicPost } from '../types';

type FrontmatterValue = string | string[];
type RawFrontmatter = Record<string, FrontmatterValue>;

function parseFrontmatter(raw: string): { data: RawFrontmatter; content: string } | null {
  const match = raw.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;

  const data: RawFrontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();

    // 数组语法: [a, b, c]
    if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val.slice(1, -1).split(',').map(s =>
        s.trim().replace(/^["']|["']$/g, '')
      ).filter(Boolean);
      continue;
    }

    // 去除首尾引号
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    data[key] = val;
  }

  return { data, content: match[2].trim() };
}

function str(v: FrontmatterValue | undefined): string {
  return typeof v === 'string' ? v : '';
}
function arr(v: FrontmatterValue | undefined): string[] | undefined {
  return Array.isArray(v) ? v : undefined;
}

const VALID_CATEGORIES = new Set(['TECH', 'LIFE', 'MEMO']);
function category(v: FrontmatterValue | undefined): BlogPost['category'] | '' {
  const s = str(v);
  return VALID_CATEGORIES.has(s) ? (s as BlogPost['category']) : '';
}

// --- Blog Posts ---

const postModules = import.meta.glob('../content/posts/*.md', {
  eager: true, query: '?raw', import: 'default',
});

function loadBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const path in postModules) {
    const parsed = parseFrontmatter(postModules[path] as string);
    if (!parsed) { console.error(`Failed to parse frontmatter: ${path}`); continue; }

    const { data, content } = parsed;
    const title = str(data.title), date = str(data.date),
          cat = category(data.category),
          excerpt = str(data.excerpt);

    if (!title || !date || !cat || !excerpt) {
      console.error('Missing required frontmatter fields', path, data);
      continue;
    }

    posts.push({
      id: path.replace('../content/posts/', '').replace('.md', ''),
      title, date, category: cat, excerpt, content,
      coverImage: str(data.coverImage) || undefined,
      tags: arr(data.tags),
    });
  }

  posts.sort((a, b) => b.date.localeCompare(a.date));
  return posts;
}

// --- Topics ---

const topicIndexModules = import.meta.glob('../content/topics/*/index.md', {
  eager: true, query: '?raw', import: 'default',
});
const topicPostModules = import.meta.glob(
  ['../content/topics/*/*.md', '!../content/topics/*/index.md'],
  { eager: true, query: '?raw', import: 'default' },
);

function loadTopics(): Topic[] {
  // 1. 解析各 topic 的 index.md → TopicMeta + introContent
  const topicMap = new Map<string, { meta: TopicMeta; introContent?: string }>();

  for (const path in topicIndexModules) {
    const slug = path.match(/\/topics\/([^/]+)\/index\.md$/)?.[1];
    if (!slug) continue;

    const parsed = parseFrontmatter(topicIndexModules[path] as string);
    if (!parsed) { console.error(`Failed to parse topic index: ${path}`); continue; }

    const { data, content } = parsed;
    const title = str(data.title), description = str(data.description);
    if (!title || !description) {
      console.error('Topic index missing title/description', path);
      continue;
    }

    topicMap.set(slug, {
      meta: {
        slug, title, description,
        tags: arr(data.tags),
        coverImage: str(data.coverImage) || undefined,
      },
      introContent: content || undefined,
    });
  }

  // 2. 解析子文章 → TopicPost，按 topicSlug 分组
  const postsMap = new Map<string, TopicPost[]>();

  for (const path in topicPostModules) {
    const m = path.match(/\/topics\/([^/]+)\/([^/]+)\.md$/);
    if (!m) continue;
    const [, topicSlug, fileSlug] = m;

    const parsed = parseFrontmatter(topicPostModules[path] as string);
    if (!parsed) { console.error(`Failed to parse topic post: ${path}`); continue; }

    const { data, content } = parsed;
    const title = str(data.title), date = str(data.date),
          cat = category(data.category),
          excerpt = str(data.excerpt);

    if (!title || !date || !cat || !excerpt) {
      console.error('Topic post missing required fields', path);
      continue;
    }

    const orderVal = str(data.order);
    const order = orderVal ? Number(orderVal) : undefined;
    if (order !== undefined && !Number.isFinite(order)) {
      console.error('Invalid order value', path, orderVal);
      continue;
    }
    const list = postsMap.get(topicSlug) ?? [];
    list.push({
      id: `${topicSlug}/${fileSlug}`,
      slug: fileSlug,
      topicSlug,
      title, date, category: cat, excerpt, content,
      coverImage: str(data.coverImage) || undefined,
      tags: arr(data.tags),
      order,
    });
    postsMap.set(topicSlug, list);
  }

  for (const slug of postsMap.keys()) {
    if (!topicMap.has(slug)) console.error(`Topic posts found without index.md: ${slug}`);
  }

  // 3. 组装 Topic[]
  const topics: Topic[] = [];
  for (const [slug, { meta, introContent }] of topicMap) {
    const posts = postsMap.get(slug) ?? [];

    // 有 order 按 order 升序，否则按 date 降序
    posts.sort((a, b) => {
      if (a.order != null && b.order != null) return a.order - b.order;
      if (a.order != null) return -1;
      if (b.order != null) return 1;
      return b.date.localeCompare(a.date);
    });

    topics.push({ meta, posts, introContent });
  }

  // Topics 按最新子文章日期降序
  topics.sort((a, b) => {
    const latest = (posts: TopicPost[]) =>
      posts.reduce((max, p) => (p.date > max ? p.date : max), '');
    return latest(b.posts).localeCompare(latest(a.posts));
  });

  return topics;
}

export { loadBlogPosts, loadTopics };
