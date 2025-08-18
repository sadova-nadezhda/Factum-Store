import React from 'react';

import Title from '../../Title';
import { NotificationsCard } from '../../Card';

import s from './ProfileNotif.module.scss';

export default function ProfileNotif() {
  return (
    <>
      <Title component='h4' className={s.notif__caption}>Уведомления</Title>
      <div className={s.notif__cards}>
        <NotificationsCard
          caption='Вы купили Свитшот “FACTUM basic”'
          desc='Поздравляем с покупкой!'
          amount='-200'
          date="2025-04-03"
        />
        <NotificationsCard
          sender="Амир Максутов"
          receiver="Вы"
          amount='+50'
          date="2025-04-05"
        />
        <NotificationsCard
          caption='Вы получили вознаграждение! '
          desc='Ежемесячные бонусы'
          amount='+50'
          date="2025-04-07"
        />
        <NotificationsCard
          sender="Вы"
          receiver="Аскар Джумагулов"
          amount='-50'
          date="2025-04-05"
        />
      </div>
    </>
  )
}
