export type WalletType = 'main' | 'manager_pool' | 'hr_pool';

export type Wallet = {
  type: WalletType;
  balance: number;
  spendable: number;
  transferable: boolean;
};

export type WalletsMyResponse = {
  wallets: Wallet[];
  orders: {
    status: string;
    product_image: string;
    id: number; 
    product_id: number; 
    product_name: string; 
    price_at_purchase: number; 
    created_at: string 
}[];
  transfers_out: { amount: number; created_at: string; to_user: string }[];
  transfers_in: { amount: number; created_at: string; from_user: string }[];
};

export type CreateTransferDto = {
  to_user_id: number;
  amount: number;
  from_type: WalletType;
};

export type CreateTransferResponse = { status: 'ok' };

export type ApiError = { error: string; limit?: number; used?: number };