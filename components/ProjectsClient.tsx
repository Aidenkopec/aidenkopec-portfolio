'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import Image from 'next/image';
import { github } from '../public/assets';
import { fadeIn, textVariant } from '../utils';
import { styles } from '../styles';
import {
  formatCommitMessage,
  getContributionColor,
  type GitHubData,
  type ContributionCalendar,
} from '../lib/github-utils';

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
  source_code_link: string;
}

interface ProjectCardProps extends Project {
  index: number;
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
  tags,
  image,
  source_code_link,
}) => {
  const handleSourceClick = (): void => {
    window.open(source_code_link, '_blank');
  };

  return (
    <motion.div
      variants={fadeIn('up', 'spring', index * 0.1, 0.75) as any}
      className="flex flex-col"
    >
      <Tilt
        tiltMaxAngleX={25}
        tiltMaxAngleY={25}
        scale={1.02}
        transitionSpeed={450}
        className="bg-tertiary p-5 rounded-2xl w-full h-full flex flex-col border-2 border-[var(--tertiary-color)] hover:border-[var(--text-color-variable)] transition-colors duration-300"
      >
        <div className="relative w-full h-[200px]">
          <Image
            src={image}
            alt={`${name} project screenshot`}
            fill
            className="object-cover rounded-xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
            <div
              onClick={handleSourceClick}
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 transition-transform"
            >
              <Image
                src={github}
                alt="source code"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold text-[20px] mb-2">{name}</h3>
            <p className="text-secondary text-[14px] leading-[22px]">
              {description}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <p
                key={`${name}-${tag.name}`}
                className={`text-[12px] px-3 py-1.5 rounded-full border border-gray-500 bg-gray-800/50 backdrop-blur-sm ${tag.color}`}
              >
                #{tag.name}
              </p>
            ))}
          </div>
        </div>
      </Tilt>
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
    className="flex-1 min-w-[160px]"
  >
    <Tilt
      tiltMaxAngleX={15}
      tiltMaxAngleY={15}
      scale={1.02}
      transitionSpeed={450}
      className="bg-tertiary p-4 rounded-xl border border-tertiary hover:border-[var(--text-color-variable)] transition-colors duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-white text-xl font-bold">
          {loading ? (
            <div className="w-6 h-6 bg-gray-600 animate-pulse rounded"></div>
          ) : (
            value
          )}
        </div>
        {icon && (
          <div className="text-[var(--text-color-variable)] text-lg">
            {icon}
          </div>
        )}
      </div>
      <p className="text-secondary text-xs font-medium">{title}</p>
    </Tilt>
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

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const newYear = e.target.value;
    setSelectedYear(newYear);
    onYearChange(newYear);
  };

  const showTooltip = (
    event: React.MouseEvent,
    content: string,
    date: string
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
      <div className="bg-tertiary p-4 rounded-xl border border-tertiary">
        <h4 className="text-white font-semibold text-[16px] mb-4">
          Contribution Activity
        </h4>
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--text-color-variable)]"></div>
        </div>
      </div>
    );
  }

  const weeks = commitCalendar?.weeks || [];
  const total = commitCalendar?.totalContributions || 0;

  // Generate month labels
  const monthLabels: { label: string; span: number }[] = [];
  if (weeks.length > 0) {
    let currentMonth: string | null = null;
    let startWeek = 0;
    weeks.forEach((week, index) => {
      if (
        'contributionDays' in week &&
        week.contributionDays &&
        week.contributionDays.length > 0
      ) {
        const firstDay = new Date(week.contributionDays[0].date);
        const monthName = firstDay.toLocaleString('default', {
          month: 'short',
        });
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
      className="bg-tertiary p-4 rounded-xl border border-tertiary hover:border-[var(--text-color-variable)] transition-colors duration-300"
      style={{ position: 'relative', overflow: 'visible' }}
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-secondary font-semibold text-[16px]">
          {total} contributions in{' '}
          {selectedYear === 'last' ? 'the last year' : selectedYear}
        </h4>
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="bg-black-100 text-secondary border border-tertiary hover:border-[var(--text-color-variable)] rounded px-2 py-1 text-sm cursor-pointer transition-colors"
        >
          <option value="last">Last year</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {weeks.length > 0 ? (
        <div className="w-full">
          {/* Month Labels */}
          <div className="overflow-x-auto scrollbar-hide">
            <div
              className="min-w-fit mx-auto py-6"
              style={{ width: 'max-content' }}
            >
              <div className="flex mb-2 text-xs text-secondary justify-start pl-6">
                {monthLabels.map(({ label, span }, i) => (
                  <div
                    key={i}
                    className="text-center flex-shrink-0"
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
              <div className="flex mb-3">
                {/* Day of week labels */}
                <div className="flex flex-col gap-[2px] mr-2 text-xs text-secondary justify-start pt-1">
                  <div className="h-3 text-[10px] leading-3">Mon</div>
                  <div className="h-3 text-[10px] leading-3"></div>
                  <div className="h-3 text-[10px] leading-3">Wed</div>
                  <div className="h-3 text-[10px] leading-3"></div>
                  <div className="h-3 text-[10px] leading-3">Fri</div>
                  <div className="h-3 text-[10px] leading-3"></div>
                  <div className="h-3 text-[10px] leading-3">Sun</div>
                </div>

                {/* Contribution Grid */}
                <div className="flex gap-[2px]">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[2px]">
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

                            const date = new Date(day.date);
                            const formattedDate = date.toLocaleDateString(
                              'en-US',
                              {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            );

                            return (
                              <motion.div
                                key={`${weekIndex}-${dayIndex}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  duration: 0.2,
                                  delay: (weekIndex * 7 + dayIndex) * 0.001,
                                }}
                                className="w-3 h-3 rounded-[2px] cursor-pointer hover:ring-2 hover:ring-[var(--text-color-variable)] hover:ring-opacity-50 transition-all duration-200 hover:scale-110"
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
                                    formattedDate
                                  )
                                }
                                onMouseLeave={hideTooltip}
                              ></motion.div>
                            );
                          })
                        : week.map((day, dayIndex) => {
                            const date = new Date(day.date);
                            const formattedDate = date.toLocaleDateString(
                              'en-US',
                              {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            );

                            return (
                              <motion.div
                                key={`${weekIndex}-${dayIndex}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  duration: 0.2,
                                  delay: (weekIndex * 7 + dayIndex) * 0.001,
                                }}
                                className="w-3 h-3 rounded-[2px] cursor-pointer hover:ring-2 hover:ring-[var(--text-color-variable)] hover:ring-opacity-50 transition-all duration-200 hover:scale-110"
                                style={{
                                  backgroundColor: getContributionColor(
                                    day.level
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
                                    formattedDate
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
              <div className="flex items-center justify-between text-xs text-secondary mt-4">
                <div className="text-[11px] opacity-75">
                  Contribution levels
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px]">Less</span>
                    <div className="flex gap-1">
                      {[
                        { level: 0, label: 'None', range: '0' },
                        { level: 1, label: 'Low', range: '1-3' },
                        { level: 2, label: 'Medium', range: '4-6' },
                        { level: 3, label: 'High', range: '7-9' },
                        { level: 4, label: 'Very High', range: '10+' },
                      ].map(({ level, label, range }) => (
                        <div
                          key={level}
                          className="w-3 h-3 rounded-[2px] cursor-help transition-transform hover:scale-125"
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
                    <span className="text-[11px]">More</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-secondary py-4 text-sm">
          No contribution data available
        </div>
      )}

      {/* Fixed Position Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed pointer-events-none z-[99999] transition-opacity duration-200"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-2xl border border-gray-600 whitespace-nowrap">
            <div className="font-medium text-white">{tooltip.content}</div>
            <div className="text-gray-300 text-[11px]">{tooltip.date}</div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black text-white p-2 text-xs z-[100000] rounded">
          Tooltip: {tooltip.visible ? 'visible' : 'hidden'} | Content:{' '}
          {tooltip.content}
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
  return (
    <>
      {projects.map((project: Project, index: number) => (
        <ProjectCard key={`project-${index}`} index={index} {...project} />
      ))}
    </>
  );
};

export const GitHubStats: React.FC<{ githubData: GitHubData }> = ({
  githubData,
}) => {
  const loading = false; // Data is already loaded on server

  return (
    <div className="mt-8 mb-12 flex flex-wrap gap-4 justify-center">
      <StatCard
        title="Public Repositories"
        value={githubData.user?.public_repos || '---'}
        icon="📚"
        index={0}
        loading={loading}
      />
      <StatCard
        title="Total Stars"
        value={githubData.stats.totalStars}
        icon="⭐"
        index={1}
        loading={loading}
      />
      <StatCard
        title="Followers"
        value={githubData.user?.followers || '---'}
        icon="👥"
        index={2}
        loading={loading}
      />
      <StatCard
        title="Years Active"
        value={githubData.stats.contributionYears || '---'}
        icon="📅"
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
  const [selectedYear, setSelectedYear] = useState<string>('last');
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
    <div className="grid grid-cols-1 gap-8 mb-12">
      {/* Full Width - Contribution Graph */}
      <motion.div
        variants={fadeIn('up', 'spring', 0.3, 0.75) as any}
        className="w-full"
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
        className="w-full"
      >
        <Tilt
          tiltMaxAngleX={15}
          tiltMaxAngleY={15}
          scale={1.02}
          transitionSpeed={450}
          className="bg-tertiary p-4 rounded-xl border border-tertiary hover:border-[var(--text-color-variable)] transition-colors duration-300"
        >
          <h4 className="text-white font-semibold text-[16px] mb-4">
            Recent Commits
          </h4>

          {githubData.commits && githubData.commits.length > 0 ? (
            <div className="space-y-3">
              {githubData.commits.slice(0, 5).map((commit, index) => (
                <motion.div
                  key={`${commit.sha || commit.date}-${index}`}
                  variants={fadeIn('up', 'spring', index * 0.1, 0.75) as any}
                  className="p-3 bg-black-100 rounded-lg border border-tertiary hover:border-[var(--text-color-variable)] transition-colors duration-300"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-white text-sm font-medium truncate">
                      {formatCommitMessage(commit.message, 50)}
                    </span>
                    <span className="text-[var(--text-color-variable)] text-xs font-mono bg-tertiary px-2 py-1 rounded">
                      {commit.sha.substring(0, 7)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-secondary">
                    <span className="flex items-center gap-1">
                      📁 {commit.repo}
                    </span>
                    <span className="flex items-center gap-1">
                      📅 {new Date(commit.date).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-secondary py-4 text-sm">
              No recent commits found
            </div>
          )}
        </Tilt>
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
    <div className="w-full flex">
      <motion.p
        variants={fadeIn('up', 'spring', 0.1, 1) as any}
        className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
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
      <h3 className="text-white font-bold text-[24px] mb-8">{title}</h3>
    </motion.div>
  );
};
