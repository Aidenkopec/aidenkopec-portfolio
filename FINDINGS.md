# Portfolio Codebase Audit

Full repository audit performed against Next.js 16.3.5 / React 19.2.4 conventions.
Verified with `npm run build`, `npx tsc --noEmit`, `npx eslint .`, `npx prettier --check`,
and inspection of the produced `.next` output.

**Status of the tooling:** lint, typecheck, format and build all pass cleanly. Every
finding below is something the tooling does not catch.

**Counts:** 96 findings. 6 critical, 27 high, 41 medium, 22 low.

**How to read this:** phases are ordered by impact per unit of effort. Phase 0 is roughly
an hour of work and changes the first impression more than anything else in this document.

| Phase | Theme                             | Findings | Rough effort |
| ----- | --------------------------------- | -------- | ------------ |
| 0     | First impression and repo hygiene | 9        | 1 to 2 hours |
| 1     | Security and correctness          | 14       | 1 day        |
| 2     | Rendering strategy and data flow  | 13       | 1 to 2 days  |
| 3     | Performance and bundle            | 12       | 1 day        |
| 4     | Accessibility                     | 12       | 1 day        |
| 5     | Type safety and error handling    | 13       | 1 day        |
| 6     | Testing and CI                    | 6        | 1 to 2 days  |
| 7     | Structure, naming, CSS hygiene    | 17       | 1 day        |

---

## Phase 0. First impression and repo hygiene

A reviewer opening this repo on GitHub sees the README before any code. Everything in
this phase is cheap and disproportionately visible.

### 0.1 README is unmodified create-next-app boilerplate

**`README.md:1-36`** . **CRITICAL**

The entire README is the scaffold template, down to "You can start editing the page by
modifying `app/page.tsx`" and the Vercel deploy CTA with `utm_campaign=create-next-app-readme`.

For a project you link in job applications this is the single most damaging item in the
audit. It signals the project was generated and never owned. Reviewers who read nothing
else will read this.

**Fix:** replace with a real README covering what the site is, a live link, a screenshot
or short GIF, the architecture in a few sentences (App Router, MDX blog, React Three Fiber,
Resend, GitHub API), the local setup including required environment variables, and the
available scripts. Keep it under a screen and a half.

### 0.2 Package is named `nextjs`

**`package.json:2`** . **HIGH**

```json
"name": "nextjs",
"version": "0.1.0",
```

Another scaffold leftover. It shows up in every `npm run` banner, including your own build
output (`> nextjs@0.1.0 build`).

**Fix:** `"name": "aidenkopec-portfolio"`.

### 0.3 Open Graph image points at a file that does not exist

**`app/layout.tsx:54`** . **HIGH**

```ts
openGraph: { images: [{ url: '/logo.png', ... }] }
```

There is no `public/logo.png`. The file lives at `public/assets/logo.png`, and the Twitter
card three lines below (`app/layout.tsx:68`) correctly uses `/assets/logo.png`.

Every link to your portfolio shared on LinkedIn, Slack or iMessage renders with no preview
image. On a site whose purpose is being shared with recruiters, that matters.

**Fix:** correct the path to `/assets/logo.png`. Better, add `app/opengraph-image.tsx` and
let Next generate a proper 1200x630 card, which also removes the 978 KB PNG from the
social path (see 3.6).

### 0.4 The 404 page links to a route that does not exist

**`app/not-found.tsx:88`** . **MEDIUM**

```tsx
<Link href='/contact'>contact me</Link>
```

There is no `app/contact` route. Contact is a section on the home page, anchored at
`#contact`. Clicking "contact me" on the 404 page returns another 404.

**Fix:** `href='/#contact'`.

### 0.5 Setup scaffolding is published to production

**`public/music/README.md`** . **MEDIUM**

This file is served publicly at `https://aidenkopec.com/music/README.md`. It reads as
in progress work: "Quick Setup . Free Music Downloads", "Just drop in the music files and
it works!", "No Coding Required".

**Fix:** delete it, or move the content to `docs/` outside `public/`.

### 0.6 Third party audio with no attribution or licence record

**`public/music/*.mp3`, `context/MusicContext.tsx:104-118`** . **MEDIUM**

17 MB of music is committed, credited in the UI to "Ambient Artist", "Synth Artist" and
"Electronic Artist". `public/music/README.md` describes sourcing tracks from Pixabay,
Freesound and the YouTube Audio Library, each with different licence terms.

Two problems. The placeholder artist names ship to production and read as unfinished. And
there is no record of which track came from where or under what licence, which a careful
reviewer will notice on a public repo.

**Fix:** record real titles, artists and licence for each track, or drop the music feature.
See 3.3 for the payload cost.

### 0.7 No LICENSE file

**repo root** . **MEDIUM**

A public repo with no licence is "all rights reserved" by default. For a portfolio meant to
be read and learned from, add one. MIT is the conventional choice.

### 0.8 No `.env.example`

**repo root** . **MEDIUM**

`RESEND_API_KEY` and `GITHUB_TOKEN` are required for the contact form and GitHub section to
work, and are documented only inside `CLAUDE.md`. Anyone cloning the repo gets a silently
degraded site.

**Fix:** commit `.env.example` with both keys, empty, plus a comment on where to get each.

### 0.9 Dead scaffold assets still committed

**`public/`** . **LOW**

Zero references anywhere in the source:

| File                        | Size                                |
| --------------------------- | ----------------------------------- |
| `public/file.svg`           | 132 KB                              |
| `public/globe.svg`          | .                                   |
| `public/window.svg`         | .                                   |
| `public/assets/file.svg`    | .                                   |
| `public/assets/globe.svg`   | .                                   |
| `public/assets/window.svg`  | .                                   |
| `public/companies/opit.png` | 5 KB, superseded by `opit-logo.png` |

**Fix:** delete all seven.

---

## Phase 1. Security and correctness

**Status: fixed, uncommitted.** All 14 findings. Deviations from the text below:

| #   | Deviation                                                                                                                                                                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.2 | Private _repository_ objects leaked too, and both profile and repos reached the browser via the RSC payload, not just `/api/github`. Route returns `commitCalendar` only; `repositories` removed from `GitHubData`. |
| 1.5 | `Promise.all` is wrong. `Emails.create` renders before the HTTP call and outside its catch, so a reject discards the sibling result. Sends are serial, notification first.                                          |
| 1.7 | Uses `z.regexes.html5Email`. Zod's default is stricter than the regex it replaced.                                                                                                                                  |
| 1.8 | Also fixes a pre-existing soft 404 on every nonexistent blog URL. `dynamicParams = false` must be deleted when 2.11 enables `cacheComponents`.                                                                      |

**TODO, not code:** publish the Vercel WAF rate limit rule for 1.4. Until then
`/api/contact` has no rate limit, because the in-memory one is deleted.

### 1.1 GraphQL injection into an authenticated GitHub query

**`lib/github-service.ts:177-201`, reached from `app/api/github/route.ts:8`** . **CRITICAL**

```ts
// app/api/github/route.ts
const year = url.searchParams.get('year') || 'last';
const githubData = await getGitHubData(year);
```

```ts
// lib/github-service.ts
if (year && year !== 'last') {
  const fromDate = `${year}-01-01T00:00:00Z`;
  const toDate = `${year}-12-31T23:59:59Z`;
  contributionsCollectionArgs = `(from: "${fromDate}", to: "${toDate}")`;
}
const query = `
  query {
    viewer {
      contributionsCollection${contributionsCollectionArgs} { ... }
    }
  }
`;
```

`year` is attacker controlled, unvalidated, and concatenated into a GraphQL document that is
executed against `api.github.com/graphql` **with your `GITHUB_TOKEN` in the Authorization
header**. A value containing a double quote closes the string literal and lets the caller
append arbitrary selections to a query running as you.

The endpoint is reachable from the browser. `components/GitHubActivityClient.tsx:570` calls
`fetch(\`/api/github?year=${year}\`)`, so the parameter is a normal public input.

The blast radius is whatever the token's scopes allow reading. If the token carries `repo`,
that includes private repository metadata.

**Fix, both parts:**

1. Validate at the boundary. `if (!/^\d{4}$/.test(year)) year = 'last'` in the route handler.
2. Stop string building GraphQL. Use variables, which is what they exist for:
   ```ts
   const query = `query($from: DateTime, $to: DateTime) {
     viewer { contributionsCollection(from: $from, to: $to) { ... } }
   }`;
   body: JSON.stringify({ query, variables: { from, to } });
   ```
   GitHub treats `null` for both as "last year", so the branch disappears too.

Also audit the token's scopes. This code only needs public read.

### 1.2 Private GitHub profile fields are leaked through the public API route

**`lib/github-service.ts:50-60`, `app/api/github/route.ts:19`** . **HIGH**

When `GITHUB_TOKEN` is set, `fetchUserData` calls `GET /user`, the authenticated endpoint.
Its response is a superset of the public `/users/{username}` payload and includes
`two_factor_authentication`, `total_private_repos`, `owned_private_repos`, `private_gists`,
`disk_usage`, `collaborators`, `plan`, and your private account email.

That object is stored on `githubData.user` and returned verbatim:

```ts
return NextResponse.json(githubData);
```

The `GitHubUser` interface in `lib/github-utils.ts:5-21` lists only public fields, but a
TypeScript interface does not strip anything at runtime. Every field GitHub sends is
serialized to any browser that requests `/api/github`.

**Fix:** project explicitly before returning, and do it in the service so both the route and
the server components benefit:

```ts
const pick = ({
  login,
  name,
  avatar_url,
  html_url,
  bio,
  location,
  company,
  public_repos,
  followers,
  following,
  created_at,
}: GitHubUser) => ({
  login,
  name,
  avatar_url,
  html_url,
  bio,
  location,
  company,
  public_repos,
  followers,
  following,
  created_at,
});
```

Then confirm with `curl -s localhost:3000/api/github | jq '.user | keys'`.

### 1.3 The contact endpoint is an open email relay

**`app/api/contact/route.ts:37-42`** . **HIGH**

```ts
const userEmailResponse = await resend.emails.send({
  from: 'Aiden Kopec <noreply@aidenkopec.com>',
  to: [email], // caller supplied, unverified
  subject: 'Thank you for reaching out!',
  react: UserAcknowledgmentEmail({ userName: name }),
});
```

Anyone who can POST to `/api/contact` causes mail to be sent from your verified domain to an
arbitrary recipient, with `name` under their control appearing in the body. The only brake is
the rate limiter, which does not work (1.4).

The practical risk is not that an attacker phishes through you, it is that automated abuse
burns your Resend quota and gets `aidenkopec.com` onto spam reputation lists. Recovering
domain reputation is slow and painful.

**Fix, in order of value:**

1. Drop the acknowledgment email to the submitted address, or gate it behind a verified
   double opt in. The notification to yourself is the part that carries the value.
2. Add a bot check. Vercel BotID, a Turnstile token, or at minimum a honeypot field plus a
   minimum time on form.
3. Move the rate limit to durable storage (1.4).

### 1.4 The rate limiter does not limit anything in production

**`lib/spam-protection.ts:11, 170-200, 206-220`** . **HIGH**

Four independent defects:

**a. In memory store on serverless.** `const rateLimitStore = new Map()` lives in a single
function instance. Vercel Fluid Compute runs many concurrent instances and recycles them, so
the counter resets constantly and is never shared. The effective limit is 5 per hour per
instance, which is not a limit.

**b. The client IP is trusted blindly.**

```ts
const forwardedFor = request.headers.get('x-forwarded-for');
if (forwardedFor) return forwardedFor.split(',')[0].trim();
```

`X-Forwarded-For` is caller supplied. Rotating a header value defeats the limiter entirely,
even if (a) were fixed.

**c. Off by one on window rollover.** `checkRateLimit:178-181`:

