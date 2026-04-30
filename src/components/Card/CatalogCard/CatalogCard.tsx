import React, { memo, useCallback } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import ProductModal from '../../Modal/ProductModal';
import OrderModal from '../../Modal/OrderModal';
import { CartIcon, StarIcon } from '../../Icons';

import { useModal } from '../../../hooks/useModal';
import type { Product } from '../../../types/ProductTypes';

import s from './CatalogCard.module.scss';

type CardProps = Product & { isAuth: boolean };

function CatalogCardBase({ id, image, name, price, description, stock, category, isAuth }: CardProps) {
  const navigate = useNavigate();
  const productModal = useModal<Product>();
  const orderModal = useModal<Product>();

  const product: Product = {
    id,
    image,
    name,
    price,
    stock,
    description,
    ...(category !== undefined ? { category } : {}),
  };

  const cartLabel = !stock ? 'Нет в наличии' : !isAuth ? 'Войти, чтобы купить' : 'Купить';

  const onDetailsClick = useCallback(() => {
    productModal.openModal(product);
  }, [productModal, product]);

  const onCartClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();

      if (!stock) return;
      if (!isAuth) {
        navigate('/login');
        return;
      }

      orderModal.openModal(product);
    },
    [isAuth, navigate, orderModal, product, stock]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onDetailsClick();
      }
    },
    [onDetailsClick]
  );

  return (
    <>
      <article
        id={id}
        className={classNames(s.card, !stock && s.unavailable, stock > 0 && !isAuth && s.locked)}
      >
        <div
          className={s.card__panel}
          onClick={onDetailsClick}
          onKeyDown={onKeyDown}
          role="button"
          tabIndex={0}
          aria-label={`Подробнее: ${name}`}
        >
          <div className={s.card__header}>
            <h3 className={s.card__title}>{name}</h3>
            <div className={s.card__price}>
              <StarIcon />
              <span>{price}</span>
            </div>
          </div>

          <div className={s.card__media}>
            <img className={s.card__image} src={image} alt={name} />
          </div>
        </div>

        <div className={s.card__actions}>
          <button
            className={s.card__details}
            type="button"
            onClick={onDetailsClick}
            aria-label={`Подробнее: ${name}`}
          >
            Подробнее
          </button>

          <button
            className={s.card__cart}
            type="button"
            onClick={onCartClick}
            disabled={!stock}
            aria-label={`${cartLabel}: ${name}`}
            title={cartLabel}
          >
            <CartIcon />
          </button>
        </div>
      </article>

      <ProductModal
        open={productModal.isModalOpen}
        onClose={productModal.closeModal}
        product={productModal.payload ?? product}
        isAuth={isAuth}
        onOpenOrder={(qty) => {
          productModal.closeModal();
          orderModal.openModal({ ...product, qty } as any);
        }}
      />

      <OrderModal
        open={orderModal.isModalOpen}
        onClose={orderModal.closeModal}
        product={(orderModal.payload ?? product) as Product}
      />
    </>
  );
}

const CatalogCard = memo(CatalogCardBase);
export default CatalogCard;
