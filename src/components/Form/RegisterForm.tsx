import React, { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from './parts/Input';
import Button from '../Button';

import { useForm } from '../../hooks/useForm';

import s from './Form.module.scss';

export default function RegisterForm() {
  const { values, handleChange } = useForm({ name: '', email: '', password: '' });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      <Input type="text" onChange={handleChange} value={values.name} name="name" placeholder="Имя" />
      <Input type="email" onChange={handleChange} value={values.email} name="email" placeholder="Email" />
      <Input type="password" onChange={handleChange} value={values.password} name="password" placeholder="Пароль" />
      <Button className='button button-full button-orange'>Зарегистрироваться</Button>
    </form>
  );
}