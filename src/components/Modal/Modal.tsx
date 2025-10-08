import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import ModalOverlay from '../ModalOverlay';
import { CloseIcon } from '../Icons';

import s from './Modal.module.scss';

interface ModalProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  isOpen: boolean;
}

export default function Modal({ onClose, children, isOpen }: ModalProps) {
  // контейнер под модалки
  let modalRoot = document.getElementById('modals');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.id = 'modals';
    document.body.appendChild(modalRoot);
  }

  useEffect(() => {
    if (!isOpen) return;

    const handleEscClose = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleEscClose);
    return () => {
      document.removeEventListener('keydown', handleEscClose);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <ModalOverlay onClick={onClose}>
      <div
        className={classNames(s.modal)}
        onClick={(e) => e.stopPropagation()}
        data-test="modal"
        role="dialog"
        aria-modal="true"
      >
        <div className={s.modal__content}>
          <button className={s.modal__close} onClick={onClose} data-test="modal-close" aria-label="Закрыть"><CloseIcon /></button>
          <div className={classNames(s.modal__body)}>{children}</div>
        </div>
      </div>
    </ModalOverlay>,
    modalRoot
  );
}