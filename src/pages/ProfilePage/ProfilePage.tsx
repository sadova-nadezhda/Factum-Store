import React, { useMemo } from 'react';
import classNames from 'classnames';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import Section from '../../components/Section';
import ConfirmModal from '../../components/Modal/ConfirmModal';

import { useAppDispatch } from '../../hooks/store';
import { useModal } from '../../hooks/useModal';

import { logout } from '@/features/auth/authSlice';
import { authApi } from '@/features/auth/authAPI';
import { catalogApi } from '@/features/catalog/catalogAPI';
import { faqApi } from '@/features/faq/faqAPI';
import { useGetMyWalletsQuery } from '@/features/wallets/walletsAPI';

import s from './ProfilePage.module.scss';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data } = useGetMyWalletsQuery();
  const logoutModal = useModal();

  const balance = useMemo(() => {
    const mainWallet = data?.wallets.find((wallet) => wallet.type === 'main');
    return mainWallet?.balance ?? 0;
  }, [data?.wallets]);

  const performLogout = () => {
    logoutModal.closeModal();
    dispatch(logout());
    dispatch(authApi.util.resetApiState());
    dispatch(catalogApi.util.resetApiState());
    dispatch(faqApi.util.resetApiState());
    navigate('/login', { replace: true });
  };

  return (
    <Section className={s.profilePage}>
      <section className={s.profilePage__hero}>
        <div className={s.profilePage__lead}>
          <h1>Профиль</h1>
          <p className={s.profilePage__intro}>
            Управляйте данными аккаунта, следите за балансом и историей активности в одном месте.
          </p>
        </div>

        <div className={s.profilePage__summary}>
          <p className={s.profilePage__summaryBalance}>
            Баланс:
            <strong>{balance}</strong>
            <img src="/assets/img/icon/ico-coin.png" alt="" aria-hidden="true" />
          </p>
        </div>
      </section>

      <section className={s.profilePage__tabsWrap} aria-label="Разделы профиля">
        <div className={s.tabs}>
          <NavLink
            to="/profile"
            end
            className={({ isActive }) => classNames(s.tab, isActive && s.tabActive)}
          >
            Профиль
          </NavLink>
          <NavLink
            to="/profile/coins"
            end
            className={({ isActive }) => classNames(s.tab, isActive && s.tabActive)}
          >
            Мои коины
          </NavLink>
          <NavLink
            to="/profile/notifications"
            end
            className={({ isActive }) => classNames(s.tab, isActive && s.tabActive)}
          >
            Уведомления
          </NavLink>
          <NavLink
            to="/profile/history"
            end
            className={({ isActive }) => classNames(s.tab, isActive && s.tabActive)}
          >
            История
          </NavLink>
          <button type="button" className={classNames(s.tab, s.tabGhost)} onClick={() => logoutModal.openModal()}>
            Выйти
          </button>
        </div>
      </section>

      <section className={s.profilePage__panels}>
        <Outlet />
      </section>

      <ConfirmModal
        open={logoutModal.isModalOpen}
        onClose={logoutModal.closeModal}
        onConfirm={performLogout}
      />
    </Section>
  );
}
