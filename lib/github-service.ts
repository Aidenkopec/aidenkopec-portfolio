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
  // If no GitHub token, we can't use GraphQL API
  if (!GITHUB_TOKEN) {
    console.warn(
      'GITHUB_TOKEN not found. Cannot fetch recent commits via GraphQL.',
    );
    return [];
  }

  // GraphQL query to fetch recent commits across all repositories
  // Fetching from top 5 recently pushed PUBLIC repos, with 5 commits each = ~25 commits to sort
  // Privacy filter ensures no private repository data is exposed
  const query = `
    query {
      viewer {
        repositories(first: 5, orderBy: {field: PUSHED_AT, direction: DESC}, ownerAffiliations: OWNER, privacy: PUBLIC) {
          nodes {
            name
            defaultBranchRef {
              target {
                ... on Commit {
                  history(first: 5) {
                    edges {
                      node {
                        oid
                        message
                        committedDate
                        author {
                          name
                        }
                      }
                    }
                  }
                }
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

    if (!data?.data?.viewer?.repositories?.nodes) {
      console.error('Invalid GraphQL response for commits');
      return [];
    }

    const commits: Commit[] = [];
    const repositories = data.data.viewer.repositories.nodes;

    // Collect all commits from all repositories
    for (const repo of repositories) {
      if (!repo?.defaultBranchRef?.target?.history?.edges) {
        continue;
      }

      const repoName = repo.name;
      const commitEdges = repo.defaultBranchRef.target.history.edges;

      for (const edge of commitEdges) {
        const commitNode = edge.node;
        commits.push({
          date: commitNode.committedDate,
          message: commitNode.message.split('\n')[0], // First line only
          repo: repoName,
          sha: commitNode.oid,
        });
      }
    }

    // Sort by date (newest first) and limit to 5
    commits.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return commits.slice(0, 5);
  } catch (error) {
    console.error('Error fetching commits via GraphQL:', error);
    return [];
  }
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
  async (year: string = 'last'): Promise<GitHubData> => {
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
