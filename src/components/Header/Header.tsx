import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import { useAppSelector } from '../../hooks/store';
import { useGetMyWalletsQuery } from '@/features/wallets/walletsAPI';
import { useGetMeQuery } from '@/features/auth/authAPI';

import s from './Header.module.scss';
import { StarIcon } from '../Icons';

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const token = useAppSelector((state) => state.auth.token) || localStorage.getItem('token');

  const { data: me } = useGetMeQuery(undefined, { skip: !token });
  const { data, isLoading, isError } = useGetMyWalletsQuery(undefined, { skip: !token });

  const balance = useMemo(() => {
    if (!data?.wallets) return 0;
    const main = data.wallets.find((wallet) => wallet.type === 'main');
    return main?.balance ?? 0;
  }, [data]);

  const avatar = me?.avatar || '/assets/img/avatar.webp';
  const faqIsActive = location.pathname === '/' && location.hash === '#faq';
  const profileIsActive = location.pathname.startsWith('/profile');

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((open) => !open);

  return (
    <header className={s.header}>
      <div className="container">
        <div className={s.header__container}>
          <Link to="/" className={s.header__logo} aria-label="Factum Merch">
            <img src="/assets/img/icon/FACTUM.svg" alt="Factum" />
          </Link>

          <button
            type="button"
            className={classNames(s.header__toggle, isMenuOpen && s.header__toggleActive)}
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            className={classNames(s.header__nav, isMenuOpen && s.header__navOpen)}
            aria-label="Основная навигация"
          >
            <div className={s.header__menu}>
              <NavLink
                to="/catalog"
                className={({ isActive }) => classNames(s.header__navLink, isActive && s.active)}
                onClick={closeMenu}
              >
                Каталог
              </NavLink>
              <NavLink
                to="/events"
                className={({ isActive }) => classNames(s.header__navLink, isActive && s.active)}
                onClick={closeMenu}
              >
                Активность
              </NavLink>
              <HashLink
                smooth
                to="/#faq"
                className={classNames(s.header__navLink, faqIsActive && s.active)}
                onClick={closeMenu}
              >
                FAQ
              </HashLink>
            </div>

            <div className={s.header__actions}>
              {token ? (
                <>
                  <Link to="/profile/coins" className={s.header__balance} aria-label="Баланс factum coins" onClick={closeMenu}>
                    <StarIcon />
                    <div>
                      <strong>{isLoading ? '…' : isError ? '—' : balance}</strong>
                      <span>factum coins</span>
                    </div>
                  </Link>
                  <Link
                    to="/profile"
                    className={classNames(s.header__avatar, profileIsActive && s.header__avatarActive)}
                    aria-current={profileIsActive ? 'page' : undefined}
                    aria-label="Профиль пользователя"
                    onClick={closeMenu}
                  >
                    <img src={avatar} alt="Аватар пользователя" />
                  </Link>
                </>
              ) : (
                <Link to="/login" className={s.header__login}>
                  Войти
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
