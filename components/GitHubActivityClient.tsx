'use client';

import { motion } from 'framer-motion';
import { DateTime } from 'luxon';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

import { GITHUB_URL } from '../constants';
import {
  formatCommitMessage,
  getContributionColor,
  type ContributionCalendar,
  type GitHubData,
} from '../lib/github-utils';
import { github } from '../public/assets';
import { styles } from '../styles';
import { fadeIn, textVariant } from '../utils';

// Types for component props
interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  index: number;
  loading: boolean;
}

interface CommitGraphProps {
  commitCalendar: ContributionCalendar | null;
  loading: boolean;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  availableYears: (string | number)[];
  onYearChange: (year: string) => void;
}

interface TooltipData {
  content: string;
  date: string;
  x: number;
  y: number;
  visible: boolean;
}

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
    <div className='transform-gpu rounded-xl border border-tertiary bg-tertiary p-4 transition-all duration-300 hover:scale-[1.02] hover:border-[var(--text-color-variable)]'>
      <div className='mb-2 flex items-center justify-between'>
        <div className='text-xl font-bold text-secondary'>
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
      <p className='text-xs font-medium text-secondary'>{title}</p>
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
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleYearChange = (year: string): void => {
    setSelectedYear(year);
    onYearChange(year);
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside, or on Escape.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setDropdownOpen(false);
      // Escape leaves focus where it was, which is inside a subtree about to
      // unmount, so hand it back to the trigger.
      triggerRef.current?.focus();
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
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
      <div className='rounded-xl border border-tertiary bg-tertiary p-4'>
        <h4 className='mb-4 text-[16px] font-semibold text-secondary'>
          Contribution Activity
        </h4>
        <div className='flex items-center justify-center p-4'>
          <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-[var(--text-color-variable)]'></div>
        </div>
      </div>
    );
  }

  const weeks = commitCalendar?.weeks ?? [];

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
      className='rounded-xl border border-tertiary bg-tertiary p-4 transition-colors duration-300 hover:border-[var(--text-color-variable)]'
      style={{ position: 'relative', overflow: 'visible' }}
    >
      <div className='mb-4 flex items-center justify-between'>
        <h4 className='text-[16px] font-semibold text-secondary'>
          {commitCalendar
            ? `${commitCalendar.totalContributions} contributions in ${
                selectedYear === 'last' ? 'the last year' : selectedYear
              }`
            : 'Contribution Activity'}
        </h4>

        {/* Custom Year Dropdown */}
        <div className='relative' ref={dropdownRef}>
          <button
            ref={triggerRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-label='Filter contributions by year'
            className='flex items-center justify-between gap-1.5 rounded-md border border-tertiary bg-black-100 px-2.5 py-1.5 text-xs font-medium text-secondary transition-all duration-150 hover:border-[var(--text-color-variable)] hover:bg-[var(--text-color-variable)]/5 sm:px-3 sm:py-2 sm:text-sm'
          >
            <span className='flex items-center gap-1.5 text-[11px] sm:text-sm'>
              <span aria-hidden='true'>📅</span>{' '}
              {selectedYear === 'last' ? 'Last year' : selectedYear}
            </span>
            <span
              className={`chevron block scale-75 transition-transform duration-150 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className='absolute top-full right-0 z-20 mt-1.5 min-w-[120px] overflow-hidden rounded-md border border-tertiary bg-black-100 shadow-lg shadow-black/30 sm:min-w-[140px]'>
              <div className='py-0.5'>
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearChange(year.toString())}
                    aria-pressed={selectedYear === year.toString()}
                    className={`w-full px-3 py-2 text-left text-xs font-medium text-secondary transition-colors duration-150 hover:bg-[var(--text-color-variable)]/10 hover:text-secondary sm:px-4 sm:py-2.5 sm:text-sm ${
                      selectedYear === year.toString()
                        ? 'bg-[var(--text-color-variable)]/20 text-[var(--text-color-variable)]'
                        : ''
                    }`}
                  >
                    <span className='flex items-center gap-1.5 sm:gap-2'>
                      <span
                        aria-hidden='true'
                        className='text-[10px] sm:text-xs'
                      >
                        📅
                      </span>
                      <span className='text-[11px] sm:text-sm'>
                        {year === 'last' ? 'Last year' : year}
                      </span>
                      {selectedYear === year.toString() && (
                        <span
                          aria-hidden='true'
                          className='ml-auto text-[10px] text-[var(--text-color-variable)] sm:text-xs'
                        >
                          ✓
                        </span>
                      )}
                    </span>
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
              <div className='mb-2 flex justify-start pl-6 text-xs text-secondary'>
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
                <div className='mr-2 flex flex-col justify-start gap-[2px] pt-1 text-xs text-secondary'>
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
              <div className='mt-4 flex items-center justify-between text-xs text-secondary'>
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
                          role='img'
                          aria-label={`${label}: ${range} contributions`}
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
        <div className='py-4 text-center text-sm text-secondary'>
          {commitCalendar
            ? 'No contributions in this period'
            : 'Contribution data is unavailable right now'}
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
          <div className='rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-xs whitespace-nowrap text-secondary shadow-2xl'>
            <div className='font-medium text-secondary'>{tooltip.content}</div>
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
        title='Years on GitHub'
        value={githubData.stats.yearsOnGitHub ?? '---'}
        icon='📅'
        index={3}
        loading={loading}
      />
    </div>
  );
};

// GitHub Link Component
const GitHubLink: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={GITHUB_URL}
      target='_blank'
      rel='noopener noreferrer'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group flex items-center gap-2 rounded-lg border border-[var(--black-100)] bg-gradient-to-r from-[var(--tertiary-color)] to-[var(--black-100)] px-4 py-2 transition-all duration-300 hover:scale-105 hover:border-[var(--text-color-variable)] hover:shadow-[var(--text-color-variable)]/20 hover:shadow-lg`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Image
        src={github}
        alt='GitHub'
        width={16}
        height={16}
        className={`transition-transform duration-300 ${isHovered ? 'scale-110 rotate-12' : ''}`}
      />
      <span
        className={`text-sm font-medium transition-colors duration-300 ${isHovered ? 'text-[var(--text-color-variable)]' : 'text-[var(--secondary-color)]'}`}
      >
        View GitHub
      </span>
      <div
        className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
      >
        ↗
      </div>
    </motion.a>
  );
};

