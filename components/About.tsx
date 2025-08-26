'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import Tilt from 'react-parallax-tilt';

import { services } from '../constants';
import SectionWrapper from '../hoc/SectionWrapper';
import { styles } from '../styles';
import { fadeIn, textVariant } from '../utils';

interface ServiceCardProps {
  index: number;
  title: string;
  icon: string;
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
      variants={fadeIn('right', 'spring', index * 0.5, 0.75) as any}
      className='green-pink-gradient shadow-card w-full rounded-[20px] p-[1px]'
    >
      <div className='bg-tertiary flex min-h-[280px] flex-col items-center justify-evenly rounded-[20px] px-6 py-5 sm:px-12'>
        <Image
          src={icon}
          alt={`${title} service icon`}
          width={64}
          height={64}
          className='object-contain'
        />

        <h3 className='text-secondary text-center text-[18px] leading-tight font-bold sm:text-[20px]'>
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
    <SectionWrapper idName='about'>
      <motion.div variants={textVariant() as any}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn('up', 'spring', 0.1, 1) as any}
        className='text-secondary mt-4 max-w-3xl text-[17px] leading-[30px]'
      >
        I&apos;m a Full Stack Software Developer with a proven track record of
        delivering scalable, production-grade systems that drive efficiency,
        accuracy, and visibility across complex, multi-department environments.
        My expertise spans backend automation, real-time reporting
        infrastructure, ERP integrations, and full-stack platforms that support
        high-impact operations across diverse business functions.
        <br />
        <br />
        At Evans Consoles, I&apos;ve developed 40+ custom KPI reports and 10
        real-time dashboards, saving thousands of labor hours annually and
        resolving $2M+ in inventory discrepancies. I built a comprehensive Bill
        of Materials platform and implemented dynamic budgeting systems using
        cutting-edge technologies like Vue 3, Node.js, BullMQ, and Redis,
        achieving a 20x deployment speed improvement.
        <br />
        <br />
        My technical arsenal includes modern frontend frameworks (Vue 3, React,
        Next.js), robust backend technologies (Node.js, Python), advanced
        databases (EdgeDB, PostgreSQL, Redis), and comprehensive DevOps
        practices (Docker, Kubernetes, AWS). I excel at translating real-world
        challenges into modern, high-performance software that drives tangible
        business outcomes across organizations.
        <br />
        <br />
        Beyond client work, I founded Solvex Digital, delivering full-stack web
        applications and GPT-powered AI integrations to 8+ clients. I&apos;ve
        also developed sophisticated systems like containerized cryptocurrency
        trading bots with advanced algorithmic strategies, demonstrating my
        ability to tackle complex technical challenges across diverse domains.
        <br />
        <br />
      </motion.p>

      <div className='mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-8'>
        {services.map((service: any, index: number) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default About;
