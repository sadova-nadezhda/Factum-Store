import React, { useEffect, useMemo } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';

import Section from '@/components/Section';
import { EventsCard } from '@/components/Card';
import s from './EventsPage.module.scss';

import { useGetEventsQuery } from '@/features/events/eventsApi';

export default function EventsPage() {
  const { data = [], isLoading, isError, error } = useGetEventsQuery();

  useEffect(() => {
    if (data.length) console.log('события:', data);
  }, [data]);

  const byType = useMemo(() => {
    return data.reduce<Record<string, typeof data>>( (acc, item) => {
      (acc[item.type] ||= []).push(item);
      return acc;
    }, {});
  }, [data]);

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

          {/* События */}
          <TabPanel className={s.tabPanel}>
            {isLoading && <div className={s.skeleton}>Загрузка…</div>}
            {isError && <div className={s.error}>Ошибка: {(error as any)?.status ?? '—'}</div>}
            {!isLoading && !isError && (
              <div className={s.events__cards} data-type="events">
                {(byType['events'] ?? []).map((it) => (
                  <EventsCard key={`ev-${it.id}`} title={it.title} reward={it.reward} />
                ))}
              </div>
            )}
          </TabPanel>

          {/* Ежемесячные */}
          <TabPanel className={s.tabPanel}>
            {isLoading && <div className={s.skeleton}>Загрузка…</div>}
            {isError && <div className={s.error}>Ошибка: {(error as any)?.status ?? '—'}</div>}
            {!isLoading && !isError && (
              <div className={s.events__cards} data-type="monthly">
                {(byType['monthly'] ?? []).map((it) => (
                  <EventsCard key={`mo-${it.id}`} title={it.title} reward={it.reward} />
                ))}
              </div>
            )}
          </TabPanel>

          {/* Годовые / Квартальные */}
          <TabPanel className={s.tabPanel}>
            {isLoading && <div className={s.skeleton}>Загрузка…</div>}
            {isError && <div className={s.error}>Ошибка: {(error as any)?.status ?? '—'}</div>}
            {!isLoading && !isError && (
              <div className={s.events__cards} data-type="annual">
                {(byType['annual'] ?? []).map((it) => (
                  <EventsCard key={`an-${it.id}`} title={it.title} reward={it.reward} />
                ))}
              </div>
            )}
          </TabPanel>
        </Tabs>
      </div>
    </Section>
  );
}
