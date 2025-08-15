import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import Section from '../../components/Section';
import Title from '../../components/Title';
import RegisterForm from '../../components/Form/RegisterForm';

import s from './LoginPage.module.scss';

export default function RegisterPage() {
  return (
    <Section className={classNames(s.login, 'section-pad section-hidden')}>
      <div className={s.login__container}>
        <Title className={s.login__title}>Регистрация</Title>
        <div className={s.login__wrap}>
          <RegisterForm />
          <div className={s.login__bottom}>
            <div className={s.login__link}>
              <span>Уже зарегистрированы?</span>
              <Link to={`/login`} className='link'>Войти</Link>
            </div>
          </div>
        </div>
      </div> 
    </Section>
  )
}
