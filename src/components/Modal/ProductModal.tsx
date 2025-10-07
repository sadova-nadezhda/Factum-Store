import Modal from './Modal';
import ProductInfo from '../Product';
import type { Product } from '../../types/ProductTypes';

type Props = {
  open?: boolean;
  onClose?: () => void;
  product?: Product;
  isAuth?: boolean;
  onAddToCart?: (qty: number) => void;
  onOpenOrder?: (qty: number) => void;
};

export default function ProductModal({ open, onClose, product, isAuth, onAddToCart, onOpenOrder }: Props) {
  if (!open) return null;

  const safeOnClose = onClose ?? (() => {});

  return (
    <Modal isOpen={open} onClose={safeOnClose}>
      {product && (
        <ProductInfo
          product={product}
          isAuth={isAuth}
          onAddToCart={onAddToCart}
          onOpenOrder={onOpenOrder}
        />
      )}
    </Modal>
  );
}