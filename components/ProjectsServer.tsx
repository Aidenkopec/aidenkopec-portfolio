import { Suspense } from 'react';
import { unstable_cacheTag as cacheTag } from 'next/cache';

import { projects } from '../constants';
import { getGitHubData, preloadGitHubData } from '../lib/github-service';

import {
  ProjectCards,
  GitHubStats,
  GitHubDashboard,
  ProjectsHeader,
  ProjectsDescription,
  ProjectsSectionHeader,
} from './ProjectsClient';

const GitHubStatsSkeleton = () => (
  <div className='mt-8 mb-12 flex flex-wrap justify-center gap-4'>
    {[...Array(4)].map((_, i) => (
      <div key={i} className='min-w-[160px] flex-1'>
        <div className='bg-tertiary border-tertiary rounded-xl border p-4'>
          <div className='mb-2 flex items-center justify-between'>
            <div className='h-6 w-6 animate-pulse rounded bg-gray-600'></div>
            <div className='h-6 w-6 animate-pulse rounded bg-gray-600'></div>
          </div>
          <div className='h-3 w-16 animate-pulse rounded bg-gray-600'></div>
        </div>
      </div>
    ))}
  </div>
);

const GitHubDashboardSkeleton = () => (
  <div className='mb-12 grid grid-cols-1 gap-8'>
    <div className='bg-tertiary border-tertiary w-full rounded-xl border p-4'>
      <div className='mb-4 h-6 w-48 animate-pulse rounded bg-gray-600'></div>
      <div className='h-32 animate-pulse rounded bg-gray-600'></div>
    </div>
    <div className='flex flex-col gap-8 lg:flex-row'>
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className='bg-tertiary border-tertiary flex-1 rounded-xl border p-4'
        >
          <div className='mb-4 h-6 w-32 animate-pulse rounded bg-gray-600'></div>
          <div className='space-y-3'>
            {[...Array(3)].map((_, j) => (
              <div
                key={j}
                className='h-16 animate-pulse rounded bg-gray-600'
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Server Component with 'use cache' directive for Next.js 15.4.6
async function GitHubStatsSection() {
  'use cache';
  cacheTag('github-stats');

  const githubData = await getGitHubData();

  return <GitHubStats githubData={githubData} />;
}

async function GitHubDashboardSection() {
  'use cache';
  cacheTag('github-dashboard');

  const githubData = await getGitHubData();

  return <GitHubDashboard githubData={githubData} />;
}

// Main Projects Server Component
export default async function ProjectsServer() {
  'use cache';
  cacheTag('projects-page');

  // Preload GitHub data for better performance
  preloadGitHubData();

  return (
    <>
      {/* Header Section */}
      <ProjectsHeader />
      <ProjectsDescription />

      {/* Featured Projects Section */}
      <ProjectsSectionHeader title='Featured Projects' className='mt-16' />

      <div className='mb-20 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3'>
        <ProjectCards projects={projects} />
      </div>

      {/* GitHub Activity Dashboard Section */}
      <ProjectsSectionHeader
        title='GitHub Activity Dashboard'
        className='mt-20'
      />

      {/* GitHub Stats Overview with Suspense */}
      <Suspense fallback={<GitHubStatsSkeleton />}>
        <GitHubStatsSection />
      </Suspense>

      {/* Main GitHub Dashboard with Suspense */}
      <Suspense fallback={<GitHubDashboardSkeleton />}>
        <GitHubDashboardSection />
      </Suspense>
    </>
  );
}
