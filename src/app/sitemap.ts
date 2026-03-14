export const dynamic = 'force-static';

import type { MetadataRoute } from 'next';
import { loadBlogPosts, loadTopics } from '@/lib/blog-loader';

const SITE_URL = 'https://hflin.xyz';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = loadBlogPosts();
  const topics = loadTopics();

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/topics`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 博客文章页
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${encodeURIComponent(post.id)}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // 专题页（每个专题的入口）
  const topicPages: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${SITE_URL}/topics/${encodeURIComponent(topic.meta.slug)}`,
    lastModified: topic.posts.length > 0
      ? new Date(topic.posts[0].date)
      : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...topicPages];
}
