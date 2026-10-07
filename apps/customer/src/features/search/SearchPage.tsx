import { getMenu } from '@pizza-avenue/api-client';
import { queryKeys } from '@pizza-avenue/utils';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Button, EmptyState, ErrorState, PageHeader, PageSkeleton, SectionHeader } from '../../shared/components/Primitives';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';
import { ProductCard } from '../menu/components/ProductCard';

const recentSearches = ['Margherita', 'Garlic bread'];
const popularSearches = ['Signature pizza', 'Pasta', 'Dessert'];

export function SearchPage() {
  useScenarioFromUrl();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';
  const [draft, setDraft] = useState(query);
  const menuQuery = useQuery({
    queryKey: queryKeys.menu('sainikpuri'),
    queryFn: () => getMenu('sainikpuri'),
  });
  const results = useMemo(() => {
    const needle = query.toLocaleLowerCase();
    if (!needle || !menuQuery.data) return [];
    return menuQuery.data.products.filter((product) =>
      [product.name, product.description, ...product.dietaryTags, ...product.flags]
        .join(' ')
        .toLocaleLowerCase()
        .includes(needle),
    );
  }, [menuQuery.data, query]);

  function runSearch(nextQuery: string) {
    const value = nextQuery.trim();
    setDraft(value);
    setSearchParams(value ? { q: value } : {});
    if (value) {
      const resultCount = menuQuery.data?.products.filter((product) =>
        [product.name, product.description, ...product.dietaryTags, ...product.flags]
          .join(' ')
          .toLocaleLowerCase()
          .includes(value.toLocaleLowerCase()),
      ).length ?? null;
      trackCustomerEvent('search_used', { query: value, resultCount });
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    runSearch(draft);
  }

  if (menuQuery.isPending) return <PageSkeleton label="search" />;
  if (menuQuery.isError) return <ErrorState title="Search is unavailable" body="The menu could not be reached. Try again in a moment." onRetry={() => void menuQuery.refetch()} />;

  return (
    <div className="page-stack">
      <PageHeader eyebrow="Find a favourite" title="Search" description="Search the live pickup menu." />
      <form className="search-form" role="search" onSubmit={submit}>
        <label className="sr-only" htmlFor="menu-search">Search menu</label>
        <input id="menu-search" className="input" type="search" autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Try ‘Margherita’" />
        <Button type="submit">Search</Button>
      </form>
      {!query ? (
        <>
          <section className="page-stack" aria-labelledby="recent-searches-title">
            <SectionHeader id="recent-searches-title" title="Recent searches" />
            <div className="chip-list">
              {recentSearches.map((item) => <button className="chip" key={item} type="button" onClick={() => runSearch(item)}>{item}</button>)}
            </div>
          </section>
          <section className="page-stack" aria-labelledby="popular-searches-title">
            <SectionHeader id="popular-searches-title" title="Popular now" />
            <div className="chip-list">
              {popularSearches.map((item) => <button className="chip" key={item} type="button" onClick={() => runSearch(item)}>{item}</button>)}
            </div>
          </section>
        </>
      ) : results.length ? (
        <section className="page-stack" aria-live="polite">
          <SectionHeader title={`${results.length} result${results.length === 1 ? '' : 's'} for “${query}”`} />
          <div className="product-grid">{results.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </section>
      ) : (
        <EmptyState title={`No match for “${query}”`} body="Try a broader search, or browse every item on the menu." action={<Button type="button" variant="secondary" onClick={() => runSearch('')}>Clear search</Button>} />
      )}
    </div>
  );
}
