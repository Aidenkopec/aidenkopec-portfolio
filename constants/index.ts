// Technology icons - Static imports for Next.js optimization
import aws from '../public/technologies/aws.png';
import docker from '../public/technologies/docker.png';
import nodejs from '../public/technologies/nodejs.png';
import postgres from '../public/technologies/postgresql.png';
import python from '../public/technologies/python.png';
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
import idotogether from '../public/projects/idotogether.webp';
import n8n from '../public/projects/n8n.png';
import pdconstruction from '../public/projects/pd-construction.png';
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
    title: 'Full-Stack Engineer',
    icon: fullStackDeveloper,
  },
  {
    title: 'Backend Engineer',
    icon: backendAutomationErp,
  },
  {
    title: 'Systems & API Design',
    icon: frontendDeveloper,
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
  { name: 'Python', icon: python },

  // DevOps
  { name: 'AWS', icon: aws },
  { name: 'Docker', icon: docker },
];

const experiences: Experience[] = [
  {
    title: 'Full-Stack Developer',
    company_name: 'Evans Consoles',
    icon: evans,
    iconBg: '#E6DEDD',
    date: 'January 2024 - Present',
    points: [
      'Engineered an <strong>SSH-tunneled, pooled Sequelize client</strong> giving the core Node API live access to a remote ProcessMaker MySQL workflow database, hardened with TCP keepalives, automatic reconnection, and exponential backoff with jitter.',
      'Designed and shipped a <strong>Project Budget Tracker</strong> replacing a shared Excel workbook with a live multi-user tracker featuring shared editing, full audit history, and direct ERP integration.',
      'Delivered <strong>ERP integrations across 9 business domains</strong>, including a <strong>Bill of Materials costing system</strong>, establishing database layers and UIs exposing legacy data for production visibility.',
      'Consolidated a standalone reporting application into the core platform, retiring a parallel codebase while modernizing <strong>40+ reports</strong> and <strong>15+ live dashboards</strong> into a fast, searchable UI used by <strong>300+ staff</strong>.',
      'Replaced manual identity and ERP data sync for <strong>400 staff</strong> with a <strong>BullMQ and Redis worker engine</strong> running 10 sandboxed processors for LDAP joiner/leaver provisioning, ERP project ingestion, MySQL-to-PostgreSQL replication, and scheduled PDF reporting with graceful SIGTERM/SIGINT shutdown and 7-day job retention.',
    ],
  },
  {
    title: 'Technology Consultant',
    company_name: 'One Piece IT',
    icon: opit,
    iconBg: '#383E56',
    date: 'May 2023 - December 2023',
    points: [
      'Developed <strong>Bash and PowerShell automation</strong> across client server and network environments, replacing repetitive system administration tasks with reusable, efficient scripts.',
    ],
  },
  {
    title: 'Software Developer Intern',
    company_name: 'Launchcode',
    icon: launchcode,
    iconBg: '#383E56',
    date: 'April 2022 - December 2022',
    points: [
      'Shipped user-facing flows and backend services across <strong>React, TypeScript, Node.js, and PostgreSQL</strong> for a production quote-to-cash platform, while serving as the technical liaison between a <strong>5-person development team</strong> and the engineering organization.',
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
      'Aiden built our website from scratch and nailed exactly what we were looking for. Professional, fast, and easy to work with. Would recommend him without hesitation.',
    name: 'Paxton Cote',
    designation: 'CEO',
    company: 'PD Construction',
  },
];

const projects: Project[] = [
  {
    name: 'Solvex Digital',
    description:
      'Custom software agency I founded, building AI-powered web applications and automation solutions for business clients. Specializes in full-stack development with React, Next.js, and PostgreSQL, creating systems that automate workflows and solve operational challenges.',
    image: solvexdigital,
    link: 'https://solvexdigital.com',
    isGitHub: false,
  },
  {
    name: 'Teevision',
    description:
      '3D t-shirt design platform built with Three.js allowing users to customize designs in real-time with photorealistic preview. Users can experiment with colors, patterns, and graphics before ordering their custom apparel.',
    image: teevision,
    link: 'https://teevision.netlify.app',
    isGitHub: false,
  },
  {
    name: 'Cryptocurrency Trading Bot',
    description:
      'Cryptocurrency trading bot built with Python and Freqtrade framework. Automates trading strategies using technical indicators and backtesting, executing trades 24/7 based on configured parameters and risk management rules.',
    image: freqtrade,
    link: 'https://github.com/Aidenkopec/crypto-bot-trading',
    isGitHub: true,
  },
  {
    name: 'I Do Together',
    description:
      'Full-stack wedding planning SaaS spanning 5+ planning modules (guests & RSVP, vendors, budgets, event timelines, tasks) with role-based collaboration. Features a Stripe-integrated billing system across 9 webhook types with idempotent writes and refund-triggered access revocation, a passwordless magic-link RSVP system, and a normalized PostgreSQL schema in Drizzle ORM backed by Supabase Auth.',
    link: 'https://www.idotogether.com',
    image: idotogether,
    isGitHub: false,
  },
  // {
  //   name: 'I Win Parlays',
  //   description:
  //     'Sports betting analytics platform using AI to analyze odds and calculate probabilities. Generates parlay recommendations with transparent win/loss reasoning and statistical analysis to help users make informed betting decisions.',
  //   link: 'https://www.iwinparlays.com',
  //   image: iwinparlays,
  //   isGitHub: false,
  // },
  // {
  //   name: 'Relfeild',
  //   description:
  //     'Oilfield contractor directory platform connecting companies with service providers. Features verified reviews, service hour tracking, and contact management to help companies find and vet contractors for projects.',
  //   link: 'https://oil-gas-ochre.vercel.app',
  //   image: relfeild,
  //   isGitHub: false,
  // },
  {
    name: 'Digital Dream Scapes',
    description:
      'AI art generation platform with integrated social features. Users create AI-generated artwork, share their creations with the community, and explore content from other artists in a collaborative creative space.',
    link: 'https://digital-dreamscapes.netlify.app/',
    isGitHub: false,
    image: digitaldreamscapes,
  },
  // {
  //   name: 'Pivot Tools',
  //   description:
  //     'Corporate website built for Pivot Tools, an oilfield equipment rental company. Showcases available equipment, services, and contact information to generate leads and streamline the rental inquiry process.',
  //   link: null,
  //   isGitHub: false,
  // },
  {
    name: 'Sparta Tech Coatings',
    description:
      'Business website for Sparta Tech Coatings, an epoxy flooring company. Features service offerings, project gallery, and contact forms to generate leads and showcase completed flooring installations.',
    link: null,
    isGitHub: false,
  },
  {
    name: 'PD Construction',
    description:
      'Construction company website for PD Construction showcasing residential and commercial projects. Features portfolio of completed work, service descriptions, and client testimonials to generate project inquiries.',
    link: 'https://www.pdconstruction.ca',
    isGitHub: false,
    image: pdconstruction,
  },
  {
    name: 'Article Summarizer',
    description:
      'AI-powered article summarization tool that extracts key information from lengthy content. Users input article URLs and receive condensed summaries highlighting the main points and insights.',
    link: 'https://summalink.netlify.app/',
    isGitHub: false,
    image: summalink,
  },
  {
    name: 'n8n Workflows',
    description:
      'Collection of n8n automation workflows and templates. Includes pre-built integrations and workflow examples for common automation tasks, available as open-source templates for developers to use and customize.',
    link: 'https://github.com/Aidenkopec/n8n-workflows',
    isGitHub: true,
    image: n8n,
  },
  {
    name: 'Victoria & Riley Wedding Website',
    description:
      'Custom wedding website built for Victoria & Riley featuring event details, RSVP management, and registry integration. Personalized design matching the couple\'s wedding theme and colors.',
    link: null,
    isGitHub: false,
    image: victoriaandriley,
  },
];

export { experiences, projects, services, technologies, testimonials };
