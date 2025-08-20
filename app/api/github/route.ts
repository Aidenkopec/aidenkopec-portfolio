import { NextResponse } from 'next/server';
import { cache } from 'react';
import 'server-only';

// GitHub API configuration
const GITHUB_USERNAME = 'Aidenkopec';
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Add logging for environment variables
console.log('GitHub API Route - Environment Check:');
console.log('GITHUB_USERNAME:', GITHUB_USERNAME);
console.log('GITHUB_API_BASE:', GITHUB_API_BASE);
console.log('GITHUB_TOKEN exists:', !!GITHUB_TOKEN);
console.log('GITHUB_TOKEN length:', GITHUB_TOKEN?.length || 0);
console.log(
  'GITHUB_TOKEN prefix:',
  GITHUB_TOKEN ? `${GITHUB_TOKEN.substring(0, 4)}...` : 'N/A'
);

// Types
interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  fork: boolean;
  html_url: string;
  clone_url: string;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  languages_url: string;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  topics: string[];
  visibility: string;
  pushed_at: string;
  created_at: string;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Commit {
  date: string;
  message: string;
  repo: string;
  sha: string;
}

interface ContributionDay {
  contributionCount: number;
  date: string;
  color?: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface CommitDay {
  date: string;
  count: number;
  level: number;
}

interface CommitWeek extends Array<CommitDay> {}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[] | CommitWeek[];
}

interface GitHubStats {
  totalStars: number;
  totalForks: number;
  contributionYears: number;
}

interface GitHubData {
  user: GitHubUser | null;
  repositories: GitHubRepository[];
  commits: Commit[];
  commitCalendar?: ContributionCalendar;
  stats: GitHubStats;
}

// Cached fetch helper with Next.js 15 explicit caching
const githubFetch = cache(async (url: string, options?: RequestInit) => {
  console.log('GitHub API Call:', url);
  console.log('Request options:', JSON.stringify(options, null, 2));

  const headers: HeadersInit = {
    'User-Agent': 'GitHub-Portfolio-App',
    ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` }),
    ...(options?.headers || {}),
  };

  console.log('Request headers:', JSON.stringify(headers, null, 2));

  // Next.js 15: Explicit caching with force-cache and revalidation
  const response = await fetch(url, {
    ...options,
    headers,
    cache: 'force-cache',
    next: {
      revalidate: 3600, // 1 hour cache
      tags: ['github-data'],
    },
  });

  console.log('Response status:', response.status, response.statusText);
  console.log(
    'Response headers:',
    JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)
  );

  if (!response.ok) {
    console.error(
      `GitHub API error: ${response.status} ${response.statusText}`
    );
    const errorText = await response.text();
    console.error('Error response body:', errorText);
    return null;
  }

  const data = await response.json();
  console.log('Response data type:', typeof data);
  console.log('Response data keys:', data ? Object.keys(data) : 'No data');

  return data;
});

// GitHub service functions with React.cache for deduplication
const fetchUserData = cache(async (): Promise<GitHubUser | null> => {
  console.log('=== fetchUserData called ===');
  try {
    let url = GITHUB_TOKEN
      ? `${GITHUB_API_BASE}/user`
      : `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`;

    console.log('Fetching user data from:', url);
    console.log('Using authenticated endpoint:', !!GITHUB_TOKEN);

    const data = await githubFetch(url);
    console.log('User data response received:', !!data);

    // If authenticated endpoint fails, fallback to public endpoint
    if (!data && GITHUB_TOKEN) {
      console.log(
        'Authenticated endpoint failed, falling back to public endpoint'
      );
      url = `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`;
      return await githubFetch(url);
    }

    return data;
  } catch (error) {
    console.error('Error in fetchUserData:', error);
    if (error instanceof Error) {
      console.error('fetchUserData error message:', error.message);
    }
    return null;
  }
});

const fetchRepositories = cache(async (): Promise<GitHubRepository[]> => {
  console.log('=== fetchRepositories called ===');
  try {
    let url = GITHUB_TOKEN
      ? `${GITHUB_API_BASE}/user/repos?visibility=all&affiliation=owner&sort=updated&per_page=100`
      : `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

    console.log('Fetching repositories from:', url);
    console.log('Using authenticated endpoint:', !!GITHUB_TOKEN);

    const data = await githubFetch(url);
    console.log('Repositories response received:', !!data);
    console.log('Repositories response type:', typeof data);
    console.log('Repositories is array:', Array.isArray(data));

    if (!data || !Array.isArray(data)) {
      console.log(
        'No repositories data or not an array, returning empty array'
      );
      return [];
    }

    console.log('Raw repositories count:', data.length);

    // Filter to target user's repos if using authenticated endpoint
    if (GITHUB_TOKEN) {
      const target = GITHUB_USERNAME.toLowerCase();
      console.log('Filtering repositories for user:', target);
      const filtered = data.filter(
        (repo: GitHubRepository) => repo?.owner?.login?.toLowerCase() === target
      );
      console.log('Filtered repositories count:', filtered.length);
      return filtered;
    }

    console.log('Using public endpoint, returning all repositories');
    return data;
  } catch (error) {
    console.error('Error in fetchRepositories:', error);
    if (error instanceof Error) {
      console.error('fetchRepositories error message:', error.message);
    }
    return [];
  }
});

