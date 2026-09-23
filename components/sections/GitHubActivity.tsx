import { Suspense } from 'react';

import SectionWrapper from '@/components/layout/SectionWrapper';
import { getGitHubData } from '@/lib/github-service';

import {
  GitHubActivityHeader,
  GitHubDashboard,
  GitHubStats,
} from './GitHubActivityClient';

const GitHubStatsSkeleton = () => (
  <div
    role='status'
    aria-live='polite'
    className='mt-12 grid grid-cols-2 gap-y-8 border-t border-[var(--chart-faint)] pt-8 md:grid-cols-4'
  >
    <span className='sr-only'>Loading GitHub stats</span>
    {[...Array(4)].map((_, i) => (
      <div key={i} className='space-y-3'>
        <div className='h-12 w-20 animate-pulse rounded bg-white-100/5' />
        <div className='h-3 w-28 animate-pulse rounded bg-white-100/5' />
      </div>
    ))}
  </div>
);

const GitHubDashboardSkeleton = () => (
  <div role='status' aria-live='polite' className='mt-16 space-y-6'>
    <span className='sr-only'>Loading GitHub activity</span>
    <div className='h-7 w-64 animate-pulse rounded bg-white-100/5' />
    <div className='h-[118px] animate-pulse rounded-lg bg-white-100/5' />
    <div className='h-4 w-1/2 animate-pulse rounded bg-white-100/5' />
  </div>
);

// Rendered instead of fabricating zeros when GitHub is unreachable.
function GitHubUnavailable() {
  return (
    <div className='mt-12 border-t border-[var(--chart-faint)] pt-8'>
      <p className='text-[17px] text-white-100'>
        GitHub activity is unavailable right now.
      </p>
      <p className='mt-2 text-sm text-white-100/60'>
        The GitHub API did not respond. This section fills in again on the next
        refresh.
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
