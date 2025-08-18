import React from 'react';
import classNames from 'classnames';

import Section from '../../components/Section';
import Title from '../../components/Title';

import { CatalogCard } from '../../components/Card';

import s from './CatalogPage.module.scss';

export default function CatalogPage() {
  return (
    <Section className={`${s.catalog} section-pad section-hidden`}>
      <div className={s.catalog__container}>
        <div className={s.catalog__top}>
          <Title className={s.heading}>каталог</Title>
          <form className={s.catalog__filter}>
            <input className='search' type="search" name="search" placeholder='Поиск' />
            <select className='filter' name="filter">
              <option value="">Сортировка</option>
              <option value="">По возврастанию</option>
              <option value="">По убыванию</option>
            </select>
          </form>
        </div>
        <div className={s.catalog__wrap}>
          <div className={s.catalog__row}>
            <Title component='h2' className={classNames(s.heading, s.catalog__caption)}>футболки</Title>
            <div className={s.catalog__cards}>
              <CatalogCard
                img='/assets/img/product-1.png'
                title='Футболка'
                desc='Простая белая футболка'
                price={150}
                amount={10}
              />
              <CatalogCard
                img='/assets/img/product-1.png'
                title='Футболка'
                desc='Простая белая футболка'
                price={150}
                amount={10}
              />
              <CatalogCard
                img='/assets/img/product-1.png'
                title='Футболка'
                desc='Простая белая футболка'
                price={150}
                amount={10}
              />
              <CatalogCard
                img='/assets/img/product-1.png'
                title='Футболка'
                desc='Простая белая футболка'
                price={150}
                amount={10}
              />
            </div>
          </div>
          <div className={s.catalog__row}>
            <Title component='h2' className={classNames(s.heading, s.catalog__caption)}>бейсболки</Title>
            <div className={s.catalog__cards}>
              <CatalogCard
                img='/assets/img/product-3.png'
                title='Бейсболка'
                desc='Бейсболка с эмблемой компании'
                price={100}
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
                img='/assets/img/product-3.png'
                title='Бейсболка'
                desc='Бейсболка с эмблемой компании'
                price={100}
                amount={5}
              />
              <CatalogCard
                img='/assets/img/product-3.png'
                title='Бейсболка'
                desc='Бейсболка с эмблемой компании'
                price={100}
                amount={5}
              />
            </div>
          </div>
          <div className={s.catalog__row}>
            <Title component='h2' className={classNames(s.heading, s.catalog__caption)}>канцелярия</Title>
            <div className={s.catalog__cards}>
              <CatalogCard
                img='/assets/img/product-2.png'
                title='Кружка'
                desc='Керамическая кружка с логотипом компании'
                price={50}
                amount={5}
              />
              <CatalogCard
                img='/assets/img/product-2.png'
                title='Кружка'
                desc='Керамическая кружка с логотипом компании'
                price={50}
                amount={5}
              />
              <CatalogCard
                img='/assets/img/product-2.png'
                title='Кружка'
                desc='Керамическая кружка с логотипом компании'
                price={50}
                amount={5}
              />
              <CatalogCard
                img='/assets/img/product-2.png'
                title='Кружка'
                desc='Керамическая кружка с логотипом компании'
                price={50}
                amount={5}
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
