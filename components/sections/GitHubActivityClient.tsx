'use client';

import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { DateTime } from 'luxon';
import React, { useEffect, useRef, useState } from 'react';

import SectionHeader from '@/components/chart/SectionHeader';
import { GITHUB_URL } from '@/constants';
import { usePlayWhileVisible } from '@/hooks/usePlayWhileVisible';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  formatCommitMessage,
  type Commit,
  type ContributionCalendar,
  type GitHubData,
} from '@/lib/github-utils';

// One day on the sky chart, in CSS pixels.
const CELL = 14;
const MONTH_ROW = 20;

// Brightness of a day's star by contribution level, from faint dust to a
// star with a halo in the theme's accent. Halos stay under half a cell so
// neighbouring busy days never bleed into each other.
const STAR = [
  { r: 0.9, opacity: 0.18, halo: 0 },
  { r: 1.6, opacity: 0.6, halo: 0 },
  { r: 2.3, opacity: 0.85, halo: 0 },
  { r: 2.8, opacity: 1, halo: 5 },
  { r: 3.3, opacity: 1, halo: 6.5 },
] as const;

const LEVELS = [
  { label: 'None', range: '0' },
  { label: 'Low', range: '1-3' },
  { label: 'Medium', range: '4-6' },
  { label: 'High', range: '7-9' },
  { label: 'Very high', range: '10+' },
];

const levelOf = (count: number): number =>
  count === 0 ? 0 : count <= 3 ? 1 : count <= 6 ? 2 : count <= 9 ? 3 : 4;

const Star: React.FC<{ level: number; x: number; y: number }> = ({
  level,
  x,
  y,
}) => {
  const star = STAR[level] ?? STAR[0];
  return (
    <>
      {star.halo > 0 && (
        <circle
          cx={x}
          cy={y}
          r={star.halo}
          fill='var(--text-color-variable)'
          opacity={level === 4 ? 0.26 : 0.16}
        />
      )}
      <circle
        cx={x}
        cy={y}
        r={star.r}
        fill='var(--star)'
        opacity={star.opacity}
      />
    </>
  );
};

// A target ring on the day of the commit the readout is showing.
const CommitMarker: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g className='commit-marker' pointerEvents='none'>
    <circle cx={x} cy={y} r={6.5} />
    <circle cx={x} cy={y} r={6.5} className='commit-marker-echo' />
    <path
      d={`M${x - 11} ${y}h3M${x + 8} ${y}h3M${x} ${y - 11}v3M${x} ${y + 8}v3`}
    />
  </g>
);

const ROTATE_MS = 4000;

interface CommitReadoutProps {
  commits: Commit[];
  active: number;
  onStep: (step: number) => void;
  onPause: (paused: boolean) => void;
  stepping: boolean;
}

