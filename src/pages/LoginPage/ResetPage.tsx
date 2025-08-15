import React from 'react';
import classNames from 'classnames';

import Section from '../../components/Section';
import Title from '../../components/Title';

import s from './LoginPage.module.scss';

export default function ResetPage() {
  return (
    <Section className={classNames(s.login, 'section-pad section-hidden')}>
      <div className={s.login__container}>
        <Title className={s.login__title}>Авторизация</Title>
        <div className={s.login__wrap}>
          {/* <LoginForm /> */}
        </div>
      </div> 
    </Section>
  )
}
