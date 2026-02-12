import { BlogPost, PostFrontmatter } from '../types';

/**
 * 简易 frontmatter 解析器（仅支持单层 key: value，不支持嵌套/数组）
 * 用正则匹配 `---` 分隔的头部区域，逐行按首个冒号拆分键值对
 */
function parseFrontmatter(content: string): { data: PostFrontmatter; content: string } | null {
  const match = content.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const frontmatterText = match[1];
  const markdownContent = match[2].trim();

  const data: Partial<PostFrontmatter> = {};
  const lines = frontmatterText.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // 去除首尾引号
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }

    (data as any)[key] = value;
  }

  if (!data.title || !data.date || !data.category || !data.excerpt) {
    console.error('Missing required frontmatter fields', data);
    return null;
  }

  return { data: data as PostFrontmatter, content: markdownContent };
}

// 构建时一次性加载 content/posts/ 下所有 .md 文件（eager: 同步、?raw: 原始字符串）
const postModules = import.meta.glob('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

function loadBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const path in postModules) {
    const content = postModules[path] as string;
    const parsed = parseFrontmatter(content);

    if (!parsed) {
      console.error(`Failed to parse frontmatter for ${path}`);
      continue;
    }

    const { data, content: markdown } = parsed;

    // 从文件路径提取 id 作为 URL slug
    const id = path.replace('../content/posts/', '').replace('.md', '');

    posts.push({
      id,
      title: data.title,
      date: data.date,
      category: data.category,
      coverImage: data.coverImage,
      excerpt: data.excerpt,
      content: markdown,
    });
  }

  // 按日期降序（最新在前）
  posts.sort((a, b) => b.date.localeCompare(a.date));

  return posts;
}

export { loadBlogPosts };