// The latest public commits, one at a time, like a telemetry line.
const CommitReadout: React.FC<CommitReadoutProps> = ({
  commits,
  active,
  onStep,
  onPause,
  stepping,
}) => {
  const commit = commits[active];
  if (!commit) {
    return (
      <p className='text-[13px] text-white-100/55'>
        No recent public commits. The chart above shows all activity.
      </p>
    );
  }

  const sha = commit.sha.substring(0, 7);

  return (
    <div
      role='group'
      aria-label='Recent public commits'
      className='flex min-h-11 min-w-0 items-center gap-3 text-[13px]'
      onPointerEnter={() => onPause(true)}
      onPointerLeave={() => onPause(false)}
      onFocus={() => onPause(true)}
      onBlur={() => onPause(false)}
    >
      <span aria-hidden='true' className='relative flex h-2 w-2 shrink-0'>
        <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--text-color-variable)] opacity-60' />
        <span className='relative inline-flex h-2 w-2 rounded-full bg-[var(--text-color-variable)]' />
      </span>

      <p key={active} className='readout-in flex min-w-0 items-baseline gap-3'>
        <span className='max-w-[45%] shrink-0 truncate font-medium text-white-100'>
          {commit.repo}
        </span>
        <span className='min-w-0 truncate text-white-100/70'>
          {formatCommitMessage(commit.message, 80)}
        </span>
        <time
          dateTime={commit.date}
          className='hidden shrink-0 text-white-100/45 sm:inline'
        >
          {DateTime.fromISO(commit.date).toRelative()}
        </time>
        <a
          href={`${GITHUB_URL}/${commit.repo}/commit/${commit.sha}`}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={`Commit ${sha} on GitHub`}
          className='shrink-0 font-mono text-[var(--text-color-variable)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] focus-visible:outline-none max-lg:relative max-lg:after:absolute max-lg:after:-inset-x-2 max-lg:after:-inset-y-3'
        >
          {sha}
        </a>
      </p>

      {stepping && commits.length > 1 && (
        <span className='-my-3 flex shrink-0'>
          <button
            onClick={() => onStep(-1)}
            aria-label='Previous commit'
            className='flex h-11 w-8 items-center justify-center text-white-100/55 hover:text-white-100 focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] focus-visible:outline-none'
          >
            <ChevronLeft aria-hidden='true' className='h-4 w-4' />
          </button>
          <button
            onClick={() => onStep(1)}
            aria-label='Next commit'
            className='flex h-11 w-8 items-center justify-center text-white-100/55 hover:text-white-100 focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] focus-visible:outline-none'
          >
            <ChevronRight aria-hidden='true' className='h-4 w-4' />
          </button>
        </span>
      )}
    </div>
  );
};

interface TooltipData {
  count: number;
  date: string;
  x: number;
  y: number;
}

interface SkyChartProps {
  commitCalendar: ContributionCalendar | null;
  loading: boolean;
  selectedYear: string;
  availableYears: (string | number)[];
  onYearChange: (year: string) => void;
  /** Day to ring on the chart, as an ISO date. */
  markedDate: string | null;
  /** Shown beside the brightness key. */
  readout: React.ReactNode;
}

