import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  /** One plain sentence under the title. */
  intro?: ReactNode;
  /** Sits opposite the title on wide screens, such as an outbound link. */
  action?: ReactNode;
}

/** A section title with its stop on the flight path. */
export default function SectionHeader({
  title,
  intro,
  action,
}: SectionHeaderProps) {
  return (
    <header className='flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between'>
      <div>
        <h2 className='relative chart-title'>
          <span aria-hidden='true' data-waypoint className='waypoint' />
          {title}
        </h2>
        {intro && (
          <p className='mt-5 max-w-2xl text-[17px] leading-[1.7] text-white-100/70'>
            {intro}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}
