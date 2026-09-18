// Shared GitHub utility functions that can be used in both client and server components
// Note: These functions don't use 'server-only' so they can be imported by client components

// Public fields only. The authenticated /user endpoint also returns private
// account data, and this object reaches the browser in the RSC payload.
export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string | null;
  location: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepository {
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

export interface Commit {
  date: string;
  message: string;
  repo: string;
  sha: string;
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
  color?: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface CommitDay {
  date: string;
  count: number;
  level: number;
}

export type CommitWeek = CommitDay[];

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[] | CommitWeek[];
}

export interface GitHubStats {
  totalStars: number;
  totalForks: number;
  /** Whole years since the account was created. null when GitHub omits the date. */
  yearsOnGitHub: number | null;
}

// No repositories field: fetched only to derive stats, never rendered.
export interface GitHubData {
  user: GitHubUser | null;
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

// Helper function to get contribution level color
export const getContributionColor = (level: number): string => {
  const colors = [
    'var(--black-100, #1f2937)', // No contributions
    'var(--text-color-variable, #ff6b6b)', // Low contributions
    'var(--gradient-start, #00cea8)', // Medium contributions
    'var(--gradient-end, #bf61ff)', // High contributions
    'var(--secondary-color, #ffffff)', // Very high contributions
  ];
  return colors[level] || colors[0];
};
