import React, { useMemo } from 'react';
import classNames from 'classnames';

import Title from '../Title';
import Button from '../Button';
import { useGetMyWalletsQuery } from '../../features/auth/authAPI';

import s from './Basket.module.scss';

type BasketProps = {
  sum: number;
  onConfirm: () => void;
  onCancel: () => void;
  confirming?: boolean;
};

export default function Basket({
  sum,
  onConfirm,
  onCancel,
  confirming = false,
}: BasketProps) {
  const { data, isLoading } = useGetMyWalletsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const balance = useMemo(() => {
    const main = data?.wallets?.find?.(w => w.type === 'main' && w.spendable);
    if (main) return Number(main.balance) || 0;

    const spendableTotal =
      data?.wallets
        ?.filter?.(w => w.spendable)
        .reduce((a, w) => a + (Number(w.balance) || 0), 0) ?? 0;

    return spendableTotal;
  }, [data]);

  const enough = balance >= sum;

  const fmt = (n: number) => new Intl.NumberFormat('ru-RU').format(n);

  return (
    <div className={s.basket}>
      <div className={s.basket__container}>
        

        {enough ? (
          <>
            <img src="/assets/img/amir-1.png" className={s.basket__img} alt="" />
            <Title component="h2" className={s.basket__title}>
              Подтвердить покупку?
            </Title>

            <div className={s.basket__buttons}>
              <Button
                className={s.basket__button}
                onClick={onConfirm}
                disabled={isLoading || confirming || !enough}
                title={!enough ? 'Недостаточно средств' : undefined}
              >
                {confirming ? 'Подтверждаем…' : 'Подтвердить'}
              </Button>
              <Button className={s.basket__button} onClick={onCancel} disabled={confirming}>
                Отменить
              </Button>
            </div>
          </>
        ) : (
          <>
            <img src="/assets/img/amir-2.png" className={s.basket__img} alt="" />
            <Title component="h2" className={s.basket__title}>
              Недостаточно средств для покупки.
            </Title>
          </>
        )}

        <div className={s.basket__bottom}>
          <div className={classNames(s.basket__price, s.basket__num)}>
            <span>Сумма:</span>
            {isLoading ? '—' : fmt(sum)}
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="25" height="25" rx="12.5" fill="#020202"/>
              <path d="M12.0028 4.65879C12.3717 3.7804 13.6283 3.7804 13.9972 4.6588L15.8318 9.02705C15.9874 9.39736 16.339 9.65037 16.7427 9.68242L21.5048 10.0605C22.4624 10.1365 22.8506 11.32 22.1211 11.9389L18.4929 15.0167C18.1853 15.2776 18.051 15.687 18.145 16.0771L19.2534 20.679C19.4763 21.6044 18.4598 22.3358 17.6399 21.8399L13.563 19.3738C13.2173 19.1648 12.7827 19.1648 12.437 19.3738L8.36005 21.8399C7.54022 22.3358 6.52367 21.6044 6.74657 20.679L7.85505 16.0771C7.94901 15.687 7.81469 15.2776 7.50712 15.0167L3.87893 11.9389C3.14935 11.32 3.53764 10.1365 4.49522 10.0605L9.25729 9.68242C9.66098 9.65037 10.0126 9.39736 10.1682 9.02705L12.0028 4.65879Z" fill="#DD5500"/>
            </svg>
          </div>

          <div className={classNames(s.basket__balance, s.basket__num)}>
            <span>Баланс:</span>
            {isLoading ? '—' : fmt(balance)}
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="25" height="25" rx="12.5" fill="#020202"/>
              <path d="M12.0028 4.65879C12.3717 3.7804 13.6283 3.7804 13.9972 4.6588L15.8318 9.02705C15.9874 9.39736 16.339 9.65037 16.7427 9.68242L21.5048 10.0605C22.4624 10.1365 22.8506 11.32 22.1211 11.9389L18.4929 15.0167C18.1853 15.2776 18.051 15.687 18.145 16.0771L19.2534 20.679C19.4763 21.6044 18.4598 22.3358 17.6399 21.8399L13.563 19.3738C13.2173 19.1648 12.7827 19.1648 12.437 19.3738L8.36005 21.8399C7.54022 22.3358 6.52367 21.6044 6.74657 20.679L7.85505 16.0771C7.94901 15.687 7.81469 15.2776 7.50712 15.0167L3.87893 11.9389C3.14935 11.32 3.53764 10.1365 4.49522 10.0605L9.25729 9.68242C9.66098 9.65037 10.0126 9.39736 10.1682 9.02705L12.0028 4.65879Z" fill="#DD5500"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}