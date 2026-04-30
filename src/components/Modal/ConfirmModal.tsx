import React from 'react';
import classNames from 'classnames';

import Modal from './Modal';
import Button from '../Button';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

import s from './Modal.module.scss';

export default function ConfirmModal({ open, onClose, onConfirm, isLoading }: Props) {
  if (!open) return null;

  const imageSrc = '/assets/img/amir-2.png';

  return (
    <Modal isOpen={open} onClose={onClose} size="compact" title="Вы уверены?">
      <div className={s.confirm__section}>
        <div className={s.confirm__visual}>
          <img src={imageSrc} className={s.confirm__img} alt="" />
        </div>
        <div className={s.confirm__text}>Вы действительно хотите выйти из аккаунта?</div>
      </div>
      <div className={s.confirm__actions}>
        <Button className={classNames(s.confirm__button, s.confirm__buttonPrimary)} onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Отменяем…' : 'Подтвердить'}
        </Button>
        <Button className={classNames(s.confirm__button, s.confirm__buttonSecondary)} onClick={onClose} disabled={isLoading}>
          Отменить
        </Button>
      </div>
    </Modal>
  );
}
