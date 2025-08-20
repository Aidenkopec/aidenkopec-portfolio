import { NextResponse } from 'next/server';
import { cache } from 'react';
import 'server-only';

// GitHub API configuration
const GITHUB_USERNAME = 'Aidenkopec';
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;


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
  const headers: HeadersInit = {
    'User-Agent': 'GitHub-Portfolio-App',
    ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` }),
    ...(options?.headers || {}),
  };

  // Next.js 15: Explicit caching with force-cache and revalidation
  const response = await fetch(url, {
    ...options,
    headers,
    cache: 'force-cache',
    next: { 
      revalidate: 3600, // 1 hour cache
      tags: ['github-data'] 
    },
  });

  if (!response.ok) {
    console.error(`GitHub API error: ${response.status} ${response.statusText}`);
    return null;
  }

  return response.json();
});

// GitHub service functions with React.cache for deduplication
const fetchUserData = cache(async (): Promise<GitHubUser | null> => {
  try {
    let url = GITHUB_TOKEN 
      ? `${GITHUB_API_BASE}/user`
      : `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`;
    
    const data = await githubFetch(url);
    
    // If authenticated endpoint fails, fallback to public endpoint
    if (!data && GITHUB_TOKEN) {
      url = `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`;
      return await githubFetch(url);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
});

const fetchRepositories = cache(async (): Promise<GitHubRepository[]> => {
  try {
    let url = GITHUB_TOKEN
      ? `${GITHUB_API_BASE}/user/repos?visibility=all&affiliation=owner&sort=updated&per_page=100`
      : `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;
    
    const data = await githubFetch(url);
    
    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Filter to target user's repos if using authenticated endpoint
    if (GITHUB_TOKEN) {
      const target = GITHUB_USERNAME.toLowerCase();
      return data.filter((repo: GitHubRepository) => 
        repo?.owner?.login?.toLowerCase() === target
      );
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching repositories:', error);
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
        const repoName = event.repo?.name?.split('/')?.[1] || event.repo?.name || 'unknown';
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

const fetchContributionCalendar = cache(async (year?: string): Promise<ContributionCalendar> => {
  if (!GITHUB_TOKEN) {
    // Fallback: generate from commit data
    const commits = await fetchRecentCommits();
    return generateCommitGraph(commits, year);
  }

  // Build GraphQL query with optional date range for specific years
  let contributionsCollectionArgs = '';
  if (year && year !== 'last') {
    const fromDate = `${year}-01-01T00:00:00Z`;
    const toDate = `${year}-12-31T23:59:59Z`;
    contributionsCollectionArgs = `(from: "${fromDate}", to: "${toDate}")`;
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

  try {
    const data = await githubFetch(`${GITHUB_API_BASE}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (data?.data?.viewer?.contributionsCollection?.contributionCalendar) {
      return data.data.viewer.contributionsCollection.contributionCalendar;
    }

    // Fallback if GraphQL fails
    const commits = await fetchRecentCommits();
    return generateCommitGraph(commits, year);
  } catch (error) {
    console.error('Error fetching contribution calendar:', error);
    const commits = await fetchRecentCommits();
    return generateCommitGraph(commits, year);
  }
});

// Helper function to generate commit graph from commits data
function generateCommitGraph(commits: Commit[], year?: string): ContributionCalendar {
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
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
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
  try {
    // Parallel data fetching for optimal performance
    const [userData, repositories] = await Promise.all([
      fetchUserData(),
      fetchRepositories(),
    ]);

    if (!userData || repositories.length === 0) {
      return NextResponse.json(
        { error: 'Unable to fetch GitHub data' },
        { status: 500 }
      );
    }

    // Calculate stats
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
    const createdAt = new Date(userData.created_at || '2022-01-10');
    const contributionYears = new Date().getFullYear() - createdAt.getFullYear();

    // Get year parameter from request
    const url = new URL(request?.url || '');
    const year = url.searchParams.get('year') || 'last';

    // Fetch remaining data in parallel
    const [commits, commitCalendar] = await Promise.all([
      fetchRecentCommits(),
      fetchContributionCalendar(year),
    ]);

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

    return NextResponse.json(githubData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('GitHub API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}