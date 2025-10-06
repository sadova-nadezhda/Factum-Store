import React, { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';

import Section from '../../components/Section';
import Title from '../../components/Title';
import { CatalogCard } from '../../components/Card';

import { useGetProductsQuery } from '../../features/catalog/catalogAPI';

import s from './CatalogPage.module.scss';


function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function CatalogPage() {
  const [qInput, setQInput] = useState('');
  const [sort, setSort] = useState<'' | 'price_asc' | 'price_desc'>('');
  const q = useDebounce(qInput, 400);

  const { data: catalog = [], isLoading, isError, isFetching } = useGetProductsQuery({
    q,
    sort: sort || 'price_asc',
  });

  const { grouped, distinctCategories } = useMemo(() => {
    const groups: Record<string, typeof catalog> = {};
    const categories = new Set<string>();

    for (const item of catalog) {
      const raw = (item.category ?? '').trim();
      const key = raw || 'Без категории';
      if (raw) categories.add(raw);
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }

    return { grouped: groups, distinctCategories: Array.from(categories) };
  }, [catalog]);

  const hasCategories = distinctCategories.length > 0;

  const safeImg = (img?: string | null) => (img && img.trim() !== '' ? img : '/assets/img/product.jpg');

  return (
    <Section className={`${s.catalog} section-pad section-hidden`}>
      <div className={s.catalog__container}>
        <div className={s.catalog__top}>
          <Title className={s.heading}>каталог</Title>

          <form className={s.catalog__filter} onSubmit={(e) => e.preventDefault()}>
            <input
              className='search'
              type='search'
              name='search'
              placeholder='Поиск'
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
            />
            <select
              className='filter'
              name='filter'
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value=''>Сортировка</option>
              <option value='price_asc'>По возрастанию</option>
              <option value='price_desc'>По убыванию</option>
            </select>
          </form>
        </div>

        {(isLoading || isFetching) && <div className={s.catalog__state}>Загрузка…</div>}
        {isError && <div className={s.catalog__state}>Ошибка загрузки каталога</div>}

        {!isLoading && !isError && (
          <div className={s.catalog__wrap}>
            {hasCategories ? (
              Object.entries(grouped).map(([category, items]) => (
                <div key={category} className={s.catalog__row}>
                  <Title component='h2' className={classNames(s.heading, s.catalog__caption)}>
                    {category}
                  </Title>
                  <div className={s.catalog__cards}>
                    {items.map((p) => (
                      <CatalogCard
                        key={p.id}
                        id={p.id}
                        image={safeImg(p.image)}
                        name={p.name}
                        description={p.description}
                        price={p.price}
                        stock={p.stock ?? 0}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className={s.catalog__row}>
                <div className={s.catalog__cards}>
                  {catalog.map((p) => (
                    <CatalogCard
                      key={p.id}
                      id={p.id}
                      image={safeImg(p.image)}
                      name={p.name}
                      description={p.description}
                      price={p.price}
                      stock={p.stock ?? 0}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}