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
      'Design <strong>40+ custom reports and 10 live dashboards</strong> eliminating manual data compilation and uncovering significant inventory discrepancies.',
      'Spearhead <strong>real-time budget tracking</strong> and profitability analysis platform for executive decision-making.',
      'Developed <strong>real-time inventory tracking system</strong> with Apple MapKit, displaying exact product locations worldwide through interactive maps.',
      'Engineer BullMQ-based task orchestration system automating data synchronization, system integrations, and business workflows, achieving <strong>20x</strong> performance improvement.',
      'Built comprehensive quality tracking and process compliance system that monitors operational standards across all departments.',
    ],
  },
  {
    title: 'IT Support Specialist',
    company_name: 'One Piece IT',
    icon: opit,
    iconBg: '#383E56',
    date: 'May 2023 - December 2023',
    points: [
      'Developed <strong>Windows and Linux shell scripts</strong> for <strong>system automation</strong>, streamlining processes and reducing manual work.',
      'Configured network architecture and server infrastructure, building foundational expertise in system administration.',
    ],
  },
  {
    title: 'Software Developer Intern',
    company_name: 'Launchcode',
    icon: launchcode,
    iconBg: '#383E56',
    date: 'April 2022 - December 2022',
    points: [
      '<strong>Managed team of 5 developers</strong> over <strong>6-month capstone project</strong> creating quote-to-cash platform for Oil and Gas sector.',
      'Developed full-stack solution using <strong>React, TypeScript, Node.js, and PostgreSQL</strong> while coordinating cross-functional team efforts.',
      'Facilitated requirements gathering and client communication, translating business needs into actionable development tasks.',
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
      'Custom software agency I founded, building AI-powered web applications and automation solutions for business clients. Specializes in full-stack development with React, Next.js, and EdgeDB, creating systems that automate workflows and solve operational challenges.',
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
      'Wedding planning platform that centralizes guest management, RSVP tracking, and event coordination. Built with real-time updates allowing couples to manage invitations, track attendance, and communicate with guests from a single dashboard.',
    link: 'https://www.idotogether.com',
    image: idotogether,
    isGitHub: false,
  },
  {
    name: 'I Win Parlays',
    description:
      'Sports betting analytics platform using AI to analyze odds and calculate probabilities. Generates parlay recommendations with transparent win/loss reasoning and statistical analysis to help users make informed betting decisions.',
    link: 'https://www.iwinparlays.com',
    image: iwinparlays,
    isGitHub: false,
  },
  {
    name: 'Relfeild',
    description:
      'Oilfield contractor directory platform connecting companies with service providers. Features verified reviews, service hour tracking, and contact management to help companies find and vet contractors for projects.',
    link: 'https://oil-gas-ochre.vercel.app',
    image: relfeild,
    isGitHub: false,
  },
  {
    name: 'Digital Dream Scapes',
    description:
      'AI art generation platform with integrated social features. Users create AI-generated artwork, share their creations with the community, and explore content from other artists in a collaborative creative space.',
    link: 'https://digital-dreamscapes.netlify.app/',
    isGitHub: false,
    image: digitaldreamscapes,
  },
  {
    name: 'Pivot Tools',
    description:
      'Corporate website built for Pivot Tools, an oilfield equipment rental company. Showcases available equipment, services, and contact information to generate leads and streamline the rental inquiry process.',
    link: null,
    isGitHub: false,
  },
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
