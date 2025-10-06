import React, { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import Input from './parts/Input';
import Button from '../Button';

import { useForm } from '../../hooks/useForm';
import { useRegisterMutation } from '../../features/auth/authAPI';
import { getErrorMessage } from '../../utils/getErrorMessage';

import s from './Form.module.scss';


export default function RegisterForm() {
  const { values, handleChange } = useForm({ name: '', email: '', password: '' });
  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await register({
        email: values.email,
        password: values.password,
        full_name: values.name || undefined,
      }).unwrap();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={classNames(s.form, s.form__login)}>
      <Input type="text" name="name" placeholder="Имя" value={values.name} onChange={handleChange} />
      <Input type="email" name="email" placeholder="Email" value={values.email} onChange={handleChange} />
      <Input type="password" name="password" placeholder="Пароль" value={values.password} onChange={handleChange} />
      <Button disabled={isLoading} className="button button-full button-orange">
        {isLoading ? 'Отправляю…' : 'Зарегистрироваться'}
      </Button>
      {error && <div className={s.form__error}>{getErrorMessage(error)}</div>}
    </form>
  );
}