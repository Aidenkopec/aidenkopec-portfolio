'use client';
import { Analytics } from '@vercel/analytics/next';

import { ErrorShell } from '@/components/layout/ErrorShell';
import { MotionProvider } from '@/components/providers/MotionProvider';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang='en'>
      <body>
        {/* This route replaces the root layout, so it is outside the app's
            MotionProvider and Analytics and needs its own of each. */}
        <Analytics />
        <MotionProvider>
          <ErrorShell
            error={error}
            reset={reset}
            title='Critical Error'
            description='A critical error occurred that affected the entire application. This is likely a temporary issue.'
            resetLabel='Reload Application'
            homeLabel='Fresh Start'
            hardNavigateHome
          />
        </MotionProvider>
      </body>
    </html>
  );
}
