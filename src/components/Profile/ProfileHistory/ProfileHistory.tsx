import React from 'react';

import Title from '../../Title';
import { HistoryCard } from '../../Card';

import s from './ProfileHistory.module.scss';

export default function ProfileHistory() {
  return (
    <>
      <Title component='h4' className={s.history__caption}>История</Title>
      <div className={s.history__cards}>
        <HistoryCard
          id={123}
          img='/assets/img/product-1.png'
          title='Футболка'
          price={150}
          date='01.08.2025'
          status='done'
        />
        <HistoryCard
          id={124}
          img='/assets/img/product-2.png'
          title='Керамическая кружка с логотипом'
          price={50}
          date='01.08.2025'
          status='done'
        />
        <HistoryCard
          id={125}
          img='/assets/img/product-3.png'
          title='Бейсболка'
          price={100}
          date='03.08.2025'
          status='wait'
        />
        <HistoryCard
          id={126}
          img='/assets/img/product-4.png'
          title='Блокнот'
          price={100}
          date='07.08.2025'
          status='wait'
        />
      </div>
    </>
  )
}
