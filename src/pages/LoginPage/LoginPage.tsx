import React from 'react';
import classNames from 'classnames';

import Section from '../../components/Section';
import Title from '../../components/Title';
import LoginForm from '../../components/Form/LoginForm';

import s from './LoginPage.module.scss';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <Section className={classNames(s.login, 'section-hidden')}>
      <div className={s.login__container}>
        <Title className={s.login__title}>Авторизация</Title>
        <div className={s.login__wrap}>
          <LoginForm />
          <div className={s.login__bottom}>
            <div className={s.login__link}>
              <span>Вы — новый пользователь?</span>
              <Link to={`/register`} className='link'>Зарегистрироваться</Link>
            </div>
            <div className={s.login__link}>
              <span>Забыли пароль?</span>
              <Link to={`/forgot-password `} className='link'>Восстановить пароль</Link>
            </div>
          </div>
        </div>
      </div> 
    </Section>
  )
}