const fetchRecentCommits = cache(async (): Promise<Commit[]> => {
  try {
    const eventsUrl = GITHUB_TOKEN
      ? `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events?per_page=100`
      : `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events/public?per_page=100`;

    const events = await githubFetch(eventsUrl);

    if (!Array.isArray(events)) {
      return [];
    }

    const commits: Commit[] = [];
    for (const event of events) {
      if (
        event.type === 'PushEvent' &&
        event.payload &&
        Array.isArray(event.payload.commits)
      ) {
        const repoName =
          event.repo?.name?.split('/')?.[1] || event.repo?.name || 'unknown';
        for (const commit of event.payload.commits) {
          commits.push({
            date: event.created_at,
            message: commit.message || 'Commit',
            repo: repoName,
            sha: commit.sha || '',
          });
          if (commits.length >= 25) break;
        }
      }
      if (commits.length >= 25) break;
    }

    return commits;
  } catch (error) {
    console.error('Error fetching recent commits:', error);
    return [];
  }
});

const fetchContributionCalendar = cache(
  async (year?: string): Promise<ContributionCalendar> => {
    console.log('=== fetchContributionCalendar called ===');
    console.log('Requested year:', year);
    console.log('GITHUB_TOKEN available:', !!GITHUB_TOKEN);

    if (!GITHUB_TOKEN) {
      console.log(
        'No token available, falling back to commit-based graph generation'
      );
      // Fallback: generate from commit data
      const commits = await fetchRecentCommits();
      console.log('Generated commit graph from', commits.length, 'commits');
      return generateCommitGraph(commits, year);
    }

    // Build GraphQL query with optional date range for specific years
    let contributionsCollectionArgs = '';
    if (year && year !== 'last') {
      const fromDate = `${year}-01-01T00:00:00Z`;
      const toDate = `${year}-12-31T23:59:59Z`;
      contributionsCollectionArgs = `(from: "${fromDate}", to: "${toDate}")`;
      console.log('Using date range:', fromDate, 'to', toDate);
    }

    const query = `
    query {
      viewer {
        contributionsCollection${contributionsCollectionArgs} {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;

    console.log('GraphQL query:', query);

    try {
      console.log('Making GraphQL request to GitHub API...');
      const data = await githubFetch(`${GITHUB_API_BASE}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      console.log('GraphQL response received:', !!data);
      if (data) {
        console.log('GraphQL response keys:', Object.keys(data));
        console.log('GraphQL data structure:', JSON.stringify(data, null, 2));
      }

      if (data?.data?.viewer?.contributionsCollection?.contributionCalendar) {
        console.log(
          'Successfully extracted contribution calendar from GraphQL'
        );
        return data.data.viewer.contributionsCollection.contributionCalendar;
      }

      console.log(
        'GraphQL response missing expected data structure, falling back to commit-based graph'
      );
      // Fallback if GraphQL fails
      const commits = await fetchRecentCommits();
      return generateCommitGraph(commits, year);
    } catch (error) {
      console.error('Error in fetchContributionCalendar:', error);
      if (error instanceof Error) {
        console.error(
          'fetchContributionCalendar error message:',
          error.message
        );
      }
      console.log('Falling back to commit-based graph generation due to error');
      const commits = await fetchRecentCommits();
      return generateCommitGraph(commits, year);
    }
  }
);

