// Technology icons - Static imports for Next.js optimization
import typescript from '../public/technologies/typescript.png';
import react from '../public/technologies/reactjs.png';
import nodejs from '../public/technologies/nodejs.png';
import vue from '../public/technologies/vue-three.png';
import edgedb from '../public/technologies/edgedb.jpg';
import docker from '../public/technologies/docker.png';
import aws from '../public/technologies/aws.png';
import postgres from '../public/technologies/postgresql.png';
import tailwind from '../public/technologies/tailwind.png';

import nextjs from '../public/technologies/nextjs.png';
import bullmq from '../public/technologies/bullmq.png';
import redis from '../public/technologies/redis.png';

// Company logos - Static imports
import opit from '../public/companies/opit.png';
import launchcode from '../public/companies/launchcode.png';
import evans from '../public/companies/evans-consoles-logo.jpeg';

// Project images - Static imports
import teevision from '../public/projects/tee-vision.png';
import solvexdigital from '../public/projects/solvex-digital.svg';
import freqtrade from '../public/projects/freqtrade-logo.png';

// Service icons (engineering focus) - Static imports
import fullStackDeveloper from '../public/engineering-focus/fullStackDeveloper.png';
import frontendDeveloper from '../public/engineering-focus/frontendDeveloper.png';
import backendAutomationErp from '../public/engineering-focus/backendAutomationErp.png';
import devopsInfrastructure from '../public/engineering-focus/devopsInfrastructure.png';

// Type definitions
interface NavLink {
  id: string;
  title: string;
}

interface Service {
  title: string;
  icon: any;
}

interface Technology {
  name: string;
  icon: any;
}

interface Experience {
  title: string;
  company_name: string;
  icon: any;
  iconBg: string;
  date: string;
  points: string[];
}

interface Testimonial {
  testimonial: string;
  name: string;
  designation: string;
  company: string;
}

interface ProjectTag {
  name: string;
  color: string;
}

interface Project {
  name: string;
  description: string;
  tags: ProjectTag[];
  image: any;
  source_code_link: string;
}

export const navLinks: NavLink[] = [
  {
    id: 'about',
    title: 'About',
  },
  {
    id: 'work',
    title: 'Work',
  },
  {
    id: 'contact',
    title: 'Contact',
  },
];

const services: Service[] = [
  {
    title: 'Full Stack Developer',
    icon: fullStackDeveloper, // This now points to fullStackDeveloper.png
  },
  {
    title: 'Frontend Developer',
    icon: frontendDeveloper, // This now points to frontendDeveloper.png
  },
  {
    title: 'Backend Automation & ERP',
    icon: backendAutomationErp,
  },
  {
    title: 'DevOps & Infrastructure',
    icon: devopsInfrastructure, // This now points to devopsInfrastructure.png
  },
];

const technologies: Technology[] = [
  // Frontend
  { name: 'Next.js', icon: nextjs },
  { name: 'React', icon: react },
  { name: 'TypeScript', icon: typescript },
  { name: 'Tailwind CSS', icon: tailwind },
  { name: 'Vue 3', icon: vue },

  // Backend
  { name: 'Node.js', icon: nodejs },
  { name: 'BullMQ', icon: bullmq },
  { name: 'Redis', icon: redis },

  // Databases
  { name: 'PostgreSQL', icon: postgres },
  { name: 'EdgeDB', icon: edgedb },

  // DevOps
  { name: 'AWS', icon: aws },
  { name: 'Docker', icon: docker },
];

