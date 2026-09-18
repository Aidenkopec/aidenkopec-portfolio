import { DateTime } from 'luxon';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';

import 'server-only';
import {
  Commit,
  ContributionCalendar,
  GitHubData,
  GitHubResult,
  GitHubRepository,
  GitHubUser,
} from './github-utils';

// GitHub API configuration
const GITHUB_USERNAME = 'Aidenkopec';
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Uncached transport. React.cache would never hit here because both GraphQL
// call sites pass a fresh options object, and Next's data cache ignores POST,
// so caching lives on fetchGitHubSnapshot instead.
const githubFetch = async (url: string, options?: RequestInit) => {
  const headers: HeadersInit = {
    'User-Agent': 'GitHub-Portfolio-App',
    ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` }),
    ...(options?.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    console.error(
      `GitHub API error: ${response.status} ${response.statusText}`,
    );
    const errorText = await response.text();
    console.error('Error response body:', errorText);
    return null;
  }

  return response.json();
};

// Strips the private account fields the authenticated /user endpoint returns.
function toPublicUser(data: GitHubUser | null): GitHubUser | null {
  if (!data) return null;
  return {
    login: data.login,
    avatar_url: data.avatar_url,
    html_url: data.html_url,
    name: data.name,
    company: data.company,
    location: data.location,
    bio: data.bio,
    public_repos: data.public_repos,
    followers: data.followers,
    following: data.following,
    created_at: data.created_at,
  };
}

// GitHub service functions with React.cache for deduplication
const fetchUserData = cache(async (): Promise<GitHubUser | null> => {
  let url = GITHUB_TOKEN
    ? `${GITHUB_API_BASE}/user`
    : `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`;
  const data = await githubFetch(url);
  if (!data && GITHUB_TOKEN) {
    url = `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`;
    return toPublicUser(await githubFetch(url));
  }
  return toPublicUser(data);
});

const fetchRepositories = cache(async (): Promise<GitHubRepository[]> => {
  const url = GITHUB_TOKEN
    ? `${GITHUB_API_BASE}/user/repos?visibility=public&affiliation=owner&sort=updated&per_page=100`
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

// Four digit year to that calendar year, anything else to a rolling 365 days,
// matching generateCommitGraph.
function contributionRange(year?: string): { from: string; to: string } {
  if (year && /^\d{4}$/.test(year)) {
    return {
      from: `${year}-01-01T00:00:00Z`,
      to: `${year}-12-31T23:59:59Z`,
    };
  }
  const today = DateTime.utc();
  return {
    from: today.minus({ days: 364 }).startOf('day').toISO(),
    to: today.toISO(),
  };
}

// Returns null rather than a synthesised graph when the calendar is unavailable.
// The only other source is fetchRecentCommits, which is capped at 5 commits, so
// anything built from it would be presented as a year's contributions while being
// off by orders of magnitude.
const fetchContributionCalendar = cache(
  async (year?: string): Promise<ContributionCalendar | null> => {
    if (!GITHUB_TOKEN) return null;

    // Always explicit: GitHub's one year default applies to omitted arguments,
    // not to null ones.
    const { from, to } = contributionRange(year);

    const query = `
      query($from: DateTime!, $to: DateTime!) {
        viewer {
          contributionsCollection(from: $from, to: $to) {
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
        body: JSON.stringify({ query, variables: { from, to } }),
      });

      if (data?.data?.viewer?.contributionsCollection?.contributionCalendar) {
        return data.data.viewer.contributionsCollection.contributionCalendar;
      }
      console.error('GitHub returned no contribution calendar');
      return null;
    } catch (error) {
      console.error('Error in fetchContributionCalendar:', error);
      return null;
    }
  },
);

// One cached fan out for the whole section, so both halves of the dashboard
// share a single snapshot instead of each doing its own four request fan out.
//
// Deliberately unstable_cache rather than the newer 'use cache' directive.
// 'use cache' requires the cacheComponents flag, which also removes support for
// dynamicParams and would turn every nonexistent blog URL into a soft 200 (see
// app/blog/[slug]/page.tsx). unstable_cache also persists across deployments and
// serverless instances, which 'use cache' does not: its key includes the build
// id and it falls back to per instance memory.
//
// Returns null rather than throwing so a GitHub outage degrades the section
// instead of failing the render. The revalidate window is what keeps a failed
// snapshot from sticking around, since null is cached too.
const fetchGitHubSnapshot = unstable_cache(
  async (year: string): Promise<GitHubData | null> => {
    try {
      const [userData, repositories, commits, commitCalendar] =
        await Promise.all([
          fetchUserData(),
          fetchRepositories(),
          fetchRecentCommits(),
          fetchContributionCalendar(year),
        ]);

      if (!userData || repositories.length === 0) {
        console.error('GitHub snapshot missing essential data (user or repos)');
        return null;
      }

      const totalStars = repositories.reduce(
        (sum, repo) => sum + repo.stargazers_count,
        0,
      );
      const totalForks = repositories.reduce(
        (sum, repo) => sum + repo.forks_count,
        0,
      );
      // Whole elapsed years, not a calendar-year subtraction: an account created
      // in December 2024 is not "2 years on GitHub" in January 2026. null when
      // GitHub did not send created_at, so the UI can say so instead of guessing.
      const yearsOnGitHub = userData.created_at
        ? Math.floor(
            DateTime.now().diff(DateTime.fromISO(userData.created_at), 'years')
              .years,
          )
        : null;

      return {
        user: userData,
        commits: commits.slice(0, 5),
        commitCalendar,
        stats: {
          totalStars,
          totalForks,
          yearsOnGitHub,
        },
      };
    } catch (error) {
      console.error('GitHub snapshot failed:', error);
      return null;
    }
  },
  ['github-snapshot'],
  { tags: ['github-data'], revalidate: 900 },
);

// Main entry point, callable from Server Components. React.cache deduplicates
// the two dashboard sections within a single render.
export const getGitHubData = cache(
  async (year: string = 'last'): Promise<GitHubResult> => {
    const data = await fetchGitHubSnapshot(year);
    return data ? { ok: true, data } : { ok: false };
  },
);
