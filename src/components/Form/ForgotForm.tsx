import React, { type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import Input from './parts/Input';
import Button from '../Button';

import { useForm } from '../../hooks/useForm';
import { useForgotMutation } from '../../features/auth/authAPI';
import { getErrorMessage } from '../../utils/getErrorMessage';

import s from './Form.module.scss';

export default function ForgotForm() {
  const { values, handleChange, setValues } = useForm({ email: '' });
  const [forgot, { isLoading, isSuccess, error }] = useForgotMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await forgot({ email: values.email }).unwrap();
      navigate('/reset-password');
    } catch (err) {
      console.error(err);
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
      <Button disabled={isLoading} className="button button-full button-orange">
        {isLoading ? 'Отправляю…' : 'Восстановить'}
      </Button>

      {isSuccess && <div className={s.form__ok}>Проверьте почту</div>}
      {error && <div className={s.form__error}>{getErrorMessage(error)}</div>}
    </form>
  );
}