import React, { useMemo } from 'react';

import { CoinsCard } from '../../Card';
import TransferForm from '../../Form/TransferForm';

import { useGetMyWalletsQuery } from '@/features/wallets/walletsAPI';

import s from './ProfileCoins.module.scss';

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
  });
}

function parseReasonText(raw: string): string {
  try {
    const parsed = JSON.parse(raw);
    if (parsed.description && typeof parsed.description === 'string' && parsed.description.trim()) {
      return parsed.description.trim();
    }
  } catch {
    // not JSON
  }
  return '';
}

export default function ProfileCoins() {
  const { data, isLoading, isError } = useGetMyWalletsQuery();

  const stats = useMemo(() => {
    if (!data) return null;

    const mainWallet = data.wallets.find((wallet) => wallet.type === 'main');
    const extraWallet = data.wallets.find((wallet) => wallet.type !== 'main');
    const now = new Date();

    const monthlyAccrual = data.accruals
      .filter((item) => {
        const created = new Date(item.created_at);
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      })
      .reduce((sum, item) => sum + item.amount, 0);

    const monthlyDeduction = data.deductions
      .filter((item) => {
        const created = new Date(item.created_at);
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      })
      .reduce((sum, item) => sum + item.amount, 0);

    const monthlyNet = monthlyAccrual - monthlyDeduction;

    const activeOrders = data.orders.filter((order) => order.status === 'pending').length;

    return {
      mainBalance: mainWallet?.balance ?? 0,
      extraBalance: extraWallet?.balance ?? 0,
      extraCaption: extraWallet?.type === 'manager_pool' ? 'Резерв руководителя' : 'Резервный кошелек',
      monthlyNet,
      activeOrders,
    };
  }, [data]);

  const activityItems = useMemo(() => {
    if (!data) return [];

    const accruals = data.accruals.map((item) => ({
      id: `accrual-${item.created_at}-${item.amount}`,
      title: 'Начисление бонусов',
      description: item.reason_text || item.reason || 'Пополнение бонусного баланса',
      amount: `+${item.amount}`,
      date: item.created_at,
    }));

    const incomingTransfers = data.transfers_in.map((item) => ({
      id: `transfer-in-${item.created_at}-${item.amount}`,
      title: 'Перевод от коллеги',
      description: `От ${item.from_user}`,
      amount: `+${item.amount}`,
      date: item.created_at,
    }));

    const outgoingTransfers = data.transfers_out.map((item) => ({
      id: `transfer-out-${item.created_at}-${item.amount}`,
      title: 'Исходящий перевод',
      description: `Для ${item.to_user}`,
      amount: `-${item.amount}`,
      date: item.created_at,
    }));

    return [...accruals, ...incomingTransfers, ...outgoingTransfers]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
  }, [data]);

  if (isLoading) return <div>Загрузка баланса...</div>;
  if (isError || !data || !stats) return <div>Не удалось получить кошельки</div>;

  const walletsForTransfer = data.wallets.filter(
    (wallet) => wallet.type === 'main' || wallet.type === 'manager_pool'
  );
  const canTransfer = walletsForTransfer.length > 1;

  return (
    <div className={s.coins}>
      <section className={s.coins__panel}>
        <div className={s.coins__heading}>
          <h2>Мои коины</h2>
          <p>Текущий баланс и сводка по бонусной активности.</p>
        </div>

        <div className={s.coins__stats}>
          <CoinsCard caption="Основной баланс" balance={`${stats.mainBalance} coins`} note="Доступно сейчас" />
          <CoinsCard caption="За текущий месяц" balance={`${stats.monthlyNet >= 0 ? '+' : ''}${stats.monthlyNet} coins`} note="Начислено" />
          <CoinsCard caption="Активных заказов" balance={`${stats.activeOrders}`} note={stats.extraBalance ? `${stats.extraCaption}: ${stats.extraBalance}` : 'Статус покупок'} />
        </div>

        {/* {!!activityItems.length && (
          <div className={s.coins__activity}>
            {activityItems.map((item) => (
              <article key={item.id} className={s.coins__activityItem}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div className={s.coins__activityMeta}>
                  <strong>{item.amount}</strong>
                  <span>{formatDate(item.date)}</span>
                </div>
              </article>
            ))}
          </div>
        )} */}
      </section>

      {canTransfer && (
        <section className={s.coins__transfer}>
          <div className={s.coins__heading}>
            <h2>Перевод coins</h2>
            <p>Быстрая отправка между доступными кошельками.</p>
          </div>
          <TransferForm wallets={walletsForTransfer} />
        </section>
      )}
    </div>
  );
}
