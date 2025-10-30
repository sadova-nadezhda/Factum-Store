import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

import Input from './parts/Input';
import Button from '../Button';

import { useForm } from '../../hooks/useForm';
import { useRegisterMutation } from '../../features/auth/authAPI';

import s from './Form.module.scss';

export default function RegisterForm() {
  const { values, handleChange } = useForm({ name: '', email: '', password: '' });
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!values.email || !values.password) {
      toast.error('Введите email и пароль');
      return;
    }

    if (values.password.length < 6) {
      toast.error('Пароль должен содержать минимум 6 символов');
      return;
    }

    const payload = {
      email: values.email,
      password: values.password,
      ...(values.name.trim() ? { full_name: values.name.trim() } : {}),
    };

    try {
      await register(payload as any).unwrap();
      toast.success('Регистрация прошла успешно! Теперь войдите в систему.');
      navigate('/login');
    } catch (err) {
      const msg =
        (err as any)?.data?.error ||
        (err as any)?.error ||
        'Ошибка при регистрации. Попробуйте позже.';
      toast.error(msg);
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={classNames(s.form, s.form__login)}>
      <Input
        type="text"
        name="name"
        placeholder="Имя"
        value={values.name}
        onChange={handleChange}
      />

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

      <Button
        disabled={isLoading}
        type="submit"
        className="button button-full button-orange"
      >
        {isLoading ? 'Отправляю…' : 'Зарегистрироваться'}
      </Button>
    </form>
  );
}