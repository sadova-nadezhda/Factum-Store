import React from 'react';

import Section from '@/components/Section';
import { EventsCard } from '@/components/Card';

import s from './EventsPage.module.scss';

export default function EventsPage() {
  return (
    <Section className={`${s.events} section-pad section-hidden`}>
      <div className={s.events__container}>
        <div className={s.events__cards}>
          <EventsCard 
            caption='Участие в корпоративе или тимбилдинге' 
            reward={30}
          />
          <EventsCard 
            caption='Победа в конкурсе идей' 
            reward={50}
          />
          <EventsCard 
            caption='Фидбэк от клиента (позитивный, подтверждённый)' 
            reward={40}
          />
        </div>
      </div>
    </Section>
  )
}
