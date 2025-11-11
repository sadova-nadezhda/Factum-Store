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
    () => wallets.filter((w) => w.transferable),
    [wallets]
  );

  const [form, setForm] = useState<{
    sum: string;
    employee: string;
    wallet: 'default' | WalletType;
    reason: string;
    instant: boolean;
  }>({
    sum: '',
    employee: 'default',
    wallet: 'default',
    reason: '',
    instant: false,
  });

  useEffect(() => {
    if (transferableWallets.length === 1 && form.wallet === 'default') {
      setForm((p) => ({ ...p, wallet: transferableWallets[0].type }));
    }
  }, [transferableWallets, form.wallet]);

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
      t === 'main'
        ? 'Кошелёк'
        : t === 'manager_pool'
        ? 'Кошелёк Руководителя'
        : 'Кошелёк HR';

    const head: Opt[] = [{ value: 'default', label: 'Выберите кошелёк', disabled: true }];
    return [
      ...head,
      ...transferableWallets.map((w) => ({ value: w.type, label: title(w.type) })),
    ];
  }, [transferableWallets]);

  const [createTransfer, { isLoading: isTransferring }] = useCreateTransferMutation();
  const [deductCoins, { isLoading: isDeducting }] = useDeductCoinsMutation();

  const isSubmitting = isTransferring || isDeducting;

  const hasSelectedWallet =
    transferableWallets.length === 1 || form.wallet !== 'default';

  const selectedWallet = hasSelectedWallet
    ? transferableWallets.find((w) =>
        transferableWallets.length === 1 ? true : w.type === form.wallet
      ) ?? null
    : null;

  const available = selectedWallet?.balance;
  const amountNum = Number(form.sum);

  const effectiveType: WalletType =
    form.wallet === 'default'
      ? (transferableWallets[0]?.type ?? 'main')
      : form.wallet;

  const requiresReason = effectiveType === 'manager_pool';
  const isInstantDeduct = requiresReason && form.instant;

  const overLimit =
    !isInstantDeduct &&
    hasSelectedWallet &&
    typeof available === 'number' &&
    Number.isFinite(amountNum) &&
    amountNum > available;

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Введите корректную сумму');
      return;
    }

    if (!isInstantDeduct) {
      if (!hasSelectedWallet) {
        toast.error('Выберите кошелёк');
        return;
      }
      if (overLimit) {
        toast.error(`Недостаточно средств. Доступно: ${available}`);
        return;
      }
    }

    if (from_type === 'manager_pool' && !form.reason.trim()) {
      toast.error('Укажите причину');
      return;
    }

    try {
      if (isInstantDeduct) {
        await deductCoins({
          from_user_id: to_user_id,
          amount,
          reason: "manager_deduction",
        }).unwrap();
        toast.success('Списание выполнено');
      } else {
        const payload: {
          to_user_id: number;
          amount: number;
          from_type: WalletType;
          reason?: string;
          instant?: boolean;
        } = { to_user_id, amount, from_type };

        if (from_type === 'manager_pool') {
          payload.reason = "manager_bonus";
          if (form.instant) payload.instant = true;
        }

        await createTransfer(payload).unwrap();
        toast.success('Перевод выполнен');
      }

      setForm({
        sum: '',
        employee: 'default',
        wallet: transferableWallets.length === 1 ? transferableWallets[0].type : 'default',
        reason: '',
        instant: false,
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
    // блокируем только для обычного перевода (не для списания)
    (!isInstantDeduct && (!hasSelectedWallet || overLimit)) ||
    (requiresReason && !form.reason.trim());

  useEffect(() => {
    if (usersError) {
      toast.error('Не удалось загрузить список сотрудников');
    }
  }, [usersError]);

  const sumPlaceholder = isInstantDeduct
    ? 'Введите сумму'
    : `Введите сумму (доступно: ${
        hasSelectedWallet && typeof available === 'number' ? available : '--'
      })`;

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
          disabled={isInstantDeduct} // при списании выбор кошелька не влияет
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

      {requiresReason && (
        <>
          <Input
            type="text"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Причина"
            required
          />
          <label className={s.form__checkbox}>
            <input
              type="checkbox"
              name="instant"
              checked={form.instant}
              onChange={handleChange}
            />
            <span>Списать коины</span>
          </label>
        </>
      )}

      {!isInstantDeduct && overLimit && (
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
          {isSubmitting ? 'Обрабатываю…' : isInstantDeduct ? 'Списать' : 'Отправить'}
        </Button>
      </div>
    </form>
  );
}