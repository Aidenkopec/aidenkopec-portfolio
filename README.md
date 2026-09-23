# aidenkopec.com

My portfolio and blog. Full-stack work: scalable web apps, AI tools, and backend
automations.

**Live:** [aidenkopec.com](https://aidenkopec.com)

<!-- Screenshot: add docs/screenshot.png and uncomment.
![The aidenkopec.com hero section](docs/screenshot.png)
-->

## Architecture

Next.js 16 on the App Router, server components by default. The blog reads MDX files
straight off disk from `content/blog/`, parsing YAML frontmatter and generating a table of
contents and reading time per post (`lib/blog.ts`). The GitHub section pulls profile,
repositories and the contribution calendar through a mix of REST and GraphQL, cached with
`React.cache` and ISR (`lib/github-service.ts`). The contact form posts to `/api/contact`,
which renders React Email templates from `components/emails/` and sends them via Resend.
The 3D scenes (the particle swarm hero in `components/swarm/` and the project ring in
`components/canvas/`) are React Three Fiber, lazy loaded so they stay out of the critical path. Styling is
Tailwind CSS v4 driven by CSS custom properties, which is what makes the four colour themes
swap at runtime.

## Local setup

```bash
git clone https://github.com/Aidenkopec/aidenkopec-portfolio.git
cd aidenkopec-portfolio
npm install
cp .env.example .env.local   # then fill in the keys
npm run dev
```

The site runs without any environment variables set — the contact form and the GitHub
section just degrade rather than fail. See `.env.example` for what each key unlocks.

## Scripts

| Script                 | Does                       |
| ---------------------- | -------------------------- |
| `npm run dev`          | Dev server with Turbopack  |
| `npm run build`        | Production build           |
| `npm start`            | Serve the production build |
| `npm run lint`         | ESLint                     |
| `npm run lint:fix`     | ESLint with autofix        |
| `npm run format`       | Prettier, writes           |
| `npm run format:check` | Prettier, checks only      |

## Writing a post

Drop an `.mdx` file in `content/blog/`. The filename is the slug. Frontmatter takes
`title`, `description`, `date`, `tags`, `category`, `excerpt`, `coverImage`, `author`,
`featured` and `published`. Posts are published unless you set `published: false`.

## Licence

MIT, see [LICENSE](LICENSE). The audio under `public/music/` is third-party and carries its
own terms — see [CREDITS.md](CREDITS.md).
