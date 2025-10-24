import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';

import Section from '@/components/Section';
import { EventsCard } from '@/components/Card';

import s from './EventsPage.module.scss';

export default function EventsPage() {
  return (
    <Section className={`${s.events} section-pad section-hidden`}>
      <div className={s.events__container}>
         <Tabs
          selectedTabClassName={s.tabSelected}
          selectedTabPanelClassName={s.tabPanelSelected}
         >
          <TabList className={s.tabList}>
            <Tab className={s.tab}>События</Tab>
            <Tab className={s.tab}>Ежемесячные</Tab>
            <Tab className={s.tab}>Годовые / Квартальные</Tab>
          </TabList>

          <TabPanel className={s.tabPanel}>
            <div className={s.events__cards}>
              <EventsCard 
                title='Участие в корпоративе или тимбилдинге' 
                reward={30}
              />
              <EventsCard 
                title='Победа в конкурсе идей' 
                reward={50}
              />
              <EventsCard 
                title='Фидбэк от клиента (позитивный, подтверждённый)' 
                reward={40}
              />
            </div>
          </TabPanel>
          <TabPanel className={s.tabPanel}>
            <div className={s.events__cards}>
              <EventsCard 
                title='Участие в корпоративе или тимбилдинге' 
                reward={30}
              />
              <EventsCard 
                title='Победа в конкурсе идей' 
                reward={50}
              />
              
            </div>
          </TabPanel>
          <TabPanel className={s.tabPanel}>
            <div className={s.events__cards}>
              <EventsCard 
                title='Участие в корпоративе или тимбилдинге' 
                reward={30}
              />
              
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </Section>
  )
}
