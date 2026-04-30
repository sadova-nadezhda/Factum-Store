import React, { useMemo } from 'react';

import { HistoryCard } from '../../Card';

import { useGetMyWalletsQuery } from '@/features/wallets/walletsAPI';

import s from './ProfileHistory.module.scss';

function formatDate(iso: string) {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export default function ProfileHistory() {
  const { data, isLoading, isError } = useGetMyWalletsQuery(undefined, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
    refetchOnMountOrArgChange: false,
  });

  const orders = useMemo(() => {
    if (!data?.orders) return [];
    return [...data.orders].sort(
      (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    );
  }, [data?.orders]);

  if (isLoading) return <div>Загрузка истории...</div>;
  if (isError) return <div>Не удалось загрузить историю</div>;

  return (
    <section className={s.history}>
      <div className={s.history__heading}>
        <h2>История</h2>
        <p>Последние покупки и статусы обработки.</p>
      </div>

      {orders.length ? (
        <div className={s.history__cards}>
          {orders.map((order) => (
            <HistoryCard
              key={order.id}
              id={order.id}
              img={order.product_image?.trim() || '/assets/img/product.jpg'}
              title={order.product_name}
              price={order.price_at_purchase}
              date={formatDate(order.created_at)}
              status={order.status}
            />
          ))}
        </div>
      ) : (
        <div className={s.history__empty}>Пока нет заказов.</div>
      )}
    </section>
  );
}
