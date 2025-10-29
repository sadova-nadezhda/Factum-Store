import React from 'react';

import Modal from './Modal';
import Title from '../Title';
import Button from '../Button';

import s from './Modal.module.scss';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ConfirmModal({ open, onClose }:Props) {

  if (!open) return null;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className={s.modal__container}>
        <img src="/assets/img/amir-2.png" className={s.modal__img} alt="" />
        <Title as="h2" className={s.modal__title}>
          Вы уверены?
        </Title>
        <div className={s.modal__buttons}>
          <Button
            className={s.modal__button}
          >
            Подтвердить
          </Button>
          <Button className={s.modal__button} onClick={onClose}>
            Отменить
          </Button>
        </div>
      </div>
    </Modal>
  )
}