```ts
if (entry && now >= entry.resetTime) {
  rateLimitStore.delete(ipAddress);
  return { allowed: true }; // returns without recording this request
}
```

The first request of each new window is deleted and allowed but never counted, so the real
ceiling is 6 per window, not 5.

**d. Unbounded growth.** Entries are only removed when that same IP returns after expiry. IPs
that submit once and never come back are retained for the life of the instance.

**Fix:** use a shared store with TTL. Upstash Redis via the Vercel Marketplace is the
low friction option here and `@upstash/ratelimit` handles the window logic and expiry for
you. For the IP, use `ipAddress(request)` from `@vercel/functions`, which reads the header
Vercel's proxy controls rather than one the caller can set.

### 1.5 Failed email sends return HTTP 200 "Emails sent successfully"

**`app/api/contact/route.ts:37-60`** . **HIGH**

The Resend SDK returns `{ data, error }` rather than throwing on API level failures. Neither
response is checked:

```ts
const userEmailResponse = await resend.emails.send({ ... });
const notificationEmailResponse = await resend.emails.send({ ... });

return NextResponse.json({
  message: 'Emails sent successfully',
  userEmailId: userEmailResponse.data?.id,          // undefined on failure
  notificationEmailId: notificationEmailResponse.data?.id,
});
```

On a rejected send, an invalid key, a suppressed recipient or a quota breach, `data` is
`null`, `error` is populated, and the route still answers 200. `Contact.tsx:145` checks only
`response.ok`, so the visitor sees "Message Sent!" and confetti while nothing was delivered.

For a portfolio contact form this is the highest cost bug in the repo. A silently dropped
message from a recruiter is unrecoverable, and you would never know.

**Fix:**

```ts
const [ack, notify] = await Promise.all([ ... ]);
if (notify.error) {
  console.error('Resend notification failed:', notify.error);
  return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
}
if (ack.error) console.warn('Ack email failed (non fatal):', ack.error);
```

Treat the notification to yourself as required and the acknowledgment as best effort.
`Promise.all` also removes a needless serial round trip.

### 1.6 Internal error messages are returned to the browser

**`app/api/contact/route.ts:67-73`, `app/api/github/route.ts:32-38`** . **MEDIUM**

```ts
return NextResponse.json(
  {
    error: 'Failed to send emails',
    details: error instanceof Error ? error.message : 'Unknown error',
  },
  { status: 500 },
);
```

Upstream provider messages, and anything a thrown error carries, are handed to the caller.
This is a standard information disclosure pattern that gives an attacker a free oracle for
probing your backend.

**Fix:** log the detail server side, return a generic message plus a correlation id. Gate
`details` behind `process.env.NODE_ENV === 'development'` if you want it locally.

### 1.7 Malformed request bodies produce 500 instead of 400

**`app/api/contact/route.ts:16`** . **MEDIUM**

```ts
const { name, email, message } = await request.json();
```

Non JSON bodies make `.json()` reject, and a `null` body makes the destructure throw. Both
land in the catch block and return 500 with "Failed to send emails", which is both the wrong
status and a misleading message. The three fields are also implicitly `any`, so a non string
`name` reaches `validateContactFormContent` and `trim()` throws on it.

**Fix:** parse with a schema. Zod is worth the dependency here because it also resolves 5.10:

```ts
const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  message: z.string().min(10).max(5000),
});
const parsed = ContactSchema.safeParse(await request.json().catch(() => null));
if (!parsed.success)
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
```

### 1.8 Unpublished posts are reachable by direct URL

**`lib/blog.ts:148-180`** . **MEDIUM**

`getAllBlogPosts` filters on `post.published`, but `getBlogPostBySlug` does not. Since
`dynamicParams` defaults to true, a post with `published: false` is hidden from every listing
yet renders in full at `/blog/<slug>`. Draft work you have not finished is one guessed URL
away, and Google will index it if it is ever linked.

**Fix:** return `null` from `getBlogPostBySlug` when `published === false` outside
development, and set `export const dynamicParams = false` on `app/blog/[slug]/page.tsx` so
only prerendered slugs resolve.

### 1.9 The name validator rejects most of the world's names

**`lib/spam-protection.ts:86, 20-60`** . **MEDIUM**

```ts
if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
  return {
    valid: false,
    error: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  };
}
```

ASCII only. "José", "Müller", "Nguyễn", "李" are all rejected with a message claiming they
contain something other than letters.

The `isGibberish` heuristic then rejects more legitimate names on top of that:

- The consonant cluster rule (`/[bcdfghjklmnpqrstvwxyz]{4,}/`) rejects **Schmidt**,
  **Schwartz**, **Knight**, **Brandt**.
- The vowel ratio rule (under 20 percent is "suspicious") rejects **Ng**, **Lynch**, **Byrd**.

A recruiter with a common European surname cannot contact you, and is told their name
"appears to contain random characters".

**Fix:** allow Unicode letters (`/^[\p{L}\p{M}\s'-]+$/u`) and delete `isGibberish` entirely.
It is a heuristic with a high false positive rate guarding a form that receives a handful of
submissions a week. Real bot pressure is better handled by 1.3's bot check.

### 1.10 No security headers

**`next.config.ts`** . **MEDIUM**

No `headers()` block. The site ships without `Content-Security-Policy`,
`Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy` or
`Permissions-Policy`. For a portfolio read by senior engineers, a securityheaders.com F is a
visible miss, and CSP is the mitigation that would have contained a third party script
compromise (1.11).

**Fix:** add a `headers()` entry in `next.config.ts`. Start with
`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, and a CSP in
report only mode until you have confirmed the three.js inline workers and the analytics
origins are covered.

### 1.11 Third party script injected with a raw tag and no integrity check

**`app/layout.tsx:84-90`** . **MEDIUM**

```tsx
<head>
  {/* 100% privacy-first analytics */}
  <script async src='https://scripts.simpleanalyticscdn.com/latest.js'></script>
</head>
```

Two issues. A raw `<script>` in the App Router `<head>` bypasses `next/script`, so you get no
loading strategy control and it competes with hydration for bandwidth. And `latest.js` is a
mutable URL, so SRI is impossible and you are trusting that CDN permanently with full DOM
access on your domain.

There is also redundancy: `@vercel/analytics` is mounted at `app/layout.tsx:102`. You are
running two analytics vendors and paying the byte cost of both.

**Fix:** pick one vendor. If you keep Simple Analytics, load it with
`<Script src='...' strategy='afterInteractive' />` from `next/script` and pin a versioned URL
so you can add `integrity`.

### 1.12 `window.open` without `noopener`

**`components/GitHubActivityClient.tsx:518`** . **LOW**

```ts
window.open(GITHUB_URL, '_blank');
```

The opened page receives a `window.opener` reference and can navigate this tab, the classic
reverse tabnabbing pattern. Low risk given the target is github.com, but it is free to fix
and reviewers look for it.

**Fix:** `window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')`. Better, make it an
anchor with `rel='noopener noreferrer'` so it is keyboard and middle click friendly.

### 1.13 `dangerouslySetInnerHTML` on resume bullet points

**`components/Experience.tsx:69`** . **LOW**

```tsx
<li ... dangerouslySetInnerHTML={{ __html: point }} />
```

`point` comes from `constants/index.ts`, so there is no injection path today. It is flagged
because the content is entirely yours and static, meaning the escape hatch buys nothing while
establishing a pattern that becomes a vulnerability the day any of it is sourced externally.

**Fix:** if the markup is only emphasis, model it as structured data
(`{ text: string, emphasis?: string[] }`) or store the bullets as MDX like the blog.

### 1.14 `dangerouslyAllowSVG` is enabled

**`next.config.ts:13`** . **LOW**

Correctly paired with `contentDispositionType: 'attachment'` and a sandboxing CSP, so this is
handled properly. Noted only because the flag draws the eye and it is worth confirming you
still need it. The only SVG routed through `next/image` is
`public/companies/solvex-logo.svg`, which is a local trusted file and could be imported
statically instead, letting you drop the flag.

---

## Phase 2. Rendering strategy and data flow

**Status: fixed.** 13 of 13 findings. 2.11 was investigated and **deliberately
resolved the other way**: see the note under 2.11 below.
Deviations from the text below:

| #    | Deviation                                                                                                                                                                                                                                                                                                                                              |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.8  | **3.11 was pulled forward**, because consolidating the cache is what makes the swallowed failure persist. `getGitHubData` now returns `GitHubResult` and the zeroed fallback is deleted. Confirmed 4 upstream calls per cold render, down from 8.                                                                                                      |
| 2.8  | The snapshot returns `null` rather than throwing. An exception escaping a `'use cache'` scope during prerender fails the build outright, so a GitHub outage at build time would have taken the whole site down. A 15 minute revalidate is what stops a failure sticking.                                                                               |
| 2.12 | Only the genuinely dead boundary in `app/blog/page.tsx` was removed. The `[slug]` and `[tag]` boundaries are kept: they wrap async children and become mandatory under `cacheComponents`, which requires `params` to be awaited inside one.                                                                                                            |
| 2.13 | **The premise is wrong.** `hoc/SectionWrapper.tsx` is not an HOC and takes `children` as a prop, so it never forced its children client. `Projects.tsx` and `GitHubActivity.tsx` already passed server children through it. The count was driven by framer-motion, three.js and real state. Only `components/Tech.tsx` had a genuinely dead directive. |
| 2.1  | `BlogHero`'s `onCategoryFilter` prop was declared but never destructured, so the handler was silently dropped. Removed, since `BlogHero` renders no category UI.                                                                                                                                                                                       |
| 2.1  | The page reset effect tripped `react-hooks/set-state-in-effect` once moved into the island. Replaced with the documented render time adjustment rather than suppressing it.                                                                                                                                                                            |

**TODO, not code:** none.

This phase carries the most Next.js specific signal. The blog is built inside out relative
to how the App Router is meant to work.

### 2.1 The blog index is a client component that fetches its own content over HTTP

**`app/blog/page.tsx:1, 71-89`** . **CRITICAL**

```tsx
'use client';
...
useEffect(() => {
  async function fetchPosts() {
    const response = await fetch('/api/blog');
    ...
  }
  fetchPosts();
}, []);
```

The posts are MDX files on disk, known at build time. Instead they are read by a server
route, serialized to JSON, shipped to the browser, and rendered after hydration.

Consequences:

- **The static HTML for `/blog` contains no posts.** Confirmed in the build output: `/blog`
  is marked `○ (Static)`, but what is prerendered is the skeleton. Crawlers, link unfurlers
  and anything without JS see an empty list. For a portfolio blog written to be found, this
  defeats the purpose of writing it.
- A four step waterfall before any content appears: HTML, then JS bundle, then hydration,
  then `/api/blog`.
- Every visitor sees a skeleton flash on a page that could be pure static HTML.
- The post list is paid for twice, once in the JSON response and once in the JS needed to
  render it.

**Fix:** invert it. Make `app/blog/page.tsx` a server component that calls
`getAllBlogPosts()` and `getFeaturedBlogPosts()` directly, and push `'use client'` down to
the smallest island that actually needs interactivity, which is the search and filter
control. Pass `initialPosts` into that island as a prop. `/api/blog` then has no callers and
is deleted (2.4).

This is the change that most alters how the codebase reads to a Next.js reviewer.

### 2.2 `/blog` has no metadata at all

**`app/blog/page.tsx:1`** . **HIGH**

A `'use client'` module cannot export `metadata` or `generateMetadata`. The blog index
therefore inherits the root layout's title and description, so it presents itself as
"Aiden Kopec - Full-Stack Software Developer Portfolio" with the portfolio description, and
has no canonical URL and no page specific OG card.

Individual posts get this right (`app/blog/[slug]/page.tsx:26-70`), which makes the gap on
the index more conspicuous.

