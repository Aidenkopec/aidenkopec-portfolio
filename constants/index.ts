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
import digitaldreamscapes from '../public/projects/digital-dreamscapes.png';
import freqtrade from '../public/projects/freqtrade-logo.png';
import iwinparlays from '../public/projects/i-win-parlays.png';
import idotogether from '../public/projects/idotogether.png';
import n8n from '../public/projects/n8n.png';
import pdconstruction from '../public/projects/pd-construction.png';
import relfeild from '../public/projects/relfeild.png';
import solvexdigital from '../public/projects/solvex-digital.svg';
import summalink from '../public/projects/summalink.png';
import teevision from '../public/projects/tee-vision.png';
import victoriaandriley from '../public/projects/vic-riley-wedding.png';

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

interface Project {
  name: string;
  description: string;
  image?: any;
  link: string | null;
  isGitHub: boolean;
}

// Social links
export const GITHUB_URL = 'https://github.com/Aidenkopec';

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
    name: 'Solvex Digital',
    description:
      'Founded and operated a digital agency delivering full-stack web applications, GPT-powered AI integrations, and SEO solutions. Led 8 client projects from planning to deployment.',
    image: solvexdigital,
    link: 'https://solvexdigital.com',
    isGitHub: false,
  },
  {
    name: 'Teevision',
    description:
      'Design custom T-shirts in stunning 3D! Built with React, ThreeJS, TailwindCSS, Framer Motion, and DALLE AI. Features real-time 3D rendering, custom color palettes, and downloadable designs.',
    image: teevision,
    link: 'https://teevision.netlify.app',
    isGitHub: false,
  },
  {
    name: 'Cryptocurrency Trading Bot',
    description:
      'Built a containerized cryptocurrency trading system using the Freqtrade framework with custom Python strategies. Implemented dual-asset selection algorithm and advanced technical indicators.',
    image: freqtrade,
    link: 'https://github.com/Aidenkopec/crypto-bot-trading',
    isGitHub: true,
  },
  {
    name: 'I Do Together',
    description:
      'A company selling digital wedding websites. Features include RSVP and reservation management, guest tracking, allergy tracking, and song request submissions to fully digitalize weddings.',
    link: 'https://www.idotogether.com',
    image: idotogether,
    isGitHub: false,
  },
  {
    name: 'I Win Parlays',
    description:
      'Sports betting app that generates optimized parlays, providing analysis, probabilities, and detailed reasoning for each pick.',
    link: 'https://www.iwinparlays.com',
    image: iwinparlays,
    isGitHub: false,
  },
  {
    name: 'Relfeild',
    description:
      'Oilfield directory and accountability platform for oil & gas companies. Users can leave and view reviews, check hours, services, and contact details.',
    link: 'https://oil-gas-ochre.vercel.app',
    image: relfeild,
    isGitHub: false,
  },
  {
    name: 'Digital Dream Scapes',
    description:
      'AI image generation community platform where users can create AI art and share it within a community feed.',
    link: 'https://digital-dreamscapes.netlify.app/',
    isGitHub: false,
    image: digitaldreamscapes,
  },
  {
    name: 'Pivot Tools',
    description:
      'Corporate website for Pivot Tools, an oilfield tool rental company showcasing services and offerings.',
    link: null,
    isGitHub: false,
  },
  {
    name: 'Sparta Tech Coatings',
    description:
      'Website for Sparta Tech Coatings, a company specializing in epoxy flooring solutions.',
    link: null,
    isGitHub: false,
  },
  {
    name: 'PD Construction',
    description:
      'Corporate website for PD Construction, featuring small-scale construction services like fences, sheds, and more.',
    link: 'https://www.pdconstruction.ca',
    isGitHub: false,
    image: pdconstruction,
  },
  {
    name: 'Dribbble Clone',
    description:
      'A functional Dribbble clone with user authentication, image posting, and project showcase capabilities.',
    link: 'https://github.com/Aidenkopec/dribbble-clone',
    isGitHub: true,
  },
  {
    name: 'Article Summarizer',
    description:
      'AI-powered app using GPT to summarize long-form articles into concise, readable insights.',
    link: 'https://summalink.netlify.app/',
    isGitHub: false,
    image: summalink,
  },
  {
    name: 'n8n Workflows',
    description:
      'Collection of automation workflows built with n8n for task automation and system integrations.',
    link: 'https://github.com/Aidenkopec/n8n-workflows',
    isGitHub: true,
    image: n8n,
  },
  {
    name: 'Victoria & Riley Wedding Website',
    description:
      'Custom wedding website designed for Victoria and Riley. Includes event schedule, RSVP functionality, and registry details.',
    link: null,
    isGitHub: false,
    image: victoriaandriley,
  },
];

export { experiences, projects, services, technologies, testimonials };
