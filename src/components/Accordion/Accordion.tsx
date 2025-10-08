import React, { useEffect, useRef, useState } from 'react';
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
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleItem = (index: number) => {
    setOpenIndexes((prev) =>
      allowMultiple
        ? prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        : prev.includes(index) ? [] : [index]
    );
  };

  useEffect(() => {
    openIndexes.forEach((index) => {
      const el = contentRefs.current[index];
      if (el) el.style.maxHeight = el.scrollHeight + 'px';
    });
  }, [openIndexes]);

  return (
    <div className={classNames(s.accordion, className)}>
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);

        return (
          <div key={index} className={classNames(s.accordionItem, { [s.open]: isOpen })}>
            <button
              type="button"
              className={classNames(s.accordionHeader, { [s.active]: isOpen })}
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
            >
              {item.title}
            </button>

            <div
              ref={(el) => (contentRefs.current[index] = el)}
              className={s.accordionBody}
              style={{
                maxHeight: isOpen ? `${contentRefs.current[index]?.scrollHeight || 0}px` : '0px',
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className={s.accordionContent}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}