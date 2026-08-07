import { useState, useEffect } from 'react';
import styles from './ShowcaseSection.module.css';
import { ItemCard } from '../../../../components/ui/ItemCard/ItemCard';
import { SkeletonItemCard } from '../../../../components/ui/ItemCard/SkeletonItemCard';
import { Button } from '../../../../components/ui/Button/Button';
import { fetchShowcaseItems, type ShowcaseItem } from '../../../../services/items.service';
import { ItemCategory } from '../../../../types/items.types';
import { useNavigate } from 'react-router-dom';

type FilterCategory = ItemCategory | 'all';

const categoryLabels: Record<ItemCategory, string> = {
  [ItemCategory.BOOKS]: 'Livros',
  [ItemCategory.ELECTRONICS]: 'Eletrônicos',
  [ItemCategory.SCHOOL_SUPPLIES]: 'Material Escolar',
  [ItemCategory.CLOTHING]: 'Vestuário',
  [ItemCategory.SPORTS]: 'Esportes',
  [ItemCategory.FURNITURE]: 'Móveis',
  [ItemCategory.OTHER]: 'Outros',
};

export const ShowcaseSection = () => {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const categories = categoryFilter !== 'all' ? [categoryFilter as ItemCategory] : undefined;

    fetchShowcaseItems(categories)
      .then((data) => {
        if (isMounted) {
          setItems(data.slice(0, 4));
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setError('Não foi possível carregar os itens no momento.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [categoryFilter]);

  return (
    <section className={styles.showcaseSection} id="vitrine">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Últimos Itens Disponíveis</h2>
          <p className={styles.subtitle}>Encontre o que você precisa ou passe adiante o que não usa mais.</p>
        </div>

        <div className={styles.categoryFilters}>
          <button
            className={`${styles.categoryPill} ${categoryFilter === 'all' ? styles.categoryPillActive : ''}`}
            onClick={() => setCategoryFilter('all')}
          >
            Todos
          </button>
          {(Object.entries(categoryLabels) as [ItemCategory, string][]).map(([value, label]) => (
            <button
              key={value}
              className={`${styles.categoryPill} ${categoryFilter === value ? styles.categoryPillActive : ''}`}
              onClick={() => setCategoryFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <SkeletonItemCard key={`skeleton-${i}`} />
            ))
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>{error}</p>
              <Button variant="secondary" onClick={() => window.location.reload()}>Tentar Novamente</Button>
            </div>
          ) : items.length === 0 ? (
            <div className={styles.emptyContainer}>
              <p>Nenhum item disponível nesta categoria no momento.</p>
            </div>
          ) : (
            items.map((item) => (
              <ItemCard
                key={item.id}
                title={item.title}
                category={item.category}
                status={item.status}
                imageUrl={item.imageUrl}
              />
            ))
          )}
        </div>

        <div className={styles.actionContainer}>
          <Button variant="secondary" onClick={() => navigate('/feed')}>Ver Todos os Itens</Button>
        </div>
      </div>
    </section>
  );
};
