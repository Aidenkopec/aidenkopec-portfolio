'use client';

import { motion } from 'framer-motion';
import { DateTime } from 'luxon';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

import { Marquee } from './magicui/marquee';

import {
  formatCommitMessage,
  getContributionColor,
  type ContributionCalendar,
  type GitHubData,
} from '../lib/github-utils';
import { github } from '../public/assets';
import globe from '../public/assets/globe.svg';
import { styles } from '../styles';
import { fadeIn, textVariant } from '../utils';

// Types for component props
interface ProjectTag {
  name: string;
  color: string;
}

interface Project {
  name: string;
  description: string;
  tags: ProjectTag[];
  image: any;
  link: string;
  isGitHub: boolean;
}

interface ProjectCardProps {
  index: number;
  name: string;
  description: string;
  image: any;
  link: string;
  isGitHub: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  index: number;
  loading: boolean;
}

interface CommitGraphProps {
  commitCalendar?: ContributionCalendar;
  loading: boolean;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  availableYears: number[];
  onYearChange: (year: string) => void;
}

interface TooltipData {
  content: string;
  date: string;
  x: number;
  y: number;
  visible: boolean;
}

// Project Card Component
const ProjectCard: React.FC<ProjectCardProps> = ({
  index,
  name,
  description,
  image,
  link,
  isGitHub,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleSourceClick = (): void => {
    window.open(link, '_blank');
  };

  return (
    <motion.div
      variants={fadeIn('up', 'spring', index * 0.1, 0.75) as any}
      className='relative'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative h-[230px] w-full transform-gpu overflow-hidden rounded-xl border border-[var(--black-100)] bg-gradient-to-br from-[var(--tertiary-color)] via-[var(--black-100)] to-[var(--tertiary-color)] p-[1px] transition-all duration-300 ${isHovered ? 'scale-[1.02] shadow-[var(--text-color-variable)]/20 shadow-lg' : ''}`}
      >
        {/* Gradient border effect */}
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--text-color-variable)]/20 via-transparent to-[var(--text-color-variable)]/20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Main card content */}
        <div className='relative h-full w-full rounded-xl bg-[var(--tertiary-color)] p-3'>
          {/* Image section */}
          <div className='relative mb-3 h-[80px] w-full overflow-hidden rounded-lg'>
            <Image
              src={image}
              alt={`${name} project screenshot`}
              fill
              className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : ''}`}
              sizes='(max-width: 768px) 100vw, 240px'
            />

            {/* Gradient overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

            {/* Icon button - GitHub or Website */}
            <div className='absolute top-2 right-2'>
              <div
                onClick={handleSourceClick}
                className='flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/80 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-[var(--text-color-variable)]'
              >
                <Image
                  src={isGitHub ? github : globe}
                  alt={isGitHub ? 'source code' : 'visit website'}
                  width={12}
                  height={12}
                  className='object-contain'
                />
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className='flex h-[calc(100%-104px)] flex-col justify-center'>
            <div>
              <h3
                className={`mb-2 line-clamp-1 text-[16px] font-bold transition-colors duration-300 ${isHovered ? 'text-[var(--text-color-variable)]' : 'text-[var(--white-100)]'}`}
              >
                {name}
              </h3>
              <p className='line-clamp-3 text-[12px] leading-[16px] text-[var(--secondary-color)]/80'>
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// GitHub Stats Card Component
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  index,
  loading,
}) => (
  <motion.div
    variants={fadeIn('up', 'spring', index * 0.1, 0.75) as any}
    className='min-w-[160px] flex-1'
  >
    <div className='bg-tertiary border-tertiary transform-gpu rounded-xl border p-4 transition-all duration-300 hover:scale-[1.02] hover:border-[var(--text-color-variable)]'>
      <div className='mb-2 flex items-center justify-between'>
        <div className='text-secondary text-xl font-bold'>
          {loading ? (
            <div className='h-6 w-6 animate-pulse rounded bg-gray-600'></div>
          ) : (
            value
          )}
        </div>
        {icon && (
          <div className='text-lg text-[var(--text-color-variable)]'>
            {icon}
          </div>
        )}
      </div>
      <p className='text-secondary text-xs font-medium'>{title}</p>
    </div>
  </motion.div>
);

