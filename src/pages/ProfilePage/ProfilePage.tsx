import React from 'react';
import classNames from 'classnames';
import { NavLink, Outlet } from 'react-router-dom';

import Section from '../../components/Section';

import { useAppDispatch, useAppSelector } from '../../hooks/store';

import s from './ProfilePage.module.scss';

export default function ProfilePage() {
  // const { user, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    
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
            <li><a onClick={handleLogout}>Выйти</a></li>
          </ul>
        </div>
        <div className={s.profile__wrap}>
          <Outlet /> 
        </div>
      </div>
    </Section>
  );
}