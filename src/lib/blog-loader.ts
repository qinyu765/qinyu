import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, Topic, TopicMeta, TopicPost } from '@/types';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
const TOPICS_DIR = path.join(CONTENT_DIR, 'topics');

const VALID_CATEGORIES = new Set(['TECH', 'LIFE', 'MEMO']);

function toCategory(v: string): BlogPost['category'] | '' {
  return VALID_CATEGORIES.has(v) ? (v as BlogPost['category']) : '';
}

// --- Blog Posts ---

export function loadBlogPosts(): BlogPost[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const posts: BlogPost[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { data, content } = matter(raw);

    const title = String(data.title ?? '');
    const date = String(data.date ?? '');
    const cat = toCategory(String(data.category ?? ''));
    const excerpt = String(data.excerpt ?? '');

    if (!title || !date || !cat || !excerpt) {
      console.error('Missing required frontmatter fields:', file, data);
      continue;
    }

    posts.push({
      id: file.replace('.md', ''),
      title,
      date,
      category: cat,
      excerpt,
      content,
      coverImage: data.coverImage || undefined,
      tags: Array.isArray(data.tags) ? data.tags : undefined,
    });
  }

  posts.sort((a, b) => b.date.localeCompare(a.date));
  return posts;
}

// --- Topics ---

export function loadTopics(): Topic[] {
  if (!fs.existsSync(TOPICS_DIR)) return [];

  const topicDirs = fs.readdirSync(TOPICS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const topics: Topic[] = [];

  for (const slug of topicDirs) {
    const indexPath = path.join(TOPICS_DIR, slug, 'index.md');
    if (!fs.existsSync(indexPath)) {
      console.error(`Topic directory "${slug}" has no index.md`);
      continue;
    }

    // Parse topic index
    const indexRaw = fs.readFileSync(indexPath, 'utf-8');
    const { data: indexData, content: introContent } = matter(indexRaw);

    const title = String(indexData.title ?? '');
    const description = String(indexData.description ?? '');
    if (!title || !description) {
      console.error('Topic index missing title/description:', slug);
      continue;
    }

    const meta: TopicMeta = {
      slug,
      title,
      description,
      tags: Array.isArray(indexData.tags) ? indexData.tags : undefined,
      coverImage: indexData.coverImage || undefined,
    };

    // Parse topic posts
    const postFiles = fs.readdirSync(path.join(TOPICS_DIR, slug))
      .filter(f => f.endsWith('.md') && f !== 'index.md');

    const posts: TopicPost[] = [];

    for (const file of postFiles) {
      const raw = fs.readFileSync(path.join(TOPICS_DIR, slug, file), 'utf-8');
      const { data, content } = matter(raw);

      const postTitle = String(data.title ?? '');
      const date = String(data.date ?? '');
      const cat = toCategory(String(data.category ?? ''));
      const excerpt = String(data.excerpt ?? '');

      if (!postTitle || !date || !cat || !excerpt) {
        console.error('Topic post missing required fields:', file);
        continue;
      }

      const orderVal = data.order;
      const order = orderVal != null ? Number(orderVal) : undefined;
      if (order !== undefined && !Number.isFinite(order)) {
        console.error('Invalid order value:', file, orderVal);
        continue;
      }

      const fileSlug = file.replace('.md', '');
      posts.push({
        id: `${slug}/${fileSlug}`,
        slug: fileSlug,
        topicSlug: slug,
        title: postTitle,
        date,
        category: cat,
        excerpt,
        content,
        coverImage: data.coverImage || undefined,
        tags: Array.isArray(data.tags) ? data.tags : undefined,
        order,
      });
    }

    // Sort: by order if present, else by date descending
    posts.sort((a, b) => {
      if (a.order != null && b.order != null) return a.order - b.order;
      if (a.order != null) return -1;
      if (b.order != null) return 1;
      return b.date.localeCompare(a.date);
    });

    topics.push({ meta, posts, introContent: introContent || undefined });
  }

  // Sort topics by latest post date
  topics.sort((a, b) => {
    const latest = (posts: TopicPost[]) =>
      posts.reduce((max, p) => (p.date > max ? p.date : max), '');
    return latest(b.posts).localeCompare(latest(a.posts));
  });

  return topics;
}
