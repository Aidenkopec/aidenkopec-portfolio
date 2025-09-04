import { DateTime } from 'luxon';
import { cache } from 'react';

import 'server-only';
import {
  Commit,
  CommitDay,
  CommitWeek,
  ContributionCalendar,
  GitHubData,
  GitHubRepository,
  GitHubUser,
} from './github-utils';

// GitHub API configuration
const GITHUB_USERNAME = 'Aidenkopec';
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Cached fetch helper with Next.js explicit caching
const githubFetch = cache(async (url: string, options?: RequestInit) => {
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
      `GitHub API error: ${response.status} ${response.statusText}`,
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
  const url = GITHUB_TOKEN
    ? `${GITHUB_API_BASE}/user/repos?visibility=all&affiliation=owner&sort=updated&per_page=100`
    : `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

  const data = await githubFetch(url);

  if (!data || !Array.isArray(data)) {
    return [];
  }

  if (GITHUB_TOKEN) {
    const target = GITHUB_USERNAME.toLowerCase();
    return data.filter(
      (repo: GitHubRepository) => repo?.owner?.login?.toLowerCase() === target,
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
  },
);

function generateCommitGraph(
  commits: Commit[],
  year?: string,
): ContributionCalendar {
  const weeks: CommitWeek[] = [];
  let startDate: DateTime;
  let endDate: DateTime;

  if (year && year !== 'last') {
    // Use calendar year boundaries (Jan 1 - Dec 31)
    startDate = DateTime.fromObject({ year: parseInt(year), month: 1, day: 1 });
    endDate = DateTime.fromObject({ year: parseInt(year), month: 12, day: 31 });
  } else {
    // For "last" year, use rolling 365 days
    const today = DateTime.now();
    startDate = today.minus({ days: 364 });
    endDate = today;
  }

  // Start from the first Sunday of the date range to align with GitHub's grid
  const firstSunday = startDate.startOf('week').minus({ days: 1 }); // Luxon week starts Monday, get Sunday before
  const lastDate = endDate.endOf('day');

  let currentDate = firstSunday;

  while (currentDate <= lastDate) {
    const weekDays: CommitDay[] = [];

    // Generate 7 days for each week
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const dayDate = currentDate.plus({ days: dayOffset });

      // Only include days that are within our actual date range
      if (dayDate >= startDate && dayDate <= endDate) {
        const dayCommits = commits.filter((commit) => {
          const commitDate = DateTime.fromISO(commit.date);
          return commitDate.hasSame(dayDate, 'day');
        });

        weekDays.push({
          date:
            dayDate.toISODate() ||
            dayDate.toISO() ||
            dayDate.toFormat('yyyy-MM-dd'),
          count: dayCommits.length,
          level: getContributionLevel(dayCommits.length),
        });
      }
    }

    if (weekDays.length > 0) {
      weeks.push(weekDays);
    }

    currentDate = currentDate.plus({ weeks: 1 });
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
  async (year: string = new Date().getFullYear().toString()): Promise<GitHubData> => {
    try {
      const [userData, repositories, commits, commitCalendar] =
        await Promise.all([
          fetchUserData(),
          fetchRepositories(),
          fetchRecentCommits(),
          fetchContributionCalendar(year),
        ]);

      if (!userData || repositories.length === 0) {
        throw new Error(
          'Failed to fetch essential GitHub data (user or repos)',
        );
      }

      const totalStars = repositories.reduce(
        (sum, repo) => sum + repo.stargazers_count,
        0,
      );
      const totalForks = repositories.reduce(
        (sum, repo) => sum + repo.forks_count,
        0,
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
  },
);

// Preload function for early data fetching
export const preloadGitHubData = (year?: string) => {
  void getGitHubData(year);
};
