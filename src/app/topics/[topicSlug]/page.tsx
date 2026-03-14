import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadTopics } from '@/lib/blog-loader';
import { TopicDetailClient } from './TopicDetailClient';

interface Props {
  params: Promise<{ topicSlug: string }>;
}

export async function generateStaticParams() {
  const topics = loadTopics();
  return topics.map((t) => ({ topicSlug: t.meta.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topicSlug } = await params;
  const topics = loadTopics();
  const topic = topics.find((t) => t.meta.slug === topicSlug);

  if (!topic) return { title: 'Topic Not Found' };

  return {
    title: topic.meta.title,
    description: topic.meta.description,
  };
}

export default async function TopicDetailPage({ params }: Props) {
  const { topicSlug } = await params;
  const topics = loadTopics();
  const topic = topics.find((t) => t.meta.slug === topicSlug);

  if (!topic) notFound();

  return <TopicDetailClient topic={topic} />;
}