// Helper function to generate commit graph from commits data
function generateCommitGraph(
  commits: Commit[],
  year?: string
): ContributionCalendar {
  const weeks: CommitWeek[] = [];
  let startDate: Date;
  let endDate: Date;

  if (year && year !== 'last') {
    // For specific year, use Jan 1 to Dec 31
    startDate = new Date(`${year}-01-01`);
    endDate = new Date(`${year}-12-31`);
  } else {
    // For 'last' year, use past 365 days
    const today = new Date();
    startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    endDate = today;
  }

  // Calculate number of weeks needed
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalWeeks = Math.ceil(totalDays / 7);

  for (let week = 0; week < totalWeeks; week++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + week * 7);

    const days: CommitDay[] = [];
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + day);

      // Skip dates outside our target range
      if (currentDate > endDate) {
        break;
      }

      const dayCommits = commits.filter((commit) => {
        const commitDate = new Date(commit.date);
        return commitDate.toDateString() === currentDate.toDateString();
      });

      days.push({
        date: currentDate.toISOString().split('T')[0],
        count: dayCommits.length,
        level: getContributionLevel(dayCommits.length),
      });
    }
    weeks.push(days);
  }

  return {
    weeks,
    totalContributions: commits.length,
  };
}

function getContributionLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

// Main GET handler with parallel data fetching
export async function GET(request: Request): Promise<NextResponse> {
  console.log('=== GitHub API Route Called ===');
  console.log('Request URL:', request.url);
  console.log('Request method:', request.method);
  console.log(
    'Request headers:',
    JSON.stringify(Object.fromEntries(request.headers.entries()), null, 2)
  );

  try {
    console.log('Starting parallel data fetching...');

    // Parallel data fetching for optimal performance
    const [userData, repositories] = await Promise.all([
      fetchUserData(),
      fetchRepositories(),
    ]);

    console.log('User data fetched:', !!userData);
    console.log('Repositories fetched:', repositories.length);

    if (userData) {
      console.log('User data keys:', Object.keys(userData));
      console.log('User login:', userData.login);
      console.log('User public repos:', userData.public_repos);
    }

    if (!userData || repositories.length === 0) {
      console.error(
        'Critical data missing - userData:',
        !!userData,
        'repositories:',
        repositories.length
      );
      return NextResponse.json(
        { error: 'Unable to fetch GitHub data' },
        { status: 500 }
      );
    }

    // Calculate stats
    const totalStars = repositories.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );
    const totalForks = repositories.reduce(
      (sum, repo) => sum + repo.forks_count,
      0
    );
    const createdAt = new Date(userData.created_at || '2022-01-10');
    const contributionYears =
      new Date().getFullYear() - createdAt.getFullYear();

    console.log('Stats calculated:', {
      totalStars,
      totalForks,
      contributionYears,
    });

    // Get year parameter from request
    const url = new URL(request?.url || '');
    const year = url.searchParams.get('year') || 'last';
    console.log('Requested year:', year);

    // Fetch remaining data in parallel
    console.log('Fetching commits and contribution calendar...');
    const [commits, commitCalendar] = await Promise.all([
      fetchRecentCommits(),
      fetchContributionCalendar(year),
    ]);

    console.log('Commits fetched:', commits.length);
    console.log('Contribution calendar fetched:', !!commitCalendar);
    if (commitCalendar) {
      console.log(
        'Contribution calendar weeks:',
        commitCalendar.weeks?.length || 0
      );
      console.log('Total contributions:', commitCalendar.totalContributions);
    }

    const githubData: GitHubData = {
      user: userData,
      repositories: repositories.slice(0, 6),
      commits: commits.slice(0, 5),
      commitCalendar,
      stats: {
        totalStars,
        totalForks,
        contributionYears,
      },
    };

    console.log('Final data structure created successfully');
    console.log('Data summary:', {
      user: !!githubData.user,
      repositories: githubData.repositories.length,
      commits: githubData.commits.length,
      commitCalendar: !!githubData.commitCalendar,
      stats: githubData.stats,
    });

    return NextResponse.json(githubData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('=== GitHub API Route Error ===');
    console.error('Error type:', typeof error);
    console.error('Error constructor:', error?.constructor?.name);

    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error name:', error.name);
    } else {
      console.error('Non-Error object:', error);
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch GitHub data',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Add a simple test endpoint for debugging
export async function POST(request: Request): Promise<NextResponse> {
  console.log('=== GitHub API Test Endpoint Called ===');

  try {
    // Test basic GitHub API connectivity
    const testResponse = await fetch('https://api.github.com/rate_limit', {
      headers: {
        'User-Agent': 'GitHub-Portfolio-App',
        ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` }),
      },
    });

    const rateLimitData = await testResponse.json();

    return NextResponse.json({
      success: true,
      rateLimit: rateLimitData,
      tokenExists: !!GITHUB_TOKEN,
      tokenLength: GITHUB_TOKEN?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function HEAD() {
  return NextResponse.json({
    tokenExists: !!process.env.GITHUB_TOKEN,
    tokenLength: process.env.GITHUB_TOKEN?.length || 0,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
  });
}
