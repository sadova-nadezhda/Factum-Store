export type WalletType = 'main' | 'manager_pool' | 'hr_pool';

export type Wallet = {
  type: WalletType;
  balance: number;
  spendable: number;
  transferable: boolean;
};

export type Accrual = {
  amount: number;
  created_at: string;
  reason: string;
  reason_text: string;
  from_manager_id: string;
  from_manager_name: string;
};

export type Order = {
  status: string;
  product_image: string;
  id: number;
  product_id: number;
  product_name: string;
  price_at_purchase: number;
  created_at: string;
};

export type TransferOut = {
  amount: number;
  created_at: string;
  to_user: string;
};

export type TransferIn = {
  amount: number;
  created_at: string;
  from_user: string;
};

export type WalletsMyResponse = {
  wallets: Wallet[];
  accruals: Accrual[];
  orders: Order[];
  transfers_out: TransferOut[];
  transfers_in: TransferIn[];
};

export type CreateTransferDto = {
  to_user_id: number;
  amount: number;
  from_type: WalletType;
  reason?: string;
  instant?: boolean;
};

export type CreateTransferResponse = { status: 'ok' };

export type DeductDto = {
  from_user_id: number;
  amount: number;
  reason: string;
};

export type DeductResponse = { status: 'ok' };

export type ApiError = {
  error: string;
  limit?: number;
  used?: number;
};