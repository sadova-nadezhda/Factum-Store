import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Eye, EyeOff } from 'lucide-react';

import Input from './parts/Input';
import Button from '../Button';

import { useForm } from '../../hooks/useForm';
import { useRegisterMutation } from '../../features/auth/authAPI';

import s from './Form.module.scss';


export default function RegisterForm() {
  const { values, handleChange } = useForm({ name: '', email: '', password: '' });
  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      email: values.email,
      password: values.password,
      ...(values.name.trim() ? { full_name: values.name.trim() } : {}),
    } as const; 

    try {
      await register(payload as any).unwrap();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const apiError =
    (error as any)?.data?.error ||
    (error as any)?.error ||
    undefined;

  return (
    <form onSubmit={handleSubmit} className={classNames(s.form, s.form__login)}>
      <Input type="text" name="name" placeholder="Имя" value={values.name} onChange={handleChange} />
      <Input type="email" name="email" placeholder="Email" value={values.email} onChange={handleChange} />
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
        {isLoading ? 'Отправляю…' : 'Зарегистрироваться'}
      </Button>
      {apiError && ( <div className={s.form__error}> {apiError} </div> )}
    </form>
  );
}