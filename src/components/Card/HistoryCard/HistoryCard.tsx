import React, { useCallback, useState } from 'react';

import { toast } from 'react-toastify';
import classNames from 'classnames';
import { useModal } from '@/hooks/useModal';
import { StarIcon } from '@/components/Icons';
import Button from '@/components/Button';
import CanselModal from '@/components/Modal/CanselModal';
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
        'Не удалось отменить заказ. Попробуйте ещё раз';
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
    fulfilled: 'Заказ выполнен и готов к выдаче',
    pending: 'Заказ оформлен и находится в обработке',
    returned: 'Заказ возвращен',
    cancelled: 'Заказ был отменен',
  };

  return (
    <article className={s.card}>
      <div className={s.card__thumb}>
        <img src={img} alt={title} />
      </div>

      <div className={s.card__body}>
        <h3>{title}</h3>
        <p>{statusText[status] || 'Статус заказа обновляется.'}</p>
        <span>Заказ #{id} · {date}</span>
      </div>

      <div className={s.card__price}>
        <StarIcon />
        <span>{price}</span>
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

        <CanselModal
          open={confirmModal.isModalOpen}
          onClose={confirmModal.closeModal}
          onConfirm={onConfirmCancel}
          isLoading={isLoading}
        />
    </article>
  );
}
