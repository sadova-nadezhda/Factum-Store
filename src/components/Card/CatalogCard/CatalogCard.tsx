import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import ProductModal from '../../Modal/ProductModal';
import OrderModal from '../../Modal/OrderModal';

import { useGetMeQuery } from '../../../features/auth/authAPI';
import { useModal } from '../../../hooks/useModal';
import type { Product } from '../../../types/ProductTypes';

import s from './CatalogCard.module.scss';

export default function CatalogCard({ id, image, name, price, description, stock }: Product) {
  const navigate = useNavigate();

  const { data: me, isLoading } = useGetMeQuery(undefined, { refetchOnMountOrArgChange: true });
  const isAuth = !!me && !isLoading;

  const productModal = useModal<Product>();
  const orderModal = useModal<Product>();

  const product: Product = { id, image, name, price, stock, description };

  const onCardClick = useCallback(() => {
    productModal.openModal(product);
  }, [productModal, product]);

  const onCartClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!stock) return;
    if (!isAuth) {
      navigate('/login');
      return;
    }
    orderModal.openModal(product);
  }, [stock, isAuth, orderModal, product, navigate]);

  const handleConfirmAdd = useCallback((qty: number) => {
    // тут твой dispatch/mutation
    console.log('ADD_TO_CART', { id, qty });
    // orderModal.closeModal(); // можно закрыть модалку после добавления
  }, [id /* , orderModal */]);

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
        <div className={s.card__img}><img src={image} alt={name} /></div>

        <div className={s.card__box}>
          <div className={s.card__info}>
            <h4 className={s.card__caption}>{name}</h4>
            <div className={s.card__price}>
              {price}
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="25" height="25" rx="12.5" fill="#020202"/>
                <path d="M11.5028 4.15879C11.8717 3.2804 13.1283 3.2804 13.4972 4.1588L15.3318 8.52705C15.4874 8.89736 15.839 9.15037 16.2427 9.18242L21.0048 9.56049C21.9624 9.63652 22.3506 10.82 21.6211 11.4389L17.9929 14.5167C17.6853 14.7776 17.551 15.187 17.645 15.5771L18.7534 20.179C18.9763 21.1044 17.9598 21.8358 17.1399 21.3399L13.063 18.8738C12.7173 18.6648 12.2827 18.6648 11.937 18.8738L7.86005 21.3399C7.04022 21.8358 6.02367 21.1044 6.24657 20.179L7.35505 15.5771C7.44901 15.187 7.31469 14.7776 7.00712 14.5167L3.37893 11.4389C2.64935 10.82 3.03764 9.63652 3.99522 9.56049L8.75729 9.18242C9.16098 9.15037 9.51264 8.89736 9.66817 8.52705L11.5028 4.15879Z" fill="#DD5500"/>
              </svg>
            </div>
          </div>

          <div className={s.card__right}>
            <button
              className={classNames(s.card__button, { [s.disabled]: !stock || !isAuth || isLoading })}
              disabled={!stock || !isAuth || isLoading}
              onClick={onCartClick}
              aria-label="Добавить в корзину"
            >
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="50" rx="25" fill="#020202"/>
                <path d="M19.3102 33.7931C21.0213 33.7931 22.4137 35.1855 22.4137 36.8966C22.4137 38.6076 21.0213 40 19.3102 40C17.5992 40 16.2068 38.6076 16.2068 36.8966C16.2068 35.1855 17.5992 33.7931 19.3102 33.7931Z" fill="#DD5500"/>
                <path d="M31.7239 33.7931C33.4349 33.7931 34.8273 35.1855 34.8273 36.8966C34.8273 38.6076 33.4349 40 31.7239 40C30.0129 40 28.6205 38.6076 28.6205 36.8966C28.6205 35.1855 30.0129 33.7931 31.7239 33.7931Z" fill="#DD5500"/>
                <path d="M14.3319 10C15.1075 10.0003 15.7625 10.5736 15.868 11.341L16.6774 17.2414H38.9652C39.6376 17.2414 40.132 17.8745 39.9686 18.5273L37.0615 30.1568C36.8308 31.0796 36.0053 31.7241 35.0536 31.7241H17.1276C16.0776 31.7241 15.194 30.9374 15.073 29.8946L12.9777 13.1034H11.5517C10.6941 13.1034 10 12.4093 10 11.5517C10 10.6941 10.6941 10 11.5517 10H14.3319Z" fill="#DD5500"/>
              </svg>
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
        // qty={(orderModal.payload as any)?.qty ?? 1}
        onConfirm={handleConfirmAdd}
      />
    </>
  );
}