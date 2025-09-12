import React, { FormEvent } from 'react';
import classNames from 'classnames';

import Input from './parts/Input';
import Button from '../Button';

import { useForm } from '../../hooks/useForm';

import s from './Form.module.scss';

export default function ForgotForm() {
  const { values, handleChange } = useForm({ email: '' });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };  

  return (
    <form onSubmit={handleSubmit} className={classNames(s.form, s.form__login)}>
      <Input
        type="email"
        onChange={handleChange}
        value={values.email}
        name="email"
        placeholder="Укажите e-mail"
      />
      <Button className='button button-full button-orange'>Восстановить</Button>
    </form>
  );
}