import { loadBlogPosts } from '@/lib/blog-loader';
import { categorizedFavorites } from '@/lib/favorites';
import { HomeClient } from './HomeClient';

export default function HomePage() {
  const posts = loadBlogPosts();
  return <HomeClient posts={posts} favorites={categorizedFavorites} />;
}
