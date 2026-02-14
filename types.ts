import React from 'react';

// Frontmatter metadata for Markdown blog posts
export interface PostFrontmatter {
  title: string;
  date: string;
  category: 'TECH' | 'LIFE' | 'MEMO';
  coverImage?: string;
  excerpt: string;
  tags?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: 'TECH' | 'LIFE' | 'MEMO';
  excerpt: string;
  content: string;
  coverImage?: string;
  tags?: string[];
}

export interface TopicMeta {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  coverImage?: string;
}

export interface TopicPost extends BlogPost {
  slug: string;
  topicSlug: string;
  order?: number;
}

export interface Topic {
  meta: TopicMeta;
  posts: TopicPost[];
  introContent?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}