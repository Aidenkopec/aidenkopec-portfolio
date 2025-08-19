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
  type ContributionCalendar 
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

interface LanguageBarProps {
  language: {
    name: string;
    percentage: number;
    color: string;
  };
  index: number;
}

interface CommitGraphProps {
  commitCalendar?: ContributionCalendar;
  loading: boolean;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  availableYears: number[];
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

// Language Bar Component
const LanguageBar: React.FC<LanguageBarProps> = ({ language, index }) => (
  <motion.div
    variants={fadeIn('right', 'spring', index * 0.1, 0.75) as any}
    className="mb-2"
  >
    <div className="flex justify-between items-center mb-1">
      <span className="text-white text-sm font-medium">{language.name}</span>
      <span className="text-secondary text-xs">{language.percentage}%</span>
    </div>
    <div className="w-full bg-tertiary rounded-full h-1.5">
      <motion.div
        className="h-1.5 rounded-full"
        style={{ backgroundColor: language.color }}
        initial={{ width: 0 }}
        animate={{ width: `${language.percentage}%` }}
        transition={{ duration: 1.5, delay: index * 0.1 }}
      />
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
}) => {
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedYear(e.target.value);
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
    <div className="bg-tertiary p-4 rounded-xl border border-tertiary hover:border-[var(--text-color-variable)] transition-colors duration-300">
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
        <div className="overflow-x-auto">
          <div
            className="flex mb-1 text-xs text-secondary mx-auto"
            style={{ maxWidth: '520px' }}
          >
            {monthLabels.map(({ label, span }, i) => (
              <div key={i} style={{ flex: span }} className="text-center">
                {label}
              </div>
            ))}
          </div>
          <div
            className="flex gap-0.5 mb-3 mx-auto"
            style={{ maxWidth: '520px' }}
          >
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {'contributionDays' in week
                  ? week.contributionDays.map((day, dayIndex) => (
                      <motion.div
                        key={`${weekIndex}-${dayIndex}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          duration: 0.2,
                          delay: (weekIndex * 7 + dayIndex) * 0.001,
                        }}
                        className="rounded-sm cursor-pointer hover:ring-1 hover:ring-[var(--text-color-variable)] transition-all w-[6px] h-[6px] sm:w-2 sm:h-2"
                        style={{
                          backgroundColor: getContributionColor(
                            day.contributionCount === 0
                              ? 0
                              : day.contributionCount <= 3
                              ? 1
                              : day.contributionCount <= 6
                              ? 2
                              : day.contributionCount <= 9
                              ? 3
                              : 4
                          ),
                        }}
                        title={`${day.contributionCount} contributions on ${day.date}`}
                      />
                    ))
                  : week.map((day, dayIndex) => (
                      <motion.div
                        key={`${weekIndex}-${dayIndex}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          duration: 0.2,
                          delay: (weekIndex * 7 + dayIndex) * 0.001,
                        }}
                        className="rounded-sm cursor-pointer hover:ring-1 hover:ring-[var(--text-color-variable)] transition-all w-[6px] h-[6px] sm:w-2 sm:h-2"
                        style={{
                          backgroundColor: getContributionColor(day.level),
                        }}
                        title={`${day.count} contributions on ${day.date}`}
                      />
                    ))}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-secondary max-w-[520px] mx-auto">
            <span>Less</span>
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className="rounded-sm w-[6px] h-[6px] sm:w-2 sm:h-2"
                  style={{ backgroundColor: getContributionColor(level) }}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      ) : (
        <div className="text-center text-secondary py-4 text-sm">
          No contribution data available
        </div>
      )}
    </div>
  );
};

// Main client components
export const ProjectCards: React.FC<{ projects: Project[] }> = ({ projects }) => {
  return (
    <>
      {projects.map((project: Project, index: number) => (
        <ProjectCard key={`project-${index}`} index={index} {...project} />
      ))}
    </>
  );
};

export const GitHubStats: React.FC<{ githubData: GitHubData }> = ({ githubData }) => {
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

export const GitHubDashboard: React.FC<{ githubData: GitHubData }> = ({ githubData }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<string>('last');
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];
  const loading = false; // Data is already loaded on server

  return (
    <div className="grid grid-cols-1 gap-8 mb-12">
      {/* Full Width - Contribution Graph */}
      <motion.div
        variants={fadeIn('up', 'spring', 0.3, 0.75) as any}
        className="w-full"
      >
        <CommitGraph
          commitCalendar={githubData.commitCalendar}
          loading={loading}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          availableYears={availableYears}
        />
      </motion.div>

      {/* Recent Commits and Languages in Flex Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Recent Commits Card */}
        <motion.div
          variants={fadeIn('right', 'spring', 0.4, 0.75) as any}
          className="flex-1"
        >
          <Tilt
            tiltMaxAngleX={15}
            tiltMaxAngleY={15}
            scale={1.02}
            transitionSpeed={450}
            className="bg-tertiary p-4 rounded-xl border border-tertiary hover:border-[var(--text-color-variable)] transition-colors duration-300 h-full"
          >
            <h4 className="text-white font-semibold text-[16px] mb-4">
              Recent Commits
            </h4>

            {githubData.commits && githubData.commits.length > 0 ? (
              <div className="space-y-3">
                {githubData.commits.slice(0, 5).map((commit, index) => (
                  <motion.div
                    key={`${commit.sha || commit.date}-${index}`}
                    variants={
                      fadeIn('up', 'spring', index * 0.1, 0.75) as any
                    }
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

        {/* Programming Languages Card */}
        <motion.div
          variants={fadeIn('left', 'spring', 0.4, 0.75) as any}
          className="flex-1"
        >
          <Tilt
            tiltMaxAngleX={15}
            tiltMaxAngleY={15}
            scale={1.02}
            transitionSpeed={450}
            className="bg-tertiary p-4 rounded-xl border border-tertiary hover:border-[var(--text-color-variable)] transition-colors duration-300 h-full"
          >
            <h4 className="text-white font-semibold text-[16px] mb-4">
              Top Programming Languages
            </h4>
            {githubData.languages.length > 0 ? (
              githubData.languages.map((language, index) => (
                <LanguageBar
                  key={language.name}
                  language={language}
                  index={index}
                />
              ))
            ) : (
              <div className="text-center text-secondary py-4 text-sm">
                No language data available
              </div>
            )}
          </Tilt>
        </motion.div>
      </div>
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
        Explore my development journey through featured projects and live
        GitHub contributions. From full-stack applications to AI-powered
        tools, each project represents a commitment to quality code and
        innovative solutions. The live GitHub data showcases consistent coding
        practices, diverse technology stack, and collaborative project
        development.
      </motion.p>
    </div>
  );
};

export const ProjectsSectionHeader: React.FC<{ title: string; className?: string }> = ({ title, className = "" }) => {
  return (
    <motion.div variants={textVariant() as any} className={className}>
      <h3 className="text-white font-bold text-[24px] mb-8">
        {title}
      </h3>
    </motion.div>
  );
};

