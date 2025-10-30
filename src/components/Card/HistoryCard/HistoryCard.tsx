import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { toast } from 'react-toastify';

import Button from '@/components/Button';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import { StarIcon } from '../../Icons';
import { useModal } from '@/hooks/useModal';
import { useCancelOrderMutation } from '@/features/orders/ordersAPI';

import s from './HistoryCard.module.scss';

interface HistoryCardProps {
  id: number;
  img: string;
  title: string;
  price: number;
  date: string;
  status: string;
}

export default function HistoryCard({ img, id, title, price, date, status }: HistoryCardProps) {
  const confirmModal = useModal();
  const [cancelOrder, { isLoading }] = useCancelOrderMutation();
  const [localStatus, setLocalStatus] = useState(status);

  const onCancelClick = useCallback(() => {
    confirmModal.openModal();
  }, [confirmModal]);

  const onConfirmCancel = useCallback(async () => {
    try {
      await cancelOrder({ id }).unwrap();
      setLocalStatus('cancelled');
      confirmModal.closeModal();
      toast.success('Заказ отправлен на возврат');
    } catch (e: any) {
      const errMsg =
        e?.data?.error ||
        e?.error ||
        'Не удалось отменить заказ. Попробуйте ещё раз.';
      toast.error(errMsg);
      console.error(e);
    }
  }, [cancelOrder, id, confirmModal]);

  const badge =
    localStatus === 'fulfilled'
      ? 'success'
      : localStatus === 'pending'
      ? 'secondary'
      : localStatus === 'returned'
      ? 'warning'
      : localStatus === 'cancelled'
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
        <div className={s.card__img}>
          <img src={img} alt="" />
        </div>
        <div className={s.card__box}>
          <div className={s.card__top}>
            <div className={s.card__date}>{date}</div>
            <div className={classNames(s.card__status, badge)}>
              {statusText[localStatus] || statusText.default}
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

        {localStatus === 'pending' && (
          <Button
            className={classNames(s.card__button, 'button button-orange')}
            onClick={onCancelClick}
            disabled={isLoading}
          >
            {isLoading ? 'Отменяем…' : 'Отменить заказ'}
          </Button>
        )}
      </div>

      <ConfirmModal
        open={confirmModal.isModalOpen}
        onClose={confirmModal.closeModal}
        onConfirm={onConfirmCancel}
        isLoading={isLoading}
      />
    </>
  );
}