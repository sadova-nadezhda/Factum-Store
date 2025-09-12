import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import s from './Header.module.scss';

export default function Header() {
  return (
    <header className={s.header}>
      <div className="container">
        <div className={s.header__container}>
          <Link to="/" className={s.header__logo}>
            <img src="/assets/img/logo.svg" alt="Логотип" />
          </Link>
          <nav className={s.header__nav}>
            <ul className={s.header__menu}>
              <li><Link to='/catalog'>Каталог</Link></li>
              <li><HashLink smooth to="/#faq">FAQ</HashLink></li>
            </ul>
            <div className={s.header__profile}>
              <Link to='/profile'>Профиль</Link>
              <div className={s.header__balance}>
                баланс: 100
                <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect y="0.5" width="25" height="25" rx="12.5" fill="#020202"/>
                  <path d="M11.5028 4.65879C11.8717 3.7804 13.1283 3.7804 13.4972 4.6588L15.3318 9.02705C15.4874 9.39736 15.839 9.65037 16.2427 9.68242L21.0048 10.0605C21.9624 10.1365 22.3506 11.32 21.6211 11.9389L17.9929 15.0167C17.6853 15.2776 17.551 15.687 17.645 16.0771L18.7534 20.679C18.9763 21.6044 17.9598 22.3358 17.1399 21.8399L13.063 19.3738C12.7173 19.1648 12.2827 19.1648 11.937 19.3738L7.86005 21.8399C7.04022 22.3358 6.02367 21.6044 6.24657 20.679L7.35505 16.0771C7.44901 15.687 7.31469 15.2776 7.00712 15.0167L3.37893 11.9389C2.64935 11.32 3.03764 10.1365 3.99522 10.0605L8.75729 9.68242C9.16098 9.65037 9.51264 9.39736 9.66817 9.02705L11.5028 4.65879Z" fill="#DD5500"/>
                </svg>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
