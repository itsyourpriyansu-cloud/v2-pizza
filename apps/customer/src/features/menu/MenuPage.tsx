import { getMenu } from '@pizza-avenue/api-client';
import { queryKeys } from '@pizza-avenue/utils';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Badge, ErrorState, PageHeader, PageSkeleton } from '../../shared/components/Primitives';
import { usePrototypeStore } from '../../shared/state/prototype-store';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';
import { CategoryTabs } from './components/CategoryTabs';
import { ProductCard } from './components/ProductCard';

export function MenuPage() {
  useScenarioFromUrl();
  const scenarioState = usePrototypeStore((state) => state.scenarioState);
  const selectScenario = usePrototypeStore((state) => state.selectScenario);
  const serviceMode = usePrototypeStore((state) => state.serviceContext?.mode ?? 'PICKUP');
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryId, setCategoryId] = useState(searchParams.get('category') ?? 'all');
  const menuQuery = useQuery({
    queryKey: queryKeys.menu('sainikpuri'),
    queryFn: () => getMenu('sainikpuri'),
  });

  useEffect(() => {
    trackCustomerEvent(serviceMode === 'DINE_IN' ? 'dine_in_menu_opened' : 'menu_viewed', { serviceMode });
  }, [serviceMode]);

  const products = useMemo(
    () => menuQuery.data?.products.filter((product) => categoryId === 'all' || product.categoryId === categoryId) ?? [],
    [categoryId, menuQuery.data],
  );

  function selectCategory(nextCategoryId: string) {
    setCategoryId(nextCategoryId);
    if (nextCategoryId !== 'all') trackCustomerEvent('category_viewed', { categoryId: nextCategoryId });
  }

  async function retryMenu() {
    if (scenarioState.menu === 'MENU_NETWORK_ERROR') {
      selectScenario('NORMAL_MENU');
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.delete('scenario');
      setSearchParams(nextSearchParams, { replace: true });
    }
    await menuQuery.refetch();
  }

  if (menuQuery.isPending) return <PageSkeleton label="menu" />;
  if (menuQuery.isError) {
    return <ErrorState title="The menu is taking a breather" body="We couldn't load the latest availability. Try again before choosing an item." onRetry={() => void retryMenu()} />;
  }

  const storePaused = scenarioState.store === 'STORE_PAUSED' || scenarioState.store === 'STORE_CLOSED';

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow={serviceMode === 'DINE_IN' ? 'Dine in · Table 12' : 'Sainikpuri pickup'}
        title="Menu"
        description="Choose a favourite or build your pizza your way. Availability is updated as you browse."
      />
      {storePaused ? (
        <div className="availability-banner" role="status">
          <div>
            <strong>{scenarioState.store === 'STORE_CLOSED' ? 'Pickup is closed right now' : 'New pickup orders are paused'}</strong>
            <p>Browse the menu now and check back before placing an order.</p>
          </div>
          <Badge tone="warning">Browse only</Badge>
        </div>
      ) : null}
      <Link className="search-entry" to={serviceMode === 'DINE_IN' ? '/dine-in/search' : '/search'}>
        <span aria-hidden="true">⌕</span>
        <span>Search pizzas, pastas, sides and more</span>
      </Link>
      <CategoryTabs categories={menuQuery.data.categories} selectedId={categoryId} onSelect={selectCategory} />
      <section className="product-grid" aria-label={categoryId === 'all' ? 'All menu items' : 'Filtered menu items'}>
        {products.map((product) => <ProductCard key={product.id} product={product} href={`${serviceMode === 'DINE_IN' ? '/dine-in/menu' : '/menu'}/${product.id}`} />)}
      </section>
    </div>
  );
}
