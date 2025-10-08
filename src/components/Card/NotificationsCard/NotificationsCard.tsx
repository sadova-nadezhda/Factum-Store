import React from 'react';

import { StarIcon } from '../../Icons';

import s from './NotificationsCard.module.scss';

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
  const captionText = caption || 'Переводы';
  const captionClass = caption
    ? `${s.card__caption} ${s.active}`
    : s.card__caption;
  return (
    <div className={s.card}>
      <div className={s.card__details}>
        <div className={captionClass}>{captionText}</div>

        <div className={s.card__desc}>
          {desc ? (
            desc
          ) : (
            <>
              <span>{sender}</span>{' '}
              <span aria-hidden>➜</span>{' '}
              <span>{receiver}</span>
            </>
          )}
        </div>

        <span className={s.card__date}>{date}</span>
      </div>

      <div className={s.card__amount}>
        <span>{amount}</span>
        <StarIcon />
      </div>
    </div>
  );
}