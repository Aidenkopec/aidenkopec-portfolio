import { NextResponse } from 'next/server';

import { getGitHubData } from '../../../lib/github-service';

const FIRST_GITHUB_YEAR = 2008;

function parseYear(raw: string | null): string {
  if (!raw || !/^\d{4}$/.test(raw)) return 'last';
  const year = Number(raw);
  if (year < FIRST_GITHUB_YEAR || year > new Date().getFullYear())
    return 'last';
  return raw;
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const year = parseYear(url.searchParams.get('year'));

    const result = await getGitHubData(year);

    if (!result.ok) {
      return NextResponse.json(
        { error: 'Unable to fetch GitHub data' },
        { status: 500 },
      );
    }

    // Calendar only. Clients read nothing else from this endpoint.
    return NextResponse.json(
      { commitCalendar: result.data.commitCalendar },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (error) {
    console.error('=== GitHub API Route Error ===');
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    } else {
      console.error('Non-Error object:', error);
    }

    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 },
    );
  }
}
