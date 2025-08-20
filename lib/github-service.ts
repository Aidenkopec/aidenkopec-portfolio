import { cache } from 'react';
import 'server-only';
import {
  GitHubUser,
  GitHubRepository,
  Commit,
  ContributionCalendar,
  GitHubStats,
  GitHubData,
  ContributionDay,
  ContributionWeek,
  CommitDay,
  CommitWeek,
} from './github-utils';

// GitHub API configuration
const GITHUB_USERNAME = 'Aidenkopec';
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Add logging for environment variables for debugging
console.log('GitHub Service - Environment Check:');
console.log('GITHUB_TOKEN exists:', !!GITHUB_TOKEN);

// Cached fetch helper with Next.js explicit caching
const githubFetch = cache(async (url: string, options?: RequestInit) => {
  console.log('GitHub API Call:', url);

  const headers: HeadersInit = {
    'User-Agent': 'GitHub-Portfolio-App',
    ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` }),
    ...(options?.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    next: {
      revalidate: 3600, // 1 hour cache
      tags: ['github-data'],
    },
  });

  if (!response.ok) {
    console.error(
      `GitHub API error: ${response.status} ${response.statusText}`
    );
    const errorText = await response.text();
    console.error('Error response body:', errorText);
    return null;
  }

  return response.json();
});

// GitHub service functions with React.cache for deduplication
const fetchUserData = cache(async (): Promise<GitHubUser | null> => {
  let url = GITHUB_TOKEN
    ? `${GITHUB_API_BASE}/user`
    : `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`;
  const data = await githubFetch(url);
  if (!data && GITHUB_TOKEN) {
    url = `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`;
    return await githubFetch(url);
  }
  return data;
});

const fetchRepositories = cache(async (): Promise<GitHubRepository[]> => {
  let url = GITHUB_TOKEN
    ? `${GITHUB_API_BASE}/user/repos?visibility=all&affiliation=owner&sort=updated&per_page=100`
    : `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

  const data = await githubFetch(url);

  if (!data || !Array.isArray(data)) {
    return [];
  }

  if (GITHUB_TOKEN) {
    const target = GITHUB_USERNAME.toLowerCase();
    return data.filter(
      (repo: GitHubRepository) => repo?.owner?.login?.toLowerCase() === target
    );
  }
  return data;
});

const fetchRecentCommits = cache(async (): Promise<Commit[]> => {
  const eventsUrl = `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events/public?per_page=100`;
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
      const repoName = event.repo?.name || 'unknown';
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
});

const fetchContributionCalendar = cache(
  async (year?: string): Promise<ContributionCalendar> => {
    if (!GITHUB_TOKEN) {
      const commits = await fetchRecentCommits();
      return generateCommitGraph(commits, year);
    }

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (data?.data?.viewer?.contributionsCollection?.contributionCalendar) {
        return data.data.viewer.contributionsCollection.contributionCalendar;
      }
      const commits = await fetchRecentCommits();
      return generateCommitGraph(commits, year);
    } catch (error) {
      console.error('Error in fetchContributionCalendar:', error);
      const commits = await fetchRecentCommits();
      return generateCommitGraph(commits, year);
    }
  }
);

function generateCommitGraph(
  commits: Commit[],
  year?: string
): ContributionCalendar {
  const weeks: CommitWeek[] = [];
  let startDate: Date;
  let endDate: Date;

  if (year && year !== 'last') {
    startDate = new Date(`${year}-01-01`);
    endDate = new Date(`${year}-12-31`);
  } else {
    const today = new Date();
    startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    endDate = today;
  }

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

// Main function to get all GitHub data, callable from Server Components
export const getGitHubData = cache(
  async (year: string = 'last'): Promise<GitHubData> => {
    try {
      console.log('Fetching all GitHub data in parallel...');
      const [userData, repositories, commits, commitCalendar] =
        await Promise.all([
          fetchUserData(),
          fetchRepositories(),
          fetchRecentCommits(),
          fetchContributionCalendar(year),
        ]);

      if (!userData || repositories.length === 0) {
        throw new Error(
          'Failed to fetch essential GitHub data (user or repos)'
        );
      }

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

      return {
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
    } catch (error) {
      console.error('Error in getGitHubData:', error);
      // Return a structured error state or a fallback object
      return {
        user: null,
        repositories: [],
        commits: [],
        commitCalendar: { totalContributions: 0, weeks: [] },
        stats: {
          totalStars: 0,
          totalForks: 0,
          contributionYears: 0,
        },
      };
    }
  }
);

// Preload function for early data fetching
export const preloadGitHubData = (year?: string) => {
  void getGitHubData(year);
};
