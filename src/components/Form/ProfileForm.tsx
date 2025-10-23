import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Eye, EyeOff } from 'lucide-react';

import Input from './parts/Input';
import Title from '../Title';
import Button from '../Button';

import { useGetMeQuery, useUpdateMeMutation, useUploadAvatarMutation } from '../../features/auth/authAPI';

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

  const previewUrlRef = useRef<string | null>(null);

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
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }, [me?.id]);

  const isChanged = useMemo(() => {
    return (
      !!avatarFile ||
      form.full_name !== saved.full_name ||
      form.email !== saved.email ||
      form.avatar !== saved.avatar ||
      form.password.length > 0
    );
  }, [avatarFile, form.full_name, form.email, form.avatar, form.password, saved.full_name, saved.email, saved.avatar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    const preview = URL.createObjectURL(file);
    previewUrlRef.current = preview;

    setAvatarFile(file);
    setForm((p) => ({ ...p, avatar: preview }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let finalAvatar = form.avatar;

      if (avatarFile) {
        const res = await uploadAvatar({ file: avatarFile }).unwrap();
        finalAvatar = res.avatar;
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
      setForm((p) => ({ ...p, password: '', avatar: finalAvatar }));
      setAvatarFile(null);

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    } catch (err) {
      console.error(err);
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
                autoComplete="new-password"
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
              <Button
                type="submit"
                disabled={savingInfo || savingAvatar}
                className={classNames('button button-orange')}
              >
                {savingInfo || savingAvatar ? 'Сохраняю…' : 'Сохранить'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}