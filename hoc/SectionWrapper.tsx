'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { styles } from '../styles';
import { staggerContainer } from '../utils';

interface SectionWrapperProps {
  children: ReactNode;
  /** In page anchor target. Omitted for sections nothing links to. */
  idName?: string;
  /** Accessible name for the section landmark. */
  label?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  idName,
  label,
}) => {
  return (
    // The id sits on the section itself. It used to live on an empty `hash-span`
    // whose class was defined nowhere, so following a nav link landed on a
    // non breaking space with no announced context. The navbar offset comes
    // from `:target { scroll-margin-top }` in globals.css, not from the span.
    <motion.section
      id={idName || undefined}
      aria-label={label}
      variants={staggerContainer()}
      initial='hidden'
      whileInView='show'
      viewport={{ once: true, amount: 0 }}
      className={`${styles.padding} relative z-0 mx-auto max-w-7xl`}
    >
      {children}
    </motion.section>
  );
};

export default SectionWrapper;