**Fix:** falls out of 2.1. Once the page is a server component, add a `metadata` export.

### 2.3 The home page fetches recent posts from the browser

**`components/RecentBlogs.tsx:109-152`** . **HIGH**

Same inversion as 2.1, on the page that matters most:

```tsx
const response = await fetch('/api/recent-blogs');
```

The home page is statically prerendered, so the "Recent Blogs" section is absent from the
delivered HTML, appears as a skeleton, then pops in. That is a guaranteed layout shift on
your highest traffic page and a direct CLS penalty.

Worse, the failure mode at line 148:

```tsx
if (error || posts.length === 0) {
  return null; // Don't render anything if there are no posts or an error
}
```

On any fetch error an entire home page section silently vanishes after showing a loading
state. You would have no signal this happened.

**Fix:** make `RecentBlogs` a server component calling `getRecentBlogPosts(3)` directly. It
reads the local filesystem, so there is no reason for an HTTP hop. Keep the presentational
card as a client component only if it needs the motion variants.

### 2.4 Two API routes exist only to let client components read local files

**`app/api/blog/route.ts`, `app/api/recent-blogs/route.ts`** . **MEDIUM**

Both are consumed exclusively by the two client components above. They add a network hop, a
serialization boundary, a second error path and a public surface for data that is already
available synchronously in the server render.

**Fix:** delete both once 2.1 and 2.3 land. Note `/api/blog` currently returns the full post
list, featured list and tag list on every call regardless of what the caller needs.

### 2.5 Blog data is re read from disk on every helper call

**`lib/blog.ts:101-145, 183-234`** . **MEDIUM**

`getBlogPostsByTag`, `getAllBlogTags`, `getFeaturedBlogPosts`, `getRecentBlogPosts` and
`searchBlogPosts` each call `getAllBlogPosts()`, which does a full `readdirSync` plus a
`readFileSync` and regex parse of every MDX file.

`app/api/blog/route.ts:11-15` calls three of them in one `Promise.all`, so a single request
parses every post three times. `generateStaticParams` in `app/blog/[slug]/page.tsx:18` and
`BlogPostContent:133` compound it further during the build.

`lib/github-service.ts` already uses `React.cache()` for exactly this purpose, so the pattern
is established in the repo and just was not applied here.

**Fix:** wrap `getAllBlogPosts` in `cache()` from `react`. One line, and every caller
deduplicates within a render pass. For cross request caching add `'use cache'` with a
`cacheTag`, since the content only changes on deploy.

### 2.6 `React.cache` is applied to a function whose arguments defeat it

**`lib/github-service.ts:21-47`** . **MEDIUM**

```ts
const githubFetch = cache(async (url: string, options?: RequestInit) => { ... });
```

`React.cache` keys on referential equality of the arguments. Both GraphQL call sites pass a
freshly constructed object:

```ts
await githubFetch(`${GITHUB_API_BASE}/graphql`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
});
```

A new object literal each time means the cache never hits for any POST. Only the two GET
calls, which pass `undefined`, deduplicate.

**Fix:** cache at the semantic layer rather than the transport layer. The individual
`fetchUserData` / `fetchRepositories` / `fetchRecentCommits` wrappers are already wrapped in
`cache()` and take either no arguments or a primitive, which is correct. Drop `cache()` from
`githubFetch` itself.

### 2.7 GraphQL responses are never cached, despite the `revalidate` hint

**`lib/github-service.ts:28-35`** . **MEDIUM**

```ts
const response = await fetch(url, {
  ...options,
  headers,
  next: { revalidate: 3600, tags: ['github-data'] },
});
```

Next's data cache does not cache non GET requests. Both the contribution calendar and the
recent commits go over POST, so `revalidate: 3600` and the `github-data` tag have no effect
on them and every uncached render hits the GitHub API. The 5000 requests per hour token limit
is generous enough to hide this, but the intent in the code is not what happens.

**Fix:** cache at the function level instead, with `'use cache'` plus `cacheLife` on
`fetchContributionCalendar` and `fetchRecentCommits`, or `unstable_cache` keyed on `year`.

### 2.8 GitHub is fetched twice per page render

**`components/GitHubActivity.tsx:56-72`** . **MEDIUM**

```tsx
async function GitHubStatsSection() {
  'use cache';
  cacheTag('github-stats');
  const githubData = await getGitHubData();
  ...
}

async function GitHubDashboardSection() {
  'use cache';
  cacheTag('github-dashboard');
  const githubData = await getGitHubData();
  ...
}
```

`React.cache` deduplication does not cross `'use cache'` boundaries, since each cached scope
is evaluated independently. Both sections do the full four request fan out, so a cold render
makes eight GitHub calls instead of four, and the two halves of the section can show data
from different points in time.

**Fix:** hoist to one cached function returning both, or split so each cached section fetches
only what it renders. Add `cacheLife` explicitly rather than relying on the default, which
the build reports as 15 minutes.

### 2.9 A side effect is triggered during render

**`components/GitHubActivity.tsx:74-76`** . **MEDIUM**

```tsx
const GitHubActivity: React.FC = () => {
  // Preload GitHub data for better performance
  preloadGitHubData();
```

Calling a fetch initiating function in a component body is a render phase side effect. It is
also ineffective here: the preload runs outside both `'use cache'` scopes, so it starts a
request whose result those scopes cannot use. It is pure overhead.

**Fix:** delete `preloadGitHubData()` and the export at `lib/github-service.ts:354-356`. With
2.8 fixed there is nothing left to preload.

### 2.10 No `sitemap.ts`, no `robots.ts`, no structured data

**`app/`** . **HIGH**

`app/layout.tsx:45` declares `robots: 'index, follow'`, but there is no `robots.txt` and no
sitemap, so crawlers have to discover `/blog/<slug>` and `/blog/tag/<tag>` by link traversal.
Since the blog index renders its list client side (2.1), those links are not in the HTML to
traverse. The two problems compound: **your blog posts are currently very hard for a crawler
to reach.**

There is also no JSON-LD. A personal portfolio is the textbook case for `Person` schema, and
each post is the textbook case for `BlogPosting`. This is what populates the knowledge panel
when someone searches your name, which is precisely the search that happens during a job hunt.

**Fix:** add `app/sitemap.ts` and `app/robots.ts` (both are a few lines using
`getAllBlogPosts`), and a JSON-LD `<script type='application/ld+json'>` with `Person` in the
root layout and `BlogPosting` in `app/blog/[slug]/page.tsx`.

### 2.11 `experimental.useCache` is deprecated in Next 16.3

**`next.config.ts:6-8`** . **MEDIUM**

The build prints:

```
⚠ `experimental.useCache` is deprecated. Please use the top-level `cacheComponents` option instead in next.config.ts.
```

Left alone, the `'use cache'` directives in `components/GitHubActivity.tsx` stop compiling at
the next major.

Note this is not a rename. Top level `cacheComponents: true` also enables Partial
Prerendering and dynamicIO, which requires every dynamic subtree to sit inside a Suspense
boundary. Treat it as a deliberate migration, ideally after Phase 2's other items reduce the
number of dynamic surfaces.

**Resolution: the flag was removed rather than migrated. The site now uses no
experimental flags at all.**

The migration was attempted on a branch and abandoned for cause. `cacheComponents`
removes support for `dynamicParams`, and there is no supported replacement that returns
a real 404 for an unknown dynamic param: the App Shell is flushed with a 200 before the
params are known (`x-nextjs-postponed: 1`), so `notFound()` arrives too late to set the
status. Next's own ISR with Cache Components guide handles a missing record with
`return <p>Product not found.</p>` rather than `notFound()`, which is the documentation
conceding the point.

Adopting it would therefore have re-broken finding 1.8, which was fixed in Phase 1
precisely because soft 404s get indexed. In exchange the site would gain Partial
Prerendering, which it cannot use: there is no request time data anywhere in the app, no
cookies, no auth, no personalisation, no `searchParams` driven page. Every route is
either build time content or slow changing external data.

So the `'use cache'` directive added for 2.7 and 2.8 was replaced with `unstable_cache`,
which is documented, non experimental, and per the Next docs persists across deployments
and serverless instances where `'use cache'` does not (its key includes the build id and
it falls back to per instance memory). Verified: a second build made zero GitHub API
calls, reusing the first build's cached snapshot.

This should be revisited if the site ever grows genuine request time data, or if
upstream gives PPR a way to reject unknown params with a hard 404.

### 2.12 Suspense boundaries that can never suspend

**`app/blog/page.tsx:220-222`, `app/blog/[slug]/page.tsx:165-167`, `app/blog/tag/[tag]/page.tsx`** . **LOW**

```tsx
<Suspense fallback={<BlogSkeleton />}>
  <BlogContent />
</Suspense>
```

`BlogContent` is a synchronous client component that manages its own `loading` state, so it
never suspends and the fallback never renders. In the `[slug]` and `[tag]` pages the child is
async but the routes are fully prerendered via `generateStaticParams`, so those fallbacks are
also unreachable in production.

Dead boundaries plus a duplicated skeleton in each file. Harmless, but it reads as
cargo culted Suspense.

**Fix:** remove the boundaries that cannot suspend. Keep them where 2.1's refactor
introduces a genuinely async child.

### 2.13 34 of 47 components are client components

**`app/`, `components/`** . **MEDIUM**

```
'use client' files: 34
total .tsx files:   47
```

Some are legitimate: the 3D canvases, the music player, the theme menu. But entire
presentational subtrees are client side only because the nearest ancestor was marked, notably
everything under the blog index, and the `SectionWrapper` HOC at `hoc/SectionWrapper.tsx:1`
which makes every section it wraps a client boundary purely to attach scroll triggered motion.

**Fix:** after 2.1 and 2.3, sweep for `'use client'` on components with no state, no effects
and no handlers. For `SectionWrapper`, keep the animated wrapper as a thin client component
that renders `{children}` and let the children stay on the server. Children passed through a
client boundary as props are not themselves forced client, which is the key detail.

---

## Phase 3. Performance and bundle

### 3.1 A single 21 MB texture ships to every visitor

**`public/models/earth/textures/Material.002_diffuse.jpeg`** . **CRITICAL**

```
21M  public/models/earth/textures/Material.002_diffuse.jpeg
```

Loaded by `EarthCanvas`, which is statically imported in `components/Contact.tsx:9` and
rendered unconditionally at `Contact.tsx:331`. Every visitor who scrolls to the contact
section downloads 21 MB for a decorative spinning globe. On a mobile connection that is
minutes, and on a metered plan it is real money.

The rest of `public/models` adds another 19 MB, for 40 MB of 3D assets total.

**Fix, roughly in order of payoff:**

1. Resize the texture. 2048x1024 as WebP or KTX2 lands around 200 to 400 KB, a 50x to 100x
   reduction at a size no one will notice on a globe a few hundred pixels wide.
2. Draco compress the GLTF meshes with `gltf-transform`, which typically takes 80 to 90
   percent off the `.bin` files.
3. Load the canvas with `next/dynamic` and `ssr: false`, gated on an IntersectionObserver so
   nothing downloads until the section is near the viewport.

### 3.2 three.js is in the initial home page bundle

**`components/Hero.tsx:7`, `app/page.tsx:12-13`, `components/Contact.tsx:9`** . **HIGH**

Measured from the build output:

| Chunk                        | Raw        | Gzip   |
| ---------------------------- | ---------- | ------ |
| largest chunk (three + drei) | 819 KB     | 215 KB |
| next largest                 | 275 KB     | 82 KB  |
| **all client chunks**        | **2.2 MB** | .      |

`ComputersCanvas` (`Hero.tsx:7`, above the fold), `StarsCanvas` and `WavyLines`
(`app/page.tsx:12-13`) and `EarthCanvas` (`Contact.tsx:9`) are all statically imported. Only
`ProjectRing` uses `next/dynamic` (`components/ProjectsShowcase.tsx:17`), which shows the
right pattern is already understood, just not applied.

