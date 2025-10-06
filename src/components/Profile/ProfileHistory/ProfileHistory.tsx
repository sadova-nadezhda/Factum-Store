import React, { useMemo } from 'react';

import Title from '../../Title';
import { HistoryCard } from '../../Card';

import { useGetMyWalletsQuery } from '../../../features/auth/authAPI';

import s from './ProfileHistory.module.scss';


function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function ProfileHistory() {
  const { data, isLoading, isError } = useGetMyWalletsQuery();

  const orders = useMemo(() => {
    if (!data?.orders) return [];
    return [...data.orders].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [data]);

  if (isLoading) return <div>Загрузка истории…</div>;
  if (isError) return <div>Не удалось загрузить историю</div>;

  if (!orders.length) {
    return (
      <>
        <Title component="h4" className={s.history__caption}>История</Title>
        <div className={s.history__empty}>Пока нет заказов</div>
      </>
    );
  }

  return (
    <>
      <Title component="h4" className={s.history__caption}>История</Title>
      <div className={s.history__cards}>
        {orders.map((o) => (
          <HistoryCard
            key={o.id}
            id={o.id}
            img={o.image && o.image.trim() !== '' ? o.image : '/assets/img/product.jpg'}
            title={`${o.product_name}`}
            price={o.price_at_purchase}
            date={formatDate(o.created_at)}
            status="done" 
          />
        ))}
      </div>
    </>
  );
}