import { cacheTag } from 'next/cache';
import { Suspense } from 'react';

import SectionWrapper from '../hoc/SectionWrapper';
import { getGitHubData, preloadGitHubData } from '../lib/github-service';

import {
  GitHubActivityHeader,
  GitHubDashboard,
  GitHubStats,
} from './GitHubActivityClient';

const GitHubStatsSkeleton = () => (
  <div className='mt-8 mb-12 flex flex-wrap justify-center gap-4'>
    {[...Array(4)].map((_, i) => (
      <div key={i} className='min-w-[160px] flex-1'>
        <div className='rounded-xl border border-tertiary bg-tertiary p-4'>
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
    <div className='w-full rounded-xl border border-tertiary bg-tertiary p-4'>
      <div className='mb-4 h-6 w-48 animate-pulse rounded bg-gray-600'></div>
      <div className='h-32 animate-pulse rounded bg-gray-600'></div>
    </div>
    <div className='flex flex-col gap-8 lg:flex-row'>
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className='flex-1 rounded-xl border border-tertiary bg-tertiary p-4'
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

const GitHubActivity: React.FC = () => {
  // Preload GitHub data for better performance
  preloadGitHubData();

  return (
    <SectionWrapper idName='github'>
      <GitHubActivityHeader />

      <Suspense fallback={<GitHubStatsSkeleton />}>
        <GitHubStatsSection />
      </Suspense>

      <Suspense fallback={<GitHubDashboardSkeleton />}>
        <GitHubDashboardSection />
      </Suspense>
    </SectionWrapper>
  );
};

export default GitHubActivity;
