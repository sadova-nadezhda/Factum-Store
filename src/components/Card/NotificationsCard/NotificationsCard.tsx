import React from 'react';

import s from './NotificationsCard.module.scss';
import { StarIcon } from '@/components/Icons';

interface NotificationsCardProps {
  caption?: string;
  sender?: string;
  receiver?: string;
  amount: string;
  date: string;
  desc?: string | undefined;
}

export default function NotificationsCard({
  caption,
  sender,
  receiver,
  desc,
  amount,
  date,
}: NotificationsCardProps) {
  const title = caption || 'Перевод coins';
  const description = desc || `${sender} → ${receiver}`;

  return (
    <article className={s.card}>
      <div className={s.card__body}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className={s.card__meta}>
        <span>{date}</span>
        <div className={s.card__amount}>
          {amount}
          <StarIcon />
        </div>
      </div>
    </article>
  );
}
