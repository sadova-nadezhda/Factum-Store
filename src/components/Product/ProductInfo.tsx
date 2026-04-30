import React, { useMemo } from 'react';
import Button from '../Button';

import type { Product } from '../../types/ProductTypes';
import { useGetMyWalletsQuery } from '@/features/wallets/walletsAPI';

import s from './ProductInfo.module.scss';
import { StarIcon } from '../Icons';

type ProductInfoProps = {
  product: Product;
  isAuth?: boolean;
  onAddToCart?: (qty: number) => void;
  onOpenOrder?: (qty: number) => void;
  showQty?: boolean;
};

export default function ProductInfo({
  product,
  isAuth = false,
  onAddToCart,
  onOpenOrder,
}: ProductInfoProps) {
  const { image, name, description, price, stock, category } = product;
  const available = Number(stock) > 0;
  const canProceed = isAuth && available;

  const { wallets, isLoading: balanceLoading } = useGetMyWalletsQuery(undefined, {
    skip: !isAuth,
    selectFromResult: ({ data, isLoading }) => ({
      wallets: data?.wallets ?? [],
      isLoading,
    }),
  });

  const balance = useMemo(() => {
    if (!wallets.length) return 0;

    const main = wallets.find((wallet) => wallet.type === 'main');
    if (main) return Number(main.balance) || 0;

    return wallets.reduce((acc, wallet) => acc + (Number(wallet.balance) || 0), 0);
  }, [wallets]);

  const details = [
    category ? `Категория: ${category}` : null,
    isAuth ? 'Покупка спишет factum coins с основного баланса' : 'Для покупки нужен вход в аккаунт',
  ].filter(Boolean) as string[];

  const formatNumber = (value: number) => new Intl.NumberFormat('ru-RU').format(Math.floor(value));

  const handleClick = () => {
    if (!canProceed) return;
    if (onOpenOrder) {
      onOpenOrder(1);
      return;
    }
    onAddToCart?.(1);
  };

  return (
    <div className={s.product}>
      <div className={s.product__media}>
        <div className={s.product__stock}>
          <span>Осталось: {stock}</span>
        </div>
        <img className={s.product__image} src={image || '/assets/img/product.jpg'} alt={name || 'Товар'} />
      </div>

      <div className={s.product__content}>
        <div className={s.product__section}>
          <div className={s.product__titleWrap}>
            <h2>{name || 'Товар'}</h2>
          </div>
        </div>

        <div className={s.product__section}>
          <p className={s.product__eyebrow}>Описание</p>
          <p className={s.product__description}>{description || 'Описание скоро появится.'}</p>
        </div>

        <div className={s.product__section}>
          <p className={s.product__eyebrow}>Детали</p>
          <ul className={s.product__details}>
            {details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>

        <div className={s.product__footer}>
          <div className={s.product__meta}>
            <div className={s.product__metaItem}>
              <StarIcon />
              <span>Ваш баланс: {!isAuth ? '—' : balanceLoading ? '…' : formatNumber(balance)}</span>
            </div>
            <div className={s.product__metaItem}>
              <StarIcon />
              <span>Цена: {price}</span>
            </div>
          </div>
          <Button
            type="button"
            className={`${s.product__cta} ${!canProceed ? s.product__ctaDisabled : ''}`}
            disabled={!canProceed}
            onClick={handleClick}
            title={!isAuth ? 'Войдите, чтобы купить' : !available ? 'Нет в наличии' : undefined}
          >
            {!isAuth ? 'Войдите для покупки' : available ? 'Купить' : 'Нет в наличии'}
          </Button>
        </div>
      </div>
    </div>
  );
}
