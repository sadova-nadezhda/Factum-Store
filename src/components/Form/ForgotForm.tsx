import React, { type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { toast } from 'react-toastify';

import Input from './parts/Input';
import Button from '../Button';

import { useForm } from '../../hooks/useForm';
import { useForgotMutation } from '@/features/auth/authAPI';

import s from './Form.module.scss';


export default function ForgotForm() {
  const { values, handleChange, setValues } = useForm({ email: '' });
  const [forgot, { isLoading }] = useForgotMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      toast.error('Введите корректный e-mail');
      return;
    }

    try {
      await forgot({ email: values.email }).unwrap();
      toast.success('Письмо отправлено. Проверьте почту.');
      setValues({ email: '' });
    } catch (err) {
      const msg =
        (err as any)?.data?.error ||
        (err as any)?.error ||
        'Ошибка при восстановлении';
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={classNames(s.form, s.form__login)}>
      <Input
        type="email"
        name="email"
        placeholder="Укажите e-mail"
        value={values.email}
        onChange={handleChange}
      />
      <Button disabled={isLoading} type="submit" className="button button-full button-orange">
        {isLoading ? 'Отправляю…' : 'Восстановить'}
      </Button>
    </form>
  );
}