215 KB gzipped of WebGL runtime blocks interactivity on a page whose first meaningful content
is a heading and a paragraph.

**Fix:** apply the `ProjectRing` pattern to all four. `dynamic(() => import('...'),
{ ssr: false, loading: () => <Placeholder /> })`. For the below the fold canvases, add an
IntersectionObserver gate so the chunk is not even requested until needed. Expect the
home page's initial JS to drop by more than half.

### 3.3 17 MB of audio for an unrequested feature

**`public/music/*.mp3`** . **HIGH**

```
7.8M  digital-dreams.mp3
5.5M  deep-space.mp3
3.7M  synthwave-nights.mp3
```

`context/MusicContext.tsx:266` sets `preload='metadata'`, so the audio is not fetched until
play, which is correct. But the files sit in the deployment and in git history, and
`digital-dreams.mp3` at 7.8 MB is far above the 5 MB ceiling your own
`public/music/README.md` specifies.

Worth asking whether background music belongs on a portfolio a hiring manager opens in an
open plan office at all.

**Fix:** if kept, re encode to 96 to 128 kbps mono or low bitrate stereo, which should land
each track near 1.5 to 2.5 MB, and consider serving them from Vercel Blob rather than the
deployment bundle.

### 3.4 The context value is rebuilt on every render, above the entire app

**`context/MusicContext.tsx:104-118, 138-165`** . **HIGH**

Two compounding problems in the provider that `app/layout.tsx:100` wraps the whole
application in.

The playlist is a new array on every render:

```tsx
const playlist: Track[] = [
  { title: 'Deep Space', artist: 'Ambient Artist', src: '/music/deep-space.mp3' },
  ...
];
```

And the context value is a new object on every render:

```tsx
const value: MusicContextType = { isPlaying, setIsPlaying, volume, ... };
return <MusicContext.Provider value={value}>
```

With no `useMemo`, every consumer re renders whenever any piece of music state changes.
Because the provider sits at the root, dragging the volume slider re renders the entire
component tree, including the three.js canvases.

**Fix:** hoist `playlist` to a module level `const` outside the component, since it is
static. Wrap `value` in `useMemo` with an explicit dependency list. Confirm the action
callbacks are `useCallback` wrapped so the memo actually holds.

### 3.5 Full lodash imported for two trivial helpers

**`components/canvas/Stars.tsx:7`** . **MEDIUM**

```ts
import { memoize, random } from 'lodash';
```

lodash is CommonJS and does not tree shake reliably through the bundler, so this risks
pulling the whole library (roughly 70 KB minified) for two functions that are a few lines each.
`random(-1, 1, true)` is `Math.random() * 2 - 1`, and `memoize` here guards a single pure
function.

There is a secondary issue: `generateSpherePositions` is memoized at module scope with an
unbounded cache (`Stars.tsx:20-40`), so every distinct `count|radius` pair retains its
`Float32Array` for the life of the page.

**Fix:** inline both helpers and drop the `lodash` and `@types/lodash` dependencies. It is
the only lodash usage in the repo.

### 3.6 Blog cover images are unoptimized PNGs

**`public/blog/`, `public/assets/logo.png`** . **MEDIUM**

```
1.7M  public/blog/welcome-to-my-blog.png
1.2M  public/blog/i-do-together.png
978K  public/assets/logo.png
```

`public/projects/` already uses `.webp` throughout, so the convention exists and these three
were missed. `logo.png` is the more pressing one: it is referenced as the Twitter card image
(`app/layout.tsx:68`) and the Apple touch icon shortcut, and social scrapers fetch it
directly without passing through `next/image` optimization.

**Fix:** convert all three to WebP or AVIF. Expect roughly 80 percent savings. Once 0.3's
`opengraph-image.tsx` exists, the social path stops touching `logo.png` entirely.

### 3.7 `@types/three` is 15 minor versions ahead of the pinned runtime

**`package.json:48-50`, lockfile** . **MEDIUM**

```json
"overrides": { "three": "0.168.0" }
```

```
node_modules/three        -> 0.168.0
node_modules/@types/three -> 0.183.1   (transitive)
```

The compiler is checking against an API surface 15 minor releases newer than what runs.
three.js moves fast and removes things. This is the setup where code typechecks and then
throws `undefined is not a function` at runtime, and it is exactly the kind of latent trap a
principal engineer probes for.

**Fix:** pin `@types/three` to match, `"@types/three": "0.168.x"` in `devDependencies`, or
lift the `three` override and update the R3F stack together.

### 3.8 A second copy of three.js is in the tree

**lockfile** . **LOW**

```
node_modules/three                 -> 0.168.0
node_modules/stats-gl/node_modules/three -> 0.170.0
```

The `overrides` entry did not reach `stats-gl`'s nested dependency. Whether both copies reach
the bundle depends on whether `stats-gl` is actually imported by the drei surface you use,
but a duplicated three.js is roughly 600 KB of risk worth eliminating.

**Fix:** verify with `npm ls three`, then extend the override or add a `stats-gl` resolution.

### 3.9 Scroll listener is neither passive nor throttled

**`components/Navbar.tsx:20-33`** . **LOW**

```ts
const handleScroll = () => {
  const scrollTop = window.scrollY;
  if (scrollTop > 100) setScrolled(true);
  else setScrolled(false);
};
window.addEventListener('scroll', handleScroll);
```

Fires on every scroll frame with no `{ passive: true }`, so the browser cannot assume the
handler will not call `preventDefault` and must wait on it before scrolling. Reading
`window.scrollY` also forces layout. On a page running four WebGL canvases the margin for
jank is already thin.

**Fix:** pass `{ passive: true }`, and guard the `setScrolled` call so it only fires on
transition rather than every frame.

### 3.10 The commit graph fallback reports a wrong total

**`lib/github-service.ts:280-283`** . **LOW**

```ts
return { weeks, totalContributions: commits.length };
```

`commits` is capped at 5 by `fetchRecentCommits` (`:163`), so the no token fallback renders a
contribution graph claiming a total of 5 or fewer for the year. Only visible in local
development without a `GITHUB_TOKEN`, but it is misleading data presented as real.

**Fix:** return `null` and render an explicit "contribution data unavailable" state rather
than fabricating a graph.

### 3.11 Silent degradation to an all zeroes dashboard

**`lib/github-service.ts:335-349`** . **MEDIUM**

Any failure inside `getGitHubData` is caught and converted to a fully zeroed object. The UI
then renders "0 stars, 0 forks, 0 years" as though those were the real numbers. There is no
error state and no visual difference between "GitHub is down" and "this developer has no
activity". On a portfolio, the second reading is the damaging one.

**Fix:** return a discriminated result (`{ ok: true, data } | { ok: false, reason }`) and
render an explicit fallback. Since the section is inside a `'use cache'` scope, also make
sure a failed fetch is not what gets cached for the next 15 minutes.

### 3.12 `contributionYears` measures account age, not contribution years

**`lib/github-service.ts:320-322`** . **LOW**

```ts
const createdAt = new Date(userData.created_at || '2022-01-10');
const contributionYears = new Date().getFullYear() - createdAt.getFullYear();
```

This is years since account creation, surfaced in the UI as contribution years. It also
carries an unexplained magic fallback date, and using `getFullYear()` differences means an
account created in December 2024 reports 2 years in January 2026.

**Fix:** rename to `yearsOnGitHub`, drop the magic date in favour of an explicit unknown
state, and compute the difference in whole years from the actual dates.

---

## Phase 4. Accessibility

**Status: fixed.** 12 of 12 findings. Deviations from the text below:

| #    | Deviation                                                                                                                                                                                                                                                                                                                         |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1  | Resolved with a **modifier** rather than a wider guard alone. The toggle is now Ctrl/Cmd+Space, matching the Ctrl/Cmd+Arrow track shortcuts already in the same switch, and the bail guard was widened as described. Bare Space now activates buttons and pages the document again.                                                 |
| 4.2  | **Five of the six files listed were already fixed** in earlier phases. Only `Contact.tsx` still had bare `outline-none`. A second instance was found and fixed instead: `ui/button.tsx:8` had a ring, but hardcoded `ring-neutral-950/50`, which is invisible on every one of the four dark themes. It now uses the `ring` token.    |
| 4.3  | **Worse than reported.** `FloatingMusicBar.tsx` labelled with `title`, not `aria-label`, and had a clickable `<div>` with no role, tabindex or key handler, so its mini mode toggle was unreachable by keyboard. `CustomizationMenu.tsx`'s theme cards had the same defect, so themes could not be changed by keyboard at all. Both are now real buttons. The volume slider and the blog search input also had no accessible name. |
| 4.8  | **Half of this was already done.** `hooks/useCanRender3D.ts` already gates every WebGL canvas on the preference. Three layers were added for the rest: the global CSS block, one `MotionConfig reducedMotion='user'` in `components/MotionProvider.tsx`, and explicit guards on the four things neither reaches (the infinite hero chevron, the confetti, the SMIL `<animate>` in `canvas/WavyLines.tsx`, and `app/global-error.tsx`, which replaces the root layout). The CSS block reaches **no** framer-motion animation; framer drives WAAPI and rAF, not CSS transitions. |
| 4.12 | `.hash-span` had no CSS anywhere in the repo, so the class was already dead. `Tech.tsx` and `Testimonials.tsx` also passed `idName=''`, emitting two elements with `id=""`. `idName` is now optional and a separate `label` prop carries the landmark name, because the raw slug made a poor announced name.                          |
| 4.5  | Two extra defects fixed alongside: `extractHeadings` matched `#` lines **inside fenced code blocks**, and emitted `#{1,6}` entries while overrides existed only for h1 to h4. Tag slugs at `lib/blog.ts:216` were **deliberately left alone**: `getBlogPostsByTag` matches without hyphenating, so the strict slug would 404 `/blog/tag/next.js`. See the comment there. |

**Added beyond the findings:** a `jsx-a11y` rule set in `eslint.config.mjs`, as the regression
guard for exactly these defects.

**Surfaced but not fixed, being outside this phase:** `react-vertical-timeline-component`
emits `id=""` on all ten timeline entries; the GitHub contribution card and the blog TOC both
jump a heading level; blog category pills and the back-to-blog button fail colour contrast;
inline links in post bodies are distinguished by colour alone until hover. The first is a
dependency defect, the rest are closer to Phase 7's colour system work.

**Lighthouse accessibility, before and after:** home 95 to 98, blog post 90 to 90. The post's
three remaining failures are all in the list above and none are Phase 4 findings. Most of what
this phase fixed is not automatically detectable: the Space key regression, the live region
announcements, toggle state, reduced motion and the duplicate MDX heading ids.

The audit surface here is wide: 34 client components, heavy animation, icon only controls and
a global keyboard handler.

### 4.1 The global music shortcut breaks Space activation site wide

**`context/MusicContext.tsx:225-250`** . **HIGH**

```ts
const handleKeyPress = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    return; // Don't trigger shortcuts when typing
  }
  switch (e.code) {
    case 'Space':
      e.preventDefault();
      togglePlay();
      break;
```

The guard only excludes `INPUT` and `TEXTAREA`. Everything else that receives a Space key
gets `preventDefault()`:

- **Space is the standard way to activate a focused `<button>`.** Every button on the site
  is unusable by that key. Keyboard users get Enter only, and nothing tells them why.
- Space normally pages down. Site wide, it does not.
- `contenteditable` elements, `<select>`, and any element with `role='button'` are also not
  excluded.

This is an unprompted, invisible, site wide keyboard regression, and it is registered from a
provider mounted at the application root.

**Fix:** widen the bail condition substantially:

```ts
if (
  target.isContentEditable ||
  target.closest(
    'input, textarea, select, button, a, [role="button"], [tabindex]',
  )
)
  return;
```

