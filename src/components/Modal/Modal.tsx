import React, { useEffect, useId } from 'react';
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
  size?: 'default' | 'compact';
}

export default function Modal({ title, onClose, children, isOpen, size = 'default' }: ModalProps) {
  const titleId = useId();
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
        className={classNames(s.modal, size === 'compact' && s.modalCompact)}
        onClick={(e) => e.stopPropagation()}
        data-test="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
      >
        <div className={s.modal__content}>
          {title ? (
            <div className={s.modal__header}>
              <h2 id={titleId} className={s.modal__title}>
                {title}
              </h2>
              <button
                className={classNames(s.modal__close, s.modal__closeInline)}
                onClick={onClose}
                data-test="modal-close"
                aria-label="Закрыть"
                type="button"
              >
                <CloseIcon />
              </button>
            </div>
          ) : (
            <button
              className={s.modal__close}
              onClick={onClose}
              data-test="modal-close"
              aria-label="Закрыть"
              type="button"
            >
              <CloseIcon />
            </button>
          )}

          <div className={s.modal__body}>{children}</div>
        </div>
      </div>
    </ModalOverlay>,
    modalRoot
  );
}
