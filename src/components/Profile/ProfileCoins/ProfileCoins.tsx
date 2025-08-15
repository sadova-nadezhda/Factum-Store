import React from 'react';

import Title from '../../Title';
import { CoinsCard } from '../../Card';
import TransferForm from '../../Form/TransferForm';

import s from './ProfileCoins.module.scss';

export default function ProfileCoins() {
  return (
    <>
      <div className={s.coins__wrap}>
        <Title component='h4' className={s.coins__title}>Мои коины</Title>
        <div className={s.coins__cards}>
          <CoinsCard caption='Кошелек' balance={250} />
          <CoinsCard caption='Кошелек Hr' balance={550} />
        </div>
      </div>
      <div className={s.coins__wrap}>
        <Title component='h4' className={s.coins__title}>Подарить Коины</Title>
        <TransferForm />
      </div>
      
    </>
  )
}