Better, require a modifier for the play toggle so it cannot collide with native key handling
at all, and document the shortcut somewhere visible.

### 4.2 `outline-none` with no visible focus replacement

**`components/Contact.tsx:199, 212, 225, 231, 315`, `components/Navbar.tsx`, `components/ProjectsShowcase.tsx`, `components/blog/BlogHero.tsx`, `components/blog/BlogNavbar.tsx`** . **HIGH**

```tsx
className =
  'rounded-lg border-none bg-tertiary px-6 py-4 font-medium text-secondary outline-none placeholder:text-secondary';
```

`outline-none` is applied across six files with no `focus-visible:` ring to replace it. A
keyboard user tabbing through the contact form, the navigation or the blog search has no idea
where focus is. WCAG 2.4.7 failure, and one of the first things an accessibility aware
reviewer checks.

`components/ui/button.tsx:8` gets this right with a `focus-visible:ring-[3px]`, so the
correct pattern is already in the repo.

**Fix:** everywhere `outline-none` appears, pair it with
`focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] focus-visible:ring-offset-2`.
Then tab through the whole site once with the mouse untouched.

### 4.3 Icon only buttons with no accessible name

**`components/FloatingMusicBar.tsx` (5 buttons, 0 labels), `components/CustomizationMenu.tsx` (14 buttons, 1 label), `components/GitHubActivityClient.tsx` (2 buttons, 0 labels), `components/Contact.tsx`** . **HIGH**

Measured across the repo:

| File                                  | `<button>` | `aria-label` |
| ------------------------------------- | ---------- | ------------ |
| `components/FloatingMusicBar.tsx`     | 5          | 0            |
| `components/CustomizationMenu.tsx`    | 14         | 1            |
| `components/GitHubActivityClient.tsx` | 2          | 0            |
| `components/Contact.tsx`              | 2          | 0            |
| `components/Navbar.tsx`               | 3          | 1            |
| `components/blog/BlogNavbar.tsx`      | 3          | 1            |

A screen reader announces an icon only button with no label as just "button". The music bar
is the worst case: play, pause, next, previous and close are all indistinguishable.

`components/ProjectsShowcase.tsx` labels all 6 of its buttons, so again the pattern exists.

**Fix:** add `aria-label` to every control whose only content is an icon. For toggles, add
`aria-pressed`. For the menus, add `aria-expanded` and `aria-controls`.

### 4.4 Contact form errors are never announced

**`components/Contact.tsx:184-271`** . **HIGH**

The error block at `:238` renders after the submit button, inside the form, with no
`role='alert'` and no `aria-live`. The inputs carry no `required`, no `aria-invalid`, and no
`aria-describedby` linking them to the message.

A screen reader user submits, focus stays on the button, and nothing is announced. From their
perspective the form silently did nothing.

**Fix:**

- `role='alert'` on the error container, so it is announced on insertion.
- `aria-invalid={!!errorMessage}` and `aria-describedby='contact-error'` on the inputs.
- Move focus to the error region or the first invalid field on failed submit.
- Add `required` and `type='email'` so the browser contributes its own semantics.

### 4.5 MDX heading anchors collide whenever a heading is not plain text

**`mdx-components.tsx:10-89`** . **MEDIUM**

Every heading override repeats this:

```tsx
const id = typeof children === 'string'
  ? children.toLowerCase().replace(/[^a-z0-9\s-]/g, '') ...
  : 'heading-2';
```

MDX only passes a plain string when the heading contains nothing but text. The moment a
heading includes inline code, bold, a link or even an apostrophe rendered as a separate node,
`children` is an array and **every such heading gets the same literal id**, `'heading-2'`.

Two consequences. Duplicate DOM ids, which is invalid HTML and a genuine assistive technology
problem. And the table of contents, which derives its ids independently in
`lib/blog.ts:16-39` from the raw markdown source, produces the correct slug and therefore
links to anchors that do not exist. The TOC quietly stops working on exactly the headings a
technical post is most likely to have.

**Fix:** extract text recursively from the children tree before slugging, and share one
`slugify` helper between `mdx-components.tsx` and `lib/blog.ts` so the two can never diverge.
The same four line slug expression is currently duplicated five times across the two files.

### 4.6 Pagination is not marked up as navigation

**`components/blog/BlogPagination.tsx:57-133`** . **MEDIUM**

The control is a `<motion.div>` of buttons. No `<nav aria-label='Pagination'>`, no
`aria-current='page'` on the active page, and the ellipsis spans at `:85` are read aloud as
"dot dot dot".

**Fix:** wrap in `<nav aria-label='Pagination'>`, add `aria-current='page'` to the active
button, and `aria-hidden='true'` on the ellipsis spans.

### 4.7 Disabled pagination buttons look identical to enabled ones

**`components/blog/BlogPagination.tsx:70, 124`** . **MEDIUM**

```tsx
currentPage === 1
  ? '/50 cursor-not-allowed bg-black-100/50 text-secondary'
```

The leading `/50` is an orphaned fragment, almost certainly a mangled `text-secondary/50`.
As written it is not a valid class and does nothing, so the disabled label keeps full opacity
white. The only disabled affordance left is the cursor, which does not exist on touch and is
invisible to assistive technology.

**Fix:** `'cursor-not-allowed bg-black-100/50 text-secondary/50'`, and rely on the real
`disabled` attribute already present at `:67` for semantics.

### 4.8 No reduced motion support

**`app/globals.css`, all animated components** . **MEDIUM**

One occurrence of `prefers-reduced-motion` in the entire codebase, at
`components/ProjectsShowcase.tsx:412`. Everything else animates unconditionally: every
`SectionWrapper` scroll reveal, the four WebGL canvases, the pulsing loader, the infinite
chevron bounce at `components/Hero.tsx:40-50`, and the page transitions.

For users with vestibular disorders this is the difference between a usable site and one that
causes nausea. It is also a specific, commonly checked audit item.

**Fix:** add a global CSS escape hatch:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

and use framer-motion's `useReducedMotion()` to skip the scroll reveal variants and pause the
canvas render loops.

### 4.9 Unconditional smooth scrolling

**`app/globals.css:387-389`** . **LOW**

```css
html {
  scroll-behavior: smooth;
}
```

Applies to every navigation including ones the user did not initiate. Covered by the media
query in 4.8, listed separately because it is the single most reported reduced motion
complaint.

### 4.10 Loading states are invisible to screen readers

**`app/loading.tsx`, `app/blog/loading.tsx`, `app/blog/[slug]/loading.tsx`, and every inline skeleton** . **LOW**

`app/loading.tsx` is 129 lines of decorative spinner with no `role='status'`, no
`aria-live='polite'` and no `sr-only` text. A screen reader user hears nothing during the
wait and cannot tell whether the page is loading or broken.

**Fix:** `role='status' aria-live='polite'` on the container plus a visually hidden "Loading
page" string. Apply the same to the skeletons in `app/blog/page.tsx:15`,
`app/blog/[slug]/page.tsx:72` and `components/GitHubActivity.tsx:13`.

### 4.11 Placeholder text is the same colour as input text

**`components/Contact.tsx:199, 212, 225`** . **MEDIUM**

```tsx
'... text-secondary outline-none placeholder:text-secondary';
```

`--secondary-color` is `#ffffff` in all four themes, so placeholders render at exactly the
same colour as entered values. A user cannot tell at a glance whether a field is filled, and
placeholder text at full contrast defeats the visual distinction placeholders exist to make.

**Fix:** `placeholder:text-secondary/50`, and verify the result still clears 4.5:1 against
`--tertiary-color`.

### 4.12 Section anchors are attached to an empty span

**`hoc/SectionWrapper.tsx:26-28`** . **LOW**

```tsx
<span className='hash-span' id={idName}>
  &nbsp;
</span>;
{
  children;
}
```

The navigation target is a non breaking space rather than the section itself. Screen reader
users following an in page link land on an empty element with no announced context, and there
is no landmark relationship between the id and the content it names.

**Fix:** put `id={idName}` on the `<motion.section>` directly, add an `aria-label`, and delete
the span. `:target { scroll-margin-top: 120px }` at `app/globals.css:392-394` already handles
the fixed navbar offset that the span was presumably working around.

---

## Phase 5. Type safety and error handling

**Status: fixed.** 12 of 13 findings; 5.10 was already fixed in Phase 1. All 32 explicit `any`
in application code are gone. Deviations from the text below:

| #    | Deviation                                                                                                                                                                                                                                                                                                                     |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5.10 | **Already fixed in Phase 1.** `lib/spam-protection.ts` was deleted and `lib/contact-schema.ts` is the single zod schema, imported by both the form and the route. Re-verified in the browser: a one character name is rejected client side with the server's own message and `aria-invalid` on that input.                     |
| 5.5  | **Not applicable as written.** `mdx-components.tsx` cannot rename its export: `next.config.ts` applies `withMDX` and the Next 16 file convention requires a function named exactly `useMDXComponents`, taking no arguments. The result cannot be hoisted either, because Phase 4 made `createSlugger()` per call and hoisting would turn the collision counter into a cross request global. Split into `getMDXComponents()` plus a thin convention wrapper; the page calls the former, so no `use` prefix appears in a server component. |
| 5.6  | **Neither option in the finding was needed.** Phase 2 deleted the commit derived fallback, so the `CommitWeek[]` branch was already dead. The union was removed rather than normalized or tagged, taking ~45 lines of unreachable JSX with it. No consumer was casting; the narrowing was `in` and `Array.isArray` guards. |
| 5.8  | Types exported from `constants/index.ts` rather than moved to `lib/types.ts`. `Project` and `Technology` were already exported from there, so moving four of six would split the content model across two homes. `Experience.tsx`'s component const was renamed to `ExperienceSection`, because importing the type turns the shadowing into a genuine redeclaration.                                                            |
| 5.1  | Also removed the per-file `try/catch` that logged and skipped, in both `getAllBlogPosts` and `getBlogPostBySlug`, along with the `.filter(Boolean) as BlogPost[]` cast behind it. Validation that swallows its own failures is not validation. Verified: a bad `date:` now fails `npm run build`, naming the file and the field. |
| 5.2  | The schema owns the type outright. `BlogMetadata` is now `z.infer` of it and `BlogPost extends BlogMetadata`, so the two can no longer drift. The old parallel interface in `lib/types.ts` is gone.                                                                                                                             |
| 5.12 | **The `target` rationale does not hold for this build.** There is no `browserslist` key and no `.browserslistrc`, Next compiles with SWC against its own browser targets rather than tsconfig `target`, `tsc` runs `noEmit`, and `lib` was already `esnext`. Raised to ES2022 anyway at zero type errors, but measured: `.next/static` moved **+6,694 bytes**, all of it 5.13's reporting code in the error boundary chunks, and none of it attributable to `target`. The finding's "costs bytes in downlevelled async and spread helpers" is wrong here. |
| 5.12 | `noUncheckedIndexedAccess` produced 30 errors across 8 files, of which 26 needed fixing after steps 1 and 5 deleted the rest. `noImplicitOverride` and `target: ES2022` produced **zero** each. Most fixes are real guards; four are documented non-null assertions where the index is provably in range (a length checked focus trap, a modulo wrapped carousel index, and a texture array built one-per-project). `WavyLines` was fixed at the source instead: its width and height were being parsed back out of a `viewBox` string built from literals, so the numbers are now the source of truth and the string is derived. |
| 5.13 | **The obvious implementation silently drops the most important case.** `track()` no-ops unless `window.va` exists, which `<Analytics />` assigns in its own effect, so a crash during the first paint reported nothing. Confirmed in the browser, then fixed by deferring the call one tick, after which every effect in the commit has flushed. `app/global-error.tsx` also needed its own `<Analytics />`, for the same reason it already carries its own `MotionProvider`: it replaces the root layout. `app/error.tsx` now shows the digest in production too, matching `global-error.tsx`; a support id the visitor cannot see is not a support id. |

