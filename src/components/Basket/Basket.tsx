import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import Button from '../Button';

import type { Product } from '../../types/ProductTypes';
import { useGetMyWalletsQuery } from '@/features/wallets/walletsAPI';

import s from './Basket.module.scss';

type BasketProps = {
  product: Product;
  sum: number;
  onConfirm: () => void;
  onCancel: () => void;
  confirming?: boolean;
  ordered?: boolean;
  onGoHistory?: () => void;
  errorText?: string | null;
};

const fmt = (n: number) => new Intl.NumberFormat('ru-RU').format(n);

const formatPoints = (n: number) => {
  const normalized = Math.abs(Math.floor(n));
  const lastTwo = normalized % 100;
  const lastOne = normalized % 10;

  let label = 'баллов';
  if (lastTwo < 11 || lastTwo > 14) {
    if (lastOne === 1) label = 'балл';
    if (lastOne >= 2 && lastOne <= 4) label = 'балла';
  }

  return `${fmt(n)} ${label}`;
};

export default function Basket({
  product,
  sum,
  onConfirm,
  onCancel,
  confirming = false,
  ordered = false,
  onGoHistory,
  errorText = null,
}: BasketProps) {
  const navigate = useNavigate();

  const { wallets, isLoading } = useGetMyWalletsQuery(undefined, {
    selectFromResult: ({ data, isLoading }) => ({
      isLoading,
      wallets: data?.wallets ?? [],
    }),
  });

  const balance = useMemo(() => {
    if (!wallets.length) return 0;

    const main = wallets.find((wallet) => wallet.type === 'main' && wallet.spendable);
    if (main) return Number(main.balance) || 0;

    return wallets
      .filter((wallet) => wallet.spendable)
      .reduce((acc, wallet) => acc + (Number(wallet.balance) || 0), 0);
  }, [wallets]);

  const enough = balance >= sum;
  const status = ordered ? 'success' : isLoading ? 'loading' : enough ? 'confirm' : 'warning';
  const imageSrc = status === 'warning' ? '/assets/img/amir-2.png' : '/assets/img/amir-1.png';

  const handleGoHistory = () => {
    if (onGoHistory) return onGoHistory();
    navigate('/profile/history');
  };

  return (
    <div className={s.basket}>
      <div className={s.basket__section}>
        <div className={classNames(s.basket__visual, status === 'warning' && s.isWarning)}>
          <img src={imageSrc} className={s.basket__img} alt="" />
        </div>

        <p className={s.basket__text}>
          {status === 'success' && (
            <>
              Заказ на <strong>{product.name}</strong> оформлен за <strong>{formatPoints(sum)}</strong>.
            </>
          )}
          {status === 'loading' && (
            <>
              Проверяем баланс для покупки <strong>{product.name}</strong> за{' '}
              <strong>{formatPoints(sum)}</strong>.
            </>
          )}
          {status === 'confirm' && (
            <>
              Вы собираетесь купить: <strong>{product.name}</strong> за <strong>{formatPoints(sum)}</strong>.
            </>
          )}
          {status === 'warning' && (
            <>
              Для покупки <strong>{product.name}</strong> нужно <strong>{formatPoints(sum)}</strong>, а на
              балансе сейчас <strong>{formatPoints(balance)}</strong>.
            </>
          )}
        </p>
      </div>

      <div className={s.basket__section}>
        <p className={s.basket__note}>
          {status === 'success' && 'Товар уже закреплён за вами. Историю заказов можно открыть прямо сейчас.'}
          {status === 'loading' && 'Сейчас мы проверяем доступный баланс, после этого заказ можно будет подтвердить.'}
          {status === 'confirm' && 'После подтверждения баллы будут списаны, а товар закрепится за вами.'}
          {status === 'warning' && 'Недостаточно доступных баллов для этой покупки. Попробуйте выбрать другой товар.'}
        </p>
      </div>

      {!!errorText && !ordered && (
        <div className={s.basket__section}>
          <p className={s.basket__error}>{errorText}</p>
        </div>
      )}

      <div className={s.basket__actions}>
        {ordered ? (
          <>
            <Button
              className={classNames(s.basket__button, s.basket__buttonPrimary)}
              onClick={handleGoHistory}
            >
              Перейти в историю
            </Button>
            <Button className={classNames(s.basket__button, s.basket__buttonSecondary)} onClick={onCancel}>
              Закрыть
            </Button>
          </>
        ) : status === 'warning' ? (
          <Button
            className={classNames(s.basket__button, s.basket__buttonSecondary)}
            onClick={onCancel}
            disabled={confirming}
          >
            Отмена
          </Button>
        ) : (
          <>
            <Button
              className={classNames(s.basket__button, s.basket__buttonPrimary)}
              onClick={onConfirm}
              disabled={confirming || isLoading}
            >
              {confirming ? 'Подтверждаем...' : 'Подтвердить'}
            </Button>
            <Button
              className={classNames(s.basket__button, s.basket__buttonSecondary)}
              onClick={onCancel}
              disabled={confirming}
            >
              Отмена
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
