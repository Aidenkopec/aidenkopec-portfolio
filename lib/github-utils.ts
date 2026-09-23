// Shared GitHub utility functions that can be used in both client and server components
// Note: These functions don't use 'server-only' so they can be imported by client components

// Public fields only. The authenticated /user endpoint also returns private
// account data, and this object reaches the browser in the RSC payload.
export interface GitHubUser {
  public_repos: number;
  followers: number;
  created_at: string;
}

export interface GitHubRepository {
  stargazers_count: number;
  owner: {
    login: string;
  };
}

export interface Commit {
  date: string;
  message: string;
  repo: string;
  sha: string;
}

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  // One shape, not a union. The commit derived fallback that produced the other
  // branch was deleted with finding 2.8, so fetchContributionCalendar now
  // returns GitHub's GraphQL shape or null. The untagged union it left behind
  // could not be narrowed without a runtime shape check.
  weeks: ContributionWeek[];
}

interface GitHubStats {
  totalStars: number;
  /** Whole years since the account was created. null when GitHub omits the date. */
  yearsOnGitHub: number | null;
}

// No repositories field: fetched only to derive stats, never rendered.
export interface GitHubData {
  user: GitHubUser;
  commits: Commit[];
  // null when the contribution calendar is unavailable, so the UI can say so
  // rather than render a graph totalling zero.
  commitCalendar: ContributionCalendar | null;
  stats: GitHubStats;
}

// Callers must distinguish "GitHub is unreachable" from "this account has no
// activity". The old zeroed fallback rendered the second when it meant the first.
export type GitHubResult = { ok: true; data: GitHubData } | { ok: false };

// Utility functions that can be used in both client and server components

// Helper function to format commit message
export const formatCommitMessage = (
  message: string,
  maxLength: number = 50,
): string => {
  if (message.length <= maxLength) {
    return message;
  }
  return message.substring(0, maxLength) + '...';
};
