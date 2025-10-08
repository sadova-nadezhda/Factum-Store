import React from 'react';

import Title from '../../Title';
import { StarIcon } from '../../Icons';

import s from './CoinsCard.module.scss';

export default function CoinsCard( {caption, balance}) {
  return (
    <div className={s.card}>
      <Title as='h4' className={s.card__caption}>{ caption }</Title>
      <div className={s.card__balance}>
        Баланс: {balance}
        <StarIcon />
      </div>
    </div>
  )
}
