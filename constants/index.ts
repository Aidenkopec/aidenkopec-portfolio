import type { StaticImageData } from 'next/image';

// Company logos - Static imports
import evans from '@/public/companies/evans-consoles-logo.jpeg';
import idotogetherlogo from '@/public/companies/idotogether-logo.webp';
import launchcode from '@/public/companies/launchcode.png';
import opit from '@/public/companies/opit-logo.png';
import solvexlogo from '@/public/companies/solvex-logo.svg';

// Project images - Static imports
import hennessy from '@/public/projects/hennessy.webp';
import idotogether from '@/public/projects/idotogether.webp';
import pdconstruction from '@/public/projects/pd-construction.webp';
import portfolioSite from '@/public/projects/portfolio.webp';
import profileCard from '@/public/projects/profile-card.webp';
import spartatech from '@/public/projects/sparta-tech.webp';
import treeline from '@/public/projects/treeline.webp';

// Service icons (engineering focus) - Static imports
import backendAutomationErp from '@/public/engineering-focus/backendAutomationErp.png';
import devopsInfrastructure from '@/public/engineering-focus/devopsInfrastructure.png';
import frontendDeveloper from '@/public/engineering-focus/frontendDeveloper.png';
import fullStackDeveloper from '@/public/engineering-focus/fullStackDeveloper.png';

// Type definitions
interface NavLink {
  id: string;
  title: string;
}

interface Service {
  title: string;
  icon: StaticImageData;
}

interface Technology {
  name: string;
  /** Single colour logo in public/, drawn as a CSS mask so it can be tinted. */
  icon: string;
  /** Brand colour, lightened where the official one is too dark on glass. */
  color: string;
}

interface Experience {
  title: string;
  companyName: string;
  icon: StaticImageData;
  iconBg: string;
  date: string;
  points: string[];
}

type ProjectTier = 'featured' | 'personal' | 'client';

interface ProjectLink {
  href: string;
  label: string;
  kind: 'live' | 'source';
}

interface ProjectMetric {
  value: string;
  label: string;
}