**Added beyond the findings:** `@typescript-eslint/no-explicit-any` raised from `off` to `error`,
as the regression guard, matching Phase 4's `jsx-a11y` precedent. That rule was why 32 `any`
accumulated without the lint ever failing. It required four fixes outside this phase's named
files: two `track: any` in `CustomizationMenu.tsx` (`playlist` is already `Track[]`), and in
`canvas/Computers.tsx` a `child: any` traverse callback, now `THREE.Object3D` narrowed with
`instanceof THREE.Mesh` plus `MeshStandardMaterial`, which also replaced five `!== undefined`
duck checks with real type guards, and `envPreset`, now a literal union rather than `string`.

**Surfaced but not fixed, being outside this phase:** post dates render one day early
(`Oct 27, 2025` for `date: '2025-10-28'`), because `new Date('2025-10-28')` is parsed as UTC
midnight and formatted in local time. Pre-existing and unchanged by this phase, since the schema
passes the same string through. `BlogPostsResponse` in `lib/types.ts` has no callers. The `w-18`
Tailwind class at `app/blog/[slug]/page.tsx:106` is not on the default scale. `calculateReadingTime`
counts fenced code blocks and JSX as prose, so code heavy posts overstate their reading time.

**Verified in the browser, not just by the tooling:** home page (3D desk materials, service cards,
work timeline, testimonials, project carousel and detail modal focus trap), the GitHub contribution
graph including a year switch that exercises the refetch path, both post pages with TOC anchors
resolving, the blog index, contact form validation, and the error boundary firing `client_error`
with a real digest on a cold load.

**TODO, not code:** none.

### 5.1 Hand written YAML parser silently discards the `author` object

**`lib/blog.ts:42-98`, both files in `content/blog/`** . **HIGH**

The frontmatter in both posts uses a nested object:

```yaml
author:
  name: 'Aiden Kopec'
```

The parser is strictly line by line (`lib/blog.ts:61`). It processes `author:` as a key with
an empty value and assigns `metadata.author = ''`, then processes the indented `name:` line as
a **separate top level key**, producing a spurious `metadata.name`.

So the declared author is thrown away on every post. It looks correct only because
`lib/blog.ts:128` falls back to a hardcoded `{ name: 'Aiden Kopec' }`. Add a guest author and
their byline is silently replaced with yours.

The parser also cannot handle multi line scalars (`>` / `|`), comments after values, escaped
quotes, nested objects generally, or multi line arrays.

**Fix:** use `gray-matter`. It is the standard for exactly this, it is about 15 KB, and it
deletes 57 lines of bespoke parsing along with this entire class of bug. Replace
`parseMDXFile`'s frontmatter block with `matter(fileContent)`.

### 5.2 The parser's return type is a lie enforced by two `as any` casts

**`lib/blog.ts:86, 88, 93`** . **HIGH**

```ts
} else if (key === 'published' || key === 'featured') {
  (metadata as any)[key] = value === 'true';
} else {
  (metadata as any)[key] = value;      // every value is a string
}
...
return { metadata: metadata as BlogMetadata, ... };
```

Arbitrary keys are written as strings into a `Partial<BlogMetadata>`, then the whole thing is
asserted to be a fully populated `BlogMetadata`. `BlogMetadata.author` is declared as
`{ name: string; avatar?: string }` but holds `''`. Every consumer downstream believes a type
the data does not satisfy, which is precisely how 5.1 stays invisible.

**Fix:** falls out of 5.1. Validate the parsed frontmatter with a zod schema and let the
inferred type be the source of truth, so a malformed post fails loudly at build time instead
of degrading quietly at runtime.

### 5.3 One untyped helper generates fifteen `as any` casts

**`utils/motion.ts:1-101`, 15 call sites** . **MEDIUM**

```ts
export const textVariant = (delay?: number) => {
  return {
    hidden: { y: -50, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', ... } },
  };
};
```

`type: 'spring'` widens to `string`, which is not assignable to framer-motion's
`Transition['type']` union. Every consumer papers over it identically:

```
components/About.tsx:27,64,70        components/RecentBlogs.tsx:34,52,64,80
components/Contact.tsx:175,328       components/GitHubActivityClient.tsx:54,586,601,614,650
components/Experience.tsx:80         components/ProjectsShowcase.tsx:542,588
```

Fifteen `as any` casts at the JSX boundary, all from one missing annotation. It is the single
highest leverage type fix in the repo, and a reviewer grepping for `as any` finds this cluster
immediately.

**Fix:** annotate the return types as `Variants` from framer-motion and use `as const` on the
literal transition types. All fifteen casts then delete cleanly.

### 5.4 `any` in the blog post page signature

**`app/blog/[slug]/page.tsx:106-109`** . **MEDIUM**

```tsx
function BlogPostRenderer({ post, previousPost, nextPost }: {
  post: any;
  previousPost: any;
  nextPost: any;
}) {
```

`BlogPost` is defined in `lib/types.ts:7` and already imported into this file's dependency
graph. Three `any`s in the page component of the site's primary content type.

**Fix:** `post: BlogPost; previousPost: BlogPost | null; nextPost: BlogPost | null`.

### 5.5 A server component calls a function named like a hook

**`app/blog/[slug]/page.tsx:101, 115`** . **MEDIUM**

```tsx
// Client component that handles MDX rendering
function BlogPostRenderer({ ... }) {
  ...
  const mdxComponents = useMDXComponents({});
```

Two problems. `BlogPostRenderer` is a **server** component, but the comment says client, and
`useMDXComponents` is named as a hook. It works only because it is not actually a hook, it is
a plain function returning an object. The `use` prefix is a contract with React, the linter
and every future reader, and this breaks it.

Separately, `mdx-components.tsx` is the file `@next/mdx` picks up automatically for
file based MDX routes. Calling it manually and passing the result to `next-mdx-remote` is a
different mechanism sharing one name, which will confuse anyone who knows the convention.

**Fix:** rename to `getMDXComponents`, hoist the call to module scope since the result is
static, and correct the misleading comment.

### 5.6 A union return type that forces casts on every consumer

**`lib/github-utils.ts:76-79`** . **MEDIUM**

```ts
export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[] | CommitWeek[];
}
```

`ContributionWeek` is `{ contributionDays: ContributionDay[] }` and `CommitWeek` is
`CommitDay[]`. Structurally unrelated shapes in an untagged union, so no consumer can narrow
without a runtime shape check or a cast. The two branches come from the GraphQL path and the
local fallback path in `fetchContributionCalendar` (`lib/github-service.ts:170-221`).

**Fix:** either normalize the fallback to the GraphQL shape at the boundary, which is the
simpler option and makes the union disappear, or add a discriminant
(`{ source: 'graphql' | 'derived' }`) so `switch` narrowing works.

### 5.7 A read function mutates the filesystem

**`lib/blog.ts:102-106`** . **MEDIUM**

```ts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(BLOG_DIRECTORY)) {
    fs.mkdirSync(BLOG_DIRECTORY, { recursive: true });
    return [];
  }
```

A getter with a filesystem side effect. On Vercel the runtime filesystem is read only outside
`/tmp`, so if this branch is ever reached at request time `mkdirSync` throws `EROFS` and the
error propagates uncaught, taking out the route rather than returning an empty list.

**Fix:** return `[]` without creating anything. The directory is part of the repo and its
absence is a build time problem, not something a request handler should try to repair.

### 5.8 Shared types live in `constants/` and are not exported

**`constants/index.ts:44-60`, `components/Experience.tsx:17-24`** . **MEDIUM**

`NavLink`, `Service`, `Technology`, `Experience` and `Testimonial` are declared in
`constants/index.ts` without `export`, while `lib/types.ts` exists for exactly this purpose.

The consequence is visible at `components/Experience.tsx:17-24`, where the `Experience`
interface is **copy pasted verbatim** because it could not be imported. The copy will drift
from the original the first time either changes. In the same file the local `const Experience`
component then shadows the interface name.

Meanwhile `About.tsx:97` gives up entirely: `services.map((service: any, index: number) => ...)`.

**Fix:** move the interfaces to `lib/types.ts`, export them, and import at both sites. The
`any` in `About.tsx` resolves for free.

### 5.9 `icon: any` where a precise type is already imported

**`constants/index.ts:47, 52, 58`** . **MEDIUM**

```ts
import type { StaticImageData } from 'next/image';
...
interface Service    { title: string; icon: any; }
interface Technology { name: string;  icon: any; }
interface Experience { ... icon: any; ... }
```

Every one of those icons is a static import of a PNG, JPEG, WebP or SVG, so they are all
`StaticImageData`. The correct type is imported at line 1 and used for `Project.image` at
line 95, then abandoned three times in the same file.

**Fix:** `icon: StaticImageData` in all three.

### 5.10 Validation logic is duplicated and already diverging

**`components/Contact.tsx:70-116` vs `lib/spam-protection.ts:66-164`** . **MEDIUM**

Both implement name, email and message validation with the same bounds (2/100, 10/5000) and
the same email regex, copied rather than shared. They have already drifted: the server also
enforces the ASCII charset rule, the gibberish heuristic, a special character ratio and an
uppercase ratio. None of those exist on the client.

The user facing effect is that some submissions pass every client check, round trip to the
server, and come back rejected with a message the form never warned about.

**Fix:** one zod schema in `lib/` imported by both. `safeParse` on the client for instant
feedback, the same schema on the server as the authority. This is the same schema 1.7 needs.

### 5.11 `content?: any` on the core domain type

**`lib/types.ts:22`** . **LOW**

```ts
content?: any; // MDX content
```

It is always the raw MDX source string as read from disk (`lib/blog.ts:172`), passed straight
to `MDXRemote source={post.content || ''}`.

**Fix:** `content?: string`.

### 5.12 tsconfig is missing the strictness options that catch real bugs

**`tsconfig.json:2-24`** . **LOW**

`strict: true` is on, which is the important part. But `noUncheckedIndexedAccess` is absent,
and this codebase indexes into arrays constantly without guarding: `match[1]` and `match[2]`
at `lib/blog.ts:22-23`, `forwardedFor.split(',')[0]` at `lib/spam-protection.ts:210`,
`featuredPosts[0]` at `app/blog/page.tsx:118`, `playlist[currentTrack]` at
`context/MusicContext.tsx:266`.

`target: 'ES2017'` is also conservative for a 2026 browser baseline and costs bytes in
downlevelled async and spread helpers.

**Fix:** add `noUncheckedIndexedAccess` and `noImplicitOverride`, and raise `target` to
`ES2022`. Expect a batch of genuine null safety fixes from the first flag, which is the point.

### 5.13 Error boundaries do not report anything

**`app/error.tsx`, `app/global-error.tsx`** . **LOW**

Neither logs the caught error anywhere. In production `error.message` is redacted by React and
only `digest` survives, and nothing sends that digest anywhere, so a crash on the live site
leaves you with no trace and a user holding an id that maps to nothing you can look up.

**Fix:** add a `useEffect` that reports `error` and `error.digest` to Vercel Observability or
Sentry on mount.

---

## Phase 6. Testing and CI

### 6.1 The repository contains no tests

**repo wide** . **CRITICAL**

No test files, no test runner, no `test` script in `package.json`. Zero coverage.

For a portfolio reviewed by senior and principal engineers this is the most commonly cited
gap, and it undercuts the work more than any individual defect in this document. It also has
a compounding cost: several findings here (5.1's author parsing, 1.4's rate limit off by one,
the tag slug mismatch in 6.4) are exactly the bugs a handful of unit tests would have caught
at write time.

