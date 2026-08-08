import { useState, useEffect } from 'react';
import styles from './ShowcaseSection.module.css';
import {
  ItemCard,
  type ItemStatus as UIItemStatus,
} from '../../../../components/ui/ItemCard/ItemCard';
import { SkeletonItemCard } from '../../../../components/ui/ItemCard/SkeletonItemCard';
import { Button } from '../../../../components/ui/Button/Button';
import { Toast } from '../../../../components/ui/Toast/Toast';
import { getAllItems, getItemById, createOrder } from '../../../../services/items.service';
import {
  ItemCategory,
  ItemType,
  ItemCondition,
  ItemStatus,
  type Item,
} from '../../../../types/items.types';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../../components/ui/Modal/Modal';
import { useAuth } from '../../../../hooks/useAuth';

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
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const category = categoryFilter !== 'all' ? (categoryFilter as ItemCategory) : undefined;

    getAllItems(category, 1, 8)
      .then((result) => {
        if (isMounted) {
          setItems(result.data);
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

  const handleDetailsClick = async (id: string) => {
    try {
      const fetchedItem = await getItemById(id);
      setSelectedItem(fetchedItem);
    } catch (err) {
      console.error('Erro ao buscar detalhes do item:', err);
      alert('Não foi possível carregar os dados do item.');
    }
  };

  const handleBuyOrReserve = async (item: Item) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await createOrder(item.id);

      setItems(prevItems =>
        prevItems.map(i => i.id === item.id ? { ...i, status: ItemStatus.RESERVED } : i)
      );

      const actionText = item.type === ItemType.DONATION ? 'reservado' : 'comprado (simulação)';
      setToastMessage({
        text: `Item ${actionText} com sucesso!`,
        type: 'success'
      });
    } catch (err) {
      console.error('Erro ao reservar item:', err);
      setToastMessage({
        text: 'Não foi possível concluir a ação. Tente novamente.',
        type: 'error'
      });
    }
  };

  const mapItemToUI = (item: Item) => {
    let mappedStatus: UIItemStatus = 'Usado';
    const mappedCategory = categoryLabels[item.category] ?? item.category;

    if (item.status === ItemStatus.SELLED) {
      mappedStatus = item.type === ItemType.DONATION ? 'Doado' : 'Vendido';
    } else if (item.status === ItemStatus.RESERVED) {
      mappedStatus = 'Reservado';
    } else if (item.type === ItemType.DONATION) {
      mappedStatus = 'Doação';
    } else {
      mappedStatus = item.condition === ItemCondition.NEW ? 'Novo' : 'Usado';
    }

    let isBuyDisabled = false;
    let buyLabel = 'Comprar';

    if (!user) {
      buyLabel = 'Entrar para Comprar';
    } else if (item.owner === user.id) {
      isBuyDisabled = true;
      buyLabel = 'Seu Item';
    } else if (item.status === ItemStatus.RESERVED || item.status === ItemStatus.SELLED) {
      isBuyDisabled = true;
      buyLabel = 'Indisponível';
    } else if (item.type === ItemType.DONATION) {
      buyLabel = 'Reservar';
    }

    return {
      id: item.id,
      title: item.name,
      category: mappedCategory,
      status: mappedStatus,
      imageUrl: item.imageUrl,
      price: item.type === ItemType.SALE ? item.price : undefined,
      isBuyDisabled,
      buyLabel,
      originalItem: item,
    };
  };

  return (
    <section className={styles.showcaseSection} id="vitrine">
      {toastMessage && (
        <Toast
          message={toastMessage.text}
          variant={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

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
            items.map((item) => {
              const uiProps = mapItemToUI(item);
              return (
                <ItemCard
                  key={uiProps.id}
                  title={uiProps.title}
                  category={uiProps.category}
                  status={uiProps.status}
                  imageUrl={uiProps.imageUrl}
                  price={uiProps.price}
                  description={item.description}
                  onDetailsClick={() => handleDetailsClick(item.id)}
                  onBuyClick={() => handleBuyOrReserve(item)}
                  isBuyDisabled={uiProps.isBuyDisabled}
                  buyLabel={uiProps.buyLabel}
                />
              );
            })
          )}
        </div>

        <div className={styles.actionContainer}>
          <Button variant="secondary" onClick={() => navigate('/feed')}>Ver Todos os Itens</Button>
        </div>
      </div>

      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.name}
          footer={
            <Button
              variant="primary"
              onClick={() => {
                handleBuyOrReserve(selectedItem);
                setSelectedItem(null);
              }}
              disabled={mapItemToUI(selectedItem).isBuyDisabled}
              style={{ opacity: mapItemToUI(selectedItem).isBuyDisabled ? 0.6 : 1, cursor: mapItemToUI(selectedItem).isBuyDisabled ? 'not-allowed' : 'pointer' }}
            >
              {mapItemToUI(selectedItem).buyLabel}
            </Button>
          }
        >
          {selectedItem.imageUrl ? (
            <img
              src={selectedItem.imageUrl}
              alt={selectedItem.name}
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
            />
          ) : (
            <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
              <span>Sem imagem</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ padding: '0.25rem 0.5rem', background: 'var(--color-primary-light)', color: 'white', borderRadius: '4px', fontSize: '0.875rem' }}>
              {selectedItem.status === ItemStatus.SELLED ? 'Vendido' :
               selectedItem.status === ItemStatus.RESERVED ? 'Reservado' :
               selectedItem.type === ItemType.SALE ? 'À Venda' : 'Para Doação'}
            </span>
            <span style={{ padding: '0.25rem 0.5rem', background: 'var(--color-border)', color: 'var(--color-text)', borderRadius: '4px', fontSize: '0.875rem' }}>
              {selectedItem.condition === ItemCondition.NEW ? 'Novo' : 'Usado'}
            </span>
            {selectedItem.type === ItemType.SALE && (
              <span style={{ padding: '0.25rem 0.5rem', background: 'var(--color-surface-hover)', color: 'var(--color-text)', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedItem.price)}
              </span>
            )}
          </div>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Descrição</h4>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {selectedItem.description || 'Nenhuma descrição fornecida.'}
          </p>
        </Modal>
      )}
    </section>
  );
};

