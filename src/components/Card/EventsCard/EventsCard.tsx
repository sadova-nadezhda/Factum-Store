import React from 'react';

import { StarIcon } from '@/components/Icons';

import s from './EventsCard.module.scss';

interface EventsCardProps {
  title: string,
  reward: number,
}

export default function EventsCard({title , reward}: EventsCardProps) {
  return (
    <div className={s.card}>
      <div className={s.card__caption}>{title}</div>
      <div className={s.card__reward}>
        Награда: {reward}
        <StarIcon />
      </div>
    </div>
  )
}
