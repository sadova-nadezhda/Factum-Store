import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Section from '../../components/Section';

import s from './NotFoundPage.module.scss';

export default function NotFoundPage() {
  return (
    <main>
      <Section className={`${s.error} section-pad section-hidden`}>
        <div className={s.error__container}>
          <h1 className={classNames(s.error__title, 'mb-10 text_type_main-large')}>Page Not Found</h1>
          <Link to={`/`} className="button button-primary">Вернуться на главную</Link>
        </div>
      </Section>
    </main>
  )
}