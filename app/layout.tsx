import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { MusicProvider } from '@/context/MusicContext';
import { ThemeProvider } from 'next-themes';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Aiden Kopec - Full Stack Software Developer Portfolio',
  description:
    'Aiden Kopec is a Full Stack Software Developer specializing in scalable web apps, AI tools, and backend automations. Delivering $2M+ in business impact with expertise in Next.js, Vue.js, TypeScript, Node.js, EdgeDB, and modern technologies for efficiency and growth.',
  keywords: [
    'Aiden Kopec',
    'full stack developer',
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
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Aiden Kopec - Full Stack Software Developer Portfolio',
    description:
      'Discover Aiden Kopec’s portfolio: Building scalable web apps, AI tools, and backend automations with Next.js, Vue.js, TypeScript, Node.js, and EdgeDB. $2M+ in business impact.',
    url: 'https://aidenkopec.com',
    siteName: 'Aiden Kopec Portfolio',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Aiden Kopec Portfolio Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aiden Kopec - Full Stack Software Developer Portfolio',
    description:
      'Aiden Kopec: Full Stack Developer creating scalable web apps, AI tools, and automations. Expertise in Next.js, Vue.js, TypeScript, Node.js, EdgeDB.',
    images: ['/assets/logo.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/assets/logo.png',
    apple: '/assets/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          themes={[
            'obsidian',
            'cosmicVoyage',
            'midnightBlue',
            'deepForest',
            'crimsonFire',
          ]}
          defaultTheme="obsidian"
          enableSystem={false}
        >
          <MusicProvider>{children}</MusicProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
