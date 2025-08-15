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
          sender="Надежда Садова"
          receiver="Аскар Джумагулов"
          amount={100}
          date="2025-04-03"
        />
        <NotificationsCard
          sender="Амир Максутов"
          receiver="Надежда Садова"
          amount={50}
          date="2025-04-05"
        />
        <NotificationsCard
          sender="Тимур Кульжабаев"
          receiver="Надежда Садова"
          amount={50}
          date="2025-04-07"
        />
      </div>
    </>
  )
}
