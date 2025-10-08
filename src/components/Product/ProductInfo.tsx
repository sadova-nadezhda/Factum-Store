import React, { useState } from 'react';

import Button from '../Button';
import { CartIcon, StarIcon } from '../Icons';

import type { Product } from '../../types/ProductTypes';

import s from './ProductInfo.module.scss';

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
  showQty = true,
}: ProductInfoProps) {
  const { image, name, description, price, stock } = product;
  const [qty, setQty] = useState(1);

  const canProceed = Boolean(stock) && isAuth;

  const handleClick = () => {
    if (!canProceed) return;
    if (onOpenOrder) return onOpenOrder(qty);
    if (onAddToCart) return onAddToCart(qty);
  };

  const maxQty = stock || 1;

  return (
    <div className={s.product__container}>
      <div className={s.product__img}>
        <img src={image || 'assets/img/product.jpg'} alt={name || 'Товар'} />
      </div>

      <div className={s.product__info}>
        <div className={s.product__title}>{name || 'Товар'}</div>

        {description && <div className={s.product__desc}>{description}</div>}

        <div className={s.product__bottom}>
          <div className={s.product__amount}>
            Кол-во: {stock ?? 0}
          </div>

          <div className={s.product__price}>
            Сумма: {price}
            <StarIcon width={18} height={18} />
          </div>

          <Button
            type="button"
            className={s.product__button}
            disabled={!canProceed}
            onClick={handleClick}
            aria-disabled={!canProceed}
            title={!isAuth ? 'Войдите, чтобы добавить' : !stock ? 'Нет в наличии' : undefined}
          >
            <CartIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}