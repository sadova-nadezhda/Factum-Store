import React from 'react';
import classNames from 'classnames';
import type { ReactNode } from 'react';

interface SectionProps {
  className?: string | undefined;
  id?: string | undefined;
  children: ReactNode;
}

export default function Section({ className, id, children }: SectionProps) {
  return (
    <section id={id} className={classNames(className)}>
      <div className="container">
        {children}
      </div>
    </section>
  );
}
