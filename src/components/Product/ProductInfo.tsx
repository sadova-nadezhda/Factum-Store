import React, { useState } from 'react';
import s from './ProductInfo.module.scss';
import Button from '../Button';
import type { Product } from '../../types/ProductTypes';

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
    if (onOpenOrder) return onOpenOrder(qty);  // ⬅️ открываем корзину
    if (onAddToCart) return onAddToCart(qty);  // fallback
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
            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" width="18" height="18" rx="9" fill="#020202"/>
              <path d="M8.78456 2.97161C9.04918 2.33677 9.95048 2.33677 10.2151 2.97161L11.5311 6.12867C11.6426 6.3963 11.8949 6.57916 12.1845 6.60233L15.6003 6.87557C16.2871 6.93051 16.5656 7.78582 16.0423 8.23311L13.4398 10.4575C13.2192 10.6461 13.1229 10.942 13.1903 11.2239L13.9854 14.5498C14.1453 15.2186 13.4161 15.7473 12.828 15.3889L9.90363 13.6066C9.65573 13.4555 9.34394 13.4555 9.09603 13.6066L6.17163 15.3889C5.58357 15.7473 4.85441 15.2186 5.01429 14.5498L5.80939 11.2239C5.87679 10.942 5.78045 10.6461 5.55983 10.4575L2.95735 8.23311C2.43403 7.78582 2.71254 6.93051 3.39941 6.87557L6.81521 6.60233C7.10478 6.57916 7.35702 6.3963 7.46858 6.12867L8.78456 2.97161Z" fill="#DD5500"/>
            </svg>
          </div>

          <Button
            type="button"
            className={s.product__button}
            disabled={!canProceed}
            onClick={handleClick}
            aria-disabled={!canProceed}
            title={!isAuth ? 'Войдите, чтобы добавить' : !stock ? 'Нет в наличии' : undefined}
          >
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="50" height="50" rx="25" fill="#020202"/>
              <path d="M19.3102 33.7931C21.0213 33.7931 22.4137 35.1855 22.4137 36.8966C22.4137 38.6076 21.0213 40 19.3102 40C17.5992 40 16.2068 38.6076 16.2068 36.8966C16.2068 35.1855 17.5992 33.7931 19.3102 33.7931Z" fill="#DD5500"/>
              <path d="M31.7239 33.7931C33.4349 33.7931 34.8273 35.1855 34.8273 36.8966C34.8273 38.6076 33.4349 40 31.7239 40C30.0129 40 28.6205 38.6076 28.6205 36.8966C28.6205 35.1855 30.0129 33.7931 31.7239 33.7931Z" fill="#DD5500"/>
              <path d="M14.3319 10C15.1075 10.0003 15.7625 10.5736 15.868 11.341L16.6774 17.2414H38.9652C39.6376 17.2414 40.132 17.8745 39.9686 18.5273L37.0615 30.1568C36.8308 31.0796 36.0053 31.7241 35.0536 31.7241H17.1276C16.0776 31.7241 15.194 30.9374 15.073 29.8946L12.9777 13.1034H11.5517C10.6941 13.1034 10 12.4093 10 11.5517C10 10.6941 10.6941 10 11.5517 10H14.3319Z" fill="#DD5500"/>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}