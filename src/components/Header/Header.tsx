import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import { StarIcon } from '../Icons';

import { useAppSelector } from '../../hooks/store';
import { useGetMyWalletsQuery } from '../../features/auth/authAPI';

import s from './Header.module.scss';

export default function Header() {
  const token = useAppSelector((state) => state.auth.token) || localStorage.getItem('token');

  const { data, isLoading, isError } = useGetMyWalletsQuery(undefined, { skip: !token });

  const balance = useMemo(() => {
    if (!data?.wallets) return 0;
    const main = data.wallets.find(w => w.type === 'main');
    if (!main) return 0;
    return main.balance;
  }, [data]);

   useEffect(() => {
    const link = document.querySelector<HTMLDivElement>('.header__burger');
    const menu = document.querySelector<HTMLElement>('.header__nav');

    if (!link || !menu) return;

    const onBurgerClick = () => {
      link.classList.toggle('active');
      menu.classList.toggle('open');
    };

    const onScroll = () => {
      if (menu.classList.contains('open')) {
        link.classList.remove('active');
        menu.classList.remove('open');
      }
    };

    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.classList.contains('header__nav') &&
        !target.classList.contains('header__burger')
      ) {
        link.classList.remove('active');
        menu.classList.remove('open');
      }
    };

    link.addEventListener('click', onBurgerClick, false);
    window.addEventListener('scroll', onScroll);
    document.addEventListener('click', onDocClick);

    return () => {
      link.removeEventListener('click', onBurgerClick, false);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onDocClick);
    };
  }, []);

  return (
    <header className={s.header}>
      <div className="container">
        <div className={s.header__container}>
          <Link to="/" className={s.header__logo}>
            <img src="/assets/img/logo.svg" alt="Логотип" />
          </Link>

          <nav className={`${s.header__nav} header__nav`}>
            <div className={s.header__menu}>
              <Link to="/catalog">Каталог</Link>
              <Link to="/events">активность</Link>
              <HashLink smooth to="/#faq">FAQ</HashLink>
            </div>

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

          <div className={`${s.header__burger} header__burger`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </header>
  );
}