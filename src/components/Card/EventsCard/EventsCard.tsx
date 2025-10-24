import React from 'react';

import { StarIcon } from '@/components/Icons';

import s from './EventsCard.module.scss';

export default function EventsCard({caption , reward}) {
  return (
    <div className={s.card}>
      <div className={s.card__caption}>{caption}</div>
      <div className={s.card__reward}>
        Награда: {reward}
        <StarIcon />
      </div>
    </div>
  )
}
