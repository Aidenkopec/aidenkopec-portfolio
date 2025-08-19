import { NextResponse } from 'next/server';
import { cache } from 'react';
import 'server-only';

// GitHub API configuration
const GITHUB_USERNAME = 'Aidenkopec';
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Language colors from GitHub
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#4fc08d',
  React: '#61dafb',
  'Jupyter Notebook': '#da5b0b',
  Shell: '#89e051',
};

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

interface Language {
  name: string;
  percentage: number;
  color: string;
  bytes: number;
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
  languages: Language[];
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

const fetchLanguages = cache(async (repos: GitHubRepository[]): Promise<Language[]> => {
  try {
    const languageStats: Record<string, number> = {};
    let totalBytes = 0;

    // Fetch languages for top 20 repos in parallel
    const topRepos = repos.filter(r => !r.fork).slice(0, 20);
    const languagePromises = topRepos.map(async (repo) => {
      try {
        const languages = await githubFetch(repo.languages_url);
        if (languages && typeof languages === 'object' && !Array.isArray(languages)) {
          return languages;
        }
        return {};
      } catch {
        return {};
      }
    });

    const languageResults = await Promise.all(languagePromises);
    
    // Aggregate language statistics
    languageResults.forEach((languages) => {
      Object.entries(languages).forEach(([lang, bytes]) => {
        if (typeof bytes === 'number') {
          languageStats[lang] = (languageStats[lang] || 0) + bytes;
          totalBytes += bytes;
        }
      });
    });

    return Object.entries(languageStats)
      .map(([name, bytes]) => ({
        name,
        percentage: Math.round((bytes / totalBytes) * 100),
        color: LANGUAGE_COLORS[name] || '#858585',
        bytes,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 6);
  } catch (error) {
    console.error('Error fetching languages:', error);
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

const fetchContributionCalendar = cache(async (): Promise<ContributionCalendar> => {
  if (!GITHUB_TOKEN) {
    // Fallback: generate from commit data
    const commits = await fetchRecentCommits();
    return generateCommitGraph(commits);
  }

  const query = `
    query {
      viewer {
        contributionsCollection {
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
    return generateCommitGraph(commits);
  } catch (error) {
    console.error('Error fetching contribution calendar:', error);
    const commits = await fetchRecentCommits();
    return generateCommitGraph(commits);
  }
});

// Helper function to generate commit graph from commits data
function generateCommitGraph(commits: Commit[]): ContributionCalendar {
  const weeks: CommitWeek[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364);

  for (let week = 0; week < 52; week++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + week * 7);

    const days: CommitDay[] = [];
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + day);

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
export async function GET(): Promise<NextResponse> {
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

    // Fetch remaining data in parallel
    const [languages, commits, commitCalendar] = await Promise.all([
      fetchLanguages(repositories.filter(r => !r.fork).slice(0, 10)),
      fetchRecentCommits(),
      fetchContributionCalendar(),
    ]);

    const githubData: GitHubData = {
      user: userData,
      repositories: repositories.slice(0, 6),
      languages,
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