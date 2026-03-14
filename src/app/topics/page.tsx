import type { Metadata } from 'next';
import { loadTopics } from '@/lib/blog-loader';
import { TopicListClient } from './TopicListClient';

export const metadata: Metadata = {
  title: 'Topics',
  description: '专题系列 — 系统化学习前端技术',
};

export default function TopicsPage() {
  const topics = loadTopics();
  return <TopicListClient topics={topics} />;
}
