import { Suspense } from 'react';

import SectionWrapper from '../hoc/SectionWrapper';
import { getGitHubData } from '../lib/github-service';

import {
  GitHubActivityHeader,
  GitHubDashboard,
  GitHubStats,
} from './GitHubActivityClient';

const GitHubStatsSkeleton = () => (
  <div
    role='status'
    aria-live='polite'
    className='mt-8 mb-12 flex flex-wrap justify-center gap-4'
  >
    <span className='sr-only'>Loading GitHub stats</span>
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
  <div
    role='status'
    aria-live='polite'
    className='mb-12 grid grid-cols-1 gap-8'
  >
    <span className='sr-only'>Loading GitHub activity</span>
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

// Rendered instead of fabricating zeros when GitHub is unreachable.
function GitHubUnavailable() {
  return (
    <div className='rounded-2xl border border-[var(--black-100)] bg-[var(--tertiary-color)] p-8 text-center'>
      <p className='text-lg font-semibold text-secondary'>
        GitHub activity is temporarily unavailable
      </p>
      <p className='mt-2 text-sm text-secondary/70'>
        The data could not be loaded right now. Please check back shortly.
      </p>
    </div>
  );
}

// Both sections await the same cached snapshot, so a cold render fans out to
// GitHub once rather than twice and the two halves cannot disagree.
async function GitHubStatsSection() {
  const result = await getGitHubData();

  if (!result.ok) return <GitHubUnavailable />;

  return <GitHubStats githubData={result.data} />;
}

async function GitHubDashboardSection() {
  const result = await getGitHubData();

  if (!result.ok) return <GitHubUnavailable />;

  return <GitHubDashboard githubData={result.data} />;
}

const GitHubActivity: React.FC = () => {
  return (
    <SectionWrapper idName='github' label='GitHub activity'>
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
