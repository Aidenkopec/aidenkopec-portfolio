'use client';

/**
 * A script that runs once from the server HTML, before first paint. React
 * warns when the client renders a <script>, so the client copy is inert
 * text/plain; suppressHydrationWarning accepts the type mismatch. Pattern from
 * the Next.js guide "Preventing flash before hydration".
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
