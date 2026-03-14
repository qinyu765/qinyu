'use client';

import React from 'react';
import { ArticleView } from '@/components/ArticleView';
import { BlogPost } from '@/types';

interface Props {
  post: BlogPost;
  prevPost?: { id: string; title: string; linkTo: string };
  nextPost?: { id: string; title: string; linkTo: string };
}

export const BlogPostClient: React.FC<Props> = ({ post, prevPost, nextPost }) => {
  return (
    <ArticleView
      post={post}
      backLink={{ to: '/blog', label: 'Return to Base' }}
      prevPost={prevPost}
      nextPost={nextPost}
    />
  );
};
