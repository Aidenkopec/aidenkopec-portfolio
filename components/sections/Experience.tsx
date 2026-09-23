import Image from 'next/image';
import React from 'react';

import SectionHeader from '@/components/chart/SectionHeader';
import SectionWrapper from '@/components/layout/SectionWrapper';
import { experiences, type Experience } from '@/constants';

/** Renders the only markup the bullets use: <strong>. */
const renderPoint = (point: string): React.ReactNode[] =>
  point.split(/<strong>(.*?)<\/strong>/g).map((chunk, i) =>
    // Odd indices are the captured contents of a <strong> pair.
    i % 2 === 1 ? (
      <strong key={i} className='font-semibold text-white-100'>
        {chunk}
      </strong>
    ) : (
      chunk
    ),
  );

interface StopProps {
  experience: Experience;
  /** Odd stops sit left of the path on wide screens, even ones right. */
  index: number;
}

// One job, as a planet the flight path passes through. On phones the planet
// sits on the path in the left gutter; on wide screens the path swings to the
// middle for it and the entries alternate sides.
const Stop: React.FC<StopProps> = ({ experience, index }) => {
  const right = index % 2 === 0;
  const current = experience.date.endsWith('Present');

  return (
    <li className='relative md:grid md:grid-cols-[1fr_7rem_1fr]'>
      <div
        data-waypoint
        className='planet absolute top-0 left-[var(--rail)] -translate-x-1/2 md:relative md:left-auto md:col-start-2 md:row-start-1 md:translate-x-0 md:justify-self-center'
      >
        {current && <span aria-hidden='true' className='planet-orbit' />}
        <span
          className='relative block h-full w-full overflow-hidden rounded-full'
          style={{ background: experience.iconBg }}
        >
          <Image
            src={experience.icon}
            alt={`${experience.companyName} logo`}
            fill
            sizes='56px'
            className='object-contain p-[18%]'
          />
        </span>
      </div>

      <div
        className={`md:row-start-1 ${
          right ? 'md:col-start-3' : 'md:col-start-1 md:text-right'
        }`}
      >
        <h3 className='font-display text-[28px] leading-tight text-white-100 italic sm:text-[34px]'>
          {experience.title}
        </h3>
        <p className='mt-2 text-[15px] font-medium text-white-100'>
          {experience.companyName}
        </p>
        <p className='mt-0.5 text-[14px] text-white-100/55'>
          {experience.date}
        </p>

        <ul className='mt-5 space-y-3'>
          {experience.points.map((point, i) => (
            <li key={i} className='text-[15px] leading-[1.7] text-white-100/70'>
              {renderPoint(point)}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

const ExperienceSection: React.FC = () => {
  return (
    <SectionWrapper idName='work' label='Work experience'>
      <SectionHeader
        title='Work experience'
        intro='Where I have worked, and what I shipped there.'
      />

      <ol className='mt-16 space-y-20 md:mt-24 md:space-y-28'>
        {experiences.map((experience, index) => (
          <Stop
            key={`${experience.companyName}-${experience.date}`}
            experience={experience}
            index={index}
          />
        ))}
      </ol>
    </SectionWrapper>
  );
};

export default ExperienceSection;
