import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Modal from './Modal';
import Basket from '../Basket';

import { useAppDispatch } from '../../hooks/store';
import type { Product } from '../../types/ProductTypes';
import { useCreateOrderMutation, authApi } from '../../features/auth/authAPI';

type Props = {
  open: boolean;
  onClose: () => void;
  product: Product;
  qty?: number;
  isSubmitting?: boolean;
};

export default function OrderModal({
  open,
  onClose,
  product,
  qty = 1,
  isSubmitting = false,
}: Props) {
  const [pending, setPending] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [createOrder, { isLoading: buying }] = useCreateOrderMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const sum = useMemo(
    () => Number(product.price || 0) * (qty ?? 1),
    [product.price, qty]
  );

  const handleConfirm = async () => {
    setErrorText(null);
    setPending(true);
    try {
      await createOrder({
        product_id: product.id,
        qty: 1
      }).unwrap();

      dispatch(authApi.util.invalidateTags(['Wallets']));

      onClose();
    } catch (e: any) {
      const msg: string =
        e?.data?.error ||
        e?.error ||
        (typeof e?.message === 'string' ? e.message : 'Не удалось оформить заказ');

      const status: number | undefined = e?.status;
      if (status === 401 || status === 403) {
        setErrorText('Войдите в аккаунт, чтобы оформить заказ');
        navigate('/login');
      } else if (status === 409 || status === 400) {
        setErrorText(msg || 'Невозможно оформить заказ');
      } else {
        setErrorText(msg);
      }
    } finally {
      setPending(false);
    }
  };

  if (!open) return null;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Basket
        sum={Number(sum.toFixed(2))}
        onConfirm={handleConfirm}
        onCancel={onClose}
        confirming={pending || isSubmitting || buying}
      />
    </Modal>
  );
}