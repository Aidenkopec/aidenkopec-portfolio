import { NextResponse } from 'next/server';

import { getGitHubData } from '../../../lib/github-service';

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const year = url.searchParams.get('year') || new Date().getFullYear().toString();

    const githubData = await getGitHubData(year);

    if (!githubData.user) {
      return NextResponse.json(
        { error: 'Unable to fetch GitHub data' },
        { status: 500 },
      );
    }

    return NextResponse.json(githubData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('=== GitHub API Route Error ===');
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    } else {
      console.error('Non-Error object:', error);
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch GitHub data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
