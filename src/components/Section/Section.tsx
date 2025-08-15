import React, { ReactNode } from 'react';
import classNames from 'classnames';

interface SectionProps {
  className?: string;
  id?: string;
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