// Commit Graph Component
const CommitGraph: React.FC<CommitGraphProps> = ({
  commitCalendar,
  loading,
  selectedYear,
  setSelectedYear,
  availableYears,
  onYearChange,
}) => {
  const [tooltip, setTooltip] = useState<TooltipData>({
    content: '',
    date: '',
    x: 0,
    y: 0,
    visible: false,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleYearChange = (year: string): void => {
    setSelectedYear(year);
    onYearChange(year);
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const showTooltip = (
    event: React.MouseEvent,
    content: string,
    date: string,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    // Use viewport coordinates for fixed positioning
    const x = rect.left + rect.width / 2;
    const y = rect.top - 10; // 10px above the element

    setTooltip({
      content,
      date,
      x,
      y,
      visible: true,
    });
  };

  const hideTooltip = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  if (loading) {
    return (
      <div className='bg-tertiary border-tertiary rounded-xl border p-4'>
        <h4 className='text-secondary mb-4 text-[16px] font-semibold'>
          Contribution Activity
        </h4>
        <div className='flex items-center justify-center p-4'>
          <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-[var(--text-color-variable)]'></div>
        </div>
      </div>
    );
  }

  const weeks = commitCalendar?.weeks || [];
  const total = commitCalendar?.totalContributions || 0;

  // Generate month labels using Luxon for proper Jan-Dec ordering
  const monthLabels: { label: string; span: number }[] = [];
  if (weeks.length > 0) {
    let currentMonth: string | null = null;
    let startWeek = 0;
    weeks.forEach((week, index) => {
      let firstDayOfWeek: string | null = null;

      // Find the first valid day in the week
      if ('contributionDays' in week && week.contributionDays?.length > 0) {
        firstDayOfWeek = week.contributionDays[0].date;
      } else if (Array.isArray(week) && week.length > 0) {
        firstDayOfWeek = week[0].date;
      }

      if (firstDayOfWeek) {
        const firstDay = DateTime.fromISO(firstDayOfWeek);
        const monthName = firstDay.toFormat('MMM'); // Use Luxon's formatting

        if (monthName !== currentMonth) {
          if (currentMonth !== null) {
            monthLabels.push({
              label: currentMonth,
              span: index - startWeek,
            });
          }
          currentMonth = monthName;
          startWeek = index;
        }

        if (index === weeks.length - 1) {
          monthLabels.push({
            label: currentMonth,
            span: index - startWeek + 1,
          });
        }
      }
    });
  }

  return (
    <div
      className='bg-tertiary border-tertiary rounded-xl border p-4 transition-colors duration-300 hover:border-[var(--text-color-variable)]'
      style={{ position: 'relative', overflow: 'visible' }}
    >
      <div className='mb-4 flex items-center justify-between'>
        <h4 className='text-secondary text-[16px] font-semibold'>
          {total} contributions in {selectedYear}
        </h4>

        {/* Custom Year Dropdown */}
        <div className='relative' ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className='bg-black-100 border-tertiary text-secondary flex items-center justify-between gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all duration-150 hover:border-[var(--text-color-variable)] hover:bg-[var(--text-color-variable)]/5 sm:px-3 sm:py-2 sm:text-sm'
          >
            <span className='flex items-center gap-1.5 text-[11px] sm:text-sm'>
              📅 {selectedYear}
            </span>
            <div
              className={`chevron scale-75 transition-transform duration-150 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className='bg-black-100 border-tertiary absolute top-full right-0 z-20 mt-1.5 min-w-[120px] overflow-hidden rounded-md border shadow-lg shadow-black/30 sm:min-w-[140px]'>
              <div className='py-0.5'>
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearChange(year.toString())}
                    className={`text-secondary hover:text-secondary w-full px-3 py-2 text-left text-xs font-medium transition-colors duration-150 hover:bg-[var(--text-color-variable)]/10 sm:px-4 sm:py-2.5 sm:text-sm ${
                      selectedYear === year.toString()
                        ? 'bg-[var(--text-color-variable)]/20 text-[var(--text-color-variable)]'
                        : ''
                    }`}
                  >
                    <div className='flex items-center gap-1.5 sm:gap-2'>
                      <span className='text-[10px] sm:text-xs'>📅</span>
                      <span className='text-[11px] sm:text-sm'>{year}</span>
                      {selectedYear === year.toString() && (
                        <div className='ml-auto text-[10px] text-[var(--text-color-variable)] sm:text-xs'>
                          ✓
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Glowing border effect */}
              <div className='pointer-events-none absolute inset-0 rounded-md border border-[var(--text-color-variable)]/20' />
            </div>
          )}
        </div>
      </div>

      {weeks.length > 0 ? (
        <div className='w-full'>
          {/* Month Labels */}
          <div className='scrollbar-hide overflow-x-auto'>
            <div
              className='mx-auto min-w-fit py-6'
              style={{ width: 'max-content' }}
            >
              <div className='text-secondary mb-2 flex justify-start pl-6 text-xs'>
                {monthLabels.map(({ label, span }, i) => (
                  <div
                    key={i}
                    className='flex-shrink-0 text-center'
                    style={{
                      width: `${span * (12 + 2)}px`, // 12px square + 2px gap
                      minWidth: `${span * (12 + 2)}px`,
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Day Labels */}
              <div className='mb-3 flex'>
                {/* Day of week labels */}
                <div className='text-secondary mr-2 flex flex-col justify-start gap-[2px] pt-1 text-xs'>
                  <div className='h-3 text-[10px] leading-3'></div>
                  <div className='h-3 text-[10px] leading-3'>Mon</div>
                  <div className='h-3 text-[10px] leading-3'></div>
                  <div className='h-3 text-[10px] leading-3'>Wed</div>
                  <div className='h-3 text-[10px] leading-3'></div>
                  <div className='h-3 text-[10px] leading-3'>Fri</div>
                  <div className='h-3 text-[10px] leading-3'></div>
                </div>

                {/* Contribution Grid */}
                <div className='flex gap-[2px]'>
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className='flex flex-col gap-[2px]'>
                      {'contributionDays' in week
                        ? week.contributionDays.map((day, dayIndex) => {
                            const contributionLevel =
                              day.contributionCount === 0
                                ? 0
                                : day.contributionCount <= 3
                                  ? 1
                                  : day.contributionCount <= 6
                                    ? 2
                                    : day.contributionCount <= 9
                                      ? 3
                                      : 4;

                            const date = DateTime.fromISO(day.date);
                            const formattedDate = date.toLocaleString({
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            });

                            return (
                              <motion.div
                                key={`${weekIndex}-${dayIndex}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  duration: 0.2,
                                  delay: (weekIndex * 7 + dayIndex) * 0.001,
                                }}
                                className='hover:ring-opacity-50 h-3 w-3 cursor-pointer rounded-[2px] transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-[var(--text-color-variable)]'
                                style={{
                                  backgroundColor:
                                    getContributionColor(contributionLevel),
                                }}
                                onMouseEnter={(e) =>
                                  showTooltip(
                                    e,
                                    day.contributionCount === 0
                                      ? 'No contributions'
                                      : `${day.contributionCount} contribution${
                                          day.contributionCount !== 1 ? 's' : ''
                                        }`,
                                    formattedDate,
                                  )
                                }
                                onMouseLeave={hideTooltip}
                              ></motion.div>
                            );
                          })
                        : week.map((day, dayIndex) => {
                            const date = DateTime.fromISO(day.date);
                            const formattedDate = date.toLocaleString({
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            });

                            return (
                              <motion.div
                                key={`${weekIndex}-${dayIndex}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  duration: 0.2,
                                  delay: (weekIndex * 7 + dayIndex) * 0.001,
                                }}
                                className='hover:ring-opacity-50 h-3 w-3 cursor-pointer rounded-[2px] transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-[var(--text-color-variable)]'
                                style={{
                                  backgroundColor: getContributionColor(
                                    day.level,
                                  ),
                                }}
                                onMouseEnter={(e) =>
                                  showTooltip(
                                    e,
                                    day.count === 0
                                      ? 'No contributions'
                                      : `${day.count} contribution${
                                          day.count !== 1 ? 's' : ''
                                        }`,
                                    formattedDate,
                                  )
                                }
                                onMouseLeave={hideTooltip}
                              ></motion.div>
                            );
                          })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Legend */}
              <div className='text-secondary mt-4 flex items-center justify-between text-xs'>
                <div className='text-[11px] opacity-75'>
                  Contribution levels
                </div>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center gap-1'>
                    <span className='text-[11px]'>Less</span>
                    <div className='flex gap-1'>
                      {[
                        { level: 0, label: 'None', range: '0' },
                        { level: 1, label: 'Low', range: '1-3' },
                        { level: 2, label: 'Medium', range: '4-6' },
                        { level: 3, label: 'High', range: '7-9' },
                        { level: 4, label: 'Very High', range: '10+' },
                      ].map(({ level, label, range }) => (
                        <div
                          key={level}
                          className='h-3 w-3 cursor-help rounded-[2px] transition-transform hover:scale-125'
                          style={{
                            backgroundColor: getContributionColor(level),
                          }}
                          onMouseEnter={(e) =>
                            showTooltip(e, label, `${range} contributions`)
                          }
                          onMouseLeave={hideTooltip}
                        ></div>
                      ))}
                    </div>
                    <span className='text-[11px]'>More</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='text-secondary py-4 text-center text-sm'>
          No contribution data available
        </div>
      )}

      {/* Fixed Position Tooltip */}
      {tooltip.visible && (
        <div
          className='pointer-events-none fixed z-[99999] transition-opacity duration-200'
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className='text-secondary rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-xs whitespace-nowrap shadow-2xl'>
            <div className='text-secondary font-medium'>{tooltip.content}</div>
            <div className='text-[11px] text-gray-300'>{tooltip.date}</div>
            {/* Arrow */}
            <div className='absolute top-full left-1/2 -translate-x-1/2 transform border-4 border-transparent border-t-gray-900'></div>
          </div>
        </div>
      )}

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

// Main client components
export const ProjectCards: React.FC<{ projects: Project[] }> = ({
  projects,
}) => {
  // Split projects into two rows
  const firstRow = projects.slice(0, 4);
  const secondRow = projects.slice(4, 8);

  return (
    <div className='relative w-full overflow-hidden'>
      {/* Background gradient effects */}
      <div className='pointer-events-none absolute top-0 left-0 z-10 h-full w-20 bg-gradient-to-r from-[var(--primary-color)] to-transparent' />
      <div className='pointer-events-none absolute top-0 right-0 z-10 h-full w-20 bg-gradient-to-l from-[var(--primary-color)] to-transparent' />

      <div className='space-y-6'>
        {/* First Row - Left to Right */}
        <Marquee
          pauseOnHover
          className='cursor-pointer py-2 [--duration:45s] [--gap:1.5rem]'
        >
          {firstRow.map((project: Project, index: number) => (
            <div
              key={`project-row1-${index}`}
              className='w-[240px] flex-shrink-0 hover:z-10'
            >
              <ProjectCard
                index={index}
                name={project.name}
                description={project.description}
                image={project.image}
                link={project.link}
                isGitHub={project.isGitHub}
              />
            </div>
          ))}
        </Marquee>

        {/* Second Row - Right to Left */}
        <Marquee
          pauseOnHover
          reverse
          className='cursor-pointer py-2 [--duration:45s] [--gap:1.5rem]'
        >
          {secondRow.map((project: Project, index: number) => (
            <div
              key={`project-row2-${index}`}
              className='w-[240px] flex-shrink-0 hover:z-10'
            >
              <ProjectCard
                index={index + 4}
                name={project.name}
                description={project.description}
                image={project.image}
                link={project.link}
                isGitHub={project.isGitHub}
              />
            </div>
          ))}
        </Marquee>
      </div>

      {/* Subtle ambient glow effect */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[var(--text-color-variable)]/[0.02] to-transparent' />
    </div>
  );
};

export const GitHubStats: React.FC<{ githubData: GitHubData }> = ({
  githubData,
}) => {
  const loading = false; // Data is already loaded on server

  return (
    <div className='mt-8 mb-12 flex flex-wrap justify-center gap-4'>
      <StatCard
        title='Public Repositories'
        value={githubData.user?.public_repos || '---'}
        icon='📚'
        index={0}
        loading={loading}
      />
      <StatCard
        title='Total Stars'
        value={githubData.stats.totalStars}
        icon='⭐'
        index={1}
        loading={loading}
      />
      <StatCard
        title='Followers'
        value={githubData.user?.followers || '---'}
        icon='👥'
        index={2}
        loading={loading}
      />
      <StatCard
        title='Years Active'
        value={githubData.stats.contributionYears || '---'}
        icon='📅'
        index={3}
        loading={loading}
      />
    </div>
  );
};

export const GitHubDashboard: React.FC<{ githubData: GitHubData }> = ({
  githubData,
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString(),
  );
  const [contributionData, setContributionData] = useState<
    ContributionCalendar | undefined
  >(githubData.commitCalendar);
  const [loading, setLoading] = useState(false);
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];

  const fetchContributionData = async (year: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/github?year=${year}`);
      if (response.ok) {
        const data = await response.json();
        setContributionData(data.commitCalendar);
      }
    } catch (error) {
      console.error('Error fetching contribution data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mb-12 grid grid-cols-1 gap-8'>
      {/* Full Width - Contribution Graph */}
      <motion.div
        variants={fadeIn('up', 'spring', 0.3, 0.75) as any}
        className='w-full'
      >
        <CommitGraph
          commitCalendar={contributionData}
          loading={loading}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          availableYears={availableYears}
          onYearChange={fetchContributionData}
        />
      </motion.div>

      {/* Recent Commits Section */}
      <motion.div
        variants={fadeIn('up', 'spring', 0.4, 0.75) as any}
        className='w-full'
      >
        <div className='bg-tertiary border-tertiary transform-gpu rounded-xl border p-4 transition-all duration-300 hover:scale-[1.02] hover:border-[var(--text-color-variable)]'>
          <h4 className='text-secondary mb-4 text-[16px] font-semibold'>
            Recent Commits
          </h4>

          {githubData.commits && githubData.commits.length > 0 ? (
            <div className='space-y-3'>
              {githubData.commits.slice(0, 5).map((commit, index) => (
                <motion.div
                  key={`${commit.sha || commit.date}-${index}`}
                  variants={fadeIn('up', 'spring', index * 0.1, 0.75) as any}
                  className='bg-black-100 border-tertiary rounded-lg border p-3 transition-colors duration-300 hover:border-[var(--text-color-variable)]'
                >
                  <div className='mb-1 flex items-center gap-3'>
                    <span className='text-secondary truncate text-sm font-medium'>
                      {formatCommitMessage(commit.message, 50)}
                    </span>
                    <span className='bg-tertiary rounded px-2 py-1 font-mono text-xs text-[var(--text-color-variable)]'>
                      {commit.sha.substring(0, 7)}
                    </span>
                  </div>
                  <div className='text-secondary flex items-center gap-4 text-xs'>
                    <span className='flex items-center gap-1'>
                      📁 {commit.repo}
                    </span>
                    <span className='flex items-center gap-1'>
                      📅 {new Date(commit.date).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className='text-secondary py-4 text-center text-sm'>
              No recent commits found
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Animated Header Components for Client-side rendering
export const ProjectsHeader: React.FC = () => {
  return (
    <motion.div variants={textVariant() as any}>
      <p className={`${styles.sectionSubText}`}>My work & contributions</p>
      <h2 className={`${styles.sectionHeadText}`}>Projects & Code.</h2>
    </motion.div>
  );
};

export const ProjectsDescription: React.FC = () => {
  return (
    <div className='flex w-full'>
      <motion.p
        variants={fadeIn('up', 'spring', 0.1, 1) as any}
        className='text-secondary mt-3 max-w-3xl text-[17px] leading-[30px]'
      >
        Explore my development journey through featured projects and live GitHub
        contributions. From full-stack applications to AI-powered tools, each
        project represents a commitment to quality code and innovative
        solutions. The live GitHub data showcases consistent coding practices,
        diverse technology stack, and collaborative project development.
      </motion.p>
    </div>
  );
};

export const ProjectsSectionHeader: React.FC<{
  title: string;
  className?: string;
}> = ({ title, className = '' }) => {
  return (
    <motion.div variants={textVariant() as any} className={className}>
      <h3 className='text-secondary mb-8 text-[24px] font-bold'>{title}</h3>
    </motion.div>
  );
};
