import React, { useEffect, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import classNames from 'classnames';

import Input from './parts/Input';
import Button from '../Button';

import { useForm } from '../../hooks/useForm';
import { useResetMutation } from '../../features/auth/authAPI';

import s from './Form.module.scss';

export default function RecoveryForm() {
  const { values, handleChange } = useForm({ password: '', token: '' });
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const tokenFromQuery = params.get('token') || '';

  const [resetPassword, { isLoading, isSuccess, error }] = useResetMutation();

  useEffect(() => {
    if (isSuccess) navigate('/login', { replace: true });
  }, [isSuccess, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = tokenFromQuery || values.token;
    if (!token || !values.password) return;

    try {
      await resetPassword({ token, new_password: values.password }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const errorText =
    (error as any)?.data?.error ||
    (error as any)?.error ||
    'Ошибка сброса пароля';

  const disabled =
    isLoading || !(tokenFromQuery || values.token) || values.password.length < 6;

  return (
    <form
      onSubmit={handleSubmit}
      className={classNames(s.form, s.form__login)}
      style={{ maxWidth: 400, margin: '0 auto' }}
    >
      <Input
        type="password"
        name="password"
        placeholder="Введите новый пароль"
        value={values.password}
        onChange={handleChange}
      />

      {/* Если токен пришёл через ссылку — поле можно скрыть */}
      {!tokenFromQuery && (
        <Input
          type="text"
          name="token"
          placeholder="Введите код из письма"
          value={values.token}
          onChange={handleChange}
        />
      )}

      {error && <div className={s.form__error}>{errorText}</div>}

      <Button
        type="submit"
        disabled={disabled}
        className="button button-full button-orange"
      >
        {isLoading ? 'Сохранение...' : 'Сохранить'}
      </Button>
    </form>
  );
}