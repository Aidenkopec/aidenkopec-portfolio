'use client';
import React from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import { motion } from 'framer-motion';
import Image from 'next/image';

import 'react-vertical-timeline-component/style.min.css';

import { styles } from '../styles';
import { experiences } from '../constants';
import SectionWrapper from '../hoc/SectionWrapper';
import { textVariant } from '../utils';

/** Renders the only markup the bullets use: <strong>. */
const renderPoint = (point: string): React.ReactNode[] =>
  point.split(/<strong>(.*?)<\/strong>/g).map((chunk, i) =>
    // Odd indices are the captured contents of a <strong> pair.
    i % 2 === 1 ? <strong key={i}>{chunk}</strong> : chunk,
  );

interface Experience {
  title: string;
  company_name: string;
  icon: any;
  iconBg: string;
  date: string;
  points: string[];
}

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: 'var(--tertiary-color)',
        color: '#ffffff',
      }}
      contentArrowStyle={{ borderRight: '7px solid  #232631' }}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className='relative h-full w-full overflow-hidden rounded-full'>
          <Image
            src={experience.icon}
            alt={`${experience.company_name} logo`}
            fill
            sizes='60px'
            className='object-contain p-[15%]'
          />
        </div>
      }
    >
      <div>
        <h3 className='text-[24px] font-bold text-secondary'>
          {experience.title}
        </h3>
        <p
          className='text-[16px] font-semibold text-secondary'
          style={{ margin: 0 }}
        >
          {experience.company_name}
        </p>
      </div>

      <ul className='mt-5 ml-5 list-disc space-y-2'>
        {experience.points.map((point: string, index: number) => (
          <li
            key={`experience-point-${index}`}
            className='-100 pl-1 text-[14px] tracking-wider text-secondary'
          >
            {renderPoint(point)}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience: React.FC = () => {
  return (
    <SectionWrapper idName='work'>
      <motion.div variants={textVariant() as any}>
        <p className={`${styles.sectionSubText} text-center`}>
          What I have done so far
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          Work Experience.
        </h2>
      </motion.div>

      <div className='mt-20 flex flex-col'>
        <VerticalTimeline>
          {experiences.map((experience: Experience, index: number) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
      </div>
    </SectionWrapper>
  );
};

export default Experience;
