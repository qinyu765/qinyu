'use client';

import React from 'react';
import { ArticleView } from '@/components/ArticleView';
import { BlogPost } from '@/types';

interface Props {
  post: BlogPost;
  topicTitle: string;
  topicSlug: string;
  prevPost?: { id: string; title: string; linkTo: string };
  nextPost?: { id: string; title: string; linkTo: string };
}

export const TopicPostClient: React.FC<Props> = ({ post, topicTitle, topicSlug, prevPost, nextPost }) => {
  return (
    <ArticleView
      post={post}
      backLink={{ to: `/topics/${topicSlug}`, label: topicTitle }}
      prevPost={prevPost}
      nextPost={nextPost}
    />
  );
};
