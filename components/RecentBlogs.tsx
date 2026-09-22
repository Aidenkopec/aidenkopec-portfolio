import RecentBlogsClient from '@/components/RecentBlogsClient';
import { getRecentBlogPosts } from '@/lib/blog';

const RecentBlogs = async () => {
  const posts = await getRecentBlogPosts(3);

  if (posts.length === 0) {
    return null;
  }

  return <RecentBlogsClient posts={posts} />;
};

export default RecentBlogs;
