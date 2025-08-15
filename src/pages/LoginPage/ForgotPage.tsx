import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Section from '../../components/Section';
import Title from '../../components/Title';
import ForgotForm from '../../components/Form/ForgotForm';

import s from './LoginPage.module.scss';

export default function ForgotPasswordPage() {

  return (
    <main>
      <Section className={classNames(s.login, 'section-pad section-hidden')}>
        <div className={s.login__container}>
          <Title className={s.login__title}>Восстановление пароля</Title>
          <div className={s.login__wrap}>
            <ForgotForm />
            <div className={s.login__bottom}>
              <div className={s.login__link}>
                <span>Вспомнили пароль?</span>
                <Link to={`/login`} className='link'>Войти</Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}