import React from 'react';

import s from './CoinsCard.module.scss';

type CoinsCardProps = {
  caption: string;
  balance: React.ReactNode;
  note?: string;
};

export default function CoinsCard({ caption, balance, note }: CoinsCardProps) {
  return (
    <article className={s.card}>
      <span>{caption}</span>
      <strong>{balance}</strong>
      {note ? <p>{note}</p> : null}
    </article>
  );
}
