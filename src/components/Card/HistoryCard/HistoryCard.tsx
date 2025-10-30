import React, { useCallback } from 'react';
import classNames from 'classnames';

import Button from '@/components/Button';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import { StarIcon } from '../../Icons';

import { useModal } from '@/hooks/useModal';

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
  const confirmModal = useModal();

  const onCancelClick = useCallback(() => {
    confirmModal.openModal();
  }, [confirmModal]);

  const badge =
    status === 'fulfilled'
      ? 'success'
      : status === 'pending'
      ? 'secondary'
      : status === 'returned'
      ? 'warning'
      : status === 'cancelled'
      ? 'danger'
      : 'dark';

  const statusText: Record<string, string> = {
    fulfilled: 'выполнен',
    pending: 'в обработке',
    returned: 'возвращен',
    cancelled: 'отменен',
    default: 'неизвестен',
  };

  return (
    <>
      <div className={s.card}>
        <div className={s.card__img}><img src={img} alt="" /></div>
        <div className={s.card__box}>
          <div className={s.card__top}>
            <div className={s.card__date}>{date}</div>
            <div className={classNames(s.card__status, badge)}>
              {statusText[status] || statusText.default}
            </div>
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
        {status === 'pending' && (
          <Button
            className={classNames(s.card__button, 'button button-orange')}
            onClick={onCancelClick}
          >
            Отменить заказ
          </Button>
        )}
      </div>

      <ConfirmModal
        open={confirmModal.isModalOpen}
        onClose={confirmModal.closeModal}
      />
    </>
  )
}
