import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadBlogPosts } from '@/lib/blog-loader';
import { BlogPostClient } from './BlogPostClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const posts = loadBlogPosts();
  return posts.map((post) => ({ id: post.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const posts = loadBlogPosts();
  const post = posts.find((p) => p.id === id);

  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `/blog/${post.id}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const posts = loadBlogPosts();
  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) notFound();

  const post = posts[postIndex];
  const prev = postIndex > 0 ? posts[postIndex - 1] : undefined;
  const next = postIndex < posts.length - 1 ? posts[postIndex + 1] : undefined;

  return (
    <BlogPostClient
      post={post}
      prevPost={prev ? { id: prev.id, title: prev.title, linkTo: `/blog/${prev.id}` } : undefined}
      nextPost={next ? { id: next.id, title: next.title, linkTo: `/blog/${next.id}` } : undefined}
    />
  );
}
