import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { EB_Garamond, Geist, Geist_Mono } from 'next/font/google';

import FloatingMusicBar from '@/components/FloatingMusicBar';
import { InlineScript } from '@/components/InlineScript';
import { MotionProvider } from '@/components/MotionProvider';
import { SWARM_INTRO_SCRIPT } from '@/components/swarm/introScript';
import { GITHUB_URL } from '@/constants';
import { themeKeys } from '@/constants/themes';
import { MusicProvider } from '@/context/MusicContext';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Section titles, set like the labels on an old star atlas.
const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aidenkopec.com'),
  alternates: {
    canonical: '/',
  },
  title: 'Aiden Kopec - Full-Stack Software Developer Portfolio',
  description:
    'Aiden Kopec is a Full-Stack Software Developer specializing in scalable web apps, AI tools, and backend automations. Delivering $2M+ in business impact with expertise in Next.js, Vue.js, TypeScript, Node.js, EdgeDB, and modern technologies for efficiency and growth.',
  keywords: [
    'Aiden Kopec',
    'full-stack developer',
    'software engineer',
    'web development',
    'AI tools',
    'backend automations',
    'Next.js developer',
    'Vue.js',
    'TypeScript',
    'Node.js',
    'EdgeDB',
    'portfolio',
    'software developer portfolio',
  ],
  authors: [{ name: 'Aiden Kopec' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Aiden Kopec - Full-Stack Software Developer Portfolio',
    description:
      "Discover Aiden Kopec's portfolio: Building scalable web apps, AI tools, and backend automations with Next.js, Vue.js, TypeScript, Node.js, and EdgeDB. $2M+ in business impact.",
    url: 'https://aidenkopec.com',
    siteName: 'Aiden Kopec Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aiden Kopec - Full-Stack Software Developer Portfolio',
    description:
      'Aiden Kopec: Full-Stack Developer creating scalable web apps, AI tools, and automations. Expertise in Next.js, Vue.js, TypeScript, Node.js, EdgeDB.',
  },
  icons: {
    icon: '/favicon.ico',
    // Was /assets/logo.png, a 978 KB 1024x1024 PNG fetched as a favicon on every
    // page. app/favicon.ico is the right asset for this slot.
    shortcut: '/favicon.ico',
    apple: '/assets/apple-icon.png',
  },
};

// Structured data for the knowledge panel on a name search.
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Aiden Kopec',
  url: 'https://aidenkopec.com',
  image: 'https://aidenkopec.com/assets/logo.webp',
  jobTitle: 'Full-Stack Software Developer',
  description:
    'Full-Stack Software Developer specializing in scalable web apps, AI tools, and backend automations.',
  // Add a LinkedIn or X profile URL here to strengthen entity matching.
  sameAs: [GITHUB_URL],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* Must run before first paint, so a plain inline script. */}
        <InlineScript html={SWARM_INTRO_SCRIPT} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ebGaramond.variable} antialiased`}
      >
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <ThemeProvider
          attribute='class'
          themes={themeKeys}
          defaultTheme='glacierSapphire'
          enableSystem={false}
        >
          <MotionProvider>
            <MusicProvider>
              {children}
              <FloatingMusicBar />
            </MusicProvider>
          </MotionProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
