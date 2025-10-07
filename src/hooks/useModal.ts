import { useCallback, useEffect, useState } from 'react';

export function useModal<T = void>(initialOpen = false) {
  const [isModalOpen, setModalOpen] = useState<boolean>(initialOpen);
  const [payload, setPayload] = useState<T | null>(null);

  const openModal = useCallback((data?: T) => {
    if (typeof data !== 'undefined') setPayload(data as T);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setPayload(null);
  }, []);

  const toggleModal = useCallback(() => {
    setModalOpen((v) => !v);
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeModal();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModalOpen, closeModal]);

  return { isModalOpen, openModal, closeModal, toggleModal, payload };
}