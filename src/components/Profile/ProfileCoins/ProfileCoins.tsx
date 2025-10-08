import React from 'react';

import Title from '../../Title';
import { CoinsCard } from '../../Card';
import TransferForm from '../../Form/TransferForm';

import { useGetMyWalletsQuery } from '../../../features/auth/authAPI';

import s from './ProfileCoins.module.scss';


export default function ProfileCoins() {
  const { data, isLoading, isError } = useGetMyWalletsQuery();

  if (isLoading) return <div>Загрузка баланса…</div>;
  if (isError || !data) return <div>Не удалось получить кошельки</div>;

  const main = data.wallets.find(w => w.type === 'main');
  const hr   = data.wallets.find(w => w.type === 'hr_pool');
  const manager = data.wallets.find(w => w.type === 'manager_pool');

  return (
    <>
      <div className={s.coins__wrap}>
        <Title as='h4' className={s.coins__title}>Мои коины</Title>
        <div className={s.coins__cards}>
          {main && <CoinsCard caption='Кошелек' balance={main.balance} />}
          {manager && <CoinsCard caption='Кошелек Руководителя' balance={manager.balance} />}
          {hr && <CoinsCard caption='Кошелек HR' balance={hr.balance} />}
        </div>
      </div>

      <div className={s.coins__wrap}>
        <Title as='h4' className={s.coins__title}>Подарить Коины</Title>
        <TransferForm wallets={data.wallets} />
      </div>
    </>
  );
}