export const GitHubDashboard: React.FC<{ githubData: GitHubData }> = ({
  githubData,
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<string>('last');
  const [contributionData, setContributionData] =
    useState<ContributionCalendar | null>(githubData.commitCalendar);
  const [loading, setLoading] = useState(false);
  const availableYears = [
    'last',
    currentYear,
    currentYear - 1,
    currentYear - 2,
  ];

  const fetchContributionData = async (year: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/github?year=${year}`);
      if (response.ok) {
        const data = await response.json();
        setContributionData(data.commitCalendar ?? null);
      } else {
        // `selectedYear` has already moved, so keeping the old calendar would
        // render last year's grid under this year's heading.
        setContributionData(null);
      }
    } catch (error) {
      console.error('Error fetching contribution data:', error);
      setContributionData(null);
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

      {/* Open Source Activity Section */}
      <motion.div
        variants={fadeIn('up', 'spring', 0.4, 0.75) as any}
        className='w-full'
      >
        <div className='transform-gpu rounded-xl border border-tertiary bg-tertiary p-4 transition-all duration-300 hover:scale-[1.02] hover:border-[var(--text-color-variable)]'>
          <h4 className='mb-4 text-[16px] font-semibold text-secondary'>
            Open Source Activity
          </h4>

          {githubData.commits && githubData.commits.length > 0 ? (
            <div className='space-y-3'>
              {githubData.commits.slice(0, 5).map((commit, index) => (
                <motion.div
                  key={`${commit.sha || commit.date}-${index}`}
                  variants={fadeIn('up', 'spring', index * 0.1, 0.75) as any}
                  className='rounded-lg border border-tertiary bg-black-100 p-3 transition-colors duration-300 hover:border-[var(--text-color-variable)]'
                >
                  <div className='mb-1 flex items-center gap-3'>
                    <span className='truncate text-sm font-medium text-secondary'>
                      {formatCommitMessage(commit.message, 50)}
                    </span>
                    <span className='rounded bg-tertiary px-2 py-1 font-mono text-xs text-[var(--text-color-variable)]'>
                      {commit.sha.substring(0, 7)}
                    </span>
                  </div>
                  <div className='flex items-center gap-4 text-xs text-secondary'>
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
            <div className='py-4 text-center text-sm text-secondary'>
              No recent public commits - see contribution graph above for full
              activity
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export const GitHubActivityHeader: React.FC = () => {
  return (
    <motion.div variants={textVariant() as any}>
      <div className='mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className={`${styles.sectionSubText}`}>Measured, not estimated</p>
          <h2 className={`${styles.sectionHeadText}`}>GitHub Activity.</h2>
        </div>
        <GitHubLink />
      </div>
    </motion.div>
  );
};
