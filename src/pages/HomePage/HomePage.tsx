import React from 'react';
import { Link } from 'react-router-dom';

import Section from '../../components/Section';
import Title from '../../components/Title';
import Accordion from '../../components/Accordion';

import { CatalogCard } from '../../components/Card';
import type { AccordionItem } from '../../components/Accordion/Accordion';

import s from './HomePage.module.scss';

export default function HomePage() {
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
    <>
      <Section className={`${s.hero} section-hidden`}>
        <div className={s.hero__container}>
          <img src="/assets/img/hero-img.png" alt="" />
          <Title className={s.hero__title}><strong>factum</strong>.merch</Title>
          <div className={s.hero__desc}>
            <p>С учётом сложившейся международной обстановки, перспективное планирование предоставляет широкие возможности для вывода текущих активов.</p>
          </div>
        </div>
      </Section>
      <Section className={`${s.catalog} section-pad section-hidden`}>
        <div className={s.catalog__container}>
          <div className={`${s.catalog__top} ${s.heading}`}>
            <Title component='h2'>каталог</Title>
            <Link className={s.catalog__link} to='/catalog'>смотреть все</Link>
          </div>
          <div className={s.catalog__cards}>
            <CatalogCard
              img='/assets/img/product-1.png'
              title='Футболка'
              desc='Простая белая футболка'
              price={150}
              amount={10}
            />
            <CatalogCard
              img='/assets/img/product-2.png'
              title='Кружка'
              desc='Керамическая кружка с логотипом компании'
              price={50}
              amount={5}
            />
            <CatalogCard
              img='/assets/img/product-3.png'
              title='Бейсболка'
              desc='Бейсболка с эмблемой компании'
              price={100}
              amount={5}
            />
            <CatalogCard
              img='/assets/img/product-4.png'
              title='Блокнот'
              desc='Блокнот с логотипом компании'
              price={100}
              amount={0}
            />
          </div>
        </div>
      </Section>
      <Section id="faq" className={`${s.faq} section-pad-bottom section-hidden`}>
        <div className={s.faq__container}>
          <Title component='h2' className={s.heading}>faq</Title>
          <Accordion className={s.faq__accordion} items={faqItems} />
        </div>
      </Section>
    </>
  )
}
