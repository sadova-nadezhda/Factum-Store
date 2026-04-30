import React from 'react';

import s from './EventsCard.module.scss';
import { StarIcon } from '@/components/Icons';

interface EventsCardProps {
  title: string;
  reward: number;
}

export default function EventsCard({ title, reward }: EventsCardProps) {
  return (
    <article className={s.card}>
      <div className={s.card__caption}>{title}</div>
      <div className={s.card__reward}>
        <span>Награда: {reward}</span>
        <StarIcon />
      </div>
    </article>
  );
}
