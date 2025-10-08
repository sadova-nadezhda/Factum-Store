import React, { useMemo } from 'react';
import classNames from 'classnames';

import Title from '../Title';
import Button from '../Button';
import { StarIcon } from '../Icons';

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
            <StarIcon />
          </div>

          <div className={classNames(s.basket__balance, s.basket__num)}>
            <span>Баланс:</span>
            {isLoading ? '—' : fmt(balance)}
            <StarIcon />
          </div>
        </div>
      </div>
    </div>
  );
}