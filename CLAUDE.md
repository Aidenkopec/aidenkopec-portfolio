# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Aiden Kopec's portfolio website built with Next.js 15, React 19, TypeScript, and TailwindCSS 4. The site features an interactive 3D portfolio with Three.js components, a music player system, and modern animations using Framer Motion.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Architecture & Key Components

### TypeScript Migration Status
The project is currently undergoing a migration from JavaScript to TypeScript:
- **Old files (.js/.jsx)** are marked for deletion in git
- **New files (.ts/.tsx)** contain the migrated TypeScript versions
- All components have been migrated to TypeScript with proper type definitions

### Core Structure

**Main Application Flow:**
- `app/page.tsx` - Main page component with portfolio sections
- `components/index.ts` - Central component exports
- `constants/index.ts` - Portfolio data (experiences, projects, technologies)
- `context/MusicContext.tsx` - Global music player state management

**3D Components (Three.js):**
- `components/canvas/` - Contains 3D canvas components (Ball, Computers, Earth, Stars)
- Uses `@react-three/fiber` and `@react-three/drei` for Three.js integration
- `maath` library for 3D mathematics

**Music System:**
- `context/MusicContext.tsx` - React Context for music state
- `components/MusicPlayer.tsx` - Main music player component
- `components/FloatingMusicBar.tsx` - Floating music controls
- Supports keyboard shortcuts (Space, Ctrl+Arrow keys)
- Persists state to localStorage

**Portfolio Sections:**
- `Hero` - Landing section with 3D computer model
- `About` - Services and skills overview
- `Experience` - Professional timeline using react-vertical-timeline-component
- `Tech` - Technology stack with 3D ball components
- `Projects` - Portfolio projects with parallax tilt effects
- `Contact` - Contact form with EmailJS integration

### Styling & UI

**TailwindCSS 4:**
- Uses modern TailwindCSS 4 syntax
- Custom gradients and animations defined in styles
- `styles.ts` - Contains reusable CSS class combinations
- `utils/styles.ts` - Additional styling utilities

**Responsive Design:**
- Mobile-first approach with breakpoint utilities
- Custom responsive text scaling (xs, sm, md, lg)

### Key Dependencies

**Core Framework:**
- Next.js 15 with App Router
- React 19 with modern hooks
- TypeScript 5 for type safety

**3D & Animation:**
- @react-three/fiber - Three.js React renderer
- @react-three/drei - Three.js helpers and abstractions
- framer-motion - Smooth animations and transitions
- maath - 3D mathematics utilities

**UI Components:**
- react-parallax-tilt - Tilt effects for project cards
- react-vertical-timeline-component - Experience timeline

**External Services:**
- @emailjs/browser - Contact form email integration

## Development Notes

### File Structure Patterns
- Components use TypeScript with proper interface definitions
- Constants file contains all portfolio data with type safety
- Canvas components are organized in their own directory
- Context providers handle global state (music, themes)

### 3D Components Best Practices
- All Three.js components are wrapped in Suspense with CanvasLoader
- 3D models and textures should be placed in `/public/` directory
- Performance optimization through proper disposal and memory management

### Music System
- Audio files should be placed in `/public/music/`
- Global keyboard shortcuts are handled in MusicContext
- State persists across page reloads using localStorage

### TypeScript Integration
- Path aliases configured: `@/*` maps to project root
- Strict TypeScript configuration enabled
- Type definitions for Three.js components in `types/three-jsx.d.ts`