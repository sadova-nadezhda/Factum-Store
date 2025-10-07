import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import ModalOverlay from '../ModalOverlay';
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

    // блокируем скролл body
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
          <button className={s.modal__close} onClick={onClose} data-test="modal-close" aria-label="Закрыть">
            <svg width="38" height="28" viewBox="0 0 38 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M34.8418 0.366211C35.7441 -0.270839 36.9928 -0.0555555 37.6299 0.84668C38.2667 1.74897 38.0516 2.99676 37.1494 3.63379L22.4648 14.001L37.1494 24.3682C38.0516 25.0051 38.2666 26.253 37.6299 27.1553C36.9928 28.0575 35.7441 28.2728 34.8418 27.6357L18.9971 16.4482L3.15332 27.6357C2.251 28.2727 1.00325 28.0575 0.366211 27.1553C-0.270501 26.253 -0.0554016 25.0052 0.84668 24.3682L15.5293 14.001L0.84668 3.63379C-0.0554438 2.99673 -0.270633 1.74894 0.366211 0.84668C1.00322 -0.0555587 2.25101 -0.270619 3.15332 0.366211L18.9971 11.5527L34.8418 0.366211Z" fill="#020202"/>
            </svg>
          </button>
          <div className={classNames(s.modal__body)}>{children}</div>
        </div>
      </div>
    </ModalOverlay>,
    modalRoot
  );
}