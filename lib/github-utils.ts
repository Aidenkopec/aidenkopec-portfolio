// Shared GitHub utility functions that can be used in both client and server components
// Note: These functions don't use 'server-only' so they can be imported by client components

// Types that can be shared
export interface GitHubUser {
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

export interface Language {
  name: string;
  percentage: number;
  color: string;
  bytes: number;
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

export interface CommitWeek extends Array<CommitDay> {}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[] | CommitWeek[];
}

export interface GitHubStats {
  totalStars: number;
  totalForks: number;
  contributionYears: number;
}

export interface GitHubData {
  user: GitHubUser | null;
  repositories: GitHubRepository[];
  languages: Language[];
  commits: Commit[];
  commitCalendar?: ContributionCalendar;
  stats: GitHubStats;
}

// Utility functions that can be used in both client and server components

// Helper function to format commit message
export const formatCommitMessage = (message: string, maxLength: number = 50): string => {
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