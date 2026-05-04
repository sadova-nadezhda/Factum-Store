import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Section from '../../components/Section';
import Accordion from '../../components/Accordion';
import { CatalogCard } from '../../components/Card';

import { useGetProductsQuery } from '../../features/catalog/catalogAPI';
import { useGetFaqQuery } from '../../features/faq/faqAPI';

import s from './HomePage.module.scss';

const safeImg = (img?: string | null) => (img?.trim() ? img : '/assets/img/product.jpg');
const heroSlides = [
  '/assets/img/Слайд 1.png',
  '/assets/img/Слайд 2.png',
  '/assets/img/Слайд 3.png',
] as const;

export default function HomePage() {
  const location = useLocation();
  const [activeSlide, setActiveSlide] = useState(0);
  const [sort, setSort] = useState<'default' | 'price_asc' | 'price_desc' | 'title_asc'>('default');

  const { data: products = [], isLoading: catalogLoading, isError: catalogError } = useGetProductsQuery();
  const { data: faq = [], isLoading: faqLoading, isError: faqError } = useGetFaqQuery();

  useEffect(() => {
    if (!catalogLoading && location.hash === '#faq') {
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [catalogLoading]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4800);

    return () => window.clearInterval(timer);
  }, []);

  const sortedProducts = useMemo(() => {
    const items = [...products];

    switch (sort) {
      case 'price_asc':
        return items.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return items.sort((a, b) => b.price - a.price);
      case 'title_asc':
        return items.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
      default:
        return items;
    }
  }, [products, sort]);

  const availableProducts = useMemo(
    () => sortedProducts.filter((product) => Number(product.stock) > 0),
    [sortedProducts],
  );

  const previewProducts = availableProducts.slice(0, 6);

  return (
    <>
      <Section className={s.heroSection}>
        <div className={s.heroBanner} aria-labelledby="hero-title">
          <div className={s.heroSlider} aria-hidden="true">
            {heroSlides.map((slide, index) => (
              <div
                key={slide}
                className={`${s.heroSlide} ${index === activeSlide ? s.heroSlideActive : ''}`}
              >
                <img className={s.heroSlideImage} src={slide} alt="" />
              </div>
            ))}
          </div>

          <p className={s.heroBrand}>
            <img src="/assets/img/icon/factum.coins.svg" alt="Factum coins" />
          </p>

          <div className={s.heroCopy}>
            <h1 id="hero-title">Прокачивай корпоративный уровень и получай бонусы</h1>
            <Link className={s.heroCta} to="/catalog">
              Исследовать товары
            </Link>
          </div>

          <div className={s.heroPagination} aria-label="Переключение слайдов баннера">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`${s.heroDot} ${index === activeSlide ? s.heroDotActive : ''}`}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Показать слайд ${index + 1}`}
                aria-pressed={index === activeSlide}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section className={s.catalogSection}>
        <div className={s.sectionHeading}>
          <h2 id="catalog-title">Каталог</h2>
          <Link className={s.catalogLink} to="/catalog">
            Смотреть все
          </Link>
        </div>

        {catalogLoading && <div className={s.catalogState}>Загрузка...</div>}
        {catalogError && <div className={s.catalogState}>Ошибка загрузки каталога</div>}

        {!catalogLoading && !catalogError && (
          <div className={s.catalogGrid}>
            {previewProducts.map((product) => (
              <CatalogCard
                key={product.id}
                id={product.id}
                image={safeImg(product.image)}
                name={product.name}
                description={product.description}
                price={product.price}
                stock={product.stock}
                category={product.category ?? null}
                isAuth
              />
            ))}
          </div>
        )}
      </Section>

      <Section id="faq" className={s.faqSection}>
        <h2 id="faq-title" className={s.faqTitle}>
          Часто задаваемые вопросы
        </h2>

        {faqLoading && <div className={s.faqState}>Загрузка...</div>}
        {faqError && <div className={s.faqState}>Ошибка загрузки FAQ</div>}

        {faq.length > 0 && (
          <Accordion
            className={s.faqList}
            items={faq.map((item) => ({
              title: item.question,
              content: item.answer,
            }))}
          />
        )}
      </Section>
    </>
  );
}