There is a pointed detail available to you: your own blog post at
`content/blog/letting-strangers-write-to-my-database.mdx` presents "422 tests green" as
evidence of engineering rigour, and `constants/index.ts:38` lists Vitest in the Treeline
stack. A reviewer who reads the blog and then greps this repo finds nothing. That contrast is
worse than never having mentioned tests.

**Fix:** add Vitest with a `test` script. You do not need broad coverage, you need targeted
coverage of the logic that is actually tricky. Ranked by value:

1. **`lib/blog.ts` frontmatter parsing.** Nested `author`, multi line strings, quoted values,
   arrays, missing fields, malformed frontmatter, unpublished filtering. Fixture driven, and
   these tests are what make the `gray-matter` migration in 5.1 safe.
2. **`lib/spam-protection.ts`.** Window rollover, the limit boundary, expiry, and a table of
   names that must be accepted (`José`, `Nguyễn`, `Schmidt`, `Ng`, `O'Brien`).
3. **The contact route.** Malformed body returns 400, rate limited returns 429, Resend error
   returns 502 not 200. This is the regression test for 1.5.
4. **`lib/github-service.ts` calendar generation.** Week alignment, leap years, year
   boundaries, and the `year` validation from 1.1.
5. **Slug generation.** One `slugify` helper (4.5), property tested against the tag route
   resolution (6.4).

Aim for perhaps 40 to 60 meaningful tests. That reads far better than a high coverage number
over trivial component renders.

### 6.2 No CI pipeline

**no `.github/` directory** . **HIGH**

Nothing runs `lint`, `tsc` or `build` on push or pull request. The scripts exist and pass, but
nothing enforces that they keep passing, and a reviewer landing on the repo sees no green
check anywhere.

**Fix:** a single `.github/workflows/ci.yml` running `npm ci`, `npm run lint`,
`npx tsc --noEmit`, `npm run format:check`, `npm run build`, and `npm test` once 6.1 lands. A
passing badge in the README is a cheap, visible signal.

### 6.3 No end to end coverage of the one flow that matters

**repo wide** . **MEDIUM**

The contact form is the site's single conversion path and its only stateful user flow. It
currently has no automated verification at any level, which is how 1.5 (silent send failure)
can exist undetected.

**Fix:** one Playwright spec. Fill the form, intercept `/api/contact`, assert the success
state on 200 and, critically, assert that a 502 surfaces an error rather than confetti.

### 6.4 A latent tag routing bug that a test would pin down

**`lib/blog.ts:201-207` vs `lib/blog.ts:183-188`, `app/blog/tag/[tag]/page.tsx:16-21`** . **MEDIUM**

`getAllBlogTags` builds slugs with `name.toLowerCase().replace(/\s+/g, '-')`, and
`generateStaticParams` uses those slugs as route params. But `getBlogPostsByTag` resolves with
a raw comparison:

```ts
post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase());
```

For any tag containing a space, `generateStaticParams` emits `ai-tools` while the lookup
compares against `ai tools`, finds nothing, and calls `notFound()`. The build would
prerender a 404 for a tag page it generated itself.

Current tags (`AI`, `Automation`, `Learning`, `SaaS`, `Architecture`, `Next.js`, `Stripe`,
`PostgreSQL`) are all single words, so it does not fire today. It fires the first time you tag
a post "AI Tools" or "Web Development", and it will look like a content problem rather than a
code one.

**Fix:** slugify on both sides using the shared helper from 4.5, and add the test that catches
it.

### 6.5 No dependency or security automation

**repo wide** . **LOW**

No Dependabot or Renovate config, and no `npm audit` in CI. Given the recent
`deps-update-2026-09` branch was a manual batch update, automating it is a visible process
improvement.

**Fix:** `.github/dependabot.yml` with a weekly npm schedule and grouped minor updates.

### 6.6 No pre commit enforcement

**repo wide** . **LOW**

`.vscode/settings.json` configures format on save, which only helps contributors using VS Code
with the right extensions. Nothing enforces formatting or lint at the commit boundary.

**Fix:** `husky` plus `lint-staged` running Prettier and ESLint on staged files. Low value if
CI (6.2) exists, so treat this as optional.

---

## Phase 7. Structure, naming and CSS hygiene

Individually small. Collectively this is the layer that reads as "sloppy" versus
"deliberate", which is the bar you named.

### 7.1 Design tokens are defined twice, in two languages

**`app/globals.css:99-137` and `styles/index.ts:32-88`** . **HIGH**

All four themes' hex values exist in both files:

```css
/* app/globals.css */
html.glacierSapphire {
  --primary-color: #07121a;
  --text-color-variable: #60a5fa;
  ...
}
```

```ts
// styles/index.ts
glacierSapphire: {
  name: 'Glacier Sapphire',
  cssVars: { '--primary-color': '#07121a', '--text-color-variable': '#60a5fa', ... },
}
```

Nine variables times four themes, duplicated. They currently agree, which I verified. Nothing
keeps them agreeing. Changing an accent colour requires editing two files in two languages,
and the TS copy exists only so `CustomizationMenu` can render swatch previews
(`styles/index.ts:90-101`).

**Fix:** single source of truth. Keep the CSS as canonical and have the preview read computed
values via `getComputedStyle(document.documentElement)`, or generate the CSS from the TS
object at build time. The first is simpler and removes 57 lines.

### 7.2 A TypeScript module inside `public/`

**`public/assets/index.ts`** . **MEDIUM**

```ts
// Static asset imports for Next.js optimization
import github from './github.png';
export { github, menu, close };
```

`public/` is the static serving root. Source code there is conceptually wrong even though the
import happens to resolve, and it means a `.ts` file sits in the directory whose entire
contract is "these files are served verbatim to the internet".

It also sets up a trap: anything that globs `public/` for deployment or asset processing now
has to special case a TypeScript file.

**Fix:** move to `constants/assets.ts` (or fold into `constants/index.ts`, which already does
exactly this for every other asset category) and import from `../public/assets/...` the way
`constants/index.ts:4-37` does.

### 7.3 `hoc/` contains no higher order component

**`hoc/SectionWrapper.tsx`** . **MEDIUM**

The directory name promises a HOC. The file exports a plain wrapper component taking
`children` and `idName`. This is a fossil from a template where `SectionWrapper` genuinely was
`(Component, idName) => ...`, and the conversion left the directory behind.

A single file directory named after a pattern it does not implement is the kind of thing a
reviewer reads as "inherited, not understood".

**Fix:** move to `components/layout/SectionWrapper.tsx` and delete `hoc/`.

### 7.4 `styles/index.ts` is an indirection layer that defeats Tailwind

**`styles/index.ts:1-11`, 9 consumers** . **MEDIUM**

```ts
export const styles = {
  paddingX: 'padding-x',
  heroHeadText: 'hero-head-text',
  sectionHeadText: 'section-head-text',
  ...
};
```

These map JS identifiers onto hand written global CSS classes defined in `app/globals.css`,
which in turn reimplement responsive typography with four manual `@media` blocks each
(`globals.css:176-260`) rather than using Tailwind's responsive prefixes.

The cost is real: Tailwind IntelliSense cannot resolve `styles.heroHeadText`, the Prettier
class sorter cannot see these classes, and the values escape Tailwind's design token system
entirely. You are running Tailwind v4 and routing your most used typography around it.

**Fix:** express these as Tailwind utilities, either inline
(`text-[40px] xs:text-[50px] sm:text-[60px] lg:text-[80px]`) or as `@utility` definitions in
`globals.css` so the class names stay but Tailwind owns them. Then delete the mapping object.

### 7.5 `button.tsx` has doubled variant prefixes throughout

**`components/ui/button.tsx:8, 15, 17, 21`** . **MEDIUM**

```
dark:dark:aria-invalid:ring-red-900/40
dark:dark:bg-red-900/60
dark:dark:border-neutral-800
dark:dark:bg-neutral-800/30
dark:dark:hover:bg-neutral-800/50
dark:dark:hover:bg-neutral-100/50
dark:dark:focus-visible:ring-red-900/40
```

`dark:dark:` is not valid and these classes do nothing. The `outline` variant also stacks
three mutually contradictory dark backgrounds on one element:
`dark:bg-neutral-200/30 dark:bg-neutral-950 dark:dark:bg-neutral-800/30`.

This is unreviewed generated output, and it is in the one file a reviewer is most likely to
open to gauge component quality.

**Fix:** regenerate from the current shadcn registry or clean by hand. See 7.6 first, because
it may be moot.

### 7.6 Every `dark:` variant in the codebase is dead

**`app/globals.css:4`, `components/ui/button.tsx`** . **MEDIUM**

```css
@custom-variant dark (&:is(.dark *));
```

The variant keys off a `.dark` class. But `app/layout.tsx:94-99` configures next-themes with
`themes={['glacierSapphire', 'obsidian', 'cosmicVoyage', 'auroraJade']}` and
`enableSystem={false}`. No `.dark` class is ever applied to any element, under any theme.

So every `dark:` utility in `button.tsx`, roughly 25 of them, is permanently unreachable. The
component has two visual modes defined and only one that can happen.

**Fix:** delete the `dark:` variants from `button.tsx` and restyle it against the theme tokens
(`--tertiary-color`, `--text-color-variable`) that the rest of the app actually uses. Remove
the `@custom-variant` line unless you intend to add a real light mode.

### 7.7 `--color-primary` is defined twice in the same `@theme` block

**`app/globals.css:9, 63`** . **MEDIUM**

```css
@theme {
  --color-primary: var(--primary-color);        /* line 9,  the dark background */
  ...
  --color-primary: var(--text-color-variable);  /* line 63, the accent colour */
}
```

The second wins, so `bg-primary` produces the accent colour, not the background. That is
almost certainly why the codebase avoids `bg-primary` and uses a hand written `.bg-primary-color`
class (`globals.css:363-365`) instead. The workaround is visible in `app/page.tsx:17`,
`app/blog/page.tsx:215` and elsewhere.

`--color-secondary` collides the same way at lines 10 and 71.

**Fix:** rename the shadcn compatibility tokens (`--color-accent-primary`) so they stop
colliding, then use the standard Tailwind utilities and delete the manual override classes.

### 7.8 Gradient utility classes cancel themselves out

**`app/globals.css:270-306`** . **MEDIUM**

`.blue-text-gradient`, `.green-text-gradient`, `.pink-text-gradient` and
`.orange-text-gradient` are each defined **twice**. The first definition sets up the
background clip gradient:

```css
.blue-text-gradient {
  background: linear-gradient(90deg, #00d4ff 0%, #0099cc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #00d4ff;
}
```

Then 20 lines later, under a `/* Project Tag Styling */` comment:

```css
.blue-text-gradient {
  color: #00d4ff !important;
}
```

The `!important` colour overrides the transparent text fill, so the gradient never renders.
Four classes, eight rule blocks, and the feature they implement does not work.

**Fix:** delete the second block of four rules.

### 7.9 An invalid declaration and a reversed gradient

**`app/globals.css:163-167`** . **MEDIUM**

```css
.green-pink-gradient {
  background: '#00cea8';
  background: linear-gradient(90.13deg, #00cea8 1.9%, #bf61ff 97.5%);
  background: -webkit-linear-gradient(-90.13deg, #00cea8 1.9%, #bf61ff 97.5%);
}
```

Three problems in four lines. The first declaration is a **quoted string**, which is not a
valid colour value and is discarded. The vendor prefixed version is declared **last**, so it
wins in every Chromium and WebKit browser, which is nearly all of them. And it uses
`-90.13deg` where the standard version uses `90.13deg`, so the gradient renders in the
opposite direction from what the unprefixed rule specifies.

**Fix:** delete the first two lines and keep a single unprefixed
`linear-gradient(90.13deg, ...)`. The prefix has not been needed since 2016.

### 7.10 An invalid box-shadow in the root loading state

**`app/loading.tsx:26`** . **MEDIUM**

