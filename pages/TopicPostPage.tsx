import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { TOPICS } from '../constants';
import { ArticleView } from '../components/ArticleView';

export const TopicPostPage: React.FC = () => {
  const { topicSlug, postSlug } = useParams<{ topicSlug: string; postSlug: string }>();

  const topic = TOPICS.find((t) => t.meta.slug === topicSlug);
  if (!topic) return <Navigate to="/topics" replace />;

  const postIndex = topic.posts.findIndex((p) => p.slug === postSlug);
  const post = postIndex !== -1 ? topic.posts[postIndex] : undefined;
  if (!post) return <Navigate to={`/topics/${topicSlug}`} replace />;

  const prev = postIndex > 0 ? topic.posts[postIndex - 1] : undefined;
  const next = postIndex < topic.posts.length - 1 ? topic.posts[postIndex + 1] : undefined;

  return (
    <ArticleView
      post={post}
      backLink={{ to: `/topics/${topicSlug}`, label: topic.meta.title }}
      prevPost={prev ? { id: prev.slug, title: prev.title, linkTo: `/topics/${topicSlug}/${prev.slug}` } : undefined}
      nextPost={next ? { id: next.slug, title: next.title, linkTo: `/topics/${topicSlug}/${next.slug}` } : undefined}
    />
  );
};