interface Project {
  slug: string;
  name: string;
  tier: ProjectTier;
  /** One line shown on the showcase card. Keep it under ten words. */
  blurb: string;
  /** Featured tier only. */
  tagline?: string;
  description: string;
  /** Featured tier only. Rendered as a four column row, so keep it to four. */
  metrics?: ProjectMetric[];
  stack: string[];
  links: ProjectLink[];
  image: StaticImageData;
  /** Renders the "source private" note in place of a source link. */
  sourcePrivate?: boolean;
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

// Logos from simple-icons (CC0), except BullMQ which is not in the set.
const technologies: Technology[] = [
  // Frontend
  { name: 'Next.js', icon: '/technologies/nextdotjs.svg', color: '#FFFFFF' },
  { name: 'React', icon: '/technologies/react.svg', color: '#61DAFB' },
  {
    name: 'TypeScript',
    icon: '/technologies/typescript.svg',
    color: '#4A9BEA',
  },
  {
    name: 'Tailwind CSS',
    icon: '/technologies/tailwindcss.svg',
    color: '#06B6D4',
  },
  { name: 'Vue 3', icon: '/technologies/vuedotjs.svg', color: '#4FC08D' },

  // Backend
  { name: 'Node.js', icon: '/technologies/nodedotjs.svg', color: '#6CC24A' },
  { name: 'BullMQ', icon: '/technologies/bullmq.png', color: '#F25C54' },
  { name: 'Redis', icon: '/technologies/redis.svg', color: '#FF4438' },

  // Databases
  {
    name: 'PostgreSQL',
    icon: '/technologies/postgresql.svg',
    color: '#6B8FF0',
  },
  { name: 'Python', icon: '/technologies/python.svg', color: '#FFD43B' },

  // DevOps
  {
    name: 'AWS',
    icon: '/technologies/amazonwebservices.svg',
    color: '#FF9900',
  },
  { name: 'Docker', icon: '/technologies/docker.svg', color: '#2496ED' },
];

const experiences: Experience[] = [
  {
    title: 'Full-Stack Developer',
    companyName: 'Evans Consoles',
    icon: evans,
    iconBg: '#FFFFFF',
    date: 'January 2024 - Present',
    points: [
      'Consolidated a separate reporting app into the core platform, <strong>retiring a parallel React codebase</strong>, and rebuilt <strong>40+ reports</strong> and <strong>15+ dashboards</strong> in <strong>Vue 3</strong> for <strong>300+ staff</strong>.',
      'Rebuilt the month-end <strong>Vertical Market Report</strong>, cutting it from weeks of manual assembly to <strong>15 seconds</strong>.',
      "Built the <strong>Project Budget Tracker</strong>, one of the platform's largest modules, replacing a shared Excel workbook that produced version conflicts, lost files, and hours of re-entry with shared editing, audit history, and ERP integration.",
      "Built the <strong>Bill of Materials costing</strong> app, turning the modeling software's raw Excel export into the revision-tracked BoM the shop floor builds from.",
      'Replaced manual identity and ERP data sync with a <strong>BullMQ and Redis worker engine</strong>, moving LDAP joiner and leaver provisioning and <strong>MySQL to PostgreSQL replication</strong> onto an unattended daily cron.',
      "Integrated <strong>Microsoft Entra</strong> SSO over <strong>OIDC</strong> into another team's PHP ProcessMaker fork and <strong>Angular</strong> suite.",
      'Review pull requests both ways with the senior developers, and wrote the API docs the other Evans teams build on.',
    ],
  },
  {
    title: 'Full-Stack Developer',
    companyName: 'iDoTogether',
    icon: idotogetherlogo,
    iconBg: '#FDFBF7',
    date: 'July 2025 - Present',
    points: [
      'Built and operate <strong>iDoTogether</strong>, a wedding planning SaaS on <strong>Next.js</strong>, <strong>Supabase</strong>, and Vercel, live since May 2026 with 400+ users and paying customers, and handle their support and feedback directly.',
      'Built the guest photo board: guests upload on reception Wi-Fi with browser-side compression and resumable uploads, and a live slideshow runs on <strong>Supabase Realtime</strong>, covered by <strong>Vitest</strong> and rate limited by Vercel WAF.',
      'Built the <strong>Stripe</strong> billing path with webhook signature verification and two-layer idempotency, so duplicate deliveries are no-ops rather than double charges.',
    ],
  },
  {
    title: 'Full-Stack Developer (Contract)',
    companyName: 'Solvex Digital',
    icon: solvexlogo,
    iconBg: '#FFFFFF',
    date: 'November 2024 - August 2026',
    points: [
      'Delivered five client sites in <strong>Next.js</strong> on Vercel, scoping each with the client, including a CMS-backed inventory system for an automotive collection.',
    ],
  },
  {
    title: 'Technology Consultant (Contract)',
    companyName: 'One Piece IT',
    icon: opit,
    iconBg: '#383E56',
    date: 'May 2023 - December 2023',
    points: [
      'Automated client server and network provisioning in <strong>Bash</strong> and <strong>PowerShell</strong>, replacing repeated manual setup.',
    ],
  },
  {
    title: 'Software Developer Intern',
    companyName: 'Launchcode',
    icon: launchcode,
    iconBg: '#383E56',
    date: 'April 2022 - December 2022',
    points: [
      "Led a 5-person team under Launchcode's senior developers to ship a quote-to-cash platform in <strong>React</strong> and <strong>Node.js</strong> for an oil and gas customer.",
    ],
  },
];

const projects: Project[] = [
  {
    slug: 'treeline',
    name: 'Treeline',
    tier: 'featured',
    blurb: 'Real ski mountains in 3D, with true run steepness.',
    tagline:
      'Resort trail maps are stylized panoramas. They flatten the mountain and hide how steep anything actually is.',
    description:
      "Treeline renders the real mountain in 3D from elevation data, draws the marked runs in their true positions, and computes each run's pitch, aspect, vertical and length from the elevation model rather than reading them off a trail map. All the math runs at build time and is fully unit tested. The web app just reads the baked artifacts, with no database behind it.",
    metrics: [
      { value: '6', label: 'resorts baked' },
      { value: '422', label: 'tests green' },
      { value: '393k', label: 'vertex mesh at 60fps' },
      { value: '30m', label: 'elevation resolution' },
    ],
    stack: ['TypeScript', 'Next.js', 'React Three Fiber', 'Tailwind', 'Vitest'],
    links: [
      {
        href: 'https://treeline.aidenkopec.com',
        label: 'Visit live',
        kind: 'live',
      },
      {
        href: 'https://github.com/Aidenkopec/Treeline',
        label: 'Read the source',
        kind: 'source',
      },
    ],
    image: treeline,
  },
  {
    slug: 'idotogether',
    name: 'iDoTogether',
    tier: 'featured',
    blurb: 'Wedding planning SaaS for couples, families and vendors.',
    tagline:
      'A wedding has a hundred moving parts, and most couples track them in a spreadsheet three people are editing at once.',
    description:
      'A wedding planning SaaS covering guests and RSVP, vendors, budget, timeline, seating, checklists and a live guest photo board. Four roles share one workspace through a capability based permission layer. Photos compress and transcode in the browser before they upload, because the constraint the whole module is designed around is congested reception WiFi.',
    metrics: [
      { value: '400+', label: 'users' },
      { value: '11', label: 'feature modules' },
      { value: '30', label: 'Postgres tables' },
      { value: 'May 2026', label: 'in production since' },
    ],
    stack: ['Next.js', 'TypeScript', 'Drizzle', 'Supabase', 'Stripe', 'Vercel'],
    links: [
      {
        href: 'https://www.idotogether.com',
        label: 'Visit live',
        kind: 'live',
      },
    ],
    image: idotogether,
    sourcePrivate: true,
  },
  {
    slug: 'profile-card',
    name: 'GitHub Profile Card',
    tier: 'personal',
    blurb: 'My GitHub profile card, rendered by a Python cron.',
    description:
      'The card at the top of my GitHub profile is an SVG rendered by a Python script on a six hour cron. It probes each service for status and latency, then pulls repo, commit and language figures from the GitHub API. A row whose measurement fails is dropped rather than defaulted or carried over, and a service that fails its probe prints the status instead of quietly vanishing. Standard library only, so CI needs no install step.',
    stack: ['Python', 'GitHub Actions', 'SVG'],
    links: [
      {
        href: 'https://github.com/Aidenkopec',
        label: 'See it live',
        kind: 'live',
      },
      {
        href: 'https://github.com/Aidenkopec/Aidenkopec',
        label: 'Read the source',
        kind: 'source',
      },
    ],
    image: profileCard,
  },
  {
    slug: 'portfolio',
    name: 'This Portfolio',
    tier: 'personal',
    blurb: 'This site. Next.js, React Three Fiber, MDX blog.',
    description:
      'The site you are reading right now. Next.js App Router with server components, cached GitHub data and an MDX blog. Four themes switch at runtime through CSS variables, and the 3D scenes run on React Three Fiber. The source is public, including the parts I would rewrite.',
    stack: ['Next.js', 'TypeScript', 'React Three Fiber', 'MDX', 'Tailwind'],
    links: [
      {
        href: 'https://www.aidenkopec.com',
        label: 'You are here',
        kind: 'live',
      },
      {
        href: 'https://github.com/Aidenkopec/aidenkopec-portfolio',
        label: 'Read the source',
        kind: 'source',
      },
    ],
    image: portfolioSite,
  },
  {
    slug: 'hennessy-automotive',
    name: 'Hennessy Automotive',
    tier: 'client',
    blurb: 'Dealership site for a rare and collector vehicle dealer.',
    description:
      'A dealership site for a rare and collector vehicle dealer in southern Alberta. The inventory is CMS backed, so staff list, update and mark vehicles sold themselves without a developer.',
    stack: ['Next.js', 'TypeScript', 'Sanity', 'Vercel'],
    links: [
      {
        href: 'https://hennessy-automotive.vercel.app',
        label: 'Visit site',
        kind: 'live',
      },
    ],
    image: hennessy,
    sourcePrivate: true,
  },
  {
    slug: 'sparta-tech-coatings',
    name: 'Sparta Tech Coatings',
    tier: 'client',
    blurb: 'Lead generation site for a concrete coatings contractor.',
    description:
      'A lead generation site for a Calgary concrete coatings contractor. Service pages, a project gallery, online booking and quote capture.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Vercel'],
    links: [
      {
        href: 'https://spartatech-coatings.vercel.app',
        label: 'Visit site',
        kind: 'live',
      },
    ],
    image: spartatech,
    sourcePrivate: true,
  },
  {
    slug: 'pd-construction',
    name: 'PD Construction',
    tier: 'client',
    blurb: 'Site for a backyard decks and fences builder.',
    description:
      'A site for a backyard structures builder. Decks, sheds, fences and custom woodwork, with a project portfolio and quote requests.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Vercel'],
    links: [
      {
        href: 'https://www.pdconstruction.ca',
        label: 'Visit site',
        kind: 'live',
      },
    ],
    image: pdconstruction,
    sourcePrivate: true,
  },
];

export { experiences, projects, services, technologies };
export type {
  Experience,
  NavLink,
  Project,
  ProjectLink,
  ProjectMetric,
  ProjectTier,
  Service,
  Technology,
};
