import React, { useState } from 'react';
import classNames from 'classnames';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import Section from '../../components/Section';

import { useAppDispatch, useAppSelector } from '../../hooks/store';

import { logout } from '@/features/auth/authSlice';
import { catalogApi } from '@/features/catalog/catalogAPI';
import { faqApi } from '@/features/faq/faqAPI';
import { authApi } from '@/features/auth/authAPI';

import s from './ProfilePage.module.scss';
import Button from '@/components/Button';


export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

const onLogout = () => {
    dispatch(logout());

    dispatch(authApi.util.resetApiState());
    dispatch(catalogApi.util.resetApiState());
    dispatch(faqApi.util.resetApiState());

    navigate('/login', { replace: true });
  };

  return (
    <Section className={`${s.profile} section-pad section-hidden`}>
      <div className={s.profile__container}>
        <div className={s.profile__aside}>
          <ul className={s.profile__list}>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) => classNames({ [s.active]: isActive })}
                end
              >
                Профиль
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile/coins"
                className={({ isActive }) => classNames({ [s.active]: isActive })}
                end
              >
                Мои коины
              </NavLink>
            </li>
            <li>              
              <NavLink
                to="/profile/notifications"
                className={({ isActive }) => classNames({ [s.active]: isActive })}
                end
              >
                Уведомления
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile/history"
                className={({ isActive }) => classNames({ [s.active]: isActive })}
                end
              >
                История
              </NavLink>
            </li>
            <li>
              <Button onClick={onLogout} className={s.profile__logout}>Выйти</Button>
            </li>
          </ul>
        </div>
        <div className={s.profile__wrap}>
          <Outlet /> 
        </div>
      </div>
    </Section>
  );
}