const experiences: Experience[] = [
  {
    title: 'Full Stack Developer',
    company_name: 'Evans Consoles',
    icon: evans,
    iconBg: '#E6DEDD',
    date: 'January 2024 - Present',
    points: [
      'Developed 40+ custom KPI reports and 10 real-time dashboards, saving thousands of labor hours annually and resolving $2M+ in inventory discrepancies within finance',
      'Built full-stack Bill of Materials (BOM) platform translating complex 3D CAD outputs into actionable manufacturing instructions, dramatically improving shop floor accuracy',
      'Implemented dynamic budgeting system (P3) and automated ERP workflows using BullMQ, achieving 20x deployment speed improvement and migrating core systems from React to Vue',
      'Engineered real-time inventory tracking platform with interactive global mapping system, displaying live locations of products worldwide',
    ],
  },
  {
    title: 'Full Stack Engineer',
    company_name: 'One Piece IT',
    icon: opit,
    iconBg: '#383E56',
    date: 'May 2023 - December 2023',
    points: [
      'Built and optimized web and mobile applications, improving performance by 30% and boosting user satisfaction by 25%',
      'Led full development lifecycle of diverse applications, ensuring efficient deployment and robust performance across client projects',
      'Configured and managed network architectures and server setups, demonstrating proficiency in network engineering and reliable systems',
    ],
  },
  {
    title: 'Software Developer',
    company_name: 'Launchcode',
    icon: launchcode,
    iconBg: '#383E56',
    date: 'April 2022 - December 2022',
    points: [
      'Led development of a specialized quote-to-cash platform tailored for the Oil and Gas sector, demonstrating leadership and project management skills',
      'Employed React, TypeScript, Node.js, PostgreSQL, Git, Docker, and AWS showcasing technical versatility and full-stack proficiency',
      'Managed front-end and back-end development, client requirements gathering, and workflow design for complex business processes',
    ],
  },
];

const testimonials: Testimonial[] = [
  {
    testimonial:
      'I had the pleasure of working with Aiden on a complex web development project, and I was impressed with their ability to handle multiple tasks while maintaining the highest level of quality.',
    name: 'Ethan Nguyen',
    designation: 'Software Developer',
    company: 'SAIT',
  },
  {
    testimonial:
      'Aiden is an exceptional developer and a joy to work with. His passion for programming and problem-solving is unmatched.',
    name: 'Nelson Torres',
    designation: 'Software Engineer',
    company: 'ByteForge',
  },
  {
    testimonial:
      'Aiden is a hardworking and detail-oriented software developer who consistently delivers high-quality work. His ability to collaborate effectively with team members and communicate technical concepts clearly is a valuable asset.',
    name: 'Adrian Rhodes',
    designation: 'Software Developer',
    company: 'SAIT',
  },
];

const projects: Project[] = [
  {
    name: 'Solvex Digital Agency Platform',
    description:
      'Founded and operated a digital agency delivering full-stack web applications, GPT-powered AI integrations, and SEO solutions. Led 8 client projects from planning to deployment, delivering production-ready platforms with modern technologies and achieving significant business growth for clients.',
    tags: [
      {
        name: 'Next,js',
        color: 'green-text-gradient',
      },
      {
        name: 'Node.js',
        color: 'blue-text-gradient',
      },
      {
        name: 'AI Integration',
        color: 'pink-text-gradient',
      },
      {
        name: 'EdgeDB',
        color: 'orange-text-gradient',
      },
    ],
    image: solvexdigital,
    source_code_link: 'https://solvexdigital.com',
  },
  {
    name: 'Teevision - 3D T-Shirt Customizer',
    description:
      'Design custom T-shirts in stunning 3D! Built with React, ThreeJS, TailwindCSS, Framer Motion, and DALLE AI. Features real-time 3D rendering, custom color palettes, logo uploads, and downloadable designs. Achieve a seamless user experience with responsive design and industry-standard best practices. Interactive 3D environment with smooth animations and modern UI.',
    tags: [
      {
        name: 'React',
        color: 'blue-text-gradient',
      },
      {
        name: 'ThreeJS',
        color: 'green-text-gradient',
      },
      {
        name: 'Framer Motion',
        color: 'pink-text-gradient',
      },
      {
        name: 'TailwindCSS',
        color: 'orange-text-gradient',
      },
    ],
    image: teevision,
    source_code_link:
      'https://github.com/Aidenkopec/project-3d-clothing-website',
  },
  {
    name: 'Cryptocurrency Trading Bot System',
    description:
      'Built a containerized cryptocurrency trading system using the Freqtrade framework with custom Python strategies. Implemented dual-asset selection algorithm, advanced technical indicators (RSI, MACD, Bollinger Bands), dynamic risk management, and comprehensive backtesting with performance analytics deployed via Docker on Kraken exchange.',
    tags: [
      {
        name: 'Python',
        color: 'blue-text-gradient',
      },
      {
        name: 'Docker',
        color: 'green-text-gradient',
      },
      {
        name: 'Trading Algorithms',
        color: 'pink-text-gradient',
      },
      {
        name: 'Technical Analysis',
        color: 'orange-text-gradient',
      },
    ],
    image: freqtrade, // Will need new image
    source_code_link: 'https://github.com', // Private repo
  },
];

export { services, technologies, experiences, testimonials, projects };