```tsx
boxShadow: `0 0 60px rgba(var(--gradient-start), 0.3), 0 0 120px rgba(var(--gradient-start), 0.1), ...`;
```

`--gradient-start` is a hex colour (`#60a5fa` under the default theme), so this expands to
`rgba(#60a5fa, 0.3)`, which is invalid CSS. The entire `box-shadow` declaration is dropped,
including the valid inset shadow after it, so the glow effect the code is written to produce
silently does not exist.

**Fix:** use `color-mix(in srgb, var(--gradient-start) 30%, transparent)`, or define the theme
accents as RGB triplets (`--gradient-start-rgb: 96 165 250`) so `rgb(var(--x) / 0.3)` works.

### 7.11 A hand escaped Tailwind class override with `!important`

**`app/globals.css:376-378`** . **MEDIUM**

```css
.group:hover .group-hover\:text-\[var\(--text-color-variable\)\] {
  color: var(--text-color-variable) !important;
}
```

Manually writing Tailwind's escaped class name in raw CSS to force a utility that should have
worked on its own. This is a workaround for a symptom, and it will silently stop matching if
Tailwind ever changes its escaping.

The likely root cause is 7.7: the `.text-secondary` manual class at `globals.css:371-373`
competes with the arbitrary value utility at the same specificity, and the one declared later
in the stylesheet wins.

**Fix:** remove the manual colour utility classes at `globals.css:353-373` that duplicate what
`@theme` already generates, then this override becomes unnecessary.

### 7.12 Manual utility classes duplicate generated ones

**`app/globals.css:353-373` vs `app/globals.css:6-20`** . **MEDIUM**

`@theme` already generates `bg-tertiary`, `bg-black-100` and `text-secondary` from
`--color-tertiary`, `--color-black-100` and `--color-secondary`. They are then declared again
by hand at the bottom of the file as plain CSS.

Two definitions of the same class name at different points in the cascade, with no indication
which is intended to win. This is the direct cause of 7.11.

**Fix:** delete the manual block and rely on `@theme`.

### 7.13 Orphaned class fragments in shipped markup

**`components/Experience.tsx:68`, `components/blog/BlogPagination.tsx:70, 124`** . **LOW**

```tsx
className = '-100 pl-1 text-[14px] tracking-wider text-secondary';
```

A bare `-100`, almost certainly the tail of a mangled `text-white-100`. Combined with the
`/50` fragments in 4.7, these are leftovers from a find and replace that split class names.
They emit invalid tokens into production HTML.

**Fix:** remove `-100`. Fix the `/50` instances per 4.7. Then grep for other orphans:
`grep -rnE "className='[^']*(^| )(-[0-9]+|/[0-9]+)( |')"`.

### 7.14 Timeline arrow uses a hardcoded colour from a deleted theme

**`components/Experience.tsx:37`** . **LOW**

```tsx
contentArrowStyle={{ borderRight: '7px solid  #232631' }}
```

`#232631` is not `--tertiary-color` under any of the four themes (`#0b2740`, `#1a1a1a`,
`#1a0f2e`, `#0f2c24`). The arrow pointing at each timeline card is therefore visibly the
wrong colour in every theme, and the value is a fossil from the original template's palette.
There is also a double space in the declaration.

The same file hardcodes `color: '#ffffff'` at `:35` where `var(--white-100)` is the token.

**Fix:** `borderRight: '7px solid var(--tertiary-color)'`.

### 7.15 Import style is inconsistent across the app

**`app/api/contact/route.ts:4-10` vs `app/api/blog/route.ts:3-7`** . **LOW**

```ts
// app/api/contact/route.ts
import UserAcknowledgmentEmail from '../../../components/emails/UserAcknowledgment';
import { validateContactFormContent } from '../../../lib/spam-protection';
```

```ts
// app/api/blog/route.ts
import { getAllBlogPosts } from '@/lib/blog';
```

The `@/*` alias is configured (`tsconfig.json:21-23`) and used in roughly half the codebase.
`app/api/contact/route.ts`, `app/api/github/route.ts`, `components/GitHubActivity.tsx`,
`components/Contact.tsx`, `components/Experience.tsx` and others use three level relative
paths instead.

**Fix:** standardise on `@/`. Consider adding the `no-restricted-imports` ESLint rule to ban
`../../` so it stays fixed.

### 7.16 Unused and misplaced dependencies

**`package.json:25, 34, 39, 59`** . **LOW**

| Package                            | Issue                                                            |
| ---------------------------------- | ---------------------------------------------------------------- |
| `prop-types` (`:39`)               | Zero references anywhere. Dead.                                  |
| `mini-svg-data-uri` (`:34`)        | Zero references anywhere. Dead.                                  |
| `@types/canvas-confetti` (`:25`)   | A types package in `dependencies` rather than `devDependencies`. |
| `baseline-browser-mapping` (`:59`) | A transitive `browserslist` dependency pinned directly.          |
| `lodash` / `@types/lodash`         | Removable once 3.5 lands.                                        |

Worth noting because commit `260135e` made dead code removal an explicit goal, so leaving
unused runtime dependencies behind is inconsistent with the stated intent.

**Fix:** `npm uninstall prop-types mini-svg-data-uri baseline-browser-mapping`, and move
`@types/canvas-confetti` to `devDependencies`.

### 7.17 Small residue worth clearing in one pass

**various** . **LOW**

- **`components/Contact.tsx:18, 185`** . `formRef` is created and attached but never read.
  Dead.
- **`hooks/useMusicPlayer.ts:6-8`** . Throws if `context` is falsy, but `useMusicContext`
  (`context/MusicContext.tsx:46-52`) already throws in that case, so the branch is
  unreachable. The whole hook is a pass through that re exports the context with one renamed
  field, an abstraction layer over a single call site.
- **`context/MusicContext.tsx:76`** . `/* eslint-disable react-hooks/set-state-in-effect */`
  suppresses a rule that `hooks/useIsHydrated.ts` already solves correctly with
  `useSyncExternalStore`, and which `CustomizationMenu.tsx:21` and `WavyLines.tsx:75` already
  use. Reuse the hook instead of suppressing the rule.
- **`context/MusicContext.tsx:81-91`** . `parseInt(savedTrack)` has no radix and no bounds
  check, and `JSON.parse(savedFloatingBarVisible)` is unguarded. Malformed localStorage throws
  inside the provider that wraps the entire app, taking the whole site down. Wrap in
  try/catch and clamp the index.
- **`app/error.tsx` and `app/global-error.tsx`** . Roughly 120 near identical lines each.
  Extract the shared shell.
- **`mdx-components.tsx:10-89`** . The same four line slug expression appears four times, and
  a fifth time in `lib/blog.ts:24-29`. Extract `slugify` (required by 4.5 and 6.4 anyway).
- **`components/ui/button.tsx:44-62`** . `ButtonProps` is written out twice, once inline in
  the signature and once as an exported type. Define once, reference twice.
- **`constants/index.ts:51`** . `company_name` is snake_case in an otherwise camelCase
  codebase.
- **`styles/index.ts:49, 62`** . Theme key `obsidian` has display name "Obsidian Black", key
  `cosmicVoyage` has display name "Cosmic Purple". Pick one vocabulary.
- **`app/globals.css:101`** . Comment reads "Default theme variables (Obsidian Black)" but
  `app/layout.tsx:97` sets `defaultTheme='glacierSapphire'`. The `:root` block is actually the
  obsidian palette, so the comment is right about the values and wrong about which theme is
  default.
- **`hooks/useBlogSearch.ts:12-18`** . `categories` is built from `post.tags`, not
  `post.category`. `BlogPost.category` exists (`lib/types.ts:24`), is populated on one of the
  two posts, and is never read. Either the naming is wrong or the feature is half built.
- **`components/ui/background-boxes.tsx:23`** . `colors[(row * 7 + col * 3) % colors.length]`
  with `colors.length === 9`. Since `col * 3 % 9` only yields `{0, 3, 6}`, exactly three of
  the nine colours can appear in any given row, repeating every third column. `colors[0]` and
  `colors[6]` are also the same value (`#93c5fd`). Use a stride coprime with the length, such
  as `col * 5`, and remove the duplicate colour.
- **`components/blog/BlogHero.tsx:18`** . `BlogHero` owns a private `searchTerm` and pushes it
  up via `onSearch`, but nothing pushes back down. Clicking "Clear filters" at
  `app/blog/page.tsx:196` resets the list while the hero input keeps showing the stale query.
  Lift the state into `useBlogSearch` and pass it down as a controlled value.
- **`components/canvas/ProjectRing.tsx:272`** . The comment claims the ring "starts where the
  cursor already is instead of easing in from 0", but `Panel`'s `useFrame` subscribes in a
  child layout effect, which runs before the parent `Ring`'s, so on the first frame the panels
  read `spin.current === 0` before the seeding block has run. Harmless on first load, wrong on
  any remount, and the comment describes the opposite of the behaviour.

---

## Appendix. What is already good

Worth knowing so none of it gets refactored away:

- **`hooks/useIsHydrated.ts`** is a textbook `useSyncExternalStore` implementation with a
  comment that explains why it exists rather than what it does.
- **`lib/github-service.ts:1-4`** uses `server-only` to enforce the server boundary, and
  splits shared types into `github-utils.ts` specifically so client components can import them
  without dragging the service in. That is a deliberate, correct architectural decision.
- **`app/blog/[slug]/page.tsx:26-70`** generates complete per post metadata including OG and
  Twitter cards with `publishedTime` and `tags`. This is the standard every other route should
  be held to.
- **`constants/index.ts:80-99`** has real JSDoc on the `Project` interface explaining the
  constraints behind each field ("Featured tier only. Rendered as a four column row, so keep
  it to four."). That is documentation that earns its place.
- **`components/ProjectsShowcase.tsx:17`** already demonstrates the correct `next/dynamic`
  pattern for the 3D canvases, and `:412` is the one place that respects
  `prefers-reduced-motion`. Both are the models for Phase 3 and Phase 4.
- **`next.config.ts:13-15`** pairs `dangerouslyAllowSVG` with `contentDispositionType:
'attachment'` and a sandboxing CSP, which is the correct and frequently missed mitigation.
- **The `.prettierrc.js` fix in `51d8b72`**, switching from a non existent
  `tailwind.config.js` to `tailwindStylesheet: './app/globals.css'`, was a genuine catch. It
  is what let the class sorter finally resolve the custom colour names.
- **`content/blog/letting-strangers-write-to-my-database.mdx`** is genuinely strong writing
  and the best asset in the repository. Phase 2 exists largely so that people can find it.

---

## Suggested sequencing

**First sitting (1 to 2 hours, highest visible return):** all of Phase 0, plus 1.1 and 1.5.
The README alone changes the first impression, and the GraphQL injection and the silent email
failure are the two findings you would least want a reviewer to discover before you do.

**Second (1 day):** the rest of Phase 1. Security findings read badly in a portfolio because
they suggest the author does not think about them, and each fix here is small.

**Third (1 to 2 days):** Phase 2, led by 2.1. Converting the blog to server rendering is the
change that most alters how the codebase reads to a Next.js reviewer, and it deletes code
rather than adding it.

**Fourth (1 day):** Phase 3 items 3.1, 3.2 and 3.4. A 21 MB texture and 215 KB of gzipped
WebGL on first load are measurable in any Lighthouse run a reviewer might do.

**Fifth (1 to 2 days):** Phase 6. Tests plus CI. Do this before Phase 4 and 5 so those
refactors land against a safety net, and because the gap between your blog post's "422 tests
green" and this repo's zero is the contrast most worth closing.

**Then:** Phases 4, 5 and 7 as ongoing passes. 5.3 is worth pulling forward regardless, since
one annotation in `utils/motion.ts` removes fifteen `as any` casts.
