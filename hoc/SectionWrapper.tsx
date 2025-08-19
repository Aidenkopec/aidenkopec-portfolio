import React, { ComponentType } from 'react';
import { motion } from 'framer-motion';

import { styles } from '../styles';
import { staggerContainer } from '../utils';

const SectionWrapper = <P extends object>(
  Component: ComponentType<P>,
  idName: string
) => {
  const WrappedComponent: React.FC<P> = (props: P) => {
    return (
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}
        className={`${styles.padding} max-w-7xl mx-auto relative z-0`}
      >
        <span className="hash-span" id={idName}>
          &nbsp;
        </span>

        <Component {...props} />
      </motion.section>
    );
  };

  return WrappedComponent;
};

export default SectionWrapper;
