import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import { useAppSelector } from '../../hooks/store';

import { useGetMyWalletsQuery } from '../../features/auth/authAPI';

import s from './Header.module.scss';
import { StarIcon } from '../Icons';


export default function Header() {
  const token = useAppSelector((state) => state.auth.token) || localStorage.getItem('token');

  const { data, isLoading, isError } = useGetMyWalletsQuery(undefined, { skip: !token });

  const balance = useMemo(() => {
    if (!data?.wallets) return 0;
    const main = data.wallets.find(w => w.type === 'main');
    if (!main) return 0;
    return main.balance;
  }, [data]);

  return (
    <header className={s.header}>
      <div className="container">
        <div className={s.header__container}>
          <Link to="/" className={s.header__logo}>
            <img src="/assets/img/logo.svg" alt="Логотип" />
          </Link>

          <nav className={s.header__nav}>
            <ul className={s.header__menu}>
              <li><Link to="/catalog">Каталог</Link></li>
              <li><Link to="/">активность</Link></li>
              <li><HashLink smooth to="/#faq">FAQ</HashLink></li>
            </ul>

            {token ? (
              <div className={s.header__profile}>
                <Link to="/profile">Профиль</Link>
                <div className={s.header__balance}>
                  <span>баланс:</span>{' '}
                  {isLoading ? '…' : isError ? '—' : balance}
                  <StarIcon />
                </div>
              </div>
            ) : (
              <div className={s.header__profile}>
                <Link to="/login">Войти</Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}