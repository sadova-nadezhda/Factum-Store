import React, { useDeferredValue, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import Section from '../../components/Section';
import { CatalogCard } from '../../components/Card';

import { useGetProductsQuery } from '../../features/catalog/catalogAPI';
import { useGetMyWalletsQuery } from '@/features/wallets/walletsAPI';

import s from './CatalogPage.module.scss';

const safeImg = (img?: string | null) => (img?.trim() ? img : '/assets/img/product.jpg');

const normalizeCategory = (product: { category?: string | null; category_name?: string | null }) =>
  (product.category || product.category_name || '').trim();

type SortValue = 'default' | 'price_asc' | 'price_desc' | 'title_asc';

function getFilterId(category: string) {
  return category.toLowerCase().replace(/\s+/g, '-');
}

export default function CatalogPage() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortValue>('default');
  const [activeFilter, setActiveFilter] = useState('all');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const { data: catalog = [], isLoading, isError, isFetching } = useGetProductsQuery();

  const { data: walletsData } = useGetMyWalletsQuery();

  const balance = useMemo(() => {
    const wallets = walletsData?.wallets ?? [];
    const main = wallets.find((wallet) => wallet.type === 'main');
    if (main) return Number(main.balance) || 0;
    return wallets.reduce((acc, wallet) => acc + (Number(wallet.balance) || 0), 0);
  }, [walletsData?.wallets]);

  const filters = useMemo(() => {
    const categories = Array.from(
      new Set(
        catalog
          .map((item) => normalizeCategory(item))
          .filter((category): category is string => Boolean(category))
      )
    );

    return [
      { id: 'all', label: 'Все' },
      { id: 'available', label: 'Доступно мне' },
      ...categories.map((category) => ({
        id: getFilterId(category),
        label: category,
      })),
    ];
  }, [catalog]);

  const visibleProducts = useMemo(() => {
    const filtered = catalog.filter((product) => {
      if (Number(product.stock) <= 0) return false;

      const matchesQuery =
        !deferredQuery ||
        product.name.toLowerCase().includes(deferredQuery) ||
        product.description.toLowerCase().includes(deferredQuery);

      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'available' && product.price <= balance) ||
        getFilterId(normalizeCategory(product)) === activeFilter;

      return matchesQuery && matchesFilter;
    });

    switch (sort) {
      case 'price_asc':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return filtered.sort((a, b) => b.price - a.price);
      case 'title_asc':
        return filtered.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
      default:
        return filtered;
    }
  }, [activeFilter, balance, catalog, deferredQuery, sort]);

  return (
    <Section className={s.catalogPage}>
      <div className={s.catalogPage__intro}>
        <div className={s.catalogPage__heading}>
          <h1>Каталог</h1>
          <p>{visibleProducts.length} позиций</p>
        </div>

        <label className={s.catalogPage__search} htmlFor="catalog-page-search">
          <span className={s.catalogPage__searchIcon} aria-hidden="true">
            <Search size={18} strokeWidth={2.1} />
          </span>
          <input
            id="catalog-page-search"
            type="search"
            placeholder="Найти в factum merch"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </label>

        <div className={s.catalogPage__toolbar}>
          <div className={s.catalogPage__filters} role="toolbar" aria-label="Фильтры каталога">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`${s.catalogPage__filter} ${activeFilter === filter.id ? s.isActive : ''}`}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                aria-pressed={activeFilter === filter.id}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <label className={s.catalogPage__sort} htmlFor="catalog-page-sort">
            <span>Сортировка</span>
            <select
              id="catalog-page-sort"
              name="catalog-page-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortValue)}
              aria-label="Сортировка каталога"
            >
              <option value="default">По умолчанию</option>
              <option value="price_asc">Цена: по возрастанию</option>
              <option value="price_desc">Цена: по убыванию</option>
              <option value="title_asc">По названию</option>
            </select>
          </label>
        </div>
      </div>

      {!catalog.length && (isLoading || isFetching) && (
        <div className={s.catalogPage__state}>Загрузка...</div>
      )}
      {isError && <div className={s.catalogPage__state}>Ошибка загрузки каталога</div>}

      {!!catalog.length && !isError && (
        <div className={s.catalogPage__grid} aria-live="polite">
          {visibleProducts.length ? (
            visibleProducts.map((product) => (
              <CatalogCard
                key={product.id}
                id={product.id}
                image={safeImg(product.image)}
                name={product.name}
                description={product.description}
                price={product.price}
                stock={product.stock ?? 0}
                category={normalizeCategory(product) || null}
                isAuth
              />
            ))
          ) : (
            <div className={s.catalogPage__empty}>
              <h2>Ничего не найдено</h2>
              <p>Попробуйте сменить фильтр или уточнить поисковый запрос.</p>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
