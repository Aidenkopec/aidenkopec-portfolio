import { NextResponse } from 'next/server';
import { getAllBlogPosts, getFeaturedBlogPosts, getAllBlogTags } from '@/lib/blog';

export async function GET() {
  try {
    const [allPosts, featuredPosts, tags] = await Promise.all([
      getAllBlogPosts(),
      getFeaturedBlogPosts(),
      getAllBlogTags(),
    ]);

    return NextResponse.json({
      allPosts,
      featuredPosts,
      tags,
    });
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog data' },
      { status: 500 }
    );
  }
}