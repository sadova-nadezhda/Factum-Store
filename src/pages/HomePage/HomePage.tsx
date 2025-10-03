import React from 'react';
import { Link } from 'react-router-dom';

import Section from '../../components/Section';
import Title from '../../components/Title';
import Accordion from '../../components/Accordion';

import { CatalogCard } from '../../components/Card';

import { useGetProductsQuery } from '../../features/catalog/catalogAPI';
import { useGetFaqQuery } from '../../features/faq/faqAPI';

import s from './HomePage.module.scss';

export default function HomePage() {
  const {
    data: catalog,
    isLoading: catalogLoading,
    isError: catalogError,
  } = useGetProductsQuery({ q: '', sort: 'price_asc' });

  const { data: faq = [], isLoading: faqLoading, isError: faqError } = useGetFaqQuery();

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

          {catalogLoading && <div className={s.catalog__state}>Загрузка...</div>}
          {catalogError && <div className={s.catalog__state}>Ошибка загрузки каталога</div>}

          <div className={s.catalog__cards}>
            {catalog?.map(p => (
              <CatalogCard
                key={p.id}
                id={p.id}
                img={p.image && p.image.trim() !== '' ? p.image : '/assets/img/product.jpg'}
                title={p.name}
                desc={p.description}
                price={p.price}
                amount={p.stock}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section id="faq" className={`${s.faq} section-pad-bottom section-hidden`}>
        <div className={s.faq__container}>
          <Title component='h2' className={s.heading}>faq</Title>

          {faqLoading && <div>Загрузка...</div>}
          {faqError && <div>Ошибка загрузки FAQ</div>}

          {faq.length > 0 && (
            <Accordion
              className={s.faq__accordion}
              items={faq.map(item => ({
                title: item.question,
                content: item.answer,
              }))}
            />
          )}
        </div>
      </Section>
    </>
  );
}
