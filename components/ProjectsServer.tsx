import { Suspense } from 'react';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { projects } from '../constants';
import { 
  getGitHubData, 
  preloadGitHubData 
} from '../lib/github-service';
import { 
  ProjectCards, 
  GitHubStats, 
  GitHubDashboard,
  ProjectsHeader,
  ProjectsDescription,
  ProjectsSectionHeader
} from './ProjectsClient';

const GitHubStatsSkeleton = () => (
  <div className="mt-8 mb-12 flex flex-wrap gap-4 justify-center">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex-1 min-w-[160px]">
        <div className="bg-tertiary p-4 rounded-xl border border-tertiary">
          <div className="flex items-center justify-between mb-2">
            <div className="w-6 h-6 bg-gray-600 animate-pulse rounded"></div>
            <div className="w-6 h-6 bg-gray-600 animate-pulse rounded"></div>
          </div>
          <div className="w-16 h-3 bg-gray-600 animate-pulse rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

const GitHubDashboardSkeleton = () => (
  <div className="grid grid-cols-1 gap-8 mb-12">
    <div className="w-full bg-tertiary p-4 rounded-xl border border-tertiary">
      <div className="h-6 w-48 bg-gray-600 animate-pulse rounded mb-4"></div>
      <div className="h-32 bg-gray-600 animate-pulse rounded"></div>
    </div>
    <div className="flex flex-col lg:flex-row gap-8">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex-1 bg-tertiary p-4 rounded-xl border border-tertiary">
          <div className="h-6 w-32 bg-gray-600 animate-pulse rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="h-16 bg-gray-600 animate-pulse rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Server Component with 'use cache' directive for Next.js 15.4.6
async function GitHubStatsSection() {
  'use cache'
  cacheTag('github-stats')

  const githubData = await getGitHubData();
  
  return (
    <GitHubStats 
      githubData={githubData}
    />
  );
}

async function GitHubDashboardSection() {
  'use cache'
  cacheTag('github-dashboard')

  const githubData = await getGitHubData();
  
  return (
    <GitHubDashboard 
      githubData={githubData}
    />
  );
}

// Main Projects Server Component
export default async function ProjectsServer() {
  'use cache'
  cacheTag('projects-page')
  
  // Preload GitHub data for better performance
  preloadGitHubData();

  return (
    <>
      {/* Header Section */}
      <ProjectsHeader />
      <ProjectsDescription />

      {/* Featured Projects Section */}
      <ProjectsSectionHeader title="Featured Projects" className="mt-16" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-20">
        <ProjectCards projects={projects} />
      </div>

      {/* GitHub Activity Dashboard Section */}
      <ProjectsSectionHeader title="GitHub Activity Dashboard" className="mt-20" />

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