// The contribution calendar as a star field: a column per week, a row per
// weekday, and each day a star as bright as that day was busy.
const SkyChart: React.FC<SkyChartProps> = ({
  commitCalendar,
  loading,
  selectedYear,
  availableYears,
  onYearChange,
  markedDate,
  readout,
}) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(tooltipTimer.current), []);

  // Where the chart scrolls sideways on a phone, open on the latest weeks.
  useEffect(() => {
    const scroller = scrollRef.current;
    if (scroller) scroller.scrollLeft = scroller.scrollWidth;
  }, [commitCalendar]);

  const handleYearChange = (year: string): void => {
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
      document.addEventListener('pointerdown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  const weeks = commitCalendar?.weeks ?? [];
  const days = weeks.flatMap((week, w) =>
    week.contributionDays.map((day, d) => ({ ...day, w, d })),
  );

  // A label over the first week of each month.
  const months: { label: string; w: number }[] = [];
  weeks.forEach((week, w) => {
    const first = week.contributionDays[0]?.date;
    if (!first) return;
    const label = DateTime.fromISO(first).toFormat('MMM');
    if (months.at(-1)?.label !== label) months.push({ label, w });
  });
  // A month with only a week or two showing at either end has no room for its
  // label.
  if (months.length > 1 && weeks.length - months.at(-1)!.w < 3) months.pop();
  if (months.length > 1 && months[1]!.w - months[0]!.w < 3) months.shift();

  const marked = days.find((day) => day.date === markedDate);

  const width = weeks.length * CELL;
  const height = MONTH_ROW + 7 * CELL;

  // One handler for the whole chart rather than one per day. Touch has no
  // hover, so a tap shows the day briefly instead; a drag scrolls the chart.
  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.pointerType === 'touch' && event.type !== 'pointerdown') return;
    const target = (event.target as Element).closest<SVGElement>('[data-day]');
    const day = target ? days[Number(target.dataset.day)] : undefined;
    if (!target || !day) {
      setTooltip(null);
      return;
    }
    const rect = target.getBoundingClientRect();
    setTooltip({
      count: day.contributionCount,
      date: DateTime.fromISO(day.date).toLocaleString(DateTime.DATE_HUGE),
      x: rect.left + rect.width / 2,
      y: rect.top - 6,
    });
  };

  const period = selectedYear === 'last' ? 'the last year' : selectedYear;

  return (
    <div className='relative'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <h3 className='text-[17px] text-white-100/80'>
          {loading ? (
            'Loading contributions'
          ) : commitCalendar ? (
            <>
              <span className='font-display text-[28px] text-white-100'>
                {commitCalendar.totalContributions.toLocaleString()}
              </span>{' '}
              contributions in {period}
            </>
          ) : (
            'Contribution activity'
          )}
        </h3>

        <div className='relative' ref={dropdownRef}>
          <button
            ref={triggerRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-label='Filter contributions by year'
            className='flex min-h-11 items-center gap-2 rounded-full border border-[var(--chart-faint)] px-4 text-sm font-medium text-white-100 transition-colors hover:border-[var(--text-color-variable)] focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] focus-visible:outline-none'
          >
            {selectedYear === 'last' ? 'Last year' : selectedYear}
            <ChevronDown
              aria-hidden='true'
              className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className='absolute top-full right-0 z-20 mt-2 min-w-[140px] overflow-hidden rounded-xl border border-[var(--chart-faint)] bg-[var(--black-200)]/95 py-1 shadow-lg shadow-black/40 backdrop-blur-md'>
              {availableYears.map((year) => {
                const value = year.toString();
                const selected = selectedYear === value;
                return (
                  <button
                    key={value}
                    onClick={() => handleYearChange(value)}
                    aria-pressed={selected}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-[var(--text-color-variable)]/10 ${
                      selected
                        ? 'text-[var(--text-color-variable)]'
                        : 'text-white-100'
                    }`}
                  >
                    {year === 'last' ? 'Last year' : year}
                    {selected && (
                      <Check aria-hidden='true' className='h-4 w-4' />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div
          role='status'
          className='mt-6 h-[118px] animate-pulse rounded-lg bg-white-100/5'
        >
          <span className='sr-only'>Loading contributions</span>
        </div>
      ) : weeks.length > 0 ? (
        <>
          <div
            ref={scrollRef}
            onScroll={() => setTooltip(null)}
            className='scrollbar-hide -mx-2 mt-6 overflow-x-auto px-2 pb-2'
          >
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className='block h-auto w-full overflow-visible'
              style={{ minWidth: width }}
              role='img'
              aria-label={`Contribution chart: ${commitCalendar?.totalContributions ?? 0} contributions in ${period}`}
              onPointerMove={handlePointerMove}
              onPointerLeave={(event) => {
                if (event.pointerType !== 'touch') setTooltip(null);
              }}
              onPointerDown={(event) => {
                if (event.pointerType !== 'touch') return;
                handlePointerMove(event);
                clearTimeout(tooltipTimer.current);
                tooltipTimer.current = setTimeout(() => setTooltip(null), 2000);
              }}
            >
              {months.map(({ label, w }) => (
                <text
                  key={`${label}-${w}`}
                  x={w * CELL + 2}
                  y={12}
                  className='fill-white-100/50 text-[11px]'
                >
                  {label}
                </text>
              ))}

              {days.map((day, i) => {
                const x = day.w * CELL + CELL / 2;
                const y = MONTH_ROW + day.d * CELL + CELL / 2;
                return (
                  <g key={day.date} data-day={i}>
                    <rect
                      x={x - CELL / 2}
                      y={y - CELL / 2}
                      width={CELL}
                      height={CELL}
                      fill='transparent'
                    />
                    <Star level={levelOf(day.contributionCount)} x={x} y={y} />
                  </g>
                );
              })}

              {marked && (
                <CommitMarker
                  key={marked.date}
                  x={marked.w * CELL + CELL / 2}
                  y={MONTH_ROW + marked.d * CELL + CELL / 2}
                />
              )}
            </svg>
          </div>
        </>
      ) : (
        <p className='mt-6 text-sm text-white-100/70'>
          {commitCalendar
            ? 'No contributions in this period'
            : 'Contribution data is unavailable right now'}
        </p>
      )}

      <div className='mt-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-3'>
        <div className='min-w-0 basis-full sm:flex-1 sm:basis-0'>{readout}</div>

        {!loading && weeks.length > 0 && (
          <div className='ml-auto flex shrink-0 items-center gap-3 text-[12px] text-white-100/55'>
            <span>Fewer</span>
            <svg
              width={5 * 22}
              height={22}
              viewBox={`0 0 ${5 * 22} 22`}
              role='img'
              aria-label={`Brightness key: ${LEVELS.map((l) => `${l.label}, ${l.range}`).join('; ')} contributions`}
            >
              {LEVELS.map((_, level) => (
                <Star key={level} level={level} x={level * 22 + 11} y={11} />
              ))}
            </svg>
            <span>More</span>
          </div>
        )}
      </div>

      {tooltip && (
        <div
          role='tooltip'
          className='pointer-events-none fixed z-[99999] -translate-x-1/2 -translate-y-full rounded-lg border border-[var(--chart-faint)] bg-[var(--black-200)]/95 px-3 py-2 text-xs whitespace-nowrap text-white-100 shadow-2xl'
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className='font-medium'>
            {tooltip.count === 0
              ? 'No contributions'
              : `${tooltip.count} contribution${tooltip.count === 1 ? '' : 's'}`}
          </div>
          <div className='text-[11px] text-white-100/60'>{tooltip.date}</div>
        </div>
      )}

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
  const stats = [
    { label: 'Public repositories', value: githubData.user.public_repos },
    { label: 'Stars earned', value: githubData.stats.totalStars },
    { label: 'Followers', value: githubData.user.followers },
    { label: 'Years on GitHub', value: githubData.stats.yearsOnGitHub },
  ];

  return (
    <dl className='mt-12 grid grid-cols-2 gap-y-8 border-t border-[var(--chart-faint)] pt-8 md:grid-cols-4'>
      {stats.map(({ label, value }) => (
        <div key={label} className='flex flex-col-reverse gap-2'>
          <dt className='text-[14px] text-white-100/55'>{label}</dt>
          <dd className='font-display text-[48px] leading-none text-white-100 sm:text-[60px]'>
            {value ?? '---'}
          </dd>
        </div>
      ))}
    </dl>
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
    setSelectedYear(year);
    setLoading(true);
    try {
      const response = await fetch(`/api/github?year=${year}`);
      if (response.ok) {
        // The route returns the calendar and nothing else. Annotated because
        // response.json() is `any`, and this is the one place untyped data
        // crosses back into typed state.
        const data: { commitCalendar: ContributionCalendar | null } =
          await response.json();
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

  const commits = githubData.commits;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const chartRef = usePlayWhileVisible<HTMLDivElement>();

  useEffect(() => {
    if (reduced || paused || commits.length < 2) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % commits.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, [reduced, paused, commits.length]);

  const step = (by: number) =>
    setActive((i) => (i + by + commits.length) % commits.length);

  const commit = commits[active];
  const markedDate = commit ? DateTime.fromISO(commit.date).toISODate() : null;

  return (
    <div ref={chartRef} className='mt-16'>
      <SkyChart
        commitCalendar={contributionData}
        loading={loading}
        selectedYear={selectedYear}
        availableYears={availableYears}
        onYearChange={fetchContributionData}
        markedDate={markedDate}
        readout={
          <CommitReadout
            commits={commits}
            active={active}
            onStep={step}
            onPause={setPaused}
            stepping={reduced}
          />
        }
      />
    </div>
  );
};

export const GitHubActivityHeader: React.FC = () => {
  return (
    <SectionHeader
      title='GitHub activity'
      intro='Pulled live from the GitHub API, not typed in by hand.'
      action={
        <a
          href={GITHUB_URL}
          target='_blank'
          rel='noopener noreferrer'
          className='chart-link'
        >
          View GitHub profile
          <ArrowUpRight aria-hidden='true' className='h-4 w-4' />
        </a>
      }
    />
  );
};
