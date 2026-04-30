import React, { useMemo } from 'react';

import { NotificationsCard } from '../../Card';

import { useGetMyWalletsQuery } from '@/features/wallets/walletsAPI';

import s from './ProfileNotif.module.scss';

type Notif =
  | { kind: 'order'; caption: string; desc?: string; amount: string; date: string }
  | { kind: 'accrual'; caption: string; desc?: string; amount: string; date: string }
  | { kind: 'deduction'; caption: string; desc?: string; amount: string; date: string }
  | { kind: 'transfer_in' | 'transfer_out'; sender: string; receiver: string; amount: string; date: string };

export default function ProfileNotif() {
  const { data, isLoading, isError } = useGetMyWalletsQuery();

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
    });
  }

  function parseReasonText(value: unknown): { description?: string } {
    if (!value) return {};
    if (typeof value === 'object') return (value as { description?: string }) ?? {};
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    }
    return {};
  }

  const items: Notif[] = useMemo(() => {
    if (!data) return [];

    const orderNotifs: Notif[] = (data.orders || []).map((order: any) => ({
      kind: 'order',
      caption: `Покупка: ${order.product_name}`,
      desc: 'Поздравляем с новой покупкой в factum merch.',
      amount: `-${order.price_at_purchase}`,
      date: order.created_at,
    }));

    const accrualNotifs: Notif[] = (data.accruals || []).map((item: any) => {
      const parsed = parseReasonText(item.reason_text);
      return {
        kind: 'accrual',
        caption: 'Баланс пополнен',
        desc: parsed.description || 'На счет зачислены новые bonus coins.',
        amount: `+${item.amount}`,
        date: item.created_at,
      };
    });

    const deductionNotifs: Notif[] = ((data as any).deductions || []).map((item: any) => {
      const parsed = parseReasonText(item.reason_text);
      return {
        kind: 'deduction',
        caption: 'Списание с баланса',
        desc: parsed.description || item.reason || 'Со счета были списаны coins.',
        amount: `-${item.amount}`,
        date: item.created_at,
      };
    });

    const inNotifs: Notif[] = (data.transfers_in || []).map((item: any) => ({
      kind: 'transfer_in',
      sender: item.from_user,
      receiver: 'Вы',
      amount: `+${item.amount}`,
      date: item.created_at,
    }));

    const outNotifs: Notif[] = (data.transfers_out || []).map((item: any) => ({
      kind: 'transfer_out',
      sender: 'Вы',
      receiver: item.to_user,
      amount: `-${item.amount}`,
      date: item.created_at,
    }));

    return [...orderNotifs, ...accrualNotifs, ...deductionNotifs, ...inNotifs, ...outNotifs].sort(
      (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()
    );
  }, [data]);

  if (isLoading) return <div>Загрузка уведомлений...</div>;
  if (isError) return <div>Не удалось загрузить уведомления</div>;

  return (
    <section className={s.notif}>
      <div className={s.notif__heading}>
        <h2>Уведомления</h2>
        <p>Важные события по аккаунту, каталогу и заказам.</p>
      </div>

      {items.length ? (
        <div className={s.notif__cards}>
          {items.map((item, index) =>
            item.kind === 'order' || item.kind === 'accrual' || item.kind === 'deduction' ? (
              <NotificationsCard
                key={`${item.kind}-${index}`}
                caption={item.caption}
                desc={item.desc}
                amount={item.amount}
                date={formatDate(item.date)}
              />
            ) : (
              <NotificationsCard
                key={`${item.kind}-${index}`}
                sender={item.sender}
                receiver={item.receiver}
                amount={item.amount}
                date={formatDate(item.date)}
              />
            )
          )}
        </div>
      ) : (
        <div className={s.notif__empty}>Пока нет уведомлений.</div>
      )}
    </section>
  );
}
