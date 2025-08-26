'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { styles } from '../styles';
import { staggerContainer } from '../utils';

interface SectionWrapperProps {
  children: ReactNode;
  idName: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  idName,
}) => {
  return (
    <motion.section
      variants={staggerContainer()}
      initial='hidden'
      whileInView='show'
      viewport={{ once: true, amount: 0 }}
      className={`${styles.padding} relative z-0 mx-auto max-w-7xl`}
    >
      <span className='hash-span' id={idName}>
        &nbsp;
      </span>
      {children}
    </motion.section>
  );
};

export default SectionWrapper;
