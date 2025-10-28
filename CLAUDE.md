# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 portfolio website with a blog system, featuring interactive 3D elements, email notifications, and GitHub integration. It uses MDX for blog content, Tailwind CSS for styling, and React Three Fiber for 3D visualizations.

## Common Development Commands

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm build

# Start production server
npm start

# Lint code (ESLint)
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting without changes
npm run format:check
```

## Architecture Overview

### Project Structure

- **`app/`** - Next.js App Router with page layouts and API routes
  - **`app/api/`** - API endpoints (contact, blog, GitHub data)
  - **`app/blog/`** - Blog pages (list view, individual posts, tag filtering)
- **`components/`** - React components organized by feature
  - **`canvas/`** - Three.js/React Three Fiber 3D components (Earth, Stars, Computers, Ball)
  - **`blog/`** - Blog-related UI components (BlogCard, BlogContent, BlogNavigation, etc.)
  - **`emails/`** - React Email components for transactional emails
  - **`ui/`** - Reusable UI components and animations
  - **`magicui/`** - MagicUI component library utilities
- **`lib/`** - Utility functions and services
  - **`blog.ts`** - Blog post management (parsing MDX, fetching posts, filtering)
  - **`github-service.ts`** - GitHub API integration with caching
  - **`github-utils.ts`** - GitHub types and utilities
  - **`types.ts`** - Shared TypeScript types
- **`content/blog/`** - Blog post MDX files with YAML frontmatter

### Key Features

#### Blog System
- Blog posts stored as MDX files in `content/blog/` directory
- Frontmatter format includes: title, description, date, tags, featured, published, author, excerpt, coverImage, category
- Automatic table of contents generation from markdown headings
- Reading time calculation (200 words per minute)
- Tag filtering and search functionality
- Featured post highlighting

#### APIs
- **`/api/contact`** - Contact form endpoint with Resend email integration (sends to user and admin)
- **`/api/recent-blogs`** - Returns 3 most recent blog posts
- **`/api/blog`** - Blog post listing
- **`/api/github`** - GitHub user data, repositories, contribution calendar (with GraphQL support)

#### GitHub Integration (`lib/github-service.ts`)
- Fetches user profile, repositories, and recent commits
- Supports GraphQL queries for contribution calendar (with fallback to REST API)
- Next.js cache deduplication with React.cache()
- ISR (Incremental Static Regeneration) with 1-hour revalidation
- Filters repositories by owner login
- Limits display to 6 repos and 25 commits for performance

#### Email System (Resend)
- Uses React Email components for templating
- Contact form sends two emails:
  1. User acknowledgment email
  2. Admin notification email to `aidenkopec@icloud.com`
- Requires `RESEND_API_KEY` environment variable

### 3D Components
- **Three.js Integration** via `@react-three/fiber` and `@react-three/drei`
- Components: Stars, Earth, Computers, Ball, WavyLines
- Used on hero section and throughout the site for visual appeal

### Styling
- **Tailwind CSS v4** with plugins:
  - `@tailwindcss/typography` - for prose styling
  - `prettier-plugin-tailwindcss` - for class sorting
- **Custom color system** - uses CSS variables (e.g., `bg-primary-color`, `text-primary-text`)
- **Motion libraries** - `framer-motion` and `motion` for animations

### Configuration Files
- **`next.config.ts`** - Next.js config with:
  - MDX page support
  - Image optimization (WebP, AVIF, 24-hour cache)
  - Remote image patterns (Unsplash)
  - Experimental `useCache` directive enabled
- **`tsconfig.json`** - Path aliases using `@/*` for imports

## Environment Variables

Required for full functionality:
- `RESEND_API_KEY` - Email service (contact form)
- `GITHUB_TOKEN` - Optional, enables authenticated GitHub API requests with higher rate limits

## Important Implementation Details

### Blog Post Parsing (`lib/blog.ts`)
- MDX files must have YAML frontmatter enclosed in `---` separators
- Simple YAML parser (handles strings, booleans, and arrays)
- Posts default to published=true unless explicitly set
- Posts are sorted by date (newest first) and filtered by published status
- File format: `content/blog/[slug].mdx`

### GitHub Caching Strategy
- Uses React.cache() for request deduplication within a single render
- ISR revalidation set to 3600 seconds (1 hour)
- Automatically falls back to public API data if authenticated requests fail
- Contribution calendar supports filtering by year or "last" (365 days)

### Next.js App Router
- Uses Server Components by default
- `server-only` directive used in `github-service.ts` to prevent client-side access
- Client Components explicitly marked with `'use client'` directive
- Loading states defined with `loading.tsx` files
- Error boundaries with `error.tsx` and `global-error.tsx`

## Component Organization Notes

- **Server vs Client Components**: Projects and RecentBlogs use split architecture (Server + Client components)
- **Email Templates**: React Email components for contact form (UserAcknowledgment, ContactNotification)
- **Utility Components**: Marquee, confetti, background boxes under `components/magicui/` and `components/ui/`
- **3D Canvas**: Separate components for each canvas element to allow lazy loading

## Performance Considerations

- Image optimization with Next.js Image component
- Caching strategies for GitHub and blog data
- Lazy-loaded 3D components (Stars, Earth)
- MDX is compiled at build time
- Recent blogs limited to 3 posts for homepage
- Repository display limited to 6 repos

## Development Tips

- Blog posts must be in `content/blog/` directory with `.mdx` extension
- Use `npm run format` before committing to ensure consistent formatting
- GitHub token (if used) should be added to `.env.local` for development
- The 3D components may not render in development without proper WebGL support
- Use the blog tag system for categorization and filtering
