import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

import Button from '../Button';

import { useGetMeQuery, useUpdateMeMutation, useUploadAvatarMutation } from '@/features/auth/authAPI';

import s from './ProfileForm.module.scss';

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
    avatar: '/assets/img/avatar.jpg',
  });
  const [saved, setSaved] = useState(form);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!me) return;

    const next = {
      full_name: me.full_name ?? '',
      email: me.email ?? '',
      password: '',
      avatar: me.avatar || '/assets/img/design/avatar-crop.png',
    };

    setForm(next);
    setSaved(next);
    setAvatarFile(null);

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }, [me?.id]);

  const isChanged = useMemo(
    () =>
      !!avatarFile ||
      form.full_name !== saved.full_name ||
      form.email !== saved.email ||
      form.avatar !== saved.avatar ||
      form.password.length > 0,
    [avatarFile, form.avatar, form.email, form.full_name, form.password, saved.avatar, saved.email, saved.full_name]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    const preview = URL.createObjectURL(file);
    previewUrlRef.current = preview;
    setAvatarFile(file);
    setForm((previous) => ({ ...previous, avatar: preview }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      let finalAvatar = form.avatar;

      if (avatarFile) {
        const response = await uploadAvatar({ file: avatarFile }).unwrap();
        finalAvatar = response.avatar;
      }

      const payload: { email?: string; full_name?: string; password?: string } = {};
      if (form.full_name !== saved.full_name) payload.full_name = form.full_name;
      if (form.email !== saved.email) payload.email = form.email;
      if (form.password) payload.password = form.password;

      if (Object.keys(payload).length > 0) {
        await updateMe(payload).unwrap();
      }

      const nextSaved = { ...form, password: '', avatar: finalAvatar };
      setSaved(nextSaved);
      setForm((previous) => ({ ...previous, password: '', avatar: finalAvatar }));
      setAvatarFile(null);

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }

      toast.success('Изменения сохранены.');
    } catch (error) {
      const message =
        (error as any)?.data?.error ||
        (error as any)?.error ||
        'Не удалось сохранить изменения.';
      toast.error(message);
    }
  };

  const handleCancel = () => {
    setForm(saved);
    setAvatarFile(null);

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Не удалось загрузить профиль</div>;
  if (!me) return <div>Профиль пуст</div>;

  return (
    <form onSubmit={handleSave} className={s.form}>
      <div className={s.form__avatarCard}>
        <img src={form.avatar} alt="Аватар пользователя" />
        <div className={s.form__avatarOverlay}>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className={s.form__avatarInput}
          />
          <label htmlFor="avatar-upload" className={s.form__avatarButton}>
            {savingAvatar ? 'Загружаю...' : 'Обновить фото'}
          </label>
        </div>
      </div>

      <div className={s.form__panel}>
        <div className={s.form__heading}>
          <h2>Мой профиль</h2>
          <p>Основные данные аккаунта и быстрый доступ к обновлению пароля.</p>
        </div>

        <div className={s.form__fields}>
          <label className={s.form__field}>
            <span>Имя</span>
            <input
              name="full_name"
              type="text"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Введите имя"
              autoComplete="name"
            />
          </label>

          <label className={s.form__field}>
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Введите email"
              autoComplete="email"
            />
          </label>

          <label className={classNames(s.form__field, s.form__fieldPassword)}>
            <span>Пароль (новый)</span>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="Введите новый пароль"
              autoComplete="new-password"
            />
            <button
              type="button"
              className={s.form__passwordToggle}
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              aria-pressed={showPassword}
            >
              {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
            </button>
          </label>
        </div>

        {isChanged && (
          <div className={s.form__actions}>
            <Button type="button" className="button button-border" onClick={handleCancel}>
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={savingInfo || savingAvatar}
              className="button button-orange"
            >
              {savingInfo || savingAvatar ? 'Сохраняю...' : 'Сохранить'}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
