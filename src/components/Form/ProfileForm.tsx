import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Eye, EyeOff } from 'lucide-react';

import Input from './parts/Input';
import Title from '../Title';
import Button from '../Button';

import { useGetMeQuery, useUpdateMeMutation, useUploadAvatarMutation  } from '../../features/auth/authAPI';

import s from './Form.module.scss';

export default function ProfileForm() {
  const { data: me, isLoading, isError } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateMe, { isLoading: savingInfo }] = useUpdateMeMutation();
  const [uploadAvatar, { isLoading: savingAvatar }] = useUploadAvatarMutation();

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    avatar: 'assets/img/avatar.jpg',
  });
  const [saved, setSaved] = useState(form);
  const [avatarFile, setAvatarFile] = useState<File | null>(null); 
  const [showPassword, setShowPassword] = useState(false);

useEffect(() => {
    if (!me) return;
    const next = {
      full_name: me.full_name ?? '',
      email: me.email ?? '',
      password: '',
      avatar: me.avatar || 'assets/img/avatar.jpg',
    };
    setForm(next);
    setSaved(next);
    setAvatarFile(null);
  }, [me?.id]);

  const isChanged = useMemo(
    () => JSON.stringify({ ...form, password: '' }) !== JSON.stringify(saved) || !!avatarFile,
    [form, saved, avatarFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);  
    const preview = URL.createObjectURL(file);  
    setForm((p) => ({ ...p, avatar: preview }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (avatarFile) {
        const res = await uploadAvatar({ file: avatarFile }).unwrap(); // { avatar, status: 'ok' }
        setForm((p) => ({ ...p, avatar: res.avatar }));
      }

      const payload: { email?: string; full_name?: string; password?: string } = {};
      if (form.full_name !== saved.full_name) payload.full_name = form.full_name;
      if (form.email !== saved.email) payload.email = form.email;
      if (form.password) payload.password = form.password;

      if (Object.keys(payload).length > 0) {
        await updateMe(payload).unwrap();
      }

      setSaved({ ...form, password: '' });
      setForm((p) => ({ ...p, password: '' }));
      setAvatarFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setForm(saved);
    setAvatarFile(null);
  };

  if (isLoading) return <div>Загрузка…</div>;
  if (isError) return <div>Не удалось загрузить профиль</div>;
  if (!me) return <div>Профиль пуст</div>;

  return (
    <form onSubmit={handleSave} className={s.form__profile}>
      <div className={s.form__avatar}>
        <img src={form.avatar} alt="Аватар" />
        <div className={s.form__file}>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="avatar-upload">
            {savingAvatar ? 'Загружаю…' : 'Загрузить фото'}
          </label>
        </div>
      </div>

      <div className={s.form__wrap}>
        <div className={s.form__top}>
          <Title as="h4" className={s.form__caption}>Мой профиль</Title>
        </div>

        <div className={s.form__box}>
          <div className={s.form__fields}>
            <Input
              name="full_name"
              type="text"
              placeholder="ФИО"
              value={form.full_name}
              onChange={handleChange}
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <div className={s.passwordField}>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Пароль (новый)"
                value={form.password}
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
          </div>

          {isChanged && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 16 }}>
              <Button type="button" className={classNames('button button-border')} onClick={handleCancel}>
                Отмена
              </Button>
              <Button type="submit" disabled={savingInfo || savingAvatar} className={classNames('button button-orange')}>
                {savingInfo || savingAvatar ? 'Сохраняю…' : 'Сохранить'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}