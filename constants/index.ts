// Technology icons - Static imports for Next.js optimization
import aws from '../public/technologies/aws.png';
import docker from '../public/technologies/docker.png';
import edgedb from '../public/technologies/edgedb.jpg';
import nodejs from '../public/technologies/nodejs.png';
import postgres from '../public/technologies/postgresql.png';
import react from '../public/technologies/reactjs.png';
import tailwind from '../public/technologies/tailwind.png';
import typescript from '../public/technologies/typescript.png';
import vue from '../public/technologies/vue-three.png';

import bullmq from '../public/technologies/bullmq.png';
import nextjs from '../public/technologies/nextjs.png';
import redis from '../public/technologies/redis.png';

// Company logos - Static imports
import evans from '../public/companies/evans-consoles-logo.jpeg';
import launchcode from '../public/companies/launchcode.png';
import opit from '../public/companies/opit.png';

// Project images - Static imports
import freqtrade from '../public/projects/freqtrade-logo.png';
import solvexdigital from '../public/projects/solvex-digital.svg';
import teevision from '../public/projects/tee-vision.png';

// Service icons (engineering focus) - Static imports
import backendAutomationErp from '../public/engineering-focus/backendAutomationErp.png';
import devopsInfrastructure from '../public/engineering-focus/devopsInfrastructure.png';
import frontendDeveloper from '../public/engineering-focus/frontendDeveloper.png';
import fullStackDeveloper from '../public/engineering-focus/fullStackDeveloper.png';

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
  {
    id: 'blog',
    title: 'Blog',
  },
];

