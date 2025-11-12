import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { toast } from 'react-toastify';

import Input from './parts/Input';
import Select from './parts/Select';
import Button from '../Button';

import { useGetUsersForTransfersQuery } from '@/features/users/usersAPI';
import { useCreateTransferMutation, useDeductCoinsMutation } from '@/features/wallets/walletsAPI';

import type { Wallet, WalletType } from '@/types/WalletTypes';

import s from './Form.module.scss';

type Props = { wallets: Wallet[] };
type Opt = { value: string; label: string; disabled?: boolean };

export default function TransferForm({ wallets }: Props) {
  const transferableWallets = useMemo(
    () => wallets.filter((w) => w.transferable && (w.type === 'main' || w.type === 'manager_pool')),
    [wallets]
  );

  const [form, setForm] = useState<{
    sum: string;
    employee: string;
    wallet: 'default' | WalletType;
    reason: 'manager_bonus' | 'manager_deduction' | '';
    meta: string;
  }>({
    sum: '',
    employee: 'default',
    wallet: 'default',
    reason: '',
    meta: '',
  });

  useEffect(() => {
    if (transferableWallets.length === 1 && form.wallet === 'default') {
      setForm((p) => ({ ...p, wallet: transferableWallets[0].type }));
    }
  }, [transferableWallets, form.wallet]);

  const { data: users = [], isLoading: usersLoading, isError: usersError } = useGetUsersForTransfersQuery();

  const userOptions: Opt[] = useMemo(() => {
    const head: Opt[] = [{ value: 'default', label: 'Выберите сотрудника', disabled: true }];
    if (!users.length) return [...head, { value: '', label: 'Пользователи не найдены', disabled: true }];
    return [
      ...head,
      ...users.map((u) => ({
        value: String(u.id),
        label: `${u.full_name || 'Без имени'} (${u.email})`,
      })),
    ];
  }, [users]);

  const walletOptions: Opt[] = useMemo(() => {
    const title = (t: WalletType) => (t === 'main' ? 'Кошелёк' : 'Кошелёк HR');
    const head: Opt[] = [{ value: 'default', label: 'Выберите кошелёк', disabled: true }];
    return [...head, ...transferableWallets.map((w) => ({ value: w.type, label: title(w.type) }))];
  }, [transferableWallets]);

  const [createTransfer, { isLoading: isTransferring }] = useCreateTransferMutation();
  const [deductCoins, { isLoading: isDeducting }] = useDeductCoinsMutation();
  const isSubmitting = isTransferring || isDeducting;

  const hasSelectedWallet = transferableWallets.length === 1 || form.wallet !== 'default';
  const selectedWallet =
    hasSelectedWallet
      ? transferableWallets.find((w) => (transferableWallets.length === 1 ? true : w.type === form.wallet)) ?? null
      : null;

  const isHRWallet = selectedWallet?.type === 'manager_pool';
  const available = selectedWallet?.balance;
  const amountNum = Number(form.sum);

  const from_type: WalletType =
    form.wallet === 'default' ? (transferableWallets[0]?.type ?? 'main') : form.wallet;

  const isDeduction = isHRWallet && form.reason === 'manager_deduction';
  const effectiveReason = isHRWallet ? form.reason : 'manager_bonus';

  const overLimit =
    !isDeduction &&
    hasSelectedWallet &&
    typeof available === 'number' &&
    Number.isFinite(amountNum) &&
    amountNum > available;

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const to_user_id = Number(form.employee);
    const amount = Number(form.sum);

    if (!to_user_id) return toast.error('Выберите сотрудника');
    if (!Number.isFinite(amount) || amount <= 0) return toast.error('Введите корректную сумму');
    if (!hasSelectedWallet) return toast.error('Выберите кошелёк');

    if (isHRWallet && !effectiveReason) return toast.error('Выберите действие');

    if (!isDeduction && overLimit) return toast.error(`Недостаточно средств. Доступно: ${available}`);

    try {
      if (isDeduction) {
        await deductCoins({ from_user_id: to_user_id, amount, reason: 'manager_deduction', meta: '' }).unwrap();
        toast.success('Списание выполнено');
      } else {
        await createTransfer({
          from_type,
          to_user_id,
          amount,
          reason: 'manager_bonus',
          meta: isHRWallet ? (form.meta.trim() || '') : '',
        }).unwrap();
        toast.success('Пополнение выполнено');
      }

      setForm({
        sum: '',
        employee: 'default',
        wallet: transferableWallets.length === 1 ? transferableWallets[0].type : 'default',
        reason: '',
        meta: '',
      });
    } catch (err) {
      const data = (err as any)?.data || {};
      const msg = data.error || (err as any)?.error || 'Операция не выполнена';
      const suffix =
        typeof data.limit === 'number' && typeof data.used === 'number'
          ? ` (лимит: ${data.limit}, использовано: ${data.used})`
          : '';
      toast.error(`${msg}${suffix}`);
    }
  };

  const disabled =
    isSubmitting ||
    usersLoading ||
    usersError ||
    form.employee === 'default' ||
    !Number.isFinite(amountNum) ||
    amountNum <= 0 ||
    (!isHRWallet && form.wallet === 'default') ||
    (!isDeduction && overLimit);

  useEffect(() => {
    if (usersError) toast.error('Не удалось загрузить список сотрудников');
  }, [usersError]);

  const sumPlaceholder = isDeduction
    ? 'Введите сумму списания'
    : `Введите сумму (доступно: ${hasSelectedWallet && typeof available === 'number' ? available : '--'})`;

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

      {isHRWallet && (
        <Select
          name="reason"
          options={[
            { value: '', label: 'Выберите действие', disabled: true },
            { value: 'manager_bonus', label: 'Пополнение' },
            { value: 'manager_deduction', label: 'Списание' },
          ]}
          value={form.reason}
          onChange={handleChange}
          required
        />
      )}

      <Input
        type="number"
        name="sum"
        value={form.sum}
        onChange={handleChange}
        placeholder={sumPlaceholder}
        min="1"
        step="1"
        inputMode="numeric"
        onWheel={(e: any) => e.currentTarget.blur()}
        required
      />

      {isHRWallet && form.reason === 'manager_bonus' && (
        <Input
          type="text"
          name="meta"
          value={form.meta}
          onChange={handleChange}
          placeholder="Комментарий"
        />
      )}

      {!isDeduction && overLimit && (
        <div className={s.form__error}>Недостаточно средств. Доступно: {available}</div>
      )}

      <div className={s.form__footer}>
        <Button
          type="submit"
          disabled={disabled}
          className={classNames(s.form__button, 'button button-orange')}
        >
          {isSubmitting
            ? 'Обрабатываю…'
            : isDeduction
            ? 'Списать'
            : 'Отправить'}
        </Button>
      </div>
    </form>
  );
}