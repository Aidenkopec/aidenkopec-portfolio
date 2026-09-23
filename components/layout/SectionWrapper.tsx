import React, { ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  /** In page anchor target. Omitted for sections nothing links to. */
  idName?: string;
  /** Accessible name for the section landmark. */
  label?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  idName,
  label,
}) => {
  return (
    // The id sits on the section itself. It used to live on an empty `hash-span`
    // whose class was defined nowhere, so following a nav link landed on a
    // non breaking space with no announced context. The navbar offset comes
    // from `:target { scroll-margin-top }` in globals.css, not from the span.
    //
    // The wider left padding on phones leaves room for the flight path, which
    // runs down the middle of it (see --rail in globals.css).
    <section
      id={idName || undefined}
      aria-label={label}
      className='relative z-0 mx-auto max-w-7xl padding max-sm:pl-12'
    >
      {children}
    </section>
  );
};

export default SectionWrapper;