const services: Service[] = [
  {
    title: 'Full Stack Developer',
    icon: fullStackDeveloper,
  },
  {
    title: 'Frontend Developer',
    icon: frontendDeveloper,
  },
  {
    title: 'Backend Automation & ERP',
    icon: backendAutomationErp,
  },
  {
    title: 'DevOps & Infrastructure',
    icon: devopsInfrastructure,
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
      'Developed <strong>40+ custom KPI reports and 10 real-time dashboards</strong>, replacing multi-week manual reporting with live insights and saving thousands of labor hours annually across departments. Resolved <strong>$2M+</strong> in inventory discrepancies within finance and engineered the underlying reporting infrastructure to ensure fast, reliable, and secure data access company-wide.',
      'Developed a full-stack <strong>Bill of Materials platform</strong>, translating complex 3D CAD outputs into actionable manufacturing instructions, dramatically improving shop floor accuracy.',
      'Implemented a dynamic <strong>budgeting and forecasting system</strong> (P3), enhancing financial predictability and profitability analysis.',
      'Designed and deployed a full-stack automation and monitoring system (<strong>BullMQ</strong>), automating ERP workflows (user sync, project imports, commissions) and building custom <strong>Axapta (Dynamics AX ERP) modules</strong> across finance, inventory, sales, production, and other core business operations.',
      'Automated operational accountability with a custom <strong>issue-tracking system</strong> and engineered a <strong>real-time inventory tracking platform</strong>, displaying live locations of products worldwide through an interactive mapping system.',
      'Refactored and optimized infrastructure, achieving a <strong>20x deployment speed improvement</strong> and migrating core systems from React to Vue.',
    ],
  },
  {
    title: 'Full Stack Developer',
    company_name: 'One Piece IT',
    icon: opit,
    iconBg: '#383E56',
    date: 'May 2023 - December 2023',
    points: [
      'Built and optimized web and mobile applications, improving performance by <strong>30%</strong> and boosting user satisfaction by <strong>25%</strong>',
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
      'Aiden was instrumental in helping us build a robust directory for the oil and gas industry. He brought strong technical skills and was easy to work with throughout the project.',
    name: 'Daniel Kernaghan',
    designation: 'CEO',
    company: 'Gadget Rentals',
  },
  {
    testimonial:
      'Aiden built the website for Spartatech Coatings from the ground up. He delivered exactly what I needed with speed and professionalism.',
    name: 'Liam Hennessey',
    designation: 'CEO',
    company: 'Spartatech Coatings',
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
      'Founded and operated a digital agency delivering full-stack web applications, GPT-powered AI integrations, and SEO solutions. Led 8 client projects from planning to deployment.',
    tags: [
      {
        name: 'Next.js',
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
      'Design custom T-shirts in stunning 3D! Built with React, ThreeJS, TailwindCSS, Framer Motion, and DALLE AI. Features real-time 3D rendering, custom color palettes, and downloadable designs.',
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
      'Built a containerized cryptocurrency trading system using the Freqtrade framework with custom Python strategies. Implemented dual-asset selection algorithm and advanced technical indicators.',
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
    image: freqtrade,
    source_code_link: 'https://github.com',
  },
  {
    name: 'E-Commerce Analytics Dashboard',
    description:
      'Real-time analytics platform for e-commerce businesses with advanced data visualization, sales forecasting, and customer behavior insights. Built with modern React and powerful backend APIs.',
    tags: [
      {
        name: 'React',
        color: 'blue-text-gradient',
      },
      {
        name: 'Node.js',
        color: 'green-text-gradient',
      },
      {
        name: 'PostgreSQL',
        color: 'pink-text-gradient',
      },
      {
        name: 'AWS',
        color: 'orange-text-gradient',
      },
    ],
    image: react,
    source_code_link: 'https://github.com',
  },
  {
    name: 'AI-Powered Content Generator',
    description:
      'Intelligent content creation platform leveraging GPT models for automated blog writing, social media posts, and marketing copy. Features custom templates and SEO optimization.',
    tags: [
      {
        name: 'TypeScript',
        color: 'blue-text-gradient',
      },
      {
        name: 'OpenAI',
        color: 'green-text-gradient',
      },
      {
        name: 'Next.js',
        color: 'pink-text-gradient',
      },
      {
        name: 'TailwindCSS',
        color: 'orange-text-gradient',
      },
    ],
    image: typescript,
    source_code_link: 'https://github.com',
  },
  {
    name: 'Real-Time Chat Application',
    description:
      'Scalable messaging platform with real-time communication, file sharing, and group management. Built with WebSocket technology and modern UI frameworks.',
    tags: [
      {
        name: 'Vue.js',
        color: 'green-text-gradient',
      },
      {
        name: 'WebSocket',
        color: 'blue-text-gradient',
      },
      {
        name: 'Redis',
        color: 'pink-text-gradient',
      },
      {
        name: 'Docker',
        color: 'orange-text-gradient',
      },
    ],
    image: vue,
    source_code_link: 'https://github.com',
  },
  {
    name: 'DevOps Monitoring Suite',
    description:
      'Comprehensive infrastructure monitoring solution with custom dashboards, automated alerts, and performance analytics. Deployed across multiple cloud environments.',
    tags: [
      {
        name: 'AWS',
        color: 'orange-text-gradient',
      },
      {
        name: 'Docker',
        color: 'blue-text-gradient',
      },
      {
        name: 'Node.js',
        color: 'green-text-gradient',
      },
      {
        name: 'Monitoring',
        color: 'pink-text-gradient',
      },
    ],
    image: aws,
    source_code_link: 'https://github.com',
  },
  {
    name: 'Blockchain Voting System',
    description:
      'Secure and transparent voting platform built on blockchain technology. Features voter verification, real-time results, and immutable vote tracking for enhanced election integrity.',
    tags: [
      {
        name: 'Blockchain',
        color: 'blue-text-gradient',
      },
      {
        name: 'React',
        color: 'green-text-gradient',
      },
      {
        name: 'Smart Contracts',
        color: 'pink-text-gradient',
      },
      {
        name: 'Web3',
        color: 'orange-text-gradient',
      },
    ],
    image: nodejs,
    source_code_link: 'https://github.com',
  },
];

export { experiences, projects, services, technologies, testimonials };
