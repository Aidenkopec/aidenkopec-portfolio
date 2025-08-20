import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import 'server-only';
import type {
  GitHubUser,
  GitHubRepository,
  Commit,
  ContributionCalendar,
  GitHubStats,
  GitHubData,
} from './github-utils';

// Cached function to fetch GitHub data from our API route
const fetchGitHubData = cache(async (): Promise<GitHubData> => {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : '';
    
    const response = await fetch(`${baseUrl}/api/github`, {
      cache: 'force-cache',
      next: { 
        revalidate: 3600, // 1 hour cache
        tags: ['github-data']
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    
    // Return fallback data structure
    return {
      user: null,
      repositories: [],
      commits: [],
      stats: {
        totalStars: 0,
        totalForks: 0,
        contributionYears: 0,
      },
    };
  }
});

// Unstable cache wrapper for additional caching layer
export const getGitHubData = unstable_cache(
  fetchGitHubData,
  ['github-data'],
  {
    revalidate: 3600, // 1 hour
    tags: ['github-data'],
  }
);

// Preload function for early data fetching
export const preloadGitHubData = () => {
  void getGitHubData();
};

// Individual data fetchers with caching
export const getGitHubUser = cache(async (): Promise<GitHubUser | null> => {
  const data = await getGitHubData();
  return data.user;
});

export const getGitHubRepositories = cache(async (): Promise<GitHubRepository[]> => {
  const data = await getGitHubData();
  return data.repositories;
});


export const getGitHubCommits = cache(async (): Promise<Commit[]> => {
  const data = await getGitHubData();
  return data.commits;
});

export const getGitHubStats = cache(async (): Promise<GitHubStats> => {
  const data = await getGitHubData();
  return data.stats;
});

export const getContributionCalendar = cache(async (): Promise<ContributionCalendar | undefined> => {
  const data = await getGitHubData();
  return data.commitCalendar;
});

// Utility function to check if GitHub data is available
export const isGitHubDataAvailable = cache(async (): Promise<boolean> => {
  try {
    const data = await getGitHubData();
    return data.user !== null && data.repositories.length > 0;
  } catch {
    return false;
  }
});

// Function to get specific repository data
export const getRepository = cache(async (repoName: string): Promise<GitHubRepository | null> => {
  const repositories = await getGitHubRepositories();
  return repositories.find(repo => repo.name === repoName) || null;
});

// Function to get language by name

// Function to get recent commits for a specific repository
export const getCommitsForRepo = cache(async (repoName: string): Promise<Commit[]> => {
  const commits = await getGitHubCommits();
  return commits.filter(commit => commit.repo === repoName);
});


// Export default as main service
export default {
  getGitHubData,
  preloadGitHubData,
  getGitHubUser,
  getGitHubRepositories,
  getGitHubCommits,
  getGitHubStats,
  getContributionCalendar,
  isGitHubDataAvailable,
  getRepository,
  getCommitsForRepo,
};