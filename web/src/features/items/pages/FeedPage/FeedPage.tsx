import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FeedPage.module.css";
import { Button } from "../../../../components/ui/Button/Button";
import { Toast } from "../../../../components/ui/Toast/Toast";
import {
  ItemCard,
  type ItemStatus as UIItemStatus,
} from "../../../../components/ui/ItemCard/ItemCard";
import { getAllItems, reserveItem } from "../../../../services/items.service";
import { useAuth } from "../../../../hooks/useAuth";
import { Modal } from "../../../../components/ui/Modal/Modal";
import {
  type Item,
  ItemType,
  ItemCondition,
  ItemStatus,
} from "../../../../types/items.types";

type FilterType = "all" | "sale" | "donation";

export function FeedPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  const [filter, setFilter] = useState<FilterType>("all");

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllItems();
      setItems(data);
    } catch (err) {
      console.error("Erro ao buscar os itens do feed:", err);
      setError(
        "Ocorreu um erro ao carregar os itens disponíveis. Tente novamente mais tarde.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleBuyOrReserve = async (item: Item) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      // Chama a nova rota dedicada de reserva
      await reserveItem(item.id);
      
      // Atualiza o estado local para refletir a mudança imediatamente
      setItems(prevItems => 
        prevItems.map(i => i.id === item.id ? { ...i, status: ItemStatus.RESERVED } : i)
      );

      const actionText = item.type === ItemType.DONATION ? "reservado" : "comprado (simulação)";
      setToastMessage({
        text: `Item ${actionText} com sucesso!`,
        type: "success"
      });
    } catch (err) {
      console.error("Erro ao reservar item:", err);
      setToastMessage({
        text: "Não foi possível concluir a ação. Tente novamente.",
        type: "error"
      });
    }
  };

  const mapItemToUI = (item: Item) => {
    let mappedStatus: UIItemStatus = "Usado";
    let mappedCategory = item.type === ItemType.DONATION ? "Doação" : "Venda";

    if (item.status === ItemStatus.RESERVED) {
      mappedStatus = "Reservado";
    } else if (item.type === ItemType.DONATION) {
      mappedStatus = "Doado";
    } else {
      mappedStatus = item.condition === ItemCondition.NEW ? "Novo" : "Usado";
    }

    // Determine the Buy Action state
    let isBuyDisabled = false;
    let buyLabel = "Comprar";

    if (!user) {
      buyLabel = "Entrar para Comprar";
    } else if (item.owner === user.id) {
      isBuyDisabled = true;
      buyLabel = "Seu Item";
    } else if (item.status === ItemStatus.RESERVED || item.status === ItemStatus.SELLED) {
      isBuyDisabled = true;
      buyLabel = "Indisponível";
    } else if (item.type === ItemType.DONATION) {
      buyLabel = "Reservar";
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
      originalItem: item
    };
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filter === "sale") return item.type === ItemType.SALE;
      if (filter === "donation") return item.type === ItemType.DONATION;
      return true; // "all"
    });
  }, [items, filter]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={`${styles.loading} glass`}>
          <p>Carregando itens disponíveis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={`${styles.error} glass`}>
          <p>{error}</p>
          <Button
            variant="primary"
            onClick={fetchItems}
            style={{ marginTop: "1rem" }}
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Toast notification */}
      {toastMessage && (
        <Toast
          message={toastMessage.text}
          variant={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      <header className={styles.header}>
        <h2>Marketplace</h2>
        <p className={styles.subtitle}>Encontre materiais e equipamentos da comunidade acadêmica.</p>
      </header>

      <div className={styles.filters}>
        <button
          className={`${styles.filterPill} ${filter === "all" ? styles.filterPillActive : ""}`}
          onClick={() => setFilter("all")}
        >
          Todos os Itens
        </button>
        <button
          className={`${styles.filterPill} ${filter === "sale" ? styles.filterPillActive : ""}`}
          onClick={() => setFilter("sale")}
        >
          À Venda
        </button>
        <button
          className={`${styles.filterPill} ${filter === "donation" ? styles.filterPillActive : ""}`}
          onClick={() => setFilter("donation")}
        >
          Para Doação
        </button>
      </div>

      <p className={styles.itemCount}>
        Mostrando {filteredItems.length} {filteredItems.length === 1 ? "item" : "itens"}
      </p>

      {filteredItems.length === 0 ? (
        <div className={`${styles.empty} glass`}>
          <h3>Nenhum item encontrado</h3>
          <p>
            Não há itens disponíveis para esta categoria no momento. 
            Volte mais tarde ou tente outro filtro.
          </p>
          {filter !== "all" && (
             <Button variant="primary" onClick={() => setFilter("all")}>
                Ver Todos os Itens
             </Button>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredItems.map((item) => {
            const uiProps = mapItemToUI(item);
            return (
              <ItemCard
                key={uiProps.id}
                title={uiProps.title}
                category={uiProps.category}
                status={uiProps.status}
                imageUrl={uiProps.imageUrl}
                price={uiProps.price}
                description={uiProps.originalItem.description}
                onDetailsClick={() => setSelectedItem(uiProps.originalItem)}
                onBuyClick={() => handleBuyOrReserve(uiProps.originalItem)}
                isBuyDisabled={uiProps.isBuyDisabled}
                buyLabel={uiProps.buyLabel}
              />
            );
          })}
        </div>
      )}

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
          {selectedItem.imageUrl && (
            <img 
              src={selectedItem.imageUrl} 
              alt={selectedItem.name} 
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
            />
          )}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ padding: '0.25rem 0.5rem', background: 'var(--color-primary-light)', color: 'white', borderRadius: '4px', fontSize: '0.875rem' }}>
              {selectedItem.type === ItemType.SALE ? 'À Venda' : 'Para Doação'}
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
            {selectedItem.description || "Nenhuma descrição fornecida."}
          </p>
        </Modal>
      )}
    </div>
  );
}
