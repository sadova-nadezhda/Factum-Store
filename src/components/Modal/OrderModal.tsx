import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Modal from './Modal';
import Basket from '../Basket';

import { useAppDispatch } from '../../hooks/store';
import type { Product } from '../../types/ProductTypes';
import { authApi } from '../../features/auth/authAPI';
import { useCreateOrderMutation } from '@/features/orders/ordersAPI';

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

  const safeQty = Math.max(1, Math.floor(qty || 1));

  const sum = useMemo(() => (Number(product.price || 0) * safeQty), [product.price, safeQty]);

  const handleConfirm = async () => {
    if (pending || buying) return;
    setErrorText(null);
    setPending(true);
    try {
      await createOrder({
        product_id: product.id,
        qty: safeQty,
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
      {errorText && (
        <div style={{
          background: '#FDECEC',
          color: '#B00020',
          padding: '10px 12px',
          borderRadius: 8,
          marginBottom: 12,
          fontSize: 14,
          lineHeight: 1.3,
        }}>
          {errorText}
        </div>
      )}

      <Basket
        sum={sum}
        onConfirm={handleConfirm}
        onCancel={onClose}
        confirming={pending || isSubmitting || buying}
      />
    </Modal>
  );
}