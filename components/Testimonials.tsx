'use client';
import { motion, type Variants } from 'framer-motion';
import React from 'react';

import { testimonials } from '../constants';
import SectionWrapper from '../hoc/SectionWrapper';
import { styles } from '../styles';
import { fadeIn, textVariant } from '../utils';

interface Testimonial {
  testimonial: string;
  name: string;
  designation: string;
  company: string;
}

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
    variants={fadeIn('up', 'spring', index * 0.25, 0.6) as unknown as Variants}
    className='bg-black-200 h-full rounded-3xl p-8 md:p-10'
  >
    <p className='text-secondary text-4xl leading-none font-black'>&ldquo;</p>

    <div className='mt-3'>
      <p className='text-secondary text-base leading-7 tracking-wider md:text-lg'>
        {testimonial}
      </p>

      <div className='mt-6 flex items-center justify-between gap-3'>
        <div className='flex-1'>
          <p className='text-secondary text-sm font-medium md:text-base'>
            <span className='blue-text-gradient'>@</span> {name}
          </p>
          <p className='text-secondary mt-1 text-xs md:text-sm'>
            {designation} of {company}
          </p>
        </div>

        <div className='text-secondary flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold'>
          <span>{name.charAt(0).toUpperCase()}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const Testimonials: React.FC = () => {
  return (
    <SectionWrapper idName=''>
      <section className='bg-black-100 mt-12 rounded-[20px]'>
        <div
          className={`bg-tertiary min-h-[300px] rounded-2xl ${styles.padding}`}
        >
          <motion.div variants={textVariant() as unknown as Variants}>
            <p className={styles.sectionSubText}>WHAT OTHERS SAY</p>
            <h2 className={styles.sectionHeadText}>Testimonials.</h2>
          </motion.div>
        </div>

        {/* Mobile: 1 column stacked.  md+: 3 columns in a row. */}
        <div className={`-mt-20 pb-14 ${styles.paddingX}`}>
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
