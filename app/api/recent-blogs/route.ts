import { NextResponse } from 'next/server';

import { getRecentBlogPosts } from '@/lib/blog';

export async function GET() {
  try {
    const recentPosts = await getRecentBlogPosts(3);
    
    return NextResponse.json({ 
      recentPosts,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching recent blog posts:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch recent blog posts',
        recentPosts: [],
        success: false 
      },
      { status: 500 }
    );
  }
}