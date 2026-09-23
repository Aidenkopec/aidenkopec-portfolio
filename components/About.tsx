'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import Tilt from 'react-parallax-tilt';

import { services, type Service } from '@/constants';
import SectionWrapper from '@/components/layout/SectionWrapper';
import { fadeIn, textVariant } from '@/utils';

// Extends the constants type rather than restating it: `icon: string` here was
// wrong, the values are static image imports, and the `any` on the map below was
// what let the mismatch through the spread.
interface ServiceCardProps extends Service {
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ index, title, icon }) => (
  <Tilt
    tiltMaxAngleX={45}
    tiltMaxAngleY={45}
    scale={1}
    transitionSpeed={450}
    className='w-full'
  >
    <motion.div
      variants={fadeIn('right', 'spring', index * 0.5, 0.75)}
      className='glass-edge w-full rounded-[20px]'
    >
      <div className='flex min-h-[280px] flex-col items-center justify-evenly rounded-[20px] glass px-6 py-5 sm:px-12'>
        <Image
          src={icon}
          alt={`${title} service icon`}
          width={64}
          height={64}
          className='object-contain'
        />

        <h3 className='text-center text-[18px] leading-tight font-bold text-secondary sm:text-[20px]'>
          {title.split(' ').length > 3 ? (
            <>
              {title
                .split(' ')
                .slice(0, Math.ceil(title.split(' ').length / 2))
                .join(' ')}
              <br />
              {title
                .split(' ')
                .slice(Math.ceil(title.split(' ').length / 2))
                .join(' ')}
            </>
          ) : (
            title
          )}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About: React.FC = () => {
  return (
    <SectionWrapper idName='about' label='About'>
      <motion.div variants={textVariant()}>
        <p className='section-sub-text'>Introduction</p>
        <h2 className='section-head-text'>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn('up', 'spring', 0.1, 1)}
        className='mt-4 max-w-3xl text-[17px] leading-[30px] text-secondary'
      >
        I&apos;m a Full-Stack Developer who transforms complex business
        challenges into powerful software solutions. Whether eliminating weeks
        of manual reporting or building platforms that streamline operations, I
        create systems that genuinely improve how people work.
        <br />
        <br />
        At Evans Consoles, I&apos;ve built live dashboards tracking critical
        business metrics and developed a dynamic budgeting system providing
        real-time profitability analysis for decision-making. My toolkit centers
        around Next.js, Vue, Node.js, TypeScript, and PostgreSQL - technologies
        I use daily to build solutions that scale.
        <br />
        <br />
        Beyond work, I&apos;m driven by curiosity to explore emerging
        technologies through personal projects. From AI integrations to
        automated trading systems, I tackle technical challenges that push my
        skills forward and bring fresh insights back to my professional work.
        <br />
        <br />
        When I&apos;m not coding, you&apos;ll find me on the ski slopes or
        hiking mountain trails.
      </motion.p>

      <div className='mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-8'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default About;
