import { useState, useEffect } from 'react';
import styles from './ShowcaseSection.module.css';
import { ItemCard } from '../../../../components/ui/ItemCard/ItemCard';
import { SkeletonItemCard } from '../../../../components/ui/ItemCard/SkeletonItemCard';
import { Button } from '../../../../components/ui/Button/Button';
import { fetchShowcaseItems, type ShowcaseItem } from '../../../../services/items.service';
import { useNavigate } from 'react-router-dom';

export const ShowcaseSection = () => {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    
    fetchShowcaseItems()
      .then((data) => {
        if (isMounted) {
          setItems(data.slice(0, 4)); // Shows only top 4 for the showcase
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
  }, []);

  return (
    <section className={styles.showcaseSection} id="vitrine">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Últimos Itens Disponíveis</h2>
          <p className={styles.subtitle}>Encontre o que você precisa ou passe adiante o que não usa mais.</p>
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
              <p>Nenhum item disponível no momento.</p>
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
