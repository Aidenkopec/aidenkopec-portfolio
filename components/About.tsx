import React from 'react';

import SectionHeader from '@/components/chart/SectionHeader';
import Constellations from '@/components/chart/Constellations';
import SectionWrapper from '@/components/layout/SectionWrapper';
import { services } from '@/constants';

const About: React.FC = () => {
  return (
    <SectionWrapper idName='about' label='About'>
      <SectionHeader title='Overview' />

      <div className='mt-12 grid items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20'>
        <div className='max-w-2xl space-y-6 text-[17px] leading-[1.75] text-white-100/80'>
          <p>
            I&apos;m a Full-Stack Developer who transforms complex business
            challenges into powerful software solutions. Whether eliminating
            weeks of manual reporting or building platforms that streamline
            operations, I create systems that genuinely improve how people work.
          </p>
          <p>
            At Evans Consoles, I&apos;ve built live dashboards tracking critical
            business metrics and developed a dynamic budgeting system providing
            real-time profitability analysis for decision-making. My toolkit
            centers around Next.js, Vue, Node.js, TypeScript, and PostgreSQL -
            technologies I use daily to build solutions that scale.
          </p>
          <p>
            Beyond work, I&apos;m driven by curiosity to explore emerging
            technologies through personal projects. From AI integrations to
            automated trading systems, I tackle technical challenges that push
            my skills forward and bring fresh insights back to my professional
            work.
          </p>
          <p>
            When I&apos;m not coding, you&apos;ll find me on the ski slopes or
            hiking mountain trails.
          </p>
        </div>

        <div className='mx-auto w-full max-w-[520px]'>
          <Constellations services={services} />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default About;
