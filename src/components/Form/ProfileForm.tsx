import React, { useState, useMemo } from 'react';
import classNames from 'classnames';

import Input from "./parts/Input";
import Title from '../Title';
import Button from '../Button';

import type { FormValues } from '../../types/FormTypes';

import s from './Form.module.scss';

interface ExtendedFormValues extends FormValues {
  avatar: string; // URL или base64
}

export default function ProfileForm() {
  const initialForm: ExtendedFormValues = {
    name: 'Садова Надежда',
    email: 'test@factum.agensy',
    password: '',
    avatar: 'assets/img/avatar.jpg'
  };

  const [form, setForm] = useState<ExtendedFormValues>(initialForm);
  const [savedForm, setSavedForm] = useState<ExtendedFormValues>(initialForm);

  const isChanged = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(savedForm),
    [form, savedForm]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: сохранить на бэкенд
    setSavedForm(form);
    setForm((prev) => ({ ...prev, password: '' })); // очистка только поля пароля
  };

  const handleCancel = () => {
    setForm(savedForm);
  };

  return (
    <form onSubmit={handleSave} className={s.form__profile}>
      {/* Блок аватара */}
      <div className={s.form__avatar}>
        <img
          src={form.avatar}
          alt="Аватар"
        />
        <div className={s.form__file}>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            id="avatar-upload"
            style={{ display: 'none' }}
          />
          <label htmlFor="avatar-upload">
            Загрузить фото
          </label>
        </div>
      </div>
      <div className={s.form__box}>
        <div className={s.form__top}>
          <Title component='h4' className={s.form__caption}>Мой профиль</Title>
          <Button type="button" className={s.form__link} onClick={handleChange}>
            Редактировать профиль
          </Button>
        </div>
        {/* Блок поля формы */}
        <div className={s.form__fields}>
          <Input
            value={form.name}
            placeholder="ФИО"
            name="name"
            type="text"
          />
          <Input
            value={form.email}
            placeholder="Email"
            name="email"
            type="email"
          />
          <Input
            value={form.password}
            placeholder="Пароль"
            name="password"
            type="password"
          />

          {isChanged && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: 16 }}>
              <Button type="button" className={classNames("button button-border")} onClick={handleCancel}>
                Отмена
              </Button>
              <Button type="submit" className={classNames("button button-orange")}>
                Сохранить
              </Button>
            </div>
          )}
        </div>
      </div>

    </form>
  );
}