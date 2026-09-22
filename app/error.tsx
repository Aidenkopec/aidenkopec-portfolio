'use client';
import { ErrorShell } from '@/components/ErrorShell';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorShell
      error={error}
      reset={reset}
      title='Something went wrong!'
      description="An unexpected error occurred while loading this page. Don't worry, this happens sometimes and we're working to fix it."
      resetLabel='Try Again'
      homeLabel='Go Home'
    />
  );
}
