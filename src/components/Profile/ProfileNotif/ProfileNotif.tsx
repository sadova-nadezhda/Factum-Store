import React, { useMemo } from 'react';

import Title from '../../Title';
import { NotificationsCard } from '../../Card';

import { useGetMyWalletsQuery } from '@/features/wallets/walletsAPI';

import s from './ProfileNotif.module.scss';

type Notif =
  | { kind: 'order'; caption: string; desc?: string; amount: string; date: string }
  | { kind: 'transfer_in' | 'transfer_out'; sender: string; receiver: string; amount: string; date: string };

export default function ProfileNotif() {
  const { data, isLoading, isError } = useGetMyWalletsQuery();

  function formatDate(iso: string) {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  }

  const items: Notif[] = useMemo(() => {
    if (!data) return [];

    const orderNotifs: Notif[] = (data.orders || []).map(o => ({
      kind: 'order',
      caption: `Вы купили "${o.product_name}"`,
      desc: 'Поздравляем с покупкой!',
      amount: `-${o.price_at_purchase}`,
      date: o.created_at,
    }));

    const inNotifs: Notif[] = (data.transfers_in || []).map(t => ({
      kind: 'transfer_in',
      sender: t.from_user,
      receiver: 'Вы',
      amount: `+${t.amount}`,
      date: t.created_at,
    }));

    const outNotifs: Notif[] = (data.transfers_out || []).map(t => ({
      kind: 'transfer_out',
      sender: 'Вы',
      receiver: t.to_user,
      amount: `-${t.amount}`,
      date: t.created_at,
    }));

    return [...orderNotifs, ...inNotifs, ...outNotifs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [data]);

  if (isLoading) return <div>Загрузка уведомлений…</div>;
  if (isError) return <div>Не удалось загрузить уведомления</div>;
  if (!items.length) {
    return (
      <>
        <Title as="h4" className={s.notif__caption}>Уведомления</Title>
        <div className={s.notif__empty}>Пока нет уведомлений</div>
      </>
    );
  }

  return (
    <>
      <Title as="h4" className={s.notif__caption}>Уведомления</Title>
      <div className={s.notif__cards}>
        {items.map((n, i) =>
          n.kind === 'order' ? (
            <NotificationsCard
              key={`order-${i}`}
              caption={n.caption}
              desc={n.desc}
              amount={n.amount}
              date={formatDate(n.date)}
            />
          ) : (
            <NotificationsCard
              key={`${n.kind}-${i}`}
              sender={n.sender}
              receiver={n.receiver}
              amount={n.amount}
              date={formatDate(n.date)}
            />
          )
        )}
      </div>
    </>
  );
}