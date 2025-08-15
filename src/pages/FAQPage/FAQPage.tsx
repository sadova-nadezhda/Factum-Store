import React from 'react';

import Section from '../../components/Section';
import Title from '../../components/Title';
import Accordion from '../../components/Accordion';

import type { AccordionItem } from '../../components/Accordion/Accordion';

import s from './FAQPage.module.scss';

export default function FAQPage() {
  const faqItems: AccordionItem[] = [
    {
      title: 'Как сделать заказ?',
      content: 'Оформите заказ через сайт, добавив товары в корзину и заполнив форму доставки.'
    },
    {
      title: 'Сколько времени занимает доставка?',
      content: 'Доставка обычно занимает от 2 до 5 рабочих дней в зависимости от региона.'
    },
    {
      title: 'Можно ли вернуть товар?',
      content: 'Да, в течение 14 дней при сохранении товарного вида и упаковки.'
    }
  ];
  return (
    <Section className={`${s.faq} section-pad section-hidden`}>
      <div className={s.faq__container}>
        <Title>FAQ</Title>
        <Accordion items={faqItems} />
      </div>
    </Section>
  )
}
