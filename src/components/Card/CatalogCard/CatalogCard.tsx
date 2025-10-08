import React, { useCallback, memo } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import ProductModal from '../../Modal/ProductModal';
import OrderModal from '../../Modal/OrderModal';
import { CartIcon, StarIcon } from '../../Icons';

import { useModal } from '../../../hooks/useModal';
import type { Product } from '../../../types/ProductTypes';

import s from './CatalogCard.module.scss';

type CardProps = Product & { isAuth: boolean };

function CatalogCardBase({ id, image, name, price, description, stock, isAuth }: CardProps) {
  const navigate = useNavigate();

  const productModal = useModal<Product>();
  const orderModal = useModal<Product>();

  const product: Product = { id, image, name, price, stock, description };

  const onCardClick = useCallback(() => {
    productModal.openModal(product);
  }, [productModal, product]);

  const onCartClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (!stock) return;
      if (!isAuth) {
        navigate('/login');
        return;
      }
      orderModal.openModal(product);
    },
    [stock, isAuth, orderModal, product, navigate]
  );

  return (
    <>
      <div
        id={id}
        className={s.card}
        onClick={onCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? onCardClick() : null)}
      >
        <div className={s.card__img}>
          <img src={image} alt={name} />
        </div>

        <div className={s.card__box}>
          <div className={s.card__info}>
            <h4 className={s.card__caption}>{name}</h4>
            <div className={s.card__price}>
              {price}
              <StarIcon />
            </div>
          </div>

          <div className={s.card__right}>
            <button
              className={classNames(s.card__button, {
                [s.disabled]: !stock || !isAuth,
              })}
              disabled={!stock || !isAuth}
              onClick={onCartClick}
              aria-label="Добавить в корзину"
            >
              <CartIcon />
            </button>
          </div>
        </div>
      </div>

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