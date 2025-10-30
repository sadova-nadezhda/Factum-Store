import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { toast } from 'react-toastify';

import Input from './parts/Input';
import Select from './parts/Select';
import Button from '../Button';

import {
  useCreateTransferMutation,
  useGetUsersForTransfersQuery,
} from '@/features/auth/authAPI';

import type { Wallet, WalletType } from '@/types/WalletTypes';

import s from './Form.module.scss';

type Props = { wallets: Wallet[] };
type Opt = { value: string; label: string; disabled?: boolean };

export default function TransferForm({ wallets }: Props) {
  const transferableWallets = useMemo(
    () => wallets.filter((w) => w.transferable),
    [wallets]
  );

  const [form, setForm] = useState<{
    sum: string;
    employee: string;
    wallet: 'default' | WalletType;
  }>({
    sum: '',
    employee: 'default',
    wallet: 'default',
  });

  useEffect(() => {
    if (transferableWallets.length === 1 && form.wallet === 'default') {
      setForm((p) => ({ ...p, wallet: transferableWallets[0].type }));
    }
  }, [transferableWallets.length, transferableWallets, form.wallet]);

  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
  } = useGetUsersForTransfersQuery();

  const userOptions: Opt[] = useMemo(() => {
    const head: Opt[] = [{ value: 'default', label: 'Выберите сотрудника', disabled: true }];
    if (!users.length) {
      return [...head, { value: '', label: 'Пользователи не найдены', disabled: true }];
    }
    return [
      ...head,
      ...users.map((u) => ({
        value: String(u.id),
        label: `${u.full_name || 'Без имени'} (${u.email})`,
      })),
    ];
  }, [users]);

  const walletOptions: Opt[] = useMemo(() => {
    const title = (t: WalletType) =>
      t === 'main' ? 'Кошелёк' : t === 'manager_pool' ? 'Кошелёк Руководителя' : 'Кошелёк HR';

    const head: Opt[] = [{ value: 'default', label: 'Выберите кошелёк', disabled: true }];
    return [
      ...head,
      ...transferableWallets.map((w) => ({ value: w.type, label: title(w.type) })),
    ];
  }, [transferableWallets]);

  const [createTransfer, { isLoading }] = useCreateTransferMutation();

  const hasSelectedWallet =
    transferableWallets.length === 1 || form.wallet !== 'default';

  const selectedWallet = hasSelectedWallet
    ? transferableWallets.find((w) =>
        transferableWallets.length === 1 ? true : w.type === form.wallet
      ) ?? null
    : null;

  const available = selectedWallet?.balance;
  const amountNum = Number(form.sum);
  const overLimit =
    hasSelectedWallet &&
    typeof available === 'number' &&
    Number.isFinite(amountNum) &&
    amountNum > available;

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
    const { name, value } = e.target as HTMLInputElement & HTMLSelectElement;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const to_user_id = Number(form.employee);
    const amount = Number(form.sum);
    const from_type: WalletType =
      form.wallet === 'default'
        ? (transferableWallets[0]?.type ?? 'main')
        : form.wallet;

    if (!to_user_id) {
      toast.error('Выберите сотрудника');
      return;
    }
    if (!hasSelectedWallet) {
      toast.error('Выберите кошелёк');
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Введите корректную сумму');
      return;
    }
    if (overLimit) {
      toast.error(`Недостаточно средств. Доступно: ${available}`);
      return;
    }

    try {
      await createTransfer({ to_user_id, amount, from_type }).unwrap();

      toast.success('Перевод выполнен');

      setForm({
        sum: '',
        employee: 'default',
        wallet: transferableWallets.length === 1 ? transferableWallets[0].type : 'default',
      });
    } catch (err) {
      const data = (err as any)?.data || {};
      const msg = data.error || (err as any)?.error || 'Не удалось выполнить перевод';
      const suffix =
        typeof data.limit === 'number' && typeof data.used === 'number'
          ? ` (лимит: ${data.limit}, использовано: ${data.used})`
          : '';
      toast.error(`${msg}${suffix}`);
    }
  };

  const disabled =
    isLoading ||
    usersLoading ||
    usersError ||
    form.employee === 'default' ||
    !hasSelectedWallet ||
    !Number.isFinite(amountNum) ||
    amountNum <= 0 ||
    overLimit;

  useEffect(() => {
    if (usersError) {
      toast.error('Не удалось загрузить список сотрудников');
    }
  }, [usersError]);

  return (
    <form onSubmit={handleSubmit} className={classNames(s.form, s.form__transfer)}>
      <Select
        name="employee"
        options={userOptions}
        value={form.employee}
        onChange={handleChange}
        required
        disabled={usersLoading || usersError}
      />

      {transferableWallets.length > 1 && (
        <Select
          name="wallet"
          options={walletOptions}
          value={form.wallet}
          onChange={handleChange}
          required
        />
      )}

      <Input
        type="number"
        name="sum"
        value={form.sum}
        onChange={handleChange}
        placeholder={`Введите сумму (доступно: ${
          hasSelectedWallet && typeof available === 'number' ? available : '--'
        })`}
        min="1"
        step="1"
        inputMode="numeric"
        required
      />

      {/* подсказка при оверлимите дублируется тостом, но можно оставить inline */}
      {overLimit && (
        <div className={s.form__error}>
          Недостаточно средств. Доступно: {available}
        </div>
      )}

      <div className={s.form__footer}>
        <Button
          type="submit"
          disabled={disabled}
          className={classNames(s.form__button, 'button button-orange')}
        >
          {isLoading ? 'Отправляю…' : 'Отправить'}
        </Button>
      </div>
    </form>
  );
}