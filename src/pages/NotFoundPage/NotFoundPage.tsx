import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Section from '../../components/Section';

import s from './NotFoundPage.module.scss';
import Title from '@/components/Title';

export default function NotFoundPage() {
  return (
    <Section className={`${s.error} section-hidden`}>
      <div className={s.error__container}>
        <Title className={classNames(s.error__title)}>Page Not Found</Title>
        <Link to={`/`} className="button button-orange">Вернуться на главную</Link>
      </div>
    </Section>
  )
}