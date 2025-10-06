import React, { type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import Input from './parts/Input';
import Button from '../Button';

import { useForm } from '../../hooks/useForm';
import { setToken } from '../../features/auth/authSlice';

import { useLoginMutation } from '../../features/auth/authAPI';
import { useAppDispatch } from '../../hooks/store';
import { getErrorMessage } from '../../utils/getErrorMessage';

import s from './Form.module.scss';

export default function LoginForm() {
  const { values, handleChange } = useForm({ email: '', password: '' });
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      dispatch(setToken(res.token)); 
      navigate('/profile');
    } catch (err) { 
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
      <Input
        type="password"
        name="password"
        placeholder="Пароль"
        value={values.password}
        onChange={handleChange}
      />
      <Button disabled={isLoading} className="button button-full button-orange">
        {isLoading ? 'Входим…' : 'Войти'}
      </Button>

      {error && <div className={s.form__error}>{getErrorMessage(error)}</div>}
    </form>
  );
}