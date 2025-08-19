'use client';
import React from 'react';
import { motion, type Variants } from 'framer-motion';

import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { fadeIn, textVariant } from '../utils';
import { testimonials } from '../constants';

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
    className="h-full rounded-3xl bg-black-200 p-8 md:p-10"
  >
    <p className="leading-none text-4xl font-black text-white">"</p>

    <div className="mt-3">
      <p className="leading-7 text-base tracking-wider text-white md:text-lg">
        {testimonial}
      </p>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-white md:text-base">
            <span className="blue-text-gradient">@</span> {name}
          </p>
          <p className="mt-1 text-xs text-secondary md:text-sm">
            {designation} of {company}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
          <span>{name.charAt(0).toUpperCase()}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const Testimonials: React.FC = () => {
  return (
    <section className="mt-12 rounded-[20px] bg-black-100">
      <div
        className={`min-h-[300px] rounded-2xl bg-tertiary ${styles.padding}`}
      >
        <motion.div variants={textVariant() as unknown as Variants}>
          <p className={styles.sectionSubText}>WHAT OTHERS SAY</p>
          <h2 className={styles.sectionHeadText}>Testimonials.</h2>
        </motion.div>
      </div>

      {/* Mobile: 1 column stacked.  md+: 3 columns in a row. */}
      <div className={`-mt-20 pb-14 ${styles.paddingX}`}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t: Testimonial, index: number) => (
            <FeedbackCard key={t.name} index={index} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper(Testimonials, '');
