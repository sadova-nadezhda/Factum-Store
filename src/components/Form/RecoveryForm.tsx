import React, { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import { Eye, EyeOff } from 'lucide-react';

import Input from './parts/Input';
import Button from '../Button';

import { useForm } from '../../hooks/useForm';
import { useResetMutation } from '../../features/auth/authAPI';

import s from './Form.module.scss';

export default function RecoveryForm() {
  const { values, handleChange } = useForm({ password: '', token: '' });
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
      await resetPassword({ token, password: values.password }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const disabled =
    isLoading ||
    values.password.length < 6 ||
    (!tokenFromQuery && !values.token);

  const apiError =
    (error as any)?.data?.error ||
    (error as any)?.error ||
    undefined;

  return (
    <form
      onSubmit={handleSubmit}
      className={classNames(s.form, s.form__login)}
    >

      <div className={s.passwordField}>
        <Input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Введите новый пароль"
          value={values.password}
          onChange={handleChange}
        />
        <button
          type="button"
          className={s.eyeBtn}
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
        >
          {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
        </button>
      </div>
      

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

      {apiError && ( <div className={s.form__error}> {apiError} </div> )}

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