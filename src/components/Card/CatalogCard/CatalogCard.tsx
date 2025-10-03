import React from 'react';
import classNames from 'classnames';

import type { Product } from '../../../types/ProductTypes';

import s from './CatalogCard.module.scss';


export default function CatalogCard({id, img, title, desc, price, amount} :Product) {
  return (
    <div id={id} className={s.card}>
      <div className={s.card__img}><img src={img} alt="" /></div>
      <div className={s.card__box}>
        <div className={s.card__info}>
          <h4 className={s.card__caption}>{title}</h4>
          <div className={s.card__desc}>{desc}</div>
          <div className={s.card__bottom}>
          <div className={s.card__price}>
            {price}
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="25" height="25" rx="12.5" fill="#020202"/>
              <path d="M12.0028 4.65879C12.3717 3.7804 13.6283 3.7804 13.9972 4.6588L15.8318 9.02705C15.9874 9.39736 16.339 9.65037 16.7427 9.68242L21.5048 10.0605C22.4624 10.1365 22.8506 11.32 22.1211 11.9389L18.4929 15.0167C18.1853 15.2776 18.051 15.687 18.145 16.0771L19.2534 20.679C19.4763 21.6044 18.4598 22.3358 17.6399 21.8399L13.563 19.3738C13.2173 19.1648 12.7827 19.1648 12.437 19.3738L8.36005 21.8399C7.54022 22.3358 6.52367 21.6044 6.74657 20.679L7.85505 16.0771C7.94901 15.687 7.81469 15.2776 7.50712 15.0167L3.87893 11.9389C3.14935 11.32 3.53764 10.1365 4.49522 10.0605L9.25729 9.68242C9.66098 9.65037 10.0126 9.39736 10.1682 9.02705L12.0028 4.65879Z" fill="#DD5500"/>
            </svg>
          </div>
        </div>
      </div>
      <div className={s.card__right}>
        <div className={s.card__amount}>
          {amount > 0 ? `Кол-во: ${amount}` : 'Нет в наличии'}
        </div>
        <button
          className={classNames(s.card__button, { [s.disabled]: !amount })}
          disabled={!amount}
        >
          <svg
            width="51"
            height="50"
            viewBox="0 0 51 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.5" width="50" height="50" rx="25" fill="#020202" />
            <path
              d="M19.8102 33.7931C21.5213 33.7931 22.9137 35.1855 22.9137 36.8966C22.9137 38.6076 21.5213 40 19.8102 40C18.0992 40 16.7068 38.6076 16.7068 36.8966C16.7068 35.1855 18.0992 33.7931 19.8102 33.7931Z"
              fill="#DD5500"
            />
            <path
              d="M32.2239 33.7931C33.9349 33.7931 35.3273 35.1855 35.3273 36.8966C35.3273 38.6076 33.9349 40 32.2239 40C30.5129 40 29.1205 38.6076 29.1205 36.8966C29.1205 35.1855 30.5129 33.7931 32.2239 33.7931Z"
              fill="#DD5500"
            />
            <path
              d="M14.8319 10C15.6075 10.0003 16.2625 10.5736 16.368 11.341L17.1774 17.2414H39.4652C40.1376 17.2414 40.632 17.8745 40.4686 18.5273L37.5615 30.1568C37.3308 31.0796 36.5053 31.7241 35.5536 31.7241H17.6276C16.5776 31.7241 15.694 30.9374 15.573 29.8946L13.4777 13.1034H12.0517C11.1941 13.1034 10.5 12.4093 10.5 11.5517C10.5 10.6941 11.1941 10 12.0517 10H14.8319Z"
              fill="#DD5500"
            />
          </svg>
        </button>
      </div>
      </div>
    </div>
  )
}
