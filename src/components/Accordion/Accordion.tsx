import React, { useState } from 'react';
import classNames from 'classnames';

import s from './Accordion.module.scss';

export interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string | undefined;
}

export default function Accordion({
  items,
  allowMultiple = false,
  className,
}: AccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenIndexes((previous) =>
      allowMultiple
        ? previous.includes(index)
          ? previous.filter((item) => item !== index)
          : [...previous, index]
        : previous.includes(index)
          ? []
          : [index]
    );
  };

  return (
    <div className={classNames(s.accordion, className)}>
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);

        return (
          <div key={index} className={classNames(s.item, isOpen && s.open)}>
            <button
              type="button"
              className={s.header}
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <span className={s.icon} aria-hidden="true">
                +
              </span>
            </button>

            <div
              className={s.body}
            >
              <div className={s.content}>
                <div className={s.contentInner}>{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
