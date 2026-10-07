import type { Category } from '@pizza-avenue/types';

export function CategoryTabs({
  categories,
  selectedId,
  onSelect,
}: {
  categories: Category[];
  selectedId: string;
  onSelect: (categoryId: string) => void;
}) {
  return (
    <div className="category-tabs" aria-label="Menu categories">
      <button
        className={`category-tab${selectedId === 'all' ? ' is-active' : ''}`}
        type="button"
        aria-pressed={selectedId === 'all'}
        onClick={() => onSelect('all')}
      >
        All
      </button>
      {categories.filter((category) => category.availability === 'AVAILABLE').map((category) => (
        <button
          className={`category-tab${selectedId === category.id ? ' is-active' : ''}`}
          key={category.id}
          type="button"
          aria-pressed={selectedId === category.id}
          onClick={() => onSelect(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
