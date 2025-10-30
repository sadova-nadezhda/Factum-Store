import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

import Input from './parts/Input';
import Button from '../Button';

import { useForm } from '../../hooks/useForm';
import { setToken } from '../../features/auth/authSlice';

import { useLoginMutation } from '@/features/auth/authAPI';
import { useAppDispatch } from '../../hooks/store';

import s from './Form.module.scss';


export default function LoginForm() {
  const { values, handleChange } = useForm({ email: '', password: '' });
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      dispatch(setToken(res.token));
      toast.success('Вы успешно вошли!');
      navigate('/profile');
    } catch (err) {
      const msg =
        (err as any)?.data?.error ||
        (err as any)?.error ||
        'Ошибка при входе. Проверьте данные и попробуйте снова.';
      toast.error(msg);
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={classNames(s.form, s.form__login)}>
      <Input
        type="email"
        name="email"
        placeholder="Email"
        value={values.email}
        onChange={handleChange}
      />
      <div className={s.passwordField}>
        <Input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Пароль"
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
      <Button disabled={isLoading} type='submit' className="button button-full button-orange">
        {isLoading ? 'Входим…' : 'Войти'}
      </Button>
    </form>
  );
}