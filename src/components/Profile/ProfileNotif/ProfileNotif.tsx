import React, { useMemo } from 'react';

import Title from '../../Title';
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
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  }

  // безопасно парсим reason_text (строка или объект)
  function parseReasonText(rt: any): { type?: string; description?: string; from_manager_id?: number | string } {
    if (!rt) return {};
    if (typeof rt === 'object') return rt ?? {};
    if (typeof rt === 'string') {
      try {
        return JSON.parse(rt);
      } catch {
        return {};
      }
    }
    return {};
  }

  const items: Notif[] = useMemo(() => {
    if (!data) return [];

    const orderNotifs: Notif[] = (data.orders || []).map((o: any) => ({
      kind: 'order',
      caption: `Вы купили "${o.product_name}"`,
      desc: 'Поздравляем с покупкой!',
      amount: `-${o.price_at_purchase}`,
      date: o.created_at,
    }));

    const accrualNotifs: Notif[] = (data.accruals || []).map((a: any) => {
      const r = parseReasonText(a.reason_text);
      return {
        kind: 'accrual',
        caption: 'Вы получили вознаграждение!',
        desc: r.description || 'Пополнение баланса',
        amount: `+${a.amount}`,
        date: a.created_at,
      };
    });

    const deductionNotifs: Notif[] = ((data as any).deductions || []).map((d: any) => {
      const r = parseReasonText(d.reason_text);
      return {
        kind: 'deduction',
        caption: 'Руководитель забрал немного коинов…',
        desc: r.description || d.reason || 'Списание со счёта',
        amount: `-${d.amount}`,
        date: d.created_at,
      };
    });

    const inNotifs: Notif[] = (data.transfers_in || []).map((t: any) => ({
      kind: 'transfer_in',
      sender: t.from_user,
      receiver: 'Вы',
      amount: `+${t.amount}`,
      date: t.created_at,
    }));

    const outNotifs: Notif[] = (data.transfers_out || []).map((t: any) => ({
      kind: 'transfer_out',
      sender: 'Вы',
      receiver: t.to_user,
      amount: `-${t.amount}`,
      date: t.created_at,
    }));

    return [...orderNotifs, ...accrualNotifs, ...deductionNotifs, ...inNotifs, ...outNotifs].sort(
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
          n.kind === 'order' || n.kind === 'accrual' || n.kind === 'deduction' ? (
            <NotificationsCard
              key={`${n.kind}-${i}`}
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