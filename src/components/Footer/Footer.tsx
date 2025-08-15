import React from 'react';

import s from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className="container">
        <div className={s.footer__container}>
          <span>© Factum | Все права защищены</span>
        </div>
      </div>
    </footer>
  )
}
