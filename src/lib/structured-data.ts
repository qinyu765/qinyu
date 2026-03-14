import { BlogPost } from '@/types';

const SITE_URL = 'https://hflin.xyz';
const SITE_NAME = "HF's Blog";

// 站点级 JSON-LD（WebSite）
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: '计算机科学技术分享与实践记录',
    inLanguage: 'zh-CN',
  };
}

// 站长信息（Person）
export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'HF',
    url: SITE_URL,
  };
}

// 文章页 JSON-LD（Article）
export function articleJsonLd(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: `${SITE_URL}/blog/${encodeURIComponent(post.id)}`,
    author: {
      '@type': 'Person',
      name: 'HF',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'HF',
      url: SITE_URL,
    },
    ...(post.coverImage ? { image: post.coverImage } : {}),
    ...(post.tags ? { keywords: post.tags.join(', ') } : {}),
  };
}

// 面包屑 JSON-LD（BreadcrumbList）
export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
