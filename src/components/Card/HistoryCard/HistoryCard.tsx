import React from 'react';
import classNames from 'classnames';

import Button from '@/components/Button';
import { StarIcon } from '../../Icons';

import s from './HistoryCard.module.scss';

interface HistoryCardProps {
  id: number,
  img: string,
  title: string,
  price: number,
  date: string,
  status: string
}

export default function HistoryCard({img, id, title, price, date, status} :HistoryCardProps) {
  return (
    <div className={s.card}>
      <div className={s.card__img}><img src={img} alt="" /></div>
      <div className={s.card__box}>
        <div className={s.card__top}>
          <div className={s.card__date}>{date}</div>
          {/* <div className={classNames(s.card__status, 'ready')}>выполнен</div> */}
          <div className={classNames(s.card__status)}>в обработке</div>
        </div>
        <div className={s.card__info}>
          <div className={s.card__num}>Заказ №{id}</div>
          <div className={s.card__title}>{title}</div>
          <div className={s.card__price}>
            Сумма: {price}
            <StarIcon />
          </div>
        </div>
      </div>
      <Button
          className={classNames(s.card__button, 'button button-orange')}
        >
          Отменить заказ
        </Button>
    </div>
  )
}
