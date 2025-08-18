import React from 'react';

import Title from '../../Title';

import s from './CoinsCard.module.scss';

export default function CoinsCard( {caption, balance}) {
  return (
    <div className={s.card}>
      <Title component='h4' className={s.card__caption}>{ caption }</Title>
      <div className={s.card__balance}>
        Баланс: {balance}
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="25" height="25" rx="12.5" fill="#020202"/>
          <path d="M11.5028 4.15879C11.8717 3.2804 13.1283 3.2804 13.4972 4.1588L15.3318 8.52705C15.4874 8.89736 15.839 9.15037 16.2427 9.18242L21.0048 9.56049C21.9624 9.63652 22.3506 10.82 21.6211 11.4389L17.9929 14.5167C17.6853 14.7776 17.551 15.187 17.645 15.5771L18.7534 20.179C18.9763 21.1044 17.9598 21.8358 17.1399 21.3399L13.063 18.8738C12.7173 18.6648 12.2827 18.6648 11.937 18.8738L7.86005 21.3399C7.04022 21.8358 6.02367 21.1044 6.24657 20.179L7.35505 15.5771C7.44901 15.187 7.31469 14.7776 7.00712 14.5167L3.37893 11.4389C2.64935 10.82 3.03764 9.63652 3.99522 9.56049L8.75729 9.18242C9.16098 9.15037 9.51264 8.89736 9.66817 8.52705L11.5028 4.15879Z" fill="#DD5500"/>
        </svg>
      </div>
    </div>
  )
}
