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
      'Founded and operated Solvex Digital, a custom software agency delivering AI-powered web applications and automation solutions to diverse business clients. Specialized in React/Next.js development with EdgeDB integration, creating intelligent systems that streamline workflows and drive operational efficiency.',
    image: solvexdigital,
    link: 'https://solvexdigital.com',
    isGitHub: false,
  },
  {
    name: 'Teevision',
    description:
      'Interactive 3D t-shirt design platform that brings creative ideas to life instantly. Users experiment with unlimited design combinations using photorealistic 3D preview technology, eliminating guesswork and enabling perfect customization before ordering.',
    image: teevision,
    link: 'https://teevision.netlify.app',
    isGitHub: false,
  },
  {
    name: 'Cryptocurrency Trading Bot',
    description:
      'Automated trading system that executes 24/7 profitable crypto strategies without human emotion or error. Advanced algorithms analyze market patterns to maximize returns while minimizing risk exposure.',
    image: freqtrade,
    link: 'https://github.com/Aidenkopec/crypto-bot-trading',
    isGitHub: true,
  },
  {
    name: 'I Do Together',
    description:
      'Complete wedding digitalization platform that transforms chaotic planning into organized celebration management. Couples centralize guest communication, automate RSVP collection, track attendance in real-time, and coordinate every wedding detail in one streamlined dashboard.',
    link: 'https://www.idotogether.com',
    image: idotogether,
    isGitHub: false,
  },
  {
    name: 'I Win Parlays',
    description:
      'AI-driven sports betting platform that turns casual bettors into profitable players. Advanced analytics and probability calculations deliver optimized parlay recommendations with transparent win reasoning.',
    link: 'https://www.iwinparlays.com',
    image: iwinparlays,
    isGitHub: false,
  },
  {
    name: 'Relfeild',
    description:
      'Comprehensive oilfield accountability platform that eliminates unreliable contractor headaches. Companies instantly access verified reviews, service hours, and contact details to make confident hiring decisions.',
    link: 'https://oil-gas-ochre.vercel.app',
    image: relfeild,
    isGitHub: false,
  },
  {
    name: 'Digital Dream Scapes',
    description:
      'AI-powered creative community where artists explore imagination without limits. Users generate professional-quality AI artwork, share creations with fellow artists, and discover endless inspiration through an integrated social platform designed for creative collaboration.',
    link: 'https://digital-dreamscapes.netlify.app/',
    isGitHub: false,
    image: digitaldreamscapes,
  },
  {
    name: 'Pivot Tools',
    description:
      'High-converting corporate website that transformed Pivot Tools into the go-to oilfield equipment rental choice. Streamlined service showcase drives qualified leads and accelerates sales cycles.',
    link: null,
    isGitHub: false,
  },
  {
    name: 'Sparta Tech Coatings',
    description:
      'Lead-generating website that positions Sparta Tech as the premium epoxy flooring authority. Professional showcase converts visitors into high-value customers seeking quality coating solutions.',
    link: null,
    isGitHub: false,
  },
  {
    name: 'PD Construction',
    description:
      'Revenue-driving website that transforms PD Construction from local contractor to trusted construction authority. Showcases quality craftsmanship that attracts premium residential and commercial projects.',
    link: 'https://www.pdconstruction.ca',
    isGitHub: false,
    image: pdconstruction,
  },
  // {
  //   name: 'Dribbble Clone',
  //   description:
  //     'Feature-rich creative portfolio platform built for professional designers who demand complete presentation control. Authenticated users upload high-resolution work, organize projects into custom collections, and showcase their creative expertise through a clean, modern interface.',
  //   link: 'https://github.com/Aidenkopec/dribbble-clone',
  //   isGitHub: true,
  // },
  {
    name: 'Article Summarizer',
    description:
      'Time-saving AI tool that transforms hours of reading into minutes of insight. Professionals extract key information from lengthy articles instantly, boosting productivity and decision-making speed.',
    link: 'https://summalink.netlify.app/',
    isGitHub: false,
    image: summalink,
  },
  {
    name: 'n8n Workflows',
    description:
      'Comprehensive collection of n8n automation workflows and templates for streamlining business processes. Pre-built integrations connect popular tools and services, providing developers and businesses with ready-to-use automation solutions and implementation examples.',
    link: 'https://github.com/Aidenkopec/n8n-workflows',
    isGitHub: true,
    image: n8n,
  },
  {
    name: 'Victoria & Riley Wedding Website',
    description:
      'Elegant custom wedding platform that transformed chaotic planning into seamless coordination. Personalized design with RSVP management and registry integration created the perfect celebration experience.',
    link: null,
    isGitHub: false,
    image: victoriaandriley,
  },
];

export { experiences, projects, services, technologies, testimonials };
