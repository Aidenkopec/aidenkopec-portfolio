'use client';
import { motion } from 'framer-motion';
import React from 'react';

import { testimonials, type Testimonial } from '@/constants';
import SectionWrapper from '@/components/layout/SectionWrapper';
import { fadeIn, textVariant } from '@/utils';

interface FeedbackCardProps extends Testimonial {
  index: number;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  index,
  testimonial,
  name,
  designation,
  company,
}) => (
  <motion.div
    variants={fadeIn('up', 'spring', index * 0.25, 0.6)}
    className='h-full rounded-3xl glass p-8 md:p-10'
  >
    <p className='text-4xl leading-none font-black text-secondary'>&ldquo;</p>

    <div className='mt-3'>
      <p className='text-base leading-7 tracking-wider text-secondary md:text-lg'>
        {testimonial}
      </p>

      <div className='mt-6 flex items-center justify-between gap-3'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-secondary md:text-base'>
            <span className='blue-text-gradient'>@</span> {name}
          </p>
          <p className='mt-1 text-xs text-secondary md:text-sm'>
            {designation} of {company}
          </p>
        </div>

        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-secondary'>
          <span>{name.charAt(0).toUpperCase()}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const Testimonials: React.FC = () => {
  return (
    <SectionWrapper label='Testimonials'>
      <section className='mt-12 rounded-[20px] glass'>
        <div className='min-h-[300px] rounded-2xl padding'>
          <motion.div variants={textVariant()}>
            <p className='section-sub-text'>WHAT OTHERS SAY</p>
            <h2 className='section-head-text'>Testimonials.</h2>
          </motion.div>
        </div>

        {/* Mobile: 1 column stacked.  md+: 3 columns in a row. */}
        <div className='-mt-20 padding-x pb-14'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {testimonials.map((t: Testimonial, index: number) => (
              <FeedbackCard key={t.name} index={index} {...t} />
            ))}
          </div>
        </div>
      </section>
    </SectionWrapper>
  );
};

export default Testimonials;
