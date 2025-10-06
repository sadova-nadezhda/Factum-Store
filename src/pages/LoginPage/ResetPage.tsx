import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Section from '../../components/Section';
import Title from '../../components/Title';

import RecoveryForm from '../../components/Form/RecoveryForm';

import s from './LoginPage.module.scss';

export default function ResetPage() {
  return (
    <Section className={classNames(s.login, 'section-hidden')}>
      <div className={s.login__container}>
        <Title className={s.login__title}>Сброс пароля</Title>
        <div className={s.login__wrap}>
            <RecoveryForm />
            <div className={s.login__bottom}>
              <div className={s.login__link}>
                <span className='text_color_inactive'>Вспомнили пароль?</span>
                <Link to={`/login`} className='link'>Войти</Link>
              </div>
            </div>
          </div>
      </div> 
    </Section>
  )
}
