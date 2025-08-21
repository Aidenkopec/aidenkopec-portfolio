# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the production application
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linting

## Architecture Overview

This is a personal portfolio website built with Next.js 15 (App Router) showcasing a full-stack software developer's work and experience.

### Core Technologies
- **Framework**: Next.js 15 with App Router and Turbopack
- **Styling**: TailwindCSS 4 with custom theme system
- **UI Library**: shadcn/ui components with Radix UI primitives
- **3D Graphics**: React Three Fiber with Drei helpers for canvas components
- **Animations**: Framer Motion for smooth transitions
- **Email**: React Email with Resend for contact form
- **Theme System**: next-themes with 5 custom themes (obsidian, cosmicVoyage, midnightBlue, deepForest, crimsonFire)

### Project Structure

**Core Pages**:
- `app/page.tsx` - Main portfolio landing page with all sections
- `app/layout.tsx` - Root layout with theme providers and global metadata

**API Routes**:
- `app/api/contact/route.ts` - Contact form submission with email notifications
- `app/api/github/route.ts` - GitHub integration for project data

**Component Architecture**:
- `components/` - Main UI components (Hero, About, Experience, Tech, Projects, etc.)
- `components/canvas/` - Three.js 3D components (Earth, Stars, Ball, Computers)
- `components/ui/` - shadcn/ui components 
- `components/emails/` - React Email templates
- `components/magicui/` - Enhanced UI components (confetti)

**Core Systems**:
- `context/MusicContext.tsx` - Global music player state management
- `lib/github-service.ts` - GitHub API integration with caching
- `constants/index.ts` - Static data (experiences, projects, technologies, testimonials)

### Key Features

**Theme System**: Five custom themes with CSS variables defined in globals.css. Theme switching via next-themes provider.

**3D Canvas Components**: Interactive 3D elements using React Three Fiber:
- Animated 3D computer model in Hero section
- Floating tech balls in Tech section  
- Animated Earth globe in Contact section
- Particle star field background

**Music Player**: Global floating music bar with context state management across the entire app.

**GitHub Integration**: Server-side GitHub API calls with caching for dynamic project data fetching.

**Contact System**: Full email workflow with user acknowledgment and admin notification emails using React Email templates.

### Development Notes

**Image Optimization**: Next.js image optimization configured with WebP/AVIF formats and custom device sizes in next.config.ts.

**shadcn/ui Integration**: Configured in components.json with path aliases and New York style variant.

**Static Assets**: All images statically imported in constants/index.ts for Next.js optimization.

**TypeScript**: Strict TypeScript configuration with comprehensive type definitions for all data structures.

**Styling Approach**: Utility-first with TailwindCSS, custom CSS variables for themes, and Framer Motion for animations.