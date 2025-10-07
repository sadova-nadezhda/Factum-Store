import React from 'react';

import s from './ModalOverlay.module.scss';

interface ModalOverlayProps {
  onClick: () => void;
  children: React.ReactNode;
}

export default function ModalOverlay({ onClick, children }: ModalOverlayProps ) {
  return <div className={s.overlay} onClick={onClick} data-test="modal-overlay">{children}</div>;
}
